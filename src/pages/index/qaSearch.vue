<template>
  <div class="content">
    <div class="search-view">
      <div class="inputClass">
        <mu-text-field fullWidth :underlineShow="false" v-model="search" hintText="搜索"/>
      </div>
      <mu-flat-button label="搜索" class="demo-flat-button" @click="doSearch"/>
    </div>

    <div class="search-hotword">

      <div class="title">
        <img-wrapper @onClick="remove()" :url="icon_search_hot" classStyle="title_icon"></img-wrapper>
        <span> 热门搜索</span>
      </div>
      <div class="words">
        <div v-for="item in words" @click="searchWord(item,true)">{{item}}</div>
      </div>
    </div>

    <div class="search-hotword history" v-if="searchwords && searchwords.length > 0">
      <div class="title">
        <img-wrapper @onClick="remove()" :url="icon_search_histroy" classStyle="title_icon"></img-wrapper>
        <span> 搜索历史</span>
      </div>
      <div class="list">
        <div v-for="item,index in searchwords" v-if="index<=4">
          <div class="name" @click="searchWord(item,false)">{{item}}</div>
          <img-wrapper @onClick="remove(index)" :url="icon_search_close"></img-wrapper>
        </div>
      </div>
      <div class="clear-all" @click="clickAllSearchHistory">清除全部</div>
    </div>
  </div>

</template>

<script>

  import {Constants, EventBus, mixins,API} from '../../config/index';

  import AppBar from "../../components/commons/AppBar.vue";
  import ImgWrapper from "../../components/commons/ImgWrapper.vue";

  export default {
    //  改页面第一次迭代后废弃
    components: {
      AppBar,
    },
    mixins: [mixins.base, mixins.wx],
    name: Constants.PageName.qaSearch,
    data() {
      return {
        words: [],
        searchwords: [],
        search: '',
        icon_search_close: require('../../assets/img/icon_search_close.svg'),
        icon_search_histroy: require('../../assets/img/icon_search_histroy.svg'),
        icon_search_hot: require('../../assets/img/icon_search_hot.svg'),
      };
    },
    created() {
      this.initWX(() => {
        this.fenXiang({
          title:'诸葛装修，全方位解决您的装修问题',
          imgUrl:'http://image1.uzhuang.com/zhuge-logo.png'
        },function () {
          // console.log('fenXiang');
        })
        // console.log('wx success');
      });
      let temp = this.$ls.get(Constants.LocalStorage.searchHistory);
      if (temp) {
        this.searchwords = temp.split(',');
      } else {
        this.searchwords = [];
      }
      let data ={
      }
      API.post(Constants.Method.hot_search, {})
          .then((result) => {
            this.words = result.data;
          })
          .catch((err)=>{
            // console.log(err);
          });

    },
    activated() {
    },
    methods: {
      clickAllSearchHistory(){
        // console.log(11)
        this.$ls.remove(Constants.LocalStorage.searchHistory)
        this.searchwords = []
      },
      searchWord(word, issave) {
        if (issave) {
          if (this.searchwords.indexOf(word) !== -1) {
            this.searchwords.splice(this.searchwords.indexOf(word), 1);
          }
          this.searchwords.unshift(word);
          this.$ls.set(Constants.LocalStorage.searchHistory, this.searchwords);
        }

        this.pushPage({
          name: Constants.PageName.qaList,
          query: {
            key_word: word
          }
        });
      },
      doSearch() {
        this.search = this.search.replace(/^\s+|\s+$/g, "");
        if (!this.search) {
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '不能为空'
          });
          return;
        }
        this.searchwords.unshift(this.search);
        this.$ls.set(Constants.LocalStorage.searchHistory, this.searchwords);
        this.pushPage({
          name: Constants.PageName.qaList,
          query: {
            key_word: this.search
          }
        });
        this.search = '';
      },
      remove(index =0) {
        this.searchwords.splice(index, 1);
        this.$ls.set(Constants.LocalStorage.searchHistory, this.searchwords);
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/scss/px2rem";

  .content {
    background-color: $divider;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .search-view {
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    .inputClass {
      flex-grow: 1;
      background-color: $divider;
      border-radius: px2rem(20);
      padding-left: px2rem(20);
      margin: px2rem(10);
    }
  }

  .clear-all {
    padding-top: px2rem(10);
    text-align: center;
    font-size: px2rem(14);
    color:#999;
  }

  .search-hotword {
    background-color: white;

    margin: px2rem(10);
    padding: px2rem(10);
    border-radius: px2rem(5);
    &.history{
      max-height:60%;
      overflow-y: scroll;
    }
    .title {
      /*font-size: px2rem(0);*/
      vertical-align: top;
      border-bottom: px2rem(1) solid $divider;
      padding: 0 0 px2rem(10) 0;
      vertical-align: middle;
      span {
        font-size: px2rem(15);
        vertical-align: middle;
      }
      .title_icon {
        vertical-align: middle;
        width: px2rem(18);
        height: px2rem(18);
      }
    }
    .words {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: px2rem(10) 0 0 0;
      & > div {
        border: px2rem(1) solid $divider;
        border-radius: px2rem(20);
        padding: px2rem(2) px2rem(10);
        margin-right: px2rem(10);
        margin-bottom: px2rem(10);
      }
    }
    .list {
      display: flex;
      flex-direction: column;
      & > div {
        border-bottom: px2rem(1) solid $divider;
        padding: px2rem(10) 0;
        display: flex;
        flex-direction: row;
        .name {
          flex-grow: 1;
          overflow-x:hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }

    }
  }

</style>
