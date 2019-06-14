
const {app, BrowserWindow,ipcMain,dialog} = require('electron');
const DataStore  = require('./musicDataStore')
// const client = require('electron-connect').client;
console.log('music store path:'+app.getPath('userData'))
const MyStore = new DataStore({'name':'Music Data'});
class CreateWindow extends BrowserWindow{
    constructor(config,fileLocation){
      const basicConfig = {
        width:800,
        height:600,
        webPreferences:{
          nodeIntegration:true,
          devTools:true
        }
      }
      const finalConfig = {...basicConfig,...config}
      super(finalConfig)
      this.loadFile(fileLocation)
      //在加载页面时，渲染进程第一次完成绘制时，会发出 ready-to-show 事件 。 在此事件后显示窗口将没有视觉闪烁：
      this.once('ready-to-show', () => {
        this.show()
      })
    }
}

app.on('ready',()=>{
  const mainWindow = new CreateWindow({},'./renderer/index.html');
  // 处理页面加载事件
  mainWindow.webContents.on('did-finish-load',()=>{
    mainWindow.webContents.send('get-tracks',MyStore.getTrack());
  })
  ipcMain.on('main-update',()=>{
    mainWindow.webContents.on('page-title-updated')
  })
  // 打开窗口
  ipcMain.on('add-music-window',()=>{
    const addWindow = new CreateWindow({
      width:500,
      height:400,
      parent:mainWindow
    },'./renderer/add.html');
  });
 
  // 选择音乐
  ipcMain.on('select-music',(event)=>{
    dialog.showOpenDialog({
      properties:['openFile','multiSelections'],
      filters:[{name:'Music',extensions:['mp3']}] 
    },(files)=>{
      event.sender.send('selected-file',files);
    })
  })
  // 接收发射回来的添加的音乐
  ipcMain.on('add-tracks',(event,tracks)=>{
    const updatedTrack = MyStore.addTracks(tracks).getTrack();   // 存储到本地config.json中
    event.sender.send('get-tracks',updatedTrack); // 主进程向渲染页面index.html发送数据
  })
  // 删除音乐
  ipcMain.on('delete-track',(event,id)=>{
    const updatedTrack = MyStore.deleteTrack(id).getTrack();
    event.sender.send('get-tracks',updatedTrack); // 主进程向渲染页面index.html发送数据
  })
})