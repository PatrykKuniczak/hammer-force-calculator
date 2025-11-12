import { is } from '@electron-toolkit/utils';
import { app } from 'electron';
import path, { join } from 'path';
import type { BrowserWindow } from 'electron';

export const getAssetPath = () =>
  is.dev ? path.join(app.getAppPath(), 'resources') : path.join(process.resourcesPath, 'resources');

export const getAppPath = (mainWindow: BrowserWindow) => {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
};
