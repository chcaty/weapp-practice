// pages/3.12/index3/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    initData: {}
  },

  async onPageNavigating(e) {
    console.log("targetPageUrl", e.detail.targetPageUrl)
    let res = await wx.wxp.request({
      url: `${getApp().globalData.apiUrl}/hi?name=index3`,
    })
    e.detail.eventCallback({
      openType: "initData",
      openData: {
        a: res.data
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel.on) {
      eventChannel.on('initData', (data) => {
        console.log("data", data)
        this.setData({
          initData: data
        })
      })
    }
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