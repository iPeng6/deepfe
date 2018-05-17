class Watcher {
  constructor(vm, expr, cb, opt) {
    this.vm = vm
    this.expr = expr
    this.cb = cb

    if(opt) {
      this.computed = opt.computed
    }

    if(this.computed) {
      this.value = undefined
      this.dep = new Dep()
    }else {
      this.value = this.get()
    }
  }
  get() {
    Dep.target = this;
    let value
    if(this.computed) {
      value = this.expr.call(this.vm)
    }else {
      value = this.getVal()
    }
    Dep.target = null
    return value
  }
  // 提供个方法将自己添加的依赖收集器
  addToDep(dep) {
    dep.addSub(this)
  }
  getVal() {
    return this.expr.split('.').reduce((prev, next) => prev[next], this.vm)
  }
  update() {
    let newValue
    if(this.computed) {
      this.dep.notify()
    }else {
      newValue = this.getVal()
    }

    if(newValue !== this.value) {
      this.cb(newValue)
    }
  }
  depend() {
    if(this.dep && Dep.target) {
      this.dep.depend()
    }
  }
  evaluate() {
    this.value = this.get()
    return this.value
  }
}
