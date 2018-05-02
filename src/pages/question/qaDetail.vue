<template>
  <div class="content">
    <!--标题 问题详情-->
    <mu-appbar title="问答详情" v-if="showAppBar">
      <mu-icon-button icon="arrow_back" slot="left" @click="goBack"></mu-icon-button>

    </mu-appbar>

    <!--顶部问题详情-->
    <div class="card" v-if="question">
      <!--用户头像 名称 赏金-->
      <div class="view1">
        <img-wrapper :url="question.asker_avatar" classStyle="avatar"
                     @onClick="ifGoDetail(question.uid,unll,null)"></img-wrapper>
        <div class="username">{{question.asker_name}}</div>
        <span class="reward shadow"
              v-if="parseFloat(question.reward) > 0">¥{{question.reward}}</span>
      </div>
      <!--问题标题-->
      <div class="card-title">{{question.title}}</div>

      </div>
    <div class="scroll-view">
      <mu-list>
      <div class="card shadow" v-if="question">
      <!--==========================================================================================================-->
      <!--问题描述-->
      <div class="card-content">{{question.content}}
        <!--图片展示-->
        <div class="card-img" v-if="question.attach && question.attach.length !==0 ">
          <div v-for="item,index in question.attach" :key="index" v-if=" item != ''" class="cc-img">
            <img :src="item" alt="" @click="showBigImg(item,question.attach)">
          </div>

        </div>
      </div>
      <!--展示 浏览数 回答数 收藏 时间-->
      <div class="view2">
        <div>{{question.pv}}浏览</div>
        <div>{{question.answer_num}}回答</div>
        <!--收藏 -->

        <button @click.stop="collect" class="collect-icon" :class="question.is_collect == '1' ? 'collected' : 'collect'"
                :disabled="disabled"
                style="border: none;background: transparent;outline:none">
          <!--<img-wrapper :url="question.is_collect ?  icon5 : icon6 " classStyle="icon"></img-wrapper>-->
          {{question.is_collect == '1' ? '已收藏': '收藏'}}
        </button>

        <div>{{ question.qtime | my_time }}</div>
      </div>
      <div class="card-tags" v-if="question.tab && question.tab.length > 0">
        <div class="tag" v-for="item in question.tab" v-if="question.tab[0] !==''">
          {{item}}
        </div>
      </div>

    </div>
    <!--评论列表-->

        <template v-for="item, index in answer_list">
          <div class="item" @click="onItemClick(index)">
            <div class="card-re">
              <!--评论 人 头像 名称 用户等级 是否采纳 11-->
              <div class="view1 horizontal-view">
                <img-wrapper
                    :url="item.a_avatar == 'http://m.uzhuang.com/res/images/userface.png' ? a_avatar : item.answerer_avatar "
                    classStyle="avatar"
                    @onClick="ifGoDetail(item.answerer_id,item.answerer_role,item.answerer_name)"
                ></img-wrapper>

                <div class="vertical-view">
                  <div class="name" @click.stop="ifGoDetail(item.answerer_id,item.answerer_role,item.answerer_name)">{{item.answerer_name ? item.answerer_name :
                    '匿名用户'}}
                    <!--显示颜色从组件内根据角色名匹配的-->
                    <uz-lable v-if="question.q_reward > 0"
                              :role="item.answerer_id === question.asker_id ? '赏金发起人' : item.answerer_rank"></uz-lable>
                    <uz-lable v-else :role="item.answerer_id ===question.asker_id ? '问题发起人' : item.answerer_rank"></uz-lable>
                  </div>
                  <div class="date">{{item.addtime | crtTime}}</div>
                </div>
                <!--采纳@click.once.stop="accept(index)"   && item.uid !== question.uid-->
                <!--todo 当前问题采纳的回答的 id -->
                <div class="accept" v-if="isOwner && item.adoption == 0 && item.answerer_id !== question.asker_id"
                     @click.stop="open(index)">采纳
                </div>

                <div class="accepted" v-if="question.q_adoption ==item.id"><img src="../../assets/img/accepted@2x.png"
                                                                                alt=""></div>
                <div class="get_reward" v-if="question.q_adoption ==item.id && question.q_reward > 0"><img
                    src="../../assets/img/get_reward.png" alt=""></div>
              </div>
              <!--评论内容-->
              <div class="context">{{item.content}}</div>
              <!--获取评论下的评论 -->
              <div v-if="item.hot_commnet.commenter_name" class="hotcomment">
                <div class="title">{{item.hot_commnet.commenter_name}}
                  <uz-lable v-if="question.q_reward > 0"
                            :role="item.hot_commnet.commenter_id === question.asker_id ? '赏金发起人' : item.commenter_rank"></uz-lable>
                  <uz-lable v-else :role="item.hot_commnet.commenter_id === question.asker_id ? '问题发起人' : item.commenter_rank"></uz-lable>
                  :{{item.hot_commnet.content}}
                </div>
                <div class="count">查看全部{{item.hot_commnet.total}}条回复</div>
              </div>
              <!--底部信息展示-->
              <div class="view2 horizontal-view">
                <!--编辑功能-->
                <button class="like"
                        @click.stop="editHandle(item.id)"
                        style="border: none;background: transparent;outline: none"
                        :disabled="disabled"
                        v-if="current_uid == item.answerer_id"
                >
                  <img-wrapper :url="icon_edit"
                               classStyle="icon"></img-wrapper>
                  编辑
                </button>
                <!--点赞功能-->
                <button class="like" v-bind:class="item.is_like == 1 ? 'liked' : ''"
                        @click.stop="like(index,item.is_like)"
                        style="border: none;background: transparent;outline: none"
                        :disabled="disabled"
                >
                  <img-wrapper :url="item.is_like == 1 ? icon4 : icon3 "
                               classStyle="icon"></img-wrapper>
                  {{item.laud}}

                </button>
                <div @click.stop="clickDel(item.id)" v-if="item.answerer_id == current_uid && question.q_adoption !=item.answerer_id"> 删除
                </div>
                <mu-dialog :open="dialog2" title="提示" @close="close">
                  确定要删除该条回答吗
                  <mu-flat-button slot="actions" @click="close" primary label="取消"/>
                  <mu-flat-button slot="actions" primary @click="deleteHandle" label="确定"/>
                </mu-dialog>

              </div>
            </div>
          </div>
        </template>
      </mu-list>
    </div>

    <div class="footer horizontal-view">
      <div @click="gotoResponse">
        <img-wrapper :url="icon1" classStyle="icon"></img-wrapper>
        去回答
      </div>
      <div @click="gotoAsk1" v-if="role ==0 ">
        <img-wrapper :url="icon2" classStyle="icon"></img-wrapper>
        去提问
      </div>
    </div>
    <mu-dialog :open="dialog" title="提示" @close="close">
      确定采纳该回答吗？
      <mu-flat-button slot="actions" @click="close" primary label="取消"/>
      <mu-flat-button slot="actions" primary @click="accept()" label="确定"/>
    </mu-dialog>


    <div class="mask" v-if="showAsk">
      <div class="btn-view">
        <keep-alive>
          <div class="icon-view">
            <div style="visibility: hidden" class="msg-infos">
              <div>更快更多更优质回答</div>
              <div>查看更多<a href="">专属权利</a></div>
            </div>
            <div @click="gotoAsk(0)">
              <img-wrapper :url="icon_a" classStyle="icon"></img-wrapper>
              <div class="name">免费提问</div>
            </div>
          </div>
        </keep-alive>
        <keep-alive>
          <div class="icon-view">
            <div style="visibility: hidden" class="msg-infos">
              <div>更快更多更优质回答</div>
              <div>查看更多<a href="javascript:;" @click.stop="webpage" style="text-decoration: underline;color:#328afb">专属权利</a>
              </div>
            </div>
            <div @click="gotoAsk(1)">
              <img-wrapper :url="icon_b" classStyle="icon"></img-wrapper>
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
  // import {Constants, mixins, util} from '../assets/js/index';
  import {EventBus, API,Constants,mixins,util} from '../../config/index'

  import ComponentTemplate from "../../components/template";
  import AutoListView from "../../components/commons/AutoListView";
  import MuAppbar from "../../../node_modules/muse-ui/src/appBar/appBar.vue";
  import AppBar from "../../components/commons/AppBar.vue";
  import ImgWrapper from "../../components/commons/ImgWrapper.vue";
  import UzLable from "../../components/commons/uzLable.vue";

  export default {
    components: {
      UzLable,
      ImgWrapper,
      AppBar,
      AutoListView
    },
    mixins: [mixins.base, mixins.wx, util],
    name: Constants.PageName.qaDetail,
    filters: {
      my_time: function (value) {
        if (value) {
          return value.substring(5)
        }
        return value
      }
    },
    data() {
      return {
        del_answer_id:null,
        q_adoption_index: null,
        showAsk: false,
        dialog2: false,
        dialog: false,
        ifGoHome: false,
        icon_back: '',
        text_lable: ['哈哈', 'hhe1'],
        icon_a: require('../../assets/img/icon_ask_free.png'),
        icon_b: require('../../assets/img/icon_ask.png'),
        icon1: require('../../assets/img/icon_detail_response.svg'),
        icon2: require('../../assets/img/icon_detail_ask.svg'),
        icon3: require('../../assets/img/icon_detail_like.svg'),
        icon4: require('../../assets/img/icon_detail_liked.svg'),
        icon5: require('../../assets/img/accepted.svg'),
        icon6: require('../../assets/img/accept.svg'),
        icon_ask_close: require('../../assets/img/icon_ask_close.svg'),
        icon_edit: require('../../assets/img/icon_edit.svg'),
        role: 0,
        a_avatar: require('../../assets/img/icon_slider.png'),
        uid: 0,
        question: {},
        answer_list: [],
        flag: null,
        version: process.env.APP_VERSION,
        localValue: this.$ls.get(Constants.LocalStorage.test, '-1'),
        disabled: false,
        current_uid: null,
        isOwner:false,
        attach: [// text
          'http://pic40.nipic.com/20140412/11857649_170524977000_2.jpg',
          'http://pic34.photophoto.cn/20150202/0005018384491898_b.jpg',
          'http://pic40.nipic.com/20140412/11857649_170524977000_2.jpg',
          'http://pic34.photophoto.cn/20150202/0005018384491898_b.jpg',
          'http://pic40.nipic.com/20140412/11857649_170524977000_2.jpg',
          'http://pic34.photophoto.cn/20150202/0005018384491898_b.jpg',
          'http://pic40.nipic.com/20140412/11857649_170524977000_2.jpg',
          'http://pic34.photophoto.cn/20150202/0005018384491898_b.jpg',
          'http://pic40.nipic.com/20140412/11857649_170524977000_2.jpg',
          'http://pic34.photophoto.cn/20150202/0005018384491898_b.jpg',
          'http://pic40.nipic.com/20140412/11857649_170524977000_2.jpg',
          'http://pic34.photophoto.cn/20150202/0005018384491898_b.jpg',
        ]
      };
    },
    computed: {},
    created() {
      this.current_uid = window.localStorage.getItem('uid')
      this.role = window.localStorage.getItem('role')
      this.getData();
      this.initWX(() => {
        console.log('wx success');
      });

      this.ifGoHome = this.$route.query.go_home || false
      console.log(this.ifGoHome)

      let newTime = new Date()
      let timeChuo1 = Date.parse(newTime)
      let timeChuo2 = newTime.valueOf()
      let timeChuo3 = newTime.getTime()

      // console.log(formData(newTime));
      function formData(now) {
        var
            year = now.getFullYear(),
            month = now.getMonth() + 1,
            date = now.getDate(),
            hour = now.getHours(),
            minute = now.getMinutes(),
            second = now.getSeconds();
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
      }

      /**
       * 如果是微信内,则不显示appBar
       * @type {boolean}
       */
      this.showAppBar = !/MicroMessenger/.test(navigator.userAgent);
    },
    activated() {
    },
    methods: {
      ifGoDetail(uid, role, aname) {
        // 这里通过判断返回的role是否时管是家 自己是管家的话点不开其他管家的详情 匿名用户不能打开 管家看管家也是显示匿名用户
        if (!(role == '管家' || role == '金牌管家') || (aname == '匿名用户' || '')) {
          return
        } else {
          this.goGujian(uid, 1)
        }
      },
      goGujian(uid, role) {
        let uid_this = uid || this.current_uid
        let role_this = role || window.localStorage.getItem('role')
        if (role_this == 1) {
          window.location.href = `http://m.uzhuang.com/mobile-m_butler_details.html?id=M%E7%AB%99-%E5%B7%A5%E5%9C%B0%E7%9B%B4%E6%92%AD&butlerid=${uid_this}`
        } else {
          return
        }
      },
      open(index) {
        this.dialog = true
        this.q_adoption_index = index
      },
      close() {
        this.dialog = false
      },
      goBack() {
        if (this.ifGoHome) {
          this.$router.go(-2)
        } else {
          this.$router.go(-1)
        }
      },
      gotoAsk(type) {
        this.pushPage({
          name: Constants.PageName.qaAsk,
          params: {
            type
          }
        });
      },
      showBigImg(src, pics) {
        wx.previewImage({
          current: src, // 当前显示图片的http链接
          urls: pics // 需要预览的图片http链接列表
        });
      },
      clickDel(id) {
        this.dialog2 = true
        this.del_answer_id = id

      },
      close() {
        this.dialog2 = false
      },
      deleteHandle() {

        let data = {
            id: this.del_answer_id
        }
        API.post(Constants.Method.del_answer, data)
            .then((result) => {
              this.getData()
              this.dialog2 = false
              EventBus.$emit(Constants.EventBus.showToast, {
                message: "删除成功"
              });
            })
            .catch((err) => {
              console.log(err);
            })
      },
      webpage() {
        this.$router.push({name: Constants.PageName.qaDoc, params: {type: 2}})
      },
      fenXiang() {
        let url = window.location.href
        console.log(url)
        console.log(wx.onMenuShareTimeline)
        wx.onMenuShareTimeline({
          title: '分享该问题', // 分享标题
          link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: '', // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          fail: function () {
            // 用户确认分享后执行的回调函数

          }
        })
      },
      getData() {
        this.getQuestion()
        this.getAnswerList()
      },
      getQuestion(){
        let data = {
          id: this.$route.query.id,
          inform_id: this.$route.query.inform_id || 0
        };
        // 获取问题详情
        API.post(Constants.Method.get_question_info, data)
            .then((result) => {
              console.log(result)
              result = result.data
              this.question = result;
            })
            .catch((err) => {
              console.log(err);
            });
      },
      getAnswerList(){
        let data = {
          id: this.$route.query.id,
        };
        // 获取当前用户下的回答列表
        API.post(Constants.Method.get_answer_list,data)
            .then((result)=>{
              // 倒叙
              if(!result.data){
                return
              }
              this.answer_list = result.data
              // this.jsonSort()
              // 采纳的部分：
              let getIndex = function (arr, key) {
                let index = -1;
                arr.every(function (vale, i) {
                  if (vale['id'] === key) {
                    index = i
                  } else {
                    index = -1
                  }
                })
                return index
              }
              // 获取当前问题采纳的回答的id todo
              let thisId = this.question.q_adoption || null
              let i = getIndex(this.answer_list, thisId)
              let caiNa = ''
              if (i !== -1) {
                caiNa = this.answer_list.splice(i, 1)[0]
              }
              // 没有采纳的部分 按点赞排序
              this.answer_list = util.jsonSort(this.answer_list, 'like_num', true);
              if (caiNa) {
                this.answer_list.unshift(caiNa)
              }
              // 判断此问题是自己的吗 自己的化显示 采纳 按钮
              this.isOwner = (this.question.asker_id === this.$ls.get(Constants.LocalStorage.uid));
            })
      },
      gotoResponse() {
        this.pushPage({
          name: Constants.PageName.qaResponse,
          query: {
            id: this.question.id
          }
        });
      },
      gotoAsk1() {
        // this.pushPage({
        //   name: Constants.PageName.qaAsk,
        //   qarams: {
        //     type: 1
        //   }
        // });
        // EventBus.$emit('showTotal','true')
        this.handleChange(2)

      },
      handleChange(value) {
        if (value == 2) {
          if (this.role == 0) {
            this.toggleAsk();
          }
          if (this.role == 1) {
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
      },
      editHandle(aid) {
        let data = {
            id: aid,
        }
        console.log(313123123)
        API.post(Constants.Method.get_answer_edit,data)
            .then((result) => {
              console.log('edit success')
              console.log(result)
              if(result.code === 0 && result.message == 'Successful'){
                this.$router.push({
                  name: Constants.PageName.qaResponse,
                  params: {
                    content: result.data.content,
                    is_edit: true,
                    data:data
                  }
                })
              }
            })
            .catch((err) => {
              console.log('edit err');
              console.log(err);
            })
      },
      like(index, liked) {
        console.log("isLiked")
        if (timer) {
          clearTimeout(timer)
        }
        this.disabled = true
        let timer;
        let data = {
           id: this.answer_list[index].id,
        };
        switch (liked) {
          case '1':
            API.post(Constants.Method.un_like, data)
                .then((result) => {
                  this.getData();
                  timer = setTimeout(() => {
                    this.disabled = false
                  }, 1000)
                })
                .catch((err)=>{
                  console.log(err);
                })
            break;
          case '0':
            API.post(Constants.Method.like, data)
                .then((result) => {
                  this.getData();
                  timer = setTimeout(() => {
                    this.disabled = false
                  }, 1000)
                })
                .catch((err)=>{
                  console.log(err);
                })
            break;
          default:
            console.log('操作太快')
        }
      },
      toggleAsk() {
        this.showAsk = !this.showAsk;
      },
      collect() {
        if (timer) {
          clearTimeout(timer)
        }
        this.disabled = true
        let timer
        var count = window.localStorage.getItem('collect_num')
        if (this.question.is_collect == '1') {
          let data = {
              id: this.$route.query.id,
          };
          API.post(Constants.Method.un_favourites, data)
              .then((result) => {
                count--;
                EventBus.$emit('collect_num', count)
                this.getData();
                EventBus.$emit(Constants.EventBus.showToast, {
                  message: '取消收藏'
                });
                timer = setTimeout(() => {
                  this.disabled = false
                }, 1000)
              })
              .catch((err)=>{
                console.log(err);
              });
        } else {
          let data = {
             id: this.$route.query.id,
          };
          API.post(Constants.Method.favourites,data)
              .then((result) => {
                count++;
                EventBus.$emit('collect_num', count)
                this.getData();
                EventBus.$emit(Constants.EventBus.showToast, {
                  message: '收藏成功'
                });
                timer = setTimeout(() => {
                  this.disabled = false
                }, 2000)
              })
              .catch((err)=>{
                console.log(err);
              });
        }


      },
      accept() {
        console.log('采纳')
        let index = this.q_adoption_index
        let data = {
            q_id: this.$route.query.id,
            a_id: this.answer_list[index].id,
        };

        API.post(Constants.Method.adoption, data)
            .then((result) => {
              this.dialog = false
              EventBus.$emit(Constants.EventBus.showToast, {
                message: '已采纳'
              });
              this.getData();
            })
            .catch((err)=>{
              console.log(err);
            });
      },
      onItemClick(index) {
        let data = {
          id: +this.answer_list[index].id
        };

        this.pushPage({
          name: Constants.PageName.qaComment,
          query: data
        });
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

  .avatar {
    width: px2rem(30);
    height: px2rem(30);
  }

  .card {
    background-color: white;
    width: 100%;
    padding: px2rem(10) px2rem(20);
    z-index: 1;
    .card-title{
      font-size: px2rem(16);
      color:#333;
      font-weight: 600;
    }
    .card-img {
      display: flex;
      overflow-x: scroll;
      margin-top: px2rem(20);
      height: px2rem(60);
      font-size: 0;
      .cc-img {
        margin-right: px2rem(20);
      }
      img {
        width: px2rem(80);
        height: px2rem(60);
      }
    }
    .view1 {
      display: flex;
      flex-direction: row;
      align-items: center;
      .username {
        font-size: px2rem(16);
        color: #333;
        flex-grow: 1;
        margin-left: px2rem(10);
      }
      .reward {
        font-size: px2rem(12);
        line-height: 1;
        background-color: RGB(255, 205, 0);
        color: white;
        padding: px2rem(4) px2rem(10);
        border-radius: px2rem(15);
      }
    }

    &-title {
      font-size: px2rem(14);
      color: #333;
      padding: px2rem(10) 0;
    }

    &-content {
      color: $fontcolor;
      font-size: px2rem(14);
    }

    .view2 {
      position: relative;
      color: $fontcolor_gray;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: px2rem(10) 0;
      border-bottom: px2rem(1) solid $divider;
      font-size: px2rem(12);
      .collect {
        color: #aaa;
      }
      .collected {
        color: #31ddaa
      }
      div:nth-child(1):after {
        content: '•';
        padding: 0 px2rem(5);
      }
      div:nth-child(2):after {
        content: '•';
        padding: 0 px2rem(5);
      }
      div:nth-child(4) {
        flex-grow: 1;
        text-align: right;
      }
    }

    &-tags {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
      margin-top: px2rem(10);
      font-size: px2rem(12);
      .tag {
        color: $fontcolor_gray;
        border: 1px solid #dedede;
        padding: px2rem(2) px2rem(5);
        margin-bottom: px2rem(4);
        font-size: px2rem(12);
        margin-right: px2rem(10);
      }
    }
  }

  .scroll-view {
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    .mu-list{
      padding: 0;
    }
  }

  .card-re {
    background-color: white;
    padding: px2rem(10);
    margin: px2rem(10);
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
      .date {
        font-size: px2rem(12);
      }
      .accept {
        font-size: px2rem(12);
        padding: px2rem(2) px2rem(8);
        color: $mainColor;
        border: px2rem(1) solid $mainColor;
      }
      .accepted, .get_reward {
        position: absolute;
        top: px2rem(15);
        width: px2rem(50);
        height: px2rem(50);
        opacity: 1;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .accepted {
        right: px2rem(15);
      }
      .get_reward {
        right: px2rem(75);

      }
    }
    .view2 {
      color: $fontcolor_gray;
      font-size: px2rem(12);
      justify-content: flex-end;
      /*11111*/
      .collect-icon {
        .icon {
          display: inline-block;
          width: px2rem(10);
          height: px2rem(10);
        }
      }
      .like {
        display: flex;
        flex-direction: row;
        margin-right: px2rem(10);
        color:#999;
        .icon {
          width: px2rem(15);
          height: px2rem(15);
          margin-right: px2rem(5);
        }
      }
      .liked {
        color: $fontcolor_red;
      }
    }
    .hotcomment {
      background-color: #F6F6F6;
      padding: px2rem(10) px2rem(5);
      font-size: px2rem(12);
      margin-bottom: px2rem(10);
      .title {

      }
      .count {
        margin-top: px2rem(5);
        color: $fontcolor_blue;
      }
    }
  }

  .footer {
    width: 100%;
    padding: px2rem(15) 0;
    font-size: px2rem(15);
    color: #333333;
    background-color: white;
    display: -webkit-box;
    border-top: px2rem(1) solid $fontcolor_gray_line;
    div {
      flex-grow: 1;
      text-align: center;
      vertical-align: middle;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    > div:nth-child(2) {
      border-left: px2rem(1) solid $fontcolor_gray_line;
    }
    .icon {
      width: px2rem(15);
      height: px2rem(15);
      margin-right: px2rem(10);
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
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        .msg-infos {
          position: absolute;
          top: px2rem(-8);
          left: px2rem(20);
          width: px2rem(140);
          height: px2rem(80);
          font-size: px2rem(13);
          box-sizing: border-box;
          padding-top: px2rem(10);
          padding-left: px2rem(9);
          background: url("../../assets/img/bg_text_box.png") no-repeat 0 0;
          background-size: px2rem(140) px2rem(80);
          background-origin: border-box;
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
    .ask-close {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: px2rem(55);
      border-top: 1px solid #ccc;
      text-align: center;
      font-size: 0;
      &:after {
        display: inline-block;
        vertical-align: middle;
        content: '';
        height: 100%;
      }
    }
    .close {
      vertical-align: middle;
      width: px2rem(30);
      height: px2rem(30);
    }
  }

</style>
