<template>
  <div>
      <div class="info-box" @click="goDetail(index)">
        <!--问题指向1-->
        <p>{{title}}</p>
        <p class="infos-text">{{info.content}}</p>
        <p><span class="no-date">{{info.time}}</span></p>
      </div>
  </div>
</template>

<script>
  import minixs_request from '../assets/js/mixins/mixins-request';

  import {Constants, EventBus, mixins} from '../assets/js/index';

  export default {
    name: "notice-info",
    mixins: [minixs_request],
    props:{
      info: {
        type:Object
      },

    },
    data() {
      return {
        title:'',
        infos:['','']
      }
    },
    created(){


    },

    mounted(){
      setTimeout(() => {
        this.getReq()
        },400)

    },
    methods:{
      // 1 先确定是什么类型的请求11111
      // 1-1 管家文丑回答了您的问题 接口：http://m.uzhuang.com/index.php?m=wenda&f=question_list&v=get_answer&q_id=7&a_id=16&uid=25416
      // 1-2 用户名称 回答了您的问题
      // 1-3 用户名称 点赞了 您的回答
      // 1-4 用户名称采纳了您的回答
      getReq(){
        //  管家回复
        if(this.info.status ===1){
          this.title = "管家 " + this.info.aname + " 回答了您的问题";
        }
        //  用户回复
        if(this.info.status ===2){
          this.title = this.info.role + " 回答了您的问题"
        }
        if(this.info.status ===3) {
          this.title = this.info.role + " 采纳了你的问答"
        }
        if(this.info.status ===4) {
          this.title = this.info.role + " 点赞了你的问答"
        }

      },
      // 2 获取父组件传递的参数

      // 3 点击进入详情

    }
  }
</script>
<style lang="scss">
  .info-box{
    border-bottom: 0.02rem solid #adadad;
    padding: 0 0.4rem;
    color: #adadad;
    .infos-text{
      color:#000
    }
  }
</style>
