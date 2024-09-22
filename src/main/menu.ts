import { app, Menu } from 'electron';

export const createMenu = (): void => {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: 'Zakończ',
        click: app.quit,
      },
    ]),
  );
};
