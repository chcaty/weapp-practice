Page({
  data: {
    iconSize: [20, 30, 40, 50, 60, 100],
    iconColor: [
      'red', 'orange', 'yellow', 'green', 'rgb(0,255,255)', 'blue', 'purple'
    ],
    iconType: [
      'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
    ],
    iconName:'icon-sun',
    percentValue: 0
  },
  onProgressActiveEnd(e){
    console.log(e)
  },
onTapProgressBar(e){
  console.log(e)
  let progress = this.data.percentValue
  if (progress < 100){
    progress += 5
    this.setData({percentValue:Math.min(100, progress)})
  }
},
// 已经加载完的进度条progress，怎么点击某个按钮让它重新加载呢？
onTapReloadBtn(e){
  this.setData({percentValue:0})
  this.setData({percentValue:50})
},
// 7环形进度条
drawProgress(){
  if (this.data.percentValue >= 100){
    this.setData({
      percentValue:0
    })
  }
  this.setData({
    percentValue:this.data.percentValue+10
  })
}
})


