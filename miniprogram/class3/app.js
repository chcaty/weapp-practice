// app.js
require("./lib/extend-page")
import wxp from './lib/wxp'
import Event from './lib/event'
import "weapp-cookie"

App({
  wxp: (wx.wxp = wxp),
  globalData: {},
  globalEvent: new Event(),
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'default-98491d',
        traceUser: true,
      })
    }
    this.globalData = {
      apiUrl: "http://localhost:30000",
      token: ""
    }
  },
  testHeight() {
    // 64、44
    // 右上角胶囊按钮
    var data = wx.getMenuButtonBoundingClientRect()
    console.log('胶囊按钮', data);
    console.log('胶囊按钮高度：', data.height) //32
    console.log('上边界坐标：', data.top) //24
    console.log('下边界坐标：', data.bottom) //56

    // 48
    let res = wx.getSystemInfoSync()
    console.log("screenHeight", res.screenHeight);
    console.log("statusBarHeight", res.statusBarHeight);
    console.log("windowHeight", res.windowHeight);
  }
})
