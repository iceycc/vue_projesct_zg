<template>
    <div class="content">
      <app-bar :title="title"></app-bar>
      <notice-info></notice-info>
    </div>
</template>

<script>
  import {Constants, EventBus, mixins,API} from '../../config/index';
  import noticeInfo from "../../components/noticeInfo";
  import AppBar from "../../components/commons/AppBar.vue";
  export default {
    components: {
      noticeInfo,
      AppBar
    },
    mixins: [mixins.base, mixins.wx],
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
      this.initWX(() => {
        this.fenXiang({
          title:'诸葛装修，全方位解决您的装修问题',
          imgUrl:'http://image1.uzhuang.com/zhuge-logo.png'
        },function () {
          // console.log('fenXiang');
        })
        // console.log('wx success');
      });
    },
    actived(){

    },
    methods: {
      goDetail(index) {
        // console.log(this.datas[index])
        // this.$router.push({
        //   name: Constants.PageName.qaDetail,
        //   query: {
        //     id: this.datas[index].question_id
        //   }
        // })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/px2rem";

  .content {
    height: 100%;
    background: $divider;
  }



  .title {
    text-align: center;
    padding-bottom: px2rem(6);
    color:#666;
    border-bottom: px2rem(4) solid #ccc;
    background-color: white;
  }

</style>
