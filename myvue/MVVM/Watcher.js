class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb
    // this.value = this.get()
  }
  get() {
    let value = this.getVal()
    return value
  }
  getVal() {
    return this.expr.split('.').reduce((prev, next) => prev[next], this.vm.$data)
  }
  update() {
    let newValue = this.getVal()

    if(newValue !== this.value) {
      this.cb(newValue)
    }
  }
}
