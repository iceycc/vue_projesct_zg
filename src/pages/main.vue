<template>
    <div class="page">
        <div class="sub-page" v-bind:style="style">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
        <mu-bottom-nav :value="watch_bottomNav" @change="handleChange" ref="bottom" v-if="!$route.meta.isShowTab">
            <mu-bottom-nav-item value="0" title="问答">
                <img-wrapper :url="watch_bottomNav == 0 ? tab0[1] : tab0[0]" class="tabicon"></img-wrapper>
            </mu-bottom-nav-item>
            <mu-bottom-nav-item value="1" title="发现">
                <img-wrapper :url="watch_bottomNav == 1 ? tab1[1] : tab1[0]" class="tabicon"></img-wrapper>
            </mu-bottom-nav-item>
            <mu-bottom-nav-item value="2" title="提问">
                <img-wrapper :url="watch_bottomNav == 2 ? tab2[1] : tab2[0]" class="tabicon"></img-wrapper>
            </mu-bottom-nav-item>
            <mu-bottom-nav-item value="3" title="通知">

                <!--<i class="isread-num" v-if="notice_isread_num === 1 ? false : true"></i>-->
                <i class="isread-num" v-if="isreadShow"></i>
                <img-wrapper :url="watch_bottomNav == 3 ? tab3[1] : tab3[0]" class="tabicon"></img-wrapper>
            </mu-bottom-nav-item>
            <mu-bottom-nav-item value="4" title="我的">
                <img-wrapper :url="watch_bottomNav == 4 ? tab4[1] : tab4[0]" class="tabicon"></img-wrapper>
            </mu-bottom-nav-item>
            <div class="btn_ask" @click="handleChange(2)" v-if="!$route.meta.isShowTab">
                <div class="top">
                    <img-wrapper :url="tab2[1]" class="askicon"></img-wrapper>
                </div>
            </div>
        </mu-bottom-nav>

    </div>
</template>

