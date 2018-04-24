<!--todo -->
<template>
  <div class="scroll-view">
    <!--下拉组件-->
    <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
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
    <!--下拉加载组件-->
    <mu-infinite-scroll v-if="isMore" :scroller="scroller" :loading="loading" @load="loadMore"
                        loadingText="数据加载中..."/>
  </div>
</template>

<script>
  export default {
    name: "",
    data(){
      return{

      }
    },
    methods:{
    }
  }
</script>

<style lang="scss">
  // 1 - 滑动
.scroll-view{
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

}
</style>