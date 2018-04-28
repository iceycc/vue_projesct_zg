<template>
  <div class="scroll-view">
    <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
    <mu-list>
      <div class="info-box"
           v-for="(item,index) in datas" :key="index"
           @click="goDetail(item.type,index,item.question_id,item.answer_id,item.id)"
           :class="{isread:item.is_read == '0'}"
      >
        <!--问题指向11-->
        <!--1 回答 2采纳 3点赞回答 4点赞评论 5评论回答 6评论评论-->
        <p>
          <span class="username">{{item.from_user}}</span>
          <span class="notice_infos">{{notice_infos[item.type]}}</span>
          <span class="no-date">{{item.addtime | crtTime }}</span>
        </p>
        <div class="infos-text">{{item.content}}</div>
        <!--<div></div>-->
      </div>
    </mu-list>
    <mu-infinite-scroll v-if="isMore" :scroller="scroller" :loading="loading" @load="loadMore"
                        loadingText="数据加载中..."/>
  </div>
</template>

<script>
  import {Constants, EventBus, mixins,API} from '../config/index';
  import moment from 'moment'

  const defaultStartPage = 1;

  export default {
    name: "notice-info",
    mixins: [mixins.base, mixins.wx],
    data() {
      return {
        // 1 回答 2采纳 3点赞回答 4点赞评论 5评论回答 6评论评论
        notice_infos: ['0', ' 回答了您的问题', ' 采纳了您的问题', ' 点赞了你的回答', ' 点赞了你的评论', ' 评论了你的回答', ' 评论了你的评论'],
        datas: [],
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
      if (!this.datas) {
        this.getData()
      }
    },

    mounted() {
      this.trigger = this.$el;
      this.scroller = this.$el;

    },
    activated() {// 组件激活
      this.datas = []
      this.page = defaultStartPage
      console.log('activated')
      this.getData()
    },

    methods: {
      // 1 先确定是什么类型的请求11111
      // type: 1 回答 2采纳 3点赞回答 4点赞评论 5评论回答 6评论评论
      // 2 获取父组件传递的参数
      // 3 点击进入详情
      goDetail(type, index, q_id, a_id, id) {
        console.log(5413)
        this.$router.push({
          name: Constants.PageName.qaComment,
          query: {
            id: a_id,
            inform_id: id
          }
        });
      },
      getData() {
        console.log(11)
        var data = {
          uid: window.localStorage.getItem('uid'),
          page: this.page
        }
        API.post(Constants.Method.get_notice_list, data)
            .then((result) => {
              result = result.data
              this.getRedNum(result)
              console.log(result)
              this.datas = this.datas.concat(result)
              //1 如果新请求的数据存在但是result.length为0  取消加载
              if (result && result.length == 0) {
                this.isMore = false
              } else {
                this.page = this.page + 1
              }
            })
            .catch((err)=>{
              console.log(err);
            });
      },
      getRedNum(result) {
        var count = 0;
        result.forEach(function (item, value) {
          if (item.isread == "0") {
            count++
          }
        })
        // console.log(count) 1
        EventBus.$emit('notice_isread_num', count)
        // window.localStorage.setItem("notice_isread_num", count)
      },
      loadMore() {
        console.log(this.isMore)
        if (this.isMore) {
          this.loading = true
          setTimeout(() => {
            this.getData();
            this.loading = false
          }, 2000)
        }
      },
      refresh() {
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
      display: flex;
      margin: 0;
      padding: px2rem(10) 0;
      font-weight: 500;
      font-size: 0;
      vertical-align: top;
    }
    .username {
      color: #1bd4bb;
      font-size: px2rem(13);
      vertical-align: top;

    }
    .notice_infos {
      font-size: px2rem(13);
      vertical-align: top;
      padding-left: px2rem(2);

    }
    .no-date {
      flex: 1;
      text-align: right;
      font-size: px2rem(10);
      color: #999
    }
    .infos-text {
      color: #666;
      font-size: px2rem(12);
      padding: px2rem(4) 0 px2rem(20);

    }
  }
</style>
