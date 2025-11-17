import type { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  type EventPayloadMapping = unknown;

  interface Window {
    electron: ElectronAPI;
    api: object;
    ipc: {
      invoke: <Key extends keyof EventPayloadMapping>(key: Key) => Promise<EventPayloadMapping[Key]>;
      on: <Key extends keyof EventPayloadMapping>(
        key: Key,
        callback: (payload: EventPayloadMapping[Key]) => void,
      ) => () => void;
      send: <Key extends keyof EventPayloadMapping>(key: Key, payload: EventPayloadMapping[Key]) => void;
    };
  }
}
