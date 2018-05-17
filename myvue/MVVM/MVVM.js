/*
挂载数据
编译
*/
class MVVM {
  constructor(opt) {
    this.$el = opt.el

    if(typeof opt.data === 'function') {
      this.$data = opt.data.apply(this)
    }else {
      this.$data = opt.data
    }

    this.$methods = opt.methods
    this.$computed = opt.computed

    if(this.$el) {
      new Observer(this.$data)
      this.proxyData(this.$data)

      this.initComputed(this, this.$computed)

      new Compile(this.$el, this)
    }
  }
  initComputed(vm, computed) {
    const watchers = vm._computedWatchers = Object.create(null)
    for(const key in computed) {
      const userDef = computed[key]
      const getter = typeof userDef === 'function' ? userDef : userDef.get
      const setter = typeof userDef === 'function' ?  noop : (userDef.set || noop)

      watchers[key] = new Watcher(vm, getter, noop, {computed: true})

      Object.defineProperty(vm, key, {
        get: () => {
          const watcher = vm._computedWatchers[key]
          if(watcher) {
            watcher.depend()
            return watcher.evaluate()
          }
        },
        set: setter
      })
    }
  }
  proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newVal) {
          data[key] = newVal
        }
      })
    })
  }
}

function noop() {}
