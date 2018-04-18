<template>
  <div class="content">
    <!--<app-bar :title="title"></app-bar>-->
    <mu-appbar :title="title" v-if="showAppBar">
      <mu-icon-button icon="arrow_back" slot="left" @click="goBack"></mu-icon-button>
      <!--<template slot="right" v-if="this.mode !== 'test'">-->
      <!--&lt;!&ndash;<mu-icon-button v-if="showSearch" icon="search" slot="right" @click="goSearch"></mu-icon-button>&ndash;&gt;-->
      <!--<slot name="right"></slot>-->
      <!--</template>-->
    </mu-appbar>
    <div class="form">
      <mu-text-field fullWidth :underlineShow="false" v-model="qa.title" hintText="请输入标题 5~150字"/>

      <div class="line"></div>

      <mu-text-field fullWidth :underlineShow="false" v-model="qa.content" hintText="请描述您的问题（非必填）" fullWidth
                     multiLine :rows="6"/>

      <upload-view @upload="chooseImage" @remove="remove" :localIds="localIds"></upload-view>

    </div>

    <div class="btn-submit" @click="submit">{{(type === 1 ? '支付¥' + parseFloat(qa.reward).toFixed(2) : '') +
      '进行提问'}}
    </div>

    <div class="mask" v-if="showMask">
      <div class="tip1">您已选择 <span class="money">{{qa.reward}}</span>元问题赏金</div>

      <div class="slider" v-if="slider">
        <vue-slider-component
          v-model="qa.reward"
          :direction="slider.direction"
          :height="slider.height"
          :min="slider.min"
          :max="slider.max"
          :tooltip="false"
          :processStyle="slider.processStyle"
          :sliderStyle="slider.sliderStyle"
          :bgStyle="slider.bgStyle"
        ></vue-slider-component>
      </div>
      <div class="tip2">
        <div>{{slider.min}}元</div>
        <div>{{slider.max}}元</div>
      </div>
      <div class="tip3">
        <div>使用付费服务您将获得</div>
        <div>1.至少1个金牌管家参与回答</div>
        <div>2.提问2h之内必回答</div>
      </div>

      <div class="btn" @click="toggleMask">去提问</div>
      <div class="tip4">付费提问前请阅读<a href="javascript:;" @click.stop="goDoc" class="answer_text"> 提问须知</a></div>
    </div>
  </div>

</template>

