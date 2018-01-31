<template>
    <div class="content">
        <app-bar :title="title"></app-bar>
        <div class="card-view">
            <span class="money">{{result.money}}</span>
            <div class="desc">提现金额(元)</div>
            <div class="line"></div>
            <div class="wechatinfo">
                <div class="status">您已绑定微信</div>
                <img-wrapper></img-wrapper>
                username
            </div>
        </div>
        <div style="flex-grow: 1"></div>
        <div class="btn-view">
            <div class="btn" @click="gotoWithdraw">确认提现</div>
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
        name: Constants.PageName.qaWithdraw,
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
            gotoWithdraw() {
                
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

    .card-view {
        background-color: white;
        margin: px2rem(15);
        border-radius: px2rem(2);
        text-align: center;
        .money {
            font-size: px2rem(50);
        }
        .line {
            height: px2rem(1);
            background-color: $divider;
            margin: px2rem(10) 0;
        }
        .wechatinfo {
            display: flex;
            flex-direction: row;
            padding: px2rem(10);
            .status {
                flex-grow: 1;
                text-align: left;
            }
        }
    }

    .desc {
        color: #CCC;
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
    }
</style>
