import {Request} from '../index';

let request;

export default {
    created() {
        request = new Request(this);
    },
    methods: {
        doRequest(url, param, success, error, finish) {
            if (url) {
                request.post(url, param, success, error, finish);
            } else {
                console.error('url为空');
            }
        },
        doRequestGet(url, param, success, error, finish) {
            request.get(url, param, success, error, finish);
        }
    }
};
