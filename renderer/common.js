exports.$ = (id) =>{
  return document.getElementById(id)
}
// 处理时分
exports.convertTime = (time)=>{
  // 计算分钟,单数返回01，多数返回010
  const min = '0'+ Math.floor(time / 60);
  // 计算秒数
  const second = '0'+ Math.floor(time - min * 60);
  return min.substr(-2)+':'+second.substr(-2);
}