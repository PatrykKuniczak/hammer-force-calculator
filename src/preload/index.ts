import { ipcInvoke, ipcOn, ipcSend } from './helpers';
import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';

const api = {};

const ipc = {
  invoke: ipcInvoke,
  on: ipcOn,
  send: ipcSend,
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('ipc', ipc);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
  window.ipc = ipc;
}
