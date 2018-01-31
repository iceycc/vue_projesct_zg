<template>
    <div class="content">
        <app-bar :title="title"></app-bar>
        <div class="money-view">
            <div><span class="money">{{result.money}}</span>元</div>
            <div class="desc">金额超过10元可提现,今日还可体现1次</div>
            <div class="link" @click="gotoWalletDetail">钱包明细</div>
        </div>
        <div style="flex-grow: 1"></div>
        <div class="btn-view">
            <div v-if="result.money > 0" class="btn btn-white" @click="gotoAsk(1)">用于悬赏提问</div>
            <div v-if="result.money > 0" class="btn">提现</div>
            <div class="desc">仅支持提现至微信零钱</div>
        </div>
    </div>

</template>

<script>
    import {Constants, EventBus, mixins} from '../assets/js/index';

    import AppBar from "../components/AppBar.vue";
    import ComponentTemplate from "../components/template";
    import AutoListView from "../components/AutoListView";
    import ImgWrapper from "../components/ImgWrapper";

    export default {
        components: {
            ImgWrapper,
            AppBar,
            AutoListView
        },
        mixins: [mixins.base, mixins.request],
        name: Constants.PageName.qaWallet,
        data() {
            return {
                result: {}
            };
        },
        computed: {},
        created() {
            this.doRequest(Constants.Method.wallet, null, (result) => {
                this.result = result;
            });
        },
        methods: {
            gotoWalletDetail() {
                this.pushPage({
                    name: Constants.PageName.qaWalletDetail
                });
            },
            gotoAsk(type) {
                this.pushPage({
                    name: Constants.PageName.qaAsk,
                    params: {
                        type
                    }
                });
            },
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/scss/px2rem";

    .content {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .desc {
        color: #CCC;
    }

    .money-view {
        margin-top: px2rem(50);
        text-align: center;
        .money {
            font-size: px2rem(50);
            margin-right: px2rem(10);
        }
        .link {
            padding: px2rem(10);
            color: $mainColor;
        }
    }

    .btn-view {
        text-align: center;
        margin-bottom: px2rem(50);
        .btn {
            text-align: center;
            color: white;
            background-image: $bgImage;
            border-radius: px2rem(3);
            //background-color: #11cdcd;
            margin: px2rem(20) px2rem(20) 0 px2rem(20);
            padding: px2rem(10);
            font-size: px2rem(16);
            font-weight: bold;
        }

        .btn-white {
            background-image: none;
            color: #333;
            border: px2rem(1) #CCC solid;
        }

        .desc {
            margin-top: px2rem(10);
        }
    }


</style>
