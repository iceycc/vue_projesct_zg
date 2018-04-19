<template>
  <div class="content">
    <app-bar :title="title"></app-bar>
    <div class="card shadow" v-if="answer">
      <div class="view1 horizontal-view">
        <img-wrapper :url="answer.a_avatar" classStyle="avatar" @onClick="ifGoDetail(answer.uid,answer.role,answer.aname)"></img-wrapper>
        <div class="vertical-view">
          <div class="name" @click="ifGoDetail(answer.uid,answer.role,answer.aname)">{{answer.aname}}
            <uz-lable v-if="answer.role" :role="answer.role"></uz-lable>
          </div>
          <div class="date">{{answer.atime}}</div>
        </div>
        <div class="horizontal-view">
          <button class="like" v-bind:class="answer.is_liked == 1 ? 'liked' : ''"
                  @click.stop="like(answer.id,answer.is_liked,0)"
                  :disabled="disabled"
          >
            <img-wrapper :url="answer.is_liked == 1 ? icon4 : icon3 "
                         classStyle="icon"></img-wrapper>
            {{answer.like_num}}
          </button>
        </div>
      </div>
      <div class="context">{{answer.content}}</div>
      <div class="huifu" @click="onItemClick(answer.aname,0)">回复</div>

    </div>
    <div class="title">{{comments.length > 0 ? '全部回复' : '暂无回复'}}</div>
    <div class="scroll-view">
      <mu-list>
        <template v-for="item, index in comments">
          <div class="item">
            <div class="card card-re">
              <div class="view1 horizontal-view">

                <!--<img-wrapper classStyle="avatar" :url="item.a_avatar"></img-wrapper>-->
                <div class="vertical-view">
                  <div class="name huifu-name">
                    <!--如果是管家用户名 进入管家详情 但是管家不能访问管家-->
                    <span @click="ifGoDetail(item.from_user_id,item.role)">{{item.from_user}} </span>
                    <span class="huifu-text"> 回复 </span>
                    <span>{{item.to_user ? item.to_user + " ：": answer.aname + " ："}}</span>
                  </div>

                </div>
                <!--<div class="horizontal-view">-->
                <!--<div class="like" v-bind:class="item.is_liked == 1 ? 'liked' : ''"-->
                <!--@click.stop="like(item.a_id,item.is_liked,item.c_id)">-->
                <!--<img-wrapper :url="item.liked == 1 ? icon4 : icon3 "-->
                <!--classStyle="icon"></img-wrapper>-->
                <!--{{item.like_num}}-->
                <!--</div>-->
                <!--</div>-->
              </div>
              <div class="context">{{item.content}}</div>
              <div style="display: flex">
                <span class="left">{{item.addtime}}</span>
                <span class="right" @click="clickDel" v-if="item.from_user_id == my_uid">删除</span>
                <span class="right" @click="onItemClick(item.from_user,item.cid)">回复</span>
                <mu-dialog :open="dialog1" title="提示" @close="close">
                  确定要删除该条评论吗
                  <mu-flat-button slot="actions" @click="close" primary label="取消"/>
                  <mu-flat-button slot="actions" primary @click="delCommentHandle(item.cid)" label="确定"/>
                </mu-dialog>
              </div>
              <!--<div class="small-recomment">-->
              <!--<p class="recomment-p"-->
              <!--v-for="item,index in from_to"-->
              <!--:key="index">-->
              <!--<span>{{item.from_user}}</span>-->
              <!--回复-->
              <!--<span>{{item.to_user}}</span>-->
              <!--：<span>{{item.content}} <i></i></span>-->
              <!--<span class="recomment-p-huifu">回复11</span>-->
              <!--</p>-->
              <!--</div>-->
            </div>
          </div>
        </template>
      </mu-list>
    </div>

    <div class="footer" v-if="is_footer_show">
      <mu-text-field v-model="recomment" class="input" :hintText="to_who" :underlineShow="false"
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
        dialog1: false,
        icon1: require('../assets/img/icon_detail_response.svg'),
        icon2: require('../assets/img/icon_detail_ask.svg'),
        icon3: require('../assets/img/icon_detail_like.svg'),
        icon4: require('../assets/img/icon_detail_liked.svg'),
        uid: 0,
        my_uid:'',
        answer: {},
        comments: [],
        recomment: '',
        to_who: '回复评论',
        c_id: 0,
        is_footer_show: false,
        title: '',
        from_to: [
          {
            from_user_id: 1,
            from_user: '22',
            to_user_id: 2,
            to_user: '你',
            content: '哈哈哈哈哈'
          },
          {
            from_user_id: 1,
            from_user: '我顶顶顶顶',
            to_user_id: 2,
            to_user: '你',
            content: '哈哈哈哈哈'
          },
          {
            from_user_id: 2,
            from_user: '你',
            to_user_id: 2,
            to_user: '我2222',
            content: '哈哈哈哈哈'
          }
        ],
        disabled: false
      };
    },
    computed: {},
    created() {
      let my_uid = window.localStorage.getItem('uid')
      this.my_uid = my_uid

    },
    activated() {
      this.getData();
      this.getComment();
    },
    methods: {
      ifGoDetail(uid,role){
        // 这里通过判断返回的role是否时管是家 自己是管家的话点不开其他管家的详情 匿名用户不能打开 管家看管家也是显示匿名用户
        let my_role = window.localStorage.getItem('role')
        let my_uid = window.localStorage.getItem('uid')
        console.log(role == my_role);
        console.log(uid != my_uid);
        if(role == my_role && uid !== my_uid ){
          return
        }else{
          this.goGujian(uid,1)
        }
      },
      goGujian(uid,role){
        console.log(421)
        let uid_this = uid || window.localStorage.getItem('uid')
        let role_this = role || window.localStorage.getItem('role')
        if(role_this == 1){
          window.location.href = `http://m.uzhuang.com/mobile-m_butler_details.html?id=M%E7%AB%99-%E5%B7%A5%E5%9C%B0%E7%9B%B4%E6%92%AD&butlerid=${uid_this}`
        }else{
          return
        }
      },
      getData() {
        let data = {
          q_id: this.$route.query.q_id,
          a_id: this.$route.query.a_id,
          inform_id:this.$route.query.inform_id || 0
        };

        this.doRequest(Constants.Method.get_answer, data, (result) => {
          this.answer = result
          if(this.answer ==null){
            EventBus.$emit(Constants.EventBus.showToast,{message: '该条动态已被删除'})
            setTimeout(()=>{
              this.$router.go(-1)
            },1500)
          }
        });
      },
      getComment() {
        let data = {
          q_id: this.$route.query.q_id,
          a_id: this.$route.query.a_id,
          c_id: this.c_id,
          inform_id:this.$route.query.inform_id || 0
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

      },
      clickDel(){
        this.dialog1 = true
       // this.delCommentHandle(item.cid)
      },
      close () {
        this.dialog1 = false
      },
      delCommentHandle(cid){
        let data = {
          cid:cid
        }
        this.doRequest(Constants.Method.del_comment,data,(result) => {
          this.getComment()
          this.dialog1 = false
        })
      },
      onItemClick(name, c_id) {
        // console.log(name);
        this.is_footer_show = true
        this.c_id = c_id
        this.to_who = "回复 " + name + " 评论："
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
          c_id: this.c_id,
          content: this.recomment
        };
        console.log("~~~~~~~~~~~~~~~~~")
        // console.log(this.c_id)
        console.log("~~~~~~~~~~~~~~~~~")
        this.doRequest(Constants.Method.comment, data, (result) => {
          this.getComment();
          this.recomment = '';
          console.log("++++++++++++comment+++++++++++++");
          // console.log(result);
          this.is_footer_show = false
          console.log("++++++++++++++++++++++++++++++++");
        });
      },
      like(a_id, liked, c_id) {
        if (timer) {
          clearTimeout(timer)
        }
        this.disabled = true
        let timer;
        let data = {
          q_id: this.$route.query.q_id,
          a_id: a_id,
          c_id: c_id
        };
        switch (liked) {
          case 1:
            this.doRequest(Constants.Method.un_like, data, (result) => {
              if (c_id) {
                this.getComment();
              } else {
                this.getData();
              }
              timer = setTimeout(() => {
                this.disabled = false;
              }, 1000)
            });
            break;
          case 0:
            this.doRequest(Constants.Method.like, data, (result) => {
              if (c_id) {
                this.getComment();
              } else {
                this.getData();
              }
              timer = setTimeout(() => {
                this.disabled = false;
              }, 1000)
            });
        }

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
          console.log("========adoption============");
          // console.log(result);
          console.log("====================");
        });
      },

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
    margin-bottom: px2rem(10);
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
        font-size: px2rem(14);
        color: #666;
      }
      .huifu-name {
        font-size: px2rem(14);
        color: #25c3ff;
        .huifu-text {
          color: #ccc
        }
      }
      .role {
        font-size: px2rem(12);
        padding: px2rem(2) px2rem(5);
        border-radius: px2rem(10);
      }

      .date {
        font-size: px2rem(12);
      }
      .like {
        display: flex;
        flex-direction: row;
        color: $fontcolor_gray;
        background: transparent;
        border: none;
        outline: none;
        .icon {
          width: px2rem(16);
          height: px2rem(16);
          margin-right: px2rem(5);
        }
      }
      .liked {
        color: $fontcolor_red;
        .icon {
          color: $fontcolor_red;
        }
      }
    }
    .context {
      padding: px2rem(10) 0;
    }
  }

  .title {
    background-color: white;
    color: $fontcolor;
    padding: px2rem(10) px2rem(20);
    border-bottom: px2rem(1) solid $divider;
  }

  .card-re {
    .context {
      padding: px2rem(8);
      background: #f6f6f6;
      border-radius: px2rem(8);
    }
    .left {
      flex: 4;
      margin-top: px2rem(6);
      padding-top: px2rem(2);
      text-align: left;
      font-size: px2rem(12);
      color: #ccc
    }
    .right {
      margin-left: px2rem(10);
      text-align: right;
      font-size: px2rem(14);
      color: #aaa;
      margin-top: px2rem(6);
      padding: px2rem(1) px2rem(4);
      border-radius: px2rem(5);
    }
  }

  .huifu {
    color: #aaa;
    font-size: px2rem(14);
    text-align: right;
    line-height: px2rem(25);
    padding-bottom: px2rem(5);
    border-bottom: px2rem(1) solid $divider;

  }

  .footer {
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

  .small-recomment {
    width: 100%;
    font-size: px2rem(12);
    color: #333;
    padding: px2rem(2) px2rem(3);
    background-color: #eee;

  }


</style>