<script>
    import {Constants, EventBus, mixins, API, util} from '../config/index';
    import ImgWrapper from "../components/commons/ImgWrapper.vue";
    import {ifWX} from "../config/util";

    export default {
        components: {
            ImgWrapper,
        },
        mixins: [mixins.base, mixins.wx],

        name: 'main',
        data() {
            return {
                ask_text: '提问',
                toast: {
                    show: false,
                    message: '',
                    Timer: null
                },
                bottomNav: 0,
                icon1: require('../assets/img/icon_ask_free.png'),
                icon2: require('../assets/img/icon_ask.png'),
                tab0: [require('../assets/img/icon_tab_index.svg'), require('../assets/img/icon_tab_index_ed.svg')],
                tab1: [require('../assets/img/icon_tab_school.svg'), require('../assets/img/icon_tab_school_ed.svg')],
                tab2: [require('../assets/img/icon_tab_ask.svg'), require('../assets/img/icon_tab_ask.svg')],
                tab3: [require('../assets/img/icon_tab_notifi.svg'), require('../assets/img/icon_tab_notifi_ed.svg')],
                tab4: [require('../assets/img/icon_tab_user.svg'), require('../assets/img/icon_tab_user_ed.svg')],
                icon_ask_close: require('../assets/img/icon_ask_close.svg'),
                style: {},
                notice_isread_num: 0,
                isreadShow: false,
                to_doc: {},
                role: 0,
                ifWX: false,
                hasSign: null
            };
        },
        created() {
            // EventBus.$on('showAsk',(val)=>{
            //     this.showAsk = val
            // })
            // 保证刷新时 下面的tab和路由对应
            var str = window.location.hash
            var href // 获取当前路由的path值
            if (str.indexOf('?') === -1) {
                href = str.slice(2)
            } else {
                href = str.slice(2, str.indexOf('?') + 1)
            }
            // switch (href) {
            //     case Constants.PageName.qaIndex:
            //         this.bottomNav = 0;
            //         break;
            //     case Constants.PageName.qaFind:
            //         this.bottomNav = 1;
            //         break;
            //     case Constants.PageName.qaNotice:
            //         this.bottomNav = 3;
            //         break;
            //     case Constants.PageName.qaUser:
            //         this.bottomNav = 4;
            //         break;
            //     default:
            //         break;
            // }

            // 监听通知消息的数量 >0 ,设置小红点
            EventBus.$on(Constants.EventBus.inform_num, (val) => {
                if (val) {
                    this.isreadShow = val > 0
                }
            })
            EventBus.$on('watch_bottomNav_num', (val) => {
                this.bottomNav = val
            })
            // 当初有个弹窗提示登陆成功，还能看用户协议文档
            this.to_doc = {name: Constants.PageName.qaDoc, params: {type: 2}}
            // 判断是否是微信端
            // this.ifWX =this.checkWX()
            // 先判断是否登陆
            this.hasSign = util.ls.getItem(Constants.LocalStorage.sign) || false
            let targetname = util.ls.getItem('targetName') || false
            let targetId = util.ls.getItem('targetId') || false
            // 微信👊🐔的操作
            if (ifWX()) {
                if (!this.hasSign) { // 没登陆先登陆
                    this.doWXLoginHandle(href)
                }
                else if (targetname) {
                    this.$router.push({
                        name: targetname,
                        query: {id: targetId}
                    })
                    util.ls.removeItem('targetName')
                    util.ls.removeItem('targetId')
                }
                else {
                    this.$router.push({
                        name: Constants.PageName.qaIndex,
                    })
                }
            }
            if (!ifWX()) {
                EventBus.$emit(Constants.EventBus.showToast, {
                    message: "建议在微信浏览器打开"
                })
            }
            if (!this.ifWX) {
                setTimeout(() => {
                    this.$router.push({
                        name: Constants.PageName.qaIndex,
                    })
                }, 100)
            }
            // 获取角色role
            if (this.hasSign) {
                this.getUserInfos(() => {
                    this.role = util.ls.getItem(Constants.LocalStorage.role)
                })
            }

            if (this.$route.params.isLogin) {
                EventBus.$emit(Constants.EventBus.login);
            }
        },
        watch: {
            // 坑 监视路由
            "$route":
                "getUserData"
        }
        ,
        computed: {
            watch_bottomNav() {
                return this.bottomNav
            }
        },
        mounted() {
            this.style = {
                height: (this.$el.offsetHeight - this.$refs['bottom'].$el.offsetHeight) + 'px'
            };
        }
        ,
        destroyed() {
            EventBus.$off('watch_bottomNav_num')
            EventBus.$off(Constants.EventBus.inform_num)
            EventBus.$off('showAsk')
        },
        methods: {
            // 微信登陆时的各种操作
            doWXLoginHandle(href) {
                // 初始化微信
                this.initWX(() => {
                    // console.log('wx success');
                });
                // 获取url上承载的sign
                var Request = new Object();
                Request = util.GetRequest();
                let sign = Request['sign']
                sign = sign || util.ls.getItem(Constants.LocalStorage.sign)
                // redirect和from_id是通过登陆页url传参，后台再返回的。。微信的登陆授权问题。。
                let redirect = Request['redirect'] || this.$route.query.redirect
                let from_id = Request['id']
                // ====test====
                // sign = '215b54bc24847bdaa7344b2504514881'
                // sign = 'a39c64680e64ee62b6a932a0a6c3942f'
                // ====test====
                // 设置sign
                window.localStorage.setItem(Constants.LocalStorage.sign, sign)
                let _this = this
                setTimeout(() => {
                    _this.getUserInfos()
                })

                // 当前路由指向qaknowledge（发现），直接跳转 不用校验。。
                if (href == 'qaknowledge') {
                    this.$router.replace({
                        name: href,
                    })
                }
                // redirect 为登陆拦截前要去的页面
                // 如何要去qadetail和qacomment 必须携带改页面的id和当前用户的uid才能获取对应的数据
                else if ((redirect == 'qadetail' || redirect == 'qacomment') && typeof from_id != 'undefined') {
                    // // console.log('redirect success')
                    this.$router.push({
                        name: redirect,
                        query: {
                            id: from_id,
                            uid: util.ls.getItem(Constants.LocalStorage.uid)
                        }
                    })
                }
                // 其他情况直接去index页面
                else {
                    setTimeout(() => {
                        this.$router.push({
                            name: Constants.PageName.qaIndex,
                        })
                    }, 100)
                }

            },

            getUserInfos(success) {
                API.post(Constants.Method.profile, {})
                    .then((result) => {
                        success && success(result)
                        let userInfos = result.data
                        util.ls.setItem(Constants.LocalStorage.role, userInfos.role);
                        this.role = userInfos.role;
                        util.ls.setItem(Constants.LocalStorage.question_num, userInfos.question_num)
                        util.ls.setItem(Constants.LocalStorage.inform_num, userInfos.inform_num)
                        util.ls.setItem(Constants.LocalStorage.collect_num, userInfos.collect_num)
                        util.ls.setItem(Constants.LocalStorage.uid, userInfos.uid)
                        this.isreadShow = userInfos.inform_num > 0
                    })
                    .catch((err) => {
                        // console.log(err);
                    });
            },
            webpage() {
                this.$router.push({name: Constants.PageName.qaDoc, params: {type: 2}})
            },
            getUserData(to, from) {

                switch (to.name) {
                    case Constants.PageName.qaIndex:
                        this.bottomNav = 0;
                        break;
                    case Constants.PageName.qaFind:
                        this.bottomNav = 1;
                        break;
                    case Constants.PageName.qaNotice:
                        this.bottomNav = 3;
                        break;
                    case Constants.PageName.qaUser:
                        this.bottomNav = 4;
                        break;
                    default:
                        break;
                }
                if (to.name === Constants.PageName.qaUser || to.name === Constants.PageName.qaDetail) return
                let hasSign = util.ls.getItem(Constants.LocalStorage.sign)
                if (!hasSign) return
                this.getUserInfos()
                // this.showAsk = false
            },
            toggleAsk() {
                let sign = util.ls.getItem(Constants.LocalStorage.sign)
                if (!sign) {
                    EventBus.$emit(Constants.EventBus.toTelLogin, 'showAsk')
                    return
                }
                // this.showAsk = true;
                EventBus.$emit('showAskBox')
            },
            gotoAsk(type) {
                // console.log(type)
                this.pushPage({
                    name: Constants.PageName.qaAsk,
                    query: {
                        type: type
                    }
                });
            }
            ,
            handleChange(value) {
                console.log('value');
                console.log(value);
                console.log(this.role);
                let name = '';
                switch (parseInt(value)) {
                    case 0:
                        name = Constants.PageName.qaIndex;
                        break;
                    case 1:
                        name = Constants.PageName.qaFind;
                        break;
                    case 2:
                        this.bottomNav = 2

                        if (this.role == 1) {
                            EventBus.$emit(Constants.EventBus.showToast, {
                                message: '管家没有提问权限'
                            });
                        }
                        else {
                            this.toggleAsk();
                        }
                        break;
                    case 3:
                        name = Constants.PageName.qaNotice;
                        break;
                    case 4:
                        name = Constants.PageName.qaUser;
                        break;
                }
                this.bottomNav = value;
                this.pushPage({
                    name: name
                });
            }

        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only 111-->
<style lang="scss" scoped>
    @import "../assets/scss/px2rem";

    input, select, option, textarea {
        outline: none;
    }

    .page {
        background: #f2f2f2;
        padding-bottom: px2rem(70);
    }

    .mu-bottom-nav {
        position: fixed;
        bottom: 0;
        border-top: 1px solid #ccc
    }

    .sub-page {
        flex-grow: 1;
        /*padding-bottom: px2rem(120);*/
    }

    .tabicon {
        width: 25px;
        height: 25px;
    }

    $ask_with: 55px;
    .btn_ask {
        position: absolute;
        background: rgba(1, 1, 1, 0);
        width: $ask_with;
        height: 75px;
        bottom: 0px;
        left: 50%;
        margin-left: -$ask_with/2;
        border-radius: $ask_with/2;
        border-top: 1px solid #ccc;
        overflow: hidden;
        .top {
            width: 100%;
            height: $ask_with;
            background: #fff;
            padding-top: ($ask_with - 40px)/2;
        }
        .askicon {
            width: 40px;
            height: 40px;
        }
    }

    .isread-num {
        position: absolute;
        left: px2rem(46);
        top: px2rem(6);
        display: inline-block;
        content: "";
        width: px2rem(6);
        height: px2rem(6);
        border-radius: px2rem(3);
        background: red;
    }
</style>

