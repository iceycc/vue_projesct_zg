<template>
  <div class="content">
    <app-bar :title="title"></app-bar>
    <div class="question-search">
      <input type="search" v-model="search_word">
      <div @click="goSearch(search_word)">
        <img-wrapper :url="icon_search" classStyle="icon"></img-wrapper>
      </div>
    </div>
    <ul class="question-tab">
      <li class="active question-tab-li">未回答（{{unanswer_num}}）</li>
      <li class="question-tab-li">已回答（{{answer_num}}）</li>
    </ul>
    <div class="scroll-view">
      <div class="no-data" v-if="answered_list.length == 0">
        没有数据
      </div>
      <div class="question-card" @click="goQuestionDetail(item)" v-for="item,index in answered_list" :key="index" v-else>
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
        <div class="question-info" v-if="item.answer_num == 0">还没有对我进行回答的快来回答我哦</div>
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
    mixins: [mixins.base, mixins.request],
    data() {
      return {
        title: '我得问题 管家版',
        icon_search: require('../assets/img/icon_search.svg'),
        answered_list: [],
        unanswer_num: 0,
        answer_num: 0,
        search_word:'',
        answered_list_1: [],
        answered_list_2: []
      }
    },
    created() {
      this.getData(1, () => {
        this.answered_list = this.answered_list_1
        this.getData(2)
      })

    },
    mounted() {
      this.cicikTabs()
    },
    methods: {
      goQuestionDetail(item){
        this.pushPage({
          name: Constants.PageName.qaDetail,
          query: {
            id: item.id
          }
        });
      },
      //11
      cicikTabs() {
        let tapslis = document.querySelectorAll('.question-tab-li')
        for (let i = 0; i < tapslis.length; i++) {
          tapslis[i].index = i
          var _this=this
          tapslis[i].addEventListener('click', function(e){
            for (let i = 0; i < tapslis.length; i++) {
              tapslis[i].classList.remove('active')
              _this.getData(i, () => {
                if (this.index == 0) {
                  _this.answered_list = _this.answered_list_1
                }
                if (this.index == 1) {
                  _this.answered_list = _this.answered_list_2
                }
              })
            }
            let currentLi = e.target
            currentLi.classList.add('active')
          }, true)
        }
      },
      getData(type, fn) {
        //  未回答
        if (type == 1) {
          this.doRequest(Constants.Method.get_question_unanswered, null, (result) => {
            // console.log(result)
            this.answered_list_1 = result.question_list
            this.unanswer_num = result.total
            fn && fn()
          })
        }
        // 已回答
        if (type == 2) {
          this.doRequest(Constants.Method.get_question_answered, null, (result) => {
            // console.log(result)
            this.answered_list_2 = result.question_list
            this.answer_num = result.total
            fn && fn()
          })
        }
      },
      goSearch(word){
        // console.log(word)
        let data = {
          key_word:word
        }
       this.doRequest(Constants.Method.get_question_unanswered,data,(result)=>{
         // console.log(result);
         this.answered_list =result.question_list
         if(result.total == 0){
           EventBus.$emit(Constants.EventBus.showToast, {
             message: '没有找到搜索结果'
           });
         }
       })
      }
    }

  }
</script>

<style lang="scss" scoped>
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
    .no-data{
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

  /*question-tab*/
  .question-tab {
    list-style: none;
    width: 100%;
    height: px2rem(50);
    display: flex;
    text-align: center;
    background: #fff;
    margin:px2rem(10) px2rem(10);
    li {
      flex: 1;
      height: 100%;
      line-height: px2rem(40);
      &.active {
        border-bottom: px2rem(1) solid #007aff;

      }
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
