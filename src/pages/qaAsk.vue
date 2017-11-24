<template>
    <div class="content">
        <app-bar :title="title"></app-bar>
        <div class="form">
            <mu-text-field fullWidth :underlineShow="false" v-model="qa.title" hintText="请输入标题"/>

            <div class="line"></div>

            <mu-text-field fullWidth :underlineShow="false" v-model="qa.content" hintText="请描述您的问题（非必填）" fullWidth
                           multiLine :rows="6"/>

        </div>

        <div class="btn-submit" @click="submit">{{(type === 1 ? '支付¥' + parseFloat(qa.reward).toFixed(2) : '') + '进行提问'}}
        </div>

        <div class="mask" v-if="showMask">
            <div class="tip1">您已选择 <span class="money">{{qa.reward}}</span>元问题赏金 </div>

            <div class="slider" v-if="slider">
                <vue-slider-component
                        v-model="qa.reward"
                        :direction="slider.direction"
                        :height="slider.height"
                        :min="slider.min"
                        :max="slider.max"
                        :tooltip="false"
                        :processStyle="slider.processStyle"
                        :sliderStyle="slider.sliderStyle"
                        :bgStyle="slider.bgStyle"
                ></vue-slider-component>
            </div>
            <div class="tip2">
                <div>{{slider.min}}元</div>
                <div>{{slider.max}}元</div>
            </div>
            <div class="tip3">
                <div>使用付费服务您将获得</div>
                <div>1.至少1个金盘管家参与回答</div>
                <div>2.提问2h之内必回答</div>
            </div>

            <div class="btn" @click="toggleMask">去提问</div>
            <div class="tip4">付费提问前请阅读<a href="">提问须知</a></div>
        </div>
    </div>

</template>

<script>
    import {Constants, EventBus, mixins} from '../assets/js/index';

    import AppBar from "../components/AppBar.vue";
    import MuDivider from "../../node_modules/muse-ui/src/divider/divider.vue";
    import VueSliderComponent from "../../node_modules/vue-slider-component/src/vue2-slider.vue";

    export default {
        components: {
            VueSliderComponent,
            MuDivider,
            AppBar,
        },
        mixins: [mixins.base, mixins.request],
        name: Constants.PageName.qaIndex,
        data() {
            return {
                type: 0,//1付费
                qa: {
                    title: '',
                    content: '',
                    reward: 5,
                },
                showMask: false
            };
        },
        computed: {
            slider() {
                let height = 40;
                let size = 60;

                return {
                    direction: "horizontal",
                    width: "auto",// 组件宽度
                    height: height,
                    min: 1,
                    max: 10,
                    sliderStyle: {
                        //"backgroundColor": "#f05b72",
                        "backgroundImage": 'url(' + require('../assets/img/icon_slider.png') + ')',
                        "background-position": "center",
                        "background-size": "cover",
                        "width": size + "px",
                        "height": size + "px",
                        "top": (height - size) / 2 + "px",
                        "left": 0 + "px",
                    },
                    processStyle: {
                        "backgroundImage": "linear-gradient(to top, #11cdcd, #12ddca)",
                        "border-radius": height / 2 + "px",
                    },
                    bgStyle: {
                        "border-radius": height / 2 + "px",
                    },
                };
            }
        },
        created() {

        },
        activated() {
            if (this.$route.params && this.$route.params.type) {
                this.type = this.$route.params.type;
            }

            if (this.type === 1) {
                this.title = '悬赏问题';
                this.showMask = true;
            }

        },
        methods: {
            toggleMask() {
                this.showMask = !this.showMask;
            },
            submit() {
                let data = {
                    title: this.qa.title,
                    content: this.qa.content
                };

                if (this.type === 0) {
                    data.reward = 0;
                }

                this.doRequest(Constants.Method.ask_question, data, (result) => {
                    console.log(result);
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
