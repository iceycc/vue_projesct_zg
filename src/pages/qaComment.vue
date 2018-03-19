<template>
  <div class="content">
    <app-bar :title="title"></app-bar>
    <div class="card shadow" v-if="answer">
      <div class="view1 horizontal-view">
        <img-wrapper :url="answer.a_avatar" classStyle="avatar"></img-wrapper>
        <div class="vertical-view">
          <div class="name">{{answer.aname}}
            <uz-lable v-if="answer.role" :role="answer.role"></uz-lable>
          </div>
          <div class="date">{{answer.atime}}</div>
        </div>
        <div class="horizontal-view">
          <div class="like" v-bind:class="answer.liked == 1 ? 'liked' : ''"
               @click.stop="like()">
            <img-wrapper :url="answer.liked == 1 ? icon4 : icon3 "
                         classStyle="icon"></img-wrapper>
            {{answer.like_num}}
          </div>
        </div>

      </div>
      <div class="context">{{answer.content}}</div>
      <div class="huifu">回复</div>

    </div>

    <div class="title">{{comments.length > 0 ? '全部回复' : '暂无回复'}}</div>
    <div class="scroll-view">
      <mu-list>
        <template v-for="item, index in comments">
          <div class="item" @click="onItemClick(index)">
            <div class="card card-re">
              <div class="view1 horizontal-view">
                <img-wrapper classStyle="avatar" :url="item.a_avatar"></img-wrapper>
                <div class="vertical-view">
                  <div class="name">{{item.aname}}
                  </div>
                  <div class="date">{{item.c_add_time}}</div>
                </div>
                <div class="horizontal-view">
                  <div class="like" v-bind:class="item.liked == 1 ? 'liked' : ''"
                       @click.stop="like(item)">
                    <img-wrapper :url="item.liked == 1 ? icon4 : icon3 "
                                 classStyle="icon"></img-wrapper>
                    {{item.like_num}}
                  </div>
                </div>
              </div>
              <div class="context">{{item.content}}</div>
              <div class="huifu">回复</div>
              <!--<div class="small-recomment">-->
                <!--<mu-text-field v-model="recomment" class="input" hintText="回复评论" :underlineShow="false"-->
                               <!--inputClass="text-field-content"></mu-text-field>-->
                <!--<doiv class="btn" @click="submit">发布</div>-->
              <!--</div>-->
            </div>
          </div>
        </template>
      </mu-list>
    </div>

    <div class="footer">
      <mu-text-field v-model="recomment" class="input" hintText="回复评论" :underlineShow="false"
                     inputClass="text-field-content"></mu-text-field>
      <div class="btn" @click="submit">发布</div>
    </div>
  </div>
</template>

