function loginWithCallback(e, cb) {
  let {
    userInfo,
    encryptedData,
    iv
  } = e.detail
  // console.log('userInfo', userInfo);

  const requestLoginApi = (code) => {
    //发起网络请求
    wx.request({
      url: 'http://localhost:3000/user/wexin-login2',
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
}

function loginWithCallback2(e) {
  return new Promise((resolve, reject) => {
    let {
      userInfo,
      encryptedData,
      iv
    } = e.detail
    // console.log('userInfo', userInfo);

    const requestLoginApi = (code) => {
      //发起网络请求
      wx.request({
        url: 'http://localhost:3000/user/wexin-login2',
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
          reject(err)
        }
      })
    }

    const onUserLogin = (token) => {
      getApp().globalData.token = token
      wx.showToast({
        title: '登陆成功了',
      })
      resolve(token)
    }

    const login = () => {
      wx.login({
        success(res0) {
          if (res0.code) {
            requestLoginApi(res0.code)
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        },
        fail(err) {
          reject(err)
        }
      })
    }

    getApp().wxp.checkSession().finally(res => {
      let token = wx.getStorageSync('token')
      if (token) {
        onUserLogin(token)
      } else {
        // session会重复，需要处理
        login()
      }
    })

  })

}

function loginWithCallback3(e) {
  return new Promise(async (resolve, reject) => {
    let {
      userInfo,
      encryptedData,
      iv
    } = e.detail

    const app = getApp()
    try {
      await app.wxp.checkSession()
    } catch (err) {
      // reject(err) 这里不能reject
    }
    let token = wx.getStorageSync('token')
    if (!token) {
      let res1 = await app.wxp.login().catch(err => {
        reject(err)
      })
      let code = res1.code
      let res = await app.wxp.request({
        url: 'http://localhost:3000/user/wexin-login2',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          code: code,
          userInfo,
          encryptedData,
          iv
        }
      }).catch(err => {
        reject(err)
      })
      token = res.data.data.authorizationToken
      wx.setStorageSync('token', token)
    }
    getApp().globalData.token = token
    wx.showToast({
      title: '登陆成功了',
    })
    resolve(token)

  })

}

export default loginWithCallback3