<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <mu-toast v-if="toast.show" :message="toast.message"></mu-toast>
    <mu-dialog :open="login" title="登录成功" titleClass="text-center">
      <div style="text-align: center">
        关注优装美家公众号<br>
        第一时间收到回答提醒<br>
        更多悬赏问题推送,助你拿取赏金
      </div>
      <mu-flat-button label="确定" slot="actions" primary @click="login = false"/>
    </mu-dialog>
  </div>
</template>

<script>
  import {EventBus, Constants, mixins} from '../assets/js/index';

  export default {
    name: 'app',
    mixins: [mixins.base, mixins.request],
    data() {
      return {
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
      console.log(to)
      if(to.name == 'qauser'){
        this.doRequest(Constants.Method.profile, null, (result) => {
          console.log("======beforeRouteLeave qauser qqqqq=========")
          EventBus.$emit('my_question_num',result.my_question_num)
        });
      }
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

  .text-center {
    /**/
    /*margin:0 auto;*/
    display: block !important;
    text-align: center !important;
    /*padding:0 px2rem(90);*/
  }
</style>
