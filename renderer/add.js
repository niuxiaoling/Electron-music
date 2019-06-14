const {ipcRenderer} = require('electron') ;  // ipc渲染
const { $ } =require('./common');   //封装的获取元素的方法
const path = require('path');   // node path
let renderMusicList = [];
// 选择音乐
$('select-music').addEventListener('click',()=>{
  ipcRenderer.send('select-music');  // 选择音乐
})  
// dom 渲染列表
const renderListHtml = (paths) =>{
  const muslicList = $('muslicList');
  const musicItem = paths.reduce((total,music)=>{
    total += `<li class="list-group-item">${path.basename(music)}</li>`; //path.basename 获取文件的名称
    return total;
  },'')
  muslicList.innerHTML = `<ul class="list-group">${musicItem}</ul>`;
}
// 从主进程接收数据渲染到页面
ipcRenderer.on('selected-file',(event,musicpath)=>{
  if(Array.isArray(musicpath)){
    renderListHtml(musicpath);  //渲染列表到页面中
    renderMusicList = musicpath;
  }
})
// 导入音乐监听发送数组
$('add-music').addEventListener('click',()=>{
  // if(!renderMusicList.length === 0){
    ipcRenderer.send('add-tracks',renderMusicList);
  // }
})