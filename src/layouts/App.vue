<template>
    <div id="app">
        <!--<transition :name="transitionName" >-->
        <div class="111" v-if="showAsk1"></div>
        <show-ask
                :showAsk="showAsk1"
        ></show-ask>
        <!--<show-ask-->
                <!--:showAsk="showAsk1"-->
        <!--&gt;</show-ask>-->
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <!--</transition>-->

        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <mu-toast v-if="toast.show" :message="toast.message"></mu-toast>
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
                    <input type="text" placeholder="请输入手机号" v-model="tel">
                    <!--<span class="stay"></span>-->
                </label>
                <label for="">
                    <span> </span>
                    <input type="text" placeholder="" v-model="codepic">
                    <button :disabled="disabled" class="btn stay" @click="senSmshandle">{{send_text}}</button>
                </label>
            </section>
            <a slot="actions" herf="javascript:;" @click="closeAlertDialog" style="margin-right: 10px">关闭</a>
            <a slot="actions" herf="javascript:;" @click="goLogin" style="margin-right: 30px">登陆</a>
        </mu-dialog>

        <!--<show-ask-->
                <!--:showAsk="showAsk1"-->
        <!--&gt;</show-ask>-->

    </div>
</template>

<script>
    import ShowAsk from "../components/commons/ShowAsk"

    import {EventBus, Constants, mixins, API,util} from '../config/index';
    const codeImgUrl = 'http://merchant.uzhuang.com/v1/login/get-imgcode'

    const sendTime = 6
    export default {
        name: 'app',
        mixins: [mixins.base, mixins.wx],
        components:{
            ShowAsk
        },
        data() {
            return {
                disabled:false,
                // transitionName:'',
                openAlert: false,
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
                codepic:null,
                targerPage:'',
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
            // let {} = this.EventUtil
            // console.log('mounted')
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

        },

        created() {
            EventBus.$on('showAsk',(val)=>{
                this.showAsk1 = val

            })

            EventBus.$on('showAskBox',()=>{
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
            EventBus.$on(Constants.EventBus.toTelLogin, (target) => {
                this.openAlert = true
                    this.targerPage = target // 登陆成功后的跳转的页面  注意showAsk

            });

        },
        destroyed(){
            EventBus.$off('showAsk') // 问答弹出层
            EventBus.$off('showAskBox')

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
                if(this.tel == ''){
                    EventBus.$emit(Constants.EventBus.showToast,{
                        message:'电话不能为空'
                    })
                    return
                }

                this.send_text = sendTime
                this.disabled = true
                var timer = setInterval(() => {

                    this.send_text--
                    if (this.send_text == -1) {
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
            goLogin(){

                let data = {
                    code: this.codepic,
                    mobile: this.tel
                }
                API.post(Constants.Method.telLogin,data)
                    .then(result =>{
                        this.openAlert = false
                        if(result.code ==0 && result.data){
                            this.getUserInfos()
                            this.codepic = ''
                            util.ls.setItem(Constants.LocalStorage.sign,result.data)
                            if(this.targerPage ==='showAsk'){
                                EventBus.$emit('showAskBox')
                                return
                            }
                            this.$router.push({name:this.targerPage})
                        }else {
                            EventBus.$emit(Constants.EventBus.showToast,{
                                message:result.message
                            })
                        }
                    })
            },
            //
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
            showMessage(value) {
                this.toast.show = true;
                this.toast.message = value.message;

                if (this.toast.Timer) clearTimeout(this.toast.Timer);
                this.toast.Timer = setTimeout(() => {
                    this.toast.show = false;
                }, 2000);
            },
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
            margin-right: px2rem(10);
            width: px2rem(100);
            height: px2rem(30);
            background: #f2f2f2;
            padding-left: px2rem(6);
        }
        .stay{
            width: px2rem(70);

        }
        button {
            border: none;
            height: px2rem(30);
            text-align: center;
            color: #fff;
            line-height: px2rem(30);
            font-size: px2rem(12);
        }
        .btn {
            background: #0edda2;
        }

    }
</style>
