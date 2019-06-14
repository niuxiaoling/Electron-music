const {ipcRenderer} = require('electron') ;
const { $,convertTime} =require('./common');

$('add-music-button').addEventListener('click',()=>{
  ipcRenderer.send('add-music-window')
})
let musicAudio = new Audio(); // 实例音乐
let allTracks ;  // 所有的音乐
let currentTrack; // 当前音乐
const renderListHtml = (tracks)=>{
  const trackList = $('tracksList');
  const trackListHtml = tracks.reduce((html,track)=>{
    html += ` <li class="list-group-item music-track  d-flex justify-content-between align-items-center row">
                <div class="col-9"><i class="fa fa-music mr-2 text-secondary">
                  </i><b>${track.name}</b>
                </div>
                <div class="col-2">
                  <i class="fa fa-play mr-4" data-id="${track.id}"></i>
                  <i class="fa fa-trash-o" data-id="${track.id}"></i>
                </div>
              </li>`
    return html;        
  },'')
  trackList.innerHTML = `<ul class="list-group">${trackListHtml}</ul>`
}

// 监听主进程传过来的数据
ipcRenderer.on('get-tracks',(event,tracks)=>{
  console.log(tracks);
  if(Array.isArray(tracks)){
    renderListHtml(tracks);  //渲染列表到页面中
    allTracks = tracks;
  }
})

$('tracksList').addEventListener('click',(e)=>{
  e.preventDefault();
  const { dataset,classList} = e.target;
  const id = dataset && dataset.id;
  if(id && classList.contains('fa-play')){  // 说明点击的是play,播放音乐，判断是否是在播放当前的音乐，是，继续播放，否，播放新的音乐
    if(currentTrack && currentTrack.id === id){
      musicAudio.play();
    }else{
      // 播放新的音乐，还原图标
      currentTrack = allTracks.find(track => track.id === id);
      musicAudio.src = currentTrack.path;
      musicAudio.play();
      const resetIconEle = document.querySelector('.fa-pause');
      if(resetIconEle){
        resetIconEle.classList.replace('fa-pause','fa-play')
      }
    }
    classList.replace('fa-play','fa-pause');
  }
  // 暂停按钮
  else if(id && classList.contains('fa-pause')){
    musicAudio.pause();
    classList.replace('fa-pause','fa-play');
  }
  // 删除按钮
  else if(id && classList.contains('fa-trash-o')){  
    ipcRenderer.send('delete-track',id);
  }
})

//渲染元素
const renderPlayerHtml = (name,duration)=>{
  const player = $('play-status')
  const html = `
    <div class="col-8 font-weight-bold">
      正在播放:${name}
    </div>
    <div class="col">
      <span id="current-seeker">00:00</span>/ ${duration}
    </div>
  `
  player.innerHTML = html;
}

musicAudio.addEventListener('loadedmetadata',()=>{
  // 渲染状态
  renderPlayerHtml(currentTrack.name,convertTime(musicAudio.duration))
})

const updateProgressHtml = (currentTime,duration)=>{
  // 计算时间长度
  console.log(duration);
  const progress = Math.floor(currentTime / duration * 100);
  const bar = $('player-progress');
  bar.innerHTML = progress +'%';
  bar.style.width = progress +'%';

  const seeker = $('current-seeker');
  seeker.innerHTML = convertTime(urrentTime);
}

// 监听时间函数
musicAudio.addEventListener('timeupdate',()=>{
  updateProgressHtml(musicAudio.currentTime,musicAudio.duration)
  // 更新时间
})