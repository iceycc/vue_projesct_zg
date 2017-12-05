<template>
    <div class="content">
        <app-bar :title="title"></app-bar>

        <div>
            <div class="user-view">
                <img-wrapper src="https://wx1.sinaimg.cn/mw1024/712706afgy1fk4cvufqwsj20nx0zw47h.jpg"
                             classStyle="avatar"></img-wrapper>
                <div class="username">asdasda</div>
            </div>
            <div class="menu">
                <div class="item">
                    <img-wrapper :src="icon_fav" classStyle="icon"></img-wrapper>
                    <div class="name">我的收藏</div>
                    <div class="num">12</div>
                    <div class="arrow"></div>
                </div>
                <div class="divider"></div>
                <div class="item">
                    <img-wrapper :src="icon_qu" classStyle="icon"></img-wrapper>
                    <div class="name">我的问题</div>
                    <div class="num">12</div>
                    <div class="arrow"></div>
                </div>
                <div class="divider"></div>
                <div class="item">
                    <img-wrapper :src="icon_wallet" classStyle="icon"></img-wrapper>
                    <div class="name">我的钱包</div>
                    <div class="num">12</div>
                    <div class="arrow" style="visibility: hidden"></div>
                </div>
            </div>

        </div>

    </div>

</template>

<script>
    import {Constants, EventBus, mixins} from '../assets/js/index';

    import AppBar from "../components/AppBar.vue";
    import MuDivider from "../../node_modules/muse-ui/src/divider/divider.vue";
    import VueSliderComponent from "../../node_modules/vue-slider-component/src/vue2-slider.vue";
    import ImgWrapper from "../components/ImgWrapper.vue";

    export default {
        components: {
            ImgWrapper,
            AppBar,
        },
        mixins: [mixins.base, mixins.request],
        name: Constants.PageName.qaUser,
        data() {
            return {
                icon_wallet: require('../assets/img/icon_user_wallet.svg'),
                icon_qu: require('../assets/img/icon_user_qu.svg'),
                icon_fav: require('../assets/img/icon_user_fav.svg')
            };
        },
        created() {
        },
        activated() {
        },
        methods: {}
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

    .user-view {
        display: flex;
        flex-direction: row;
        align-items: center;
        background-image: $bgImage;
        margin: px2rem(10);
        padding: px2rem(20);
        border-radius: px2rem(5);
        .avatar {
            height: px2rem(80);
            width: px2rem(80);
            background-color: white;
            padding: px2rem(3);
            border-radius: 50%;
        }
        .username {
            margin-left: px2rem(10);
            font-size: px2rem(18);
            font-weight: bold;
            color: white;
        }
    }

    .menu {
        display: flex;
        flex-direction: column;
        margin: px2rem(20) px2rem(10) px2rem(10) px2rem(10);
        padding: 0 px2rem(10);
        border-radius: px2rem(5);
        background-color: white;
        .item {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: px2rem(20) 0;
            .icon {
                width: px2rem(25);
                height: px2rem(25);
                margin-right: px2rem(15);
            }
            .name {
                font-size: px2rem(14);
                flex-grow: 1;
            }
            .num {
                font-weight: bold;
            }
            .arrow:before {
                content: '>';
                margin-left: px2rem(10);
            }
        ;
        }
        .divider {
            height: px2rem(1);
            background-color: #CCC;
        }
    }
</style>
