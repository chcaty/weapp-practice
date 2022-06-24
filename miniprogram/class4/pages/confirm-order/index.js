// pages/confirm-order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [],
    totalPrice: 0,
    payment: 0,
    shipping: 1000,
  },

  calcTotalPrice() {
    let totalPrice = 0
    let shipping = this.data.shipping
    let payment = this.data.payment
    totalPrice = shipping + payment
    this.setData({
      totalPrice
    })
  },

  toSelectAddress(){
    wx.navigateTo({
      url: '/pages/address-list/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let eventChanel = this.getOpenerEventChannel()
    eventChanel.on('cartData', res => {
      this.setData({
        carts: res.data,
        payment: res.payment
      })
      this.calcTotalPrice()
    })
  },
})