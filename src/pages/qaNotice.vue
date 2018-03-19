<template>
    <div class="content">
      <h3 class="title">通知</h3>
      <notice-info :datas="datas"></notice-info>
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
        datas: [],
        data: {
          a_id: 16,
          q_id: 7,
          uid: Constants.LocalStorage.uid
        },
        toName: Constants.PageName.qaDetail,
        thisId: ''
      }
    },
    mounted(){
    },
    created(){
      this.getData()
    },
    methods: {
      getData() {
        this.doRequest(Constants.Method.get_notice_list, this.data, (result) => {
          console.log("获取通知列表")
          console.log(result)
          this.datas = result
        });
      },

      goDetail(index) {
        console.log(11111212)
        this.$router.push({
          name: Constants.PageName.qaDetail,
          query: {
            id: this.datas[index].question_id
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/scss/px2rem";

  .content {
    height: 100%;
  }
  .scroll-view {
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }


  .title {
    text-align: center;
    padding-bottom: 0.6rem;
    border-bottom: 0.05rem solid #ccc;
  }
</style>
