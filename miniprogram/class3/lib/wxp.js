import {
  promisifyAll
} from 'miniprogram-api-promise';

const wxp = {}
promisifyAll(wx, wxp)

// compatible usage
// wxp.getSystemInfo({success(res) {console.log(res)}})

// 捕捉错误 3.6
wxp.request2 = function (args) {
  let token = wx.getStorageSync('token')
  if (token) {
    if (!args.header) args.header = {}
    args.header['Authorization'] = `Bearer ${token}`
  }
  return wxp.request(args).catch(function (reason) {
    console.log('reason', reason)
  })
}

// 
wxp.request3 = function (args) {
  let token = wx.getStorageSync('token')
  if (!token) {
    return new Promise((resolve, reject) => {
      let pageStack = getCurrentPages()
      if (pageStack && pageStack.length > 0) {
        let currentPage = pageStack[pageStack.length - 1]
        currentPage.setData({
          showLoginPanel2: true
        })
        getApp().globalEvent.once("loginSuccess", () => {
          wxp.request2(args).then(res => {
            resolve(res)
          }, err => {
            console.log('err', err);
            reject(err)
          })
        })
      } else {
        reject('page valid err')
      }
    })
  }
  return wxp.request2(args)
}


// 3.9
// 整合登录
// wxp.request3 = function (args) {
//   let token = wx.getStorageSync('token')
//   if (!token) {
//     let pages = getCurrentPages()
//     let currentPage = pages[pages.length - 1]
//     // 展示登陆浮窗
//     currentPage.setData({
//       showLoginPanel: true
//     })
//     return new Promise((resolve, reject) => {
//       getApp().globalEvent.once('loginSuccess', function (e) {
//         wxp.request2(args).then(function (result) {
//           resolve(result)
//         }).catch(function (reason) {
//           console.log('reason', reason);
//         })
//       })
//     })
//   }
//   return wxp.request2(args).catch(function (reason) {
//     console.log('reason', reason);
//   })
// }

wxp.request4 = function (args) {
  let token = wx.getStorageSync('token')
  if (!token) {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    // 展示登陆浮窗
    currentPage.setData({
      showLoginPanel: true
    })
    return new Promise((resolve, reject) => {
      getApp().globalEvent.once('loginSuccess', function (e) {
        wxp.request2(args).then(function (result) {
          resolve(result)
        }).catch(function (reason) {
          console.log('reason', reason);
        })
      })
    })
  }
  return wxp.request2(args).catch(function (reason) {
    console.log('reason', reason);
  })
}

// class4 用户登录
wxp.request5 = function (args) {
  let token = wx.getStorageSync('token')
  if (token) {
    if (!args.header) args.header = {}
    args.header['Authorization'] = `Bearer ${token}`
  }
  return new Promise((resolve,reject) => {
    let rtbObj = wx.requestWithCookie(
      Object.assign(args,{
        success:resolve,
        fail:reject
      })
    )
    if(args.onReturnObject) args.onReturnObject(rtnObj)
  })
}

export default wxp