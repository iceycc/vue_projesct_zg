<template>
    <div class="content">
        <!--顶部关键词-->
        <div class="hot_word_view">
            <!--<div class="tags">-->
            <!--<template v-for="item,index in hot_words">-->

            <!--<div class="hot_word" v-bind:class="{'hot_word_select' :hot_words_index === index}"-->
            <!--@click="selectHotWord(index)">-->
            <!--{{item.name}}-->
            <!--</div>-->
            <!--</template>-->
            <!--<div class="hot_word_empty"></div>-->
            <!--</div>-->
            <div class="hot-word-box" @click="clickHotHandle">{{hotword}}
                <img-wrapper :url="!hotViewShow ? hot_words_pic[0] : hot_words_pic[1]"
                             classStyle="hot_img"></img-wrapper>
            </div>
            <div class="search-box">
                <input type="text" placeholder="搜索" v-model="search" @focus="searchFocusHandle">
                <img-wrapper :url="icon_search" classStyle="search_box_style"></img-wrapper>
            </div>
            <div @click="doSearch" class="go_search">
                <img-wrapper :url="icon_search" classStyle="search_style"></img-wrapper>
            </div>
        </div>
        <!--点击搜索的弹层-->
        <!--<transition name="fade">-->
            <div class="hot-view" id="hot-outdiv" v-show="hotViewShow">
                <div class="hot-view-box" id="hot-indiv">
                    <span v-for="word,index in hot_words" :key="index" :class="{active_hot_style:active_hot == index}" @click="doSelect(index,word.name)">{{word.name}}</span>
                </div>
            </div>
        <!--</transition>-->
        <!--搜索时的弹层-->
        <transition name="fade">

            <div class="search-view" v-show="searchViewShow" id="search-outdiv">
                <div id="search-indiv">

                    <div class="search-hotword" >

                        <div class="title">
                            <img-wrapper :url="icon_search_hot" classStyle="title_icon"></img-wrapper>
                            <span> 热门搜索</span>
                            <span style="float:right" @click="searchViewShow=false"> 关闭</span>
                        </div>
                        <div class="words">
                            <div v-for="item in words" @click="searchWord(item,true)">{{item}}</div>
                        </div>
                    </div>

                    <div class="search-hotword history" v-if="searchwords && searchwords.length > 0">
                        <div class="title">
                            <img-wrapper @onClick="remove(0)" :url="icon_search_histroy" classStyle="title_icon"></img-wrapper>
                            <span> 搜索历史</span>
                        </div>
                        <div class="list">
                            <div v-for="item,index in searchwords" v-if="index<=4">
                                <div class="name" @click="searchWord(item,false)">{{item}}</div>
                                <img-wrapper @onClick="remove(index)" :url="icon_search_close"></img-wrapper>
                            </div>
                        </div>
                        <div class="clear-all" @click="clickAllSearchHistory">清除全部</div>
                    </div>
                </div>

            </div>
        </transition>

        <!---->
        <!--  -->
        <!--{{text}}-->

        <auto-list-view
                :url="url"
                :flag="flag"
                @onItemClick="onItemClick"
                :isNeedDivider="false"
                :class="{isIndex0:hot_words_index === 0}"
                :isTab="isTab"
                :ex_params="ex_params"
        >
            <!--@SwipeLeft="onSwipeLeft"-->
            <!--@SwipeRight="onSwipeRight"-->
            <!--@SwipeDown="onSwipeDown"-->
            <!--@SwipeUp="onSwipeUp"-->
            <template slot="swiper">
                <swiper :options="swiperOption" ref="mySwiper" class="banner" v-if="hot_words_index === 0">
                    <swiper-slide v-for="item,index in banners" :key="index">
                        <img-wrapper :url="item.img" @onClick="openWeb(item.url)"
                                     classStyle="banner_img"></img-wrapper>
                    </swiper-slide>
                </swiper>
            </template>
            <template slot="item" slot-scope="props">
                <!--<v-touch-->
                <!--v-on:swipeleft="onSwipeLeft"-->
                <!--v-on:swiperight="onSwipeRight"-->
                <!--v-on:swiperdown="onSwipeDown"-->
                <!--:style="{width:'100%'}">-->

                <div class="card">
                    <!--标题-->
                    <div class="title-view">
                        <div class="title">{{props.item.title}}</div>
                        <!--金额 如果有的话显示-->
                        <span class="reward shadow"
                              v-if="parseFloat(props.item.q_reward) > 0">￥{{props.item.q_reward | chu100}}</span>
                    </div>
                    <!--内容-->
                    <div class="card-content">{{props.item.content}}</div>
                    <!--底部显示 头像+浏览数-->
                    <div class="footer-view">
                        <div class="avatar">
                            <img-wrapper v-for="avatar,index in props.item.avatar" :url="avatar" :key="index"
                                         classStyle="avatar"></img-wrapper>
                            <span class="text" v-if="props.item.avatar.length != 0">等回答了该问题</span>
                        </div>
                        <div class="pv">{{props.item.pv}}浏览</div>
                    </div>
                </div>
                <!--</v-touch>-->
            </template>

        </auto-list-view>
    </div>

