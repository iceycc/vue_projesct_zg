## 诸葛装修  by icey

### 1、项目介绍

### 2、技术栈

vue2 + vue-router + webpack + ES6/7 + axios + sass + flex + svg

muse-ui  部分用的2.0版本:`https://muse-ui.org/2.1.0/#/index`
 
### 3、项目运行 及 发布流程  2018-8-10

````
git clone ssh://git@10.1.200.103:2289/webcode/web.zhuge.git

进入项目目录

npm install  

npm run dev 运行

npm run build  打包dist
````


* master分支为线上版本，不可修改。或者有自己的开发习惯
* 1.2.1-outlogin 为2.0迭代那版本（上线后合并到master再删除该分支）  
    - 外部登陆
    - 发现模块
    - 开发完毕可删除改分支
* 基本流程 `该项目只是生成对应的dist文件，放到后台项目，后台构建并部署上线`
    - 开发新需求 从master检出个人分支`dev(个人命名)`进行开发
    - 开发完毕，提交121测试： `npm run build` 生成`dist`，将生成的dist放到 `zhuge.uzhuang.com`的个人分支的`web\home`下，将里面全部替换。按照后端的规则合并到`testing`分支i下
    - 121测试完毕，提交176预生产： 创建`zhuge.uzhuang.com`的个人分支合并到`preproduction`预生产环境的合并请求，指派给开发主管 
    - 最后后端部署上线

### 3、接口文档
* zhuge.uzhuang.com
* m.uzhuang.com
* bang.uzhuang.com

### 4、主要功能

- [x] 微信登陆
- [x] 外部登陆功能
- [x] 游客模式

- [x] 问答页导航
- [x] 问答页轮播图
- [x] 问答页问答列表
- [x] 问答页下拉刷新
- [x] 问答页跳转搜索页

- [x] 问答详情页问题详情展示
- [x] 问答详情页问题详情展示
- [x] 问答详情页收藏问题功能
- [x] 问答详情页点赞回答功能
- [x] 问答详情页采纳问题功能
- [x] 问答详情页删除回答功能
- [x] 问答详情页编辑回答功能
- [x] 问答详情页点击管家头像跳转管家详情

- [x] 评论详情页 回答详情
- [x] 评论详情页 回复列表
- [x] 评论详情页 回复回答功能
- [x] 评论详情页 回复回答评论功能
- [x] 评论详情页 点赞回答

- [x] 搜索热词展示
- [x] 搜索历史记录
- [x] 搜索历史删除和清空
- [x] 搜索列表页

- [x] 去回答功能
- [x] 去提问功能
- [x] 去提问上传图片功能
- [x] 免费提问功能
- [x] 付费问题功能（微信端）


- [x] ~~课堂~~ --> 装修攻略

- [x] 发现页精品案例展示
- [x] 精品案例列表展示
- [x] 精品案例列表顶部筛选按钮
- [ ] 精品案例列表下拉刷新
- [x] 精品案例详情展示
- [x] 发现页活跃管家横向展示
- [x] 活跃管家点击联系拨打手机
- [x] 发现页装修攻略列表展示
- [x] 装修攻略列表页展示
- [x] 装修攻略详情跳转到m站
- [x] 装修攻略列表 用的 bang.uzhuang.com的接口/样式诸葛装修app一样（推荐，装修前，装修后，装修中）
- [ ] 装修攻略列表下拉刷新  接口用的老接口，没有做分页功能

- [x] 通知列表功能
- [x] 每次切换页面 请求个人信息接口 查看是否有新的通知 通过事件发布订阅 展示小红点 （ EventBus ）
- [x] 通知列表页
- [x] 通知列表页下拉刷新

- [x] 我的页面个人信息展示 头像 昵称 收藏数 问答数 我的钱包 （个数的时时更新） 
- [x] 管家账号绑定 隐藏功能 ：点击我的页面 下部分 `诸葛装修` 文字三次进入绑定管家账号功能

- [x] 我的收藏列表页
- [x] 我的收藏列表页点击跳转详情

- [x] 我的回答页搜索功能
- [x] 普通用户我的问答：栏目为 `提问`和`回答`
- [x] 管家用户我的问答：栏目为 `未回答` 和 `已回答`

- [x] 我的钱包余额
- [x] 我的钱包明显 支出 收入
- [x] 提现

其他功能


### 5、数据接口
* http://api.uzhuang.com/

* 主要api用：zhuge.uzhuang.com
* 装修攻略（课堂）：bang.uzhuang.com
* 精品案例详情：m.uzhuang.com

* 跨域解决 用 /config/index 下的 proxyTable代理解决 注意配置dev和prod环境下的api域名

### 6、项目布局

