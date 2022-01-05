var packageFolder =
  specialFolders.userScripts + '/packages/Kitsu Publisher Plugin'
include(packageFolder + '/openHarmony.js')
HTTPExceptions = require(packageFolder + '/HTTP/exceptions.js')

var globals = {
  $: $,
  packageFolder: packageFolder,
  HTTPExceptions: HTTPExceptions
}

configure = require(packageFolder + '/configure.js')

configure.configure(packageFolder)