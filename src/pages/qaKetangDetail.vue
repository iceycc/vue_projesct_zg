<template>
  <div class="content">
    <app-bar :title="title"></app-bar>

    <div class="scroll-view">


      <a class="card" v-for="item,index in data_list" :key="index" :href="item.url">
        <div class="card-img">
          <img :src="item.thumb" alt="">
        </div>
        <div class="title-view">
          <div class="title">{{item.title}}</div>
          <div class="card-content">{{item.remark}}</div>
        </div>
      </a>
      <div v-if="!data_list || data_list.length == 0" class="no-data">
        没有数据
      </div>
      <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"
                          loadingText="数据加载中..."/>
    </div>
  </div>

</template>

<script>
  import {Constants, EventBus, mixins} from '../assets/js/index';
  import axios from 'axios';
  import ComponentTemplate from "../components/template";
  import AutoListView from "../components/AutoListView";
  import ImgWrapper from "../components/ImgWrapper";
  import AppBar from "../components/AppBar.vue";


  export default {
    components: {
      ImgWrapper,
      AutoListView,
      AppBar
    },
    mixins: [mixins.base, mixins.request],
    name: Constants.PageName.qaknowledge,
    data() {
      return {
        isFirst:true,
        url: '',
        category_index: 0,
        categorys: [{
          name: '推荐',
        }, {
          name: '装修前',
        }, {
          name: '装修中',
        }, {
          name: '装修后',
        }],
        title:'',
        picsTitle:[],
        data_list:[],
        loading: false,
        scroller: null

      };
    },
    filters:{
      forPicsTitle:(val,index) => {
        return val[index]
      }
    },
    mounted(){
      this.scroller = this.$el
    },
    computed: {},
    created() {
      let id = this.$route.query.cid || 0;
      this.title = this.$route.query.title || '课堂'
      // console.log(id);
      this.getList(id)

    },
    methods: {
      loadMore () {
        this.loading = true
        setTimeout(() => {
          for (let i = this.num; i < this.num + 10; i++) {
            this.list.push('item' + (i + 1))
          }
          this.num += 10
          this.loading = false
        }, 2000)
      },
      getList(id) {
        // this.url = 'http://bang.uzhuang.com/index.php?m=bangV2&f=ketang&v=nodeList'+'&cid=' + id;
        // this.flag = this.url;
        // this.isFirst = true
        let url = 'http://bang.uzhuang.com/index.php?m=bangV2&f=ketang&v=nodeList';
        axios.get(url,{params:{cid:id,page:1}})
          .then((result)=>{
            this.data_list = result.data.data
            // console.log(this.data_list)
          })
      },
      onItemClick(item) {
        window.location.href = item.url;
        /*this.pushPage({
            name: Constants.PageName.qaDetail,
            query: {
                id: item.id
            }
        });*/
      },

      gotoSearch() {
        this.pushPage({
          name: Constants.PageName.qaSearch
        });
      },
      openWeb(url) {
        window.location.href = url;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/scss/px2rem";
.scroll-view{
  padding: px2rem(10) px2rem(6) px2rem(50);
  height: 100%;
  overflow: scroll;
  background: #f2f2f2;
}
  .no-data{
    text-align: center;
    margin-top: px2rem(50);
  }
  .content {
    background-color: $divider;
    height: 100%;
  }
  .hot_word_view {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-y: auto;
    background-color: white;

    .hot_word {
      color: #333;
      flex-grow: 1;
      padding: px2rem(15) 0;
      margin: 0 px2rem(15);
      font-size: px2rem(13);
      text-align: center;
      white-space: nowrap;
      transition: font-size, color 0.2s, 0.2s;
      border-bottom: px2rem(2) solid #fff;
    }
    .hot_word_select {
      color: $mainColor;
      font-size: px2rem(13);
      border-bottom: px2rem(2) solid $mainColor;
    }
  }
  /*11*/
  .ketang_imgs{
    display: flex;
    flex-wrap:wrap;
    .ketang_img{
      position:relative;
      padding: px2rem(10);
      display: inline-block;
      width: 50%;
      height: px2rem(120);

      img{
        width: 100%;
      }
      .title{
        position: absolute;
        padding: px2rem(6);
        font-size: px2rem(16);
        white-space:nowrap;
        text-overflow: ellipsis;
        color: #fff;
      }

    }
  }
  .card {
    display: block;
    background-color: white;
    width: 100%;
    padding: px2rem(10);
    border-radius: px2rem(3);
    display: flex;
    margin-bottom: px2rem(10);
    /*1211111111*/
    .card-img{
      display: block;
      box-sizing: border-box;
      width: px2rem(80);
      height: px2rem(60);
      background: #ccc;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .title-view {
      flex: 1;
      width: 65%;
      padding-left: px2rem(10);
      .title {
        font-weight: bold;
        font-size: px2rem(15);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #555;
      }
    }
    &-content {
      color: #666666;
      font-size: px2rem(13);
      padding: px2rem(10) 0;
      border-bottom: px2rem(1) solid $divider;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

  }

</style>
