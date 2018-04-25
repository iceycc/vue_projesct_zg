<template>
  <div class="content">
    <app-bar :title="title"></app-bar>
    <div class="question-search">
      <input type="search" v-model="search_word">
      <div @click="goSearch(search_word)">
        <img-wrapper :url="icon_search" classStyle="icon"></img-wrapper>
      </div>
    </div>
    <ul class="question-tab" v-if="role == 1">
      <li class="active question-tab-li" @click="toList(1)">未回答（{{g_unanswer_num}}）</li>
      <li class="question-tab-li" @click="toList(2)">已回答（{{g_answer_num}}）</li>
    </ul>
    <ul class="question-tab" v-if="role == 0">
      <li class="active question-tab-li" @click="toList(3)">提问（{{quetion_num}}）</li>
      <li class="question-tab-li" @click="toList(4)">回答（{{answer_num}}）</li>
    </ul>
    <auto-list-view2 v-show="isShow === 1" :url="url1" :answered_list="answered_list_1" type="user_question"></auto-list-view2>

    <auto-list-view2 v-show="isShow === 2" :url="url2" :answered_list="answered_list_2" type="user_question">

    </auto-list-view2>
    <auto-list-view2 v-show="isShow === 3" :url="url3" :answered_list="answered_list_2" type="list"  @onItemClick="onItemClick">
      <template slot="item" slot-scope="props">
        <div class="card">
          <div class="title-view">
            <div class="title">{{props.item.title}}</div>
            <span class="reward shadow"
                  v-if="parseFloat(props.item.q_reward) > 0">{{props.item.q_reward}}</span>
          </div>
          <div class="card-content">{{props.item.content}}</div>
          <div class="footer-view">
            <div class="avatar">
              <img-wrapper v-for="avatar,index in props.item.avatar" :url="avatar" :key="index"
                           classStyle="avatar"></img-wrapper>
            </div>
            <div class="pv">{{props.item.pv}}浏览</div>
          </div>
        </div>
      </template>
    </auto-list-view2>
    <auto-list-view2 v-show="isShow === 4" :url="url4" :answered_list="answered_list_2" type="user_question"></auto-list-view2>
  </div>
</template>

<script>
  import {Constants, mixins, API,EventBus} from '../../../config/index';
  import AppBar from "../../../components/commons/AppBar.vue";
  import ImgWrapper from "../../../components/commons/ImgWrapper.vue";
  import AutoListView2 from "../../../components/commons/AutoListView2"
  import AutoListView from "../../../components/commons/AutoListView"

  export default {
    name: "qa-guan-jia-list",
    components: {
      AppBar,
      ImgWrapper,
      AutoListView2,
      AutoListView
    },
    mixins: [mixins.base, mixins.wx],
    data() {
      return {
        title: '我得问题',
        icon_search: require('../../../assets/img/icon_search.svg'),
        answered_list: [],
        g_unanswer_num: 0,
        g_answer_num: 0,
        quetion_num: 0,
        answer_num: 0,
        search_word: '',
        answered_list_1: [],
        answered_list_2: [],
        url: '',
        isShow: 1,
        url1: '',
        url2: '',
        url3: '',
        url4: '',
        role:0
      }
    },
    created() {

      this.role =  window.localStorage.getItem('role')
      this.init(this.role)
      // this.url = Constants.Method.get_question_unanswered

    },
    mounted() {

      this.cicikTabs()

    },
    methods: {
      init(this_role){
        console.log('init')
        console.log(this_role)
        if(this_role ==1){
          this.isShow = 1
          this.getData(1)
          this.getData(2)
          this.url1 = Constants.Method.get_question_unanswered
          this.url2 = Constants.Method.get_question_answered
        }
        if(this_role == 0){
          this.isShow = 3
          this.getData(3)
          this.getData(4)
          this.url3 = Constants.Method.get_homepage + '&type=3';
          this.url4 = Constants.Method.get_question_answered
        }
      },
      toList(type) {
        if (type === 1) {
          this.isShow = 1
          this.url1 = Constants.Method.get_question_unanswered
        }
        if (type === 2) {
          this.isShow = 2
          this.url2 = Constants.Method.get_question_answered
        }
        if (type === 3) {
          this.isShow = 3
          this.url3 = Constants.Method.get_homepage + '&type=2';
        }
        if (type === 4) {
          this.isShow = 4
          this.url4 = Constants.Method.get_question_answered
        }
      },
      onItemClick(item){
        console.log(11)
        this.pushPage({
          name: Constants.PageName.qaDetail,
          query: {
            id: item.id
          }
        });
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
            }
            let currentLi = e.target
            currentLi.classList.add('active')
          }, true)
        }
      },
      getData(type, fn) {
        //  未回答
        let options = {
          params: {
          }
        }
        // 未回答
        if (type === 1) {
          API.get(Constants.Method.get_question_unanswered, options)
              .then((result) => {
                this.g_unanswer_num = result.data.total
                fn && fn()
              })
              .catch((err) => {
                console.log(err);
              })
        }
        // 已回答
        if (type === 2) {
          API.get(Constants.Method.get_question_answered, options)
              .then((result) => {
                this.g_answer_num = result.data.total
                fn && fn()
              })
              .catch((err) => {
                console.log(err);
              })
        }

        if(type === 3){
          let url = Constants.Method.get_homepage + '&type=2';
          API.get(url, options)
              .then((result) => {
                this.quetion_num = result.data.total
                fn && fn()
              })
              .catch((err) => {
                console.log(err);
              })
        }
        if(type === 4){
          let url = Constants.Method.get_question_answered;
          API.get(url, options)
              .then((result) => {
                this.answer_num = result.data.total
                console.log(result)
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
  @import "../../../assets/scss/px2rem";

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
      border-radius: px2rem(30);
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
    display: flex;
    list-style: none;
    width: 100%;
    height: px2rem(60);
    text-align: center;
    background: #fff;
    margin: px2rem(10) 0;
    li {
      flex: 1;
      margin: 0 px2rem(30);
      box-sizing: border-box;
      width: 45%;
      line-height: px2rem(40);
      &.active {
        color:#1cd3bf;
        border-bottom: px2rem(3) solid #1cd3bf;

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
        font-weight: 600;
        color:#666
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
      color: #666666;
      font-size: px2rem(14);
      padding: px2rem(10) 0;
      border-bottom: px2rem(1) solid $divider;
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
  }
</style>
