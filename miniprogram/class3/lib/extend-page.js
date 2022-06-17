
const extendPage = Page => {
  return object => {
    // 登录面板开头
    if (!object.data) object.data = {}
    object.data.showLoginPanel = false

    // method
    object.hi = function (name) {
      console.log(`hi ${name}`);
    }

    // 派发一个等待处理，需要有代码处理的事件
    // 但这个方法没有什么用
    object.triggerWaitingEvent = function (type, data = {}) {
      return new Promise((resolve, reject) => {
        let eventCallback = res => resolve(res)
        Object.assign(data, {
          eventCallback
        })
        this.triggerEvent(type, data)
      })
    }

    return Page(object)
  }
}

const originalPage = Page
Page = extendPage(originalPage)
