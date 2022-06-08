const app = getApp()

Page({
  data: {

  },

  onLoad: function () {
    wx.request({
      url: 'https://wxapi.kkgoo.cn/live/discover?type=hot',
      method: 'POST',
      success: (res) => {
        this.setDis(res);
      }
    })
  },
  setDis(r) {
    let newData = r.data.data;
    this.data.nextKey = newData.nextkey ? newData.nextkey : this.data.nextKey;
    this.setData({
      content: newData.discover ? newData.discover : this.data.content,
      banneritem: newData.cards ? newData.cards.slice(0, newData.cards.length - 1) : this.data.banneritem
    })
  },
  previewImage(e) {
    console.log(e);
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url,
      urls: [url],
    })
  }
})