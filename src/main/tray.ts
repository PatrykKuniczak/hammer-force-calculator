import { getAssetPath } from './pathResolver';
import { platform } from '@electron-toolkit/utils';
import { app, Menu, Tray } from 'electron';
import path from 'path';
import type { BrowserWindow } from 'electron';

let trayRef: Tray | null = null;

export const createTray = (mainWindow: BrowserWindow): void => {
  if (trayRef) return;

  const iconPath = path.join(getAssetPath(), platform.isMacOS ? 'trayIconTemplate.png' : 'trayIcon.png');

  trayRef = new Tray(iconPath);
  trayRef.setToolTip('Hammer Force Calculator');

  trayRef.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      if (app.dock) app.dock.hide();
    } else {
      mainWindow.show();
      if (app.dock) app.dock.show();
    }
  });

  trayRef.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Pokaż okno',
        click: () => {
          mainWindow.show();
          if (app.dock) app.dock.show();
        },
      },
      {
        label: 'Zakończ',
        click: app.quit,
      },
    ]),
  );
};
