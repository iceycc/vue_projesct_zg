<template>
    <div class="content">
      <app-bar :title="title"></app-bar>
      <notice-info></notice-info>
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
        toName: Constants.PageName.qaDetail,
        thisId: ''
      }
    },
    mounted(){
    },
    created(){
    },
    actived(){

    },
    methods: {
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
    padding-bottom:px2rem(60)

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
