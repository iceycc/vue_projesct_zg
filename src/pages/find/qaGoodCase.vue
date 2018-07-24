<template>
    <div>
        <ul class="tab">
            <li :class="{active:activeIndex==index}" @click="selectHandle(index)" v-for="item,index in tabs"
                :key="index">
                <a href="javascript:;">{{item}}</a>
            </li>
        </ul>
        <down-tabs-box
                ClassStyle="down"
                :datas="wordsData"
                :show="show"
        ></down-tabs-box>
        <p v-text="msg"
           v-if="msgShow"
           style="text-align: center;background: #fff"></p>
        <section>
            <list-item
                    type="list3"
                    v-for="item,index in classicData"
                    :key="index"
                    :classicData="item"
            ></list-item>
        </section>

    </div>
</template>

<script>
    import ListItem from "../../components/commons/ListItem";
    import DownTabsBox from "../../components/commons/DownTabsBox";
    import {Constants, EventBus, mixins, API} from '../../config/index';


    export default {
        name: "qaGoodCase",
        components: {
            DownTabsBox,
            ListItem
        },
        data() {
            return {
                msg:'加载中。。。',
                msgShow:true,
                activeIndex: 0,
                tabs: ['推荐', '风格', '户型', '造价'],
                show: {
                    ifshow: false
                },
                wordsData: [],
                wordArr: [
                    {}, {}, {}, {}
                ],
                classicData: [],
                tabType: 0,

                house: 0,
                space: 0,
                style: 0,
                cityid: 3360,
                page: 1,
            }
        },
        created() {
            EventBus.$on('onChange', (key) => {
                console.log(key);
                switch (Number(this.activeIndex)) {
                    case 0: // 推荐
                        this.house = 0
                        this.space = 0
                        this.style = 0
                        this.cityid = 3360
                        this.page = 1
                        break;
                    case 1: // 风格
                        this.house = 0
                        this.space = 0
                        this.style = key
                        this.cityid = 3360
                        this.page = 1
                        break
                    case 2: // 户型
                        this.house = key
                        this.space = 0
                        this.style = 0
                        this.cityid = 3360
                        this.page = 1
                        break
                    case 3: // 造价
                        this.house = 0
                        this.space = key
                        this.style = 0
                        this.cityid = 3360
                        this.page = 1
                        break
                    default:
                        break
                }
                this.getClassicListHandle()
            })
            this.getScreenHandle()
            this.getClassicListHandle()
        },
        methods: {
            getScreenHandle() {
                API.get(Constants.Method.getScreen, null)
                    .then(result => {
                        let data = result.data
                        this.wordArr[1] = data.house
                        this.wordArr[2] = data.space
                        this.wordArr[3] = data.style
                    })
            },
            getClassicListHandle() {
                let data = {
                    house: this.house,
                    space: this.space,
                    style: this.style,
                    cityid: this.cityid,
                    page: 1,
                }
                API.post(Constants.Method.getClassicList, data)
                    .then(result => {
                        let data =result.data
                        if(data.length ==0){
                            this.msg = '暂无数据'
                            return
                        }
                        this.msg = ''
                        this.msgShow = false
                        this.classicData = data
                    })
            },
            selectHandle(index) {
                // 0:推荐  1：风格  2：户型  3：造价
                this.activeIndex = index
                if (index == 0) {
                    this.house = 0
                    this.space = 0
                    this.style = 0
                    this.cityid = 3360
                    this.page = 1
                    this.getClassicListHandle()
                    this.show.ifshow = false
                    return
                }
                this.show.ifshow = true
                this.wordsData = this.wordArr[index]
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";

    .tab {
        display: flex;
        height: px2rem(40);
        li {
            flex: 1;
            text-align: center;
            height: 100%;

        }
        a {
            display: inline-block;
            width: px2rem(50);
            height: 100%;
            line-height: px2rem(40);
            color: #666;
        }
        .active a {
            border-bottom: 2px solid #0edda2;
            color: #0edda2;
        }
    }

    .down {
        position: absolute;
        top: px2rem(40);
    }

</style>