// index.js
import area from "../../lib/area"
Page({
  data: {
    areaList: area,
    show: false,
    progress:1,
  },

  onTap() {
    this.setData({
      show: true
    })
  },

  onClose(e) {
    this.setData({
      show: false
    })
  },

  onAreaConfirm(e) {
    console.log(e.detail);
    this.onClose();
  },

  incressProgress(){
    let progress = this.data.progress
    progress +=20
    console.log("progress",progress)
    progress = Math.min(100,progress)
    this.setData({
      progress
    })
  }
})
