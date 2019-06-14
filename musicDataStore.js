const Store = require('electron-store'); // 数据的储存和读取
const uuidv4 = require('uuid/v4'); //生成不同的uuid
const path = require('path'); 

class DataStore extends Store{
  constructor(setting){
    super(setting)
    this.tracks = this.getTrack() ||[]
  }
  saveTracks(){   // 储存track
    this.set('tracks',this.tracks)
    return this
  }
  getTrack(){    // 获取track
    return this.get('tracks') || []
  }
  deleteTrack(deleteId){
    this.tracks = this.tracks.filter(track => track.id !== deleteId);
    return this.saveTracks();
  }
  addTracks(tracks){  //添加track 及去重
    const trackProps = tracks.map(track =>{
      return {
        id:uuidv4(),
        path:track,
        name:path.basename(track)
      }
    }).filter( track =>{
      const currentTracksPath = this.getTrack().map(track => track.path)  //获取原来的track路径去重
      return currentTracksPath.indexOf(track.path) < 0
    })
    this.tracks = [...this.tracks,...trackProps]; // track合并
    return this.saveTracks(); // 保存track
  }
}

module.exports = DataStore


