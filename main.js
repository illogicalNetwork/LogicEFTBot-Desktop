const path = require('path')
const url = require('url')
const { app, BrowserWindow, ipcMain, Tray } = require('electron')
const axios = require('axios')

let mainWindow
let tray

// process.env.NODE_ENV = 'production';

let isDev = false

if (
	process.env.NODE_ENV !== undefined &&
	process.env.NODE_ENV === 'development'
) {
	isDev = true
}

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 800,
		show: false,
		icon: `${__dirname}/assets/icon.png`,
		webPreferences: {
			nodeIntegration: true,
		},
	})

	let indexPath

	if (isDev && process.argv.indexOf('--noDevServer') === -1) {
		indexPath = url.format({
			protocol: 'http:',
			host: 'localhost:8080',
			pathname: 'index.html',
			slashes: true,
		})
	} else {
		indexPath = url.format({
			protocol: 'file:',
			pathname: path.join(__dirname, 'dist', 'index.html'),
			slashes: true,
		})
	}

	mainWindow.loadURL(indexPath)

	// Don't show until we are ready and loaded
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()

		// Open devtools if dev
		if (isDev) {
			mainWindow.setMenuBarVisibility(true)
			const {
				default: installExtension,
				REACT_DEVELOPER_TOOLS,
			} = require('electron-devtools-installer')

			installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
				console.log('Error loading React DevTools: ', err)
			)
			mainWindow.webContents.openDevTools()
		} else {
			mainWindow.setMenuBarVisibility(false)
		}
	})

	mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createMainWindow)

// app.on('window-all-closed', () => {
// 	if (process.platform !== 'darwin') {
// 		app.quit()
// 	}
// })

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow()
	}
})

const icon = path.join(__dirname, 'assets', 'icons', 'trayIcon.png')

if(mainWindow) {
	// Create Tray
tray = new Tray(icon)

tray.on('click', () => {
	if(mainWindow.isVisible() === true){
		mainWindow.hide()
	} else {
		mainWindow.show()
	}
})
}

// Handle HTTP Request
ipcMain.handle('getItems', (e, searchTerm) => {
	axios.get(`https://redactedapi.url/${searchTerm}`)
	.then(res => {
		mainWindow.webContents.send('receiveItems', res.data)
	})

})	

// Stop error
app.allowRendererProcessReuse = true
