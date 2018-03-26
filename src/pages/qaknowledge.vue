<template>
    <div class="content">
        <div class="hot_word_view">
            <template v-for="item,index in categorys">
                <div class="hot_word" v-bind:class="{'hot_word_select' :category_index === index}"
                     @click="selectHotWord(index)">
                    {{item.name}}
                </div>
            </template>
        </div>

        <auto-list-view :url="url" :flag="flag" :isNeedDivider="false" @onItemClick="onItemClick">
            <template slot="item" slot-scope="props">
                <div class="card">
                    <div class="title-view">
                        <div class="title">{{props.item.title}}</div>
                        <span class="reward shadow"
                              v-if="parseFloat(props.item.q_reward) > 0">{{props.item.q_reward}}</span>
                    </div>
                    <div class="card-content">{{props.item.remark}}</div>
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

    import ComponentTemplate from "../components/template";
    import AutoListView from "../components/AutoListView";
    import ImgWrapper from "../components/ImgWrapper";

    export default {
        components: {
            ImgWrapper,
            AutoListView
        },
        mixins: [mixins.base, mixins.request],
        name: Constants.PageName.qaknowledge,
        data() {
            return {
                url: '',
                category_index: 0,
                categorys: [{
                    name: '推荐',
                }, {
                    name: '装修前',
                }, {
                    name: '装修中',
                }, {
                    name: '装修后',
                }],
                flag: null,
            };
        },
        computed: {},
        created() {
            this.selectHotWord(0);
        },
        methods: {
            getList(url) {
                this.url = url;
                this.flag = this.url;
            },
            onItemClick(item) {
                window.location.href = item.url;
                /*this.pushPage({
                    name: Constants.PageName.qaDetail,
                    query: {
                        id: item.id
                    }
                });*/
            },
            selectHotWord(index) {
                // todo
                this.category_index = index;

                if (this.category_index === 0) {
                    //信息列表
                    this.getList(Constants.Method.ketang_commend);
                } else {
                    //分类列表
                }

            },
            gotoSearch() {
                this.pushPage({
                    name: Constants.PageName.qaSearch
                });
            },
            openWeb(url) {
                window.location.href = url;
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
    }

    .hot_word_view {
        display: flex;
        flex-direction: row;
        align-items: center;
        overflow-y: auto;
        background-color: white;

        .hot_word {
            color: #333;
            flex-grow: 1;
            padding: px2rem(15) 0;
            margin: 0 px2rem(15);
            font-size: px2rem(13);
            text-align: center;
            white-space: nowrap;
            transition: font-size, color 0.2s, 0.2s;
            border-bottom: px2rem(2) solid #fff;
        }
        .hot_word_select {
            color: $mainColor;
            font-size: px2rem(13);
            border-bottom: px2rem(2) solid $mainColor;
        }
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
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
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
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
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
