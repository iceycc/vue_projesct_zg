<template>
  <div>
    <h3 class="title">通知1</h3>
    <notice-info></notice-info>
  </div>
</template>

<script>
  import {Constants, EventBus, mixins} from '../assets/js/index';
  import noticeInfo from "../components/noticeInfo"
  export default {
    components:{
      noticeInfo,
    },
    mixins: [mixins.base, mixins.request],
    name: Constants.PageName.qaknowledge,
    data(){
      return{

      }
    },
    created(){
      let data = {
        a_id:16,
        q_id:7,
        uid:25416
      }
      var url = 'http://m.uzhuang.com/index.php?m=wenda&f=question_list&v=get_answer&q_id=7&a_id=16&uid=25416';
      this.doRequest(url,null,(result)=>{
        // console.log("1" + result)
      })
    }
  }
</script>

<style lang="scss" scoped>

  .title{
    text-align: center;
    padding-bottom: 0.6rem;
    border-bottom: 0.05rem solid #ccc;
  }
</style>
