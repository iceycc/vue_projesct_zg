<template>
  <div class="content">
    <app-bar :title="title"></app-bar>
    <div class="card-view">
      <span class="money">{{tx_data.money | chu100}}</span>
      <div class="desc">提现金额( 元)</div>
      <div class="line"></div>
      <div class="wechatinfo">
        <div class="status">您已绑定微信</div>
        <img-wrapper :url="tx_data.avatar" classStyle="avatar"></img-wrapper>
        {{tx_data.username}}
      </div>
    </div>
    <div style="flex-grow: 1"></div>
    <div class="btn-view">
      <div class="btn" @click="gotoWithdraw">确认提现</div>
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
    name: Constants.PageName.qaWithdraw,
    data() {
      return {
        tx_data: {
          money: 100,
          username: '',
          avatar: '',
          current_uid:null,
        }
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
      this.current_uid = window.localStorage.getItem('uid')
      this.getData()
    },
    activated() {
      this.getData()
    },
    methods: {
      getData() {
        API.post(Constants.Method.wallet, null)
            .then((result) => {
              // console.log('tx');
              // console.log(result);
              this.tx_data.money = result.data.money;
            })
            .catch((err)=>{
              // console.log(err);
            });
        API.post(Constants.Method.profile, {uid:this.current_uid})
            .then((result) => {
              this.data.username = result.username;
              this.data.avatar = result.avatar;
            })
            .catch((err)=>{
              // console.log(err);
            });
      },
      gotoWithdraw() {
        let data = {
          amount: parseInt(this.tx_data.money)
        }
        API.get(Constants.Method.wxtx,null)
            .then((result) => {
              // console.log(result.data);
              if (result.code === 0) {
                EventBus.$emit(Constants.EventBus.showToast, {
                  message: '提现成功'
                });
                this.getData()

              } else {
                EventBus.$emit(Constants.EventBus.showToast, {
                  message: result.message
                });
              }
            }).catch((err)=>{
          // console.log(err);
        })
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../../assets/scss/px2rem";

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
