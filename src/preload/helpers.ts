import { ipcRenderer } from 'electron/renderer';

export const ipcInvoke = <Key extends keyof InvokeRequestMapping>(
  key: Key,
  payload: InvokeRequestMapping[Key],
): Promise<InvokeResponseMapping[Key]> => ipcRenderer.invoke(key, payload);

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
