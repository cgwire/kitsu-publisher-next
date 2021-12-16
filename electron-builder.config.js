const config = {
  appId: 'com.cgwire.kitsupublisher',
  productName: 'Kitsu publisher',
  copyright: 'Copyright © 2021 ${author}',
  directories: {
    output: 'dist',
    buildResources: 'build_resources'
  },
  files: [
    'app/**/dist/**',
    'build_resources/icon.png',
    'build_resources/icon.ico'
  ],
  linux: {
    target: ['AppImage', 'deb', 'rpm', 'tar.gz', 'snap'],
    category: 'Graphics'
  },
  win: {
    target: ['nsis', 'portable', 'zip', 'msi']
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    menuCategory: 'CGWire'
  }
}

module.exports = config
