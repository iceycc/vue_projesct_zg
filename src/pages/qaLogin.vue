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
  import {Constants, EventBus, mixins, API} from '../config/index';
  import ComponentTemplate from "../components/template";
  import AutoListView from "../components/commons/AutoListView";

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
      this.to_doc = {name: Constants.PageName.qaDoc, params: {type: 1}}
      // let text = null;
      // EventBus.$on(Constants.EventBus.sign,(val)=>{
      //   text = val
      // })
      let sign = window.localStorage.getItem(Constants.LocalStorage.sign)
      if (sign) {
        this.gotoLogin()
      }

    },
    methods: {
      gotoLogin() {
        window.location.href = 'http://wx.uzhuang.com/index.php?r=wx/oauth2'
      },
      gotoMain(uid) {
        this.$ls.remove(Constants.LocalStorage.uid);
        this.getUserInfos(uid, () => {
          this.$ls.set(Constants.LocalStorage.uid, uid);
          // this.$router.replace({
          //   name: Constants.PageName.qaIndex,
          //   params: {
          //     sign:uid,
          //     isLogin: true
          //   }
          // });
        })
      },
      getUserInfos(uid, success) {
        API.post(Constants.Method.profile, {})
          .then((result) => {
            let userInfos = result.data
            this.$ls.set(Constants.LocalStorage.role, userInfos.role);
            this.$ls.set(Constants.LocalStorage.question_num, userInfos.question_num)
            this.$ls.set(Constants.LocalStorage.inform_num, userInfos.inform_num)
            this.$ls.set(Constants.LocalStorage.collect_num, userInfos.collect_num)
            this.$ls.set(Constants.LocalStorage.collect_num, userInfos.uid)
            success && success(result)
          })
          .catch((err) => {
            console.log(err);
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
