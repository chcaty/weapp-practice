// index.js
Page({
  data: {
    _content:
    {
      title: "第二章：WebGL组件介绍及使用",
      items: [
        { index: "/pages/2.30/index", name: "小程序canvas绘制3d对象", content: "如何在小程序中展示3D模型" },
        { index: "/pages/2.30/cube/index", name: "progress组件", content: "如何自定义实现一个环形进度条？" },
        { index: "/pages/2.30/threejs/index", name: "rich-text组件", content: "如何单击预览rich-text中的图片并保存？" },
      ]
    },
    get array() {
      return this._array;
    },
    set array(value) {
      this._array = value;
    },
  }
})
