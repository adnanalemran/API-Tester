const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets', 'icon.ico') || path.join(__dirname, 'assets', 'icon.png'),
    backgroundColor: '#ffffff'
  });

  // Remove the menu bar completely
  Menu.setApplicationMenu(null);

  // IPC handlers for window controls
  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.on('window-always-on-top', (event, flag) => {
    if (mainWindow) {
      mainWindow.setAlwaysOnTop(flag);
      event.reply('window-always-on-top-changed', flag);
    }
  });

  ipcMain.on('get-always-on-top', (event) => {
    if (mainWindow) {
      event.reply('always-on-top-status', mainWindow.isAlwaysOnTop());
    }
  });

  mainWindow.loadFile('dist/index.html');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
