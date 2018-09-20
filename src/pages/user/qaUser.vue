<template>
  <div class="content">
    <app-bar :title="title"></app-bar>

    <div>
      <div class="user-view">
        <img-wrapper :url="data.avatar"
                     classStyle="avatar" @onClick="ifGoDetail(null,null)"></img-wrapper>
        <div class="username">{{data.name}}</div>
      </div>
      <div class="menu">
        <div class="item" @click="gotoList(1)">
          <img-wrapper :url="icon_fav" classStyle="icon"></img-wrapper>
          <div class="name">我的收藏</div>
          <div class="num">{{collect_num}}</div>
          <img-wrapper :url="icon_user_arrow" classStyle="icon_arrow"></img-wrapper>
        </div>
        <div class="divider"></div>
        <div class="item" @click="gotoQuestion">
          <img-wrapper :url="icon_qu" classStyle="icon"></img-wrapper>
          <div class="name">我的问答</div>
          <div class="num" v-bind:class="{'red-point':data.red_dot > 0}">
            {{my_question}}
          </div>
          <img-wrapper :url="icon_user_arrow" classStyle="icon_arrow"></img-wrapper>
        </div>
        <div class="divider"></div>
        <div class="item" @click="gotoWallet">
          <img-wrapper :url="icon_wallet" classStyle="icon"></img-wrapper>
          <div class="name">我的钱包 <span class="desc">赏金都在这里哦~</span></div>
          <div class="num" style="visibility: hidden"></div>
          <img-wrapper :url="icon_user_arrow" classStyle="icon_arrow"></img-wrapper>
        </div>
      </div>
      <div class="goaccount">
        <a href="javascript:;" @click="clickThree">诸葛装修 V1.2.0</a>
      </div>

    </div>
  </div>

</template>

<script>
  import {Constants, EventBus, mixins, API} from '../../config/index';

  import AppBar from "../../components/commons/AppBar.vue";
  import MuDivider from "../../../node_modules/muse-ui/src/divider/divider.vue";
  import VueSliderComponent from "../../../node_modules/vue-slider-component/src/vue2-slider.vue";
  import ImgWrapper from "../../components/commons/ImgWrapper.vue";
  import Vue from 'vue'

  Vue.component('custom-a', {
    template: `<a href="javascript:;" @click="onClickEvent($event)"><slot></slot></a>`,
    data() {
      return {
        count: 0
      }
    },
    methods: {
      onClickEvent(event) {
        this.count++
        if (this.count == 3) {

        }
        EventBus.$emit('click-t')

      }
    }
  })
  export default {
    components: {
      ImgWrapper,
      AppBar,
    },
    mixins: [mixins.base, mixins.wx],
    name: Constants.PageName.qaUser,
    data() {
      return {
        title:'',
        click_num: 0,
        icon_wallet: require('../../assets/img/icon_user_wallet.svg'),
        icon_qu: require('../../assets/img/icon_user_qu.svg'),
        icon_fav: require('../../assets/img/icon_user_fav.svg'),
        icon_acont: require('../../assets/img/icon_acont.svg'),
        icon_user_arrow: require('../../assets/img/icon_user_arrow.svg'),
        data: {},
        my_question: 0,
        collect_num: 0,
        role: 0,
        current_uid: ''
      };
    },

    created() {
      this.initWX(() => {
        this.fenXiang({
          title:'诸葛装修，全方位解决您的装修问题',
          imgUrl:'http://image1.uzhuang.com/zhuge-logo.png'
        },function () {
          // console.log('fenXiang');
        })
        // console.log('wx success');
      });
      // this.fenXiang({},function () {
      //   // console.log("user fenxiang")
      // })
      this.click_num = 0
      this.current_uid = window.localStorage.getItem('uid')
      this.role = window.localStorage.getItem(Constants.LocalStorage.role);
    },


    activated() {
      this.my_question = window.localStorage.getItem(Constants.LocalStorage.question_num)
      this.collect_num = window.localStorage.getItem(Constants.LocalStorage.collect_num)
      this.click_num = 0
      API.post(Constants.Method.profile)
        .then((result) => {
          this.data = result.data;
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    methods: {
      clickThree() {
        this.click_num++
        if (this.click_num === 3) {
          this.pushPage({
            name: Constants.PageName.qaBindAccount
          });
        }
      },
      getUserData() {

      },
      isTab() {

      },
      ifGoDetail(uid, role) {
        // console.log('ifGoDetail:true')
        this.goGujian(uid, role)
      },
      goGujian(uid, role) {
        let uid_this = uid || window.localStorage.getItem('uid')
        let role_this = role || window.localStorage.getItem('role')
        if (role_this == 1) {
          window.location.href = `http://m.uzhuang.com/mobile-m_butler_details.html?id=M%E7%AB%99-%E5%B7%A5%E5%9C%B0%E7%9B%B4%E6%92%AD&butlerid=${uid_this}`
        } else {
          return
        }
      },
      gotoQuestion(){
        this.pushPage({
          name: Constants.PageName.qaQuestion,
          query: {
            role:this.role
          }
        });
      },
      gotoList(type) {
        this.pushPage({
          name: Constants.PageName.qaList,
          query: {
            type
          }
        });
      },
      gotoWallet() {
        this.pushPage({
          name: Constants.PageName.qaWallet
        });
      },
      gotoAccount() {
        this.pushPage({
          name: Constants.PageName.qaBindAccount
        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/scss/px2rem";

  .content {
    background-color: $divider;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .user-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-image: $bgImage;
    margin: px2rem(10);
    padding: px2rem(20);
    border-radius: px2rem(5);
    .avatar {
      height: px2rem(80);
      width: px2rem(80);
      background-color: white;
      padding: px2rem(3);
      border-radius: 50%;
    }
    .username {
      margin-left: px2rem(10);
      font-size: px2rem(18);
      font-weight: bold;
      color: white;
    }
  }

  .menu {
    display: flex;
    flex-direction: column;
    margin: px2rem(20) px2rem(10) px2rem(10) px2rem(10);
    padding: 0 px2rem(15);
    border-radius: px2rem(5);
    background-color: white;
    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: px2rem(20) 0;
      .icon {
        width: px2rem(16);
        height: px2rem(16);
        margin-right: px2rem(10);
      }
      .name {
        font-size: px2rem(14);
        flex-grow: 1;
      }
      .desc {
        font-size: px2rem(12);
        color: #ACACAC;
        margin-left: px2rem(10);
      }
      .num {
        color: #666;
      }
      .red-point:before {
        content: '•';
        color: red;
        margin-right: px2rem(10);
      }

      .icon_arrow {
        width: px2rem(8);
        margin-left: px2rem(10);
        color: #ccc;
        vertical-align: middle;
      }
    ;
    }
    .divider {
      height: px2rem(1);
      background-color: #e6e6e6;
    }

  }

  .goaccount {
    position: fixed;
    left: 50%;
    transform: translate(-50%);
    text-align: center;
    bottom: px2rem(100);
    a {
      color: #999;
    }
  }
</style>
