<template>
    <div class="page">
        <div class="btn-submit" @click="submit">微信登录</div>
    </div>
</template>

<script>
    import {Constants, EventBus, mixins} from '../assets/js/index';

    import ComponentTemplate from "../components/template";
    import AutoListView from "../components/AutoListView";

    export default {
        components: {
            AutoListView,
            ComponentTemplate
        },
        mixins: [mixins.base, mixins.request],
        name: Constants.PageName.qaLogin,
        data() {
            return {
                url: Constants.Method.test,
                title: '关于',
                version: process.env.APP_VERSION,
                localValue: this.$ls.get(Constants.LocalStorage.test, '-1')
            };
        },
        computed: {},
        created() {
        },
        methods: {
            submit() {
                let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?';
                let appid = 'appid=wx7a6e11836803bbbb';
                let redirect_uri = '&redirect_uri=http%3A%2F%2Fm.uzhuang.com%2Fwxpay%2Fpay%2FWeixin%2Fh5_wx%2Fexample%2Findex.html%23%2Fqauser';
                let response_type = '&response_type=code';
                let scope = '&scope=snsapi_userinfo';
                let wechat_redirect = '#wechat_redirect';

                window.location.href = url + appid + redirect_uri + response_type + scope + wechat_redirect;
                console.log(url + appid + response_type + scope + wechat_redirect);
                //
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/scss/px2rem";

    .btn-submit {
        text-align: center;
        color: white;
        background-image: $bgImage;
        border-radius: px2rem(3);
        margin: px2rem(40) px2rem(20) 0 px2rem(20);
        padding: px2rem(10);
        font-size: px2rem(16);
        font-weight: bold;
    }
</style>
