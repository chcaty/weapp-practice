// index.js
Page({
  data: {
    _content:
    {
      title: "第三章：微信小程序开发常用的API介绍及使用",
      items: [
        { index: "/pages/3.1/index", name: "wx.request", content: "网络请求", type: "navigate" },
        { index: "/pages/3-10/index", name: "原生tabBar组件-切换Tab页", content: "系统默认的tabBar组件,仅能用于首页配置。app.json文件中tabBar节点custom设置为false", type: "switchTab" },
        { index: "/pages/3-10/custom/index", name: "原生tabBar组件-跳转", content: "", type: "navigate" },
        { index: "/pages/3-10/index", name: "自定义tabBar组件", content: "基于系统提供的自定义方式，实现一个tabBar组件。app.json文件中tabBar节点custom设置为ture", type: "switchTab" },
        { index: "/pages/3.12/index", name: "自定义组件拓展", content: "给任意组件添加通用方法", type: "navigate" },
        { index: "/pages/3.13/index", name: "开放接口", content: "如何对Page进行全局扩展", type: "navigate" },
        { index: "/pages/3.15/index", name: "设备能力", content: "如何实现扫码连wifi功能", type: "navigate" },
      ]
    }
  }, 
  onLoad(options) {
    getApp().testHeight()
  },
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
})
