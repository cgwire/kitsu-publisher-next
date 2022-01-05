var packageFolder =
  specialFolders.userScripts + '/packages/Kitsu Publisher Plugin'
include(packageFolder + '/openHarmony.js')
HTTPExceptions = require(packageFolder + '/HTTP/exceptions.js')

var globals = {
  $: $,
  packageFolder: packageFolder,
  HTTPExceptions: HTTPExceptions
}

function configure(packageFolder, packageName) {
  if (about.isPaintMode()) return
  harmonyServer = require(packageFolder + '/harmonyServer.js')
  harmonyServer.server.start()
}

exports.globals = globals
exports.configure = configure
