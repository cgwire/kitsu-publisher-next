HTTPServer = require(globals.packageFolder + '/HTTP/server.js')

server = new HTTPServer.HTTPDaemon()

server.add_route('/', ['GET'], function (method, url) {
  return {
    dcc_name: 'Toon Boom Harmony',
    dcc_version: $.app.version,
    current_project: $.scene.path._path
  }
})

server.add_route('/get-cameras', ['GET'], function (method, url) {
  nodes = node.getNodes(['CAMERA'])
  nodes_str = []
  for (var n = 0; n < nodes.length; n++) {
    nodes_str.push(node.getName(nodes[n]))
  }
  return nodes_str
})

server.add_route('/set-camera', ['GET'], function (method, url) {
  throw new MissingQueryError('missing query')
})

server.add_route('/get-renderers', ['GET'], function (method, url) {
  nodes = node.getNodes(['DISPLAY'])
  nodes_str = []
  for (var n = 0; n < nodes.length; n++) {
    nodes_str.push([node.getName(nodes[n]), node.getName(nodes[n])])
  }
  return nodes_str
})

globals.getExtensions = function (isVideo) {
  return isVideo ? [['.mov', 'QUICKTIME']] : [['.png', 'PNG']]
}

server.add_route('/get-extensions', ['GET'], function (method, url) {
  return globals.getExtensions(
    ['true', '1', 'yes'].indexOf(url.queryItemValue('is_video')) >= 0
  )
})

server.add_route('/take-render-screenshot', ['GET'], function (method, url) {
  renderer = url.queryItemValue('renderer')
  if (!renderer) {
    throw new globals.HTTPExceptions.MissingQueryError(
      'Missing query argument <renderer>'
    )
  }
  extension = url.queryItemValue('extension')
  if (!extension) {
    throw new globals.HTTPExceptions.MissingQueryError(
      'Missing query argument <extension>'
    )
  }

  image_extensions = globals.getExtensions(false)
  for (var n = 0; n < image_extensions.length; n++) {
    if (image_extensions[n][1] == extension) {
      extension = image_extensions[n][0]
    }
  }

  output_path = url.queryItemValue('output_path')
  if (!output_path) {
    date = new Date()
    date =
      date.getFullYear() +
      '-' +
      date.getMonth() +
      '-' +
      date.getDay() +
      ' ' +
      date.getHours() +
      '-' +
      date.getMinutes() +
      '-' +
      date.getSeconds()
    output_path = System.getenv('TEMP') + '/harmony-' + date + extension
  }

  use_colorspace =
    ['true', '1', 'yes'].indexOf(url.queryItemValue('use_colorspace')) >= 0
  return {
    file: $.scene.exportLayoutImage(
      output_path,
      undefined,
      $.scene.currentFrame,
      use_colorspace,
      1
    )._path
  }
})

server.add_route('/take-render-animation', ['GET'], function (method, url) {
  renderer = url.queryItemValue('renderer')
  if (!renderer) {
    throw new globals.HTTPExceptions.MissingQueryError(
      'Missing query argument <renderer>'
    )
  }
  nodes = node.getNodes(['DISPLAY'])
  nodes_str = []
  for (var n = 0; n < nodes.length; n++) {
    nodes_str.push(node.getName(nodes[n]))
  }
  if (nodes_str.indexOf(renderer) === -1) {
    throw new globals.HTTPExceptions.MissingQueryError(
      "Can't create QuickTime export (" +
        output_path +
        ') because the renderer (' +
        renderer +
        ") doesn't exist"
    )
  }
  extension = url.queryItemValue('extension')
  if (!extension) {
    throw new globals.HTTPExceptions.MissingQueryError(
      'Missing query argument <extension>'
    )
  }

  video_extensions = globals.getExtensions(true)
  for (var n = 0; n < video_extensions.length; n++) {
    if (video_extensions[n][1] == extension) {
      extension = video_extensions[n][0]
    }
  }

  output_path = url.queryItemValue('output_path')
  if (!output_path) {
    date = new Date()
    date =
      date.getFullYear() +
      '-' +
      date.getMonth() +
      '-' +
      date.getDay() +
      ' ' +
      date.getHours() +
      '-' +
      date.getMinutes() +
      '-' +
      date.getSeconds()
    output_path = System.getenv('TEMP') + '/harmony-' + date + extension
  }
  output_path = new $.oFile(output_path)
  use_colorspace =
    ['true', '1', 'yes'].indexOf(url.queryItemValue('use_colorspace')) >= 0
  if ($.scene.exportQT(output_path, $.scene.defaultDisplay, 1, true, false)) {
    return { file: output_path.toString() }
  } else {
    throw new Error("Can't create QuickTime export (" + output_path + ')')
  }
})

exports.server = server
this.__proto__.server = server
