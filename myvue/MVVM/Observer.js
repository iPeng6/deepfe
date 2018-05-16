
class Observer {
  constructor(data) {
   this.observe(data)
  }
  observe(data) {

    if(!data || typeof data !== 'object') return

    Object.keys(data).forEach(key => {
      let value = data[key]

      this.defineReactive(data, key, value)
      this.observe(value)
    })
  }
  defineReactive(obj, key, value) {
    let _this = this
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        console.log('get: ', value)
        return value
      },
      set(newVal) {
        if(newVal !== value) {
          _this.observe(newVal)
          value = newVal
          console.log('set: ', newVal, value)
        }
      }
    })
  }
}
