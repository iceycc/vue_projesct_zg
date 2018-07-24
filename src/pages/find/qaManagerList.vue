<template>
    <div class="scroll-view">
        <AppBar title="管家列表"></AppBar>
        <p v-text="msg"
           v-if="msgShow"
           style="text-align: center;background: #fff"></p>
        <div class="list">
            <ListItem
                    v-for="item,index in keeperArr"
                    :key="index"
                    type="list2"
                    :name="item.gjname"
                    :year="item.worktime"
                    :num="item.completed_num"
                    :rate="item.good_percent"
                    :telphone="item.mobile"
                    :avatar="item.personalphoto"
                    class="list-item"
            ></ListItem>
        </div>
    </div>
</template>

<script>
    import ListItem from "../../components/commons/ListItem";
    import AppBar from "../../components/commons/AppBar.vue";
    import {API, Constants} from '../../config/index'

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
                msg:'加载中。。。',
                msgShow:true

            }
        },
        components: {
            ListItem,
            AppBar
        },

        created() {
            this.getKeeperActiveList()
        },
        methods: {
            getKeeperActiveList() {
                let data = {}
                API.get(Constants.Method.keeperActive, data)
                    .then(result => {
                        let data = result.data
                        if(data.length ==0){
                            this.msg = '暂无数据'
                            return
                        }
                        this.msg = ''
                        this.msgShow = false
                        console.log(data);
                        this.keeperArr = data
                    })
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
</style>