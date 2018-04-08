<template>
  <div class="scroll-view">
    <!---->
    <mu-list v-if="type == 'list'">
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
    <div class="empty-view" v-if="data.length <= 0 && !loading">
      <div class="empty-message">{{emptyMsg}}</div>
    </div>
    <mu-infinite-scroll v-if="isMore" :scroller="scroller" :loading="loading" @load="loadMore"
                        loadingText="数据加载中..."/>
  </div>
</template>

<script>
  import minixs_request from '../assets/js/mixins/mixins-request';
  // import minixs_request from '../assets/js/mixins/mixins-request';

  const defaultStartPage = 1;

  export default {
    name: 'AutoListView',
    mixins: [minixs_request],
    props: {
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
      emptyMsg: {
        type: String,
        default: '没有数据'
      }
    },
    data() {
      return {
        scroller: null,
        scrollTop: 0,
        page: defaultStartPage,
        loading: false,
        isMore: true,
        data: []
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
      getPicsData(){
        this.loading = true;
        this.doRequest(this.url,null,(result) =>{

        })
      },
      getdata() {
        this.loading = true;

        let param = {
          page: this.page
        };
        if (this.$parent.handleParam) {
          param = Object.assign(this.$parent.handleParam(), param);
        }

        this.doRequest(this.url, param, (result) => {
          if ('handleResult' in this.$parent) {
            result = this.$parent.handleResult(result);
          }
          this.data = this.data.concat(result);
          console.log('==================列表=========')
          console.log(this.url)
          console.log(result)
          console.log('============================')

          if (result.length === 0) {
            this.isMore = false;
          } else {
            this.page = this.page + 1;
          }

          if (!this.isNeedLoadMore) {
            this.isMore = false;
          }
        }, null, () => {
          this.loading = false;
        });
      },
      loadMore() {
        this.getdata();
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
