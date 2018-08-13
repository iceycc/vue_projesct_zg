<template>
    <div class="content">
        <app-bar :title="title"></app-bar>
        <div class="card shadow" v-if="answer">
            <div class="view1 horizontal-view">
                <img-wrapper :url="answer.answerer_avatar" classStyle="avatar"
                             @onClick="goManagerDetail(answer.answerer_id,answer.answerer_role)"></img-wrapper>
                <div class="vertical-view">
                    <div class="name" @click="goManagerDetail(answer.answerer_id,answer.answerer_role)">
                        {{answer.answerer_name }}
                        <template>
                            <uz-lable v-if="answer.answerer_rank" :role="answer.answerer_rank"></uz-lable>
                        </template>
                    </div>
                    <div class="date">{{answer.addtime | crtTime}}</div>
                </div>
                <div class="horizontal-view">
                    <button class="like" v-bind:class="answer.is_like == 1 ? 'liked' : ''"
                            @click.stop="like(answer.id,answer.is_like,0)"
                            :disabled="disabled"
                    >
                        <img-wrapper :url="answer.is_like == 1 ? icon4 : icon3 "
                                     classStyle="icon"></img-wrapper>
                        {{answer.laud}}
                    </button>
                </div>
            </div>
            <div class="context">{{answer.content}}</div>
            <div class="huifu" @click="onItemClick(answer.answerer_name,0,answer.id)">回复</div>

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
                                        <span @click="goManagerDetail(item.from_user_id,item.from_user_role)">
                      {{item.from_user_name}}
                    </span>
                                        <span class="huifu-text"> 回复 </span>
                                        <span @click="goManagerDetail(item.to_user_id,item.to_user_role)">{{item.to_user_name}} ：</span>
                                    </div>
                                </div>
                            </div>
                            <div class="context">{{item.content}}</div>
                            <div style="display: flex">
                                <span class="left">{{item.addtime | crtTime}}</span>
                                <span class="right" @click="clickDel(item.id)" v-if="item.from_user_id == current_uid">删除</span>
                                <span class="right" @click="onItemClick(item.from_user_name,item.id,0)">回复</span>
                                <mu-dialog :open="dialog1" title="提示" @close="close">
                                    确定要删除该条评论吗
                                    <mu-flat-button slot="actions" @click="close" primary label="取消"/>
                                    <!--这里传item.id 为啥和上面获取的不一样呢-->
                                    <mu-flat-button slot="actions" primary @click="delCommentHandle" label="确定"/>
                                </mu-dialog>
                            </div>

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
    import {Constants, EventBus, mixins, API, util} from '../../config/index';
    import AutoListView from "../../components/commons/AutoListView";
    import AppBar from "../../components/commons/AppBar.vue";
    import ImgWrapper from "../../components/commons/ImgWrapper.vue";
    import MuTextField from "../../../node_modules/muse-ui/src/textField/textField.vue";
    import UzLable from "../../components/commons/uzLable.vue";

    export default {
        components: {
            UzLable,
            MuTextField,
            ImgWrapper,
            AppBar,
            AutoListView
        },
        mixins: [mixins.base, mixins.wx],
        name: Constants.PageName.qaDetail,
        data() {
            return {
                current_uid: null,
                dialog1: false,
                icon1: require('../../assets/img/icon_detail_response.svg'),
                icon2: require('../../assets/img/icon_detail_ask.svg'),
                icon3: require('../../assets/img/icon_detail_like.svg'),
                icon4: require('../../assets/img/icon_detail_liked.svg'),
                uid: 0,
                answer: {},
                comments: [],
                recomment: '',
                to_who: '回复评论',
                c_id: 0,
                is_footer_show: false,
                title: '',
                disabled: false,
                a_id: 0,
                del_comment: null,
                role: 0
            };
        },
        computed: {},
        created() {
            this.initWX(() => {
                // console.log('wx success');
            });
            this.role = window.localStorage.getItem(Constants.LocalStorage.role)
            this.ifNeedReLogin()

            this.getData()
            this.getComment()
        },
        activated() {

        },
        methods: {
            ifNeedReLogin() {
                this.current_uid = window.localStorage.getItem(Constants.LocalStorage.uid)
                var Request = new Object();
                Request = util.GetRequest();
                let urlUid = Request['uid'] || this.current_uid
                let id = Request['id'] || this.$route.query.id
                let redirect = this.$route.name
                // console.log('002');
                // console.log(urlUid != this.current_uid);
                // console.log(null != undefined);
                // console.log(null == true);
                // console.log(this.current_uid == true);
                // console.log(this.current_uid);
                // console.log(null);
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
            goManagerDetail(uid, role) {
                console.log(uid, role)
                if (role != 1) {
                    return
                } else {
                    this.$router.push({name: 'qamanagerdetail', query: {id: uid}})
                }
            },
            getData() {
                let data = {
                    id: this.$route.query.id,
                    inform_id: this.$route.query.inform_id || 0,
                };

                API.get(Constants.Method.get_answer, {params: data})
                    .then((result) => {
                        this.answer = result.data
                        this.fenXiang({
                            title: result.data.title,
                        })
                        if (this.answer == null) {
                            EventBus.$emit(Constants.EventBus.showToast, {message: '该条动态已被删除'})
                            setTimeout(() => {
                                this.$router.go(-1)
                            }, 1500)
                        }
                    })
                    .catch((err) => {
                        // console.log(err);
                    });
            },
            getComment() {
                let data = {
                    id: this.$route.query.id,
                    inform_id: this.$route.query.inform_id || 0
                };

                API.get(Constants.Method.get_comment_list, {params: data})
                    .then((result) => {
                        this.comments = result.data;
                        if (this.comments && this.comments.length > 0) {
                            this.title = `${this.comments.length}条回复`
                        } else {
                            this.title = `暂无回复`
                        }
                    })
                    .catch((err) => {
                        // console.log(err)
                    });
            },
            getRoleClass(role) {

            },
            clickDel(id) {
                this.dialog1 = true
                // console.log(id)
                this.del_comment = id
                // this.delCommentHandle(item.cid)
            },
            close() {
                this.dialog1 = false
            },
            //
            delCommentHandle() {
                let data = {
                    id: this.del_comment,
                }
                API.post(Constants.Method.del_comment, data)
                    .then((result) => {
                        this.getComment()
                        this.dialog1 = false
                        this.del_comment = null
                    })
                    .catch((err) => {
                        // console.log(err)
                    })
            },
            //
            onItemClick(name, c_id, a_id) {
                let sign = util.ls.getItem(Constants.LocalStorage.sign)
                if(!sign){
                    EventBus.$emit(Constants.EventBus.toTelLogin)
                    return
                }
                // // console.log(name);
                this.is_footer_show = true
                this.a_id = a_id
                // console.log('this.a_id : ' + a_id)
                this.c_id = c_id
                // console.log('this.c_id : ' + c_id)
                this.to_who = "回复 " + name + " 评论："
            },
            submit() {
                if (!this.recomment) {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '内容不能为空'
                    });
                    return
                }

                // 回复回答
                if (this.c_id == 0) {
                    let data = {
                        answer_id: this.a_id,
                        content: this.recomment,
                    };
                    API.post(Constants.Method.reply_answer, data)
                        .then((result) => {
                            this.getComment()
                            this.recomment = ''
                            // console.log("++++++++++++comment+++++++++++++");
                            // // console.log(result);
                            this.is_footer_show = false
                            // console.log("++++++++++++++++++++++++++++++++");
                        })
                        .catch((err) => {
                            // console.log(err)
                        });
                }
                if (this.a_id == 0) {
                    let data = {
                        comment_id: this.c_id,
                        content: this.recomment,
                    };
                    API.post(Constants.Method.reply_comment, data)
                        .then((result) => {
                            this.getComment()
                            this.recomment = ''
                            // console.log("++++++++++++comment+++++++++++++");
                            // // console.log(result);
                            this.is_footer_show = false
                            // console.log("++++++++++++++++++++++++++++++++");
                        })
                        .catch((err) => {
                            // console.log(err)
                        });
                }

            },
            like(a_id, liked, c_id) {
                // console.log('5000')
                let sign = util.ls.getItem(Constants.LocalStorage.sign)
                if (!sign) {
                    EventBus.$emit(Constants.EventBus.toTelLogin)
                    return
                }
                if (timer) {
                    clearTimeout(timer)
                }
                this.disabled = true
                let timer;
                let data = {
                    id: a_id,
                };
                switch (liked) {
                    case '1':
                        API.post(Constants.Method.un_like, data)
                            .then((result) => {
                                this.getData()
                                timer = setTimeout(() => {
                                    this.disabled = false;
                                }, 3000)
                            })
                            .catch((err) => {
                                // console.log(err)
                            });
                        break;
                    case '0':
                        API.post(Constants.Method.like, data)
                            .then((result) => {
                                this.getData();
                                timer = setTimeout(() => {
                                    this.disabled = false;
                                }, 3000)
                            })
                            .catch((err) => {
                                // console.log(err)
                            })
                }
                timer = setTimeout(() => {
                    this.disabled = false;
                    // console.log('like once')
                }, 3000)

            },
            collect() {
                // console.log(collect);
            },
            accept(index) {
                let options = {
                    params: {
                        q_id: this.$route.query.id,
                        a_id: this.answer_list[index].id,
                    }
                };

                API.post(Constants.Method.adoption, options.params)
                    .then((result) => {
                        // console.log("========adoption============");
                        // // console.log(result);
                        // console.log("====================");
                    })
                    .catch((err) => {
                        // console.log(err);
                    });
            },

        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";
    @import "../../components/commons/AutoListView";

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
