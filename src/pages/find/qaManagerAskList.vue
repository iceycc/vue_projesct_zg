<template>
    <div style="height: 100%">
        <AppBar title="专业解答" style="position: fixed"></AppBar>
        <auto-list-view
                :url="url"
                type='managerlist'
                :isNeedDivider="false"
                :flag="flag"
                :ex_params="ex_params"
                :class="classStyle"
        >
            <template slot="item" slot-scope="props">
                <section class="zyjd">
                    <section class="question">
                        <div class="avatar">
                            <img :src="props.item.question.userp" alt="">
                        </div>
                        <p class="one-line">{{props.item.question.title}}</p>
                    </section>
                    <section class="answer">
                        <p><span class="one-line answer-word">{{props.item.content}}</span> <span class="more"
                                                                                                  @click="goDetail(props.item.qid)">查看全文</span>
                        </p>
                        <div class="avatar">
                            <img :src="props.item.gjp" alt="">
                        </div>
                    </section>
                    <section class="footer">
                        <span class="time">{{props.item.question.Time || crtTime}}</span>
                        <!--点赞-->
                        <button class="like" v-bind:class="props.item.is_like == 1 ? 'liked' : ''"
                                @click.stop="like(props.item.id,props.item.is_like)"
                                :disabled="disabled"
                        >
                            <img-wrapper :url="props.item.is_like == 1 ? icon4 : icon3 "
                                         classStyle="icon"></img-wrapper>
                            {{props.item.laud}}
                        </button>
                    </section>
                </section>
            </template>
        </auto-list-view>
    </div>
</template>

<script>
    import AppBar from "../../components/commons/AppBar.vue";
    import AutoListView from "../../components/commons/AutoListView";
    import {EventBus, API, Constants, util} from '../../config/index'

    export default {
        name: "qaManagerAskList",
        components: {
            AppBar,
            AutoListView,
        },
        data() {
            return {
                icon3: require('../../assets/img/icon_detail_like.svg'),
                icon4: require('../../assets/img/icon_detail_liked.svg'),
                id: '',
                url: '',
                flag: true,
                classStyle: 'classStyle',
                ex_params: {},
                disabled: false,
            }
        },
        mounted(){
            if (!util.ifWX()) {
                this.classStyle = 'classStyle padding-top60'
            }
        },
        created() {
            this.id = this.$route.query.id
            this.getList()
        },
        methods: {
            goDetail(id) {
                this.$router.push({
                    name: Constants.PageName.qaDetail,
                    query: {
                        id
                    }
                })
            },
            getList() {
                this.flag = Math.random()
                this.url = Constants.Method.keeperDetails + '&uid=' + this.id

            },
            like(id, liked, type) {
                // console.log(type)
                console.log(liked)
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
                    id: id,
                };
                switch (liked) {
                    case '1':
                        API.post(Constants.Method.un_like, data)
                            .then((result) => {
                                this.getList()
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
                                this.getList()
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

                                this.getList()
                                timer = setTimeout(() => {
                                    this.disabled = false
                                }, 1000)
                            })
                            .catch((err) => {
                                // console.log(err);
                            })
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";
    @import "../../assets/scss/util";

    button{
        outline: none;
        border: none;
        background: #f4f4f4;
    }
    .classStyle{
        width: 100%;
        padding: 0 px2rem(20);
    }
    .zyjd {
        width: 100%;
        background: #f4f4f4;
        border-radius: px2rem(5);
        padding: px2rem(15);
        margin-bottom: px2rem(15);
        .question, .answer {
            display: flex;
            height: px2rem(45);
            margin-bottom: px2rem(10);
            .avatar {
                width: px2rem(50);
                height: 100%;
                text-align: center;

            }
            img {
                display: inline-block;
                width: px2rem(38);
                height: px2rem(38);
                background: #dedede;
                border-radius: px2rem(19);
            }
            p {
                position: relative;
                flex: 1;
                background: #fff;
                height: px2rem(34);
                line-height: px2rem(34);
                margin-top: px2rem(2);
                padding-left: px2rem(15);
            }
        }
        .more {
            float: right;
            color: #6ab2f9;
            font-size: px2rem(13);
            font-weight: bold;
            padding-right: px2rem(10);

        }
        .question p {
            margin-left: px2rem(10);
        }
        .question p:before {
            position: absolute;
            display: block;
            content: '';
            left: px2rem(-16);
            top: px2rem(8.5);
            width: 0;
            height: 0;
            border: px2rem(8) solid #f4f4f4;
            border-right: px2rem(8) solid #fff;
        }
        .answer p {
            margin-right: px2rem(10);

        }
        .answer p:before {
            position: absolute;
            display: block;
            content: '';
            right: px2rem(-16);
            top: px2rem(8.5);
            width: 0;
            height: 0;
            border: px2rem(8) solid #f4f4f4;
            border-left: px2rem(8) solid #fff;
        }
        .answer-word {
            display: inline-block;
            width: px2rem(160);
        }
        .footer {
            display: flex;
            font-size: px2rem(12);

            .time {
                flex: 1;

                text-align: left;
            }
            .like {
                flex: 1;
                text-align: right;
            }
            .icon {
                vertical-align: middle;
                width: px2rem(14);
            }
            .liked {
                color: $fontcolor_red;
            }

        }
    }

    .padding-top60 {
        padding-top: px2rem(65);
    }
</style>