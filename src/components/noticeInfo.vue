<template>
  <div>
      <div class="info-box">
        <!--问题指向-->
        <p v-if="status === 1">{{title}}</p>
        <p class="infos-text">{{text}}</p>
        <p><span class="no-date">{{time}}</span></p>
      </div>
  </div>
</template>

<script>
  import minixs_request from '../assets/js/mixins/mixins-request';

  import {Constants, EventBus, mixins} from '../assets/js/index';

  export default {
    name: "notice-info",
    mixins: [minixs_request],

    data() {
      return {
        status: 1,
        detail:'',
        title:'',
        text:'',
        time:''
      }
    },
    created(){
      this.getData()

    },
    methods:{
      // 1 先确定是什么类型的请求
      // 1-1 管家文丑回答了您的问题 接口：http://m.uzhuang.com/index.php?m=wenda&f=question_list&v=get_answer&q_id=7&a_id=16&uid=25416
      // 1-2 用户名称 回答了您的问题
      // 1-3 用户名称 点赞了 您的回答
      // 1-4 用户名称采纳了您的回答
      getReq(){
        //  管家回复
        if(this.detail.aname){
          this.title = "管家" + this.detail.aname + "回答了您的问题";
        }
        // 用户回复
        if(this.detail.role){
          this.title = this.detail.role + "回答了您的问题"
        }
        this.text = this.detail.content
        this.time = this.detail.atime


      },
      // 2 获取父组件传递的参数
      getData() {
        console.log(121121111)
        let data = {
          a_id:16,
          q_id:7,
          uid:25416
        };

        this.doRequest(Constants.Method.get_answer, data, (result) => {
          console.log(result);
          this.detail = result;
          this.getReq()

        });
      },
    }
  }
</script>
<style lang="scss">
  .info-box{
    border-bottom: 0.02rem solid #0edda2;
    padding: 0 0.4rem;
    color: #adadad;
    .infos-text{
      color:#000
    }
  }
</style>
