<template>
    <div class="content">
        <!--标题 问题详情-->
        <mu-appbar title="问答详情" v-if="showAppBar">
            <mu-icon-button icon="arrow_back" slot="left" @click="goBack"></mu-icon-button>
        </mu-appbar>
        <!--顶部问题详情-->
        <div class="card" v-if="question">

            <!--用户头像 名称 赏金-->
            <div class="view1" v-if="!if_my_question">
                <img-wrapper :url="question.asker_avatar" classStyle="avatar"
                             @onClick="goManagerDetail(question.asker_id,null,null)"></img-wrapper>
                <div class="username">{{question.asker_name}}</div>
                <span class="reward shadow"
                      v-if="parseFloat(question.reward) > 0">¥{{question.reward | chu100}}</span>
            </div>
            <!--问题标题-->
            <div class="card-title">
                <div class="left">{{question.title}}
                    <span class="reward shadow"
                          v-if="parseFloat(question.reward) > 0 && if_my_question">¥{{question.reward | chu100}}</span>
                </div>
            </div>

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

                        <button @click.stop="collect" class="collect-icon"
                                :class="question.is_collect == '1' ? 'collected' : 'collect'"
                                :disabled="disabled"
                                style="border: none;background: transparent;outline:none">
                            <!--<img-wrapper :url="question.is_collect ?  icon5 : icon6 " classStyle="icon"></img-wrapper>-->
                            {{question.is_collect == '1' ? '已收藏': '收藏'}}
                        </button>

                        <div>{{ question.addtime | crtTime }}</div>
                    </div>
                    <div class="card-tags" v-if="question.label && question.label.length > 0">
                        <div class="tag" v-for="item in question.label" v-if="question.label[0] !==''">
                            {{item}}
                        </div>
                    </div>

                </div>
                <!--回答列表-->
                <!--我在自己的回答-->
                <template v-if="if_my_answer === 1 && if_show">
                    <div class="card-re" @click="onItemClick(my_answer.id)">
                        <!--回答 人 头像 名称 用户等级 是否采纳 11-->
                        <div class="view1 horizontal-view">
                            <div class="vertical-view">
                                <div class="date">{{my_answer.addtime | crtTime}}</div>
                            </div>
                            <div class="accept"
                                 v-if="question.asker_id == current_uid  && my_answer.answerer_id !== question.asker_id && my_answer.adoption >0"
                                 @click.stop="openAdoption(index)">采纳
                            </div>

                            <div class="accepted" v-if="my_answer.adoption >0"><img
                                    src="../../assets/img/accepted@2x.png"
                                    alt=""></div>
                            <div class="get_reward" v-if="my_answer.adoption > 0 && question.reward > 0"><img
                                    src="../../assets/img/get_reward.png" alt=""></div>
                        </div>
                        <!--评论内容-->
                        <div class="context">{{my_answer.content}}</div>
                        <!--获取评论下的评论 -->
                        <!--my_answer.hot_commnet.commenter_role == 1 && role == 1 && current_uid != my_answer.hot_commnet.commenter_id-->
                        <div v-if="my_answer.hot_commnet && my_answer.hot_commnet.commenter_id" class="hotcomment">
                            <div class="title">{{ my_answer.hot_commnet.commenter_name}}
                                <template>
                                    <uz-lable v-if="question.q_reward > 0"
                                              :role="my_answer.hot_commnet.commenter_id === question.asker_id ? '赏金发起人' : my_answer.hot_commnet.commenter_rank"></uz-lable>
                                    <uz-lable v-else
                                              :role="my_answer.hot_commnet.commenter_id === question.asker_id ? '问题发起人' : my_answer.hot_commnet.commenter_rank"></uz-lable>
                                </template>
                                :{{my_answer.hot_commnet.content}}
                            </div>
                            2
                            <div class="count">查看全部{{my_answer.hot_commnet.total}}条回复</div>
                        </div>
                        <!--底部信息展示-->
                        <div class="view2 horizontal-view">
                            <!--点赞功能-->
                            <button class="like" v-bind:class="my_answer.is_like == 1 ? 'liked' : ''"
                                    @click.stop="like(my_answer.id,my_answer.is_like,'my_answer')"
                                    style="border: none;background: transparent;outline: none"
                                    :disabled="disabled"
                            >
                                <img-wrapper :url="my_answer.is_like == 1 ? icon4 : icon3 "
                                             classStyle="icon"></img-wrapper>
                                {{my_answer.laud}}
                            </button>
                            <!--编辑功能-->
                            <!--自己的提问 未被采纳可以显示-->
                            <button class="like"
                                    @click.stop="editHandle(my_answer.id)"
                                    style="border: none;background: transparent;outline: none"
                                    :disabled="disabled"
                                    v-if="my_answer.answerer_id == current_uid  && !my_answer.adoption >0"
                            >
                                <img-wrapper :url="icon_edit"
                                             classStyle="icon"></img-wrapper>
                                编辑
                            </button>
                            <div @click.stop="openClickDel(my_answer.id)"
                                 v-if="my_answer.answerer_id == current_uid  && my_answer.adoption == '0'"> 删除

                            </div>
                            <mu-dialog :open="dialog2" title="提示" @close="close">
                                确定要删除该条回答吗
                                <mu-flat-button slot="actions" @click="close" primary label="取消"/>
                                <mu-flat-button slot="actions" primary @click="deleteHandle(1)" label="确定"/>
                            </mu-dialog>

                        </div>
                    </div>
                </template>
                <!---->
                <div class="click-more" @click="showMore" v-if="if_my_answer === 1 && if_has_more">
                    {{is_more_answer?'关闭其他回答':'查看其他回答'}}
                </div>
                <!--全部回答-->
                <template v-if="is_more_answer">
                    <div class="card-re" @click="onItemClick(item.id)" v-for="item, index in answer_list_filter">
                        <!--回答 人 头像 名称 用户等级 是否采纳 11-->
                        <div class="view1 horizontal-view">
                            <!--如果是匿名用户 显示小鲸鱼  主要评论详情页也是-->
                            <img-wrapper
                                    :url="item.answerer_avatar "
                                    classStyle="avatar"
                            ></img-wrapper>

                            <div class="vertical-view">
                                <div class="name"
                                     @click.stop="goManagerDetail(item.answerer_id,item.answerer_role)">
                 <span class="user-name">
                    {{item.answerer_name}}
                 </span>
                                    <!--显示颜色从组件内根据角色名匹配的-->
                                    <template>
                                        <uz-lable v-if="question.q_reward > 0"
                                                  :role="item.answerer_id === question.asker_id ? '赏金发起人' : item.answerer_rank"></uz-lable>
                                        <uz-lable v-else
                                                  :role="item.answerer_id ===question.asker_id ? '问题发起人' : item.answerer_rank"></uz-lable>
                                    </template>
                                </div>
                                <div class="date">{{item.addtime | crtTime}}</div>
                            </div>

                            <div class="accept"

                                 v-if="question.asker_id == current_uid && item.answerer_id != current_uid && !isAdoption"
                                 @click.stop="openAdoption(index)">采纳
                            </div>

                            <div class="accepted" v-if="item.adoption >0"><img src="../../assets/img/accepted@2x.png"
                                                                               alt=""></div>
                            <div class="get_reward" v-if="item.adoption >0 && question.reward > 0"><img
                                    src="../../assets/img/get_reward.png" alt=""></div>
                        </div>
                        <!--评论内容-->
                        <div class="context">{{item.content}}</div>
                        <!--获取评论下的评论 -->
                        <div v-if="item.hot_commnet.commenter_id" class="hotcomment">
                            <div class="title">{{item.hot_commnet.commenter_name}}
                                <template>
                                    <uz-lable v-if="question.q_reward > 0"
                                              :role="item.hot_commnet.commenter_id === question.asker_id ? '赏金发起人' : item.hot_commnet.commenter_rank"></uz-lable>
                                    <uz-lable v-else
                                              :role="item.hot_commnet.commenter_id === question.asker_id ? '问题发起人' : item.hot_commnet.commenter_rank"></uz-lable>
                                </template>
                                :{{item.hot_commnet.content}}
                            </div>
                            <div class="count">查看全部{{item.hot_commnet.total}}条回复</div>
                        </div>
                        <!--底部信息展示-->
                        <div class="view2 horizontal-view">
                            <!--点赞功能-->
                            <button class="like" v-bind:class="item.is_like == 1 ? 'liked' : ''"
                                    @click.stop="like(item.id,item.is_like)"
                                    style="border: none;background: transparent;outline: none"
                                    :disabled="disabled"
                            >
                                <img-wrapper :url="item.is_like == 1 ? icon4 : icon3 "
                                             classStyle="icon"></img-wrapper>
                                {{item.laud}}

                            </button>
                            <!--编辑功能-->
                            <button class="like"
                                    @click.stop="editHandle(item.id)"
                                    style="border: none;background: transparent;outline: none"
                                    :disabled="disabled"
                                    v-if="current_uid == item.answerer_id && item.adoption == 0 "
                            >
                                <img-wrapper :url="icon_edit"
                                             classStyle="icon"></img-wrapper>
                                编辑
                            </button>
                            <div @click.stop="openClickDel(item.id)"
                                 v-if="item.answerer_id == current_uid  && item.adoption == 0"> 删除
                            </div>
                            <mu-dialog :open="dialog2" title="提示" @close="close">
                                确定要删除该条回答吗
                                <mu-flat-button slot="actions" @click="close" primary label="取消"/>
                                <mu-flat-button slot="actions" primary @click="deleteHandle" label="确定"/>
                            </mu-dialog>

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
            <div @click="gotoAsk1" v-if="watch_role != 1 ">
                <img-wrapper :url="icon2" classStyle="icon"></img-wrapper>
                去提问
            </div>
        </div>
        <mu-dialog :open="dialog" title="提示" @close="close">
            确定采纳该回答吗？
            <mu-flat-button slot="actions" @click="close" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="accept()" label="确定"/>
        </mu-dialog>
        <!--点击去回答弹出回答框-->
        <div class="answer-div" v-if="askBoxShow" id="outDiv">
            <div class="answer-box" id="inDiv">
                <textarea v-model="content" placeholder="回答问题将获得积分奖励" rows="6" class="textarea"
                          autofocus="autofocus"/>
                <div class="right-box">
                    <img-wrapper :url="icon7" classStyle="icon7" @onClick="fullScreen"></img-wrapper>
                    <span @click.stop="submit()">发送</span>
                </div>
            </div>
        </div>


        <!--&lt;!&ndash;todo 抽离组件&ndash;&gt;-->
        <!--<div class="mask" v-if="showAsk">-->
            <!--<div class="btn-view">-->
                <!--<keep-alive>-->
                    <!--<div class="icon-view">-->
                        <!--<div style="visibility: hidden" class="msg-infos">-->
                            <!--<div>更快更多更优质回答</div>-->
                            <!--<div>查看更多<a href="">专属权利</a></div>-->
                        <!--</div>-->
                        <!--<div @click="gotoAsk(0)">-->
                            <!--<img-wrapper :url="icon_a" classStyle="icon"></img-wrapper>-->
                            <!--<div class="name">免费提问</div>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</keep-alive>-->
                <!--<keep-alive>-->
                    <!--<div class="icon-view">-->
                        <!--<div style="visibility: hidden" class="msg-infos">-->
                            <!--<div>更快更多更优质回答</div>-->
                            <!--<div>查看更多<a href="javascript:;" @click.stop="webpage"-->
                                        <!--style="text-decoration: underline;color:#328afb">专属权利</a>-->
                            <!--</div>-->
                        <!--</div>-->
                        <!--<div @click="gotoAsk(1)">-->
                            <!--<img-wrapper :url="icon_b" classStyle="icon"></img-wrapper>-->
                            <!--<div class="name">悬赏提问</div>-->
                        <!--</div>-->

                    <!--</div>-->
                <!--</keep-alive>-->
            <!--</div>-->
            <!--<div class="ask-close">-->
                <!--<img-wrapper classStyle="close" @onClick="toggleAsk" :url="icon_ask_close"></img-wrapper>-->
            <!--</div>-->
        <!--</div>-->
    </div>

