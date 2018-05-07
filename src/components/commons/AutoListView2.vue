<template>
  <div class="scroll-view">
    <mu-list>
      <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
      <div class="no-data" v-if="answered_list && answered_list.length == 0 ">
        {{infoMsg}}
      </div>
      <div v-if="type == 'answer_list'">
        <!--&& answered_list.length == 0-->
        <!---->
        <div class="answer-list-card" @click="goQuestionDetail(item)" v-for="item,index in answered_list" :key="index"
             v-if="item.question && item.question.id !==''">
          <!--v-if="item.question.id && item.question.id !==''"-->
          <!--问题相关-->
          <div class="question-info">
            <!--问题标题-->
            <div class="view-top">
              <span class="title">{{item.question.title}}</span>
              <span class="reward"
                    v-if="parseFloat(item.question.reward) > 0">¥{{item.question.reward | chu100}}</span>
            </div>
            <!--问题内容-->
            <div class="question-content">{{item.question.content}}</div>
          </div>
          <div class="line"></div>
          <!--回答相关-->
          <div class="answer-info">
            <div class="question-notice" v-if="item.answer.length ===0  && item.question.reward > 0">
              还没有对该问题进行回答,赶紧回答领取赏金吧!
            </div>
            <div class="question-notice" v-if="item.answer.length ===0  && item.question.reward === 0">
              亲，虽然我不是付费问题，可是我一直在等你答复哦！
            </div>
            <p>{{item.answer.content}}</p>
          </div>
          <!---->
          <div class="view-footer" v-if="item.answer && item.answer.length > 0">
            <div>{{item.answer.laud}}点赞</div>
            <div>{{item.answer.pv}}浏览</div>
            <div>{{item.answer.addtime | crtTime}}</div>
          </div>
          <div class="card-tags" v-if="item.question.label.length || item.question.label.length > 0">
            <div class="tag" v-for="value,index in item.question.label" :key="index" v-if="value !== '' ">{{value}}
            </div>
          </div>
        </div>
      </div>

      <div v-if="type == 'question_list'">
        <div class="no-data" v-if="!answered_list">
          {{infoMsg}}
        </div>
        <div class="question-list-card item" @click="onItemClick(index)"
             v-for="item, index in answered_list"
             :isTab="isTab"

        >
          <div class="title-view">
            <div class="title">{{item.title}}</div>
            <span class="reward shadow"
                  v-if="parseFloat(item.q_reward) > 0">{{item.q_reward | chu100}}</span>
          </div>
          <div class="card-content">{{item.content}}</div>
          <div class="footer-view">
            <div class="avatar">
              <img-wrapper v-for="avatar,index in item.avatar" :url="avatar" :key="index"
                           classStyle="avatar"></img-wrapper>
            </div>
            <div class="pv">{{item.pv}}浏览</div>
          </div>
          <div class="card-tags" v-if="item.label && item.label.length > 0">
            <div class="tag" v-for="value,index in item.label" :key="index" v-if="value !== '' ">{{value}}</div>
          </div>
        </div>
      </div>
    </mu-list>
    <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"
                        loadingText="数据加载中..." v-if="isMore"/>
  </div>
</template>

