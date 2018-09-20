<template>
    <div id="app">
        <show-ask
                :showAsk="showAsk1"
        ></show-ask>

        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>

        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <mu-snackbar v-if="toast.show"
                     actionColor = "red"
                     :message="toast.message" action="关闭" @actionClick="hideToast" @close="hideToast"/>
        <mu-dialog :open="login" title="登录成功" titleClass="text-center">
            <div class="info-text">
                关注优装美家公众号<br>
                第一时间收到回答提醒<br>
            </div>
            <!--<mu-flat-button label="确定" slot="actions" primary @click="login = false"/>-->
        </mu-dialog>
        <mu-dialog title="手机号登录" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false"
                   :open.sync="openAlert">
            <section class="login">
                <label for="">
                    <span>+86 </span>
                    <input type="number" placeholder="请输入手机号" v-model="tel">
                    <!--<span class="stay"></span>-->
                </label>
                <label for="">
                    <span> </span>
                    <input type="number" placeholder="" v-model="codepic">
                    <button :disabled="disabled" class="btn stay" @click="senSmshandle">{{send_text}}</button>
                </label>
            </section>
            <a slot="actions" herf="javascript:;" @click="closeAlertDialog" style="margin-right: 10px">关闭</a>
            <a slot="actions" herf="javascript:;" @click="goLogin" style="margin-right: 30px">登陆</a>
        </mu-dialog>


        <mu-dialog title="您还未登陆，是否去登陆?" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlertWx">
            <a slot="actions" @click="closeAlertDialogWx" style="margin-right: 20px">关闭</a>
            <a slot="actions" @click="goWxLogin" style="margin-right: 20px">确定</a>
        </mu-dialog>

        <!--<show-ask-->
        <!--:showAsk="showAsk1"-->
        <!--&gt;</show-ask>-->

    </div>
</template>

