// index.js
Page({
  data: {
    _array: [
      {
        title: "第二章：微信小程序组件介绍及使用",
        items: [
          { index: "/pages/2.1/index", name: "icon组件", content: "关于图标的4个实现方案" },
          { index: "/pages/2.2/index", name: "progress组件", content: "如何自定义实现一个环形进度条？" },
          { index: "/pages/2.3/index", name: "rich-text组件", content: "如何单击预览rich-text中的图片并保存？" },
          { index: "/pages/2.4_2.5/index", name: "view容器组件及Flex布局", content: "一个view如何实现所有常见的UI布局？" },
          { index: "/pages/2.6_2.7/index", name: "可移动容器及可移动区域", content: "如何实现单条消息左滑删除功能？" },
          { index: "/pages/2.6_2.7/render-wxml/index", name: "weui-canvas", content: "如何生成海报" },
          { index: "/pages/2.8_2.9/index", name: "scroll-view", content: "如何实现滚动锚定和渲染一个滚动的长列表" },
          { index: "/pages/vtabs/index", name: "vtabs", content: "动态状态栏切换" },
          { index: "/pages/2.10/index", name: "滚动选择器", content: "如何自定义省市区多级联动选择器？" },
          { index: "/pages/2.12/index", name: "滑动选择器", content: "如何wsxz自定义一个属相的slider？" },
          { index: "/pages/2.13/index", name: "页面链接组件", content: "如何自定义一个导航栏？" },
          { index: "/pages/2.14/index", name: "image媒体组件", content: "如何实现图片的懒加载" },
        ]
      }
    ],
    get array() {
      return this._array;
    },
    set array(value) {
      this._array = value;
    },
  }
})
