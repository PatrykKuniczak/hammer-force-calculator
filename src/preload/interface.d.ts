import type { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  type SIFormPayload = {
    armLength: number;
    handleToHammerHeadLength: number;
    hammerHeadHeight: number;
    travelTime: number;
    hammerWeight: number;
    armWeight: number;
    diameter: number;
    nailLength: number;
    coneLength: number;
    coneAngleDeg: number;
    materialHardness: number;
    materialHeight: number;
    nailFrictionCoefficient: number;
  };

  type EventPayloadMapping = {
    'form:submit': SIFormPayload;
    'calc:penetration:done': number;
  };

  type InvokeRequestMapping = {
    'calc:penetration': SIFormPayload;
  };
  type InvokeResponseMapping = {
    'calc:penetration': number;
  };

  interface Window {
    electron: ElectronAPI;
    api: object;
    ipc: {
      invoke: <Key extends keyof InvokeRequestMapping>(
        key: Key,
        payload: InvokeRequestMapping[Key],
      ) => Promise<InvokeResponseMapping[Key]>;
      on: <Key extends keyof EventPayloadMapping>(
        key: Key,
        callback: (payload: EventPayloadMapping[Key]) => void,
      ) => () => void;
      send: <Key extends keyof EventPayloadMapping>(key: Key, payload: EventPayloadMapping[Key]) => void;
    };
  }
}
