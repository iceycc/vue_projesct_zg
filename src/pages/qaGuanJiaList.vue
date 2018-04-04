<template>
  <div class="content">
    <app-bar :title="title"></app-bar>
    <div class="question-search">
      <input type="search">
      <img-wrapper :url="icon_search" classStyle="icon"></img-wrapper>
    </div>
    <ul class="question-tab">
      <li>未回答（0）</li>
      <li>已回答（5）</li>
    </ul>
    <div class="question-card">
      <!---->
      <div class="view-top">
        <!--<img-wrapper :url="" classStyle="avatar"></img-wrapper>-->
        <div class="username">匿名用户</div>
        <span class="reward">悬赏金额￥10.00</span>
      </div>
      <!--问题标题-->
      <div class="title">紫菜取暖？？？？？</div>
      <!--问题内容-->
      <div class="question-content">取暖</div>
      <!--问题介绍-->
      <div class="question-info">还没有对我进行回答的快来回答我哦</div>
      <!---->
      <div class="view-footer">
        <div>100浏览</div>
        <div>3回答</div>
        <div>09-16 10:10</div>
      </div>
      <div class="card-tags">
        <div class="tag">壁挂炉</div>
        <div class="tag">壁挂炉</div>
        <div class="tag">壁挂炉</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Constants, EventBus, mixins} from '../assets/js/index';
  import AppBar from "../components/AppBar.vue";
  import ImgWrapper from "../components/ImgWrapper.vue";

  export default {
    name: "qa-guan-jia-list",
    components: {
      AppBar,
      ImgWrapper
    },
    data() {
      return {
        title: '我得问题 管家版',
        icon_search: require('../assets/img/icon_search.svg'),
      }
    }

  }
</script>

<style lang="scss" scoped>
  @import "../assets/scss/px2rem";

  .content {
    background-color: $divider;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  /*search*/
  .question-search {
    position: relative;
    width: 100%;
    height: px2rem(40);
    input {
      border: none;
      width: 100%;
      height: 100%;
    }
    .icon{
      position:absolute;
    }
  }
  /*11*/
  .question-card {
    background-color:#fff ;
    width: 100%;
    padding:px2rem(10) px2rem(20);
    z-index: 1;
    .view-top{
      display:flex;
      flex-direction: row;
      align-items: center;
      .username{
        flex:1
      }
      .reward{
        font-size: px2rem(12);
        line-height: 1;
        background-color: RGB(255, 205, 0);
        color: white;
        padding: px2rem(4) px2rem(10);
        border-radius: px2rem(15);
      }
    }
    .title{
      font-size: px2rem(16);
      font-weight: bold;
      color: #000;
      padding: px2rem(10) 0;
    }
    .question-info{

    }
  }
</style>
