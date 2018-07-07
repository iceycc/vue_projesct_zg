<template>
    <div>
        <app-bar :title="title"></app-bar>
        <div class="box">
            <div class="title">
                <span class="z-left">精品案例</span>
                <span class="z-right">更多<img-wrapper :url="ico_arrow"
                                      classStyle="icon"></img-wrapper></span>

            </div>
            <ul class="jpal">
                <li>
                    <div class="jpal-img"><img src="" alt=""></div>
                    <p>小破屋也能整成温馨的家</p>
                </li>
                <li>
                    <div class="jpal-img"><img src="" alt=""></div>
                    <p>小破屋也能整成温馨的家</p>
                </li>
                <li>
                    <div class="jpal-img"><img src="" alt=""></div>
                    <p>小破屋也能整成温馨的家</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import AppBar from "../../components/commons/AppBar.vue";
    import ImgWrapper from "../../components/commons/ImgWrapper.vue";

    export default {
        name: "qaFind",
        data(){
            return {
                title:"发现",
                ico_arrow:require('../../assets/img/icon_user_arrow.svg')
            }
        },
        components:{
            ImgWrapper,
            AppBar
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";
    .box{
        background: #fff;
        margin-top: px2rem(10);
        padding: px2rem(10);
    }
    .title{
        display: flex;
        font-size: 0;
        .z-left{
            flex: 4;
            font-size: px2rem(14);
        }
        .z-right{
            flex: 1;
            text-align: right;
            font-size: px2rem(12);
            color: #999;
        }
        .icon{
            width: px2rem(8);
            vertical-align: top;
            margin-left: px2rem(5);
        }
    }
    .jpal{
        display: flex;
        padding-top:px2rem(20) ;
        li{
            width: px2rem(116);
            height: px2rem(116);
            background: #f5f5f5;
            margin-right: px2rem(5);
            border-radius: px2rem(5);
        }
        .jpal-img{
            width: 100%;
            height: px2rem(97);
        }
        p{
            font-size: px2rem(8);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            padding: 0;
            margin: 0;
            background-color: #﻿d5e6db;

        }
    }


</style>