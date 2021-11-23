const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export function getStoreValue(key, defaultValue) {
  return ipcRenderer.invoke('getStoreValue', key, defaultValue)
}

export function setStoreValue(key, value) {
  return ipcRenderer.invoke('setStoreValue', key, value)
}
