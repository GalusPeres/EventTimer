import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  isFullscreen: () => ipcRenderer.invoke('is-fullscreen'),
  closeApp: () => ipcRenderer.send('close-app'),
  openExternal: (url: string) => ipcRenderer.send('open-external', url),
});
