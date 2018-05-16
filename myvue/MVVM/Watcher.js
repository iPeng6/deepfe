class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb
    this.value = this.get()
  }
  get() {
    Dep.target = this;
    let value = this.getVal()
    Dep.target = null
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
