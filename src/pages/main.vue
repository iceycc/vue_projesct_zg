<template>
  <div class="page">
    <div class="sub-page" v-bind:style="style">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <mu-bottom-nav :value="bottomNav" @change="handleChange" ref="bottom" v-if="!$route.meta.isShowTab">
      <mu-bottom-nav-item value="0" title="问答">
        <img-wrapper :url="bottomNav == 0 ? tab0[1] : tab0[0]" class="tabicon"></img-wrapper>
      </mu-bottom-nav-item>
      <mu-bottom-nav-item value="1" title="课堂">
        <img-wrapper :url="bottomNav == 1 ? tab1[1] : tab1[0]" class="tabicon"></img-wrapper>
      </mu-bottom-nav-item>
      <mu-bottom-nav-item value="2" :title="ask_text">
        <img-wrapper :url="bottomNav == 2 ? tab2[1] : tab2[0]" class="tabicon"></img-wrapper>
      </mu-bottom-nav-item>
      <mu-bottom-nav-item value="3" title="通知">
        <!--<i class="isread-num" v-if="notice_isread_num === 1 ? false : true"></i>-->
        <i class="isread-num" v-if="isreadShow"></i>
        <img-wrapper :url="bottomNav == 3 ? tab3[1] : tab3[0]" class="tabicon"></img-wrapper>
      </mu-bottom-nav-item>
      <mu-bottom-nav-item value="4" title="我的">
        <img-wrapper :url="bottomNav == 4 ? tab4[1] : tab4[0]" class="tabicon"></img-wrapper>
      </mu-bottom-nav-item>
      <div class="btn_ask" @click="handleChange(2)" v-if="!$route.meta.isShowTab">
        <img-wrapper :url="tab2[1]" class="askicon"></img-wrapper>
      </div>
    </mu-bottom-nav>
    <div class="mask" v-if="showAsk">
      <div class="btn-view">
        <keep-alive>
          <div class="icon-view">
            <div style="visibility: hidden" class="msg-infos">
              <div>更快更多更优质回答</div>
              <div>查看更多<a href="">专属权利</a></div>
            </div>
            <div @click="gotoAsk(0)">
              <img-wrapper :url="icon1" classStyle="icon"></img-wrapper>
              <div class="name">免费提问</div>
            </div>
          </div>
        </keep-alive>
        <keep-alive>
          <div class="icon-view">
            <div class="msg-infos">
              <div>更快更多更优质回答</div>
              <div>查看更多<a href="javascript:;" @click.stop="webpage" style="text-decoration: underline;color:#328afb">专属权利</a></div>
            </div>
            <div @click="gotoAsk(1)">
              <img-wrapper :url="icon2" classStyle="icon"></img-wrapper>
              <div class="name">悬赏提问</div>
            </div>
          </div>
        </keep-alive>
      </div>
      <div class="ask-close">
        <img-wrapper classStyle="close" @onClick="toggleAsk" :url="icon_ask_close"></img-wrapper>
      </div>
    </div>

  </div>
</template>

