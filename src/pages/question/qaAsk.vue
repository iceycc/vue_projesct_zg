<template>
  <div class="content">
    <!--<app-bar :title="title"></app-bar>-->
    <mu-appbar :title="title" v-if="showAppBar">
      <mu-icon-button icon="arrow_back" slot="left" @click="goBack"></mu-icon-button>
    </mu-appbar>
    <div class="form">
      <input class="field_title" v-model="qa.title" placeholder="请输入标题（5~150字）"/>

      <div class="line"></div>

      <mu-text-field class="field_textarea" fullWidth :underlineShow="false" v-model="qa.content"
                     hintText="请描述您的问题（非必填）" fullWidth
                     multiLine :rows="6"/>

      <upload-view @upload="chooseImage" @remove="remove" :localIds="localIds"></upload-view>

    </div>

    <div class="btn-submit" @click="submit">{{(watch_type == 1 ? '支付¥' + parseFloat(watch_qa.reward).toFixed(2) : '') +
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
        <div>1.提问将在工作时间2h之内必回答</div>
        <div>2.至少1个金牌管家参与回答</div>
      </div>

      <div class="btn" @click="toggleMask">去提问</div>
      <div class="tip4">付费提问前请阅读<a href="javascript:;" @click.stop="goDoc" class="answer_text"> 提问须知</a></div>
    </div>
  </div>

</template>

<script>

  import {Constants, EventBus, mixins, API} from '../../config/index';

  import AppBar from "../../components/commons/AppBar.vue";
  import MuDivider from "../../../node_modules/muse-ui/src/divider/divider.vue";
  import VueSliderComponent from "../../../node_modules/vue-slider-component/src/vue2-slider.vue";
  import UploadView from "../../components/UploadView";

  const img_max = 9
  export default {
    components: {
      UploadView,
      VueSliderComponent,
      MuDivider,
      AppBar,
    },
    // 混入对象
    mixins: [mixins.base, mixins.wx],
    name: Constants.PageName.qaIndex,
    data() {
      return {
        type: 0,//1付费
        qa: {
          title: '',
          content: '',
          reward: 5,
        },
        localIds: [],//需要上传的ID
        localIdIndex: 0,
        serverIds: [],//返回图片的服务器端ID
        showMask: false,
        last_num: img_max,
        current_uid: null,
        is_wallet: false,
        money_sum: 0
      };
    },

    computed: {
      watch_qa(){
        return this.qa
      },
      watch_type(){
        return this.type
      },
      slider() {
        let height = 40;
        let size = 60;
        return {
          showAppBar: true,
          total_img: 9,
          insert_id: '',
          direction: "horizontal",
          width: "100%",// 组件宽度
          height: height,
          min: 1,
          max: 10,
          sliderStyle: {
            "backgroundImage": 'url(' + require('../../assets/img/icon_slider.png') + ')',
            "background-position": "center",
            "background-size": "cover",
            "background-color": "RGBA(1,1,1,0.1)",
            "width": size + "px",
            "height": size + "px",
            "top": (height - size) / 2 + "px",
            "left": -10 + "px",
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
      // console.log(this.$route.query)
      this.initWX(() => {
        this.fenXiang({
          title:'诸葛装修，全方位解决您的装修问题',
          imgUrl:'http://image1.uzhuang.com/zhuge-logo.png'
        },function () {
          // console.log('fenXiang');
        })
        // console.log('wx success');
      });


      this.type = this.$route.query.type;

      this.current_uid = window.localStorage.getItem(Constants.LocalStorage.uid) || null
      /**
       * 如果是微信内,则不显示appBar
       * @type {boolean}
       */
      this.showAppBar = !/MicroMessenger/.test(navigator.userAgent);
    },
    activated() {  // 组件激活时
      // 清除数据
      this.qa = {
        title: '',
        content: '',
        reward: 5,
      }
      this.localIds = []
      this.serverIds =[]
      this.type = this.$route.query.type || 0;
      // console.log('ask type')
      // 判断下是 钱包明细来的 还是 提问悬赏来的
      if (this.type == 1) {
        this.title = '悬赏提问';
        window.document.title = '悬赏提问';//修改网页标题
        this.showMask = true;
        // // console.log(this.goBack)
        // if (this.showMask && this.title == '悬赏提问' && this.goBack) {
        //   // todo 难题
        //   // console.log("给浏览器自带按钮返回注册事件")
        //   // this.lisBack()
        // }
      }
      if (this.type == 0) {
        this.title = '免费提问';
        window.document.title = '免费提问';
        this.showMask = false;
      }

    },
    methods: {
      goBack() {
        if (this.title == '免费提问' || this.showMask || this.title == '提问') {
          this.$router.go(-1)
        }
        if (!this.showMask && this.title == '悬赏提问') {
          this.showMask = true
        }
      },
      goDoc() {
        this.$router.push({name: Constants.PageName.qaDoc, params: {type: 3}})
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
      submit: function () {
        // console.log(this.type)
        // console.log(this.qa)
        // 判断是否是从钱包详情页过来的
        // console.log('this.$route.query')
        // console.log(this.$route.query)

        if (this.$route.query) {
          this.is_wallet = this.$route.query.is_wallet || false//是否是钱包支付。
          this.money_sum = this.$route.query.money_sum || 0//钱包零钱总数
        }
        this.qa.title = this.qa.title.replace(/^\s+|\s+$/g, "");
        if (!this.qa.title) {
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '标题不能为空'
          });
          return;
        }
        if (this.qa.title.length > 150 || this.qa.title.length < 5) {
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '标题字数请输入5~150字'
          });
          return;
        }
        if (this.qa.content.length > 1000) {
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '标题长度不能大于1000个字符'
          });
          return;
        }
        // console.log('this.is_wallet');
        // console.log(this.is_wallet);
        // console.log(this.money_sum);
        if (this.money_sum && this.qa.reward > this.money_sum) {
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '您的钱包余额不足'
          });
          return;
        }
        this.upload(() => {
          let data = {
            title: this.qa.title,
            content: this.qa.content,
            attach: this.serverIds || [],
            reward: this.qa.reward,
            pay_type: 0
          };

          // 免费支付：    reward = 0   pay_type = 0
          if (this.type === 0) {
            data.reward = 0;
            data.pay_type = 0
          }
          // 付费 微信支付： reward >0  pay_type = 1
          if (this.type === 1 && !this.is_wallet) {
            data.reward = this.qa.reward * 100;
            data.pay_type = 1

          }
          // 付费 钱包支付： reward >0  pay_type = 0
          if (this.type === 1 && this.is_wallet) {
            data.reward = this.qa.reward * 100;
            data.pay_type = 0
          }
          this.doPostDateHandle(data)
          return
        });
      },
      doPostDateHandle(data) {
        // console.log('is_wallet:'+ this.is_wallet);
        API.post(Constants.Method.ask_question, data)
          .then((result) => {
            result = result.data
            this.insert_id = result.id
            // 回答成功后的操作
            var successHandle = (type) => {
              EventBus.$emit(Constants.EventBus.showToast, {
                message: '发布成功',
              });
              this.qa.title = '';
              this.qa.content = '';
              this.qa.reward = 5;
              this.localIds = [];
              this.serverIds = [];
              //  获取问题id

              setTimeout(() => {
                let is_redirect = window.localStorage.getItem('is_redirect')
                // 外链定向来的或者悬赏付费来的
                if(is_redirect == 1) {
                  this.pushPage({
                    name: Constants.PageName.qaIndex,
                  });
                  window.localStorage.setItem('is_redirect',0)
                }
                else if(type == 'card_pay'){
                  this.pushPage({
                    name: Constants.PageName.qaQuestion,
                  });
                }
                else {
                  this.pushPage({
                    name: Constants.PageName.qaDetail,
                    query: {
                      id: this.insert_id,
                      go_home: true
                    }
                  });
                }
              }, 2000);
            }
            // 如果是付费回答 银行卡或者微信支付
            if (data.reward > 0 && !this.is_wallet) {
              // console.log('银行卡支付')

              let options = {
                question_id: this.insert_id,
                reward: data.reward,

              }
              var _this = this
              API.post(Constants.Method.wxpay, options)
                .then((result) => {
                  let option = JSON.parse(result.data)
                  wx.chooseWXPay({
                    timestamp: option.timestamp,
                    nonceStr: option.nonceStr,
                    package: option.package,
                    signType: option.signType,
                    paySign: option.paySign, // 支付签名
                    success(res) {
                      // 支付成功后的回调函数
                      // 支付成功后
                      successHandle('card_pay')
                      // API.get('http://zhuge.uzhuang.com/index.php?r=question-tmp/info',{params:{id:options.question_id}})
                      //   .then((res)=>{
                      //     let id = res.data.id
                      //
                      //   })
                    }
                  });
                })
                .catch((err) => {
                  // console.log(err);
                })
            } else {
              successHandle()
            }


          })
          .catch((err) => {
            // console.log(err);
          });
      },
      chooseImage() {
        // 获取当前的
        let pic_num = this.localIds.length;
        if (pic_num > img_max) {
          EventBus.$emit(Constants.EventBus.showToast, {
            message: `只能选择${img_max}张图片`,
          });
          return;
        }
        // 剩余的
        this.last_num = img_max - pic_num;
        if(this.last_num<=0){
          EventBus.$emit(Constants.EventBus.showToast,{
            message:'您只能上传9张图片'
          })
          return
        }
        // todo 测试选择图片数量的啊
        // console.log(this.last_num)
        let that = this;
        wx.chooseImage({
          count: this.last_num, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            that.localIds = that.localIds.concat(res.localIds);
          }
        });
      },
      previewImage() {
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
              window.localStorage.setItem("wx_img", res.serverId)
              // // console.log(that.serverIds)
              that.upload(callback);
            }
          });
        } else {
          callback && callback();
        }
      }
    },
    deactivated() {  //success 组件停用时调用！！！
      this.type = 1  //
      // console.log('组件停用')

    },

    beforeRouteLeave(to, from, next) {

      // todo 这里不是很合理  离开组件时 添加自己的问题数
      API.post(Constants.Method.profile, {})
        .then((result) => {
          EventBus.$emit('my_question_num', result.question_num)
        })
        .catch((err) => {
          // console.log(err);
        });
      next()
    },
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

  .slider {
    padding: 0 px2rem(25) !important;

    box-sizing: border-box;

  }

  .form {
    background-color: white;
    padding: px2rem(10);
    margin: px2rem(10);

    .line {
      height: px2rem(1);
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
    background-color: rgba(255, 255, 255, 0.98);
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

  .answer_text {
    color: #000;
    text-decoration: underline;
  }

  .field_textarea {
    font-size: px2rem(13) !important;
  }

  .field_title {
    -webkit-appearance: none;
    border: none;
    width: 100%;
    height: px2rem(40);
    font-size: px2rem(15);
  }
</style>