```
.
├── build                                       // webpack配置文件
├── config                                      // 项目打包路径
├── dist                                         // 上线项目文件，放在服务器即可正常访问
├── src                                         // 源码目录
│   ├── assets                                  // 静态资产 会被webpack处理
│   │   ├──  fonts                               // 字体资源库 （未用）
│   │   ├──  img                                // 图片
│   │   ├──  scss                               // scss目录
│   │   │   ├── base.scss                       // 公共样式
│   │   │   ├── px2rem.scss                     // px转rem
│   │   │   └── util.css                        // scss工具类
│   ├── components                              // 组件
│   │   ├── common                              // 公共组件
│   │   │   ├── AppBar.vue                      // 顶部bar
│   │   │   ├── AutoListView.vue                // 列表展示组件 1
│   │   │   ├── AutoListView2.vue               // 列表展示组件  2
│   │   │   ├── DownTabsBox.vue                 // 精品案例顶部点击展示的筛选盒子
│   │   │   ├── ImgWrapper.vue                  // 图片展示组件
│   │   │   ├── ListItem.vue                    // 列表item组件
│   │   │   └── ShowAsk.vue                     // 提问功能模块组件
│   │   ├──  noticeInfo.vue                     // 通知页面组件
│   │   ├──  template.vue                       // test组件
│   │   ├──  uploadView.vue                     // 图片上传组件
│   │   └──  UserQuestionList.vue               // 没有用
|   |                  
│   ├── config 
|   |   ├── mixins                              // mixins混合器
|   |   |   ├── index.js                        
|   |   |   ├── mixins-base.js                  // 混合器基本函数
|   │   │   └── mixins-wx.js                    // 混合器微信相关api           
|   |   ├── Constants.js                        // 基本的常量备至（）
│   │   ├── EventBus.js                         // 在vue挂在事件监听函数，用于组件传旨或事件传递
│   │   ├── index.js                            // 综合导出
│   │   ├── util.js                             // 常用的js方法
│   │   └── vue.config.js                       // vue配置项目（没用到）
│   ├── images                                  // 公共图片 
│   ├── layouts                                 // 布局设计 
│   │   └── app.vue                             // 项目的跟app页面
│   ├── page
│   │   ├── find                                
│   │   │   ├── qaFind.vue                     // 发现页
│   │   │   ├── qaGoodCase.vue                 // 精品案例列表页
│   │   │   ├── qaGoodCaseDetail.vue           // 精品案例列详情页
│   │   │   ├── qaManagerDetail.vue            // 活跃管家详情页
│   │   │   ├── qaManagerList.vue              // 活跃管家列表页
│   │   │   └── qaStrategyList.vue             // 装修攻略列表页（没用，迭代后，用原课堂页knowledge取代）
│   │   ├── index
│   │   │   ├── qaIndex.vue                     // 首页 问答展示页 
│   │   │   └── qaSearch                        // 搜索页（2.0迭代去除）
│   │   ├── knowledge                           // 课堂 (2.0迭代后改为装修攻略)
│   │   │   ├── qaKetangDetail.vue              // 课堂详情页 (2.0迭代后改为装修攻略)
│   │   │   └── qaKnowledge.vue                 // 课堂详列表页 (2.0迭代后改为装修攻略)
│   │   ├── notice
│   │   │   └── qaNotice.vue                    // 确认订单页
│   │   ├── question
│   │   │   ├── qaAsk.vue                       // 提问页面 免费提问和付费提问
│   │   │   ├── qaComment.vue                   // 评论叶脉你
│   │   │   ├── qaDetail.vue                    // 问答详情页
│   │   │   └── qaResponse.vue                  // 回答页面
│   │   ├── user
│   │   │   ├── account
│   │   │   │   └── qaBingAccount.vue           // 绑定微信
│   │   │   ├── collection
│   │   │   │   └── qaList.vue                  // 收藏详情页  搜索跳转页也可以
│   │   │   ├── question
│   │   │   │   └── qaQuestion.vue              // 我的问题页 主要通过组件AutoListView2.vue区分
│   │   │   ├── wallet
│   │   │   │   ├── qaWallet.vue                // 钱包页
│   │   │   │   ├── qaWalletDetail.vue          // 钱包明细
│   │   │   │   └── qaWithdraw.vue              // 提现页面
│   │   │   └── qaUser.vue                      // 用户页面
│   │   ├── `index.js`                          // 统一管理页面导出，每次新建一个page页面，记得再次登记，然后去Constants登记页面常量
│   │   ├── main.vue                            // 主页面
│   │   ├── qaDoc.vue                           // 一些用户协议的文档
│   │   ├── qaLogin.vue                         // 微信端的登陆页面
│   │   └── template.vue                        // 测试模版
│   ├── plugins                                 // 引用的插件
│   │   ├── filter.js                           // 过滤器函数
│   │   ├── localComponent.js                   // 本地组件管理
│   │   ├── localstorage.js                     // 本地存储 （微微留下的，我不是很习惯基本没用）
│   │   └── router.js                           // 路由配置
│   ├── request                                 // 
│   │   ├── index.js                            // request封装
│   │   ├── requestInstance.js                  // request拦截配置
│   │   └── requestOption.js                    // request配置
│   └── main.js                                 // 程序入口文件，加载各种模块组件
├── index.html                                  // 入口html文件
├── README.md                                   // 说明文档
.


```





---
vue 项目--》

// 接口地址 ： http://api.uzhuang.com/workspace/myWorkspace.do?projectId=4#41

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
- md5加密  
    1- `npm install --save js-md5`  
    2- `import md5 from 'js-md5'`  
    3- `md5(value)`  
- 前端校验  
- 下拉刷新 上拉加载 分页功能  

 
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









