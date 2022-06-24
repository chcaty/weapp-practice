// pages/address-list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedAddressId: 0,
    addressList: [
      {
        id: 0,
        userName: 'caty',
        telNumber: "13800138000",
        region: ['北京市', '北京市', '东城区'],
        detailInfo: '详细地址'
      },
      {
        id: 1,
        userName: 'cat',
        telNumber: "13800138000",
        region: ['北京市', '北京市', '东城区'],
        detailInfo: '详细地址'
      },
      {
        id: 2,
        userName: 'chan',
        telNumber: "13800138000",
        region: ['北京市', '北京市', '东城区'],
        detailInfo: '详细地址'
      }
    ]
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
            id: addressList.length,
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

  async getAddressList(){

  }
})