<script>

  import {Constants, EventBus, mixins} from '../assets/js/index';

  import AppBar from "../components/AppBar.vue";
  import MuDivider from "../../node_modules/muse-ui/src/divider/divider.vue";
  import VueSliderComponent from "../../node_modules/vue-slider-component/src/vue2-slider.vue";
  import UploadView from "../components/UploadView";

  export default {
    components: {
      UploadView,
      VueSliderComponent,
      MuDivider,
      AppBar,
    },
    // 混入对象
    mixins: [mixins.base, mixins.request],
    name: Constants.PageName.qaIndex,
    data() {
      return {
        type: 0,//1付费
        qa: {
          title: '',
          content: '',
          reward: 5,
        },
        localIds: [],
        localIdIndex: 0,
        serverIds: [],
        showMask: false
      };
    },
    computed: {
      slider() {
        let height = 40;
        let size = 60;
        return {
          showAppBar:true,
          total_img:9,
          insert_id:'',
          direction: "horizontal",
          width: "100%",// 组件宽度
          height: height,
          min: 1,
          max: 10,
          sliderStyle: {
            "backgroundImage": 'url(' + require('../assets/img/icon_slider.png') + ')',
            "background-position": "center",
            "background-size": "cover",
            "width": size + "px",
            "height": size + "px",
            "top": (height - size) / 2 + "px",
            "left": 0 + "px",
          },
          processStyle: {
            "backgroundImage": "linear-gradient(to top, #11cdcd, #12ddca)",
            "border-radius": height / 2 + "px",
          },
          bgStyle: {
            "border-radius": height / 2 + "px",
          },
        };
      }
    },
    created() {
      this.initWX(() => {
        console.log('wx success');
      });

      console.log('ask')
      /**
       * 如果是微信内,则不显示appBar
       * @type {boolean}
       */
      this.showAppBar = !/MicroMessenger/.test(navigator.userAgent);
    },
    activated() {  // 组件激活时

      if (this.$route.params && this.$route.params.type) {
        this.type = this.$route.params.type;
      }
      console.log(this.type);
      if (this.type === 1) {
        this.title = '悬赏提问';
        window.document.title = '悬赏提问';//修改网页标题
        this.showMask = true;
        console.log(!this.showMask)
        console.log(this.title)
        // console.log(this.goBack)
        if(this.showMask && this.title =='悬赏提问' && this.goBack){
          // todo 难题
          console.log("给浏览器自带按钮返回注册事件")
          // this.lisBack()
        }
      }
      if(this.type === 0) {
        this.title = '免费提问';
        window.document.title = '免费提问';
        this.showMask = false;
      }

    },
    methods: {
      lisBack(){
        // 监听 浏览器返回
        pushHistory();
        var _this = this
        window.addEventListener("popstate", function(e) {
          _this.goBack && _this.goBack()
          console.log('goBack')
          if(window.event){
            //IE中阻止函数器默认动作的方式
            window.event.returnValue = false;
          }
          else{
            //阻止默认浏览器动作(W3C)
            e.preventDefault();
          }

        }, false);
        function pushHistory() {
          var state = {
            title: "title",
            url: "#"
          };
          window.history.pushState(state, "title", "#");
        }
      },
      goBack(){
        console.log(11)
        if(this.title == '免费提问' || this.showMask ){
          this.$router.go(-1)
        }
        if(!this.showMask && this.title == '悬赏提问'){
          this.showMask =true
        }

      },
      goDoc(){
        this.$router.push({name:Constants.PageName.qaDoc,params:{type:3}})
      },
      toggleMask() {
        this.showMask = !this.showMask;
      },
      onItemClick(item) {
        this.pushPage({
          name: Constants.PageName.qaDetail,
          query: {
            id: item.id
          }
        });
      },
      submit: function() {
        // 去除前后空格
        this.qa.title=this.qa.title.replace(/^\s+|\s+$/g,"");
        if (!this.qa.title) {
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '标题不能为空'
          });
          return;
        }
        if(this.qa.title.length >150 ||this.qa.title.length < 5){
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '标题字数请输入5~150字'
          });
          return;
        }
        if(this.qa.content.length > 1000){
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '标题长度不能大于1000个字符'
          });
          return;
        }
        this.upload(() => {
          let data = {
            title: this.qa.title,
            content: this.qa.content,
            attach: this.serverIds
          };
          if (this.type === 0) {
            data.reward = 0;
          } else {
            data.reward = this.qa.reward;
          }
          this.doRequest(Constants.Method.ask_question, data, (result) => {
            EventBus.$emit(Constants.EventBus.showToast, {
              message: '发布成功',
            });
            this.insert_id=result.insert_id

            if (data.reward > 0) {//付费问题  微信支付改怎么办呢

             window.location.href = `http://m.uzhuang.com/wxpay/pay/Weixin/h5_wx/example/jsapi.php?question_id=${result.insert_id}&pay_type=h5_wx&uid=${localStorage.getItem('uid')}`;
              // this.doRequestGet(Constants.Method.wxpay, {
              //     question_id: result.insert_id,
              //     pay_type: 'h5_wx',
              //   uid:localStorage.getItem('uid')
              // }, (result) => {
              //     console.log(result);
              //     // wx.chooseWXPay({
              //     //     timestamp: result.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              //     //     nonceStr: result.nonceStr, // 支付签名随机串，不长于 32 位
              //     //     package: 'prepay_id=' + result.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              //     //     signType: result.sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              //     //     paySign: result.sign, // 支付签名
              //     //     success: function (res) {
              //     //         console.log(res.err_msg);
              //     //     },
              //     //     error: function (err) {
              //     //         console.log(err);
              //     //     }
              //     // });
              // });
            }

            this.qa.title = '';
            this.qa.content = '';
            this.qa.reward = 5;
            this.localIds = [];
            this.serverIds = [];
            //  获取问题id
            setTimeout(() => {
              this.pushPage({
                name: Constants.PageName.qaDetail,
                query: {
                  id: this.insert_id,
                  go_home:true
                }
              });
            }, 2000);

          });
        });
      },
      chooseImage() {
        // 获取当前的
        let pic_num = this.localIds.length;
        if(pic_num > 9){
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '只能选择9张图片',
          });
          return;
        }
        let last_num = 9 - pic_num;
        // todo 测试选择图片数量的啊
        console.log(last_num)
        let that = this;
        wx.chooseImage({
          count: last_num, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            that.localIds = that.localIds.concat(res.localIds);
          }
        });
        },
      previewImage(){
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [] // 需要预览的图片http链接列表
        });
      },
      remove(localId) {
        this.localIds.splice(this.localIds.indexOf(localId), 1);
      },
      upload(callback) {
        if (this.localIds && this.localIds.length > 0) {
          if (this.localIds.length === this.localIdIndex) {
            callback && callback();
            this.localIdIndex = 0;
            return;
          }

          let that = this;
          wx.uploadImage({
            localId: this.localIds[that.localIdIndex++], // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
              that.serverIds.push(res.serverId);
              window.localStorage.setItem("wx_img",res.serverId)
              // console.log(that.serverIds)
              that.upload(callback);
            }
          });
        } else {
          callback && callback();
        }
      }
    },
    deactivated(){  //success 组件停用时调用！！！
      this.type=0  //
      console.log('组件停用')
      // 清除数据
      this.qa = {
        title: '',
        content: '',
        reward: 5,
      }
    },
    // activated(){
    //   console.log('组件激活')
    // },
    // beforeEach(){
    //   console.log('离开组件')
    //   this.type=0  //
    // },
    beforeRouteLeave(to, from, next){

      // todo 这里不是很合理  离开组件时 添加自己的问题数
      this.doRequest(Constants.Method.profile, null, (result) => {
        EventBus.$emit('my_question_num',result.my_question_num)
      });
      next()
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/scss/px2rem";

  .content {
    background-color: $divider;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .slider{
    padding:0 px2rem(25) !important;

    box-sizing: border-box;

  }
  .form {
    background-color: white;
    padding: px2rem(10);
    margin: px2rem(10);

    .line {
      height: px2rem(2);
      background-color: $divider;
      margin-bottom: px2rem(20);
    }
  }

  .btn-submit {
    text-align: center;
    color: white;
    background-image: $bgImage;
    border-radius: px2rem(3);
    //background-color: #11cdcd;
    margin: px2rem(40) px2rem(20) 0 px2rem(20);
    padding: px2rem(10);
    font-size: px2rem(16);
    font-weight: bold;
  }

  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 1);
    position: absolute;
    display: flex;
    flex-direction: column;
    padding: px2rem(100) px2rem(30) 0 px2rem(30);

    .tip1 {
      font-size: px2rem(16);
      text-align: center;
      margin-bottom: px2rem(50);
    }

    .money {
      color: $mainColor;
      font-size: px2rem(40);
    }

    .tip2 {
      font-size: px2rem(16);
      text-align: center;
      margin-bottom: px2rem(30);
      color: $mainColor;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: px2rem(10);
      padding: 0 px2rem(25);
    }
    .tip3 {
      text-align: center;
      color: $fontcolor_gray;

      & > div:nth-child(1) {
        color: #333;
      }
    }
    .btn {
      color: $mainColor;
      border: px2rem(1) solid $mainColor;
      text-align: center;
      font-size: px2rem(20);
      padding: px2rem(8);
      margin-top: px2rem(100);
    }
    .tip4 {
      text-align: center;
      margin-top: px2rem(20);
    }
  }
  .answer_text{
    color: #000;
    text-decoration: underline;
  }

</style>
