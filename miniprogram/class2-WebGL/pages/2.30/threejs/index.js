// pages/2.30/threejs/index.js

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    _canvas: [
      { name: "球", path: "/pages/2.30/threejs/sphere" },
      { name: "单个正方体", canvasId: "/pages/2.30/threejs/cube" },
      { name: "多个正方体", canvasId: "/pages/2.30/threejs/cubes" },
      { name: "模型", canvasId: "/pages/2.30/threejs/model" },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
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