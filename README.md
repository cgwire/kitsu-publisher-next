[![Kitsu](https://zou.cg-wire.com/kitsu.png)](https://kitsu.cg-wire.com)

# Kitsu Publisher, send your files right from your DCC

Kitsu is a web application to share the progress of your productions and
validate your deliveries. It improves the communication between all stakeholders.
Which leads to better pictures, shipped faster.

The Kitsu Publisher is a desktop application that connects DCC Tools to Kitsu.
Through it, your artists can see their todo list, comment tasks and send previews to Kitsu
directly from their tools.

[![Build
badge](https://travis-ci.com/cgwire/kitsu-publisher-next.svg?branch=master)](https://travis-ci.com/cgwire/kitsu-publisher-next)

## DCC integrations status:

Available:

- Blender
- Toon Boom Harmony
- Unreal Engine

Work in progress:

- Maya
- Adobe Photoshop

## Installation

### Installation of the Kitsu Publisher

#### Pre-requisites

You need to download (or to build if you want to: see [Development Environment](#development-environment)) your preferred installer/package/portable for the app corresponding to your OS in the [releases](https://github.com/cgwire/kitsu-publisher-next/releases/latest).

All comands have the keyword {version} in the filenames, you need to replace the version with the current version of the Kitsu Publisher.

#### On Linux

- deb package (for debian based distributions):

  - To install the package:

    ```console
    dpkg -i kitsu-publisher_{version}_amd64.deb
    ```

  - The package is now in your applications and in your $PATH.

- rpm package (for RHEL based distributions):

  - To install the package:

    ```console
    rpm -i kitsu-publisher_{version}_x86_64.rpm
    ```

  - The package is now in your applications and in your $PATH.

- snap package:

  - To install the package:

    ```console
    snap install kitsu-publisher_{version}_amd64.snap --dangerous
    ```

  - The package is now in your applications and in your $PATH.

- tar.gz archive:

  - To extract the archive:

    ```console
    tar -xf kitsu-publisher-{version}.tar.gz
    ```

  - To run the app:

    ```console
    kitsu-publisher-{version}/kitsu-publisher
    ```

- AppImage:

  - to run the app:

    ```console
    ./Kitsu publisher-{version}.AppImage
    ```

#### On Windows

- NSIS Installer:

  - Double-click on the installer (Kitsu-publisher-Setup-{version}.exe) and follow the instructions.

  - The package is now in your applications.

- Msi installer:

  - Double-click on the installer (Kitsu-publisher-{version}-ia32.msi) and it will install directly the app.

  - The package is now in your applications.

- Portable application:

  - Double-click on the executable (Kitsu-publisher-{version}.exe) to run the app.

- Zip portable application:

  - Extract the zip (Kitsu-publisher-{version}-ia32-win.zip) by right-clicking and select "Extract All" and then follow the instructions.

  - Double click on the executable (Kitsu publisher.exe) inside the extracted folder to run the app.

#### On macOS

- DMG installer:

  - Double-click on the installer (Kitsu-publisher-{version}.dmg), a window should open.

  - Drag and drop the Kitsu logo on the "Applications" folder and it will install directly the app.

- PKG installer:

  - To install the package (you can also install the package by double-clicking on it and following the instructions):

    ```console
    sudo installer -package Kitsu-publisher-{version}.pkg -target /
    ```

- Zip portable application:

  - Double-click on the zip (Kitsu-publisher-{version}-mac.zip) to expand the zip.

  - Double-click on the Kitsu publisher icon it will launch the app.

### Installation of the DCCs connectors

#### Pre-requisites

You need to download the connectors-{version}.zip archive in the [releases](https://github.com/cgwire/kitsu-publisher-next/releases/latest). After that, you have to unzip the archive (with right-click "Extract All" on Windows or unzip on Linux/macOS for example).

#### Blender (version>2.80)

- You need to go inside the connectors/blender directory.

- On Windows (with PowerShell):

  - If you want to be guided through the installation of the plugin, you have to right-click on the script install.ps1 and select "Run with PowerShell" to run the script in prompt mode. If you have multiple installations from installer of Blender it will install the plugin for all the installations (not if you select a portable Blender).

  - If you want to run the script with PowerShell command line it's possible, look at the help with:

    ```console
    .\install.ps1 -help
    ```

- On Linux:

  - If Blender is installed with a system package (for example: deb or rpm):

    ```console
    bash ./install.sh --system
    ```

  - If Blender is an unpacked directory (tar.xz archive):

    ```console
    bash ./install.sh --unpacked-directory=PATH_TO_YOUR_PORTABLE_BLENDER
    ```

  - If Blender is installed with a snap package:

    ```console
    bash ./install.sh --snap
    ```

- On macOS:

  - If Blender is installed with a dmg image or Homebrew:

    ```console
    bash ./install.sh --dmg
    ```

#### Toon Boom Harmony

- You need to go inside the connectors/harmony directory.

- On Windows (with PowerShell):

  - If you want to be guided through the installation of the plugin, you have to right-click on the script install.ps1 and select "Run with PowerShell" to run the script in prompt mode. If you have multiple installations from installer of Toon Boom Harmony it will install the plugin for all the installations.

  - If you want to run the script with PowerShell command line it's possible, look at the help with:

    ```console
    .\install.ps1 -help
    ```

- On macOS:

  - coming soon

#### Unreal Editor (version>=5)

- You need to go inside the connectors/unreal directory.

- On Windows (with PowerShell):

  - If you want to be guided through the installation of the plugin, you have to right-click on the script install.ps1 and select "Run with PowerShell" to run the script in prompt mode. If you have multiple installations from installer of Unreal Editor it will install the plugin for all the installations.

  - If you want to run the script with PowerShell command line it's possible, look at the help with:

    ```console
    .\install.ps1 -help
    ```

- On Linux:

  - coming soon

- On macOS:

  - coming soon

## Development Environment

### Pre-requisites

To develop or to build the Electron app you need [Node.js](https://nodejs.org/en/)>=16.11 installed.

### Dependencies

To install all the dependencies needed by the Electron app you have to run in the project folder:

```console
npm install
```

### Run

To run the Electron app in development mode you have to run an npm script:

```console
npm run dev
```

It will spawn an electron instance and a Vite development server.

### Build the electron app

#### Pre-requisites

- On debian based Linux you need:

  - To install these packages:

    ```console
    apt-get install build-essential libcairo2-dev libpango1.0-dev \
    libjpeg-dev libgif-dev librsvg2-dev
    ```

  - If you want to build specific target like rpm you need to install:

    ```console
    apt-get install rpm
    ```

- On Windows you need:

  - See the [wiki](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows) of node-canvas.

- On macOS you need (with [Homebrew](https://brew.sh/)):

  ```console
  brew install pkg-config cairo pango libpng jpeg giflib librsvg
  ```

#### Building the app

You need to run npm scripts:

- If you only want to build an unpackaged directory:

  ```console
  npm run build
  ```

- If you want to build for all targets:

  ```console
  npm run build:all
  ```

## Contributing

As any open source project, we enjoy any contribution! You will find below
how you can help the Kitsu project to get better.

### Bug reports

All bugs must be submitted directly in
[the issue page](https://github.com/cgwire/kitsu-publisher-next/issues) of this repository.

### Feature requests

Feature requests must be posted on our [Canny page](https://cgwire.canny.io/).

### Translations

If you want to contribute to translations, you can connect directly to the
[POEditor platform](https://poeditor.com/join/project?hash=fpUejpWDVo).

### Code

All contributions are welcomed as long as they respect the [C4
contract](https://rfc.zeromq.org/spec:42/C4).

The Kitsu publisher code is written with Javascript (ES6) and is based on the
[Electron](https://www.electronjs.org/) and the
[VueJS](https://vuejs.org/v2/guide/) framework extended with the
[Vuex](https://vuex.vuejs.org) plugin.

## About authors

Kitsu Publisher is written by CGWire, a company based in France. We help teams of animation
studios to collaborate better. We provide tools to more than 50 studios spread
all around the world.

On the technical side, we apply software craftmanship principles as much as
possible. We love coding and consider that strong quality and good developer
experience matter a lot.

Visit [cg-wire.com](https://cg-wire.com) for more information.

[![CGWire Logo](https://zou.cg-wire.com/cgwire.png)](https://cg-wire.com)
