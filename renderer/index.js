const {ipcRenderer} = require('electron') ;
const { $ } =require('./common');

$('add-music-button').addEventListener('click',()=>{
  ipcRenderer.send('add-music-window')
})