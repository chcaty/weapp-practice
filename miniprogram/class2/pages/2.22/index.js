// miniprogram/pages/2.22/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
  },

  onShareAppMessage: function () {
    console.log('分享')
    return {
      title: '登陆',
      path: '/pages/2.22/index'
    }
  },

  login(e) {
    console.log(e);
    let {
      userInfo,
      encryptedData,
      iv
    } = e.detail
    console.log('userInfo', userInfo);
    const requestLoginApi = (code) => {
      //发起网络请求
      wx.request({
        url: `${getApp().globalData.apiUrl}/user/wexin-login2`,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          code: code,
          userInfo,
          encryptedData,
          iv
        },
        success(res) {
          console.log('请求成功', res.data)
          let token = res.data.data.authorizationToken
          wx.setStorageSync('token', token)
          onUserLogin(token)
          console.log('authorization', token)
        },
        fail(err) {
          console.log('请求异常', err)
        }
      })
    }

    const onUserLogin = (token) => {
      getApp().globalData.token = token
      wx.showToast({
        title: '登陆成功了',
      })
    }

    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        console.log('在登陆中');
        let token = wx.getStorageSync('token')
        if (token) onUserLogin(token)
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success(res0) {
            if (res0.code) {
              requestLoginApi(res0.code)
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })
  },

  // 旧登陆方法
  login2(e) {
    console.log(e);
    let { userInfo,
      encryptedData,
      iv } = e.detail
    wx.login({
      success(res0) {
        if (res0.code) {
          //发起网络请求
          wx.request({
            url: `${getApp().globalData.apiUrl}/user/wexin-login2`,
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              code: res0.code,
              userInfo,
              encryptedData,
              iv
            },
            success(res) {
              console.log('请求成功', res.data)
              getApp().globalData.token = res.data.data.authorizationToken
              console.log('authorization', getApp().globalData.token)
            },
            fail(err) {
              console.log('请求异常', err)
            }
          })


        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
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

  // 重复的函数，会重写，导致不易发现的bug
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})