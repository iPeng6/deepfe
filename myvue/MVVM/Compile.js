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
      CompileUtil['text'](node, this.vm, expr)
    }
  }
}

let CompileUtil = {
  text(node, vm, expr) {
    node.textContent = node.textContent.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      return this.getVal(vm.$data, args[1])
    })
  },
  model(node, vm, expr) {
    node.value = this.getVal(vm.$data, expr)
  },
  getVal(vm, expr) {
    return expr.split('.').reduce((prev, next) => prev[next], vm)
  }
}
