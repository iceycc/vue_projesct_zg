/**
 * Created by zhangweiwei on 16/9/7.
 */

const BASE_URL = 'http://m.uzhuang.com/index.php?m=wenda&';


//用于管理项目请求地址
export const Method = {
    //热词列表
    get_hot_words: BASE_URL + "f=question_list&v=get_hot_words",
    //banner
    get_banner_list: BASE_URL + "f=question_list&v=get_banner_list",
    //首页问题列表 1
    get_homepage: BASE_URL + "f=question_list&v=get_question_list",
    //获取问题详情 1
    get_question_list: BASE_URL + "f=question_list&v=get_question_info",
    //发布问题 1 问题提交接口
    ask_question: BASE_URL + "f=operation&v=ask_question",
    //回答问题 1 问题回答接口
    answer: BASE_URL + "f=operation&v=answer",
    //获取回答详情
    get_answer: BASE_URL + "f=question_list&v=get_answer",
    //获取评论列表
    get_comment_list: BASE_URL + "f=question_list&v=get_comment_list",
    // 新增获取通知列表 type: 1 回答 2采纳 3点赞回答 4点赞评论 5评论回答 6评论评论
    get_notice_list: BASE_URL + " f=question_list&v=get_inform",
    //采纳回答 1 采纳接口
    adoption: BASE_URL + "f=operation&v=adoption",
    //点赞回答  1 点赞接口
    like: BASE_URL + "f=operation&v=like",
    un_like: BASE_URL + "f=operation&v=unlike",
    //评论回答 1 回答评论接口
    comment: BASE_URL + "f=operation&v=comment",
    //收藏问题
    // favourites: BASE_URL + "f=question_list&v=favourites",
    favourites: BASE_URL + "f=operation&v=favourites",
    un_favourites: BASE_URL + "f=operation&v=unfavourites",

    profile: BASE_URL + "f=question_list&v=profile",
    //热门搜索
    hot_search: BASE_URL + "f=question_list&v=hot_search",
    //我的钱包
    wallet: BASE_URL + "f=question_list&v=wallet",
    //钱包明细
    wallet_detail: BASE_URL + "f=question_list&v=wallet_detail",
    // wxpay: 'http://m.uzhuang.com/wxpay/pay/Weixin/H5/wxpay.php',
    wxpay: 'http://m.uzhuang.com/wxpay/sendWallet/payuser.php',
    //wxpay: 'http://m.uzhuang.com/wxpay/pay/Weixin/h5_wx/example/jsapi.php',
    //wx_jssdk 配置信息
    get_wx_config_info: BASE_URL + "f=question_list&v=get_wx_config_info",
    //课堂
    //推荐
    ketang_commend: 'http://bang.uzhuang.com/index.php?m=bangV2&f=ketang&v=commend',
    // 装修前 中 后
    ketang_commend_qzh: 'http://bang.uzhuang.com/index.php?m=bangV2&f=ketang&v=nodeListThumb',
    // 装修前中后展示详情

    ketang_nodeList: 'http://bang.uzhuang.com/index.php?m=bangV2&f=ketang&v=nodeList',
    // 通知的
    // http://m.uzhuang.com/index.php?m=wenda&f=question_list&v=get_answer&q_id=7&a_id=16&uid=25416
    // 删除操作的接口
    // 删除评论 del_comment uid cid
    del_comment: BASE_URL + "f=operation&v=del_comment",
    // 删除回答 del_answer uid aid
    del_answer: BASE_URL + "f=operation&v=del_answer",
    // 删除问题 del_question uid qid
    del_question: BASE_URL + "f=operation&v=del_answer",
    // 管家我得问题列表
    //http://m.uzhuang.com/index.php?m=wenda&f=question_list&v=get_question_list&type=2
    // 未回答 get_question_unanswered   uid page
    get_question_unanswered: BASE_URL + "f=question_list&v=get_question_unanswered",
    // 回答  get_question_answered   uid page
    get_question_answered: BASE_URL + "f=question_list&v=get_question_answered",

    // 账户绑定
    bind_account: BASE_URL + "f=operation&v=bind_account"
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
  qaGuanJiaList: 'qaguanjialist',
  qaKetangDetail:'qaketangdetail',
  qaDoc:'qadoc',
  qaBindAccount:'qabindaccount'
};

//
export const LocalStorage = {
  test: 'test',
  uid: 'uid',
  user: 'user',
  searchHistory: 'searchHistory',
  role: 'role',
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
  add_red: 'is_read_num'
};
