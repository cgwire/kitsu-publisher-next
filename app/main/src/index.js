import {
  app,
  BrowserWindow,
  session,
  nativeTheme,
  ipcMain,
  dialog,
  Menu /**shell*/
} from 'electron'
import { join } from 'path'
import { URL } from 'url'
import { spawn } from 'child_process'
const colors = require('colors')
const iconv = require('iconv-lite')
const open = require('open')
const windowStateKeeper = require('electron-window-state')
var codePage
if (process.platform === 'win32') {
  codePage = require('win-codepage')
}
import { store, config } from './store'

config.set('appVersion', app.getVersion())

// enable darkmode for electron at startup
nativeTheme.themeSource = store.get('main.isDarkTheme') ? 'dark' : 'light'

const isSingleInstance = app.requestSingleInstanceLock()
const isDevelopment = import.meta.env.MODE === 'development'

if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}

app.disableHardwareAcceleration()

// Install "Vue.js devtools"
if (isDevelopment) {
  app
    .whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
      installExtension(VUEJS3_DEVTOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true
        }
      })
    )
    .catch((e) => console.error('Failed install extension:', e))
}

let mainWindow = null

const createWindow = async () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    // set custom User-Agent in requestHeaders
    details.requestHeaders['User-Agent'] = `Kitsu publisher ${app.getVersion()}`
    // set custom Authorization header with access_token
    try {
      const url = new URL(store.get('login.server'))
      if (
        details.url.startsWith(url) &&
        store.get('login.access_token') !== ''
      ) {
        details.requestHeaders['Authorization'] = `Bearer ${store.get(
          'login.access_token'
        )}`
      }
    } catch (error) {
      // do nothing
    }

    callback({ cancel: false, requestHeaders: details.requestHeaders })
  })

  let mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 768
  })

  mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      webSecurity: false // TODO : REENABLE TO ENABLE CORS
    },
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height
  })

  mainWindowState.manage(mainWindow)

  const old_menu = Menu.getApplicationMenu()
  const new_menu = old_menu?.items.filter((item) => item.role !== 'help')
  Menu.setApplicationMenu(Menu.buildFromTemplate(new_menu))
  mainWindow.setAutoHideMenuBar(true)
  mainWindow.menuBarVisible = false

  switch (process.platform) {
    case 'win32':
      mainWindow.setIcon(
        join(__dirname, '../../../build_resources', 'icon.ico')
      )
      break
    default:
      mainWindow.setIcon(
        join(__dirname, '../../../build_resources', 'icon.png')
      )
      break
  }

  //open the pages different from the Kitsu server in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const url_server = new URL(store.get('login.server'))
      if (
        url.startsWith(url_server) &&
        store.get('login.access_token') !== ''
      ) {
        return { action: 'allow' }
      }
    } catch (error) {
      // do nothing
    }
    open(url)
    return { action: 'deny' }
  })

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()

    if (isDevelopment) {
      mainWindow?.webContents.openDevTools()
    }
  })

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    isDevelopment && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString()

  await mainWindow.loadURL(pageUrl)

  if (process.platform === 'win32') {
    codePage = await codePage()
  }

  ipcMain.handle('dark-theme:toggle', () => {
    nativeTheme.themeSource = store.get('main.isDarkTheme') ? 'dark' : 'light'
    return store.get('main.isDarkTheme')
  })

  ipcMain.handle('launch-command:post-exports', (event, command) => {
    if (command === '') {
      console.log('No command to launch before importing to Kitsu.')
      return false
    } else {
      const commandOutput = { output: '', command: command }
      const commandSpawn = spawn(command, [], {
        shell: true,
        encoding: 'buffer',
        windowsHide: true
      })
      console.log(`Launch command "${command}" before importing to Kitsu.`)
      console.log('Output :')

      const manageOutputData = (data, isStdout) => {
        var output
        if (process.platform === 'win32') {
          // get Windows code page
          output = iconv.decode(data, `cp${codePage}`)
        } else {
          output = iconv.decode(data, 'utf8')
        }
        commandOutput.output += isStdout ? output : colors.red(output)
      }

      commandSpawn.stdout.on('data', (data) => {
        manageOutputData(data, true)
      })

      commandSpawn.stderr.on('data', (data) => {
        manageOutputData(data, false)
      })

      commandSpawn.on('close', (statusCode) => {
        console.log(commandOutput.output)
        console.log(`Command exited with status code ${statusCode}.`)
        commandOutput.statusCode = statusCode
        mainWindow.webContents.send('commandOutput', commandOutput)
      })

      return true
    }
  })

  ipcMain.handle('open-dialog:show', (event, options) => {
    return dialog.showOpenDialogSync(mainWindow, options)
  })
}

/** TODO : reenable CORS
 app.on('web-contents-created', (_event, contents) => {

  /**
   * Block navigation to origins not on the allowlist.
   *
   * Navigation is a common attack vector. If an attacker can convince the app to navigate away
   * from its current page, they can possibly force the app to open web sites on the Internet.
   *
   * @see https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation

  contents.on('will-navigate', (event, url) => {
    const allowedOrigins = new Set(`https://${string}`); // Do not use insecure protocols like HTTP. https://www.electronjs.org/docs/latest/tutorial/security#1-only-load-secure-content
    const { origin, hostname } = new URL(url);
    const isDevLocalhost = isDevelopment && hostname === 'localhost'; // permit live reload of index.html
    if (!allowedOrigins.has(origin) && !isDevLocalhost){
      console.warn('Blocked navigating to an unallowed origin:', origin);
      event.preventDefault();
    }
  });

  /**
  * Hyperlinks to allowed sites open in the default browser.
  *
  * The creation of new `webContents` is a common attack vector. Attackers attempt to convince the app to create new windows,
  * frames, or other renderer processes with more privileges than they had before; or with pages opened that they couldn't open before.
  * You should deny any unexpected window creation.
  *
  * @see https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
  * @see https://www.electronjs.org/docs/latest/tutorial/security#15-do-not-use-openexternal-with-untrusted-content

  contents.setWindowOpenHandler(({ url }) => {
    const allowedOrigins =
      new Set([ // Do not use insecure protocols like HTTP. https://www.electronjs.org/docs/latest/tutorial/security#1-only-load-secure-content
      'https://vitejs.dev',
      'https://github.com',
      'https://v3.vuejs.org']);
    const { origin } = new URL(url);
    if (allowedOrigins.has(origin)){
      shell.openExternal(url);
    } else {
      console.warn('Blocked the opening of an unallowed origin:', origin);
    }
    return { action: 'deny' };
  });
})*/

app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app
  .whenReady()
  .then(createWindow)
  .catch((e) => console.error('Failed create window:', e))