</template>

<script>
    import {Constants, EventBus, mixins, API} from '../../config/index';
    import AutoListView from "../../components/commons/AutoListView";
    import ImgWrapper from "../../components/commons/ImgWrapper";

    export default {
        components: {
            ImgWrapper,
            AutoListView,
        },
        mixins: [mixins.base, mixins.wx],
        name: Constants.PageName.qaIndex,
        data() {
            return {
                hotword:'热门',
                active_hot:0,
                hot_keywords:[], //['热门','客厅','卧室','厨房','儿童房','卫生间','别墅','二手房装修','小户型','环保检测'],
                hotViewShow: false,
                searchViewShow:false,
                text: "1111",
                swiperOption: {
                    autoplay: 3000
                },
                ex_params: {},
                url: '',// 请求的地址
                banners: [],
                hot_words: [],
                hot_words_index: 0,
                icon_search: require('../../assets/img/icon_search2.svg'),
                hot_words_pic: [require('../../assets/img/hot-down.png'), require('../../assets/img/hot-up.png')],
                flag: null,
                version: process.env.APP_VERSION,
                localValue: this.$ls.get(Constants.LocalStorage.test, '-1'),
                swiper_i: 0,
                isTab: false,
                current_uid: null,
                words: [],
                searchwords: [],
                search: '',
                icon_search_close: require('../../assets/img/icon_search_close.svg'),
                icon_search_histroy: require('../../assets/img/icon_search_histroy.svg'),
                icon_search_hot: require('../../assets/img/icon_search_hot.svg'),
            };
        },
        filter: {},
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper
            }
        },
        created() {
            this.current_uid = window.localStorage.getItem('uid')
            // console.log('index created')
            this.init()
            this.initWX(() => {
                this.fenXiang({
                    title: '诸葛装修，全方位解决您的装修问题',
                    imgUrl: 'http://image1.uzhuang.com/zhuge-logo.png'
                }, function () {
                    // console.log('fenXiang');
                })
                // console.log('wx success');
            });
            this.initSeachView()

        },
        updated() {
            EventBus.$on('isTab', () => {
                this.isTab = false
            })
        },
        methods: {
            init() {
                this.getHotWords()
                API.post(Constants.Method.get_banner_list, {})
                    .then((result) => {
                        this.banners = result.data;
                    })
                    .catch((err) => {
                        // console.log(err);
                    })

                API.post(Constants.Method.get_hot_words, {})
                    .then((result) => {
                        // console.log('result');
                        this.hot_words = this.hot_words.concat(result.data);
                        this.getList();
                    })
                    .catch((err) => {
                        // console.log(err);
                    })
            },
            searchFocusHandle(){
                this.hotViewShow=false;
                this.searchViewShow = true
                if(this.searchViewShow){
                    this.outClickHandle('search-indiv','search-outdiv',() => {
                        this.searchViewShow = false
                        // outDiv.removeEventListener('click')
                    })
                }
            },
            clickHotHandle(){
                this.searchViewShow = false ;
                this.hotViewShow = !this.hotViewShow;
                if(this.hotViewShow){
                    this.outClickHandle('hot-indiv','hot-outdiv',() => {
                        this.hotViewShow = false
                        // outDiv.removeEventListener('click')
                    })
                }
            },
            outClickHandle(inDivId,outDivId,callback){
                // 点击外层
                let inDiv = document.getElementById(inDivId)
                let outDiv = document.getElementById(outDivId)
                console.log(inDiv,outDiv);

                outDiv.addEventListener('click',()=>{
                    callback && callback(outDiv)
                })
                inDiv.addEventListener('click',function (e) {
                    e = e || window.event
                    e.stopPropagation()
                })
            },
            //
            getHotWords(){
                API.post(Constants.Method.hot_search, {})
                    .then((result) => {
                        this.hot_keywords = result.data;
                    })
                    .catch((err)=>{
                        // console.log(err);
                    });
            },
            // onSwipeLeft() {
            //     this.swiper_i++;
            //     if (this.swiper_i == this.hot_words.length - 1) {
            //         this.swiper_i = this.hot_words.length - 2
            //         return
            //     }
            //     this.selectHotWord(this.swiper_i)
            // },
            // onSwipeRight() {
            //     this.swiper_i--;
            //     if (this.swiper_i == -1) {
            //         this.swiper_i = 0
            //         return
            //     }
            //     this.selectHotWord(this.swiper_i)
            // },
            // onSwipeDown($event) {
            //     // console.log($event)
            // },
            // onSwipeUp() {
            //
            // },
            getList(isTab) {
                this.url = Constants.Method.get_homepage;
                this.ex_params = { // 用于传递额外的参数
                    id: this.hot_words[this.hot_words_index].id
                }
                this.isTab = isTab || false;
                this.flag = this.url + '&hot_words_id=' + this.hot_words[this.hot_words_index].id;
            },
            onItemClick(item) {
                this.pushPage({
                    name: Constants.PageName.qaDetail,
                    query: {
                        id: item.id,
                        uid: this.current_uid
                    }
                });
            },

            doSearch() {
                this.search = this.search.replace(/^\s+|\s+$/g, "");
                if (!this.search) {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '不能为空'
                    });
                    return;
                }
                this.searchwords.unshift(this.search);
                this.$ls.set(Constants.LocalStorage.searchHistory, this.searchwords);
                this.pushPage({
                    name: Constants.PageName.qaList,
                    query: {
                        key_word: this.search
                    }
                });
                this.search = '';
            },

            // gotoSearch() {
            //     this.pushPage({
            //         name: Constants.PageName.qaSearch
            //     });
            // },
            openWeb(url) {
                window.location.href = url;
            },
            doSelect(index,word){
                this.hotword = word
                this.active_hot = index
                this.hot_words_index = index;
                this.getList(true);
                this.hotViewShow = false
            },

        //    search-view
            initSeachView(){
                let temp = this.$ls.get(Constants.LocalStorage.searchHistory);
                if (temp) {
                    this.searchwords = temp.split(',');
                } else {
                    this.searchwords = [];
                }
                let data ={
                }
                API.post(Constants.Method.hot_search, {})
                    .then((result) => {
                        this.words = result.data;
                    })
                    .catch((err)=>{
                        // console.log(err);
                    });
            },
            clickAllSearchHistory(){
                // console.log(11)
                this.$ls.remove(Constants.LocalStorage.searchHistory)
                this.searchwords = []
            },
            searchWord(word, issave) {
                if (issave) {
                    if (this.searchwords.indexOf(word) !== -1) {
                        this.searchwords.splice(this.searchwords.indexOf(word), 1);
                    }
                    this.searchwords.unshift(word);
                    this.$ls.set(Constants.LocalStorage.searchHistory, this.searchwords);
                }

                this.pushPage({
                    name: Constants.PageName.qaList,
                    query: {
                        key_word: word
                    }
                });
            },
            doSearch() {
                this.search = this.search.replace(/^\s+|\s+$/g, "");
                if (!this.search) {
                    EventBus.$emit(Constants.EventBus.showToast, {
                        message: '不能为空'
                    });
                    return;
                }
                this.searchwords.unshift(this.search);
                this.$ls.set(Constants.LocalStorage.searchHistory, this.searchwords);
                this.pushPage({
                    name: Constants.PageName.qaList,
                    query: {
                        key_word: this.search
                    }
                });
                this.search = '';
            },
            remove(index) {
                this.searchwords.splice(index, 1);
                this.$ls.set(Constants.LocalStorage.searchHistory, this.searchwords);
            },
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 11-->
<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";

    .content {
        position: relative;
        background-color: $divider;
        height: 100%;
        padding-top: px2rem(55);
    }

    .scroll-view {
        &.isIndex0 {
            max-height: 100% !important;
        }
    }

    .banner {

        font-size: 0;
        vertical-align: middle;
        height: px2rem(154);
        background-color: white;
        margin-bottom: px2rem(12);
        .banner_img {
            height: 100%;
            width: 100%;
        }
    }

    .hot-view {
        position: absolute;
        width: 100%;
        top: px2rem(54);
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        .hot-view-box {
            background: #fff;
            padding-top: px2rem(25);
            padding-bottom: px2rem(25);
            padding-left: px2rem(19);
        }
        span {
            display: inline-block;
            width: px2rem(70);
            height: px2rem(34);
            margin-right: px2rem(14);
            margin-bottom: px2rem(10);
            text-align: center;
            line-height: px2rem(34);
            border: 1px solid #dcdcdc;
            font-size: px2rem(1.2);
            border-radius: px2rem(0.1);
            color:#333;
            &:nth-child(4n) {
                margin-right: 0;
            }
            &.active_hot_style{
                border: 1px solid #0edda2;
                color: #0edda2;
            }
        }
    }

    .hot_word_view {
        position: fixed;
        display: flex;
        top: 0;
        width: 100%;
        height: px2rem(54);
        flex-direction: row;
        align-items: center;
        overflow-x: auto;
        z-index: 100;
        margin-right: px2rem(25);
        background-color: white;
        .hot-word-box {
            font-size: px2rem(15);
            padding-left: 10px;
            padding-right: 5px;
            .hot_img {
                margin-left: px2rem(3);
                width: px2rem(8);
                height: px2rem(8);
            }

        }

        .search-box {
            position: relative;
            flex:1;
            height: px2rem(30);
            padding-right: px2rem(10);
            .search_box_style {
                position: absolute;
                width: px2rem(13);
                top: px2rem(3);
                left: px2rem(10);
                opacity: 0.2
            }
            input {
                padding-left: px2rem(30);
                width: 100%;
                height: 100%;
                border: 1px solid #f1f2f3;
                border-radius: px2rem(14);
                background: #f1f2f3;
            }
        }

        .go_search {
            width: px2rem(50);
            height: px2rem(54);
            background: #fff;
            text-align: center;
            padding-top: px2rem(13);

        }

        .tags {
            display: flex;
            flex-direction: row;
            flex-grow: 1;
        }

        .hot_word {
            height: px2rem(54);
            color: #333;
            padding: 0 px2rem(15);
            font-size: px2rem(13);
            box-sizing: border-box;
            white-space: nowrap;
            transition: font-size, color 0.2s, 0.2s;
            line-height: px2rem(50);
        }
        .hot_word_empty {
            width: px2rem(50);
        }
        .hot_word_select {
            color: $mainColor;
            font-size: px2rem(16);
            font-weight: bold;
            border-bottom: px2rem(2) solid $mainColor;
        }
    }

    .card {
        background-color: white;
        width: 100%;
        padding: px2rem(10);
        border-radius: px2rem(4);

        .title-view {
            display: flex;
            flex-direction: row;
            align-items: center;
            .title {
                font-size: px2rem(16);
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .reward {
                font-size: px2rem(12);
                line-height: 1;
                background-color: RGB(255, 205, 0);
                color: white;
                padding: px2rem(4) px2rem(10);
                border-radius: px2rem(13);
                margin-left: px2rem(15);
            }
        }

        &-content {
            color: #666666;
            font-size: px2rem(14);
            padding-top: px2rem(10);
            margin-bottom: px2rem(10);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        }

        .footer-view {
            display: flex;
            flex-direction: row;
            align-items: center;
            color: $fontcolor_gray;
            padding-top: px2rem(10);
            font-size: px2rem(10);
            border-top: px2rem(1) solid $divider;

            .avatar {
                flex-grow: 1;
                vertical-align: middle;

                text {
                    height: 100%;
                    vertical-align: middle;
                }
            }
            .pv {
            }
        }
    }
    /*search view*/

    .search-view {
        position: absolute;
        background-color: rgba(0,0,0,0.5);
        height: 100%;
        display: flex;
        z-index: 9999;
        flex-direction: column;
    }


    .clear-all {
        padding-top: px2rem(10);
        text-align: center;
        font-size: px2rem(14);
        color:#999;
    }

    .search-hotword {
        background-color: white;

        margin: px2rem(10);
        padding: px2rem(10);
        border-radius: px2rem(5);
        &.history{
            max-height:60%;
            overflow-y: scroll;
        }
        .title {
            /*font-size: px2rem(0);*/
            vertical-align: top;
            border-bottom: px2rem(1) solid $divider;
            padding: 0 0 px2rem(10) 0;
            vertical-align: middle;
            span {
                font-size: px2rem(15);
                vertical-align: middle;
            }
            .title_icon {
                vertical-align: middle;
                width: px2rem(18);
                height: px2rem(18);
            }
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
                    overflow-x:hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }

        }
    }

    /* */

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

</style>
