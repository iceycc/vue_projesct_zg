<template>
    <div>
        <AppBar :title="title" style="text-align: center;text-indent: -30px"></AppBar>
        <!---->
        <section class="modle-1">
            <div class="pic-infos">
                <ul class="manager-infos">
                    <li>
                        <p class="role">{{profile.role}}
                            <img src="../../assets/img/mas_name_capa.png" alt="">
                            <img src="../../assets/img/mas_name_w.png" alt="">
                        </p>
                        <h2>{{profile.name}}</h2>
                    </li>
                    <li>从业时间 <b>{{profile.worktime}}</b>年</li>
                    <li>服务客户 <b>{{profile.service_num}}</b>个</li>
                    <li>客户好评率 <b>{{profile.good_rage}}</b></li>
                    <li class="label">
                        <span class="lable-item" v-for="item,index in profile.person_label">{{item}}</span>
                    </li>
                </ul>
                <div class="butler_logo">
                    <img :src="profile.headportrait" alt="">
                </div>
            </div>
            <p class="say">"{{profile.lifeword}}"</p>

        </section>
        <!--从业经历-->

        <section class="modle-2">
            <section class="undergo_title">
                <span>从业经历</span>
            </section>
            <p class="cyjl">
                {{profile.experience}}
            </p>

        </section>
        <!--专业解答-->
        <section class="modle-2">
            <section class="undergo_title">
                <span>专业解答</span>
            </section>
            <ul class="zyjd">
                <li v-for="item in answerArr">
                    <section class="question">
                        <div class="avatar">
                            <img :src="item.question.userp" alt="">
                        </div>
                        <p class="one-line">{{item.question.title}}</p>
                    </section>
                    <section class="answer">
                        <p><span class="one-line answer-word">{{item.content}}</span> <span class="more"
                                                                                            @click="goDetail(item.qid)">查看全文</span>
                        </p>
                        <div class="avatar">
                            <img :src="item.gjp" alt="">
                        </div>
                    </section>
                    <section class="footer">
                        <span class="time">{{item.question.Time || crtTime}}</span>
                        <!--点赞-->
                        <button class="like" v-bind:class="item.is_like == 1 ? 'liked' : ''"
                                @click.stop="like(item.id,item.is_like)"
                                :disabled="disabled"
                        >
                            <img-wrapper :url="item.is_like == 1 ? icon4 : icon3 "
                                         classStyle="icon"></img-wrapper>
                            {{item.laud}}
                        </button>
                    </section>
                </li>
            </ul>
            <p class="clickMore" @click="goMore()">点击查看更多</p>
        </section>
        <section class="qa-footer">
            <img src="../../assets/img/index_bottom_phone.png" alt="">
        </section>
    </div>
</template>

