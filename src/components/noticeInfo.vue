<template>
  <div class="scroll-view">
    <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
    <mu-list>
      <div class="info-box"
           v-for="(item,index) in datas" :key="index"
           @click="goDetail(item.type,index,item.question_id,item.answer_id)"
           :class="{isread:item.isread != '1'}"
      >
        <!--问题指向11-->
        <p v-if="item.type === '1'"><span class="username">{{item.from_user}}</span> 回答了您的问题</p>
        <p v-if="item.type === '2'"><span class="username">{{item.from_user}}</span> 采纳了您的问题</p>
        <p v-if="item.type === '3'"><span class="username">{{item.from_user}}</span> 点赞了你的问答</p>
        <p v-if="item.type === '4'"><span class="username">{{item.from_user}}</span> 点赞了你的评论</p>
        <p v-if="item.type === '5'"><span class="username">{{item.from_user}}</span> 评论了你的问答</p>
        <p v-if="item.type === '6'"><span class="username">{{item.from_user}}</span> 评论了你的评论</p>
        <div class="infos-text">{{item.content}}</div>
        <div><span class="no-date">{{item.addtime | crtTime }}</span></div>
      </div>
    </mu-list>
    <mu-infinite-scroll v-if="isMore" :scroller="scroller" :loading="loading" @load="loadMore"
                        loadingText="数据加载中..."/>
  </div>
</template>

<script>
  import minixs_request from '../assets/js/mixins/mixins-request';

  import {Constants, EventBus, mixins} from '../assets/js/index';
  const defaultStartPage = 1;

  export default {
    name: "notice-info",
    mixins: [mixins.base, mixins.request],
    filters: {
      crtTime: function (val) {

        if (val != null) {
          var date = new Date(val * 1000);
          return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
              + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        }
      }
    },
    data() {
      return {
        datas:[],
        title: '',
        isReadNum: 0,
        scroller: null,
        scrollTop: 0,
        page: defaultStartPage,
        loading: false,
        isMore: true,
        data: [],
        refreshing: false,
        trigger: null
      }
    },
    created() {
      this.getData()
    },

    mounted() {
      this.trigger = this.$el;
      this.scroller = this.$el;

    },
    methods: {
      // 1 先确定是什么类型的请求11111
      // type: 1 回答 2采纳 3点赞回答 4点赞评论 5评论回答 6评论评论
      // 2 获取父组件传递的参数
      // 3 点击进入详情
      goDetail(type, index, q_id, a_id) {
        this.$router.push({
          name: Constants.PageName.qaComment,
          query: {
            q_id: q_id,
            a_id: a_id,
            c_id: 0
          }
        });
        // switch (type){
        //   case '1':
        //     this.$router.push({
        //       name: Constants.PageName.qaDetail,
        //       query: {
        //         id: q_id
        //       }
        //     });
        //     break;
        //   case '2':
        //     this.$router.push({
        //       name: Constants.PageName.qaDetail,
        //       query: {
        //         id: q_id
        //       }
        //     });
        //     break;
        //   case '3':
        //     this.$router.push({
        //       name: Constants.PageName.qaDetail,
        //       query: {
        //         id: q_id
        //       }
        //     });
        //     break;
        //   case '4':
        //     this.$router.push({
        //       name: Constants.PageName.qaComment,
        //       query: {
        //         q_id: q_id,
        //         a_id: a_id,
        //         c_id: 0
        //       }
        //     });
        //     break;
        //   case '5':
        //     this.$router.push({
        //       name: Constants.PageName.qaComment,
        //       query: {
        //         q_id: q_id,
        //         a_id: a_id,
        //         c_id: 0
        //       }
        //     });
        //     break;
        //   case '6':
        //     this.$router.push({
        //       name: Constants.PageName.qaComment,
        //       query: {
        //         q_id: q_id,
        //         a_id: a_id,
        //         c_id: 0
        //       }
        //     });
        //     break;
        // }

      },
      getData() {
        var data = {
          uid: Constants.LocalStorage.uid,
          page:this.page
        }
        this.doRequest(Constants.Method.get_notice_list, data, (result) => {
          this.getRedNum(result)
          this.datas = this.datas.concat(result)
          //1 如果新请求的数据存在但是result.length为0  取消加载
          if(result && result.length == 0){
            this.isMore = false
          }else{
            this.page = this.page + 1
          }
        });
      },

      getRedNum(result){
        var count = 0;
        result.forEach(function (item,value) {
          if(item.isread == "0"){
            count ++
          }
        })
        // console.log(count) 1
        window.localStorage.setItem("notice_isread_num",count)


      },
      loadMore() {
        console.log(this.isMore)
        if(this.isMore){
          this.loading = true
          setTimeout(() => {
            this.getData();
            this.loading = false
          }, 2000)
        }
      },
      refresh () {
        this.refreshing = true
        setTimeout(() => {
          this.getData();
          this.refreshing = false
        }, 2000)
      }

    }
  }
</script>
<style lang="scss">
  @import "../assets/scss/px2rem";

  .isread p:after {
    font-size: 0;
    display: inline-block;
    content: '';
    height: px2rem(4);
    width: px2rem(4);
    vertical-align: top;
    background-color: red;
    border-radius: px2rem(2);
    margin-left: px2rem(10);
    margin-top: px2rem(6);
  }

  .info-box {
    /*border-bottom: px2rem(2)  solid #111adadad;*/
    margin: px2rem(8);
    padding: 0 px2rem(12);
    color: #333;
    background: #fff;
    p {
      margin: 0;
      padding: px2rem(10) 0;
    }
    .infos-text {
      color: #999;
      padding: px2rem(4) 0 px2rem(15);

    }
    .username {
      color: #1bd4bb;
    }
  }
</style>
