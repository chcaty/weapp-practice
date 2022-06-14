// index.js
Page({
  data: {
    _content:
    {
      title: "第二章：WebGL组件介绍及使用",
      items: [
        { index: "/pages/2.30/index", name: "小程序canvas绘制3D对象", content: "如何在小程序中展示3D模型？" },
        { index: "/pages/2.30/cube/index", name: "小程序3D对象自由旋转", content: "" },
        { index: "/pages/2.30/threejs/index", name: "threejs-miniprogram绘制3D对象", content: "如何用threejs展示3D模型？" },
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
