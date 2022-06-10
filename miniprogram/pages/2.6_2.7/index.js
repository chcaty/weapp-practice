// pages/2.6_2.7/index.js
var base64 = require("../../images/base64");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    x: 0,
    y: 0,
    scale: 2,
    // 当前x的值
    currentX: 0
  },

  onMovableViewChange(e){
    console.log("change",e.detail)
  },

  tap(e) {
    let kind =  parseInt(e.currentTarget.dataset.kind)
    if (!kind){
      this.setData({
        x: 30,
        y: 30
      })
    }else{
      this.setData({
        x: 0,
        y: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.widget = this.selectComponent('.widget')
    this.setData({
        icon: base64.icon20,
        slideButtons: [{
          text: '普通1',
          src: '/images/icon_love.svg', // icon的路径
        },{
          text: '普通2',
          extClass: 'test',
          src: '/images/icon_star.svg', // icon的路径
        },{
          type: 'warn',
          text: '警示3',
          extClass: 'test',
            src: '/images/icon_del.svg', // icon的路径
        }],
    });
  }
})