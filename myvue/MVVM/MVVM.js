/*
挂载数据
编译
*/
class MVVM {
  constructor(opt) {
    this.$el = opt.el
    this.$data = opt.data

    if(this.$el) {

      new Compile(this.$el, this)
    }
  }
}
