HTTPServer = require('./HTTP/server.js')
HTTPExceptions = require('./HTTP/exceptions.js')
include('./exceptions.js')
include('./openHarmony.js')

server = new HTTPServer.HTTPDaemon()

server.add_route('/', ['GET'], function (method, url) {
  return {
    Hello: 'World'
  }
})

server.add_route('/get_cameras', ['GET'], function (method, url) {
  return node.getNodes(['CAMERA'])
})

server.add_route('/set_camera', ['GET'], function (method, url) {
  throw new MissingQueryError('missing query')
})

server.add_route('/get_renderers', ['GET'], function (method, url) {
  nodes = node.getNodes(['DISPLAY'])
  nodes_str = []
  for (var n = 0; n < nodes.length; n++) {
    nodes_str.push(node.getName(nodes[n]))
  }
  return nodes_str
})

server.add_route('/get_extensions', ['GET'], function (method, url) {
  return ['true', '1', 'yes'].indexOf(url.queryItemValue('is_video')) >= 0
    ? ['.mov']
    : ['.png']
})

server.add_route('/take_render_screenshot', ['GET'], function (method, url) {
  renderer = url.queryItemValue('renderer')
  if (!renderer) {
    throw new HTTPExceptions.MissingQueryError(
      'Missing query argument <renderer>'
    )
  }
  extension = url.queryItemValue('extension')
  if (!extension) {
    throw new HTTPExceptions.MissingQueryError(
      'Missing query argument <extension>'
    )
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

server.add_route('/take_render_animation', ['GET'], function (method, url) {
  renderer = url.queryItemValue('renderer')
  if (!renderer) {
    throw new HTTPExceptions.MissingQueryError(
      'Missing query argument <renderer>'
    )
  }
  nodes = node.getNodes(['DISPLAY'])
  nodes_str = []
  for (var n = 0; n < nodes.length; n++) {
    nodes_str.push(node.getName(nodes[n]))
  }
  if (nodes_str.indexOf(renderer) === -1) {
    throw new HTTPExceptions.MissingQueryError(
      "Can't create QuickTime export (" +
        output_path +
        ') because the renderer (' +
        renderer +
        ") doesn't exist"
    )
  }
  extension = url.queryItemValue('extension')
  if (!extension) {
    throw new HTTPExceptions.MissingQueryError(
      'Missing query argument <extension>'
    )
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