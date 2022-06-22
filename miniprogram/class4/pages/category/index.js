// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vtabs: [],
    activeTab: 0,
    goodsListMap: {},
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    let categories = await wx.wxp.request({
      url: `${getApp().globalData.apiUrl}/goods/categories`,
    })

    if (categories) categories = categories.data.data
    let vtabs = []
    for (let j = 0; j < categories.length; j++) {
      let item = categories[j]
      if (j < 3) this.getGoodsListByCategory(item.id, j)
      // this.getGoodsListByCategory(item.id)
      vtabs.push({ title: item.category_name, id: item.id })
    }

    this.setData({
      vtabs,
      loading: false
    })

    wx.hideLoading()
  },

  onTabCLick(e) {
    const index = e.detail.index
    console.log('tabClick', index)
    this.onCategoryChanged(index)
  },

  onChange(e) {
    const index = e.detail.index
    console.log('change', index)
  },

  onCategoryChanged(index) {
    let cate = this.data.vtabs[index]
    let category_id = cate.id
    if (!this.data.goodsListMap[category_id]) {
      this.getGoodsListByCategory(category_id, index, true)
    }
  },

  // 重新计算高度
  reCalcChildHeight(index) {
    // calcChildHeight
    const goodsContent = this.selectComponent(`#goods-content${index}`)
    const categoryVtabs = this.selectComponent('#category-vtabs')
    categoryVtabs.calcChildHeight(goodsContent)
  },

  onScrollToIndexLower(e) {
    console.log("scroll to index lower", e.detail);
    let index = e.detail.index;
    if (index != this.data.lastIndexForLoadMore) {
      let cate = this.data.vtabs[index]
      let categoryId = cate.id
      this.getGoodsListByCategory(categoryId, index, true)
      this.data.lastIndexForLoadMore = index
    }
  },

  async getGoodsListByCategory(categoryId, index, loadNextPage = false) {
    const pageSize = 10
    let pageIndex = 1
    let listMap = this.data.goodsListMap[categoryId]

    if (listMap) {
      if (listMap.rows.length >= listMap.count) return
      if (listMap.pageIndex) {
        pageIndex = listMap.pageIndex
        if (loadNextPage) pageIndex++
      }
    }

    let goodsData = await wx.wxp.request({
      url: `${getApp().globalData.apiUrl}/goods/list?page_size=${pageSize}&page_index=${pageIndex}&category_id=${categoryId}`,
    })

    console.log(goodsData);
    if (goodsData) {
      goodsData = goodsData.data.data
    }
    console.log(goodsData);

    if (listMap) {
      listMap.pageIndex = pageIndex
      listMap.pageSize = goodsData.count
      listMap.rows.push(...goodsData.rows)
      console.log(listMap);
      this.setData({
        [`goodsListMap[${categoryId}]`]: listMap
      })
    } else {
      goodsData.pageIndex = pageIndex
      this.setData({
        [`goodsListMap[${categoryId}]`]: goodsData
      })
    }
    this.reCalcChildHeight(index)
  },

  async onTapGoods(e) {
    wx.showLoading({
      title: 'Loading..',
    })
    let goodsId = e.currentTarget.dataset.id
    let goods = await wx.wxp.request({
      url: `${getApp().globalData.apiUrl}/goods/${goodsId}`,
    })
    console.log(goods)

    if (goods) {
      goods = goods.data.data
      wx.navigateTo({
        url: `/pages/goods/index?goodsId=${goodsId}`,
        success: function (res) {
          res.eventChannel.emit('goodsData', { data: goods })
        }
      })
    }
    wx.hideLoading()
  },
})