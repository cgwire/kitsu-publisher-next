[![Kitsu](https://www.cg-wire.com/en/images/kitsu.png)](https://kitsu.cg-wire.com)

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

Work in progress:

- Blender
- Toonboom Harmony

## Installation

### Installation of the Kitsu Publisher

You need to download (or to build if you want to : see [Development Environment](#development-environment)) your preferred installer/package/portable for the app corresponding to your OS in the [releases](https://github.com/cgwire/kitsu-publisher-next/releases/latest) (coming soon).

All comands have the keyword {current_version} in the filenames, you need to replace the version with the current version of the Kitsu Publisher.

#### On Linux

  - deb package (for debian based distributions):

    - To install the package:

    ```console
    dpkg -i kitsu-publisher-{current_version}_amd64.deb
    ```

    - The package is now in your applications and in your $PATH.

  - rpm package (for RHEL based distributions):

    - To install the package:

    ```console
    rpm -i kitsu-publisher-{current_version}_x86_64.deb
    ```

    - The package is now in your applications and in your $PATH.

  - snap package:

    - To install the package:

    ```console
    snap install kitsu-publisher-{current_version}_amd64.snap --dangerous
    ```

    - The package is now in your applications and in your $PATH.

  - tar.gz archive:

    - To extract the archive:

    ```console
    tar -xf kitsu-publisher-{current_version}.tar.gz
    ```

    - To run the app:

    ```console
    kitsu-publisher-{current_version}/kitsu-publisher
    ```

  - AppImage:

    - to run the app:

    ```console
    ./Kitsu publisher-{current_version}.AppImage
    ```

#### On Windows

  - coming soon

#### On macOS

  - coming soon

### Installation of the DCCs connectors

You need to download the connectors-{current_version}.zip archive in the [releases](https://github.com/cgwire/kitsu-publisher-next/releases/latest) (coming soon). You have to unzip the archive. 

#### Blender

  - You need to go inside the blender directory.

  - On Windows (with PowerShell):

    - If Blender is installed with an installer (it supports multiple Blender installations):

    ```console
    install.ps1 -installer
    ```

    - If Blender is a portable app:

    ```console
    install.ps1 -portable PATH_TO_YOUR_PORTABLE_BLENDER
    ```

  - On Linux:

    - If Blender is installed with a system package (for example: deb or rpm):

    ```console
    ./install.sh --system
    ```

    - If Blender is an unpacked directory (tar.xz archive):

    ```console
    ./install.sh --unpacked-directory=PATH_TO_YOUR_PORTABLE_BLENDER
    ```

    - If Blender is installed with a snap package:

    ```console
    ./install.sh --snap
    ```

  - On macOS:

    - coming soon
#### Toonboom Harmony

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
