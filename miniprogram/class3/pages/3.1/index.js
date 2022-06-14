// pages/3.1/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  startOneRequest() {
    // 正常
    wx.request({
      url: `${getApp().globalData.apiUrl}/hi`,
      success(res) {
        if (res.errMsg === "request:ok") console.log("res1", res)
      },
      fail(err) {
        if (/^request:fail/.test(err.errMsg)) console.log("err1", err)
      },
      complete(resOrErr) {
        console.log("resOrErr1", resOrErr)
      }
    })

    // 错误
    wx.request({
      url: `${getApp().globalData.apiUrl}/err`,
      success(res) {
        if (res.errMsg === "request:ok") console.log("res2", res)
      },
      fail(err) {
        if (/^request:fail/.test(err.errMsg)) console.log("err2", err)
      },
      complete(resOrErr) {
        console.log("resOrErr2", resOrErr)
      }
    })

    // 取消
    let reqTask = wx.request({
      url: `${getApp().globalData.apiUrl}/err`,
      success(res) {
        if (res.errMsg === "request:ok") console.log("res3", res)
      },
      fail(err) {
        if (/^request:fail/.test(err.errMsg)) console.log("err3", err)
      },
      complete(resOrErr) {
        // 被取消时，也会被调用
        console.log("resOrErr3", resOrErr)
      }
    })
    const headersReceivedCallback = function (headers) {
      // "use strict"
      reqTask.offHeadersReceived(headersReceivedCallback)
      console.log('headers', headers);
      // Protected resource = 18 chars
      // 能拿到这个长度，可能数据已经返回了，可以基于其它逻辑实施abort
      if (~~headers.header['Content-Length'] < 19) reqTask.abort()
    }
    reqTask.onHeadersReceived(headersReceivedCallback)
    // reqTask.abort()
  },

  login(e) {
    const startOneRequest = (token) => {
      wx.request({
        url: `${getApp().globalData.apiUrl}/user/home?name=ly`,
        header:{
          "Authorization":`Bearer ${token}`
        },
        success(res) {
          if (res.errMsg === "request:ok") console.log('res3', res);
        },
        fail(err) {
          if (/^requsert:fail/.test(err.errMsg)) console.log('err3', err);
        },
        complete(res) {
          console.log('resOrErr3',res)
        }
      })
    }
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
    
    let token = wx.getStorageSync('token')
    if(token){
      
    }

    const onUserLogin = (token) => {
      getApp().globalData.token = token
      wx.showToast({
        title: '登陆成功了',
      })
      startOneRequest(token)
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

  },
})