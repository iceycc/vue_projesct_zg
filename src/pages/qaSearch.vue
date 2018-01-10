<template>
    <div class="content">
        <div class="search-view">
            <div class="inputClass">
                <mu-text-field fullWidth :underlineShow="false" v-model="search" hintText="搜索"/>
            </div>
            <mu-flat-button label="搜索" class="demo-flat-button" @click="doSearch"/>
        </div>

        <div class="search-hotword">
            <div class="title">热门搜索</div>
            <div class="words">
                <div v-for="item in words">{{item}}</div>
            </div>
        </div>

        <div class="search-hotword" v-if="searchwords && searchwords.length > 0">
            <div class="title">搜索历史</div>
            <div class="list">
                <div v-for="item,index in searchwords">
                    <div class="name">{{item}}</div>
                    <div @click="remove(index)">X</div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import {Constants, EventBus, mixins} from '../assets/js/index';

    import AppBar from "../components/AppBar.vue";

    export default {
        components: {
            AppBar,
        },
        mixins: [mixins.base, mixins.request],
        name: Constants.PageName.qaSearch,
        data() {
            return {
                words: [],
                searchwords: [],
                search: ''
            };
        },
        created() {
            let temp = this.$ls.get(Constants.LocalStorage.searchHistory);
            if (temp) {
                this.searchwords = temp.split(',');
            } else {
                this.searchwords = [];
            }

            this.doRequest(Constants.Method.hot_search, null, (result) => {
                this.words = result;
            });

        },
        activated() {
        },
        methods: {
            doSearch() {
                this.searchwords.unshift(this.search);
                this.$ls.set(Constants.LocalStorage.searchHistory, this.searchwords);

                this.search = '';
            },
            remove(index) {
                this.searchwords.splice(index, 1);
                this.$ls.set(Constants.LocalStorage.searchHistory, this.searchwords);
            },
            toggleMask() {
                this.showMask = !this.showMask;
            },
            submit() {
                if (!this.qa.content) {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '内容不能为空'
                    });
                    return;
                }

                let data = {
                    q_id: this.$route.query.id,
                    content: this.qa.content
                };

                this.doRequest(Constants.Method.answer, data, (result) => {
                    this.qa.content = '';
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '发布成功'
                    });
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 2000);
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

    .search-view {
        background-color: white;
        display: flex;
        flex-direction: row;
        align-items: center;
        .inputClass {
            flex-grow: 1;
            background-color: $divider;
            border-radius: px2rem(20);
            padding-left: px2rem(20);
            margin: px2rem(10);
        }
    }

    .search-hotword {
        background-color: white;
        margin: px2rem(10);
        padding: px2rem(10);
        border-radius: px2rem(5);
        .title {
            border-bottom: px2rem(1) solid $divider;
            padding: 0 0 px2rem(10) 0;
        }
        .words {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            padding: px2rem(10) 0 0 0;
            & > div {
                border: px2rem(1) solid $divider;
                border-radius: px2rem(20);
                padding: px2rem(2) px2rem(10);
                margin-right: px2rem(10);
                margin-bottom: px2rem(10);
            }
        }
        .list {
            display: flex;
            flex-direction: column;
            & > div {
                border-bottom: px2rem(1) solid $divider;
                padding: px2rem(10) 0;
                display: flex;
                flex-direction: row;
                .name {
                    flex-grow: 1;
                }
            }

        }
    }

</style>
