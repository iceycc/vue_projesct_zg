<template>
  <div class="scroll-view">
    <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
    <mu-list v-if="type == 'user_question'">
      <div class="no-data" v-if="answered_list && answered_list.length == 0">
        {{infoMsg}}
      </div>
      <!---->
      <div class="question-card" @click="goQuestionDetail(item)" v-for="item,index in answered_list" :key="index"
           v-if="item.question.id && item.question.id !==''">
        <!--问题相关-->
        <div class="question-info">
          <!--问题标题-->
          <div class="view-top">
            <span class="title">{{item.question.title}}</span>
            <span class="reward"
                  v-if="parseFloat(item.question.reward) > 0">¥{{item.question.reward}}</span>
          </div>
          <!--问题内容-->
          <div class="question-content">{{item.question.content}}</div>
        </div>
        <div class="line"></div>
        <!--回答相关-->
        <div class="answer-info">
          <div class="question-notice" v-if="item.answer.length ===0  && item.question.reward > 0">还没有对该问题进行回答,赶紧回答领取赏金吧!</div>
          <div class="question-notice" v-if="item.answer.length ===0  && item.question.reward === 0">亲，虽然我不是付费问题，可是我一直在等你答复哦！</div>
            {{item.answer.content}}
        </div>
        <!---->
        <div class="view-footer" v-if="item.answer && item.answer.length > 0">
          <div>{{item.answer.laud}}点赞</div>
          <div>{{item.answer.pv}}浏览</div>
          <div>{{item.answer.addtime | crtTime}}</div>
        </div>
        <div class="card-tags" v-if="item.question.label.length || item.question.label.length > 0">
          <div class="tag" v-for="value,index in item.question.label" :key="index" v-if="value !== '' ">{{value}}</div>
        </div>
      </div>
    </mu-list>
    <mu-list v-if="type == 'list'">
      <template v-for="item, index in answered_list">
          <div class="item" @click="onItemClick(index)">
            <slot name="item" :item="item"></slot>
          </div>
      </template>
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
    props: ['url','type','ex_params'],
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
    created() {
      this.getData()
    },
    mounted() {
      this.trigger = this.$el;
      this.scroller = this.$el
    },
    methods: {
      onItemClick(index) {
        console.log(11)

        this.$emit('onItemClick', this.answered_list[index], index);
      },
      getData() {
        let data = {
          page: this.page,
        }
        if(this.ex_params){
          data = Object.assign(data,this.ex_params)
        }
        if(!this.url){
          return
        }
        console.log(this.url);
        API.post(this.url, data)
            .then((result) => {
              result = result.data;
              console.log('=------------------11-----------------=')
              if(result.question_list){
                this.answered_list = this.answered_list.concat(result.question_list)
                if (result.question_list && result.question_list.length === 0) {
                  this.infoMsg = '没有数据......'
                  this.isMore = false
                } else {
                  this.page = this.page + 1;
                }
              }else {
                this.answered_list = this.answered_list.concat(result)
                if (result && result.length === 0) {
                  this.infoMsg = '没有数据......'
                  this.isMore = false
                } else {
                  this.page = this.page + 1;
                }
              }

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

  ul, li {
    margin: 0;
    padding: 0;
  }
  .mu-list{
    padding:0 px2rem(10);
  }
  .content {
    background-color: $divider;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .item{
    margin-bottom:px2rem(15);
  }
  .view-top{
    display: flex;
    .title{
      flex: 1;
    }
    .reward {
      height: px2rem(20);
      font-size: px2rem(12);
      line-height:1;
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
  $yuan_width:px2rem(16);
  $yuan_width_2:px2rem(8);
  .question-card {
    background-color: #fff;
    width: 100%;
    margin-bottom: px2rem(10);
    z-index: 1;
    .line{
      position: relative;
      width: 100%;
      border-top: 1px dashed #ccc;
      &:before,&:after{
        position: absolute;
        content: '';
        top:-$yuan_width_2;
        width: $yuan_width;
        height: $yuan_width;
        border-radius: $yuan_width_2;
        background: #f2f2f2;
      }
      &:before{
        left: -$yuan_width_2;
      }
      &:after{
        right: -$yuan_width_2;
      }
    }
    .question-info,.answer-info{
      padding: px2rem(15) px2rem(20);
    }
    .title {
      font-size: px2rem(16);
      color:#666;
      font-weight: 600;
    }
    .question-content {
      font-size: px2rem(14);
      color:#999
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
</style>
