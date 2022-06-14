// miniprogram/pages/2.30/index.js
import drawRectangle from './draw-rectangle'
import drawColorRectangle from './draw-color-rectangle'
import drawAnimationRectangle from './draw-animation-rectangle'
import drawCube from './draw-cube'
import drawTextureCube from './draw-texture-cube'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    _canvas: [
      { name: "画一个正方形", canvasId: "myCanvas1" },
      { name: "给正方形加点颜色", canvasId: "myCanvas2" },
      { name: "动画", canvasId: "myCanvas3" },
      { name: "立体的", canvasId: "myCanvas4" },
      { name: "贴材质", canvasId: "myCanvas5" },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.createSelectorQuery()
      .select('#myCanvas1')
      .node()
      .exec((res) => {
        const canvas = res[0].node
        const gl = canvas.getContext('webgl')
        if (!gl) {
          console.log('webgl未受支持');
          return
        }

        // 检查所有支持的扩展
        var available_extensions = gl.getSupportedExtensions();
        console.log(available_extensions);

        // 清除画布
        // 使用完全不透明的黑色清除所有图像，我们将清除色设为黑色，此时并没有开始清除
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // 用上面指定的颜色清除缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 画的是一个正方形
        drawRectangle(gl)

        // 给正方形加点颜色
        //drawColorRectangle(gl)

        // 动画
        // drawAnimationRectangle(gl,canvas)

        // 立体的
        // drawCube(gl, canvas)

        // 贴材质
        // drawTextureCube(gl, canvas)


        // var ext = gl.getExtension('EXT_color_buffer_float');
        // gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA16F, 256, 256);


        // 创建一个与 canvas 绑定的 three.js
        // const THREE = createScopedThreejs(canvas)
        // 传递并使用 THREE 变量
      })
    wx.createSelectorQuery()
      .select('#myCanvas2')
      .node()
      .exec((res) => {
        const canvas = res[0].node
        const gl = canvas.getContext('webgl')
        if (!gl) {
          console.log('webgl未受支持');
          return
        }

        // 检查所有支持的扩展
        var available_extensions = gl.getSupportedExtensions();
        console.log(available_extensions);

        // 清除画布
        // 使用完全不透明的黑色清除所有图像，我们将清除色设为黑色，此时并没有开始清除
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // 用上面指定的颜色清除缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 给正方形加点颜色
        drawColorRectangle(gl)
      })
    wx.createSelectorQuery()
      .select('#myCanvas3')
      .node()
      .exec((res) => {
        const canvas = res[0].node
        const gl = canvas.getContext('webgl')
        if (!gl) {
          console.log('webgl未受支持');
          return
        }

        // 检查所有支持的扩展
        var available_extensions = gl.getSupportedExtensions();
        console.log(available_extensions);

        // 清除画布
        // 使用完全不透明的黑色清除所有图像，我们将清除色设为黑色，此时并没有开始清除
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // 用上面指定的颜色清除缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 动画
        drawAnimationRectangle(gl,canvas)
      })
    wx.createSelectorQuery()
      .select('#myCanvas4')
      .node()
      .exec((res) => {
        const canvas = res[0].node
        const gl = canvas.getContext('webgl')
        if (!gl) {
          console.log('webgl未受支持');
          return
        }

        // 检查所有支持的扩展
        var available_extensions = gl.getSupportedExtensions();
        console.log(available_extensions);

        // 清除画布
        // 使用完全不透明的黑色清除所有图像，我们将清除色设为黑色，此时并没有开始清除
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // 用上面指定的颜色清除缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 立体的
        drawCube(gl, canvas)
      })
    wx.createSelectorQuery()
      .select('#myCanvas5')
      .node()
      .exec((res) => {
        const canvas = res[0].node
        const gl = canvas.getContext('webgl')
        if (!gl) {
          console.log('webgl未受支持');
          return
        }

        // 检查所有支持的扩展
        var available_extensions = gl.getSupportedExtensions();
        console.log(available_extensions);

        // 清除画布
        // 使用完全不透明的黑色清除所有图像，我们将清除色设为黑色，此时并没有开始清除
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // 用上面指定的颜色清除缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 贴材质
        drawTextureCube(gl, canvas)
      })
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