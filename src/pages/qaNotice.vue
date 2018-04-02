<template>
    <div class="content">
      <app-bar :title="title"></app-bar>
      <notice-info :datas="datas"></notice-info>
    </div>
</template>

<script>
  import {Constants, EventBus, mixins} from '../assets/js/index';
  import noticeInfo from "../components/noticeInfo";
  import AppBar from "../components/AppBar.vue";

  export default {
    components: {
      noticeInfo,
      AppBar
    },
    mixins: [mixins.base, mixins.request],
    name: Constants.PageName.qaknowledge,
    data() {
      return {
        title:'通知',
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
          this.getRedNum(result)
          this.datas = result

          console.log("======通知result============")
          console.log(result)
          console.log("===================")
        });
      },

      getRedNum(result){
        let count = 0;
        result.forEach(function (item,value) {
          if(item.isread == "0"){
            count ++
          }
        })
        // console.log(count) 1
        window.localStorage.setItem("notice_isread_num",count)


      },

      goDetail(index) {
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
    background: $divider;

  }
  .scroll-view {
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }


  .title {
    text-align: center;
    padding-bottom: px2rem(6);
    color:#666;
    border-bottom: px2rem(4) solid #ccc;
    background-color: white;
  }

</style>
