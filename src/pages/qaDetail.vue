<template>
  <div class="content">
    <!--标题 问题详情-->
    <app-bar :title="title"></app-bar>
    <!--顶部问题详情-->
    <div class="card shadow" v-if="question">
      <!--用户头像 名称 赏金-->
      <div class="view1">
        <img-wrapper :url="question.avatar" classStyle="avatar"></img-wrapper>
        <div class="username">{{question.aname}}</div>
        <span class="reward shadow"
              v-if="parseFloat(question.q_reward) > 0"> 悬赏金额 ¥{{question.q_reward}}</span>
      </div>
      <!--问题标题-->
      <div class="card-title">{{question.title}}</div>
      <!--问题描述-->
      <div class="card-content">{{question.content}}</div>
      <!--展示 浏览数 回答数 收藏 时间-->
      <div class="view2">
        <div>{{question.pv}}浏览</div>
        <div>{{question.answer_num}}回答</div>
        <!--收藏 -->
        <button @click="collect" class="collect-icon" :disabled="disabled" style="border: none;background: transparent;outline:none">
          <img-wrapper :url="question.is_collect ?  icon5 : icon6 " classStyle="icon"></img-wrapper>
        </button>

        <div>{{ question.qtime | my_time }}</div>
      </div>
      <!-- -->
      <div class="card-tags" v-if="question.label && question.label.length > 0">
        <div class="tag" v-for="item in question.label">
          {{item}}
        </div>
      </div>
    </div>
    <!--评论列表-->
    <div class="scroll-view">
      <!--mu-->
      <mu-list>
        <template v-for="item, index in answer_list">
          <div class="item" @click="onItemClick(index)">
            <div class="card-re">
              <!--评论 人 头像 名称 用户等级 是否采纳 11-->
              <div class="view1 horizontal-view">
                <img-wrapper :url="item.a_avatar" classStyle="avatar"></img-wrapper>
                <div class="vertical-view">
                  <div class="name">{{item.aname.nickname}}
                    <!--显示颜色从组件内根据角色名匹配的-->
                    <uz-lable v-if="question.q_reward > 0" :role="item.uid === question.uid ? '赏金发起人' : item.role"></uz-lable>
                    <uz-lable v-else :role="item.uid ===question.uid ? '问题发起人' : item.role"></uz-lable>
                  </div>
                  <div class="date">{{item.atime}}</div>
                </div>
                <!--采纳-->
                <div class="accept" v-if="isOwner && question.q_adoption == 0" @click.stop="accept(index)">采纳</div>
                <div class="accepted" v-if="question.q_adoption ==item.id"><img src="../assets/img/accepted@2x.png"
                                                                                alt=""></div>
                <div class="get_reward" v-if="question.q_adoption ==item.id && question.q_reward > 0"><img
                  src="../assets/img/get_reward.png" alt=""></div>
              </div>
              <!--评论内容-->
              <div class="context">{{item.content}}</div>
              <!--获取评论下的评论 -->
              <div v-if="item.hot_comment.c_id" class="hotcomment">
                <div class="title">{{item.hot_comment.username}}
                  <uz-lable :role="item.hot_comment.role"></uz-lable>
                  :{{item.hot_comment.content}}
                </div>
                <div class="count">查看全部{{item.hot_comment.comment_total_num}}条回复</div>
              </div>
              <!--底部信息展示-->
              <div class="view2 horizontal-view">
                <!--点赞功能-->
                <button class="like" v-bind:class="item.liked == 1 ? 'liked' : ''"
                     @click.stop="like(index,item.liked)"
                    style="border: none;background: transparent;outline: none"
                        :disabled="disabled"
                >
                  <img-wrapper :url="item.liked == 1 ? icon4 : icon3 "
                               classStyle="icon"></img-wrapper>
                  {{item.like_num}}

                </button>
                <!--<div @click.stop="fenXiang(index)"> 分享</div>-->

              </div>
            </div>
          </div>
        </template>
      </mu-list>
    </div>

    <div class="footer horizontal-view">
      <div @click="gotoResponse">
        <img-wrapper :url="icon1" classStyle="icon"></img-wrapper>
        去回答
      </div>
      <div @click="gotoAsk">
        <img-wrapper :url="icon2" classStyle="icon"></img-wrapper>
        去提问
      </div>
    </div>
  </div>
</template>

