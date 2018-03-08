<template>
    <div class="content">
        <app-bar :title="title"></app-bar>
        <auto-list-view :url="url" :flag="flag" :isNeedDivider="false" @onItemClick="onItemClick">
            <template slot="item" slot-scope="props">
                <div class="card">
                    <div class="title-view">
                        <div class="title">{{props.item.title}}</div>
                        <span class="reward shadow"
                              v-if="parseFloat(props.item.q_reward) > 0">{{props.item.q_reward}}</span>
                    </div>
                    <div class="card-content">{{props.item.a_content}}</div>
                    <div class="footer-view">
                        <div class="avatar">
                            <img-wrapper v-for="avatar,index in props.item.avatar" :url="avatar" :key="index"
                                         classStyle="avatar"></img-wrapper>
                        </div>
                        <div class="pv">{{props.item.pv}}浏览</div>
                    </div>
                </div>
            </template>
        </auto-list-view>
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
        name: Constants.PageName.qaList,
        data() {
            return {
                url: ''
            };
        },
        computed: {},
        created() {
            let key_word = this.$route.query.key_word;
            if (key_word) {
                this.title=`搜索'${key_word}'`;
                this.url = Constants.Method.get_homepage + '&key_word=' + key_word;
                this.flag = this.url;
                return;
            }

            let type = this.$route.query.type;
            switch (parseInt(type)) {
                case 1:
                    this.title = '我的收藏';
                    this.getList(1);
                    break;
                case 2:
                    this.title = '我的问题';
                    this.getList(2);
                    break;
            }
        },
        methods: {
            // 获取列表url
            getList(type) {
                this.url = Constants.Method.get_homepage + '&type=' + type;
                this.flag = this.url;
            },
            onItemClick(item) {
                this.pushPage({
                    name: Constants.PageName.qaDetail,
                    query: {
                        id: item.id
                    }
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

    .card {
        background-color: white;
        width: 100%;
        padding: px2rem(10);
        border-radius: px2rem(3);
        .title-view {
            display: flex;
            flex-direction: row;
            align-items: center;
            .title {
                font-size: px2rem(16);
                flex-grow: 1;
            }
            .reward {
                font-size: px2rem(12);
                line-height: 1;
                background-color: RGB(255, 205, 0);
                color: white;
                padding: px2rem(4) px2rem(10);
                border-radius: px2rem(13);
            }
            .reward:before {
                content: '¥';
                font-size: px2rem(10);
            }
        }

        &-content {
            color: #666666;
            font-size: px2rem(14);
            padding: px2rem(10) 0;
            border-bottom: px2rem(1) solid $divider;
        }

        .footer-view {
            display: flex;
            flex-direction: row;
            align-items: center;
            color: $fontcolor_gray;
            padding-top: px2rem(10);
            font-size: px2rem(10);
            .avatar {
                flex-grow: 1;
            }
            .pv {
            }
        }
    }

</style>
