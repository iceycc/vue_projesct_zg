<!-- 个人中心的列表组件-->
<template>
  <div class="scroll-view">
    <mu-list>
      <!--<mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>-->
      <div class="no-data" v-if="answered_list && answered_list.length == 0 ">
        {{infoMsg}}
      </div>
      <!--已回答列表-->
      <div v-if="type == 'answer_list'">
        <div class="answer-list-card" @click="goQuestionDetail(item,'answer_list')" v-for="item,index in answered_list" :key="index"
             v-if="item.question && item.question.id !==''">
          <!--v-if="item.question.id && item.question.id !==''"-->
          <!--问题相关-->
          <div class="question-info">
            <!--问题标题-->
            <div class="view-top">
              <span class="title">{{item.question.title}}</span>
              <span class="reward"
                    v-if="parseFloat(item.question.reward) > 0">{{item.answer.adoption > 0 ?'已悬赏':''}} ¥{{item.question.reward | chu100}}</span>
            </div>
            <!--问题内容-->
            <div class="question-content">{{item.question.content}}</div>
          </div>
          <!---->
          <div class="card-tags" v-if="item.question.label.length || item.question.label.length > 0">
            <div class="tag" v-for="value,index in item.question.label" :key="index" v-if="value !== '' ">{{value}}
            </div>
          </div>
          <div class="line">
            <div class="img-box">
              <div class="accepted" v-if="item.answer.adoption > 0"><img src="../../assets/img/accepted@2x.png"
                                                                          alt=""></div>
              <div class="get_reward" v-if="item.answer.adoption > 0 && item.question.reward > 0"><img
                src="../../assets/img/get_reward.png" alt=""></div>
            </div>
          </div>
          <!--回答相关-->
          <div class="answer-info">
            <p class="answer-content">{{item.answer.content}}</p>
          </div>

          <div class="view-footer" v-if="item.answer.addtime > 0">
            <div class="left"></div>
            <div>{{item.answer.laud}}点赞</div>
            <div>{{item.answer.pv ? item.answer.pv : 0}}浏览</div>
          </div>
        </div>
      </div>
      <!--管家未回答列表-->
      <div v-if="type == 'unanswer_list'">
        <template v-for="item,index in answered_list">
          <div class="unanswer-list-card" @click="goQuestionDetail(item)">
            <!--用户头像 名称 赏金-->
            <div class="view1">
              <img-wrapper :url="item.asker_avatar" classStyle="avatar"
                           @onClick=""></img-wrapper>
              <div class="username">{{item.asker_name}}</div>
              <span class="reward shadow"
                    v-if="parseFloat(item.question.reward) > 0">¥{{item.question.reward | chu100}}</span>
            </div>
            <!--问题标题-->
            <div class="card-title">{{item.question.title}}</div>
            <!--==========================================================================================================-->
            <!--问题描述-->
            <div class="card-content line_three">{{item.question.content}}
              <!--图片展示-->
              <div class="card-img" v-if="item.question.attach && item.question.attach.length !==0 ">
                <div v-for="i,index in item.question.attach" :key="index" v-if=" item != ''" class="cc-img">
                  <img :src="i" alt="" @click="showBigImg(i,item.question.attach)">
                </div>
              </div>
            </div>
            <div class="question-notice" v-if="item.question.reward > 0">
              还没有对该问题进行回答,赶紧回答领取赏金吧!
            </div>
            <div class="question-notice" v-if="item.question.reward === 0">
              亲，虽然我不是付费问题，可是我一直在等你答复哦！
            </div>
            <!--展示 浏览数 回答数 收藏 时间-->
            <div class="view2">
              <div>{{item.question.pv}}浏览</div>
              <div>{{item.question.answer_num}}回答</div>
              <!--收藏 -->

              <button class="collect-icon" :class="item.question.is_collect == '1' ? 'collected' : 'collect'"
                      style="border: none;background: transparent;outline:none">
                <!--<img-wrapper :url="question.is_collect ?  icon5 : icon6 " classStyle="icon"></img-wrapper>-->
                {{item.question.is_collect == '1' ? '已收藏': '收藏'}}
              </button>

              <div>{{item.question.addtime | crtTime }}</div>
            </div>
            <div class="card-tags" v-if="item.question.label && item.question.label.length > 0">
              <div class="tag" v-for="i in item.question.label" v-if="item.question.label[0] !==''">
                {{i}}
              </div>
            </div>
          </div>
        </template>
      </div>
      <!--普通用户提问列表-->
      <div v-if="type == 'question_list'">
        <div class="question-list-card item" @click="goQuestionDetail(item,'question_list')"
             v-for="item, index in answered_list"
             :isTab="isTab"
        >
          <div class="title-view">
            <div class="title">{{item.title}}</div>
            <span class="reward shadow"
                  v-if="parseFloat(item.reward) > 0">{{item.adoption > 0 ?'已悬赏':''}} ￥{{item.reward | chu100}}</span>
          </div>
          <div class="card-content">{{item.content}}</div>
          <!--采纳图标-->
          <div class="accepted" v-if="item.adoption > 0"><img src="../../assets/img/accepted@2x.png"
                                                                alt=""></div>
          <div class="card-tags" v-if="item.label && item.label.length > 0">
            <div class="tag" v-for="value,index in item.label" :key="index" v-if="value !== '' ">{{value}}</div>
          </div>
          <div class="footer-view">
            <div class="avatar">
              <div v-if="item.avatar.length>0">
                <img-wrapper v-for="avatar,index in item.avatar" :url="avatar" :key="index"
                             classStyle="avatar"></img-wrapper>
                等回答了该问题
              </div>
            </div>
            {{item.pv}}浏览
          </div>
        </div>
      </div>
    </mu-list>
    <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" v-if="isMore" loadingText=""/>

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
        infoMsg: '正在加载中...',

        page: defaultStartPage,
        answered_list: [],
        loading: false,
        scroller: null,
        isMore: true,
        refreshing: false,
        trigger: null,
        disabled: false,
        current_uid:null,

      }
    },
    watch: {
      flag: function (curVal, oldVal) {
          this.init();
          this.refresh();
      },
      ex_params: function (curVal, oldVal) {
        // if(curVal){
        //   this.init();
        //   this.refresh();
        // }

      },
      isTab: function (curVal, oldVal) {
        // if(curVal){
        //   this.init();
        //   this.refresh();
        // }
      },

    },
    created() {
      // console.log('created')
      this.current_uid = window.localStorage.getItem('uid')
      if (this.flag) {
        this.getData()
      }
    },
    mounted() {
      // console.log('mounted')
      this.trigger = this.$el
      this.scroller = this.$el
      this.scroller.onscroll = () => {
        this.scrollTop = this.scroller.scrollTop
      };
    },
    activated() {
      // console.log('activated')
      // if(this.flag){
      //   this.getData()
      // }
      if (this.scrollTop !== 0) {
        this.scroller.scrollTop = this.scrollTop;
      }
    },
    methods: {
      init() {
        this.infoMsg = '正在加载中...'
        this.isMore = true;
        this.page = defaultStartPage;
        this.answered_list = [];
      },
      onItemClick(index) {
        // console.log(index)
        this.$emit('onItemClick', this.answered_list[index], index);
      },
      getData() {
        // console.log('this.ex_params')
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
        API.post(this.url, data)
          .then((result) => {
            result = result.data;
            // console.log('result')
            // console.log('=------------------11-----------------=')
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
      goQuestionDetail(item,list_style) {
        // console.log('item.id')
        switch (list_style) {
          case 'answer_list':
            var my_answer = 1;
            break;
          case 'question_list':
            var if_my_question = true
        }
        let id =  item.question ? item.question.id : item.id
        this.pushPage({
          name: Constants.PageName.qaDetail,
          query: {
            id: id,
            my_answer:my_answer || 0,
            if_my_question,
            uid:this.current_uid
          }
        });
      },
      loadMore() {
        // console.log('isMore')
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

<style lang="scss" scoped>
  @import "../../assets/scss/px2rem";
  $title-color:#333;
  $content-color:#666;
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
      margin-left: px2rem(15);
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
  $tag_border_color:#dedede;
  $tag_color:#ACACAC;
  $yuan_width: px2rem(16);
  $yuan_width_2: px2rem(8);
  .answer-list-card {
    position: relative;
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
      .img-box{
        position: absolute;
        top: px2rem(-10);
        right: px2rem(20);
        opacity: 1;
        .accepted,.get_reward{
          display:inline-block ;
          width: px2rem(50);
          height: px2rem(50);
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .answer-content{
      font-size: px2rem(14);
      color:#999999
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
      @extend .line_one
    }
    .question-content {
      font-size: px2rem(14);
      color: $content-color;
      @extend .line_three
    }

    .view-footer {
      /*border-top:1px solid #ccc;*/
      padding: px2rem(5) px2rem(20) px2rem(10);
      font-size:px2rem(12);
      display: flex;
      div:nth-child(1) {
        flex: 1;

      };
      div:nth-child(2){
        padding-right: px2rem(20);
      }
    }
    .card-tags {
      display: flex;
      flex-wrap: wrap;
      padding-top: px2rem(10);
      margin-left: px2rem(10);

      .tag {
        border: px2rem(1) solid $tag_border_color;
        color:$tag_color;
        padding: px2rem(1) px2rem(6);
        margin-left: px2rem(10);
        margin-bottom: px2rem(6);
        font-size: px2rem(12);
      }
    }
  }
  .unanswer-list-card {
    margin-bottom: px2rem(15);
    background-color: white;
    width: 100%;
    padding: px2rem(10) px2rem(20);
    z-index: 1;
    .card-title{
      font-size: px2rem(16);
      color:#333;
    }
    .question-notice {
      font-size: px2rem(14);
      color: #007aff;
    }
    .avatar {
      width: px2rem(30);
      height: px2rem(30);
    }
    .card-img {
      display: flex;
      overflow-x: scroll;
      margin-top: px2rem(20);
      height: px2rem(60);
      font-size: 0;
      .cc-img {
        margin-right: px2rem(20);
      }
      img {
        width: px2rem(80);
        height: px2rem(60);
      }
    }
    .view1 {
      display: flex;
      flex-direction: row;
      align-items: center;
      .username {
        font-size: px2rem(16);
        color: #333;
        flex-grow: 1;
        margin-left: px2rem(10);
      }
      .reward {
        font-size: px2rem(12);
        line-height: 1;
        background-color: RGB(255, 205, 0);
        color: white;
        padding: px2rem(4) px2rem(10);
        margin-left: px2rem(15);
        border-radius: px2rem(15);
      }
    }

    .card-title {
      font-size: px2rem(16);
      color: #333;
      padding: px2rem(10) 0;
    }

    .card-content {
      margin-bottom: px2rem(5);
      color: $fontcolor;
      font-size: px2rem(14);
      overflow: hidden;
    }

    .view2 {
      position: relative;
      color: $fontcolor_gray;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: px2rem(10) 0;
      border-bottom: px2rem(1) solid $divider;
      font-size: px2rem(12);
      .collect {
        color: #aaa;
      }
      .collected {
        color: #31ddaa
      }
      div:nth-child(1):after {
        content: '•';
        padding: 0 px2rem(5);
      }
      div:nth-child(2):after {
        content: '•';
        padding: 0 px2rem(5);
      }
      div:nth-child(4) {
        flex-grow: 1;
        text-align: right;
      }
    }
    .card-tags {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
      margin-top: px2rem(10);
      font-size: px2rem(12);
      .tag {
        color: $tag_color;
        border: 1px solid $tag_border_color;
        padding: px2rem(2) px2rem(5);
        margin-bottom: px2rem(4);
        font-size: px2rem(12);
        margin-right: px2rem(10);
      }
    }
  }
  .question-list-card{
    position:relative;
    background-color: white;
    width: 100%;
    padding: px2rem(10);
    border-radius: px2rem(3);
    .accepted{
      position: absolute;
      top: px2rem(10);
      right: px2rem(70);
      width: px2rem(50);
      height: px2rem(50);
      opacity: 1;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title-view {
      display: flex;
      flex-direction: row;
      align-items: center;
      .title {
        font-size: px2rem(16);
        flex-grow: 1;
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
        margin-left: px2rem(15);
      }

    }
    .view-footer {
      /*border-top:1px solid #ccc;*/
      display: flex;
      div:nth-child(2) {
        flex: 1;
        padding-left: px2rem(30);
      }
    }

    .card-content {
      color: $content-color;
      font-size: px2rem(14);
      margin: px2rem(10) 0;
      @extend .line_three
    }

    .footer-view {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: $fontcolor_gray;
      padding-top: px2rem(10);
      font-size: px2rem(10);
      margin-top: px2rem(10);
      border-top: 1px solid #f0f0f0;
      .avatar {
        vertical-align: middle;
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
        border: px2rem(1) solid $tag_border_color;
        color:$tag_color;
        padding: px2rem(1) px2rem(6);
        margin-right: px2rem(10);
        margin-bottom: px2rem(6);
        font-size: px2rem(12);
      }
    }
  }
</style>
