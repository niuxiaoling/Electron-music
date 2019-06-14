const {ipcRenderer} = require('electron') ;
const { $ } =require('./common');

$('add-music-button').addEventListener('click',()=>{
  ipcRenderer.send('add-music-window')
})

const renderListHtml = (tracks)=>{
  const trackList = $('tracksList');
  const trackListHtml = tracks.reduce((track)=>{
    html += ` <li class="list-group-item music-track  d-flex justify-content-between align-items-center row">
              <div class="col-10"><i class="fa fa-music mr-2 text-secondary"></i><b>${track.name}</b></div>
              <div class="col-2"><i class="fa fa-play mr-2"></i><i class="fa fa-trash-alt"></i></div>
            </li>`
    return html;        
  },'')
  trackList.innerHTML = `<ul class="list-group">${trackListHtml}</ul>`
}

// 监听主进程传过来的数据
ipcRenderer.on('get-tracks',(event,tracks)=>{
  if(Array.isArray(tracks)){
    renderListHtml(tracks);  //渲染列表到页面中
  }
})