// pages/goods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId: 0,
    goodsData: {},
    goodsImages: [],
    showSkuPanel: false,
    goodsContentInfo: {},
    goodsSkuData: {},
    selectedGoodsSku: {},
    selectedAttrValue: {},
    selectedGoodsSkuObject: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let goodsId = options.goodsId
    this.data.goodsId = options.goodsId
    const eventChannel = this.getOpenerEventChannel()
    if (eventChannel != undefined && eventChannel.on != null) {
      eventChannel.on('goodsData', (res) => {
        console.log(res)
        let goodsImages = res.data.goods_infos.filter(item => (item.kind == 0))
        let goodsContentInfo = res.data.goods_infos.filter(item => (item.kind == 1))[0]
        this.setData({
          goodsId,
          goodsData: res.data,
          goodsImages,
          goodsContentInfo
        })
      })
    } else {
      let goods = await wx.wxp.request({
        url: `${getApp().globalData.apiUrl}/goods/${goodsId}`,
      })
      if (goods) {
        goods = goods.data.data
      }
      let goodsImages = goods.goods_infos.filter(item => (item.kind == 0))
      let goodsContentInfo = goods.goods_infos.filter(item => (item.kind == 1))[0]
      this.setData({
        goodsData: goods,
        goodsImages,
        goodsContentInfo
      })
    }

    let goodsSkuDataRes = await wx.wxp.request({
      url: `${getApp().globalData.apiUrl}/goods/${goodsId}/sku`,
    })
    if (goodsSkuDataRes) {
      let goodsSkuData = goodsSkuDataRes.data.data
      this.setData({
        goodsSkuData
      })
    }
  },

  // 显示规格面板
  showSkuPanelPopup() {
    this.setData({ showSkuPanel: true });
  },

  // 关闭规格面板
  onCloseSkuPanel() {
    this.setData({ showSkuPanel: false });
  },

  // 获取及设置选择的规格
  onTapSkuTag(e) {
    let attrvalue = e.currentTarget.dataset.attrvalue
    let attrKey = e.currentTarget.dataset.attrkey

    console.log('attrvalueid', attrvalue, attrKey);
    let selectedAttrValue = this.data.selectedAttrValue
    selectedAttrValue[attrKey] = attrvalue
    this.setData({
      selectedAttrValue
    })
    // 计算价格及库存
    let totalIdValue = 0
    let goodsAttrKeys = this.data.goodsSkuData.goodsAttrKeys
    for (let j = 0; j < goodsAttrKeys.length; j++) {
      let attrKey = goodsAttrKeys[j].attr_name
      if (selectedAttrValue[attrKey]) {
        totalIdValue += selectedAttrValue[attrKey].id
      }
    }
    console.log("totalIdValue", totalIdValue);

    let goodsSku = this.data.goodsSkuData.goodsSku
    let tempTotalIdValue = 0

    for (let j = 0; j < goodsSku.length; j++) {
      let goodsAttrPath = goodsSku[j].goods_attr_path
      if (goodsAttrPath.length != goodsAttrKeys.length) {
        break
      }
      tempTotalIdValue = 0
      goodsAttrPath.forEach(item => tempTotalIdValue += item)
      console.log("tempTotalIdValue", tempTotalIdValue);

      if (tempTotalIdValue == totalIdValue) {
        let selectedGoodsSku = goodsSku[j]
        this.setData({
          selectedGoodsSku
        })
        break;
      }
    }
  },

  // 确定选择当前规格
  onConfirmGoodsSku() {
    let goodsSkuData = this.data.goodsSkuData
    let selectedGoodsSkuObject = this.data.selectedGoodsSkuObject
    selectedGoodsSkuObject.sku = Object.assign({}, this.data.selectedGoodsSku)
    selectedGoodsSkuObject.text = ''
    for (let j = 0; j < goodsSkuData.goodsAttrKeys.length; j++) {
      let item = goodsSkuData.goodsAttrKeys[j]
      if (!this.data.selectedAttrValue[item.attr_name]) {
        wx.showModal({
          title: '没有选择全部规格',
          showCancel: false,
        })
        return
      }
      selectedGoodsSkuObject.text += this.data.selectedAttrValue[item.attr_name].attr_value + ' '
    }
    this.setData({
      selectedGoodsSkuObject,
      showSkuPanel: false
    })
  },

  // 加入购物车
  async addToCart() {
    if (!this.data.selectedGoodsSkuObject.sku) {
      wx.showModal({
        title: '请选择商品规格',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            this.showSkuPanelPopup();
          }
        }
      })
      return
    }
    let goods_id = this.data.goodsId
    let goods_sku_id = this.data.selectedGoodsSkuObject.sku.id
    let goods_sku_desc = this.data.selectedGoodsSkuObject.text
    let data = {
      goods_id,
      goods_sku_id,
      goods_sku_desc
    }
    let res = await getApp().wxp.requestByLoginPanel({
      url: `${getApp().globalData.apiUrl}/user/my/carts`,
      method: 'post',
      data
    })
    if (res.data.msg == 'ok') {
      wx.showToast({
        title: '已添加',
      })
    }
  },
})