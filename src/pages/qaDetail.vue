<template>
    <div class="content">
        <app-bar :title="title"></app-bar>
        <div class="card shadow" v-if="question">
            <div class="view1">
                <img-wrapper :url="question.avatar" classStyle="avatar"></img-wrapper>
                <div class="username">{{question.aname}}</div>
                <span class="reward shadow"
                      v-if="parseFloat(question.q_reward) > 0"> ¥{{question.q_reward}}</span>
            </div>
            <div class="card-title">{{question.title}}</div>
            <div class="card-content">{{question.content}}</div>
            <div class="view2">
                <div>{{question.pv}}浏览</div>
                <div>{{question.answer_num}}回答</div>
                <div @click="collect">{{question.is_collect ? '已' : ''}}收藏</div>
                <div>{{question.qtime}}</div>
            </div>
            <div class="card-tags" v-if="question.label && question.label.length > 0">
                <div class="tag" v-for="item in question.label">
                    {{item}}
                </div>
            </div>
        </div>

        <div class="scroll-view">
            <mu-list>
                <template v-for="item, index in answer_list">
                    <div class="item" @click="onItemClick(index)">
                        <div class="card-re">
                            <div class="view1 horizontal-view">
                                <img-wrapper :url="item.a_avatar" classStyle="avatar"></img-wrapper>
                                <div class="vertical-view">
                                    <div class="name">{{item.aname}}
                                        <uz-lable :role="item.role"></uz-lable>
                                    </div>
                                    <div class="date">{{item.atime}}</div>
                                </div>
                                <div class="accept" v-if="isOwner && question.q_adoption == 0" @click.stop="accept(index)">采纳</div>
                                <div class="accept" v-if="question.q_adoption ==item.id" >已采纳</div>
                            </div>
                            <div class="context">{{item.content}}</div>
                            <div v-if="item.hot_comment" class="hotcomment">
                                <div class="title">{{item.hot_comment.username}}
                                    <uz-lable :role="item.hot_comment.role"></uz-lable>
                                    :{{item.hot_comment.content}}
                                </div>
                                <div class="count">查看全部{{item.hot_comment.comment_total_num}}条回复</div>
                            </div>
                            <div class="view2 horizontal-view">
                                <div class="like" v-bind:class="item.liked == 1 ? 'liked' : ''"
                                     @click.stop="like(index)">
                                    <img-wrapper :url="item.liked == 1 ? icon4 : icon3 "
                                                 classStyle="icon"></img-wrapper>
                                    {{item.like_num}}
                                </div>
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
            <div @click="gotoAsk">
                <img-wrapper :url="icon2" classStyle="icon"></img-wrapper>
                去提问
            </div>
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
    import UzLable from "../components/uzLable.vue";

    export default {
        components: {
            UzLable,
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
                question: {},
                answer_list: [],
                flag: null,
                version: process.env.APP_VERSION,
                localValue: this.$ls.get(Constants.LocalStorage.test, '-1')
            };
        },
        computed: {},
        created() {
        },
        activated() {
            this.getData();
        },
        methods: {
            getData() {
                let data = {
                    q_id: this.$route.query.id,
                    uid: 1300
                };

                this.doRequest(Constants.Method.get_question_list, data, (result) => {
                    this.question = result.question;
                    this.answer_list = result.answer_list;

                    this.isOwner = (this.question.uid === this.$ls.get(Constants.LocalStorage.uid));
                });
            },
            gotoResponse() {
                this.pushPage({
                    name: Constants.PageName.qaResponse,
                    query: {
                        id: this.question.id
                    }
                });
            },
            gotoAsk() {
                this.pushPage({
                    name: Constants.PageName.qaAsk,
                    qarams: {
                        type: 1
                    }
                });
            },
            like(index) {
                let data = {
                    q_id: this.$route.query.id,
                    a_id: this.answer_list[index].id,
                    c_id: 0
                };
                this.doRequest(Constants.Method.like, data, (result) => {
                    this.getData();
                });
            },
            collect() {
                if (this.question.is_collect) {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '已收藏'
                    });
                } else {
                    let data = {
                        q_id: this.$route.query.id,
                    };
                    this.doRequest(Constants.Method.favourites, data, (result) => {
                        this.getData();
                    });
                }
            },
            accept(index) {
                let data = {
                    q_id: this.$route.query.id,
                    a_id: this.answer_list[index].id,
                };

                this.doRequest(Constants.Method.adoption, data, (result) => {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '已采纳'
                    });
                    this.getData();
                });
            },
            onItemClick(index) {
                let data = {
                    q_id: this.$route.query.id,
                    a_id: this.answer_list[index].id
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
    @import "../assets/scss/px2rem";

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
            color: $fontcolor_gray;
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: px2rem(10) 0;
            border-bottom: px2rem(1) solid $divider;
            font-size: px2rem(12);
            div:nth-child(1):after {
                content: '•';
                padding: 0 px2rem(5);
            }
            div:nth-child(2):after {
                content: '•';
                padding: 0 px2rem(5);
            }
            div:nth-child(3) {
                flex-grow: 1;
            }
        }

        &-tags {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: px2rem(10);
            font-size: px2rem(12);
            .tag {
                color: $fontcolor_gray;
                border: px2rem(1) solid $fontcolor_gray;
                padding: px2rem(2) px2rem(5);
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
        }
        .view2 {
            color: $fontcolor_gray;
            font-size: px2rem(12);
            justify-content: flex-end;
            .like {
                display: flex;
                flex-direction: row;
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
        font-size: px2rem(12);
        color: #333333;
        background-color: white;
        display: -webkit-box;
        border-top: px2rem(1) solid $fontcolor_gray;
        div {
            flex-grow: 1;
            text-align: center;
            vertical-align: middle;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }
        > div:nth-child(1) {
            border-right: px2rem(1) solid $fontcolor_gray;
        }
        .icon {
            width: px2rem(15);
            height: px2rem(15);
            margin-right: px2rem(10);
        }
    }
</style>
