/**
 * Created by zhangweiwei on 2017/04/10.
 * https://ykloveyxk.github.io/2017/02/25/axios%E5%85%A8%E6%94%BB%E7%95%A5/ axios全攻略
 */

import axios from '../assets/js/request/axiosInstance'; // axios
import {Constants, EventBus} from '../assets/js/index'; //

class Request {

    constructor(page) {
        this.page = page;
        this.axios = axios;
    }

    static handleParam(param) {
        if (!param) {
            param = {};
        }

        let id = localStorage.getItem('uid');
        if (id) {
            param.uid = id;
        }
        return param;
        /*        param.app_env = process.env.NODE_ENV;
                param.app_version = process.env.APP_VERSION;
                param.app_model = navigator.userAgent;*/
    }

    static isHasHttp(url) {
        return url.indexOf('http') === 0;
    }

    getOption() {
        return this.axios.defaults;
    }

    post(url, param, success, fail, finish) {
        return this._request(url, 'post', param, success, fail, finish);
    }

    get(url, param, success, fail, finish) {
        return this._request(url, 'get', param, success, fail, finish);
    }
    all(reqAll,){
      return this._request(url, '')
    }
    _request(url, type, param, success, fail, finish) {
        url = Request.isHasHttp(url) ? url : this.getOption().baseURL + '?' + url;

        this.getOption().method = type;

        //处理基础请求参数
        param = Request.handleParam(param);
        let request;
        this.getOption().params = null;
        this.getOption().data = null;
        switch (this.getOption().method) {
            case 'get':
                this.getOption().params = param;
                request = axios.get(url);
                break;
          default:
                this.getOption().data = param;
                request = axios[type](url, null);
        }
        request.then((response) => {
            success && success(response.data, response);
            finish && finish();
        }).catch((error) => {
            EventBus.$emit(Constants.EventBus.showToast, {
                message: error.data
            });
            if (error && 'data' in error) { //接口错误
                console.error('接口异常', error.data);
            } else {
                console.error('请求异常', error);
            }

            fail && fail();
            finish && finish();
        });

        return request;
    }

}

export default Request;
