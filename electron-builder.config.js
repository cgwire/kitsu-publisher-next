if (process.env.VITE_APP_VERSION === undefined) {
  const now = new Date()
  process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${
    now.getUTCMonth() + 1
  }.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`
}

const config = {
  appId: 'com.cgwire.kitsupublisher',
  productName: 'Kitsu publisher',
  copyright: 'Copyright © 2021 ${author}',
  directories: {
    output: 'dist',
    buildResources: 'build_resources'
  },
  files: [
    'packages/**/dist/**',
    'build_resources/icon.png',
    'build_resources/icon.ico'
  ],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION
  },
  linux: {
    target: ['AppImage', 'deb', 'rpm', 'tar.gz', 'snap'],
    category: 'Graphics'
  }
}

module.exports = config
