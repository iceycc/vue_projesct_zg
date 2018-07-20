<template>
  <div class="content">
    <app-bar :title="title"></app-bar>
    <auto-list-view :url="url" :flag="flag" :isNeedDivider="false" @onItemClick="onItemClick" :ex_params="ex_params">
      <template slot="item" slot-scope="props">
        <div class="card">
          <div class="title-view">
            <div class="title line_one">{{props.item.title}}</div>
            <span class="reward shadow"
                  v-if="parseFloat(props.item.q_reward) > 0">{{props.item.q_reward}}</span>
          </div>

          <div class="card-content line_three">{{props.item.content}}</div>
          <div class="card-tags" v-if="props.item.label.length && props.item.label.length > 0">
            <div class="tag" v-for="value,index in props.item.label" :key="index" v-if="value !== '' ">{{value}}</div>
          </div>
          <div class="footer-view">
            <div class="avatar" v-if="props.item.avatar.length>0">
              <img-wrapper v-for="avatar,index in props.item.avatar" :url="avatar" :key="index"
                           classStyle="avatar"></img-wrapper>
              等回答了该问题
            </div>
            <div class="pv">{{props.item.pv}}浏览</div>
          </div>

        </div>
      </template>
    </auto-list-view>
  </div>

</template>

<script>
  import {Constants, EventBus, mixins, API} from '../../../config/index';

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
    name: Constants.PageName.qaList,
    data() {
      return {
        url: '',
        ex_params: {},
        flag:''
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
      let key_word = this.$route.query.key_word;
      if (key_word) {
        this.ex_params={
          key_word:key_word
        }
        this.title = `搜索'${key_word}'`;
        this.url = Constants.Method.do_search;
        this.flag = this.url;
        return;
      }

      let type = this.$route.query.type;
      switch (parseInt(type)) {
        case 1:
          this.title = '我的收藏';
          this.getList(1);
          break;
        case 2:
          this.title = '我的问题';
          this.getList(2);
          break;
        default:
          break;
      }
    },
    methods: {
      getList(type) {
        this.url = Constants.Method.get_collect;
        this.flag = this.url;
      },
      onItemClick(item) {
        this.pushPage({
          name: Constants.PageName.qaDetail,
          query: {
            id: item.id
          }
        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../../assets/scss/px2rem";
  $tag_border_color:#dedede;
  $tag_color:#ACACAC;
  .content {
    background-color: $divider;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .card {
    background-color: white;
    width: 100%;
    padding: px2rem(10);
    border-radius: px2rem(3);
    .title-view {
      display: flex;
      flex-direction: row;
      align-items: center;
      .title {
        font-size: px2rem(16);
        flex-grow: 1;
      }
      .reward {
        font-size: px2rem(12);
        line-height: 1;
        background-color: RGB(255, 205, 0);
        color: white;
        padding: px2rem(4) px2rem(10);
        border-radius: px2rem(13);
      }
      .reward:before {
        content: '¥';
        font-size: px2rem(10);
      }
    }

    &-content {
      color: #666666;
      font-size: px2rem(14);
      margin: px2rem(10) 0;
    }

    .footer-view {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: $fontcolor_gray;
      padding-top: px2rem(10);
      font-size: px2rem(10);
      border-top: px2rem(1) solid $divider;
      .avatar {
        vertical-align: middle;
        flex-grow: 1;
      }
      .pv {
      }
    }
  }
  .card-tags {
    display: flex;
    flex-wrap: wrap;
    padding-top: px2rem(10);
    .tag {
      border: px2rem(1) solid $tag_border_color;
      color: $tag_color;
      padding: px2rem(1) px2rem(6);
      margin-right: px2rem(10);
      margin-bottom: px2rem(6);
      font-size: px2rem(12);
    }
  }
</style>
