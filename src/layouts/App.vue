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
        更多悬赏问题推送, 助你拿取赏金
      </div>
      <!--<mu-flat-button label="确定" slot="actions" primary @click="login = false"/>-->
    </mu-dialog>
    <div class="no-use"></div>
  </div>
</template>

<script>
  import {EventBus, Constants, mixins} from '../assets/js/index';

  export default {
    name: 'app',
    mixins: [mixins.base, mixins.request],
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
      document.addEventListener('touch', (e) => {
        var e = e || window.event;
        var target = e.target || e.srcElement;
        var _tar = document.querySelector('.mu-dialog')//获取你的目标元素
        //1. 点击事件的对象不是目标区域本身
        //2. 事件对象同时也不是目标区域的子元素
        if (!(target == _tar) && !_tar.contains(target)) {
          //你的功能
          this.login = false;
          console.log('touch')

        } else {
          //你的功能
        }
      })
      document.addEventListener('click', (e) => {
        var e = e || window.event;
        var target = e.target || e.srcElement;
        var _tar = document.querySelector('.mu-dialog')//获取你的目标元素
        //1. 点击事件的对象不是目标区域本身
        //2. 事件对象同时也不是目标区域的子元素
        if (!(target == _tar) && !_tar.contains(target)) {
          //你的功能
          console.log('onclick')
          this.login = false;
        } else {
          //你的功能
        }
      })
    },

    created() {
      EventBus.$on(Constants.EventBus.showToast, value => {
        this.showMessage(value);
      });

      EventBus.$on(Constants.EventBus.login, value => {
        this.login = true;
      });


    },
    beforeRouteUpdate(to, from, next) {
      // 在当前路由改变，但是该组件被复用时调用
      // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
      // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
      // 可以访问组件实例 `this`
      // console.log(to)
      // if(to.name == 'qauser'){
      //   this.doRequest(Constants.Method.profile, null, (result) => {
      //     console.log("======beforeRouteLeave qauser qqqqq=========")
      //     EventBus.$emit('my_question_num',result.my_question_num)
      //   });
      // }
      // if(to.mame == 'qaindex'){
      //   document.title = '问答';
      // }
      next()
    },
    methods: {
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
    letter-spacing: px2rem(3) !important
  }

  .info-text {
    text-align: center;
    font-size: px2rem(12);
    color: #666;
    letter-spacing: px2rem(1) !important
  }

  .mu-dialog-body {
    padding-bottom: px2rem(30) !important;
  }
</style>