<script>
  import {Constants, EventBus, mixins} from '../assets/js/index';
  import ImgWrapper from "../components/ImgWrapper.vue";

  export default {
    components: {
      ImgWrapper
    },
    mixins: [mixins.base],
    name: 'main',
    data() {
      return {
        ask_text:'提问',
        toast: {
          show: false,
          message: '',
          Timer: null
        },
        bottomNav: -1,
        icon1: require('../assets/img/icon_ask_free.png'),
        icon2: require('../assets/img/icon_ask.png'),
        tab0: [require('../assets/img/icon_tab_index.svg'), require('../assets/img/icon_tab_index_ed.svg')],
        tab1: [require('../assets/img/icon_tab_school.svg'), require('../assets/img/icon_tab_school_ed.svg')],
        tab2: [require('../assets/img/icon_tab_ask.svg'), require('../assets/img/icon_tab_ask.svg')],
        tab3: [require('../assets/img/icon_tab_notifi.svg'), require('../assets/img/icon_tab_notifi_ed.svg')],
        tab4: [require('../assets/img/icon_tab_user.svg'), require('../assets/img/icon_tab_user_ed.svg')],
        icon_ask_close:require('../assets/img/icon_ask_close.svg'),
        showAsk: false,
        style: {},
        notice_isread_num: 0,
        isreadShow: false,
        to_doc:{},
        role:0
      };
    },
    updated() {
      console.log('updated')
      this.isReadShow()
    },

    created() {
      var _that = this
      EventBus.$on('showTotal', (value)=> {
        if(value){
          _that.handleChange(2)
        }else{
          this.showAsk = !this.showAsk;
        }
      })
      this.role = window.localStorage.getItem(Constants.LocalStorage.role)
      if(this.role==1){this.ask_text='提问'}
      this.to_doc ={name:Constants.PageName.qaDoc,params:{type:2}}
      this.isReadShow()
      if (this.bottomNav === -1) {
        this.handleChange(0);
      }

      if (this.$route.params.isLogin) {
        EventBus.$emit(Constants.EventBus.login);
      }
      if (Constants.EventBus.add_red) {
        EventBus.$on(Constants.EventBus.add_red, function (value) {
        })
      }
    },
    watch:{
      "$router":"getUserData"
    },

      mounted() {
      this.style = {
        height: (this.$el.offsetHeight - this.$refs['bottom'].$el.offsetHeight) + 'px'
      };
    },
    methods: {
      webpage(){
        this.$router.push({name:Constants.PageName.qaDoc,params:{type:2}})
      },
      getUserData(to,from){
        // if(to.mame == 'qaindex'){
        //   document.title = '问答';
        // }
        this.showAsk = false
        // this.doRequest(Constants.Method.profile, null, (result) => {
        //   this.collect_num = this.collect_num || this.data.collect_num
        //
        //   window.localStorage.setItem('collect_num',this.collect_num)
        //
        // });
      },
      isReadShow() {
        EventBus.$on('notice_isread_num',(count)=>{
          if (count > 0) {
            this.isreadShow = true
          }

          if (count == 0) {
            this.isreadShow = false
          }
        })

      },
      toggleAsk() {
        this.showAsk = !this.showAsk;
      },
      gotoAsk(type) {
        this.pushPage({
          name: Constants.PageName.qaAsk,
          params: {
            type
          }
        });
      },
      handleChange(value) {
        console.log('value:2')
        if (value == 2) {
          if(this.role==0){
            this.toggleAsk();
          }
          if(this.role == 1){
            EventBus.$emit(Constants.EventBus.showToast, {
              message: '管家没有提问权限'
            });
          }
        } else {
          let name = '';
          switch (parseInt(value)) {
            case 0:
              name = Constants.PageName.qaIndex;
              break;
            case 1:
              name = Constants.PageName.qaknowledge;
              break;
            case 3:
              name = Constants.PageName.qaNotice;

              break;
            case 4:
              name = Constants.PageName.qaUser;
              break;
          }

          this.bottomNav = value;
          this.pushPage({
            name: name
          });
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 111-->
<style lang="scss" scoped>
  @import "../assets/scss/px2rem";

  .page {
    background: #f2f2f2;
    padding-bottom: px2rem(70);
  }
  .mu-bottom-nav{
    position: fixed;
    bottom: 0;

  }
  .sub-page {
    flex-grow: 1;
    /*padding-bottom: px2rem(120);*/
  }

  .tabicon {
    width: 25px;
    height: 25px;
  }
  $ask_with:55px;
  .btn_ask {
    position: absolute;
    width: $ask_with;
    height: $ask_with;
    bottom: 20px;
    left: 50%;
    margin-left: -$ask_with/2;
    padding-top:($ask_with - 40px)/2;
    background: #fff;
    border-radius:$ask_with/2;
    .askicon {
      width: 40px;
      height: 40px;
    }
  }

  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.90);
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 100;
    .btn-view {
      display: flex;
      flex-direction: row;
      .icon-view {
        // 注意 qaDetail也有相同的样式
        padding-top: px2rem(60);
        position:relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        .msg-infos{
          position: absolute;
          top: px2rem(-8);
          left: px2rem(20);
          width: px2rem(140);
          height: px2rem(80);
          font-size: px2rem(13);
          box-sizing: border-box;
          padding-top: px2rem(10);
          padding-left: px2rem(9);
          background: url("../assets/img/bg_text_box.png") no-repeat 0 0;
          background-size: px2rem(140) px2rem(80);
          background-origin:border-box ;
        }
      }

      .icon-view:nth-child(1) {
        margin-right: px2rem(30);
      }

      .icon {
        width: px2rem(60);
        height: px2rem(60);
        margin: px2rem(20);
      }
      .name {
        font-size: px2rem(16);
        text-align: center;
      }
    }
    .ask-close{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: px2rem(55);
      border-top: 1px solid #ccc;
      text-align:center;
      font-size: 0;
      &:after{
        display: inline-block;
        vertical-align: middle;
        content:'';
        height:100%;
      }
    }
    .close {
      vertical-align: middle;
      width: px2rem(30);
      height: px2rem(30);
    }
  }

  .isread-num {
    position: absolute;
    left: px2rem(46);
    top: px2rem(6);
    display: inline-block;
    content: "";
    width: px2rem(6);
    height: px2rem(6);
    border-radius: px2rem(3);
    background: red;
  }
</style>

