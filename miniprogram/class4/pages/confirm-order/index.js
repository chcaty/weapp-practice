// pages/confirm-order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [],
    totalPrice: 1000,
    payment: 0,
    shipping: 1000,
    address: {
      userName: '选择',
    }
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

  toSelectAddress() {
    wx.navigateTo({
      url: '/pages/address-list/index',
      success: res => {
        res.eventChannel.on('selectAddress', address => {
          console.log(address);
          address.addressInfo = address.region.join(' ') + address.detailInfo
          this.setData({
            address
          })
        })
      }
    })
  },

  async onSubmit() {
    if (!this.data.address.id) {
      wx.showModal({
        title: "请选择收货地址",
        showCancel: false
      })
      return
    }
    let address = this.data.address
    let addressDesc = `${address.userName} ${address.telNumber} ${address.region.join(' ')} ${address.detailInfo}`
    let carts = this.data.carts
    let goodsCartsIds = carts.map(item => item.id)
    let goodsNameDesc = carts.map(item => `${item.goods_name} (${item.goods_sku_desc}) x${item.num}`).join(' ')
    if (goodsNameDesc.length > 200) goodsNameDesc = goodsNameDesc.substr(0, 198) + '..'
    let data = {
      totalFee: this.data.totalPrice,
      addressId: address.id,
      addressDesc,
      goodsCartsIds,
      goodsNameDesc
    }
    let res = await wx.wxp.requestByLoginPanel({
      url: `${getApp().globalData.apiUrl}/user/my/order`,
      method: 'post',
      data
    })
    console.log(res);
    let payArgs = res.data.data.params
    wx.requestPayment({
      nonceStr: payArgs.nonceStr,
      package: payArgs.package,
      paySign: payArgs.paySign,
      timeStamp: payArgs.timeStamp,
      signType: payArgs.signType,
      success: (res1) => {
        console.log('success', res1);
        if (res1.errMsg == 'requestPayment:ok') {
          wx.showModal({
            title: "支付成功",
            showCancel: false,
            success: () => {
              this.removeCartsGoods(goodsCartsIds)
            }
          })
        } else {
          wx.showModal({
            title: "支付取消或失败，请稍后重试",
            showCancel: false
          })

        }
      },
      fail: (err1) => {
        console.log('fail', err1);
      }
    })
  },

  async removeCartsGoods(goodsCardsIds) {
    let data = {
      ids: goodsCardsIds
    }
    let res2 = await wx.wxp.requestByLoginPanel({
      url: `${getApp().globalData.apiUrl}/user/my/carts`,
      method: 'delete',
      data
    })
    console.log('res2', res);
    if (res2.data.msg == 'ok') {
      wx.switchTab({
        url: '/pages/cart/index',
      })
    } else {
      wx.showModal({
        title: '更新购物车数据失败',
        showCancel: false
      })
    }
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