<script>
  import {Constants, EventBus, mixins, util} from '../assets/js/index';

  import ComponentTemplate from "../components/template";
  import AutoListView from "../components/AutoListView";
  import MuAppbar from "../../node_modules/muse-ui/src/appBar/appBar.vue";
  import AppBar from "../components/AppBar.vue";
  import ImgWrapper from "../components/ImgWrapper.vue";
  import UzLable from "../components/uzLable.vue";

  export default {
    components: {
      UzLable,
      ImgWrapper,
      AppBar,
      AutoListView
    },
    mixins: [mixins.base, mixins.request, util],
    name: Constants.PageName.qaDetail,
    filters: {
      my_time: function (value) {
        if (value) {
          return value.substring(5)
        }
        return value
      }
    },
    data() {
      return {
        text_lable:['哈哈','hhe1'],
        icon1: require('../assets/img/icon_detail_response.svg'),
        icon2: require('../assets/img/icon_detail_ask.svg'),
        icon3: require('../assets/img/icon_detail_like.svg'),
        icon4: require('../assets/img/icon_detail_liked.svg'),
        icon5: require('../assets/img/accepted.svg'),
        icon6: require('../assets/img/accept.svg'),
        uid: 0,
        question: {},
        answer_list: [],
        flag: null,
        version: process.env.APP_VERSION,
        localValue: this.$ls.get(Constants.LocalStorage.test, '-1'),
        disabled:false
      };
    },
    computed: {},
    created() {
      this.getData();
      this.initWX(() => {
        console.log('wx success');
      });
    },
    activated() {
    },
    methods: {
      fenXiang() {
        console.log(11)
        let url = window.location.href
        console.log(url)
        console.log(wx.onMenuShareTimeline)
        wx.onMenuShareTimeline({
          title: '分享该问题', // 分享标题
          link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: '', // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          fail: function () {
            // 用户确认分享后执行的回调函数

          }
        })
      },

      getData() {
        let data = {
          q_id: this.$route.query.id,
          uid: this.$ls.get(Constants.LocalStorage.uid)
        };
        this.doRequest(Constants.Method.get_question_list, data, (result) => {
          this.question = result.question;
          console.log(result)
          // 获取当前问题采纳的回答的id
          let thisId = this.question.q_adoption
          // 倒叙
          this.answer_list = result.answer_list
          // this.jsonSort()
          // 采纳的部分：
          let getIndex = function (arr, key) {
            let index = -1;
            arr.every(function (vale, i) {
              if (vale['id'] === key) {
                index = i
              } else {
                index = -1
              }
            })
            return index
          }
          let i = getIndex(this.answer_list, thisId)
          let caiNa = ''
          if (i !== -1) {
            caiNa = this.answer_list.splice(i, 1)[0]
          }
          // 没有采纳的部分 按点赞排序
          this.answer_list = util.jsonSort(this.answer_list, 'like_num', true);
          if (caiNa) {
            this.answer_list.unshift(caiNa)
          }
          console.log(this.answer_list)
          this.isOwner = (this.question.uid === this.$ls.get(Constants.LocalStorage.uid));

        });
      },
      gotoResponse() {
        this.pushPage({
          name: Constants.PageName.qaResponse,
          query: {
            id: this.question.id
          }
        });
      },
      gotoAsk() {
        this.pushPage({
          name: Constants.PageName.qaAsk,
          qarams: {
            type: 1
          }
        });
      },

      like(index, liked) {
        if(timer){
          clearTimeout(timer)
        }
        this.disabled = true
        let timer ;
        let data = {
          q_id: this.$route.query.id,
          a_id: this.answer_list[index].id,
          c_id: 0
        };
        switch (liked) {
          case 1:
            this.doRequest(Constants.Method.un_like, data, (result) => {
              this.getData();
              timer = setTimeout(()=>{
                this.disabled = false
              },1000)
            })
            break;
          case 0:
            this.doRequest(Constants.Method.like, data, (result) => {
              this.getData();
              timer = setTimeout(()=>{
                this.disabled = false
              },1000)
            })
            break;
          default:
            console.log('操作太快')
        }
      },
      toLiked(index, liked){
        this.debounce(this.like(index, liked),1000)

      },
      debounce(fn, delay) {
        // 1 记录一个初始时间11
        let last = Date.now()
        // 2 维护一个 timer
        let timer;
        return function () {
          // 3 记录当前时间
          let current = Date.now()
          // 4 进来的时候清除之前的定时器
          // 5
          console.log(current - last)

          if((current - last)>delay){
            timer = setTimeout(fn,delay)
            last = current
          } else{
            // 当前是2秒以内重复触发
            timer = setTimeout(fn,delay)
          }
        }
      },

      collect() {

        if(timer){
          clearTimeout(timer)
        }
        this.disabled = true
        console.log(this.disabled)
        let timer

        var count = window.localStorage.getItem('collect_num')
        if (this.question.is_collect) {
          let data = {
            q_id: this.$route.query.id,
          };
          this.doRequest(Constants.Method.un_favourites, data, (result) => {
            count --;
            EventBus.$emit('collect_num',count)
            this.getData();
            EventBus.$emit(Constants.EventBus.showToast, {
              message: '取消收藏'
            });
            timer = setTimeout( () => {
              this.disabled = false
              console.log(this.disabled)
            },1000)
          });
        } else {
          let data = {
            q_id: this.$route.query.id,
          };
          this.doRequest(Constants.Method.favourites, data, (result) => {
            count ++;
            EventBus.$emit('collect_num',count)
            this.getData();
            EventBus.$emit(Constants.EventBus.showToast, {
              message: '收藏成功'
            });
            timer = setTimeout( () => {
              this.disabled = false
              console.log(this.disabled)
            },1000)
          });
        }


      },
      accept(index) {
        let data = {
          q_id: this.$route.query.id,
          a_id: this.answer_list[index].id,
        };

        this.doRequest(Constants.Method.adoption, data, (result) => {
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '已采纳'
          });
          this.getData();
        });
      },
      onItemClick(index) {
        let data = {
          q_id: this.$route.query.id,
          a_id: this.answer_list[index].id
        };

        this.pushPage({
          name: Constants.PageName.qaComment,
          query: data
        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/scss/px2rem";

  .content {
    background-color: $divider;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .avatar {
    width: px2rem(30);
    height: px2rem(30);
  }

  .card {
    background-color: white;
    width: 100%;
    padding: px2rem(10) px2rem(20);
    z-index: 1;
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
        border-radius: px2rem(15);
      }
    }

    &-title {
      font-size: px2rem(14);
      color: #333;
      padding: px2rem(10) 0;
    }

    &-content {
      color: $fontcolor;
      font-size: px2rem(14);
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
      div:nth-child(1):after {
        content: '•';
        padding: 0 px2rem(5);
      }
      div:nth-child(2):after {
        content: '•';
        padding: 0 px2rem(5);
      }
      div:nth-child(3) {
        flex-grow: 1;
      }
    }

    &-tags {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: px2rem(10);
      font-size: px2rem(12);
      .tag {
        color: $fontcolor_gray;
        border: px2rem(1) solid $fontcolor_gray;
        padding: px2rem(2) px2rem(5);
        font-size: px2rem(12);
        margin-right: px2rem(10);
      }
    }
  }

  .scroll-view {
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .card-re {
    background-color: white;
    padding: px2rem(10);
    margin: px2rem(10);
    .view1 {
      align-items: center;
      > div:nth-child(2) {
        flex-grow: 1;
        font-size: px2rem(14);
        margin-left: px2rem(10);
        color: $fontcolor_gray;
      }
      .name {
        color: #333;
      }
      .date {
        font-size: px2rem(12);
      }
      .accept {
        font-size: px2rem(12);
        padding: px2rem(2) px2rem(8);
        color: $mainColor;
        border: px2rem(1) solid $mainColor;
      }
      .accepted, .get_reward {
        position: absolute;
        top: px2rem(15);
        width: px2rem(50);
        height: px2rem(50);
        opacity: 1;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .accepted {
        right: px2rem(15);
      }
      .get_reward {
        right: px2rem(75);

      }
    }
    .view2 {
      color: $fontcolor_gray;
      font-size: px2rem(12);
      justify-content: flex-end;
      /*11111*/
      .collect-icon{
        .icon{
          display: inline-block;
          width: px2rem(10);
          height: px2rem(10);
        }
      }
      .like {
        display: flex;
        flex-direction: row;
        .icon {
          width: px2rem(15);
          height: px2rem(15);
          margin-right: px2rem(5);
        }
      }
      .liked {
        color: $fontcolor_red;
      }
    }
    .hotcomment {
      background-color: #F6F6F6;
      padding: px2rem(10) px2rem(5);
      font-size: px2rem(12);
      margin-bottom: px2rem(10);
      .title {

      }
      .count {
        margin-top: px2rem(5);
        color: $fontcolor_blue;
      }
    }
  }

  .footer {
    width: 100%;
    padding: px2rem(15) 0;
    font-size: px2rem(12);
    color: #333333;
    background-color: white;
    display: -webkit-box;
    border-top: px2rem(1) solid $fontcolor_gray;
    div {
      flex-grow: 1;
      text-align: center;
      vertical-align: middle;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    > div:nth-child(1) {
      border-right: px2rem(1) solid $fontcolor_gray;
    }
    .icon {
      width: px2rem(15);
      height: px2rem(15);
      margin-right: px2rem(10);
    }
  }
</style>
