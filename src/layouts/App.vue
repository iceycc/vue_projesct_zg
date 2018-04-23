<template>
  <div id="app">
    <!--<transition :name="transitionName" >-->
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
  </div>
</template>

<script>
  import {EventBus, Constants, mixins} from '../config/index';

  export default {
    name: 'app',
    mixins: [mixins.base, mixins.wx],
    data() {
      return {
        // transitionName:'',
        open: false,
        docked: false,
        toast: {
          show: false,
          message: '',
          Timer: null
        },
        login: false,
        isReadArrNum: 0,
      };
    },
    updated() {
      EventBus.$on(Constants.EventBus.add_red, function (value) {
        console.log(value)
      })
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
      console.log('mounted')
      var muDialogWrapper = document.querySelector('.mu-dialog-wrapper') || document
      var _tar = document.querySelector('.mu-dialog')//获取你的目标元素
      if(muDialogWrapper && _tar){
        this.EventUtil().addHandler(muDialogWrapper,'click', (e) => {
          var e = e || window.event;
          var target = e.target || e.srcElement;
          //1. 点击事件的对象不是目标区域本身
          //2. 事件对象同时也不是目标区域的子元素
          if (!(target == _tar) && !_tar.contains(target)) {
            //你的功能
            this.login = false;
            console.log('click')
            // this.EventUtil().removeHandler(muDialogWrapper,'click')

          } else {
            //你的功能
            console.log('_tar')
          }
        })
        this.EventUtil().addHandler(muDialogWrapper,'touch', (e) => {
          var e = e || window.event;
          var target = e.target || e.srcElement;
          //1. 点击事件的对象不是目标区域本身
          //2. 事件对象同时也不是目标区域的子元素
          if (!(target == _tar) && !_tar.contains(target)) {
            //你的功能
            this.login = false;
            console.log('touch')
            // this.EventUtil().removeHandler(muDialogWrapper,'touch')
          } else {
            //你的功能
            console.log('_tar')
          }
        })
      }

    },

    created() {
      EventBus.$on(Constants.EventBus.showToast, value => {
        this.showMessage(value);
      });

      EventBus.$on(Constants.EventBus.login, value => {
        this.login = true;
        setTimeout(()=>{
          this.login = false;
        },2500)
      });

    },
    beforeRouteUpdate(from,to,next){
      console.log('beforeRouteUpdate')
      if(to.name =='qaindex' && from.name == 'login'){
        console.log('login to qaindex')
      }
      next()
    },
    methods: {
      EventUtil(){
        return{
          /*检测绑定事件*/
          addHandler:(element,type,handler)=>{
            if(element.addEventListener){
              element.addEventListener(type,handler,false);
            }
            else if(element.attachEvent){
              element.attachEvent('on'+type,handler);
            }
            else{
              element["on"+type]=handler /*直接赋给事件*/
            }

          },
          /*通过removeHandler*/
          removeHandler:(element,type,handler) =>{   /*Chrome*/
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
      showMessage(value) {
        this.toast.show = true;
        this.toast.message = value.message;

        if (this.toast.Timer) clearTimeout(this.toast.Timer);
        this.toast.Timer = setTimeout(() => {
          this.toast.show = false;
        }, 2000);
      },
      showRed() {
        EventBus.$on(Constants.EventBus.add_red, function (value) {
          console.log(value)
        })
      }
    }
  };
</script>

<style lang="scss">
  @import "../assets/scss/base";
  @import "../assets/scss/px2rem";
  /* h */
  .mu-dialog {
    border-radius: px2rem(10)
  }

  .text-center {
    display: block !important;
    text-align: center !important;
    font-size: px2rem(24) !important;
    margin: 0 0 !important;
    height: px2rem(80);
    padding-top: px2rem(30);
    padding-bottom: px2rem(30);
    letter-spacing: px2rem(3) !important
  }

  .info-text {
    text-align: center;
    font-size: px2rem(12);
    color: #666;
    letter-spacing: px2rem(1) !important
  }

  .mu-dialog-body {
  }
</style>
