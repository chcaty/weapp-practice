// pages/address-list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedAddressId: 0,
    addressList: [],
    slideButtons: [{
      type: 'warn',
      text: '删除'
    }]
  },

  onAddressIdChange(e) {
    this.setData({
      selectedAddressId: e.detail
    })
  },

  getAddressFromWeixin() {
    if (wx.canIUse('chooseAddress.success.userName')) {
      wx.chooseAddress({
        success: (result) => {
          console.log(result);
          let addressList = this.data.addressList;
          let addressContained = addressList.find(item => item.telNumber == result.telNumber)
          if (addressContained) {
            this.setData({
              selectedAddressId: addressContained.id,
            })
            return
          }
          let addresss = {
            id: addressList.length + 1,
            userName: result.userName,
            telNumber: result.telNumber,
            region: [result.provinceName, result.cityName, result.countyName],
            detailInfo: result.detailInfo
          }
          addressList.push(addresss)
          this.setData({
            selectedAddressId: addresss.id,
            addressList
          })
        },
      })
    }
  },

  edit(e) {
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id
    let addressList = this.data.addressList
    let address = addressList.find(item => item.id == id)
    wx.navigateTo({
      url: '/pages/new-address/index',
      success: (res) => {
        res.eventChannel.emit('editAddress', address)
        res.eventChannel.on('savedNewAddress', this.onSavedAddress)
      }
    })
  },

  onSavedAddress(address) {
    console.log(address);
    console.log(this.data)
    let addressList = this.data.addressList
    let hasExist = addressList.some((item, index) => {
      if (item.id == address.id) {
        addressList[index] = address
        return true
      }
      return false
    })
    if (!hasExist) {
      addressList.push(address)
    }
    this.setData({
      addressList,
      selectedAddressId: address.id
    })
  },

  navigateToNewAddressPage(e) {
    wx.navigateTo({
      url: '/pages/new-address/index',
      success: (res) => {
        res.eventChannel.on("savedNewAddress", this.onSavedAddress)
      }
    })
  },

  async onSlideButtonTap(e) {
    let id = e.currentTarget.dataset.id
    let res = await wx.wxp.requestByLoginPanel({
      url: `${getApp().globalData.apiUrl}/user/my/address/${id}`,
      method: "delete"
    })
    if (res && res.data.msg == "ok") {
      let addressList = this.data.addressList
      for (let j = 0; j < addressList.length; j++) {
        if (addressList[j].id == id) {
          addressList.splice(j, 1)
          break
        }
      }
      this.setData({
        addressList
      })
    }
  },

  confirm() {
    let selectedAddressId = this.data.selectedAddressId
    let addressList = this.data.addressList
    let item = addressList.find(item => item.id == selectedAddressId)
    let opener = this.getOpenerEventChannel()
    opener.emit('selectAddress', item)
    wx.navigateBack({
      delta: 1,
    })
  },

  async onLoad() {
    let res = await wx.wxp.requestByLoginPanel({
      url: `${getApp().globalData.apiUrl}/user/my/address`,
      method: 'get'
    })
    let addressList = res.data.data
    let selectedAddressId = addressList[0].id
    this.setData({
      addressList,
      selectedAddressId
    })
  }
})