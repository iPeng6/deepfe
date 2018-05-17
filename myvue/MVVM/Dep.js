class Dep {
  constructor() {
    this.subs = []
  }
  // 手机依赖
  depend() {
    Dep.target && Dep.target.addToDep(this)
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(wt => wt.update())
  }
}

Dep.target = null
