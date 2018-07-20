<template>
  <div class="content">
    <app-bar :title="title"></app-bar>
    <div class="form">
      <textarea v-model="qa.content" placeholder="回答问题将获得积分奖励" rows="6" class="textarea" autofocus="autofocus980-"/>
      <!--<upload-view @upload="chooseImage" @remove="remove" :localIds="localIds"></upload-view>-->
    </div>

    <div class="btn-submit" @click.stop="submit(is_edit)">发布
    </div>
  </div>
</template>

<script>
  import {Constants, EventBus, mixins, API} from '../../config/index';

  import UploadView from "../../components/UploadView";
  import AppBar from "../../components/commons/AppBar.vue";

  export default {
    components: {
      AppBar,
      UploadView
    },
    mixins: [mixins.base, mixins.wx],
    name: Constants.PageName.qaIndex,
    data() {
      return {
        content: '',
        qa: {
          content: '',
        },
        localIds: [],
        localIdIndex: 0,
        serverIds: [],
        is_edit: []
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

    },
    activated() {
      this.qa.content=''
      this.is_edit = this.$route.params.is_edit || false // 判断是编辑还是添加
        this.pre_content = this.$route.query.content
      if (this.is_edit) {
        this.qa.content = this.$route.params.content
      }
      if(this.pre_content){
          this.qa.content = this.$route.query.content

      }
    },
    methods: {
      toggleMask() {
        this.showMask = !this.showMask;
      },
      submit(is_edit) {

      if (!this.qa.content) {
          EventBus.$emit(Constants.EventBus.showToast, {
              message: '内容不能为空'
          });
          return;
      }
      if (is_edit) {
          let data = this.$route.params.data
          // console.log(data)
          data.content = this.qa.content

          // .concat({content:this.qa.content})
          API.post(Constants.Method.put_answer_edit, data)
              .then((result) => {
                  // console.log(result);
                  this.$router.go(-1)
              })
              .catch((err) => {
                  // console.log(err);
              })


          return
      }
      let data = {
          id: this.$route.query.id,
          content: this.qa.content,

      };

      API.post(Constants.Method.answer, data)
          .then((result) => {
              this.qa.content = '';
              // console.log(result)
              if (result.code && result.code == 1) {
                  // 不用看了这里没作用的 哈哈
                  EventBus.$emit(Constants.EventBus.showToast, {
                      message: '你已经回答过了吆111！'
                  });
              } else {
                  EventBus.$emit(Constants.EventBus.showToast, {
                      message: '发布成功'
                  });
              }
              setTimeout(() => {
                  this.$router.go(-1);
              }, 2000);
          })
          .catch((err) => {
              // console.log(err);
          });
  },
      chooseImage() {
        let that = this;
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            that.localIds = that.localIds.concat(res.localIds);
          }
        });
      },
      remove(localId) {
        this.localIds.splice(this.localIds.indexOf(localId), 1);
      },
      upload(callback) {
        if (this.localIds && this.localIds.length > 0) {
          if (this.localIds.length === this.localIdIndex) {
            callback && callback();
            // // console.log(this.serverIds);
            this.localIdIndex = 0;
            return;
          }

          let that = this;
          wx.uploadImage({
            localId: this.localIds[that.localIdIndex++], // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
              that.serverIds.push(res.serverId);
              that.upload(callback);
            }
          });
        } else {
          callback && callback();
        }
      }
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
      padding: 0 px2rem(5);
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
  .textarea{
    border: none;
    width: 100%;
    height: 100%;
  }

</style>
