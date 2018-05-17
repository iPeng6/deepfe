let uid = 0
class Dep {
  constructor() {
    this.id = uid++

    this.subs = []
  }
  // 手机依赖
  depend() {
    Dep.target && Dep.target.addToDep(this)
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  removeSub(watcher) {
    for(let i = this.subs.length-1; i>=0; i--) {
      if(this.subs[i] === watcher) {
        this.subs.splice(i,1)
      }
    }
  }
  notify() {
    this.subs.forEach(wt => wt.update())
  }
}

Dep.target = null
