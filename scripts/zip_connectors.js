const npm_package=require("./../package.json")
const file_system = require('fs');
const archiver = require('archiver');

var output = file_system.createWriteStream(`./dist/connectors-${npm_package.version}.zip`);
var archive = archiver('zip', { zlib: { level: 9 }});

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err){
    throw err;
});

archive.pipe(output);

archive.directory("./connectors", false);

archive.finalize();