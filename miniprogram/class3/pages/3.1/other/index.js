// pages/3.1/other/index.js
import loginWithCallback from '../../../lib/login'

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  startLoginAndRequest4(e) {
    // 调用user/home接口
    const requestUserHome = (token) => {
      wx.request({
        url: `${getApp().globalData.apiUrl}/user/home`,
        header: {
          'Authorization': `Bearer ${token}`
        },
        success(res) {
          if (res.errMsg === "request:ok") console.log("/user/home res", res)
        },
        fail(err) {
          if (err.errMsg === "request:fail") console.log("/user/home err", err)
        },
        complete(resOrErr) {
          console.log("/user/home resOrErr", resOrErr)
        }
      })
    }

    loginWithCallback(e, (token) => {
      requestUserHome(token)
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})