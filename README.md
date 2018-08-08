## 诸葛装修

### 1、项目介绍

### 2、技术栈

vue2 + vue-router + webpack + ES6/7 + axios + sass + flex + svg
 
### 3、项目运行
````
git clone ssh://git@10.1.200.103:2289/webcode/web.zhuge.git

进入项目目录

npm install  或 yarn(推荐)

npm run dev
````
### 3、接口文档
* 

### 4、主要功能

- [x] 微信登陆
- [x] 外部登陆功能

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
* http://api.uzhuang.com/workspace/myWorkspace.do?projectId=4#39

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
│   │   │   └── qaStrategyList.vue             // 装修攻略列表页（没用，也就是课堂页）
│   │   ├── benefit
│   │   │   ├── benefit.vue                     // 红包页
│   │   │   └── children
│   │   │       ├── commend.vue                 // 推荐有奖
│   │   │       ├── coupon.vue                  // 代金券说明
│   │   │       ├── exchange.vue                // 兑换红包
│   │   │       ├── hbDescription.vue           // 红包说明
│   │   │       └── hbHistory.vue               // 历史红包
│   │   ├── city                 
│   │   │   └── city.vue                        // 当前城市页
│   │   ├── confirmOrder
│   │   │   ├── children
│   │   │   │   ├── children
│   │   │   │   │   ├── addAddress.vue          // 添加地址页
│   │   │   │   │   └── children
│   │   │   │   │       └── searchAddress.vue   // 搜索地址页
│   │   │   │   ├── chooseAddress.vue           // 选择地址页
│   │   │   │   ├── invoice.vue                 // 选择发票页
│   │   │   │   ├── payment.vue                 // 付款页
│   │   │   │   ├── remark.vue                  // 订单备注页 
│   │   │   │   └── userValidation.vue          // 用户验证页
│   │   │   └── confirmOrder.vue                // 确认订单页
│   │   ├── download
│   │   │   └── download.vue                    // 下载App
│   │   ├── find
│   │   │   └── find.vue                        // 发现页
│   │   ├── food
│   │   │   └── food.vue                        // 食品筛选排序页
│   │   ├── forget
│   │   │   └── forget.vue                      // 忘记密码，修改密码页
│   │   ├── home
│   │   │   └── home.vue                        // 首页
│   │   ├── login
│   │   │   └── login.vue                       // 登录注册页
│   │   ├── msite
│   │   │   └── msite.vue                       // 商铺列表页
│   │   ├── order
│   │   │   ├── children
│   │   │   │   └── orderDetail.vue             // 订单详情页
│   │   │   └── order.vue                       // 订单列表页
│   │   ├── points
│   │   │   ├── children
│   │   │   │   └── detail.vue                  // 积分说明
│   │   │   └── points.vue                      // 积分页
│   │   ├── profile
│   │   │   ├── children
│   │   │   │   ├── children
│   │   │   │   │   ├── address.vue             // 地址
│   │   │   │   │   └── children
│   │   │   │   │       ├── add.vue             // 新增地址
│   │   │   │   │       └── children
│   │   │   │   │           └── addDetail.vue   // 搜索地址
│   │   │   │   ├── info.vue                    // 帐户信息
│   │   │   │   └── setusername.vue             // 重置用户名
│   │   │   └── profile.vue                     // 个人中心
│   │   ├── search
│   │   │   └── search.vue                      // 搜索页
│   │   ├── service
│   │   │   ├── children
│   │   │   │   └── questionDetail.vue          // 问题详情
│   │   │   └── service.vue                     // 服务中心
│   │   ├── shop
│   │   │   ├── children
│   │   │   │   ├── children
│   │   │   │   │   └── shopSafe.vue            // 商铺认证信息页
│   │   │   │   ├── foodDetail.vue              // 商铺信息页
│   │   │   │   └── shopDetail.vue              // 单个商铺信息页
│   │   │   └── shop.vue                        // 商铺筛选页
│   │   └── vipcard
│   │       ├── children
│   │       │   ├── invoiceRecord.vue           // 购买记录
│   │       │   ├── useCart.vue                 // 使用卡号购买
│   │       │   └── vipDescription.vue          // 会员说明
│   │       └── vipcard.vue                     // 会员卡办理页
│   ├── plugins                                 // 引用的插件
│   ├── router
│   │   └── router.js                           // 路由配置
│   ├── service                                 // 数据交互统一调配
│   │   ├── getData.js                          // 获取数据的统一调配文件，对接口进行统一管理
│   │   └── tempdata                            // 开发阶段的临时数据
│   ├── store                                   // vuex的状态管理
│   │   ├── action.js                           // 配置actions
│   │   ├── getters.js                          // 配置getters
│   │   ├── index.js                            // 引用vuex，创建store
│   │   ├── modules                             // store模块
│   │   ├── mutation-types.js                   // 定义常量muations名
│   │   └── mutations.js                        // 配置mutations
│   └── style
│       ├── common.scss                         // 公共样式文件
│       ├── mixin.scss                          // 样式配置文件
│       └── swiper.min.css
│   ├── App.vue                                 // 页面入口文件
│   ├── main.js                                 // 程序入口文件，加载各种公共组件
├── favicon.ico                                 // 图标
├── index.html                                  // 入口html文件
.

56 directories, 203 files
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









