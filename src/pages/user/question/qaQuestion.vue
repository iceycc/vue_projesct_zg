<template>
  <div class="content">
    <!--<app-bar :title="title"></app-bar>-->
    <div class="fixed-top">
      <div class="question-search">
        <input type="search" v-model="search_word" @keyup.enter="goSearch(search_word)" placeholder="请输入问题名称" class="">
        <div @click="goSearch(search_word)">
          <img-wrapper :url="icon_search" classStyle="icon"></img-wrapper>
        </div>
      </div>

    <ul class="question-tab" v-if="role == 1">
      <li class="active question-tab-li" @click="getList(1)">未回答（{{left_num}}）</li>
      <li class="question-tab-li" @click="getList(2)">已回答（{{right_num}}）</li>
    </ul>
    <ul class="question-tab" v-if="role == 0">
      <li class="active question-tab-li" @click="getList(3)">提问（{{left_num}}）</li>
      <li class="question-tab-li" @click="getList(4)">回答（{{right_num}}）</li>
    </ul>
    </div>
    <div class="card-box">
      <auto-list-view2 :url="url" :type="list_type" :ex_params="ex_params" :flag="flag" :isTab="isTab"></auto-list-view2>
    </div>


  </div>
</template>

<script>
  import {Constants, mixins, API, EventBus} from '../../../config/index';
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
        title: '我的问答',
        icon_search: require('../../../assets/img/icon_search3.svg'),
        answered_list: [],
        left_num: null,
        right_num: null,
        search_word: '',
        answered_list_1: [],
        answered_list_2: [],
        urls: [
          '',
          Constants.Method.get_question_unanswered,//管家未回答1
          Constants.Method.get_question_answered,//管家已回答2
          Constants.Method.get_my_question,//用户提问3
          Constants.Method.get_my_answer//用户回答4
        ],
        isShow: 1,
        url: '',
        role: 0,
        ex_params: {
          key_word: ''
        },
        list_type: 'question_list',
        flag: {
          flag:null
        },
        isTab:false,
        list_type_num:null,
        watch_count:0,
      }
    },
    created() {
      this.initWX(() => {
        this.fenXiang({
          title:'诸葛装修，全方位解决您的装修问题',
          imgUrl:'http://image1.uzhuang.com/zhuge-logo.png'
        },function () {
          // console.log('fenXiang');
        })
        // console.log('wx success');
      });
      this.role = window.localStorage.getItem(Constants.LocalStorage.role)
      this.init(this.role)

      // this.url = Constants.Method.get_question_unanswered

    },
    activated(){
      this.getNum()
    },
    mounted() {
      this.cicikTabs()
    },
    computed:{
      num_total:function () {
        return [this.left_num + this.right_num,this.search_word]
      }
    },
    watch:{
      num_total:function (curVal,oldVal) {
        this.watch_count ++
        if(this.watch_count>2){
          this.getList(this.list_type_num,this.search_word)
          this.watch_count =0
        }
      }
    },
    methods: {
      init(this_role,left_right) {
        // console.log('init')
        // console.log(this_role)
        if (this_role == 1) {
          this.getNum()
          this.url = this.urls[1]
          // this.url2 = Constants.Method.get_question_answered
          this.list_type = 'unanswer_list'
          this.flag = {
            url:this.url,
            ex_params:this.ex_params,
            isTab:3
          }
          this.list_type_num = 1

        }
        if (this_role == 0) {
          this.getNum()
          this.url = this.urls[3];
          this.list_type = 'question_list'

          // this.url = Constants.Method.get_my_answer
          // this.list_type = 'answer_list'
          this.flag = {
            url:this.url,
            ex_params:this.ex_params,
            isTab:1
          }
          this.list_type_num = 3

        }
      },
      getList(type, key_word) {
        this.isTab = true;
        // console.log(type)

        this.ex_params = {
          key_word
        }
        if (type === 1) {
          this.url = Constants.Method.get_question_unanswered
          this.list_type = 'unanswer_list'
          this.flag = {
            url:this.url,
            ex_params:this.ex_params,
            isTab:1
          }
        }
        if (type === 2) {
          this.url = Constants.Method.get_question_answered
          this.list_type = 'answer_list'
          this.flag = {
            url:this.url,
            ex_params:this.ex_params,
            isTab:2
          }
        }
        if (type === 3) {
          this.url = Constants.Method.get_my_question
          this.list_type = 'question_list'
          this.flag = {
            url:this.url,
            ex_params:this.ex_params,
            isTab:3
          }
        }
        if (type === 4) {
          this.url = Constants.Method.get_my_answer
          this.list_type = 'answer_list'
          this.flag = {
            url:this.url,
            ex_params:this.ex_params,
            isTab:4
          }
        }
        this.list_type_num = type
      },
      onItemClick(item) {
        // console.log(item)
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
      getNum() {
        let data = {}

        function getLeftNum() {
          return API.post(Constants.Method.get_my_left_num, data)
        }

        function getRightNum() {
          return API.post(Constants.Method.get_my_right_num, data)
        }

        // API.all([getLeftNum(),getRightNum()])
        //     .then(API.spread((res1,res2)=>{
        //       // console.log(res1);
        //       // console.log(res2);
        //     }))
        //     .catch((err1,err2)=>{
        //       // console.log(err1);
        //       // console.log(err2);
        //     })
        getLeftNum().then((result) => {
          // console.log(result);
          this.left_num = result.data.num
        })
        getRightNum().then((result) => {

          // console.log(result);
          this.right_num = result.data.num
        })

      },
      goSearch(word) {
        // console.log(word)
        word = word.replace(/^\s+|\s+$/g, "")
        if (!word) {
          // console.log('不能为空')
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '搜索内容不能为空'
          });
          return;
        }
        if(!this.list_type_num){
          // console.log('未知错误')
          return
        }
        this.getList(this.list_type_num,word)

        // switch (Number(list_num)) {
        //   case 1:
        //
        // }
        // this.reData = true
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
  .card-box{
    margin-top: px2rem(115);
    height: 100%;
    padding-bottom:px2rem(115) ;
  }
  .fixed-top{
    width: 100%;
    top: px2rem(0);
    position: fixed;
    background: #fff;
  }
  /*search 1111  */
  .question-search {
    position: relative;
    width: px2rem(350);
    margin: 0 auto;
    height: px2rem(60);
    padding: px2rem(10);
    input {
      width: 100%;
      height: 100%;
      border-radius: px2rem(30);
      border: px2rem(1) solid #ccc;
      padding-left:px2rem(45);
      background: #f1f1f1;
    }
    .icon {
      position: absolute;
      left: px2rem(25);
      top: px2rem(18);
    }
  }

  /*question-tab*/
  .question-tab {
    display: flex;
    list-style: none;
    width: 100%;
    height: px2rem(40);
    text-align: center;
    background: #fff;
    li {
      flex: 1;
      margin: 0 px2rem(40);
      box-sizing: border-box;
      width: 45%;
      line-height: px2rem(40);
      &.active {
        color: #1cd3bf;
        border-bottom: px2rem(3) solid #1cd3bf;

      }
    }
  }
</style>
