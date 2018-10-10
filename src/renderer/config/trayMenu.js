import { app } from 'electron'
const trayMenuTemplate = [
    {
        label: 'Settings',
        click: () => {} //打开相应页面
    },
    {
        label: 'Quit Tweek',
        click: function (){
            //ipc.send('close-main-window');
             app.quit();
        }
    }
];
export default trayMenuTemplate;