</template>

<script>

    import {EventBus, API, Constants, mixins, util} from '../../config/index'
    import AutoListView from "../../components/commons/AutoListView";
    import AppBar from "../../components/commons/AppBar.vue";
    import ImgWrapper from "../../components/commons/ImgWrapper.vue";
    import UzLable from "../../components/commons/uzLable.vue";

    export default {
        components: {
            UzLable,
            ImgWrapper,
            AppBar,
            AutoListView,
        },
        mixins: [mixins.base, mixins.wx, util],
        name: Constants.PageName.qaDetail,
        data() {
            return {
                askBoxShow: false,
                content: "",
                del_answer_id: null,
                q_adoption_index: null,
                current_question_id: 0,
                dialog2: false,
                dialog: false,
                ifGoHome: false,
                icon_back: '',
                icon_a: require('../../assets/img/icon_ask_free.png'),
                icon_b: require('../../assets/img/icon_ask.png'),
                icon1: require('../../assets/img/icon_detail_response.svg'),
                icon2: require('../../assets/img/icon_detail_ask.svg'),
                icon3: require('../../assets/img/icon_detail_like.svg'),
                icon4: require('../../assets/img/icon_detail_liked.svg'),
                icon5: require('../../assets/img/accepted.svg'),
                icon6: require('../../assets/img/accept.svg'),
                icon7: require('../../assets/img/fullscreen.svg'),
                icon_ask_close: require('../../assets/img/icon_ask_close.svg'),
                icon_edit: require('../../assets/img/icon_edit.svg'),
                role: 0,
                ifSelfAnswer: false,
                a_avatar: require('../../assets/img/icon_slider.png'),
                uid: 0,
                question: {},
                answer_list: [],
                flag: null,
                version: process.env.APP_VERSION,
                localValue: this.$ls.get(Constants.LocalStorage.test, '-1'),
                disabled: false,
                current_uid: null,
                isAdoption: false,
                my_answer: [],
                is_more_answer: true,
                if_my_answer: 0,// 是否需要优先显示自己的回答
                my_answer_id: 0,// 自己的回答id
                if_my_question: false,
                if_has_more: false,
                if_show: true,
                this_title: '',
                is_edit: []
            };
        },
        computed: {
            watch_role() {
                return this.role
            },
            answer_list_filter: function () {
                return this.answer_list.filter((val) => {
                    return val.id !== this.my_answer_id
                })
            }
        },
        created() {

            this.initWX(() => {
                // console.log('wx success');
            });
            // 登陆后会有uid进行判断是否是自己回答或者自己评论的 可以进行控制是否可以删除或者编辑
            this.current_uid = window.localStorage.getItem(Constants.LocalStorage.uid) || null
            // 角色的权限控制
            this.role = window.localStorage.getItem(Constants.LocalStorage.role)
            // this.ifNeedReLogin()
            this.getData();
            // 判断是否是从我的问题列表过来的
            if (this.$route.query.if_my_question) {
                this.if_my_question = true
            }
            // 判断是否是从我的回答列表过来的
            if (this.$route.query.my_answer == 1) {
                this.is_more_answer = false
                this.if_my_answer = 1
            }
            // 微信支付成功后跳转首页 （原因是没有返回首页的入口，如果点击返回按钮会跳去支付页面）
            this.ifGoHome = this.$route.query.go_home || false
            /**
             * 如果是微信内,则不显示appBar
             * @type {boolean}
             */
            this.showAppBar = !/MicroMessenger/.test(navigator.userAgent);
        },
        activated() {

            this.role = window.localStorage.getItem(Constants.LocalStorage.role)
        },
        destroyed(){

        },
        methods: {
            // 已经去除登陆拦截功能 起初是要获取当前用户角色进行权限控制的
            ifNeedReLogin() {
                this.current_uid = window.localStorage.getItem(Constants.LocalStorage.uid)
                var Request = new Object();
                Request = util.GetRequest();
                let urlUid = Request['uid'] || this.current_uid
                let id = Request['id'] || this.$route.query.id
                let redirect = this.$route.name
                if (urlUid && this.current_uid && urlUid != this.current_uid) {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: "需要重新登陆"
                    })

                    this.$router.replace({
                        name: Constants.PageName.qaLogin,
                        query: {
                            redirect: redirect,
                            id: id
                        }
                    })
                }
            },


            clickAnswerBoxHandle(){
                var inDiv = document.getElementById('inDiv')  // 获取内层目标盒子
                var outDiv = document.getElementById('outDiv') // 获取外层盒子
                outDiv.addEventListener('click',()=> {
                    this.askBoxShow  = false
                })
                inDiv.addEventListener('click',function (e) {
                    e = e || window.event
                    e.stopPropagation()  //
                })

            },
            goManagerDetail(uid, role) {
                if (role != 1) {
                    return
                } else {
                    this.$router.push({name:'qamanagerdetail',query:{id:uid}})
                }
            },

            openAdoption(index) {
                this.dialog = true
                this.q_adoption_index = index
            },
            openClickDel(id) {
                this.dialog2 = true
                this.del_answer_id = id
            },
            close() {
                this.dialog2 = false
                this.dialog = false
            },
            goBack() {
                if (this.ifGoHome) {
                    this.$router.go(-1)
                } else {
                    this.$router.go(-1)
                }
                // this.$router.go(-1)
            },
            gotoAsk(type) {
                this.pushPage({
                    name: Constants.PageName.qaAsk,
                    query: {
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
            deleteHandle(type) {

                let data = {
                    id: this.del_answer_id
                }
                // if(){
                //
                // }
                API.post(Constants.Method.del_answer, data)
                    .then((result) => {
                        this.getAnswerList()
                        this.dialog2 = false
                        if (type) {
                            this.if_show = false
                        }
                        EventBus.$emit(Constants.EventBus.showToast, {
                            message: "删除成功"
                        });
                    })
                    .catch((err) => {
                        // console.log(err);
                    })
            },
            webpage() {
                this.$router.push({name: Constants.PageName.qaDoc, params: {type: 2}})
            },


            showMore() {
                this.is_more_answer = !this.is_more_answer
            },
            getData() {
                // todo
                if (this.$route.query && this.$route.query.is_from_payask === true) {
                    let url = 'http://zhuge.uzhuang.com/index.php?r=question-tmp/info'
                    this.getQuestion(url)
                    return
                }
                this.getQuestion()
                let num = this.$route.query.my_answer || 0
                this.getAnswerList(num)
                if (num == 1) {
                    this.getAnswerList()
                }
            },
            getQuestion(url) {
                let urlS = url || Constants.Method.get_question_info
                let data = {
                    id: this.$route.query.id,
                    inform_id: this.$route.query.inform_id || 0
                };
                // 获取问题详情
                API.get(urlS, {params: data})
                    .then((result) => {
                        result = result.data
                        this.question = result;
                        this.current_question_id = this.question.id
                        this.fenXiang({
                            title: result.title,
                            imgUrl: 'http://image1.uzhuang.com/zhuge-logo.png'
                        })
                    })
                    .catch((err) => {
                        // console.log(err);
                    });
            },
            getAnswerList(my_answer) {
                let data = {
                    id: this.$route.query.id,
                    my_answer: my_answer //1 只返回我的回答  0 返回全部回答
                };
                // 获取当前用户下的回答列表
                API.get(Constants.Method.get_answer_list, {params: data})
                    .then((result) => {
                        // 倒叙
                        // console.log('result');
                        // console.log(result);
                        if (!result.data) {
                            return
                        }
                        if (data.my_answer == 1) {
                            this.my_answer = result.data[0]
                            this.my_answer_id = result.data[0].id
                        }
                        this.answer_list = result.data
                        // 判断当前回答列表内是否有自己回答过的
                        this.ifSelfAnswer = util.ifHaveVale(this.answer_list, 'answerer_id', this.current_uid)

                        // if(this.ifSelfAnswer){
                        //   EventBus.$emit(Constants.EventBus.showToast,{
                        //     message:'你已经回答过改问题'
                        //   })
                        // }
                        this.if_has_more = this.answer_list.length > 1
                        // 欧安的是否有采纳的
                        // this.isAdoption = util.ifHaveVale(this.answer_list,'adoption','1')
                        // 没有采纳的部分 按点赞排序

                        this.answer_list.reverse()
                        this.answer_list = util.jsonSort(this.answer_list, 'laud', true);
                        // this.answer_list.reverse()
                        // 获取采纳的序列号
                        let _index = util.getSuccIndex(this.answer_list, 'adoption', '1')
                        if (_index !== -1) {
                            this.isAdoption = true
                            var adoptionAnswer = this.answer_list.splice(_index, 1)[0]
                            // console.log('adoptionAnswer');
                            this.answer_list.unshift(adoptionAnswer)
                        }
                    })
                // console.log(this.isAdoption);
            },
            submit() {

                if (!this.content) {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '内容不能为空'
                    });
                    return;
                }
                // if (is_edit) {
                //     let data = this.$route.params.data
                //     // console.log(data)
                //     data.content = this.qa.content
                //
                //     // .concat({content:this.qa.content})
                //     API.post(Constants.Method.put_answer_edit, data)
                //         .then((result) => {
                //             // console.log(result);
                //             this.$router.go(-1)
                //         })
                //         .catch((err) => {
                //             // console.log(err);
                //         })
                //
                //
                //     return
                // }
                let data = {
                    id: this.question.id,
                    content: this.content,

                };
                API.post(Constants.Method.answer, data)
                    .then((result) => {
                        this.content = '';
                        // console.log(result)
                        if (result.code && result.code == 1) {
                            // 不用看了这里没作用的 哈哈
                            EventBus.$emit(Constants.EventBus.showToast, {
                                message: '你已经回答过了吆！'
                            });
                        } else {
                            EventBus.$emit(Constants.EventBus.showToast, {
                                message: '发布成功'
                            });
                        }
                        this.askBoxShow = false
                        this.getData()

                    })
                    .catch((err) => {
                        // console.log(err);
                    });
            },

            fullScreen(){
                console.log('fullScreen')
                // let div = document.getElementById('outDiv')
                // div.classList.toggle("full");
                this.pushPage({
                  name: Constants.PageName.qaResponse,
                  query: {
                    id: this.question.id,
                      content:this.content
                  }
                });

            },
            gotoResponse() {
                // 判断是否登陆
                let sign = localStorage.getItem(Constants.LocalStorage.sign)
                if(!sign) {
                    console.log(1);
                    EventBus.$emit(Constants.EventBus.toTelLogin)
                    return
                }
                if (this.ifSelfAnswer) {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '你已经回答过该问题，不能继续回答，可以编辑'
                    })
                    return
                }
                // this.pushPage({
                //   name: Constants.PageName.qaResponse,
                //   query: {
                //     id: this.question.id
                //   }
                // });
                this.askBoxShow = true

                setTimeout( () => {
                    this.clickAnswerBoxHandle()
                },100)
                // this.answerDomHandle() // 弹出层交互事件
            },
            gotoAsk1() {
                let sign = util.ls.getItem(Constants.LocalStorage.sign)
                if(!sign){
                    EventBus.$emit(Constants.EventBus.toTelLogin,'showAsk')
                    return
                }
                this.handleChange(2)

            },
            handleChange(value) {
                if (value == 2) {
                    if (this.role == 0) {
                        this.toggleAsk();
                    }
                    else if (this.role == 1) {
                        EventBus.$emit(Constants.EventBus.showToast, {
                            message: '管家没有提问权限'
                        });
                    }
                    else{
                        // // 外部登陆 或者 返回微信授权登陆
                        if(util.ifWX()){
                            EventBus.$emit(Constants.EventBus.showToast, {
                                message: '请先关注优装美家，登陆后可以提问'
                            });
                        }else {
                            EventBus.$emit(Constants.EventBus.toTelLogin,'showAsk')
                        }
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
                // console.log(313123123)
                API.post(Constants.Method.get_answer_edit, data)
                    .then((result) => {

                        if (result.code === 0 && result.message == 'Successful') {
                            this.$router.push({
                                name: Constants.PageName.qaResponse,
                                params: {
                                    content: result.data.content,
                                    is_edit: true,
                                    data: data
                                }
                            })
                        }
                    })
                    .catch((err) => {

                        // console.log(err);
                    })
            },
            like(id, liked, type) {
                // console.log(type)
                // console.log(liked)
                let sign = util.ls.getItem(Constants.LocalStorage.sign)
                if(!sign){
                    EventBus.$emit(Constants.EventBus.toTelLogin)
                    return
                }
                if (timer) {
                    clearTimeout(timer)
                }
                this.disabled = true
                let timer;
                let data = {
                    id: id,
                };
                switch (liked) {
                    case '1':
                        API.post(Constants.Method.un_like, data)
                            .then((result) => {
                                if (type == 'my_answer') {
                                    this.getAnswerList(1)
                                } else {
                                    this.getAnswerList()
                                }
                                timer = setTimeout(() => {
                                    this.disabled = false
                                }, 1000)
                            })
                            .catch((err) => {
                                // console.log(err);
                            })
                        break;
                    case '0':
                        API.post(Constants.Method.like, data)
                            .then((result) => {
                                if (type == 'my_answer') {
                                    this.getAnswerList(1)
                                } else {
                                    this.getAnswerList()
                                }
                                timer = setTimeout(() => {
                                    this.disabled = false
                                }, 1000)
                            })
                            .catch((err) => {
                                // console.log(err);
                            })
                        break;
                    default:
                        API.post(Constants.Method.un_like, data)
                            .then((result) => {
                                if (type == 'my_answer') {
                                    this.getAnswerList(1)
                                } else {
                                    this.getAnswerList()
                                }
                                timer = setTimeout(() => {
                                    this.disabled = false
                                }, 1000)
                            })
                            .catch((err) => {
                                // console.log(err);
                            })
                }
            },
            toggleAsk() {
                EventBus.$emit('showAskBox')
            },
            collect() {
                let sign = util.ls.getItem(Constants.LocalStorage.sign)
                if(!sign){
                    EventBus.$emit(Constants.EventBus.toTelLogin)
                    return
                }
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
                            this.getQuestion();
                            EventBus.$emit(Constants.EventBus.showToast, {
                                message: '取消收藏'
                            });
                            timer = setTimeout(() => {
                                this.disabled = false
                            }, 1000)
                        })
                        .catch((err) => {
                            // console.log(err);
                        });
                } else {
                    let data = {
                        id: this.$route.query.id,
                    };
                    API.post(Constants.Method.favourites, data)
                        .then((result) => {
                            count++;
                            EventBus.$emit('collect_num', count)
                            this.getQuestion();
                            EventBus.$emit(Constants.EventBus.showToast, {
                                message: '收藏成功'
                            });
                            timer = setTimeout(() => {
                                this.disabled = false
                            }, 2000)
                        })
                        .catch((err) => {
                            // console.log(err);
                        });
                }


            },

            accept() {
                // console.log('采纳')
                let index = this.q_adoption_index
                let data = {
                    question_id: this.current_question_id,
                    answer_id: this.answer_list[index].id,
                };
                // console.log(data);
                API.post(Constants.Method.adoption, data)
                    .then((result) => {
                        this.dialog = false
                        EventBus.$emit(Constants.EventBus.showToast, {
                            message: '已采纳'
                        });
                        this.getAnswerList();
                    })
                    .catch((err) => {
                        // console.log(err);
                    });
            },
            onItemClick(id) {
                let data = {
                    id: id,
                    uid: this.current_uid
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

    .card {
        background-color: white;
        width: 100%;
        padding: px2rem(10) px2rem(20);
        z-index: 1;
        .card-title {

            font-size: px2rem(16);
            color: #333;
            font-weight: 600;
            .reward {
                float: right;
                font-size: px2rem(12);
                line-height: 1;
                background-color: RGB(255, 205, 0);
                color: white;
                padding: px2rem(4) px2rem(10);
                border-radius: px2rem(15);
                margin-left: px2rem(10);
                margin-right: px2rem(15);
            }
        }

        .avatar {
            width: px2rem(30);
            height: px2rem(30);
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
            .collect-icon {
                padding: 0;
            }
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
        .mu-list {
            padding: 0;
        }
    }

    .click-more {
        background: #fff;
        padding: px2rem(10);
        margin: px2rem(10);
        text-align: center;
    }

    .card-re {
        background-color: white;
        padding: px2rem(10);
        margin: px2rem(10);
        .avatar {
            vertical-align: middle;
            width: px2rem(30);
            height: px2rem(30);
        }
        .view1 {
            position: relative;
            align-items: center;
            > div:nth-child(2) {
                flex-grow: 1;
                font-size: px2rem(14);
                margin-left: px2rem(10);
                color: $fontcolor_gray;
            }
            .name {
                color: #333;
                padding: 0;
                margin: 0;
                font-size: 0;
                .user-name {
                    vertical-align: middle;
                    font-size: px2rem(13);

                }
            }
            .date {
                font-size: px2rem(12);
                padding: 0;
                margin: 0;
            }
            .accept {
                font-size: px2rem(12);
                padding: px2rem(2) px2rem(8);
                color: $mainColor;
                border: px2rem(1) solid $mainColor;
            }
            .accepted, .get_reward {
                position: absolute;
                top: px2rem(0);
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
            collect-icon {
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
                color: #999;
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

    .answer-div {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        bottom: 0;
        z-index: 999;
        .answer-box {
            display: flex;
            position: absolute;
            padding: px2rem(15) 0 px2rem(20) px2rem(15);
            bottom: 0;
            width: 100%;
            height: px2rem(130);
            background-color: #f9f9f9;
        }
        .textarea {
            width: px2rem(310);
            border: 1px solid #dedede;
            padding-left: px2rem(10);
            background: #fff;
            outline: none;
        }
        .right-box {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-left: px2rem(11);
        }
        .icon7 {
            margin-left: px2rem(3);
            width: px2rem(18);
        }
    }
    .full{
        .answer-box{
            height: 100%;
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
        background-color: rgba(255, 255, 255, 0.98);
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
            width: px2rem(20);
            height: px2rem(20);
        }
    }

</style>
