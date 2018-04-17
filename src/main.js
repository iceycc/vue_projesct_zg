// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import Vue from './plugins/filter';

// 加载路由
import router from './plugins/router';

// 注册全局组件
import {} from './plugins/loadComponent';

// localstorage
import {} from './plugins/localstorage';

//  混合器

import {} from './assets/js/mixins/mixins-base';
import {} from './assets/js/mixins/mixins-request';

//拦截器
//无使用,仅防止重复打包
import {} from './assets/js/request/axiosInstance';

// import VueTouch from 'vue-touch';
// Vue.use(VueTouch,{name: 'v-touch'})
/*Vue.config.productionTip = true;
 Vue.config.performance = true;*/

/* eslint-disable no-new */
import App from './layouts/App.vue';

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
});