<script>
  import {Constants, EventBus, API, mixins} from '../../config/index';
  // import API from '../request/index';
  const defaultStartPage = 1;
  export default {
    name: "auto-list-view2",
    props: ['url', 'type', 'ex_params', 'flag', 'isTab'],
    mixins: [mixins.base, mixins.wx],
    data() {
      return {
        // answered_list:[]
        infoMsg: '正在努力加载数据...',

        page: defaultStartPage,
        answered_list: [],
        loading: false,
        scroller: null,
        isMore: true,
        refreshing: false,
        trigger: null,
      }
    },
    watch: {
      flag: function (curVal, oldVal) {
        // if (curVal) {
        //   this.refresh();
        // } else {
        //   this.init();
        // }
      },
      ex_params: function (curVal, oldVal) {
        if(curVal){
          this.init();
          this.refresh();
        }

      },
      isTab: function (curVal, oldVal) {
        if(curVal){
          this.init();
          this.refresh();
        }
      },

    },
    created() {
      if (this.flag) {
        this.getData()
      }

    },
    mounted() {
      console.log('mounted')

      this.trigger = this.$el
      this.scroller = this.$el
      this.scroller.onscroll = () => {
        this.scrollTop = this.scroller.scrollTop
      };
    },
    activated() {
      console.log('activated')
      // if(this.flag){
      //   this.getData()
      // }
      if (this.scrollTop !== 0) {
        this.scroller.scrollTop = this.scrollTop;
      }
    },
    methods: {
      init() {
        this.isMore = true;
        this.page = defaultStartPage;
        this.answered_list = [];
      },
      onItemClick(index) {
        console.log(11)

        this.$emit('onItemClick', this.answered_list[index], index);
      },
      getData() {
        console.log('this.ex_params')
        console.log(this.ex_params)
        this.loading = true;
        let data = {
          page: this.page,
        }
        if (this.ex_params) {
          data = Object.assign(data, this.ex_params)
        }
        if (!this.url) {
          return
        }
        console.log(this.url);
        API.post(this.url, data)
          .then((result) => {
            result = result.data;
            console.log('result')
            console.log(result)
            console.log('=------------------11-----------------=')
            this.answered_list = this.answered_list.concat(result)
            if (result && result.length === 0) {
              this.infoMsg = '没有数据......'
              this.isMore = false
            } else {
              this.page = this.page + 1;
            }
            this.loading = false;

          })
          .catch((err) => {
            console.log(err);
          })
      },
      goQuestionDetail(item) {
        console.log('item.id')
        console.log(item)
        this.pushPage({
          name: Constants.PageName.qaDetail,
          query: {
            id: item.question.id
          }
        });
      },
      loadMore() {
        console.log('isMore')
        console.log(this.isMore)
        this.loading = true
        setTimeout(() => {
          this.getData(this.url);
          this.loading = false
        }, 2000)
      },
      refresh() {
        this.refreshing = true
        setTimeout(() => {
          this.getData(this.url);
          this.refreshing = false
        }, 1000)
      }
    }
  }
</script>

<style lang="scss">
  @import "../../assets/scss/px2rem";
  $title-color:#333;
  $content-color:#888;
  ul, li {
    margin: 0;
    padding: 0;
  }

  .mu-list {
    padding: 0 px2rem(10);
  }

  .content {
    background-color: $divider;
    height: 100%;
    display: flex;
    color: $content-color;
    flex-direction: column;
  }

  .item {
    margin-bottom: px2rem(15);
  }

  .view-top {
    display: flex;
    .title {
      flex: 1;
      color:$title-color;
      @extend .line_one
    }
    .reward {
      height: px2rem(20);
      font-size: px2rem(12);
      line-height: 1;
      background-color: RGB(255, 205, 0);
      color: white;
      /*11*/
      padding: px2rem(4) px2rem(10);
      border-radius: px2rem(15);
    }
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
  $yuan_width: px2rem(16);
  $yuan_width_2: px2rem(8);
  .answer-list-card {
    background-color: #fff;
    width: 100%;
    margin-bottom: px2rem(10);
    z-index: 1;
    .line {
      position: relative;
      width: 100%;
      border-top: 1px dashed #ccc;
      &:before, &:after {
        position: absolute;
        content: '';
        top: -$yuan_width_2;
        width: $yuan_width;
        height: $yuan_width;
        border-radius: $yuan_width_2;
        background: #f2f2f2;
      }
      &:before {
        left: -$yuan_width_2;
      }
      &:after {
        right: -$yuan_width_2;
      }
    }
    .question-info, .answer-info {
      padding: px2rem(15) px2rem(20);
      p {
        margin: 0;
        @extend .line_three
      }
    }
    .title {
      font-size: px2rem(16);
      color: $title-color;
      font-weight: 600;
      @extend .line_one
    }
    .question-content {
      font-size: px2rem(14);
      color: $content-color;
      @extend .line_three
    }
    .question-notice {
      font-size: px2rem(14);
      color: #007aff;
    }
    .view-footer {
      padding: px2rem(5) px2rem(20) px2rem(0);
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

  .question-list-card {
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
        font-weight: 600;
        color: $title-color;
        @extend .line_one

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
      color: $content-color;
      font-size: px2rem(14);
      margin: px2rem(10) 0;
      border-bottom: px2rem(1) solid $divider;
      @extend .line_three
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
