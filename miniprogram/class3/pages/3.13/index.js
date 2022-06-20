// pages/3.13/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  async extendPageTest(){
    this.hi('weapp')
    // 使用request4
    let res4 = await wx.wxp.request4({
      url: `${getApp().globalData.apiUrl}/user/home`,
    })
    if (res4) console.log('res4', res4)

    let res5 = await wx.wxp.request5({
      url: `${getApp().globalData.apiUrl}/user/home`,
    })
    if (res5) console.log('res5', res5)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})