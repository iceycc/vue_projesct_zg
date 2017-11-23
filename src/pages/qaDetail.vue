<template>
    <div class="content">
        <app-bar :title="title"></app-bar>
        <div class="card shadow" v-if="question">
            <div class="view1">
                <img-wrapper :src="question.avatar" classStyle="avatar"></img-wrapper>
                <div class="username">{{question.uname}}</div>
                <span class="reward shadow"
                > ¥{{question.q_reward}}</span>
            </div>
            <div class="card-title">{{question.title}}</div>
            <div class="card-content">{{question.content}}</div>
            <div class="view2">
                <div>{{question.pv}}浏览</div>
                <div>{{question.answer_num}}回答</div>
                <div>{{question.qtime}}</div>
            </div>
            <div class="card-tags">
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
                                <img-wrapper classStyle="avatar"></img-wrapper>
                                <div class="vertical-view">
                                    <div class="name">{{item.aname}} <span class="role">{{item.role}}</span></div>
                                    <div class="date">{{item.atime}}</div>
                                </div>
                                <div class="accept">采纳</div>
                            </div>
                            <div>{{item.content}}</div>
                            <div>re</div>
                            <div class="view2 horizontal-view">
                                <div v-if="item.like_num != 0" class="like">{{item.like_num}}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </mu-list>
        </div>

        <div class="footer horizontal-view">
            <div>去回答</div>
            <div>去提问</div>
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

    export default {
        components: {
            ImgWrapper,
            AppBar,
            AutoListView
        },
        mixins: [mixins.base, mixins.request],
        name: Constants.PageName.qaDetail,
        data() {
            return {
                question: {},
                flag: null,
                version: process.env.APP_VERSION,
                localValue: this.$ls.get(Constants.LocalStorage.test, '-1')
            };
        },
        computed: {},
        created() {
            let data = {
                q_id: this.$route.query.id,
                uid: 1300
            };

            this.doRequest(Constants.Method.get_question_list, data, (result) => {
                this.question = result.question;
                this.answer_list = result.answer_list;
            });
        },
        methods: {
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
            font-size: px2rem(16);
            color: #333;
            padding: px2rem(10) 0;
        }

        &-content {
            color: RGB(150, 150, 150);
            font-size: px2rem(16);
        }

        .view2 {
            color: $fontcolor_gray;
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: px2rem(10) 0;
            border-bottom: px2rem(1) solid $divider;
            div:nth-child(1):after {
                content: '•';
                padding: 0 px2rem(5);
            }
            div:nth-child(2) {
                flex-grow: 1;
            }
        }

        &-tags {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: px2rem(10);
            .tag {
                color: $fontcolor_gray;
                border: px2rem(1) solid $fontcolor_gray;
                padding: px2rem(5);
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
            .role {
                font-size: px2rem(12);
                padding: px2rem(2) px2rem(5);
                border-radius: px2rem(10);
                border: px2rem(1) solid #333;
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
            justify-content: flex-end;
        }
    }

    .footer {
        width: 100%;
        padding: px2rem(15) 0;
        background-color: white;
        display: -webkit-box;
        border-top: px2rem(1) solid $fontcolor_gray;
        div {
            flex-grow: 1;
            text-align: center;
        }
        > div:nth-child(1) {
            border-right: px2rem(1) solid $fontcolor_gray;
        }
    }
</style>
