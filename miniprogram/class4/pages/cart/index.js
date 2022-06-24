// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartIdSelectedResult: [],
    showSkuPanel: false,
    allIsSelected: false,
    editMode: false,
    totalPrice: 0,
    carts: []
  },

  onSelectGoodsItem(e) {
    let cartIdSelectedResult = e.detail
    this.setData({
      cartIdSelectedResult
    })
    this.calcTotalPrice()
  },

  onSelectAll(e) {
    let allIsSelected = e.detail
    let cartIdSelectedResult = this.data.cartIdSelectedResult
    cartIdSelectedResult.length = 0
    if (allIsSelected) {
      let carts = this.data.carts
      for (let j = 0; j < carts.length; j++) {
        cartIdSelectedResult.push(`${carts[j].id}`)
      }
    }
    this.setData({
      allIsSelected,
      cartIdSelectedResult
    })
    this.calcTotalPrice()
  },

  changeEditMode() {
    let editMode = !this.data.editMode
    this.setData({
      editMode
    })
  },

  async onCartGoodsNumChanged(e) {
    let cartGoodsId = e.currentTarget.dataset.id
    let oldNum = e.currentTarget.dataset.num
    let num = Number(e.detail)
    let data = { num }

    let res = await getApp().wxp.requestByLoginPanel({
      url: `${getApp().globalData.apiUrl}/user/my/carts/${cartGoodsId}`,
      method: 'put',
      data
    })
    if (res.data.msg == 'ok') {
      wx.showToast({
        title: num > oldNum ? '增加成功' : '减少成功',
      })
      let cartIdSelectedResult = this.data.cartIdSelectedResult
      var isExist = cartIdSelectedResult.some(item => {
        if (item == `${cartGoodsId}`) {
          return true
        }
        return false
      })
      if (!isExist) {
        cartIdSelectedResult.push(`${cartGoodsId}`)
      }
      this.setData({
        cartIdSelectedResult
      })
      let carts = this.data.carts
      carts.some(item => {
        if (item.id == cartGoodsId) {
          item.num = num
          return true
        }
        return false
      })
    }
    this.calcTotalPrice()
  },

  async removeCartGoods() {
    let ids = this.data.cartIdSelectedResult
    console.log(ids);
    if (ids.length == 0) {
      wx.showModal({
        title: "没有选中需要删除的商品",
        showCancel: false
      })
      return
    }
    let data = { ids }
    let res = await getApp().wxp.requestByLoginPanel({
      url: `${getApp().globalData.apiUrl}/user/my/carts`,
      method: "delete",
      data
    })
    if (res.data.msg == 'ok') {
      let carts = this.data.carts
      for (let j = 0; j < ids.length; j++) {
        let id = ids[j]
        carts.some((item, index) => {
          if (item.id == id) {
            carts.splice(index, 1)
            return true
          }
          return false
        })
      }
      this.setData({
        carts
      })
    }

  },

  calcTotalPrice() {
    let totalPrice = 0
    let carts = this.data.carts
    let ids = this.data.cartIdSelectedResult
    ids.forEach(id => {
      carts.some(item => {
        if (item.id == id) {
          totalPrice += item.price * item.num
          return true
        }
        return false
      })
    })
    this.setData({
      totalPrice
    })
  },

  onClickButton() {
    let ids = this.data.cartIdSelectedResult
    let payment = this.data.totalPrice
    if (ids.length == 0) {
      wx, showModal({
        title: '请选择要下单的商品',
        showCancel: false
      })
      return
    }
    let cartData = []
    let carts = this.data.carts
    ids.forEach(id => {
      carts.forEach(item => {
        if (item.id == id) {
          cartData.push(Object.assign({}, item))
          return true
        }
        return false
      })
    })
    wx.navigateTo({
      url: '/pages/confirm-order/index',
      success:res=>
      res.eventChannel.emit('cartData',{data:cartData,payment})
    })
  },

  onShow: async function () {
    let res = await getApp().wxp.requestByLoginPanel({
      url: `${getApp().globalData.apiUrl}/user/my/carts`,
      method: 'get'
    })
    if (res.data.msg == "ok") {
      let carts = res.data.data
      this.setData({
        carts
      })
    }
  }
})