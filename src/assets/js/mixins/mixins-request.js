import {Request} from '../index';

let request;

export default {
    created() {
        request = new Request(this);
    },
    methods: {
        doRequest(url, param, success, error, finish) {
            request.post(url, param, success, error, finish)
        },
        doRequestGet(url, param, success, error, finish) {
            request.get(url, param, success, error, finish)
        }
    }
}
