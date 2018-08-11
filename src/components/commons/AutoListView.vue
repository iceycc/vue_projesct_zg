<template>
    <div class="scroll-view">
        <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/>
        <!---->

        <mu-list v-if="type == 'list'">
            <slot name="swiper"></slot>
            <template v-for="item, index in data">
                <div class="item item_card" @click="onItemClick(index)">
                    <slot name="item" :item="item" :index="index" haha="c"></slot>
                </div>
                <mu-divider v-if="isNeedDivider"/>
            </template>
        </mu-list>

        <mu-list v-else-if="type == 'managerlist'">
            <template v-for="item, index in data">
                <div class="item" @click="onItemClick(index)">
                    <slot name="item" :item="item" :index="index"></slot>
                </div>
                <mu-divider v-if="isNeedDivider"/>
            </template>
        </mu-list>
        <!---->
        <div class="grid" v-else-if="type == 'grid'">
            <div v-for="item, index in data" @click="onItemClick(index)" v-bind:style="gridstyle">
                <div class="item">
                    <slot name="item" :item="item" :index="index"></slot>
                </div>
            </div>
        </div>
        <div class="grid" v-else-if="type == 'pics'">
            <div v-for="item, index in data" @click="onItemClick(index)" v-bind:style="gridstyle">
                <div class="item">
                    <slot name="item" :item="item" :index="index"></slot>
                </div>
            </div>
        </div>
        <div class="quetiosn-card" v-else-if="type == 'quetion'">
            <div v-for="item, index in data" @click="onItemClick(index)" v-bind:style="gridstyle">
                <div class="item">
                    <slot name="item" :item="item" :index="index"></slot>
                </div>
            </div>
        </div>
        <div class="empty-view" v-if="data.length === 0 && !loading">
            <div class="empty-message">{{emptyMsg}}</div>
        </div>
        <!--<mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" v-if="isMore"/>-->
        <mu-infinite-scroll v-if="isMore" :scroller="scroller" :loading="loading" @load="loadMore"
                            loadingText="正在加载中"/>
    </div>
</template>

<script>
    import {API, mixins, EventBus} from '../../config/index';
    // import minixs_request from '../assets/js/mixins/mixins-request';
    import ListItem from "./ListItem";


    const defaultStartPage = 1;

    export default {
        name: 'AutoListView',
        mixins: [mixins.wx],
        components: {
            ListItem
        },
        props: {
            ex_params: { // 用于接收额外的参数
                type: Object,
                default: function () {
                    return {}
                }
            },
            url: { // 接收
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'list'//grid
            },
            cols: {
                type: null,
                default: 3
            },
            //可以绑定页面的刷新值.比如tabIindex,type等值.当该值发生改变,listview将执行刷新.
            //notify 为空,默认不发起请求
            flag: { //
                type: null,
                default: true
            },
            isNeedLoadMore: {
                type: Boolean,
                default: true
            },
            isNeedDivider: { //
                type: Boolean,
                default: true
            },
            isTab: { // 判断是否是切换tab触发 数据改变 切换需要重制page
                type: null,
                default: false
            }
            // emptyMsg: {
            //   type: String,
            //   default: '正在加载中...'
            // }
        },
        data() {
            return {
                emptyMsg: '正在加载中...',
                scroller: null,
                scrollTop: 0,
                page: defaultStartPage,
                loading: false,
                isMore: true,
                data: [],
                refreshing: false,
                trigger: null,
            };
        },
        watch: {
            flag: function (val, oldVal) {
                console.log(val);
                if (val) {
                    this.refresh();
                } else {
                    this.init();
                }
            },
        },
        mounted() {
            this.trigger = this.$el;
            this.scroller = this.$el;
            this.scroller.onscroll = () => {
                this.scrollTop = this.scroller.scrollTop;
            };
        },
        activated() {
            if (this.scrollTop !== 0) {
                this.scroller.scrollTop = this.scrollTop;
            }
        },
        computed: {
            gridstyle() {
                let width = this.$el.childNodes[0].offsetWidth / this.cols;
                return {
                    width: width + 'px',
                    height: width + 'px',
                };
            }
        },
        created() {
            // console.log('list-12331')
            if (this.flag) {
                this.getData();
            }
        },
        methods: {
            onItemClick(index) {
                this.$emit('onItemClick', this.data[index], index);
            },
            init() {
                this.isMore = true;
                this.page = defaultStartPage;
                this.data = [];
            },
            getPicsData() {
                this.loading = true;
                API.post(this.url, null)
                    .then((result) => {
                        // console.log(result);
                    }).catch((err) => {
                    // console.log(err);
                })
            },
            getData() {
                this.loading = true;
                // 注意判断完成切换类型是点击顶部栏还是下拉触发的方式 用于区分分页还是点击热门标签切换。用于加载第n页时避免切换类型时page没有初始化
                if (this.isTab == true) {
                    this.init()
                }
                let param = {
                    page: this.page,
                };
                if (this.ex_params) {
                    param = Object.assign(this.ex_params, param)
                }
                if (this.$parent.handleParam) {
                    param = Object.assign(this.$parent.handleParam(), param);
                }
                API.post(this.url, param)
                    .then((result) => {
                        console.log(result);
                        result = result.data
                        if ('handleResult' in this.$parent) {
                            result = this.$parent.handleResult(result);
                        }
                        EventBus.$emit('isTab')
                        if(result){
                            this.data = this.data.concat(result);
                        }
                        // // console.log(result);
                        // // console.log(this.data);
                        // // console.log(this.data instanceof Array);
                        if (result.length === 0 || !result.length) {
                            this.isMore = false;
                            this.emptyMsg = '没有数据'
                            return
                        } else {
                            this.page = this.page + 1;
                        }
                        if (!this.isNeedLoadMore) {
                            this.isMore = false;
                        }
                        this.loading = false;

                    })
                    .catch((err) => {
                        this.loading = false;
                    });

            },
            loadMore() {
                // console.log('isMore')
                // console.log(this.isMore)
                if (this.isMore) {
                    this.loading = true
                    setTimeout(() => {
                        this.getData();
                        this.loading = false
                    }, 2000)
                }
            },
            refresh() {
                // console.log('refresh')
                this.refreshing = true
                setTimeout(() => {
                    this.init();
                    this.getData();
                    this.refreshing = false
                }, 500)
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "AutoListView";

    .mu-infinite-scroll {
        padding-top: 10px;
    }

    .item_card {
        margin: 0 px2rem(10) px2rem(15);
    }

</style>
