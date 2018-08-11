<template>
    <div style="height: 100%">
        <AppBar title="管家列表" style="position: fixed"></AppBar>
        <auto-list-view
                :url="url"
                type='managerlist'
                @onItemClick="goDetail"
                :isNeedDivider="false"
                :flag="flag"
                :class="classStyle"
        >
            <template slot="item" slot-scope="props">
                <ListItem
                        type="list2"
                        :name="props.item.gjname"
                        :year="props.item.worktime"
                        :num="props.item.completed_num"
                        :rate="props.item.good_percent"
                        :telphone="props.item.mobile"
                        :avatar="props.item.personalphoto"
                        :level ="props.item.level"
                        class="list-item"
                ></ListItem>
            </template>
        </auto-list-view>
        </div>
</template>

<script>
    import ListItem from "../../components/commons/ListItem";
    import AppBar from "../../components/commons/AppBar.vue";
    import {API, Constants} from '../../config/index'
    import {ifWX} from "../../config/util";
    import AutoListView from "../../components/commons/AutoListView";
    import {px2rem} from "../../config/util";

    export default {
        name: "qaNanagerList",
        data() {
            return {
                managerData: [{
                    name: '王冰洋',
                    year: '6',
                    num: '33',
                    rate: '30%',
                    telphone: 15621185521
                }],
                keeperArr: [],
                msg: '加载中。。。',
                msgShow: true,

                scroller: null,
                loading: false,
                isMore: true,
                page: 1,

                url: '',
                flag: '',

                classStyle:'list'

            }
        },
        components: {
            AutoListView,
            AppBar,
            ListItem

        },

        created() {
            this.getKeeperActiveList()
        },
        mounted() {
            if (!ifWX()) {
                this.classStyle = 'list padding-top60'
            }
        },
        methods: {
            goDetail(item) {
                this.$router.push({name: 'qamanagerdetail', query: {id:item.id}})
            },
            getKeeperActiveList() {
                this.url = Constants.Method.keeperActive
                this.flag = this.url
                // this.loading = true;
                // let data = {
                //     page: this.page
                // }
                // API.get(Constants.Method.keeperActive, {params:data})
                //     .then(result => {
                //         let data = result.data
                //         // data没数据
                //         if (data && data.length == 0) {
                //             this.msg = '暂无数据'
                //             this.isMore = false
                //         }else {
                //             this.msg = ''
                //             this.msgShow = false
                //             this.keeperArr = data
                //             this.page += 1
                //         }
                //         this.loading = false
                //     })
            },

        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";

    .list {
        background: #f2f2f2;
        padding: px2rem(10);
    }

    .list-item {
        margin-bottom: px2rem(10);
    }

    .scroll-view {
        height: 100%;
        overflow: scroll;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
    }

    .padding-top60 {
        padding-top: px2rem(56);
    }
</style>