// 派发一个等待处理，需要有代码处理的事件
module.exports = Behavior({
  definitionFilter(defFields) {
    defFields.methods.triggerWaitingEvent = function (type, data = {}) {
      return new Promise((resolve, reject) => {
        let eventCallback = res => resolve(res)
        Object.assign(data, {
          eventCallback
        })
        this.triggerEvent(type, data)
      })
    }
  },
})