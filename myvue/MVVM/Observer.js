
class Observer {
  constructor(data) {
    this.observe(data)
  }
  observe(data) {

    if(typeof data !== 'object') return

    Object.keys(data).forEach(key => {
      let value = data[key]

      this.defineReactive(data, key, value)
      this.observe(value)
    })
  }
  defineReactive(obj, key, value) {
    let _this = this
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        dep.depend()
        console.log(dep, Dep.target)
        return value
      },
      set(newVal) {
        if(newVal !== value) {
          _this.observe(newVal)
          value = newVal
          dep.notify()
        }
      }
    })
  }
}
