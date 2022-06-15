// miniprogram/pages/3.1/index.js
import { loginWithCallback, loginWithCallback2, loginWithCallback3 } from '../../lib/login'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoginPanel: false
  },

  // 3.1 测试一个网络请求，及返回
  startOneRequest() {
    // 正常
    wx.request({
      url: `${getApp().globalData.apiUrl}/hi`,
      success(res) {
        if (res.errMsg === "request:ok") console.log("res1", res)
      },
      fail(err) {
        if (err.errMsg === "request:fail") console.log("err1", err)
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
        if (err.errMsg === "request:fail") console.log("err2", err)
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
        if (err.errMsg === "request:fail") console.log("err3", err)
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

  // 在登陆之后，发起网络请求
  startLoginAndRequest(e) {
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
      requestUserHome(token)
    }

    const login = () => {
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

    wx.checkSession({
      success() {
        let token = wx.getStorageSync('token')
        if (token) {
          onUserLogin(token)
        } else {
          // session会重复，需要处理
          login()
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        login()
      }
    })
  },

  // 在登陆之后，发起网络请求
  startLoginAndRequest2(e) {
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

    // 先判断
    if (wx.getStorageSync('token')) {
      let token = wx.getStorageSync('token')
      requestUserHome(token)
      return
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

    const onUserLogin = (token) => {
      getApp().globalData.token = token
      wx.showToast({
        title: '登陆成功了',
      })
      requestUserHome(token)
    }

    const login = () => {
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

    wx.checkSession({
      success() {
        let token = wx.getStorageSync('token')
        if (token) {
          onUserLogin(token)
        } else {
          // session会重复，需要处理
          login()
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        login()
      }
    })
  },

  // 在登陆之后，发起网络请求
  startLoginAndRequest3(e) {
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

    this.loginWithCallback(e, (token) => {
      requestUserHome(token)
    })
  },

  startLoginAndRequestOther(e) {
    // 调用user/home接口
    const requestUserHome = (token) => {
      wx.request({
        url: `${getApp().globalData.apiUrl}/user/home?name=ly`,
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

    this.loginWithCallback(e, (token) => {
      requestUserHome(token)
    })
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

  // 带有回调的登陆方法
  loginWithCallback(e, cb) {
    let {
      userInfo,
      encryptedData,
      iv
    } = e.detail
    // console.log('userInfo', userInfo);

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
      if (cb && typeof cb === 'function') cb(token)
    }

    const login = () => {
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

    wx.checkSession({
      success() {
        let token = wx.getStorageSync('token')
        if (token) {
          onUserLogin(token)
        } else {
          // session会重复，需要处理
          login()
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        login()
      }
    })
  },

  // 3.4 any
  any() {
    const app = getApp()
    let promise1 = app.wxp.request({ url: `${getApp().globalData.apiUrl}1/` }).catch(err => {
      console.log(err)
      throw err
    }),
      promise2 = app.wxp.request({ url: `${getApp().globalData.apiUrl}/hi` }).catch(console.log),
      promise3 = app.wxp.request({ url: `${getApp().globalData.apiUrl}/user/home` }).catch(console.log)
    let promise = Promise.any([promise1, promise2, promise3])
    promise.then(res => {
      console.log('any promise res', res);
    }, err => {
      console.log('any promise err', err);
    })
  },

  all() {
    const app = getApp()
    let promise1 = app.wxp.request({ url: `${getApp().globalData.apiUrl}/` }),
      promise2 = app.wxp.request({ url: `${getApp().globalData.apiUrl}/hi` }),
      promise3 = app.wxp.request({ url: `${getApp().globalData.apiUrl}/user/home` });
    let promise = Promise.all([promise1, promise2, promise3])
    promise.then(res => {
      console.log('all promise res', res);
    }, err => {
      console.log('all promise err', err);
    })
  },

  race() {
    const app = getApp()
    let promise1 = app.wxp.request({ url: `${getApp().globalData.apiUrl}/` }),
      promise2 = app.wxp.request({ url: `${getApp().globalData.apiUrl}/hi` }),
      promise3 = app.wxp.request({ url: `${getApp().globalData.apiUrl}/user/home` });
    let promise = Promise.race([promise1, promise2, promise3])
    promise.then(res => {
      console.log('race promise res', res);
    }, err => {
      console.log('race promise err', err);
    })
  },

  // 3.5 
  startLoginAndRequestWithPromise(e) {
    // 调用user/home接口
    const requestUserHome = (token) => {
      wx.request({
        url: `${getApp().globalData.apiUrl}/user/home?name=ly`,
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

    loginWithCallback2(e).then((token) => {
      requestUserHome(token)
    })
  },

  // 3.5
  async startLoginAndRequestWithPromise2(e) {
    // 调用user/home接口
    let token = await loginWithCallback3(e)
    let res = await getApp().wxp.request({
      url: `${getApp().globalData.apiUrl}/user/home?name=ly`,
      header: {
        'Authorization': `Bearer ${token}`
      }
    }).catch(err => {
      console.log('err', err);
    })
    console.log('res', res);
  },

  // 3.5
  async startLoginAndRequestWithPromise3(e) {
    // 调用user/home接口
    if (!wx.getStorageSync('token')) {
      await loginWithCallback(e)
    }
    let res = await getApp().wxp.request2({
      url: `${getApp().globalData.apiUrl}/user/home?name=ly`
    })
    console.log('res', res)
  },

  // 3.6
  async requestOneHomeApi(e) {
    let res3 = await getApp().wxp.request2({
      url: `${getApp().globalData.apiUrl}/user/home`,
    })
    if (res3) console.log('res3', res3)
  },
  
  showLoginPanel: async function () {
    this.setData({
      showLoginPanel: true
    })
  },

  // 3.8
  testEvent() {
    const ge = getApp().globalEvent
    function func1(a, b) {
      console.log("a+b", a + b);
      return a + b
    }
    ge.on("event1", func1)
    ge.emit("event1", 1, 2)
    ge.off("event1")
    ge.emit("event1", 1, 2)
  },

  // 3.9
  async requestHomeApi() {
    const app = getApp()

    // 普通接口
    let res1 = await app.wxp.getSystemInfo()
    if (res1) console.log(res1)

    // Uncaught (in promise) thirdScriptError
    // 使用request2
    let res2 = await app.wxp.request2({
      url: `${getApp().globalData.apiUrl}/hi`,
    })
    if (res2) console.log(res2)

    // 一个需要鉴权的接口
    let res3 = await app.wxp.request2({
      url: `${getApp().globalData.apiUrl}/user/home`,
    })
    if (res3) console.log('res3', res3)

    // 使用request3
    let res4 = await app.wxp.request3({
      url: `${getApp().globalData.apiUrl}/user/home`,
    })
    if (res4) console.log('res4', res4)
  },

  // 测试返回对象
  requestHomeApiByReq4() {
    getApp().wxp.request4({
      url: `${getApp().globalData.apiUrl}/user/home`,
      onReturnObject(rtn) {
        rtn.abort()
      }
    }).catch(err => {
      console.log(err);
    })
  },

  // 3.9
  async testRequest3() {
    const app = getApp()
    // 一个需要鉴权的接口
    let res3 = await app.wxp.request2({
      url: `${getApp().globalData.apiUrl}/user/home`,
    })
    if (res3) console.log('res3', res3)

    // 使用request3
    let res4 = await app.wxp.request3({
      url: `${getApp().globalData.apiUrl}/user/home`,
    })
    if (res4) console.log('res4', res4)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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