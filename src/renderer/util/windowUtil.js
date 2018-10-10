import { ipcRenderer } from 'electron'
const windowUtil  = {
	minimize(){
		ipcRenderer.send('asynchronous-message', 'minimize');
	},

}