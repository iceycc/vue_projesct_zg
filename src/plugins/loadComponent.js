import Vue from 'vue';

import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-light.css';
import 'material-design-icons/iconfont/material-icons.css';

Vue.use(MuseUI);

/**
 *  通用组件引用,以免懒加载重复打包.
 */
import template from "../components/template.vue";
import AutoListView from "../components/commons/AutoListView.vue";
import uzLable from "../components/commons/uzLable.vue";
import ImgWrapper from "../components/commons/ImgWrapper.vue";

Vue.component(template.name, template);
Vue.component(AutoListView.name, AutoListView);
Vue.component(uzLable.name, uzLable);
Vue.component(ImgWrapper.name, ImgWrapper);




import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

Vue.use(VueAwesomeSwiper);

/**
 * 按需加载,引用的UI组件
 */
/*
import 'muse-ui/src/styles/base.less'
import MuRefreshControl from "muse-ui/src/refreshControl/refreshControl.vue";
import MuInfiniteScroll from "muse-ui/src/infiniteScroll/infiniteScroll.vue";
import MuList from "muse-ui/src/list/list.vue";
import MuListItem from "muse-ui/src/list/listItem.vue";
import MuDivider from "muse-ui/src/divider/divider.vue";

Vue.component(MuRefreshControl.name, MuRefreshControl);
//listview 加载更多
Vue.component(MuList.name, MuList);
Vue.component(MuListItem.name, MuListItem);
Vue.component(MuInfiniteScroll.name, MuInfiniteScroll);
Vue.component(MuDivider.name, MuDivider);*/
