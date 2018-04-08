import * as Constants from '../assets/js/Constants';

let page = {};
page[Constants.PageName.template] = resolve => require(['./template.vue'], resolve);
page[Constants.PageName.main] = resolve => require(['./main.vue'], resolve);
page[Constants.PageName.qaIndex] = resolve => require(['./qaIndex.vue'], resolve);
page[Constants.PageName.qaDetail] = resolve => require(['./qaDetail.vue'], resolve);
page[Constants.PageName.qaAsk] = resolve => require(['./qaAsk.vue'], resolve);
page[Constants.PageName.qaUser] = resolve => require(['./qaUser.vue'], resolve);
page[Constants.PageName.qaResponse] = resolve => require(['./qaResponse.vue'], resolve);
page[Constants.PageName.qaComment] = resolve => require(['./qaComment.vue'], resolve);
page[Constants.PageName.qaSearch] = resolve => require(['./qaSearch.vue'], resolve);
page[Constants.PageName.qaList] = resolve => require(['./qaList.vue'], resolve);
page[Constants.PageName.qaWallet] = resolve => require(['./qaWallet.vue'], resolve);
page[Constants.PageName.qaWalletDetail] = resolve => require(['./qaWalletDetail.vue'], resolve);
page[Constants.PageName.qaLogin] = resolve => require(['./qaLogin.vue'], resolve);
page[Constants.PageName.qaWithdraw] = resolve => require(['./qaWithdraw.vue'], resolve);
page[Constants.PageName.qaknowledge] = resolve => require(['./qaknowledge.vue'], resolve);
page[Constants.PageName.qaNotice] = resolve => require(['./qaNotice.vue'], resolve);//新增qaNotice
page[Constants.PageName.qaGuanJiaList] = resolve => require(['./qaGuanJiaList.vue'], resolve);//新增qaGuanJiaUser
page[Constants.PageName.qaKetangDetail] = resolve => require(['./qaKetangDetail.vue'], resolve);//新增qaKetangDetail


export default page;
