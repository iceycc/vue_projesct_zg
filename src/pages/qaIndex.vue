<template>
    <div class="content">
        <div class="hot_word_view">
            <div v-for="item,index in hot_words">
                <div class="hot_word" v-bind:class="{'hot_word_select' :hot_words_index === index}"
                     @click="selectHotWord(index)">
                    {{item.name}}
                </div>
            </div>
        </div>
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
                        <div class="avatar">[用户回答头像]</div>
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

    export default {
        components: {
            AutoListView
        },
        mixins: [mixins.base, mixins.request],
        name: Constants.PageName.qaIndex,
        data() {
            return {
                hot_words: [],
                hot_words_index: 2,
                flag: null,
                version: process.env.APP_VERSION,
                localValue: this.$ls.get(Constants.LocalStorage.test, '-1')
            };
        },
        computed: {},
        created() {
            this.doRequest(Constants.Method.get_banner_list, null, (result) => {
                console.log(result);
            });

            this.doRequest(Constants.Method.get_hot_words, null, (result) => {
                this.hot_words = this.hot_words.concat(result);
                this.getList();
            });
        },
        methods: {
            getList() {
                this.url = Constants.Method.get_homepage + '&hot_words_id=' + this.hot_words[this.hot_words_index].id;
                this.flag = this.url;
            },
            onItemClick(item) {
                this.pushPage({
                    name: Constants.PageName.qaDetail,
                    query: {
                        id: item.id
                    }
                });
            },
            selectHotWord(index) {
                this.hot_words_index = index;
                this.getList();
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
        overflow-y: auto;
        padding-right: px2rem(15);
        background-color: white;
        .hot_word {
            color: #333;
            padding: px2rem(15) 0;
            margin: 0 px2rem(15);
            font-size: px2rem(13);
            white-space: nowrap;
            transition: font-size, color 0.2s, 0.2s;
        }
        .hot_word_select {
            color: $mainColor;
            font-size: px2rem(15);
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
