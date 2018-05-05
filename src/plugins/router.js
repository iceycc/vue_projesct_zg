import Vue from 'vue';
import Router from 'vue-router';
import Pages from '../pages/index';
import {EventBus,Constants} from '../config/index'


let AutoListView2 = resolve => require(['../components/commons/AutoListView2'], resolve);

// let UserQuestionList = resolve => require(['../components/UserQuestionList'], resolve);
function addRouter(name, meta) {
  routes.push({
    path: '/' + name.replace(/-/g, '/'),
    name: name,
    component: Pages[name],
    meta: Object.assign(
        {
          keepAlive: true,
          needLogin: true
        }
        , meta)
  });
}

Vue.use(Router);

let routes = [
  {
    path: '/',
    name: Constants.PageName.main,
    component: Pages.main,
    meta: {
      title: '诸葛装修',
      keepAlive: false,
      needLogin: false

    },
    children: [
      {
        path: Constants.PageName.qaIndex,
        name: Constants.PageName.qaIndex,
        component: Pages[Constants.PageName.qaIndex],
        meta: {keepAlive: true, title: '主页',needLogin: true},
      },
      {
        path: Constants.PageName.qaUser,
        name: Constants.PageName.qaUser,
        component: Pages[Constants.PageName.qaUser],
        meta: {keepAlive: true, title: '我的',needLogin: true},
      },
      {
        path: Constants.PageName.qaNotice,
        name: Constants.PageName.qaNotice,
        component: Pages[Constants.PageName.qaNotice],
        meta: {keepAlive: true, title: '通知',needLogin: true},
      },
      {
        path: Constants.PageName.qaknowledge,
        name: Constants.PageName.qaknowledge,
        component: Pages[Constants.PageName.qaknowledge],
        meta: {keepAlive: true, title: '课堂',needLogin: true}
      },
      // {
      //   path: Constants.PageName.qaDetail,
      //   name: Constants.PageName.qaDetail,
      //   component: Pages[Constants.PageName.qaDetail],
      //   meta: {keepAlive: true, title: '问答详情',isShowTab:true}
      // }
    ]
  },
  {
    path: '/' + Constants.PageName.qaQuestion,
    name: Constants.PageName.qaQuestion,
    component: Pages[Constants.PageName.qaQuestion],
    meta: {keepAlive: false, title: '我的问题',needLogin: true},
    // children:[
    //   {
    //     path:Constants.PageName.qaQuestionList,
    //     name:Constants.PageName.qaQuestionList,
    //     component:Constants.PageName.qaQuestionList
    //   }
    // ]
  }
];

addRouter(Constants.PageName.template, {title: '测试页面'});
addRouter(Constants.PageName.qaDetail, {keepAlive: false, title: '问答详情'});
addRouter(Constants.PageName.qaAsk, {title: '提问'});
addRouter(Constants.PageName.qaResponse, {title: '回复'});
addRouter(Constants.PageName.qaComment, {title: '评论'});
addRouter(Constants.PageName.qaSearch, {title: '搜索'});
addRouter(Constants.PageName.qaList, {keepAlive: false, title: '列表'});
addRouter(Constants.PageName.qaWalletDetail, {keepAlive: false, title: '钱包明细'});
addRouter(Constants.PageName.qaLogin, {keepAlive: false, title: '登录', needLogin: false});
addRouter(Constants.PageName.qaWallet, {keepAlive: false, title: '钱包'});
addRouter(Constants.PageName.qaWithdraw, {keepAlive: false, title: '提现'});
addRouter(Constants.PageName.qaKetangDetail, {keepAlive: false, title: '课堂'});
addRouter(Constants.PageName.qaDoc, {keepAlive: false, title: '',needLogin: false});
addRouter(Constants.PageName.qaBindAccount, {keepAlive: false, title: '账号绑定'});

let router = new Router({

  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  // 判断是否需要进行登陆 校验
  if (to.meta.needLogin) {
    let sign = localStorage.getItem(Constants.LocalStorage.sign)
    // let sign = null;
    // EventBus.$on(Constants.EventBus.sign,(val)=>{
    //   sign = val
    // })
    // 判断sign是否存在
    if (sign) {
      next()
    } else {
      EventBus.$emit(Constants.EventBus.showToast,{
        message:"需要在微信浏览器打开"
      })
      setTimeout(()=>{
        next({
          name: Constants.PageName.qaLogin,
          qurey: {redirect: to.fullPath}
        })
      },2000)
    }
  }
  next()


});


var sess = window.sessionStorage

const reloadIntercepetor = (to, from) => {
  if (to.name == 'qauser') {
    let isRefresh = sess.getItem('isRefresh')
    console.log('isRefresh:' + isRefresh)
    if (isRefresh == '0') {
      sess.setItem('isRefresh', null)
      window.location.href = window.location.host + '/#/qauser'
      console.log(window.location)

    } else {
      sess.setItem('isRefresh', 0)
    }
  }
}


router.afterEach((to, from) => {

})


export default router;
