class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb

    Dep.target = this;
    this.value = this.get()
    Dep.target = null
  }
  get() {
    let value = this.getVal()
    return value
  }
  // 提供个方法将自己添加的依赖收集器
  addToDep(dep) {
    dep.addSub(this)
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
