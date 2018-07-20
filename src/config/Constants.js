/**
 * Created by zhangweiwei on 16/9/7.
 */

const BASE_URL = process.env.API_HOST;//'http://zhuge.uzhuang.com/index.php'
const Method_Class = {
    hotWord: BASE_URL + '?r=hot-word/',
    banner: BASE_URL + '?r=banner/',
    question: BASE_URL + '?r=question/',
    member: BASE_URL + '?r=member/',
    answer: BASE_URL + '?r=answer/',
    wallet: BASE_URL + '?r=wallet/',
    wx: BASE_URL + '?r=wx/',
};

//用于管理项目请求地址
export const Method = {
        //热词列表
        get_hot_words: Method_Class.hotWord + "list",
        //首页问题列表
        get_homepage: Method_Class.hotWord + "question-list",
        //banner
        get_banner_list: Method_Class.banner + "list",
        //获取问题详情
        get_question_info: Method_Class.question + "info",
        //获取问题下的回答列表
        get_answer_list: Method_Class.question + "answer-list",
        //发布问题 1 问题提交接口
        ask_question: Method_Class.member + "ask",
        //回答问题 1 问题回答接口
        answer: Method_Class.member + "answer",
        //获取回答详情
        get_answer: Method_Class.answer + "info",
        //获取评论列表
        get_comment_list: Method_Class.answer + "comment-list",
        // 新增获取通知列表 type: 1 回答 2采纳 3点赞回答 4点赞评论 5评论回答 6评论评论
        get_notice_list: Method_Class.member + "inform-list",
        //采纳回答 1 采纳接口
        adoption: Method_Class.question + "adoption",

        //点赞回答  1 点赞接口
        like: Method_Class.member + "like-answer",
        un_like: Method_Class.member + "unlike-answer",

        //评论回答 1 回答评论接口
        reply_answer: Method_Class.member + "reply-answer",
        reply_comment: Method_Class.member + "reply-comment",

        //收藏问题
        // favourites: Method_Class+ "f=question_list&v=favourites",
        favourites: Method_Class.member + "collect",
        un_favourites: Method_Class.member + "uncollect",

        // 获取个人信息
        profile: Method_Class.member + "info",
        //热门搜索
        hot_search: Method_Class.hotWord + "get-hotsearch",
        //
        do_search: Method_Class.question + "search",
        //我的收藏
        get_collect: Method_Class.member + "collect-list",
        //我的钱包
        wallet: Method_Class.wallet + "info",
        //钱包明细
        wallet_detail: Method_Class.member + "wallet-detail",

        // 删除操作的接口
        // 删除评论 del_comment uid cid
        del_comment: Method_Class.member + "del-comment",
        // 删除回答 del_answer uid aid
        del_answer: Method_Class.member + "del-answer",
        // 删除问题 del_question uid qid
        del_question: Method_Class.member + "del-question",

        // 管家我得问题列表
        // 未回答 get_question_unanswered   uid page
        get_question_unanswered: Method_Class.member + "unanswered-list",
        // 回答  get_question_answered   uid page
        get_question_answered: Method_Class.member + "member-answered-list",
        // 个人
        // 回答
        get_my_answer: Method_Class.member + "member-answered-list",
        // 问题
        get_my_question: Method_Class.member + "member-question-list",
        // 左 个人提问  管家未回答
        get_my_left_num: Method_Class.member + "member-question-num",
        // 右 个人/管家 回答
        get_my_right_num: Method_Class.member + "member-answered-num",
        //
        // 账户绑定
        bind_account: Method_Class.member + "bind-account",
        // 获取编辑 内容
        get_answer_edit: Method_Class.answer + "content",
        // 提交编辑
        put_answer_edit: Method_Class.answer + "edit",


        //课堂
        //推荐
        ketang_commend: 'http://bang.uzhuang.com/index.php?m=bangV2&f=ketang&v=commend',
        // 装修前 中 后
        ketang_commend_qzh: 'http://bang.uzhuang.com/index.php?m=bangV2&f=ketang&v=nodeListThumb',
        // 装修前中后展示详情
        ketang_nodeList: 'http://bang.uzhuang.com/index.php?m=bangV2&f=ketang&v=nodeList',

        // 微信配置 微信支付等接口
        // wxpay: 'http://m.uzhuang.com/wxpay/pay/Weixin/H5/wxpay.php',
        // wxpay: 'http://m.uzhuang.com/wxpay/sendWallet/payuser.php',
        wxpay: Method_Class.member + 'pay',
        //wxpay: 'http://m.uzhuang.com/wxpay/pay/Weixin/h5_wx/example/jsapi.php',
        // 微信提现接口
        wxtx: Method_Class.member + 'withdraw-deposit',
        //wx_jssdk 配置信息
        get_wx_config_info: Method_Class.wx + 'get-jsconfig',
    }
;

//用于管理router中页面名称
export const PageName = {
    index: 'index',
    template: 'template',
    main: 'main',
    qaIndex: 'qaindex',
    qaknowledge: 'qaknowledge',
    qaList: 'qalist',
    qaLogin: 'qalogin',
    qaWallet: 'qaWallet',
    qaWalletDetail: 'qawalletdetail',
    qaWithdraw: 'qaWithdraw',
    qaUser: 'qauser',
    qaDetail: 'qadetail',
    qaComment: 'qacomment',
    qaSearch: 'qasearch',
    qaAsk: 'qaask',
    qaResponse: 'qaresponse',
    qaNotice: 'qanotice',
    qaQuestion: 'qaquestion',
    qaKetangDetail: 'qaketangdetail',
    qaDoc: 'qadoc',
    qaBindAccount: 'qabindaccount',
    qaQuestionList: 'qaquestionlist',
    qaFind: 'qafind',
    qaManagerDetail: 'qamanagerdetail',
    qaStrategyList: 'qastrategylist',
};
//
export const LocalStorage = {
    test: 'test',//
    uid: 'uid',//uid
    user: 'user',
    searchHistory: 'searchHistory',
    role: 'role',//当前用户角色 0/1
    question_num: 'question_num',//当前用户问题数
    inform_num: 'inform_num', // 当前用户通知数
    collect_num: 'collect_num', // 当前收藏数
    sign: 'ZHUGESISE', //
};


//用于管理EventBus中的事件key
export const EventBus = {
    showToast: 'showToast',
    login: 'login',
    toggleDrawer: 'toggleDrawer',
    toggleMusic: 'toggleMusic',
    userLogin: 'userLogin',
    setTitle: 'setTitle',
    setTitleLeftIcon: 'setTitleLeftIcon',
    update_main_tab_index: 'update_main_tab_index',
    inform_num: 'inform_num', // 当前收藏数
    sign: 'sign', //
};


