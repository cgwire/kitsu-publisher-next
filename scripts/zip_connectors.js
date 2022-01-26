const npm_package = require('./../package.json')
const file_system = require('fs')
const archiver = require('archiver')

if (!file_system.existsSync('./dist')) {
  file_system.mkdirSync('./dist')
}

var output = file_system.createWriteStream(
  `./dist/connectors-${npm_package.version}.zip`
)
var archive = archiver('zip', { zlib: { level: 9 } })

output.on('close', function () {
  console.log('Connectors zip size : ' + archive.pointer() + ' bytes.')
})

archive.on('error', function (err) {
  throw err
})

archive.pipe(output)

archive.directory('./connectors', 'connectors')

archive.finalize()