<script>
    import ImgWrapper from "../../components/commons/ImgWrapper.vue";
    import AppBar from "../../components/commons/AppBar.vue";
    import {EventBus, API, Constants, mixins, util} from '../../config/index'

    export default {
        name: "qaManagerDetail",
        data() {
            return {
                title: '管家-',
                icon3: require('../../assets/img/icon_detail_like.svg'),
                icon4: require('../../assets/img/icon_detail_liked.svg'),
                answerArr: [],
                disabled: false,
                id: '',
                profile: {
                    role: '',
                    name: '',
                    worktime: null,
                    service_num: null,
                    person_label: [],
                    lifeword: '',
                    good_rage: '',
                    experience: '',
                    headportrait: ''
                }
            }
        },
        components: {
            AppBar,
            ImgWrapper
        },
        created() {
            this.id = this.$route.query.id

            this.getManagerQaData()
            this.getManagerDetailData()
        },
        methods: {
            like(id, liked, type) {
                // console.log(type)
                // console.log(liked)
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
                                this.getManagerQaData()
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
                                this.getManagerQaData()
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

                                this.getManagerQaData()
                                timer = setTimeout(() => {
                                    this.disabled = false
                                }, 1000)
                            })
                            .catch((err) => {
                                // console.log(err);
                            })
                }
            },
            goMore() {
                this.$router.push({
                    name: Constants.PageName.qaManagerAskList,
                    query: {
                        id: this.id
                    }
                })
            },
            // 点击更多去问答详情
            goDetail(id) {
                this.$router.push({
                    name: Constants.PageName.qaDetail,
                    query: {
                        id
                    }
                })
            },
            // 管家问答列表
            getManagerQaData() {
                let data = {
                    uid: this.id
                }
                API.get(Constants.Method.keeperDetails, {params: data})
                    .then(result => {
                        console.log(result);
                        this.answerArr = result.data.slice(0, 2)
                    })
            },
            // 获取个管家个人信息
            getManagerDetailData() {
                API.post(Constants.Method.profile, {uid: this.id})
                    .then(result => {
                        let data = result.data
                        this.profile = {
                            role: data.levelname,
                            name: data.name,
                            worktime: data.worktime,
                            service_num: data.service_num,
                            person_label: data.person_label,
                            lifeword: data.lifeword,
                            good_rage: data.good_percent,
                            experience: data.experience,
                            headportrait: data.headportrait
                        }
                        this.title = '管家-' + data.name

                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";
    @import "../../assets/scss/util";

    p {
        padding: 0;
        margin: 0;
    }

    .sanjiao {
        position: absolute;
        top: 0;
        display: block;
        width: 0;
        height: 0;
        content: '';
        border: px2rem(12) solid #fff;
    }

    button {
        outline: none;
        border: none;
        background: #f4f4f4;
    }

    .undergo_title {
        width: 100%;
        height: px2rem(28);
        background: url("../../assets/img/undergo_title_bg.png") no-repeat;
        background-size: cover;
        color: #fff;
        padding-left: px2rem(42);
        font-size: px2rem(18);
        font-weight: bold;
        line-height: px2rem(28);
    }

    .modle-2 {

        .cyjl {
            padding: px2rem(20);
            color: #000;
            font: px2rem(14)/px2rem(27) "Microsoft Yahei";
        }
        .zyjd {
            padding: px2rem(20) px2rem(20) 0;
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
            li {
                background: #f4f4f4;
                border-radius: px2rem(5);
                padding: px2rem(15);
                margin-bottom: px2rem(15);

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
    }

    .modle-1 {
        margin-bottom: px2rem(20);

        .pic-infos {
            position: relative;
            width: 100%;
            height: px2rem(330);
            background: url("../../assets/img/header_bg.png") no-repeat;
            background-size: 100%;
            overflow: hidden;
            &:after {
                position: absolute;
                content: '';
                display: block;
                bottom: px2rem(-1);
                left: 0;
                width: 100%;
                background: url("../../assets/img/tltle_bot_bg.png") no-repeat;
                background-size: cover;
                height: px2rem(43);
            }
        }
        .butler_logo {
            position: absolute;
            bottom: px2rem(-30);
            right: 0;
            width: px2rem(193);
            img {
                width: 100%;
            }
        }
        .manager-infos {
            padding-top: px2rem(37);
            padding-left: px2rem(22.5);
            line-height: 1.7;
            width: px2rem(160);
            font-size: px2rem(15);
            font-weight: bold;
            color: #fff;
            .role {
                color: #ffc700;
                img {
                    width: px2rem(16);
                    vertical-align: middle;
                }
            }
            h2 {
                font-size: px2rem(40);
                color: #000;
                padding: 0;
                margin: 0;
                line-height: 1.5;
            }
            b {
                color: #ffc700;
            }

        }
        .label {
            span {
                display: inline-block;
                margin-right: px2rem(6);
                margin-bottom: px2rem(5);
                padding: px2rem(4) px2rem(4);
                border-radius: 2px;
                background: #565552;
                text-align: center;
                line-height: px2rem(15);
                font-size: px2rem(12);
            }

        }
        .say {
            padding: px2rem(10);
        }
    }

    .qa-footer {
        width: 100%;
        text-align: center;
        img {
            width: px2rem(154);
        }
    }

    .clickMore {
        padding: 0 0 px2rem(20);
        margin: 0;
        text-align: center;
        font-size: px2rem(18);
        color: #666;

    }


</style>