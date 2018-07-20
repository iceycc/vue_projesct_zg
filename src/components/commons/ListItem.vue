<template>
    <div class="list-item" @click="goDetail">
        <div class="left-img">
            <img src="" alt="">
        </div>
        <div class="right-box">
            <p class="title">{{title}}</p>
            <p class="content">{{content}}</p>
        </div>

    </div>
</template>

<script>
    import EventBus from "../../config/EventBus";

    export default {
        name: "ListItem",
        props:['title','content'],
        created(){

        },
        methods:{
            goDetail(){
                this.$emit('onClick')
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";
    @import "../../assets/scss/util";
    *{
        box-sizing: border-box;
    }
    p{
        margin: 0;
        padding: 0;
    }
    .list-item{
        width: 100%;
        height: px2rem(77);
        display: flex;
        .left-img{
            width: px2rem(107);
            height: 100%;
            background: #ccc;
            border-radius: px2rem(5);
        }
        .right-box{
            flex: 1;
            padding-left: px2rem(10);
        }
    }
    .title{
        @extend .one-line;
        width: px2rem(219);
        height: px2rem(42);
        font-size: px2rem(13);
        font-weight: bold;
        padding-top: px2rem(5);
    }
    .content{
        @include more-line(2);
        font-size: px2rem(9);
        color: #999;

    }



</style>