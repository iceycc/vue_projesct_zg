<template>
  <div class="scroll-view">
      <div class="info-box"
           v-for="(item,index) in datas" :key="index"
           @click="goDetail(item.type,index,item.question_id)"
           :class="{isread:item.isread != '0'}"
      >
        <!--问题指向1-->
        <p v-if="item.type === '1'">{{item.from_user}} 回答了您的问题</p>
        <p v-if="item.type === '2'">{{item.from_user}} 采纳了您的问题</p>
        <p v-if="item.type === '3'">{{item.from_user}} 点赞了你的问答</p>
        <p v-if="item.type === '4'">{{item.from_user}} 点赞了你的评论</p>
        <p v-if="item.type === '5'">{{item.from_user}} 评论了你的问答</p>
        <p v-if="item.type === '6'">{{item.from_user}} 评论了你的评论</p>
        <div class="infos-text">{{item.content}}</div>
        <div><span class="no-date">{{item.addtime | crtTime }}</span></div>
      </div>
  </div>
</template>

<script>
  import minixs_request from '../assets/js/mixins/mixins-request';

  import {Constants, EventBus, mixins} from '../assets/js/index';

  export default {
    name: "notice-info",
    mixins: [minixs_request],
    props:['datas'],
    filters:{
      crtTime:function (val) {

        if (val != null) {
          var date = new Date(val * 1000);
          return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
            + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() ;
        }
      }
    },
    data() {
      return {
        title:'',
        isReadNum:0
      }
    },
    created(){
    },

    mounted(){
      this.addRednum()

    },
    methods:{
      // 1 先确定是什么类型的请求11111
      // type: 1 回答 2采纳 3点赞回答 4点赞评论 5评论回答 6评论评论
      // 2 获取父组件传递的参数
      // 3 点击进入详情

      goDetail(type,index,id) {
        switch (type){
          case '1':
            this.$router.push({
              name: Constants.PageName.qaDetail,
              query: {
                id: id
              }
            });
            break;
          case '2':
            this.$router.push({
              name: Constants.PageName.qaDetail,
              query: {
                id: id
              }
            });
            break;
          case '3':
            this.$router.push({
              name: Constants.PageName.qaDetail,
              query: {
                id: id
              }
            });
            break;
          case '4':
            this.$router.push({
              name: Constants.PageName.qaComment,
              query: {
                id: id
              }
            });
            break;
          case '5':
            this.$router.push({
              name: Constants.PageName.qaDetail,
              query: {
                id: id
              }
            });
            break;
          case '6':
            this.$router.push({
              name: Constants.PageName.qaComment,
              query: {
                id: id
              }
            });
            break;
        }

      },
      addRednum(){
        this.datas.forEach(function (item,index) {
          if(item.isread != '0'){
            this.isReadNum ++
          }
        })

        console.log(this.isReadNum)
        EventBus.$emit(Constants.EventBus.add_red,this.isReadNum)
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
    background-color:red;
    border-radius:px2rem(2);
    margin-left: px2rem(10);
    margin-top:px2rem(6) ;
  }

  .info-box{
    border-bottom: 0.02rem solid #adadad;
    padding: 0 0.4rem;
    color: #adadad;
    .infos-text{
      color:#000;
      padding: px2rem(4) 0;

    }
  }
</style>
