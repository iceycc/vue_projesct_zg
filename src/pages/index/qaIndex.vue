<template>
  <div class="content">
    <!--顶部关键词-->
    <div class="hot_word_view">
      <div class="tags">
        <template v-for="item,index in hot_words">

          <div class="hot_word" v-bind:class="{'hot_word_select' :hot_words_index === index}"
               @click="selectHotWord(index)">
            {{item.name}}
          </div>
        </template>
        <div class="hot_word_empty"></div>
      </div>
      <div @click="gotoSearch" class="go_search">
        <img-wrapper :url="icon_search" classStyle="search_style"></img-wrapper>
      </div>
    </div>
    <!---->
    <!--  -->
    <!--{{text}}-->

    <auto-list-view
        :url="url"
        :flag="flag"
        @onItemClick="onItemClick"
        :isNeedDivider="false"
        :class="{isIndex0:hot_words_index === 0}"
        :isTab="isTab"
        :ex_params="ex_params"
    >
      <!--@SwipeLeft="onSwipeLeft"-->
      <!--@SwipeRight="onSwipeRight"-->
      <!--@SwipeDown="onSwipeDown"-->
      <!--@SwipeUp="onSwipeUp"-->
      <template slot="swiper">
        <swiper :options="swiperOption" ref="mySwiper" class="banner" v-if="hot_words_index === 0">
          <swiper-slide v-for="item,index in banners" :key="index">
            <img-wrapper :url="item.img" @onClick="openWeb(item.url)"
                         classStyle="banner_img"></img-wrapper>
          </swiper-slide>
        </swiper>
      </template>
      <template slot="item" slot-scope="props">
        <!--<v-touch-->
        <!--v-on:swipeleft="onSwipeLeft"-->
        <!--v-on:swiperight="onSwipeRight"-->
        <!--v-on:swiperdown="onSwipeDown"-->
        <!--:style="{width:'100%'}">-->

        <div class="card">
          <!--标题-->
          <div class="title-view">
            <div class="title">{{props.item.title}}</div>
            <!--金额 如果有的话显示-->
            <span class="reward shadow"
                  v-if="parseFloat(props.item.q_reward) > 0">￥{{props.item.q_reward | chu100}}</span>
          </div>
          <!--内容-->
          <div class="card-content">{{props.item.content}}</div>
          <!--底部显示 头像+浏览数-->
          <div class="footer-view">
            <div class="avatar">
              <img-wrapper v-for="avatar,index in props.item.avatar" :url="avatar" :key="index"
                           classStyle="avatar"></img-wrapper>
              <span class="text" v-if="props.item.avatar.length != 0">等回答了该问题</span>
            </div>
            <div class="pv">{{props.item.pv}}浏览</div>
          </div>
        </div>
        <!--</v-touch>-->
      </template>

    </auto-list-view>
  </div>

</template>

<script>
  import {Constants, EventBus,mixins,API} from '../../config/index';
  import AutoListView from "../../components/commons/AutoListView";
  import ImgWrapper from "../../components/commons/ImgWrapper";

  export default {
    components: {
      ImgWrapper,
      AutoListView,
    },
    mixins: [mixins.base, mixins.wx],
    name: Constants.PageName.qaIndex,
    data() {
      return {
        text: "1111",
        swiperOption: {
          autoplay: 3000
        },
        ex_params:{},
        url: '',// 请求的地址
        banners: [],
        hot_words: [],
        hot_words_index: 0,
        icon_search: require('../../assets/img/icon_search2.svg'),
        flag: null,
        version: process.env.APP_VERSION,
        localValue: this.$ls.get(Constants.LocalStorage.test, '-1'),
        swiper_i: 0,
        isTab: false
      };
    },
    filter: {},
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    created() {
      console.log('index created')
      API.post(Constants.Method.get_banner_list, {})
          .then((result) => {
            this.banners = result.data;
          })
          .catch((err) => {
            console.log(err);
          })

      API.post(Constants.Method.get_hot_words, {})
          .then((result) => {
            console.log('result');
            console.log(result);
            this.hot_words = this.hot_words.concat(result.data);
              this.getList();

          })
          .catch((err) => {
            console.log(err);
          })

    },
    updated() {
      EventBus.$on('isTab', () => {
        this.isTab = false
      })
    },
    methods: {
      onSwipeLeft() {
        this.swiper_i++;
        if (this.swiper_i == this.hot_words.length - 1) {
          this.swiper_i = this.hot_words.length - 2
          return
        }
        this.selectHotWord(this.swiper_i)
      },
      onSwipeRight() {
        this.swiper_i--;
        if (this.swiper_i == -1) {
          this.swiper_i = 0
          return
        }
        this.selectHotWord(this.swiper_i)
      },
      onSwipeDown($event) {
        console.log($event)
      },
      onSwipeUp() {

      },
      getList(isTab) {
        this.url = Constants.Method.get_homepage;
        this.ex_params = {
          id:this.hot_words[this.hot_words_index].id
        }
        this.isTab = isTab || false;
        this.flag = this.url + '&hot_words_id=' + this.hot_words[this.hot_words_index].id;
      },
      onItemClick(item) {
        this.pushPage({
          name: Constants.PageName.qaDetail,
          query: {
            id: item.id
          }
        });
      },
      selectHotWord(index) {
        this.hot_words_index = index;
        this.getList(true);
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

<!-- Add "scoped" attribute to limit CSS to this component only 11-->
<style lang="scss" scoped>
  @import "../../assets/scss/px2rem";
  .content {
    position: relative;
    background-color: $divider;
    height: 100%;
    padding-top: px2rem(60);
  }

  .scroll-view {
    padding-bottom: px2rem(70);
    &.isIndex0 {
      padding-bottom: px2rem(0);
      max-height: 100% !important;
    }
  }

  .banner {
    height: px2rem(154);
    background-color: white;
    .banner_img {
      height: 100%;
      width: 100%;
    }
  }

  .hot_word_view {
    position: fixed;
    display: flex;
    top: 0;
    width: 100%;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
    z-index: 100;
    margin-right: px2rem(25);
    background-color: white;
    .go_search {
      position: fixed;
      right: 0;
      top: 0;
      width: px2rem(50);
      height: px2rem(50);
      background: #fff;
      text-align: center;
      padding-top: px2rem(10);
    }
    .tags {
      display: flex;
      flex-direction: row;
      flex-grow: 1;
    }

    .hot_word {
      color: #333;
      padding: px2rem(15);
      font-size: px2rem(13);
      box-sizing: border-box;
      white-space: nowrap;
      transition: font-size, color 0.2s, 0.2s;
    }
    .hot_word_empty {
      width: px2rem(50);
    }
    .hot_word_select {
      color: $mainColor;
      font-size: px2rem(16);
      font-weight: bold;
      border-bottom: px2rem(2) solid $mainColor;
    }
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .reward {
        font-size: px2rem(12);
        line-height: 1;
        background-color: RGB(255, 205, 0);
        color: white;
        padding: px2rem(4) px2rem(10);
        border-radius: px2rem(13);
        margin-left: px2rem(15);
      }
    }

    &-content {
      color: #666666;
      font-size: px2rem(14);
      padding-top: px2rem(10);
      margin-bottom: px2rem(10);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
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
        flex-grow: 1;
        vertical-align: middle;

        text {
          height: 100%;
          vertical-align: middle;
        }
      }
      .pv {
      }
    }
  }

</style>
