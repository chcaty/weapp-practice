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

    const categoryVtabsComponent = this.selectComponent("#category-vtabs")

  },

  // 重新计算高度
  reCalcChildHeight(index) {
    // calcChildHeight
    const goodsContent = this.selectComponent(`#goods-content${index}`)
    const categoryVtabs = this.selectComponent('#category-vtabs')
    categoryVtabs.calcChildHeight(goodsContent)
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
      url: `${getApp().globalData.apiUrl}/goods/goods?page_size=${pageSize}0&page_index=${pageIndex}&category_id=${categoryId}`,
    })

    if (goodsData) {
      goodsData = goodsData.data.data.rows
    }

    if(listMap){
      listMap.pageIndex = pageIndex
      listMap.pageSize = goodsData.count
      listMap.rows.push(...goodsData.rows)
      this.setData({
        [`goodsListMap[${categoryId}]`]: listMap
      })
    }else{
      goodsData.pageIndex = pageIndex
      this.setData({
        [`goodsListMap[${categoryId}]`]:goodsData
      })
    }
    this.reCalcChildHeight(index)
  },

  onCategoryChanged(index) {
    let cate = this.data.vtabs[index]
    let category_id = cate.id
    if (!this.data.goodsListMap[category_id]) {
      this.getGoodsListByCategory(category_id, index, true)
    }
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

  onTabCLick(e) {
    const index = e.detail.index
    console.log('tabClick', index)
    this.onCategoryChanged(index)
  },

  onChange(e) {
    const index = e.detail.index
    console.log('change', index)
  },
})