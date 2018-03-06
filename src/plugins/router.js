import Vue from 'vue';
import Router from 'vue-router';
import Pages from '../pages/index';
import * as Constants from '../assets/js/Constants';

function addRouter(name, meta) {
  routes.push({
    path: '/' + name.replace(/-/g, '/'),
    name: name,
    component: Pages[name],
    meta: Object.assign({keepAlive: true}, meta)
  });
}

Vue.use(Router);

let routes = [{
  path: '/',
  name: Constants.PageName.main,
  component: Pages.main,
  meta: {keepAlive: true, title: '主页'},
  redirect: {name: Constants.PageName.qaNotice},
  children: [
    {
      path: Constants.PageName.qaIndex,
      name: Constants.PageName.qaIndex,
      component: Pages[Constants.PageName.qaIndex],
      meta: {keepAlive: true, title: '问答'},
    },
    {
      path: Constants.PageName.qaUser,
      name: Constants.PageName.qaUser,
      component: Pages[Constants.PageName.qaUser],
      meta: {keepAlive: true, title: '我的'},
    },
    {
      path: Constants.PageName.qaNotice,
      name: Constants.PageName.qaNotice,
      component: Pages[Constants.PageName.qaNotice],
      meta: {keepAlive: true, title: '通知'},

    }
  ]
}];

addRouter(Constants.PageName.template, {title: '测试页面'});
addRouter(Constants.PageName.qaDetail, {keepAlive: false, title: '问答详情'});
addRouter(Constants.PageName.qaAsk, {title: '提问'});
addRouter(Constants.PageName.qaResponse, {title: '回复'});
addRouter(Constants.PageName.qaComment, {title: '评论'});
addRouter(Constants.PageName.qaSearch, {title: '搜索'});
addRouter(Constants.PageName.qaList, {keepAlive: false, title: '列表'});
addRouter(Constants.PageName.qaWalletDetail, {keepAlive: false, title: '钱包明细'});
addRouter(Constants.PageName.qaLogin, {keepAlive: false, title: '登录'});
addRouter(Constants.PageName.qaWallet, {keepAlive: false, title: '钱包'});
addRouter(Constants.PageName.qaWithdraw, {keepAlive: false, title: '提现'});
addRouter(Constants.PageName.qaknowledge, {title: '课堂'});
// addRouter(Constants.PageName.qaNotice, {title: '通知'});// 新增notice
// addRouter(Constants.PageName.qaUser, {title: '我的'});
//addRouter(Constants.PageName.qaIndex, {title: '问答'});

let router = new Router({
  //mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }

  next();
});

export default router;
