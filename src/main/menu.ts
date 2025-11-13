import { app, Menu } from 'electron';

export const createMenu = () => {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: 'Zakończ',
        click: app.quit,
      },
    ]),
  );
};
