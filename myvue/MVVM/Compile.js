class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm

    if(this.el) {
      let fragment = this.node2fragment(this.el)

      this.compile(fragment)

      this.el.appendChild(fragment)
    }
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
  node2fragment(node) {
    let fragment = document.createDocumentFragment()
    let firstChild
    while(firstChild = node.firstChild) [
      fragment.appendChild(firstChild)
    ]
    return fragment
  }

  compile(fragment){

    let childNodes = fragment.childNodes
    childNodes.forEach(node => {
      if(this.isElementNode(node)) {
        this.compileElement(node)
        this.compile(node)
      }else {
        this.compileText(node)
      }
    })
    return fragment
  }

  compileElement(node) {
    let attrs = node.attributes
    Array.from(attrs).forEach(attr => {
      if(attr.name.startsWith('v-')) {
        let expr = attr.value
        CompileUtil[attr.name.slice(2)](node, this.vm, expr)
      }
    })
  }
  compileText(node){
    let expr = node.textContent
    let reg = /\{\{[^}]+\}\}/
    if(reg.test(expr)) {
      CompileUtil['textContent'](node, this.vm, expr)
    }
  }
}

let CompileUtil = {

  textContent(node, vm, expr) {

    expr.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      new Watcher(vm, args[1], (newVal) => {
        this.updaterFn.textUpdater(node, this.getTextVal(vm, expr))
      })
    })

    this.updaterFn.textUpdater(node, this.getTextVal(vm, expr))
  },
  text(node, vm, expr) {
    new Watcher(vm, expr, (newVal) => {
      this.updaterFn.textUpdater(node, newVal)
    })
    this.updaterFn.textUpdater(node, this.getVal(vm, expr))
  },
  model(node, vm, expr) {
    new Watcher(vm, expr, (newVal) => {
      this.updaterFn.valueUpdater(node, newVal)
    })
    this.updaterFn.valueUpdater(node, this.getVal(vm, expr))
  },
  getTextVal(vm, expr) {
    return expr.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      return this.getVal(vm, args[1])
    })
  },
  getVal(vm, expr) {
    return expr.split('.').reduce((prev, next) => prev[next], vm.$data)
  },
  updaterFn: {
    textUpdater(node, text) {
      node.textContent = text
    },
    valueUpdater(node, value) {
      node.value = value
    }
  }
}
