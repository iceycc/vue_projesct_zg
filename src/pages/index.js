import {Constants} from '../config/index';

let page = {};
page[Constants.PageName.template] = resolve => require(['./template.vue'], resolve);
page[Constants.PageName.main] = resolve => require(['./main.vue'], resolve);
page[Constants.PageName.qaIndex] = resolve => require(['./index/qaIndex.vue'], resolve);
page[Constants.PageName.qaDetail] = resolve => require(['./question/qaDetail.vue'], resolve);
page[Constants.PageName.qaAsk] = resolve => require(['./question/qaAsk.vue'], resolve);
page[Constants.PageName.qaUser] = resolve => require(['./user/qaUser.vue'], resolve);
page[Constants.PageName.qaResponse] = resolve => require(['./question/qaResponse.vue'], resolve);
page[Constants.PageName.qaComment] = resolve => require(['./question/qaComment.vue'], resolve);
page[Constants.PageName.qaSearch] = resolve => require(['./index/qaSearch.vue'], resolve);
page[Constants.PageName.qaList] = resolve => require(['./user/collection/qaList.vue'], resolve);
page[Constants.PageName.qaWallet] = resolve => require(['./user/wallet/qaWallet.vue'], resolve);
page[Constants.PageName.qaWalletDetail] = resolve => require(['./user/wallet/qaWalletDetail.vue'], resolve);
page[Constants.PageName.qaLogin] = resolve => require(['./qaLogin.vue'], resolve);
page[Constants.PageName.qaWithdraw] = resolve => require(['./user/wallet/qaWithdraw.vue'], resolve);
page[Constants.PageName.qaknowledge] = resolve => require(['./knowledge/qaknowledge.vue'], resolve);
page[Constants.PageName.qaNotice] = resolve => require(['./notice/qaNotice.vue'], resolve);//新增qaNotice
page[Constants.PageName.qaQuestion] = resolve => require(['./user/question/qaQuestion.vue'], resolve);//qaQuestion
page[Constants.PageName.qaKetangDetail] = resolve => require(['./knowledge/qaKetangDetail.vue'], resolve);//新增qaKetangDetail
page[Constants.PageName.qaDoc] = resolve => require(['./qaDoc.vue'], resolve);//新增qaUserAgreement
page[Constants.PageName.qaBindAccount] = resolve => require(['./user/account/qaBindAccount.vue'], resolve);//qaBindAccount
page[Constants.PageName.qaFind] = resolve => require(['./find/qaFind.vue'], resolve);//qaFind
page[Constants.PageName.qaManagerDetail] = resolve => require(['./find/qaManagerDetail.vue'], resolve);//qaManagerDetail
page[Constants.PageName.qaStrategyList] = resolve => require(['./find/qaStrategyList.vue'], resolve);//qaStrategyList
page[Constants.PageName.qaManagerList] = resolve => require(['./find/qaManagerList.vue'], resolve);//qaManagerList
page[Constants.PageName.qaGoodCase] = resolve => require(['./find/qaGoodCase.vue'], resolve);//qaGoodCase
page[Constants.PageName.qaGoodCaseDetail] = resolve => require(['./find/qaGoodCaseDetail.vue'], resolve);//qaGoodCaseDetail
page[Constants.PageName.qaManagerAskList] = resolve => require(['./find/qaManagerAskList.vue'], resolve);//qaManagerAskList

export default page;
