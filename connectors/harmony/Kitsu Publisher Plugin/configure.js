include('./HTTP/exceptions.js')
include('./openHarmony.js')

function configure(packageFolder, packageName) {
  if (about.isPaintMode()) return

  harmonyServer = require('./harmonyServer.js')
  harmonyServer.server.start(10102)
}

exports.configure = configure
