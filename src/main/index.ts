import { createMenu } from './menu';
import { getAppPath } from './pathResolver';
import { createTray } from './tray';
import { electronApp, is, optimizer, platform } from '@electron-toolkit/utils';
import { app, BrowserWindow, shell } from 'electron';
import { join } from 'path';

const handleCloseEvents = (mainWindow: BrowserWindow): void => {
  let willClose = false;

  mainWindow.on('close', e => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();

    if (app.dock) app.dock.hide();
  });

  app.on('before-quit', () => {
    willClose = true;
  });

  mainWindow.on('show', () => {
    willClose = false;
  });
};

app.whenReady().then(() => {
  electronApp.setAppUserModelId('hammer-force-calculator.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  getAppPath(mainWindow);
  createTray(mainWindow);
  handleCloseEvents(mainWindow);
  createMenu();
});

app.on('window-all-closed', () => {
  if (!platform.isMacOS || is.dev) {
    app.quit();
  }
});
