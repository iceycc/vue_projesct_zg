import axios from 'axios';
import Config from './axiosOption';
import {EventBus, Constants} from '../index';

const _axios = axios.create(Config);

/**
 * 这里会按照约定好的api格式做简单的校验.可以根据需要配置
 */
_axios.interceptors.response.use((response) => {
    let result = response.data;
    if (typeof result === 'string') {
    // if (true) {
        result = JSON.parse(result);
    }
    if (result && 'code' in result) {//&& 'data' in result
        if (result.code === 0 || result.code === 200 || result.code === '400') {
            return result;
        }else {
            return Promise.reject({
                msg: '接口返回错误',
                data: result.message
            });
        }
    } else {
        // EventBus.$emit(Constants.EventBus.showToast, {message: '接口异常'});
      console.log('接口异常')
        return Promise.reject({
            msg: 'api 不符合规范',
            data: result
        });
    }
}, (error) => {
  console.dir(error);
  if (error.message === 'Network Error') {//网络异常
        return Promise.reject({
            msg: 'Network Error',
            data: '请检查网络连接是否正常.'
        });
    }
});

export default _axios;
