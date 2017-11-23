/**
 * Created by zhangweiwei on 16/9/7.
 */

const BASE_URL = 'http://mtest.uz.com/index.php?m=wenda&';


//用于管理项目请求地址
export const Method = {
    get_hot_words: BASE_URL + "f=question_list&v=get_hot_words",
    get_homepage: BASE_URL + "f=question_list&v=get_homepage",
    get_question_list: BASE_URL + "f=question_list&v=get_question_list",
};

//用于管理router中页面名称
export const PageName = {
    index: 'index',
    template: 'template',
    main: 'main',
    qaIndex: 'qaindex',
    qaDetail: 'qadetail',
    qaAsk: 'qaask',
};

//用于管理router中页面名称
export const LocalStorage = {
    test: 'test',
};


//用于管理EventBus中的事件key
export const EventBus = {
    showToast: 'showToast',
    toggleDrawer: 'toggleDrawer',
    toggleMusic: 'toggleMusic',
    userLogin: 'userLogin',
    setTitle: 'setTitle',
    setTitleLeftIcon: 'setTitleLeftIcon',
    update_main_tab_index: 'update_main_tab_index'
};
