import { ipcRenderer } from 'electron/renderer';

export const ipcInvoke = <Key extends keyof EventPayloadMapping>(key: Key): Promise<EventPayloadMapping[Key]> =>
  ipcRenderer.invoke(key);

export const ipcOn = <Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void,
) => {
  const cb = (_: Electron.IpcRendererEvent, payload: unknown) => callback(payload as EventPayloadMapping[Key]);
  ipcRenderer.on(key, cb);
  return () => ipcRenderer.off(key, cb);
};

export const ipcSend = <Key extends keyof EventPayloadMapping>(key: Key, payload: EventPayloadMapping[Key]) => {
  ipcRenderer.send(key, payload);
};
