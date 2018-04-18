<template>
  <div class="content">
    <app-bar :title="title"></app-bar>
    <div class="card-view">
      <span class="money">{{data.money}}</span>
      <div class="desc">提现金额( 元)</div>
      <div class="line"></div>
      <div class="wechatinfo">
        <div class="status">您已绑定微信</div>
        <img-wrapper :url="data.avatar" classStyle="avatar"></img-wrapper>
        {{data.username}}
      </div>
    </div>
    <div style="flex-grow: 1"></div>
    <div class="btn-view">
      <div class="btn" @click="gotoWithdraw">确认提现</div>
    </div>
  </div>
</template>

<script>
  import {Constants, EventBus, mixins} from '../assets/js/index';
  import axios from 'axios'
  import AppBar from "../components/AppBar.vue";
  import ComponentTemplate from "../components/template";
  import AutoListView from "../components/AutoListView";
  import ImgWrapper from "../components/ImgWrapper";

  export default {
    components: {
      ImgWrapper,
      AppBar,
      AutoListView
    },
    mixins: [mixins.base, mixins.request],
    name: Constants.PageName.qaWithdraw,
    data() {
      return {
        data: {
          money: 0,
          username: '',
          avatar: ''
        }
      };
    },
    computed: {},
    created() {
      this.doRequest(Constants.Method.wallet, null, (result) => {
        this.data.money = result.money;
      });
      this.doRequest(Constants.Method.profile, null, (result) => {
        this.data.username = result.username;
        this.data.avatar = result.avatar;
      });
    },
    methods: {
      gotoWithdraw() {
        let data = {
          uid: localStorage.getItem('uid'),
          amount: parseInt(this.data.money)
        }
        axios.get('http://m.uzhuang.com/wxpay/sendWallet/payuser.php', {params: data})
            .then((result) => {
              console.log(result.data);

              if(result.data.code === 0){
                EventBus.$emit(Constants.EventBus.showToast, {
                  message:'提现成功'
                });
                this.$router.replace({name:Constants.PageName.qaWithdraw})
              }else{
                EventBus.$emit(Constants.EventBus.showToast, {
                  message:'提现失败'
                });
              }
            })
        // this.doRequest('http://m.uzhuang.com/wxpay/sendWallet/payuser.php',data,(result)=>{
        //   console.log(result);
        //   EventBus.$emit(Constants.EventBus.showToast, {
        //     message:result.message
        //   });
        // })
        // window.location.href = 'http://m.uzhuang.com/wxpay/sendWallet/payuser.php?uid=' + localStorage.getItem('uid') + '&amount=' + parseInt(this.data.money);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/scss/px2rem";

  .content {
    background-color: $divider;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .card-view {
    background-color: white;
    margin: px2rem(15);
    border-radius: px2rem(2);
    text-align: center;
    .money {
      font-size: px2rem(50);
    }
    .line {
      height: px2rem(1);
      background-color: $divider;
      margin: px2rem(10) 0;
    }
    .wechatinfo {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: px2rem(10);
      .status {
        flex-grow: 1;
        text-align: left;
      }
    }
  }

  .desc {
    color: #CCC;
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
  }
</style>
