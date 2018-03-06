<template>
    <div class="page">
        <div class="btn-view">
            <div class="btn-submit" @click="gotoLogin"><img src="../assets/img/icon_login_wechat.svg" alt="">
                <span>微信登录</span></div>
            <div class="btn-desc">同意诸葛装修<a href="">用户协议</a></div>
        </div>

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
            return {};
        },
        computed: {},
        created() {
            let id = this.$route.query.id;
            console.log(id);
            if (id) {
                this.gotoMain(id);
            }
        },
        methods: {
            gotoLogin() {
                let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?';
                let appid = 'appid=wx7a6e11836803bbbb';
                let redirect_uri = '&redirect_uri=http%3A%2F%2Fm.uzhuang.com%2Fwxpay%2Fwx_login%2Fwd_wx_login.php';
                let response_type = '&response_type=code';
                let scope = '&scope=snsapi_userinfo';
                let wechat_redirect = '#wechat_redirect';

                window.location.href = url + appid + redirect_uri + response_type + scope + wechat_redirect;
            },
            gotoMain(id) {
                this.$ls.remove(Constants.LocalStorage.uid);
                console.log(id);
                this.doRequest(Constants.Method.profile, {
                    uid: id
                }, (result) => {
                    this.data = result;
                    this.$ls.set(Constants.LocalStorage.uid, id);

                    this.$router.replace({
                        name: Constants.PageName.qaIndex,
                        params: {
                            isLogin: true
                        }
                    });
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/scss/px2rem";

    .page {
      background: url("../../static/bg-img.png") no-repeat 0 0;
      background-size:cover ;
        /*background-color: #1bd4bb;*/
    }

    .btn-view {
        margin-top: px2rem(500);
        text-align: center;
    }

    .btn-submit {
        color: #1aad19;
        background-color: white;
        border: px2rem(1) #1aad19 solid;
        border-radius: px2rem(3);
        margin: 0 px2rem(50) 0 px2rem(50);
        padding: px2rem(10);
        font-size: px2rem(16);
        font-weight: bold;
        display: flex;
        justify-content: center;
        & img {
            width: px2rem(20);
            height: px2rem(20);
            margin-right: px2rem(20);

        }
    }

    .btn-desc {
        padding: px2rem(10);
        color: white;
        & a {
            color: white;
            text-decoration: underline;
        }
    }
</style>
