<template>
  <div class="scroll-view">
    <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
    <!---->

    <mu-list v-if="type == 'list'">
      <slot name="swiper"></slot>
      <template v-for="item, index in data">
        <mu-list-item @click="onItemClick(index)">
          <div class="item">
            <slot name="item" :item="item" :index="index"></slot>
          </div>
        </mu-list-item>
        <mu-divider v-if="isNeedDivider"/>
      </template>
    </mu-list>
    <!---->
    <div class="grid" v-else-if="type == 'grid'">
      <div v-for="item, index in data" @click="onItemClick(index)" v-bind:style="gridstyle">
        <div class="item">
          <slot name="item" :item="item" :index="index"></slot>
        </div>
      </div>
    </div>
    <div class="grid" v-else-if="type == 'pics'">
      <div v-for="item, index in data" @click="onItemClick(index)" v-bind:style="gridstyle">
        <div class="item">
          <slot name="item" :item="item" :index="index"></slot>
        </div>
      </div>
    </div>
    <div class="quetiosn-card" v-else-if="type == 'quetion'">
      <div v-for="item, index in data" @click="onItemClick(index)" v-bind:style="gridstyle">
        <div class="item">
          <slot name="item" :item="item" :index="index"></slot>
        </div>
      </div>
    </div>

    <div class="empty-view" v-if="data.length === 0 && !loading">
      <div class="empty-message">{{emptyMsg}}</div>
    </div>

    <!--<mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" v-if="isMore"/>-->
    <mu-infinite-scroll v-if="isMore" :scroller="scroller" :loading="loading" @load="loadMore"
                        loadingText="数据加载中..."/>
  </div>
</template>

<script>
  import {API,mixins,EventBus} from '../../config/index';
  // import minixs_request from '../assets/js/mixins/mixins-request';

  const defaultStartPage = 1;

  export default {
    name: 'AutoListView',
    mixins: [mixins.wx],
    props: {
      ex_params:{
        type:Object,
        default:function () {
          return {}
        }
      },
      url: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'list'//grid
      },
      cols: {
        type: Number,
        default: 3
      },
      //可以绑定页面的刷新值.比如tabIindex,type等值.当该值发生改变,listview将执行刷新.
      //notify 为空,默认不发起请求
      flag: {
        type: [Number, String],
        default: true
      },
      isNeedLoadMore: {
        type: Boolean,
        default: true
      },
      isNeedDivider: {
        type: Boolean,
        default: true
      },
      isTab: {
        type: [String, Number, Boolean, Function, Object, Array, Symbol],
        default: false
      }
      // emptyMsg: {
      //   type: String,
      //   default: '正在加载中...'
      // }
    },
    data() {
      return {
        emptyMsg: '正在加载中...',
        scroller: null,
        scrollTop: 0,
        page: defaultStartPage,
        loading: false,
        isMore: true,
        data: [],
        refreshing: false,
        trigger: null,
      };
    },
    watch: {
      flag: function (val, oldVal) {
        if (val) {
          this.refresh();
        } else {
          this.init();
        }
      },
    },
    mounted() {
      this.trigger = this.$el;
      this.scroller = this.$el;
      this.scroller.onscroll = () => {
        this.scrollTop = this.scroller.scrollTop;
      };
    },
    activated() {
      if (this.scrollTop !== 0) {
        this.scroller.scrollTop = this.scrollTop;
      }
    },
    computed: {
      gridstyle() {
        let width = this.$el.childNodes[0].offsetWidth / cols;
        return {
          width: width + 'px',
          height: width + 'px',
        };
      }
    },
    created() {
      if (this.flag) {
        this.getdata();
      }
    },
    methods: {
      onItemClick(index) {
        this.$emit('onItemClick', this.data[index], index);
      },
      init() {
        this.isMore = true;
        this.page = defaultStartPage;
        this.data = [];
      },
      refresh() {
        this.init();
        this.getdata();
      },
      getPicsData() {
        this.loading = true;
        API.post(this.url, null)
            .then((result) => {
              console.log(result);
            }).catch((err)=>{
          console.log(err);
        })
      },
      getdata() {
        this.loading = true;
        // 注意判断完成切换类型是点击顶部栏还是下拉触发的方式
        if (this.isTab == true) {
          this.init()
        }
        let param = {
          page: this.page,
        };
        if(this.ex_params){
          param = Object.assign(this.ex_params,param)
        }
        if (this.$parent.handleParam) {
          param = Object.assign(this.$parent.handleParam(), param);
        }
        API.post(this.url,param)
            .then((result) => {
              console.log('autoListView result');
              console.log(result);
              result = result.data
              if ('handleResult' in this.$parent) {
                result = this.$parent.handleResult(result);
              }
              EventBus.$emit('isTab')
              this.data = this.data.concat(result);
              // console.log('==================列表=========')
              console.log(this.url)
              console.log(this.data)
              // console.log('============================')
              if (result.length === 0) {
                this.isMore = false;
                this.emptyMsg = '没有数据'
              } else {
                this.page = this.page + 1;
              }
              if (!this.isNeedLoadMore) {
                this.isMore = false;
              }
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
            });

      },
      loadMore() {
        console.log('isMore')
        console.log(this.isMore)
        if (this.isMore) {
          this.loading = true
          setTimeout(() => {
            this.getdata();
            this.loading = false
          }, 2000)
        }
      },
      refresh() {
        this.refreshing = true
        setTimeout(() => {
          this.getdata();
          this.refreshing = false
        }, 500)
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "AutoListView";

  .mu-infinite-scroll {
    padding-top: 10px;
  }

</style>
