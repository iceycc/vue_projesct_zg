<template>
    <div class="page">
        <div class="sub-page" v-bind:style="style">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
        <mu-bottom-nav :value="bottomNav" @change="handleChange" ref="bottom">
            <mu-bottom-nav-item value="0" title="问答" icon="restore"/>
            <mu-bottom-nav-item value="1" title="课堂" icon="favorite"/>
            <mu-bottom-nav-item value="2" title="提问" icon="location_on"/>
            <mu-bottom-nav-item value="3" title="通知" icon="location_on"/>
            <mu-bottom-nav-item value="4" title="我的" icon="location_on"/>
        </mu-bottom-nav>
        <div class="mask" v-if="showAsk">
            <div class="btn-view">
                <div class="icon-view" @click="gotoAsk(0)">
                    <div style="visibility: hidden">
                        <div>更快更多更优质回答</div>
                        <div>查看更多<a href="">专属权利</a></div>
                    </div>
                    <img-wrapper :src="icon1" classStyle="icon" ></img-wrapper>
                    <div class="name">免费提问</div>
                </div>
                <div class="icon-view" @click="gotoAsk(1)">
                    <div>
                        <div>更快更多更优质回答</div>
                        <div>查看更多<a href="" @click.self="webpage">专属权利</a></div>
                    </div>
                    <img-wrapper :src="icon2" classStyle="icon" ></img-wrapper>
                    <div class="name">悬赏提问</div>
                </div>
            </div>
            <div class="close" @click="toggleAsk">X</div>
        </div>
    </div>
</template>

<script>
    import {Constants, EventBus, mixins} from '../assets/js/index';
    import ImgWrapper from "../components/ImgWrapper.vue";

    export default {
        components: {ImgWrapper},
        mixins: [mixins.base],
        name: 'main',
        data() {
            return {
                bottomNav: '1',
                icon1: require('../assets/img/icon_ask_free.png'),
                icon2: require('../assets/img/icon_ask.png'),
                showAsk: false,
                style: {}
            };
        },
        computed: {},
        created() {
        },
        mounted() {
            this.style = {
                height: (this.$el.offsetHeight - this.$refs['bottom'].$el.offsetHeight) + 'px'
            };
        },
        methods: {
            toggleAsk() {
                this.showAsk = !this.showAsk;
            },
            gotoAsk(type) {
                this.pushPage({
                    name: Constants.PageName.qaAsk,
                    params: {
                        type
                    }
                });
            },
            handleChange(value) {
                if (value == 2) {
                    this.toggleAsk();
                } else {
                    this.bottomNav = value;
                }
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/scss/px2rem";

    .sub-page {
        flex-grow: 1;
    }

    .mask {
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.79);
        position: absolute;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .btn-view {
            display: flex;
            flex-direction: row;

            .icon-view {
                display: flex;
                flex-direction: column;
                align-items: center;
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
        .close {
            position: absolute;
            bottom: 0;
            padding: px2rem(20) 0;
            width: 100%;
            font-size: px2rem(20);
            text-align: center;
            border-top: px2rem(1) solid $fontcolor_gray;
        }
    }
</style>
