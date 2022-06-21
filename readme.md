### 如何运行此项目

1. 需要一个有绑定小程序开发者的微信号，因为weui拓展库引入的方式需要用到真实的appid
2. 需要用到npm安装一部分额外的包，然后在微信开发者工具中进行工具->构建npm操作，才能确保额外组件的正常引入

### Tips

1. 第四章中对vtabs的源码进行了部分修改，如下

```js
// index.js
handleContentScroll: function handleContentScroll(e) {
    var _heightRecords = this.data._heightRecords;
    if (_heightRecords.length === 0) return;
    var length = this.data.vtabs.length;
    var scrollTop = e.detail.scrollTop;
    var index = -1;
    // 增加窗口高度
    const windowHeight = wx.getSystemInfoAsync().windowHeight
    if (scrollTop >= _heightRecords[this.data.activeTab] - windowHeight - 150) {
        this.triggerEvent('scrolltoindexlower', {
            index: this.data.activeTab
        });
    }
    if (scrollTop >= _heightRecords[0] - windowHeight) {
        for (var i = 1; i < length; i++) {
            if (scrollTop >= _heightRecords[i - 1] - windowHeight && scrollTop < _heightRecords[i] - windowHeight) {
                index = i;
                break;
            }
        }
    } else {
        index = 0
    }
    if (index > -1 && index !== this.data.activeTab) {
        this.triggerEvent('change', {
            index: index
        });
        this.setData({
            activeTab: index
        });
    }
}
```
