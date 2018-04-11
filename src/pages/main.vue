<template>
  <div class="page">
    <div class="sub-page" v-bind:style="style">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <mu-bottom-nav :value="bottomNav" @change="handleChange" ref="bottom">
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
    </mu-bottom-nav>
    <div class="mask" v-if="showAsk">
      <div class="btn-view">
        <keep-alive>
          <div class="icon-view" @click="gotoAsk(0)">
            <div style="visibility: hidden">
              <div>更快更多更优质回答</div>
              <div>查看更多<a href="">专属权利</a></div>
            </div>
            <img-wrapper :url="icon1" classStyle="icon"></img-wrapper>
            <div class="name">免费提问</div>
          </div>
        </keep-alive>
        <keep-alive>
          <div class="icon-view" @click="gotoAsk(1)">
            <div>
              <div>更快更多更优质回答</div>
              <div>查看更多<a href="javascript:;" @click.stop="webpage">专属权利</a></div>
            </div>
            <img-wrapper :url="icon2" classStyle="icon"></img-wrapper>
            <div class="name">悬赏提问</div>
          </div>
        </keep-alive>
      </div>
      <div class="close" @click="toggleAsk">X</div>
    </div>
    <div class="btn_ask" @click="handleChange(2)">
      <img-wrapper :url="tab2[1]" class="askicon"></img-wrapper>
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
        showAsk: false,
        style: {},
        notice_isread_num: 0,
        isreadShow: false,
        to_doc:{},
        role:0
      };
    },
    computed: {},
    updated() {
      this.isReadShow()

    },
    created() {
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
      getUserData(){
        this.doRequest(Constants.Method.profile, null, (result) => {
          this.collect_num = this.collect_num || this.data.collect_num
          // this.my_question = this.data.my_question_num
          // 有待优化 监听 ask页面我得问题数量的变化 1
          // EventBus.$on('my_question_num',content => {
          //   console.log('my_question_num:' +content)
          //   this.my_question = content || this.my_question
          // })
          window.localStorage.setItem('collect_num',this.collect_num)
          // console.log("==========collect_num====1111==========")
          // console.log(this.collect_num )
          // console.log("===========================")
        });
      },
      isReadShow() {
        this.notice_isread_num = window.localStorage.getItem("notice_isread_num")
        if (this.notice_isread_num > 0) {
          this.isreadShow = true
        }

        if (this.notice_isread_num === 0) {
          this.isreadShow = false
        }
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
  }

  .sub-page {
    flex-grow: 1;
    /*padding-bottom: px2rem(120);*/
  }

  .tabicon {
    width: 25px;
    height: 25px;
  }

  .btn_ask {
    position: fixed;
    width: 40px;
    bottom: 15px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    .askicon {
      width: 40px;
      height: 40px;
    }
  }

  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.79);
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 2;
    .btn-view {
      display: flex;
      flex-direction: row;

      .icon-view {
        display: flex;
        flex-direction: column;
        align-items: center;
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
    .close {
      position: absolute;
      bottom: 0;
      padding: px2rem(20) 0;
      width: 100%;
      font-size: px2rem(20);
      text-align: center;
      border-top: px2rem(1) solid $fontcolor_gray;
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

