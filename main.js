
const {app, BrowserWindow,ipcMain,dialog} = require('electron')
// const client = require('electron-connect').client;
const path = require('path')

class CreateWindow extends BrowserWindow{
    constructor(config,fileLocation){
      const basicConfig = {
        width:800,
        height:600,
        webPreferences:{
          nodeIntegration:true
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
  const mainWindow = new CreateWindow({},'./renderer/index.html')
  ipcMain.on('add-music-window',()=>{
    const addWindow = new CreateWindow({
      width:500,
      height:400,
      parent:mainWindow
    },'./renderer/add.html');
  });
  ipcMain.on('select-music',()=>{
    dialog.showOpenDialog()
  })
})