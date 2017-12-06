/**
 * Created by zhangweiwei on 16/9/7.
 */

const BASE_URL = 'http://mtest.uz.com/index.php?m=wenda&';


//用于管理项目请求地址
export const Method = {
    //热词列表
    get_hot_words: BASE_URL + "f=question_list&v=get_hot_words",
    //banner
    get_banner_list: BASE_URL + "f=question_list&v=get_banner_list",
    //首页问题列表
    get_homepage: BASE_URL + "f=question_list&v=get_homepage",
    //获取问题详情
    get_question_list: BASE_URL + "f=question_list&v=get_question_list",
    //发布问题
    ask_question: BASE_URL + "f=question_list&v=ask_question",
    //回答问题
    answer: BASE_URL + "f=question_list&v=answer",
    //获取回答详情
    get_answer: BASE_URL + "f=question_list&v=get_answer",
    //获取评论列表
    get_comment_list: BASE_URL + "f=question_list&v=get_comment_list",
    //采纳回答
    adoption: BASE_URL + "f=question_list&v=adoption",
    //喜欢回答
    like: BASE_URL + "f=question_list&v=like",
    //评论回答
    comment: BASE_URL + "f=question_list&v=comment",
    //收藏问题
    favourites: BASE_URL + "f=question_list&v=favourites",
    profile: BASE_URL + "f=question_list&v=profile",
};

//用于管理router中页面名称
export const PageName = {
    index: 'index',
    template: 'template',
    main: 'main',
    qaIndex: 'qaindex',
    qaUser: 'qauser',
    qaDetail: 'qadetail',
    qaComment: 'qacomment',
    qaSearch: 'qasearch',
    qaAsk: 'qaask',
    qaResponse: 'qaresponse',
};

//用于管理router中页面名称
export const LocalStorage = {
    test: 'test',
    uid: 'uid',
    searchHistory: 'searchHistory',
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
