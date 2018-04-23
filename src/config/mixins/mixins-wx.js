import API from '../../request/index';
import * as Constants from '../Constants';
export default {
  created() {
  },
  methods: {
    initWX(callBack) {
      let params = {
        url: window.location.href.split('#')[0]
      };
      console.log(params);
      //  获取当前url的微信配置凭证
      API.post(Constants.Method.get_wx_config_info, params)
          .then((result) => {
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: result.appId, // 必填，公众号的唯一标识
              timestamp: result.timestamp, // 必填，生成签名的时间戳
              nonceStr: result.nonceStr, // 必填，生成签名的随机串
              signature: result.signature,// 必填，签名，见附录1
              jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
              console.log('wx.ready');
              callBack && callBack();
              // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            });
            wx.error(function (res) {
              console.log('error:', res);
            });
          });
    }
  }
};
