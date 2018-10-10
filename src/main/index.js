import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import trayMenu from '../renderer/config/trayMenu'
import os from 'os'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let appTray = null

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
console.log(`--------------------------------------file://${__dirname}/index.html`);
function createWindow () {
  /**
   * Initial window options
   */
  let iconUrl = `${ __static }/icon/${ os.platform() === 'darwin'? 'tweek.icns': 'favicon.png' }`
  console.log(iconUrl, '++++++++++++++++')
  mainWindow = new BrowserWindow({
    height: 748,
    useContentSize: true,
    width: 380,
    frame: false,
    resizable: false,
    transparent: true,
    icon: iconUrl
  })

mainWindow.loadURL(winURL)

mainWindow.on('closed', () => {
	mainWindow = null
})
}
ipcMain.on('asynchronous-message',(e,str) => {
	switch(str){
		case 'minimize':
      // mainWindow.hide();
      let url = os.platform() === 'darwin'?`${__static}/icon/tray.png`:`${__static}/icon/favicon.ico`
      try{
        appTray = new Tray(url)
      }catch(e){
        console.log(e)
      }
      
      appTray.setContextMenu(Menu.buildFromTemplate(trayMenu))
      appTray.setToolTip('Tweek')
      appTray.on('click',() => {
        mainWindow.show();
      })
      break;
    case 'maximize':
      mainWindow.maximize();
      break;
    case 'unmaximize':
        mainWindow.unmaximize();
        break;
    case 'close':
      mainWindow.close();
      break;
  }
})
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('minimize',() => {
  console.log('will hide')
  mainWindow.webContents.send('player-hide')
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
