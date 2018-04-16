<template>
  <div class="scroll-view">
    <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
    <mu-list>
      <div class="no-data" v-if="answered_list && answered_list.length == 0">
        {{infoMsg}}
      </div>
      <div class="question-card" @click="goQuestionDetail(item)" v-for="item,index in answered_list" :key="index"
           v-else>
        <div class="view-top">
          <img-wrapper :url="item.avatar" classStyle="avatar"></img-wrapper>
          <div class="username">{{item.uname}}</div>
          <span class="reward" v-if="item.q_reward > 0">悬赏金额￥{{item.q_reward}}</span>
        </div>
        <!--问题标题-->
        <div class="title">{{item.title}}</div>
        <!--问题内容-->
        <div class="question-content">{{item.content}}</div>
        <!--问题介绍-->
        <div class="question-info" v-if="item.answer_num == 0 && item.q_reward > 0">还没有对该问题进行回答,赶紧回答领取赏金吧!</div>
        <div class="question-info" v-if="item.answer_num == 0 && item.q_reward == 0">亲，虽然我不是付费问题，可是我一直在等你答复哦！</div>
        <!---->
        <div class="view-footer">
          <div>{{item.pv}}浏览</div>
          <div>{{item.answer_num}}条回答</div>
          <div>{{item.qtime}}</div>
        </div>
        <div class="card-tags" v-if="item.label.length > 0">
          <div class="tag" v-for="value,index in item.label" :key="index" v-if="value !== '' ">{{value}}</div>
        </div>
      </div>
    </mu-list>
    <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"
                        loadingText="数据加载中..." v-if="isMore"/>
  </div>
</template>

<script>
  import {Constants, EventBus, mixins} from '../assets/js/index';
  const defaultStartPage = 1;
  export default {
    name: "auto-list-view2",
    props: ['url'],
    mixins: [mixins.base, mixins.request],
    data() {
      return {
        // answered_list:[]
        infoMsg:'正在努力加载数据...',
        page:defaultStartPage,
        answered_list:[],
        loading: false,
        scroller: null,
        isMore:true,
        refreshing: false,
        trigger: null
      }
    },
    created() {
      // let url = this.$route.query.url
      // console.log(this.url)
      // this.getDate(url)
      this.getDate(this.url)
    },
    mounted () {
      this.trigger = this.$el;
      this.scroller = this.$el
    },
    methods: {
      getDate(url) {
        let data = {
          page:this.page
        }
        this.doRequest(url, data, (result) => {
          this.answered_list = this.answered_list.concat(result.question_list)
          if(result.question_list && result.question_list.length ===0){
            this.infoMsg = '没有数据......'
            this.isMore = false
          }else{
            this.page = this.page + 1;
          }
        })
      },
      goQuestionDetail(item) {
        this.pushPage({
          name: Constants.PageName.qaDetail,
          query: {
            id: item.id
          }
        });
      },
      loadMore () {
        // console.log(this.page)
        this.loading = true
        setTimeout(() => {
          this.getDate(this.url);
          this.loading = false
        }, 2000)
      },
      refresh () {
        this.refreshing = true
        setTimeout(() => {
          this.getDate(this.url);
          this.refreshing = false
        }, 1000)
      }
    }
  }
</script>

<style lang="scss">
  @import "../assets/scss/px2rem";

  ul, li {
    margin: 0;
    padding: 0;
  }

  .content {
    background-color: $divider;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /*scroll-view*/
  .scroll-view {
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    .no-data {
      text-align: center;
      margin-top: px2rem(40);
    }
  }

  /*search 1111  */
  .question-search {
    position: relative;
    width: 100%;
    height: px2rem(60);
    padding: px2rem(10);
    input {
      width: 100%;
      height: 100%;
      border: px2rem(1) solid #ccc;
      padding: 0 px2rem(10);

    }
    .icon {
      position: absolute;
      right: px2rem(15);
      top: px2rem(18);
    }
  }

  /*question-card*/
  .question-card {
    background-color: #fff;
    width: 100%;
    padding: px2rem(10) px2rem(20);
    margin-bottom: px2rem(10);
    z-index: 1;

    .view-top {
      display: flex;
      flex-direction: row;
      align-items: center;
      .username {
        flex: 1
      }
      .reward {
        font-size: px2rem(12);
        line-height: 1;
        background-color: RGB(255, 205, 0);
        color: white;
        padding: px2rem(4) px2rem(10);
        border-radius: px2rem(15);
      }
    }
    .title {

      font-size: px2rem(16);
      font-weight: bold;
      color: #666;
      padding: px2rem(10) 0;
    }
    .question-content {
      font-size: px2rem(14)
    }
    .question-info {
      font-size: px2rem(14);
      color: #007aff;
    }

    .view-footer {
      padding-top: px2rem(20);
      padding-bottom: px2rem(10);
      border-bottom: px2rem(1) solid #ccc;
      display: flex;
      div:nth-child(2) {
        flex: 1;
        padding-left: px2rem(30);
      }

    }
    /*11111111*/
    .card-tags {
      display: flex;
      flex-wrap: wrap;
      padding-top: px2rem(10);
      .tag {
        border: px2rem(1) solid #ccc;
        padding: px2rem(3) px2rem(6);
        margin-left: px2rem(10);
        margin-bottom: px2rem(6);
        font-size: px2rem(12);
      }
    }
  }
</style>
