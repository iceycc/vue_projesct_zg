<template>
        <div class="mask" v-if="show">
            <div class="btn-view">
                <keep-alive>
                    <div class="icon-view">
                        <div style="visibility: hidden" class="msg-infos">
                            <div>更快更多更优质回答</div>
                            <div>查看更多<a href="">专属权利</a></div>
                        </div>
                        <div @click="gotoAsk(0)">
                            <img-wrapper :url="icon1" classStyle="icon"></img-wrapper>
                            <div class="name">免费提问</div>
                        </div>
                    </div>
                </keep-alive>
                <keep-alive>
                    <div class="icon-view">
                        <div style="visibility: hidden" class="msg-infos">
                            <div>更快更多更优质回答</div>
                            <div>查看更多<a href="javascript:;" @click.stop="webpage"
                                        style="text-decoration: underline;color:#328afb">专属权利</a>
                            </div>
                        </div>
                        <div @click="gotoAsk(1)">
                            <img-wrapper :url="icon2" classStyle="icon"></img-wrapper>
                            <div class="name">悬赏提问</div>
                        </div>
                    </div>
                </keep-alive>
            </div>
            <div class="ask-close">
                <img-wrapper classStyle="close" @onClick="toggleAsk" :url="icon_ask_close"></img-wrapper>
            </div>
        </div>
</template>

<script>
    import ImgWrapper from "../../components/commons/ImgWrapper.vue";
    import {Constants, mixins,EventBus} from '../../config/index';
    import {ifWX} from "../../config/util";

    export default {
        name: "ShowAsk",
        props:['showAsk'],
        components:{
            ImgWrapper
        },
        mixins: [mixins.base],
        data(){
            return {
                icon1: require('../../assets/img/icon_ask_free.png'),
                icon2: require('../../assets/img/icon_ask.png'),
                icon_ask_close: require('../../assets/img/icon_ask_close.svg'),
                show:false
            }
        },
        created(){
            // this.show = this.ShowAsk
        },
        // computed:{
        //     show(){
        //         return this.showAsk
        //     }
        // },
        watch:{
            showAsk(newVal){
                console.log(newVal);
                this.show = newVal
            }
        },
        methods:{
            webpage() {
                this.$router.push({name: Constants.PageName.qaDoc, params: {type: 2}})
            },
            toggleAsk() {
                this.show = false;
                EventBus.$emit('showAsk',false)
            },
            gotoAsk(type) {
                if(!ifWX() && type==1) {
                    EventBus.$emit(Constants.EventBus.showToast,{
                        message:'请关注优装美家公众号！'
                    })
                    return
                }
                EventBus.$emit('showAsk',false)
                this.show = false;
                // console.log(type)
                this.pushPage({
                    name: Constants.PageName.qaAsk,
                    query: {
                        type: type
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";
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