import API from '../../request/index';
import * as Constants from '../Constants';
import {ifWX} from "../util";
export default {
  created() {
  },
  methods: {
    initWX(callBack) {
        if(ifWX()){
            //  获取当前url的微信配置凭证
            API.post(Constants.Method.get_wx_config_info, null)
                .then((result) => {
                    console.log(result);
                    result = JSON.parse(result)
                    console.log(result);
                    wx.config(
                        result
                    );
                    wx.ready(function () {
                        // console.log('wx.ready');
                        callBack && callBack();
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    });
                    wx.error(function (res) {
                        // console.log('error:', res);
                    });
                })
                .catch((err)=>{
                    // console.log(err);
                    console.log(err);
                });
        }
    }
  }
};
