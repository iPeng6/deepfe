class Watcher {
  constructor(vm, expr, cb, opt) {
    this.vm = vm
    this.expr = expr
    this.cb = cb
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()

    if(opt) {
      this.dirty = this.computed = opt.computed
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
    this.cleanupDeps()
    return value
  }
  // 提供个方法将自己添加到依赖收集器
  addToDep(dep) {
    // 避免重复无限添加
    if(!this.newDepIds.has(dep.id)) {
      this.newDepIds.add(dep.id)
      this.newDeps.push(dep)
      if(!this.depIds.has(dep.id)) {
        dep.addSub(this)
      }
    }

  }
  cleanupDeps() {
    // 清空旧的计算属性依赖
    let i = this.deps.length
    while(i--) {
      const dep = this.deps[i]
      // 且在新的依赖里没有
      if(!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }

    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()

    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  getVal() {
    return this.expr.split('.').reduce((prev, next) => prev[next], this.vm)
  }
  update() {
    let newValue
    const oldValue = this.value
    if(this.computed) {
      newValue = this.get() // 老的属性依赖改变通知到后 又再次
      if(newValue !== oldValue) {
        this.value = newValue
        this.dep.notify()
      }
    }else {
      newValue = this.getVal()
    }

    if(newValue !== oldValue) {
      this.value = newValue
      this.cb.call(this.vm, newValue, oldValue)
    }
  }
  depend() {
    if(this.dep && Dep.target) {
      this.dep.depend()
    }
  }
  evaluate() {
    if(this.dirty) {
      this.value = this.get()
      this.dirty = false
    }

    return this.value
  }

}