<script>
    import ShowAsk from "../components/commons/ShowAsk"
    import {EventBus, Constants, mixins, API, util} from '../config/index';
    import {ifWX} from "../config/util";
    const codeImgUrl = 'http://merchant.uzhuang.com/v1/login/get-imgcode'

    const sendTime = 60
    export default {
        name: 'app',
        mixins: [mixins.base, mixins.wx],
        components: {
            ShowAsk,
        },
        data() {
            return {
                disabled: false,
                // transitionName:'',
                openAlert: false,
                openAlertWx:false,
                open: false,
                docked: false,
                toast: {
                    show: false,
                    message: '',
                    Timer: null
                },
                login: false,
                isReadArrNum: 0,
                tel: '',
                send_text: '获取验证码',
                time: sendTime,
                codepic: null,
                targerPage: '',
                showAsk1: false,

            };
        },
        updated() {

        },
        // watch: {
        //   '$route' (to, from){
        //     const toDepth = to.path.split('/').length
        //     const fromDepth = from.path.split('/').length
        //     this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        //   }
        // },
        mounted() {
            // this.clickOut()
        },

        created() {
            EventBus.$on('showAsk', (val) => {
                this.showAsk1 = val

            })

            EventBus.$on('showAskBox', () => {
                console.log('showAskBox')
                this.showAsk1 = true
            })

            EventBus.$on(Constants.EventBus.showToast, value => {
                this.showMessage(value);
            });

            EventBus.$on(Constants.EventBus.login, value => {
                this.login = true;
                setTimeout(() => {
                    this.login = false;
                }, 2500)
            });
            EventBus.$on("showWxIfLogin", (val) => {
                this.openAlertWx = true
                if(!val) return
                let bottomNav = 0
                switch (val) { //
                    case Constants.PageName.qaIndex:
                        bottomNav = 0;
                        break;
                    case Constants.PageName.qaFind:
                        bottomNav = 1;
                        break;
                    default:
                        break;
                }
                EventBus.$emit('watch_bottomNav_num', bottomNav)
            });


            EventBus.$on(Constants.EventBus.toTelLogin, (target) => {
                if(ifWX()){
                    // 微信
                    // var r = confirm("您还未登陆，是否去登陆")
                    this.openAlertWx = true


                }else {
                    // 非微信
                    this.openAlert = true
                    this.targerPage = target // 登陆成功后的跳转的页面  注意showAsk
                }


            });

        },
        destroyed() {
            EventBus.$off('showAsk') // 问答弹出层
            EventBus.$off('showAskBox')
            EventBus.$off("showWxIfLogin");
            EventBus.$off(Constants.EventBus.showToast);
            EventBus.$off(Constants.EventBus.login);
            EventBus.$off(Constants.EventBus.toTelLogin);
        },
        beforeRouteUpdate(from, to, next) {
            // console.log('beforeRouteUpdate')
            if (to.name == 'qaindex' && from.name == 'login') {
                // console.log('login to qaindex')
            }
            next()
        },
        methods: {
            goWxLogin(){
                let pathname = this.$route.name
                let id = this.$route.query.id
                util.ls.setItem('targetName',pathname)
                util.ls.setItem('targetId',id)
                this.$router.push({
                    name:Constants.PageName.qaLogin
                })
                this.openAlertWx = false
            },
            EventUtil() {
                return {
                    /*检测绑定事件*/
                    addHandler: (element, type, handler) => {
                        if (element.addEventListener) {
                            element.addEventListener(type, handler, false);
                        }
                        else if (element.attachEvent) {
                            element.attachEvent('on' + type, handler);
                        }
                        else {
                            element["on" + type] = handler
                            /*直接赋给事件*/
                        }

                    },
                    /*通过removeHandler*/
                    removeHandler: (element, type, handler) => {   /*Chrome*/
                        if (element.removeEventListener)
                            element.removeEventListener(type, handler, false);
                        else if (element.deattachEvent) {               /*IE*/
                            element.deattachEvent('on' + type, handler);
                        }
                        else {
                            element["on" + type] = null;
                            /*直接赋给事件*/
                        }
                    }
                }
            },
            // sendSms
            senSmshandle() {
                console.log(this.tel);
                if (this.tel == '') {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '电话不能为空'
                    })
                    return
                }
                if (this.tel.length !== 11) {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '请输入11位手机号'
                    })
                    return
                }

                let timerNum = sendTime
                this.disabled = true
                var timer = setInterval(() => {

                    timerNum--
                    this.send_text = timerNum + 's'
                    if (this.send_text =='-1s') {
                        this.disabled = false
                        this.send_text = '点击重新发送'
                        clearTimeout(timer)
                        return
                    }

                }, 1000)

                let data = {
                    mobile: this.tel,
                }
                API.post(Constants.Method.sendSms, data)
                    .then(result => {
                        console.log(result);
                    })
            },
            // goLogin
            goLogin() {
                if (this.tel == '') {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '电话不能为空'
                    })
                    return
                }
                if (this.tel.length !== 11) {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '请输入11位手机号'
                    })
                    return
                }
                if(this.codepic == '') {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '其输入短信验证码'
                    })
                    return
                }
                let data = {
                    code: this.codepic,
                    mobile: this.tel
                }
                API.post(Constants.Method.telLogin, data)
                    .then(result => {
                        if (result.code == 0 && result.data) {
                            this.openAlert = false
                            this.getUserInfos()
                            this.codepic = ''
                            util.ls.setItem(Constants.LocalStorage.sign, result.data)
                            if (!this.targerPage) { // 没有传目标直接关闭
                                return
                            }
                            if (this.targerPage === 'showAsk') { // 提问时
                                EventBus.$emit('showAskBox')
                                return
                            }
                            this.$router.push({name: this.targerPage})
                        } else {
                            EventBus.$emit(Constants.EventBus.showToast, {
                                message: result.message
                            })
                            return
                        }
                    })
            },
            //
            closeAlertDialogWx(){
                this.openAlertWx = false
            },
            closeAlertDialog() {
                this.openAlert = false
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
            hideToast () {
                this.toast.show = false
                if (this.toast.Timer) clearTimeout(this.toast.Timer)
            },
            showMessage(value) {
                this.toast.show = true;
                this.toast.message = value.message;
                if (this.toast.Timer) clearTimeout(this.toast.Timer);
                this.toast.Timer = setTimeout(() => {
                    this.toast.show = false;
                }, 4000);
            },
            // 弃用
            clickOut(){
                var muDialogWrapper = document.querySelector('.mu-dialog-wrapper') || document
                var _tar = document.querySelector('.mu-dialog')//获取你的目标元素
                if (muDialogWrapper && _tar) {
                    this.EventUtil().addHandler(muDialogWrapper, 'click', (e) => {
                        var e = e || window.event;
                        var target = e.target || e.srcElement;
                        //1. 点击事件的对象不是目标区域本身
                        //2. 事件对象同时也不是目标区域的子元素
                        if (!(target == _tar) && !_tar.contains(target)) {
                            //你的功能
                            this.login = false;
                            // console.log('click')
                            // this.EventUtil().removeHandler(muDialogWrapper,'click')

                        } else {
                            //你的功能
                            // console.log('_tar')
                        }
                    })
                    this.EventUtil().addHandler(muDialogWrapper, 'touch', (e) => {
                        var e = e || window.event;
                        var target = e.target || e.srcElement;
                        //1. 点击事件的对象不是目标区域本身
                        //2. 事件对象同时也不是目标区域的子元素
                        if (!(target == _tar) && !_tar.contains(target)) {
                            // 你的功能
                            this.login = false;
                            // console.log('touch')
                            // this.EventUtil().removeHandler(muDialogWrapper,'touch')
                        } else {
                            // 你的功能
                            // console.log('_tar')
                        }
                    })
                }
            }
        }
    };
</script>

<style lang="scss">
    @import "../assets/scss/base";
    @import "../assets/scss/px2rem";
    /* h */
    #app {
        overflow: auto; /* 用于 android4+，或其他设备 */
        -webkit-overflow-scrolling: touch; /* 用于 ios5+ */
    }

    .mu-dialog {
        border-radius: px2rem(10);
        padding-bottom: px2rem(10)
    }

    .text-center {
        display: block !important;
        text-align: center !important;
        font-size: px2rem(24) !important;
        margin: 0 0 !important;
        height: px2rem(70);
        padding-top: px2rem(20);
        padding-bottom: px2rem(40);
        letter-spacing: px2rem(3) !important;
    }

    .info-text {
        text-align: center;
        font-size: px2rem(14);
        color: #666;
        letter-spacing: px2rem(1) !important
    }

    .mu-dialog-body {
    }

    .login {
        label {
            display: flex;
            margin-bottom: px2rem(10);
        }
        span {
            width: px2rem(40);
        }
        input {
            flex: 1;
            border: none;
            margin-right: px2rem(3);
            width: px2rem(100);
            height: px2rem(30);
            background: #f2f2f2;
            padding-left: px2rem(6);
        }
        .stay {
            width: px2rem(100);
        }
        button {
            outline: none;
            border: none;
            height: px2rem(30);
            text-align: center;
            color: #fff;
            line-height: px2rem(30);
            font-size: px2rem(13);
        }
        .btn {
            background: #0edda2;
        }

    }
</style>