<script>
  import {Constants, EventBus, mixins} from '../assets/js/index';

  import ComponentTemplate from "../components/template";
  import AutoListView from "../components/AutoListView";
  import MuAppbar from "../../node_modules/muse-ui/src/appBar/appBar.vue";
  import AppBar from "../components/AppBar.vue";
  import ImgWrapper from "../components/ImgWrapper.vue";
  import MuTextField from "../../node_modules/muse-ui/src/textField/textField.vue";
  import UzLable from "../components/uzLable.vue";

  export default {
    components: {
      UzLable,
      MuTextField,
      ImgWrapper,
      AppBar,
      AutoListView
    },
    mixins: [mixins.base, mixins.request],
    name: Constants.PageName.qaDetail,
    data() {
      return {
        icon1: require('../assets/img/icon_detail_response.svg'),
        icon2: require('../assets/img/icon_detail_ask.svg'),
        icon3: require('../assets/img/icon_detail_like.svg'),
        icon4: require('../assets/img/icon_detail_liked.svg'),
        uid: 0,
        answer: {},
        comments: [],
        recomment: ''
      };
    },
    computed: {},
    created() {
    },
    activated() {
      this.getData();
      this.getComment();
    },
    methods: {
      getData() {
        let data = {
          q_id: this.$route.query.q_id,
          a_id: this.$route.query.a_id,
        };

        this.doRequest(Constants.Method.get_answer, data, (result) => {
          this.answer = result[0];
          console.log(this.answer)
        });
      },
      getComment() {
        let data = {
          q_id: this.$route.query.q_id,
          a_id: this.$route.query.a_id,
        };

        this.doRequest(Constants.Method.get_comment_list, data, (result) => {
          this.comments = result;

          if (this.comments && this.comments.length > 0) {
            this.title = `${this.comments.length}条回复`;
          } else {
            this.title = `暂无回复`;
          }
        });
      },
      getRoleClass(role) {
        if (role == '金牌管家') {
          return 'role-guanjia';
        }
      },
      submit() {
        if (!this.recomment) {
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '内容不能为空'
          });
          return;
        }
        let data = {
          q_id: this.$route.query.q_id,
          a_id: this.$route.query.a_id,
          c_id: 0,
          content: this.recomment
        };
        this.doRequest(Constants.Method.comment, data, (result) => {
          this.getComment();
          this.recomment = '';
        });
      },
      like(comment) {
        let data = {
          q_id: this.$route.query.q_id,
          a_id: this.$route.query.a_id,
          c_id: comment ? comment.c_id : 0
        };
        this.doRequest(Constants.Method.like, data, (result) => {
          if (comment) {
            this.getComment();
          } else {
            this.getData();
          }
        });
      },
      collect() {
        console.log(collect);
      },
      accept(index) {
        let data = {
          q_id: this.$route.query.id,
          a_id: this.answer_list[index].id,
        };

        this.doRequest(Constants.Method.adoption, data, (result) => {
          console.log(result);
        });
      },
      onItemClick(index) {
        console.log(index);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/scss/px2rem";
  @import "../components/AutoListView";

  .content {
    background-color: $divider;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .avatar {
    width: px2rem(30);
    height: px2rem(30);
  }

  .card {
    background-color: white;
    width: 100%;
    padding: px2rem(10) px2rem(20);
    z-index: 1;
    .view1 {
      align-items: center;
      > div:nth-child(2) {
        flex-grow: 1;
        font-size: px2rem(14);
        margin-left: px2rem(10);
        color: $fontcolor_gray;
      }
      .name {
        color: #333;
      }
      .role {
        font-size: px2rem(12);
        padding: px2rem(2) px2rem(5);
        border-radius: px2rem(10);
        border: px2rem(1) solid #333;
      }
      .role-guanjia {
        border-color: rgb(255, 182, 0);
        color: rgb(255, 182, 0);
        background-color: rgb(254, 250, 229);
      }
      .date {
        font-size: px2rem(12);
      }
      .like {
        display: flex;
        flex-direction: row;
        color: $fontcolor_gray;
        .icon {
          width: px2rem(16);
          height: px2rem(16);
          margin-right: px2rem(5);
        }
      }
      .liked {
        color: $fontcolor_red;
      }
    }
    .context {
      padding: px2rem(10) 0;
    }
  }

  .title {
    margin-top: px2rem(10);
    background-color: white;
    color: $fontcolor;
    padding: px2rem(10) px2rem(20);
    border-bottom: px2rem(1) solid $divider;
  }

  .card-re {
    .context {
    }
  }

  .huifu {
    color: #666666;
    font-size: px2rem(14);
    text-align: right;
    padding-bottom: px2rem(5);
    border-bottom: px2rem(1) solid $divider;

  }

  .footer{
    width: 100%;
    font-size: px2rem(12);
    color: #333333;
    padding: px2rem(20) px2rem(15);
    background-color: white;
    border-top: px2rem(1) solid $fontcolor_gray;
    display: flex;
    flex-direction: row;
    align-items: center;
    .input {
      background-color: $divider;
      border-radius: px2rem(20);
      padding-left: px2rem(20);
      margin-bottom: 0;
      flex-grow: 1;
      min-height: px2rem(30);
    }
    .btn {
      background-color: $divider;
      border-radius: px2rem(5);
      padding: px2rem(10);
      margin-left: px2rem(10);
    }

  }
  .small-recomment{
    width: 100%;
    font-size: px2rem(12);
    color: #333333;
    padding: px2rem(5) px2rem(3);
    background-color: #616161;
    border-top: px2rem(1) solid $fontcolor_gray;
    display: flex;
    flex-direction: row;
    align-items: center;
    .input {
      background-color: $divider;
      border-radius: px2rem(20);
      padding-left: px2rem(20);
      margin-bottom: 0;
      flex-grow: 1;
      min-height: px2rem(30);
    }
    .btn {
      background-color: $divider;
      border-radius: px2rem(5);
      padding: px2rem(5) px2rem(5);
      margin-left: px2rem(10);
    }
  }
</style>
