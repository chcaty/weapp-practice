
// 派发一个等待处理，需要有代码处理的事件x
// Component.prototype.triggerWaitingEvent = function(type, data = {}){
//   return new Promise((resolve,reject)=>{
//     let eventCallback = res => resolve(res)
//     Object.assign(data, {
//       eventCallback
//     })
//     this.triggerEvent(type, data)
//   })
// }

Component({
  behaviors: [require('../../lib/event-behavior.js')],
    properties: {
        index: {
            type: Number,
            value: 0
        }
    },
    data: {
      selected: 0,
      list: [{
        pagePath: "/pages/3.12/index",
        iconPath: "/components/custom-tab-bar/component.png",
        selectedIconPath: "/components/custom-tab-bar/component-on.png",
        text: "index",
        iconClass:"icon-homefill",
        iconTopClass:""
      }, {
        pagePath: "/pages/3.12/index2/index",
        iconPath: "/components/custom-tab-bar/component.png",
        selectedIconPath: "/components/custom-tab-bar/component-on.png",
        text: "index",
        iconClass:"cu-btn icon-add bg-green shadow",
        iconTopClass:"add-action"
      },{
        pagePath: "/pages/3.12/index3/index",
        iconPath: "/components/custom-tab-bar/component.png",
        selectedIconPath: "/components/custom-tab-bar/component-on.png",
        text: "自定义",
        iconClass:"icon-my",
        iconTopClass:""
      }]
    },
    observers: {
      "index": function (id) {
        this.setData({ selected: id});
      }
    },
    methods: {
      async goToTab(e){
        let targetPageUrl = e.currentTarget.dataset.url 
        
        // 派发一个事件，让外部业务代码处理，待处理完了，再回到这里
        let pageData = await this.triggerWaitingEvent("pagenavigating", {
          targetPageUrl
        })
        let res = await wx.wxp.navigateTo({
          url:targetPageUrl
        })
        if (res.eventChannel){
          res.eventChannel.emit(pageData.openType, pageData.openData)
        }
      }
      // ,
      // 派发一个等待处理，需要有代码处理的事件
      // triggerWaitingEvent(type, data = {}){
      //   return new Promise((resolve,reject)=>{
      //     let eventCallback = res => resolve(res)
      //     Object.assign(data, {
      //       eventCallback
      //     })
      //     this.triggerEvent(type, data)
      //   })
      // }
    }
})