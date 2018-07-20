<template>
  <div class="content">
    <app-bar :title="title"></app-bar>
    <div class="money-view" v-if="result">
      <div><span class="money">{{result.money | chu100}}</span>元</div>
      <div class="desc">{{result.message}}</div>
      <div class="link" @click="gotoWalletDetail">钱包明细</div>
    </div>
    <div style="flex-grow: 1"></div>
    <div class="btn-view">
      <!--result.money == 0 && role == 0-->
      <div v-if="result.money > 0 && role == 0" class="btn btn-white" @click="gotoAsk(1)">用于悬赏提问</div>
      <div v-if="result.money > 0" class="btn" @click="gotoWithdraw">提现</div>
      <div class="desc">仅支持提现至微信零钱</div>
    </div>
  </div>

</template>

<script>
  import {Constants, EventBus, mixins,API} from '../../../config/index';

  import AppBar from "../../../components/commons/AppBar.vue";
  import ComponentTemplate from "../../../components/template";
  import AutoListView from "../../../components/commons/AutoListView";
  import ImgWrapper from "../../../components/commons/ImgWrapper";

  export default {
    components: {
      ImgWrapper,
      AppBar,
      AutoListView
    },
    mixins: [mixins.base, mixins.wx],
    name: Constants.PageName.qaWallet,
    data() {
      return {
        result: {
          money:0
        },
        role:0,
        money:0
      };
    },
    computed: {},
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
      // // console.log(1)
      this.role = window.localStorage.getItem('role')
      API.post(Constants.Method.wallet,null)
          .then((result) => {
            this.result = result.data;
            this.money = result.data.money
          })
          .catch((err)=>{
            // console.log(err);
          });
    },
    methods: {
      gotoWalletDetail() {
        this.pushPage({
          name: Constants.PageName.qaWalletDetail
        });
      },
      gotoWithdraw() {
        this.pushPage({
          name: Constants.PageName.qaWithdraw
        });
      },
      gotoAsk(type) {
        this.pushPage({
          name: Constants.PageName.qaAsk,
          query: {
            type,
            is_wallet:true,
            money_sum:this.money * 100 || 0
          }
        });
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../../assets/scss/px2rem";

  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .desc {
    color: #CCC;
  }

  .money-view {
    margin-top: px2rem(50);
    text-align: center;
    .money {
      font-size: px2rem(50);
      margin-right: px2rem(10);
    }
    .link {
      padding: px2rem(10);
      color: $mainColor;
    }
  }

  .btn-view {
    text-align: center;
    margin-bottom: px2rem(50);
    .btn {
      text-align: center;
      color: white;
      background-image: $bgImage;
      border-radius: px2rem(3);
      //background-color: #11cdcd;
      margin: px2rem(20) px2rem(20) 0 px2rem(20);
      padding: px2rem(10);
      font-size: px2rem(16);
      font-weight: bold;
    }

    .btn-white {
      background-image: none;
      color: #333;
      border: px2rem(1) #CCC solid;
    }

    .desc {
      margin-top: px2rem(10);
    }
  }


</style>
