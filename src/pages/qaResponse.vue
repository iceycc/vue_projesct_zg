<template>
    <div class="content">
        <app-bar :title="title"></app-bar>
        <div class="form">
            <mu-text-field fullWidth :underlineShow="false" v-model="qa.content" hintText="回答问题将获得积分奖励" fullWidth
                           multiLine :rows="6"/>
        </div>

        <div class="btn-submit" @click="submit">发布
        </div>
    </div>

</template>

<script>
    import {Constants, EventBus, mixins} from '../assets/js/index';

    import AppBar from "../components/AppBar.vue";

    export default {
        components: {
            AppBar,
        },
        mixins: [mixins.base, mixins.request],
        name: Constants.PageName.qaIndex,
        data() {
            return {
                qa: {
                    content: '',
                },
            };
        },
        created() {

        },
        activated() {
        },
        methods: {
            toggleMask() {
                this.showMask = !this.showMask;
            },
            submit() {
                if (!this.qa.content) {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '内容不能为空'
                    });
                    return;
                }

                let data = {
                    q_id: this.$route.query.id,
                    content: this.qa.content
                };

                this.doRequest(Constants.Method.answer, data, (result) => {
                    this.qa.content = '';
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '发布成功'
                    });
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 2000);
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

</style>
