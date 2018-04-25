<template>
  <div class="content">
    <app-bar :title="title"></app-bar>
    <auto-list-view :url="url" :flag="flag" :isNeedDivider="false" @onItemClick="onItemClick">
      <template slot="item" slot-scope="props">
        <div class="card" style="display: flex">
          <div class="title-view" style="flex: 7">
            <div v-if=" props.item.way == 1" class="title">&nbsp; 提现</div>
            <div v-else class="title">【<span>{{props.item.title}}</span>】 的{{props.item.way | ways }}</div>
            <div class="card-time">{{props.item.addtime}}</div>
          </div>
          <div class="money"
               style="flex:2;text-align: right;"
               :class="props.item.way | isActive "
          >
            <i>{{props.item.way | add_sub}} </i>
            {{props.item.money}}
          </div>
        </div>
      </template>
    </auto-list-view>
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
    name: Constants.PageName.qaWalletDetail,
    data() {
      return {
        url: '',
        current_uid:''
        // 类型 0 提现减 1 付费提问减  2 问题被采纳加  filter不能使用data中的数据
        // way_data:{
        //   tixian: '0',
        //   tiwen: '1',
        //   shangjin: '2'
        // }
      };
    },
    filters:{
      ways:function (val) {
        switch(val){
          case '1':
            return '提现';
            break;
          case '2':
            return '提问';
            break;
          case '3':
            return '赏金';
            break;
          default:
            return ''
        }
      },
      add_sub:function(val){
        switch(val){
          case '1':
            return '-';
            break;
          case '2':
            return '-';
            break;
          case '3':
            return '+';
            break;
          default:
            return ''
        }
      }.bind(this),
      isActive:function (val) {

        switch(val){
          case '1':
            return '';
            break;
          case '2':
            return '';
            break;
          case '3':
            return 'active';
            break;
          default:
            return ''
        }
      }.bind(this)
    },
    computed: {},
    created() {
      this.current_uid = window.localStorage.getItem('uid')
      API.post(Constants.Method.wallet, {uid:this.current_uid})
          .then((result) => {
            console.log(result);
          })
          .catch((err)=>{
            console.log(err);
          });

      this.getList();
    },
    methods: {
      handleResult(result) {
        return result.detail;
      },
      getList() {
        this.url = Constants.Method.wallet_detail;
        this.flag = this.url;
      },
      onItemClick(item) {
        if(item.way == 0 || item.way == 1){
          return false
        }
        this.pushPage({
          name: Constants.PageName.qaDetail,
          query: {
            id: item.qid
          }
        });
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
  }

  .card {
    background-color: white;
    width: 100%;
    padding: px2rem(10);
    border-radius: px2rem(3);
    .title-view {
      line-height:px2rem(27) ;
    }
    .title{
      font-size: px2rem(18);
      color:#333;
      span{
        vertical-align: middle;
        font-size: px2rem(18);
        display: inline-block;
        width: px2rem(125);
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }

    }
    .card-time{
      font-size: px2rem(18);
      color:#ccc;
      padding-left:px2rem(10)
    }

    &-content {
      color: #666666;
      font-size: px2rem(14);
      padding: px2rem(10) 0;
      border-bottom: px2rem(1) solid $divider;
    }
    .money{
      padding-top: px2rem(11);
      font-size: px2rem(20);
      &.active{
        color: #fe4423
      }
    }

    .footer-view {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: $fontcolor_gray;
      padding-top: px2rem(10);
      font-size: px2rem(10);
      .avatar {
        flex-grow: 1;
      }
      .pv {
      }
    }
  }

</style>
