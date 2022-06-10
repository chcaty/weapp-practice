// miniprogram/pages/2.18/web-view/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    webViewData:{}
  },

onReceivedMessage(e){
  let data = e.detail.data
  // data可能是多次 postMessage 的参数组成的数组
  if (Array.isArray(data)) data = data[0]
  console.log('onReceivedMessage',JSON.parse(data));
  this.setData({
    webViewData:JSON.parse(data)
  })
},

  onShareAppMessage(options) {
    console.log('title',this.data.webViewData.title);
    
    console.log('webViewUrl',options.webViewUrl)
    return {
      title: this.data.webViewData.title,
      path: `/pages/2.22/web-view/index?web-view-url=${options.webViewUrl}`
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = getApp().globalData.token
    let url = `http://localhost:3000/user/web-view?token=${token}`
    // let url = `http://192.168.31.68:3000/user/web-view?token=${token}`
    console.log('token', token);
    this.setData({
      url
    })
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

  }
})