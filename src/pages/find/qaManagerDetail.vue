<template>
    <div>
        <AppBar :title="title"></AppBar>
        <!---->
        <div class="modle-1">
            <div class="pic-infos">

            </div>
            <p class="say">"没有更好的承诺，只有更好的服务！让顾客更省心、省时、省钱、确保工作效率最大化。以专业的知识，贴心的服务和不懈的努力，来为您解决装修中的烦恼。"</p>

        </div>
        <!--从业经历-->
        <div class="modle-2">
                <div class="top">
                    <span class="mark">从业经历</span>
                </div>

        </div>
        <!--专业解答-->
        <div class="modle-3"></div>

    </div>
</template>

<script>
    import AppBar from "../../components/commons/AppBar.vue";
    export default {
        name: "qaManagerDetail",
        data(){
            return {
                title:'管家-王冰洋'
            }
        },
        components:{
            AppBar
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";
    .sanjiao{
        position: absolute;
        top: 0;
        display: block;
        width: 0;
        height: 0;
        content: '';
        border: px2rem(12) solid #fff;

    }
    .modle-2{

        .mark{
            position: relative;
            margin-left: px2rem(50);
            display: inline-block;
            width: px2rem(77);
            height: px2rem(24);
            background:#4fb4ff ;
            color:#fff;
            text-align: center;
            line-height: px2rem(24);
            font-size: px2rem(15);

            &:after{
               @extend .sanjiao;
               right: px2rem(-24);
                border-top: px2rem(12) solid #4fb4ff;
                border-left: px2rem(12) solid #4fb4ff;


            }
            &:before{
                @extend .sanjiao;
                left: px2rem(-24);
                border-bottom: px2rem(12) solid #4fb4ff;
                border-right: px2rem(12) solid #4fb4ff;
            }

        }
    }


</style>