const {ipcRenderer} = require('electron') ;
const { $ } =require('./common');

$('select-music').addEventListener('click',()=>{
  ipcRenderer.send('open-music-file')
})