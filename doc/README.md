### 接口地址
- http://api.uzhuang.com/workspace/myWorkspace.do?projectId=4#39


### 组件
#### AutoListView
- defaultStartPage:默认起始页为0
- flag:有时你需要通知控件刷新,你可以变更该值(true 为刷新控件,false 为重置).当你并不需要控件一载入就加载数据时,也可以传入一个false.
- 参数

| 参数        | 说明    |
| --------   | -----   |
| url | 请求地址 |
| type| list /grid|
| cols| 列数,当type为grid生效|
| notify| 类似一个trigger,修改该值,通知控件进行刷新     |

- 方法

| method        | 说明    |
| --------   | -----   |
| onItemClick | 返回当前对象 |

- Parent
| handleParam | 处理请求参数 |
| handleResult| 处理返回结果,可能接口返回的不能直接用过list,可以通过这个函数处理一下.|


### 风格指南

##### 组件名为多个单词
> 这样做可以避免跟现有的以及未来的 HTML 元素相冲突，因为所有的 HTML 元素名称都是单个单词的。

##### 组件的 data 必须是一个函数。
> 我们希望每个组件实例都管理其自己的数据。为了做到这一点，每个实例必须生成一个独立的数据对象。

##### Prop 定义应该尽量详细。
> 更明确的表达组件的用法.避免潜在的错误

##### 如果一组 v-if + v-else 的元素类型相同，最好使用 key (比如两个 <div> 元素)。
> 默认情况下，Vue 会尽可能高效的更新 DOM。这意味着其在相同类型的元素之间切换时，会修补以存在的元素，而不是将旧的元素移除然后在同一位置添加一个新元素。

##### 元素选择器应该避免在 scoped 中出现。
> 问题在于大量的元素和特性组合的选择器 (比如 button[data-v-f3f3eg9]) 会比类和特性组合的选择器 慢，所以应该尽可能选用类选择器。

### vue-awesome 
- [vue-awesome-swiper](https://github.com/surmon-china/vue-awesome-swiper)
- muse-ui
- hotcss
- material-design-icons
- vue-lazyload
- [vue-drag-verify 滑动解锁](https://github.com/AshleyLv/vue-drag-verify)
### iphone 添加到主屏幕
```html
<!-- 添加到主屏幕-图标-->
<link rel="apple-touch-icon" href="./static/icon.jpg">
<!-- 添加到主屏幕-启动图-->
<link rel="apple-touch-startup-image" href="./static/launch.png">
<!-- 添加到主屏幕-全屏运行-->
<meta name="apple-mobile-web-app-capable" content="yes">
```
- [Configuring WebApplications](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

# template

> A Vue.js project

## Build Setup

## 其他问题
- 移动应用抓包调试利器Charles  https://www.jianshu.com/p/68684780c1b0
- 微信开发者工具
- 移动端手势操作 vue-touch  https://github.com/vuejs/vue-touch/tree/next
 
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## [webpack.analyse](http://webpack.github.io/analyse/)
```
webpack --profile --json > stats.json
```

## [code-splitting-async](https://doc.webpack-china.org/guides/code-splitting-async/#-import-)


