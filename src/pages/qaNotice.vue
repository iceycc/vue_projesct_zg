<template>
  <div>
    <h3 class="title">通知</h3>
    <notice-info v-for="(item,index) in datas" :key="index" :info="item"></notice-info>
  </div>
</template>

<script>
  import {Constants, EventBus, mixins} from '../assets/js/index';
  import noticeInfo from "../components/noticeInfo"

  export default {
    components: {
      noticeInfo,
    },
    mixins: [mixins.base, mixins.request],
    name: Constants.PageName.qaknowledge,
    data() {
      return {
        datas: [
          // {
          //   status:1,
          //   detail:{},
          //   role:'',//回答者1
          //   aname:'',//管家
          //   content:'',//问1题内容
          //   time:''
          // }
        ],
        data: {
          a_id: 16,
          q_id: 7,
          uid: Constants.LocalStorage.uid
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        let obj = {}
        this.doRequest(Constants.Method.get_answer, this.data, (result) => {
          obj.status = 1;//
          obj.role = result.role;
          obj.aname = result.aname;
          obj.content = result.content;
          obj.time = result.atime;
        });
        this.datas.push(obj)
        this.datas.push(obj)
        this.datas.push(obj)
      },
    }
  }
</script>

<style lang="scss" scoped>

  .title {
    text-align: center;
    padding-bottom: 0.6rem;
    border-bottom: 0.05rem solid #ccc;
  }
</style>
