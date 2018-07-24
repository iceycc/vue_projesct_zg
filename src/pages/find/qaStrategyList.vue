<template>
    <div class=" scroll-view">
        <AppBar title="装修攻略"></AppBar>
        <div class="view-list">
            <list-item
                    @onClick="goDetailPage"
                    v-for="item,index in 10"
                    :key="index"
                    class="list-item"
                    :title="gonglue.title"
                    :content="gonglue.content"
            ></list-item>
        </div>
    </div>
</template>

<script>
    import ListItem from "../../components/commons/ListItem";
    import AppBar from "../../components/commons/AppBar.vue";
    export default {
        name: "qaStrategyList",
        data(){
            return {
                gonglue: {
                    title: '1二手房卫生间改造，二手房卫生间攻略',
                    content: '2规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊',
                }
            }
        },
        components:{
            ListItem,
            AppBar
        },
        methods:{
            goDetailPage(){

            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/scss/px2rem';
    .view-list{
        padding: px2rem(10);
        .list-item{
            margin-bottom: px2rem(10);
        }
    }
    .scroll-view {
        height: 100%;
        overflow: scroll;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
    }

</style>