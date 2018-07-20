<template>
  <div class="scroll-view">
    <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
    <!--<app-bar :title="title" class="app-bar"></app-bar>-->
      <mu-list style="height:100%">
        <a v-for="item,index in data_list" :key="index" :href="item.url">
          <mu-list-item>
            <div class="card">
              <div class="card-img">
                <img :src="item.thumb" alt="">
              </div>
              <div class="title-view">
                <div class="title">{{item.title}}</div>
                <div class="card-content">{{item.remark}}</div>
              </div>
            </div>
          </mu-list-item>
        </a>
        <div v-if="data_list && data_list.length == 0" class="no-data">
          {{infoMsg}}
        </div>
      </mu-list>
    <!--t 下拉刷新得紧挨者滑动部分 并且要在最外层 要抽离滑动模板 -->
    <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" v-if="isMore"
                        loadingText="数据加载中..."/>

  </div>

</template>

<script>
  import {Constants, EventBus, mixins,API} from '../../config/index';
  import axios from 'axios';
  import ComponentTemplate from "../../components/template";
  import AutoListView from "../../components/commons/AutoListView";
  import ImgWrapper from "../../components/commons/ImgWrapper";
  import AppBar from "../../components/commons/AppBar.vue";

  const defaultStartPage = 1;
  export default {
    components: {
      ImgWrapper,
      AutoListView,
      AppBar
    },
    mixins: [mixins.base, mixins.wx],
    name: Constants.PageName.qaknowledge,
    data() {
      return {
        infoMsg: '正在努力加载数据...',
        isFirst: true,
        url: '',
        category_index: 0,
        categorys: [{
          name: '推荐',
        }, {
          name: '装修前',
        }, {
          name: '装修中',
        }, {
          name: '装修后',
        }],
        title: '',
        picsTitle: [],
        data_list: [],
        loading: false,
        scroller: null,
        isMore: true,
        page: defaultStartPage,
        refreshing: false,
        trigger: null
      };
    },
    filters: {
      forPicsTitle: (val, index) => {
        return val[index]
      }
    },
    computed: {},
    mounted() {
      this.trigger = this.$el;
      this.scroller = this.$el
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
      this.title = this.$route.query.title || '课堂'
      this.getList()
    },
    methods: {
      refresh () {
        this.refreshing = true
        setTimeout(() => {
          this.getList()
          this.refreshing = false
        }, 2000)
      },
      loadMore() {
        // 1  请求数据中判断数据是否为空
        // console.log(11)
        this.loading = true
        setTimeout(() => {
          this.getList()
          this.loading = false
        }, 2000)
      },
      getList() {
        let id = this.$route.query.cid || 0;
        let data ={
          cid: id,
          page: this.page
        }
        axios.get(Constants.Method.ketang_nodeList,{params:data})
            .then((result) => {
              this.data_list = this.data_list.concat(result.data.data)
              // 判断数据是否存在且是否为空 控制加载是否继续
              if (result.data.data && result.data.data.length == 0) {
                this.infoMsg = '没有数据......'
                this.isMore = false
              } else {
                this.page = this.page + 1;
              }
            })
      },
      onItemClick(item) {
        window.location.href = item.url;
      },

      gotoSearch() {
        this.pushPage({
          name: Constants.PageName.qaSearch
        });
      },
      openWeb(url) {
        window.location.href = url;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/scss/px2rem";

  .scroll-view {
    /*padding-bottom: px2rem(50);*/
    height: 100%;
    overflow: scroll;
    background: #f2f2f2;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  .app-bar{
    position: fixed;
    top: 0;
  }
  .no-data {
    text-align: center;
    margin-top: px2rem(50);
  }

  .content {
    background-color: $divider;
    height: 100%;
  }

  .hot_word_view {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-y: auto;
    background-color: white;

    .hot_word {
      color: #333;
      flex-grow: 1;
      padding: px2rem(15) 0;
      margin: 0 px2rem(15);
      font-size: px2rem(13);
      text-align: center;
      white-space: nowrap;
      transition: font-size, color 0.2s, 0.2s;
      border-bottom: px2rem(2) solid #fff;
    }
    .hot_word_select {
      color: $mainColor;
      font-size: px2rem(13);
      border-bottom: px2rem(2) solid $mainColor;
    }
  }

  /*11*/
  .ketang_imgs {
    display: flex;
    flex-wrap: wrap;
    .ketang_img {
      position: relative;
      padding: px2rem(10);
      display: inline-block;
      width: 50%;
      height: px2rem(120);

      img {
        width: 100%;
      }
      .title {
        position: absolute;
        padding: px2rem(6);
        font-size: px2rem(16);
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #fff;
      }

    }
  }

  .card {
    background-color: white;
    width: 100%;
    padding: px2rem(10);
    border-radius: px2rem(3);
    display: flex;
    /*1211111111*/
    .card-img {
      display: block;
      box-sizing: border-box;
      width: px2rem(80);
      height: px2rem(60);
      background: #ccc;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title-view {
      flex: 1;
      width: 65%;
      padding-left: px2rem(10);
      .title {
        font-weight: bold;
        font-size: px2rem(15);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #555;
      }
    }
    &-content {
      color: #666666;
      font-size: px2rem(13);
      padding: px2rem(10) 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

  }

</style>
