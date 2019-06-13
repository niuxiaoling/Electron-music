
const {ipcRenderer} = require('electron')
window.addEventListener('DOMContentLoaded',()=>{
  ipcRenderer.send('message','hello from renderer'); // 向主进程发送ipc
  ipcRenderer.on('reply',(event,arg)=>{
    document.getElementById('message').innerHTML = arg;
  })
})
