import {
  promisifyAll
} from 'miniprogram-api-promise';

const wxp = {}
promisifyAll(wx, wxp)

wxp.requestWithToken = function (args) {
  let token = wx.getStorageSync('token')
  if (token) {
    if (!args.header) args.header = {}
    args.header['Authorization'] = `Bearer ${token}`
  }
  console.log(args.url);
  if (args.url) args.url = args.url
  return wxp.request(args).catch(function (reason) {
    console.log('reason', reason)
  })
}

wxp.requestByLoginPanel = function (args) {
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
        wxp.requestWithToken(args).then(function (result) {
          resolve(result)
        }).catch(function (reason) {
          console.log('reason', reason);
        })
      })
    })
  }
  return wxp.requestWithToken(args).catch(function (reason) {
    console.log('reason', reason);
  })
}
export default wxp