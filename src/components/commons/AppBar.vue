<template>
  <mu-appbar :title="title" v-if="showAppBar">
    <mu-icon-button :icon="icon" slot="left" @click="goBack"></mu-icon-button>
    <template slot="right" v-if="this.mode !== 'test'">
      <!--<mu-icon-button v-if="showSearch" icon="search" slot="right" @click="goSearch"></mu-icon-button>-->
      <slot name="right"></slot>
    </template>
  </mu-appbar>
</template>

<script>
  import {EventBus, Constants} from '../../config/index';

  export default {
    name: 'app-bar',
    props: {
      mode: {
        type: String,
        default: 'page'
      },
      title: {
        type: String,
        default: ''
      },
      showSearch: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        showAppBar: true,
        icon: 'arrow_back',
      };
    },
    activated(){
      this.mode='page'
      // // console.log(this.mode)
    },
    created() {
      // document.title = this.title;
      //alert(navigator.userAgent);

      switch (this.mode) {
        case 'page':
          this.icon = 'arrow_back';
          break;
        case 'main':
          this.icon = 'menu';
          break;
        case 'test':
          break;
      }

      /**
       * 如果是微信内,则不显示appBar
       * @type {boolean}
       */
      this.showAppBar = !/MicroMessenger/.test(navigator.userAgent);
    },
    methods: {
      goSearch() {
        this.$router.push({name: 'search'});
      },
      goBack() {
        switch (this.mode) {
          case 'zsql':
            // this.$router.goBack({
            //   name: Constants.PageName.qaAsk,
            //   params: {
            //     type:1
            //   }
            // });
            this.$router.go(-1);
            break;
          case 'page':
            this.$router.go(-1);
            break;
          case 'main':
            EventBus.$emit(Constants.EventBus.toggleDrawer);
            break;
        }
      }
    }
  };
</script>

<style lang="scss">
</style>
