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
      <li class="active question-tab-li" @click="toList(1)">未回答（{{unanswer_num}}）</li>
      <li class="question-tab-li" @click="toList(2)">已回答（{{answer_num}}）</li>
    </ul>
    <auto-list-view2 v-show="isShow" :url="url1" :answered_list="answered_list_1"></auto-list-view2>

    <auto-list-view2 v-show="!isShow" :url="url2" :answered_list="answered_list_2"></auto-list-view2>
    <!--<router-view</router-view>-->
  </div>
</template>

<script>
  import {Constants, mixins, API,EventBus} from '../config/index';
  import AppBar from "../components/AppBar.vue";
  import ImgWrapper from "../components/ImgWrapper.vue";
  import AutoListView2 from "../components/AutoListView2"

  export default {
    name: "qa-guan-jia-list",
    components: {
      AppBar,
      ImgWrapper,
      AutoListView2
    },
    mixins: [mixins.base, mixins.wx],
    data() {
      return {
        title: '我得问题 管家版',
        icon_search: require('../assets/img/icon_search.svg'),
        answered_list: [],
        unanswer_num: 0,
        answer_num: 0,
        search_word: '',
        answered_list_1: [],
        answered_list_2: [],
        url: '',
        isShow: true,
        url1: '',
        url2: '',
      }
    },
    created() {
      this.getData(1)
      this.getData(2)
      this.url1 = Constants.Method.get_question_unanswered
      this.url2 = Constants.Method.get_question_answered
      // this.url = Constants.Method.get_question_unanswered

    },
    mounted() {
      this.cicikTabs()
    },
    methods: {
      toList(type) {
        if (type == 1) {
          this.isShow = true
          this.url1 = Constants.Method.get_question_unanswered
          // this.$router.push({name:'gjlist',query:{url:Constants.Method.get_question_unanswered}})
        }
        if (type == 2) {
          this.isShow = false
          this.url2 = Constants.Method.get_question_answered
          // this.$router.push({name:'gjlist',query:{url:Constants.Method.get_question_answered}})
        }
      },

      //11
      cicikTabs() {
        var _this = this
        let tapslis = document.querySelectorAll('.question-tab-li')
        for (let i = 0; i < tapslis.length; i++) {
          tapslis[i].index = i
          tapslis[i].addEventListener('click', function (e) {
            for (var i = 0; i < tapslis.length; i++) {
              tapslis[i].classList.remove('active')
              // _this.getData(i, () => {
              //   if (this.index == 0) {
              //     // _this.answered_list = _this.answered_list_1
              //   }
              //   if (this.index == 1) {
              //     // _this.answered_list = _this.answered_list_2
              //   }
              // })
            }
            let currentLi = e.target
            currentLi.classList.add('active')
          }, true)
        }
      },
      getData(type, fn) {
        //  未回答
        let uid = window.localStorage.getItem('uid')
        let options = {
          params: {
            uid: uid
          }
        }
        if (type == 1) {
          API.get(Constants.Method.get_question_unanswered, options)
              .then((result) => {
                this.unanswer_num = result.data.total
                fn && fn()
              })
              .catch((err) => {
                console.log(err);
              })
        }
        // 已回答
        if (type == 2) {
          API.get(Constants.Method.get_question_answered, options)
              .then((result) => {
                this.answer_num = result.data.total
                fn && fn()
              })
              .catch((err) => {
                console.log(err);
              })
        }
      },
      goSearch(word) {
        console.log(111)
        word = word.replace(/^\s+|\s+$/g, "")
        if (!word) {
          console.log('不能为空')
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '搜索内容不能为空'
          });
          return;
        }
        let options = {
            params:{
              key_word: word,
              uid:window.localStorage.getItem('uid')
            }
        }
        API.get(Constants.Method.get_question_unanswered, options)
            .then((result) => {
              console.log(result);
              this.answered_list = result.data.question_list
              if (result.data.total === 0) {
                console.log('no datas');
                EventBus.$emit(Constants.EventBus.showToast, {
                  message: '没有找到搜索结果'
                });
              }
            })
            .catch((err)=>{
              console.log(err);
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

  /*question-tab*/
  .question-tab {
    list-style: none;
    width: 100%;
    height: px2rem(50);
    text-align: center;
    background: #fff;
    margin: px2rem(10) 0;
    li {
      display: inline-block;
      box-sizing: border-box;
      width: 45%;
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
