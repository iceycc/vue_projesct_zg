<!--suppress ALL -->
<template>
    <div class="scroll-view">
        <app-bar :title="title"></app-bar>
        <!--精品案例-->
        <div class="box" style="margin-top: 3px">
            <div class="title">
                <h4 class="z-left">精品案例</h4>
                <span class="z-right" @click="goPages('qagoodcase')">更多<img-wrapper :url="ico_arrow"
                                                     classStyle="icon"></img-wrapper></span>

            </div>
            <ul class="jpal">
                <li v-for="item in classicData" @click="goPages('qagoodcasedetail',item.id)">
                    <div class="jpal-img"><img :src="item.cover" alt=""></div>
                    <p>{{item.alt}}</p>
                </li>
            </ul>
        </div>
        <!--活跃管家-->
        <div class="box">
            <div class="title">
                <h4 class="z-left">活跃管家</h4>
                <span class="z-right" @click="goPages('qamanagerlist')">更多<img-wrapper :url="ico_arrow"
                                                     classStyle="icon"></img-wrapper></span>
            </div>
            <div class="box2">
                <ul class="hygj" ref="hygj">
                    <li v-for="item in keeperArr">
                        <div @click="goManagerDetail(item.id)">
                            <div class="jpal-img"><img :src="item.personalphoto" alt=""></div>
                            <h4 class="name">{{item.gjname}}</h4>
                            <p class="info">从业经验{{item.worktime}}年</p>
                            <p class="info">服务客户{{item.completed_num}}个</p>
                        </div>
                        <a class="btn" @click="openAlertDialog(item.mobile,item.gjname)">联系</a>
                    </li>

                </ul>
            </div>
        </div>
        <!--装修攻略-->
        <div class="box" style="margin-bottom: 40px">
            <div class="title">
                <h4 class="z-left">装修攻略</h4>
                <span class="z-right" @click="goPages('qaknowledge')">更多<img-wrapper :url="ico_arrow"
                                                     classStyle="icon"></img-wrapper></span>
            </div>
            <div style="padding-top: 10px;font-size: 0">
                <list-item
                        @onClick="goDetailPage(item.url)"
                        v-for="item,index in kt_lists"
                        :key="index"
                        class="list-item"
                        :title="item.title"
                        :content="item.remark"
                        :src="item.thumb"
                ></list-item>
            </div>
        </div>

        <mu-dialog :title="callMsg" width="400" max-width="70%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
            电话：{{telNum}}
            <a slot="actions" @click="closeAlertDialog" style="margin-right: 20px">关闭</a>
            <a slot="actions" :href="tel">去联系</a>
        </mu-dialog>
    </div>
</template>

<script>
    import AppBar from "../../components/commons/AppBar.vue";
    import ImgWrapper from "../../components/commons/ImgWrapper.vue";
    import ListItem from "../../components/commons/ListItem";
    import {Constants, EventBus, mixins,API} from '../../config/index';
    import axios from "axios"  // bang.uzhuang.com的api和zhuge的api约定不一样。后端不好同步，只能单独引入
    import {px2rem} from "../../config/util";
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
                },
                openAlert: false,
                kt_lists:[],
                keeperArr:[],
                classicData:[],

                tel:'',
                telNum:'',
                callMsg:'联系管家'
            }
        },
        components:{
            ImgWrapper,
            AppBar,
            ListItem
        },
        created(){
            this.getKeTangList()
            this.getKeeperActiveList()
            this.getClassicList()
        },
        methods:{
            getClassicList(){
                let data = {
                    house: 0,
                    space: 0,
                    style: 0,
                    cityid: 3360,
                    page: 1,
                }
                API.post(Constants.Method.getClassicList, data)
                    .then(result => {
                        this.classicData = result.data.splice(0,3)
                    })

            },
            getKeTangList(){
                let url = Constants.Method.ketang_commend
                axios.get(url, null)
                    .then((result) => {
                        let data = result.data.data
                        this.kt_lists = data.splice(0,4)
                    })
            },
            getKeeperActiveList(){
                let data = {}
                API.post(Constants.Method.keeperActive,data)
                    .then(result=>{
                        let data = result.data
                        if(data.length>0){
                            this.$refs.hygj.style.width = px2rem(data.length * 100 + 13) + 'rem'
                            this.keeperArr = data
                        }

                    })
            },
            goDetailPage(url){
                window.location.href = url;
            },
            goPages(name,id){
                console.log(name);
                if(id){
                    this.$router.push({
                        name:name,
                        query:{
                            id
                        }
                    })
                }else {
                    this.$router.push({
                        name,
                    })
                }

            },
            goManagerDetail(id){
                this.$router.push({name:'qamanagerdetail',query:{id}})
            },
            // ---
            openAlertDialog (tel,name) {
                this.callMsg = '联系管家 ' + name
                this.tel = 'tel:'+ tel
                this.telNum = tel
                this.openAlert = true;
            },
            closeAlertDialog () {
                this.openAlert = false;
            }

        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";
    @import "./common";
    h4,p{
        margin: 0;
        padding: 0;
    }
    img{
        /*display: inline-block;*/
        width: 100%;
        height:100%
    }
    .scroll-view {
        overflow: scroll;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
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
        font-size: 0;
        display: flex;
        padding-top:px2rem(20) ;
        li{
            display: flex;
            flex-direction: column;
            width: px2rem(116);
            height: px2rem(116);
            background: ﻿red;
            margin-right: px2rem(5);
            overflow: hidden;
        }
        .jpal-img{
            width: 100%;
            flex: 1;
            overflow: hidden;

        }
        p{
            font-size: px2rem(8);
            overflow: hidden;
            background: #D7EDDF;
            color: ﻿#a1b5a6;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            border: none;
            line-height: px2rem(12);
            height: px2rem(12);
        }
    }
    .box2{
        overflow-x: scroll;
        padding-top: px2rem(15);
    }
    .hygj {
        /* todo动态改变 一个li 100 */
        min-width:100%;
        li{
            display: inline-block;
            width: px2rem(100);
            margin-right: px2rem(1);
            text-align: center;
        }
        /*管家头像*/
        .jpal-img{
            /*background: #ccc;*/
            width: px2rem(60);
            height: px2rem(60);
            margin: 0 auto;
            border-radius: px2rem(30);
            overflow: hidden;
            @extend .avatar-img;
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
            border-radius: px2rem(2);
            margin: px2rem(8) auto 0;
            font-size: px2rem(10);
            color: #fff;
            width: px2rem(50);
            height: px2rem(21);
            line-height: px2rem(21);
            background: #69d6b1;
        }
    }
    .list-item{
        margin-bottom: px2rem(18);
    }

    .mu-dialog-actions{
        /*display: none !important;*/
    }

</style>