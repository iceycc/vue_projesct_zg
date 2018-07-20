<!--suppress ALL -->
<template>
    <div>
        <app-bar :title="title"></app-bar>
        <!--精品案例-->
        <div class="box" style="margin-top: 3px">
            <div class="title">
                <h4 class="z-left">精品案例</h4>
                <span class="z-right" @click="goPages('qaknowledge')">更多<img-wrapper :url="ico_arrow"
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
        <!--活跃管家-->
        <div class="box">
            <div class="title">
                <h4 class="z-left">活跃管家</h4>
                <span class="z-right">更多<img-wrapper :url="ico_arrow"
                                                     classStyle="icon"></img-wrapper></span>
            </div>
            <div class="box2">
                <ul class="hygj">
                    <li v-for="item in 6">
                        <div class="jpal-img"><img src="" alt=""></div>
                        <h4 class="name">文丑</h4>
                        <p class="info">从业经验5年</p>
                        <p class="info">服务客户887个</p>
                        <a class="btn" href="tel:15621185521">联系</a>
                    </li>

                </ul>
            </div>
        </div>
        <!--装修攻略-->
        <div class="box" style="margin-bottom: 40px">
            <div class="title">
                <h4 class="z-left">装修攻略</h4>
                <span class="z-right" @click="goPages('qastrategylist')">更多<img-wrapper :url="ico_arrow"
                                                     classStyle="icon"></img-wrapper></span>
            </div>

            <div style="padding-top: 10px;font-size: 0">
                <list-item
                        @onClick="goDetailPage"
                        v-for="item,index in 4"
                        :key="index"
                        class="list-item"
                        :title="gonglue.title"
                        :content="gonglue.content"
                ></list-item>
            </div>
        </div>
    </div>
</template>

<script>
    import AppBar from "../../components/commons/AppBar.vue";
    import ImgWrapper from "../../components/commons/ImgWrapper.vue";
    import ListItem from "../../components/commons/ListItem";
    import {Constants, EventBus, mixins} from '../../config/index';
    import axios from "axios"  // bang.uzhuang.com的api和zhuge的api约定不一样。后端不好同步，只能单独引入
    export default {
        name: "qaFind",
        data(){
            return {
                title:"发现",
                ico_arrow:require('../../assets/img/icon_user_arrow.svg'),
                list_data:[

                ],
                url:'http://bang.uzhuang.com/index.php?m=bangV2&f=ketang&v=commend',
                flag:1,
                gonglue:{
                    title:'1二手房卫生间改造，二手房卫生间攻略',
                    content:'2规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊规格是设计是自己规定的啊啊啊'
                }
            }
        },
        components:{
            ImgWrapper,
            AppBar,
            ListItem
        },
        created(){
            //http://bang.uzhuang.com/index.php?m=bangV2&f=ketang&v=commend
            // let url = 'http://bang.uzhuang.com/index.php?m=bangV2&f=ketang&v=commend'
            // this.getList(url)
        },
        methods:{

            goDetailPage(){
                console.log('')
            },
            getList(url){
                axios.get(url, null)
                    .then((result) => {
                        this.kt_lists = result.data.data
                    })
            },
            goPages(name){
                console.log(name);
                this.$router.push({
                    name
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";
    h4,p{
        margin: 0;
        padding: 0;
    }
    .box{
        background: #fff;
        margin-bottom: px2rem(11);
        padding: px2rem(13);
        width: 100%;
    }
    .title{
        display: flex;
        font-size: 0;

        .z-left{
            flex: 4;
            font-size: px2rem(14);
            vertical-align: middle;

        }
        .z-right{
            position: relative;
            flex: 1;
            text-align: right;
            padding-right: px2rem(15);
            font-size: px2rem(12);
            color: #999;
        }
        .icon{
            position: absolute;
            right: px2rem(3);
            top: - px2rem(5);
            width: px2rem(6);
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
            background: #D7EDDF;
            color: ﻿#a1b5a6;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
        }
    }
    .box2{
        overflow-x: scroll;
        padding-top: px2rem(15);
    }
    .hygj {
        /* todo动态改变 */
        width: px2rem(1000);
        li{
            display: inline-block;
            width: px2rem(102);
            margin-right: px2rem(1);
            text-align: center;
        }
        /*管家头像*/
        .jpal-img{
            background: #ccc;
            width: px2rem(60);
            height: px2rem(60);
            margin: 0 auto;
            border-radius: px2rem(30);

        }
        /*管家名称*/
        .name{
            font-size: px2rem(13);
            padding-top: px2rem(10);
        }
        /*管家介绍*/
        .info{
            font-size: px2rem(9);
            color: #999;
        }
        /*按钮*/
        .btn{
            display: inline-block;
            border: 1px solid #999;
            border-radius: px2rem(2);
            margin: 0 auto;
            font-size: px2rem(10);
            color: #333;
            width: px2rem(50);
            height: px2rem(21);
        }
    }
    .list-item{
        margin-bottom: px2rem(18);
    }

</style>