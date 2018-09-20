<template>
    <div class="page">
        <div class="top-text">
            <div class="app-title">
                <img src="../assets/img/zhuge-logo.png" alt="">
                <span>诸葛装修</span>
            </div>
            <p class="app-text">立即登录，解锁全部功能</p>
        </div>
        <div class="btn-view">
            <div class="btn-submit" @click="gotoLogin"><img src="../assets/img/icon_login_wechat.svg" alt="">
                <span>微信登录</span></div>
            <div class="btn-desc">同意诸葛装修
                <router-link :to="to_doc">用户协议</router-link>
            </div>
        </div>

    </div>
</template>

<script>
    import {Constants, EventBus, mixins, API} from '../config/index'
    import ComponentTemplate from "../components/template"
    import AutoListView from "../components/commons/AutoListView"
    import {ifWX} from "../config/util";

    export default {

        components: {
            AutoListView,
            ComponentTemplate
        },
        mixins: [mixins.base, mixins.wx],
        name: Constants.PageName.qaLogin,
        data() {
            return {
                to_doc: {}
            };
        },
        computed: {},
        created() {
            this.fenXiang({
                title: '诸葛装修，全方位解决您的装修问题',
                imgUrl: 'http://image1.uzhuang.com/zhuge-logo.png'
            }, function () {
                // console.log('fenXiang');
            })
            // 前往协约页面
            this.to_doc = {name: Constants.PageName.qaDoc, params: {type: 1}}
            //
            let sign = window.localStorage.getItem(Constants.LocalStorage.sign)
            if (sign) {
                this.gotoLogin()
            }
        },

        methods: {
            gotoLogin() {
                let redirect = this.$route.query.redirect
                let id = this.$route.query.id
                // console.log(redirect);
                window.localStorage.removeItem(Constants.LocalStorage.sign)
                window.localStorage.removeItem(Constants.LocalStorage.uid)
                window.localStorage.removeItem(Constants.LocalStorage.role)
                window.localStorage.removeItem(Constants.LocalStorage.question_num)
                window.localStorage.removeItem(Constants.LocalStorage.inform_num)
                // redirect 和 id 前后约定的 用于登陆拦截后能再跳转到问答详情和评论详情页
                window.location.href = `http://wx.uzhuang.com/index.php?r=wx/oauth2&redirect=${redirect}&id=${id}`
            },
            gotoMain() {
                window.localStorage.clear();
            },
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/scss/px2rem";

    .page {
        background: url("../assets/img/bg-img.png") no-repeat 0 0;
        background-size: cover;
        /*background-color: #1bd4bb;*/
    }

    .top-text {
        font-size: 0;
        text-align: center;
        margin-top: px2rem(50);
        .app-title {
            img {
                width: px2rem(60);
                height: px2rem(60);
                vertical-align: middle;
            }
            span {
                display: inline-block;
                height: 100%;
                line-height: px2rem(60);
                font-size: px2rem(40);
                color: #fff;
                vertical-align: middle;
            }
        }
        .app-text {
            margin: 0;
            font-size: px2rem(20);
            color: #fff;
        }
    }

    .btn-view {
        position: absolute;
        width: px2rem(250);
        bottom: px2rem(70);
        text-align: center;
        left: 50%;
        margin-left: px2rem(-125);
    }

    .btn-submit {
        color: #1aad19;
        background-color: white;
        border: px2rem(1) #1aad19 solid;
        border-radius: px2rem(3);
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
