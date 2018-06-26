// 自己尝试整理的 没有用到
const Config = {
  // 取消 Vue 所有的日志与警告
  silent:true,

  // 自定义合并策略的选项
  optionMergeStrategies:{
    _my_option:function(parent, child, vm){
      return child + 1
    },
  },

  // 配置是否允许 vue-devtools 检查代码。开发版本默认为 true，生产版本默认为 false。生产版本设为 true 可以启用检查。
  devtools:true,

  // 指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例
  errorHandler:function(err, vm, info){
    // handle error
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    // 只在 2.2.0+ 可用
  },

  // 为 Vue 的运行时警告赋予一个自定义处理函数。注意这只会在开发者环境下生效，在生产环境下它会被忽略
  warnHandler:function (msg, vm, trace) {
    // `trace` 是组件的继承关系追踪
  }

  // 须使 Vue 忽略在 Vue 之外的自定义元素 (e.g. 使用了 Web Components APIs)。否则，它会假设你忘记注册全局组件或者拼错了组件名称，从而抛出一个关于 Unknown custom element 的警告
  ignoredElements:[
    'my-custom-web-component',
    'another-web-component',
    // 用一个 `RegExp` 忽略所有“ion-”开头的元素
    // 仅在 2.5+ 支持
    /^ion-/
  ],

  // keyCodes  给 v-on 自定义键位别名  `<input type="text" @keyup.media-play-pause="method">`
  keyCodes:{
    v: 86,
    f1: 112,
    // camelCase 不可用
    mediaPlayPause: 179,
    // 取而代之的是 kebab-case 且用双引号括起来
    "media-play-pause": 179,
    up: [38, 87]
  },

  // 设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪。只适用于开发模式和支持 performance.mark API 的浏览器上.
  // 默认值：false (自 2.2.3 起)
  performance:false,

  //  设置为 false 以阻止 vue 在启动时生成生产提示 默认值：true
  productionTip:true
}

Vue.config = Config

// 1- Vue.extend( options )
// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建 Profile 实例，并挂载到一个元素上。
new Profile().$mount('#mount-point')

//2- Vue.nextTick( [callback, context] )

