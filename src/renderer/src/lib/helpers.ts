export const ipcInvoke = <Key extends keyof InvokeRequestMapping>(
  key: Key,
  payload: InvokeRequestMapping[Key],
): Promise<InvokeResponseMapping[Key]> => {
  if (typeof window !== 'undefined' && window.ipc?.invoke) {
    return window.ipc.invoke(key, payload);
  }
  return Promise.reject(new Error('IPC invoke is unavailable in renderer context'));
};

export const ipcOn = <Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void,
) => {
  if (typeof window !== 'undefined' && window.ipc?.on) {
    return window.ipc.on(key, callback);
  }
  return () => {};
};

export const ipcSend = <Key extends keyof EventPayloadMapping>(key: Key, payload: EventPayloadMapping[Key]) => {
  if (typeof window !== 'undefined' && window.ipc?.send) {
    window.ipc.send(key, payload);
  }
};
