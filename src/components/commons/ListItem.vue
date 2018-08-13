<template>
    <div style="width: 100%">
        <!--装修攻略列表 左图 有内容（上标题 下内容）-->
        <section class="list-item1" @click="goDetail" v-if="type=='list1'">
            <div class="left-img">
                <img :src="src" alt="">
            </div>
            <div class="right-box">
                <p class="title">{{title}}</p>
                <p class="content">{{content}}</p>
            </div>

        </section>
        <!--管家列表-->
        <section class="list-item2" v-if="type == 'list2'">
            <div class="left-img">
                <img :src="avatar" alt="">
            </div>
            <div class="info">
                <p>{{name}} &nbsp
                    <uz-lable :role="level"></uz-lable>
                </p>
                <p>从业经验<b>{{year}}</b>年 / 服务客户<b>{{num}}</b>个</p>
                <p>用户好评率<b>{{rate}}</b></p>
            </div>
            <div class="btn">
                <a href="javascript:;" @click.stop="openAlertHandle(telphone)">联系</a>
            </div>

        </section>
        <!--精品案例部分-->
        <section class="list-item3" v-if="type == 'list3'">
            <img :src="classicData.cover" alt="">
            <section class="infos">
                <h2>{{classicData.name}}</h2>
                <ul class="tags">
                    <li v-for="item,index in classicData.style" :key="index">{{item}}</li>

                </ul>
            </section>
        </section>
        <mu-dialog :title="callMsg" width="400" max-width="70%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
            电话：{{telphone}}
            <a slot="actions" @click="closeAlertDialog" style="margin-right: 20px">关闭</a>
            <a slot="actions" :href="tel">去联系</a>
        </mu-dialog>
    </div>
</template>

<script>
    import EventBus from "../../config/EventBus";
    import UzLable from "../../components/commons/uzLable.vue";


    export default {
        name: "ListItem",
        components:{
          UzLable
        },
        created() {

        },
        components: {},
        props: {
            type: {
                type: null,
                default: 'list1'
            },

            // list1
            title: {
                type: null
            },
            content: {
                type: null
            },
            src:{
                type: null
            },
            // list2
            name: {
                type: null,
                default: ''
            },
            level:{
                type: null,
                default: '金牌管家'
            },

            year: {
                type: null,
                default: ''
            },
            num: {
                type: null,
                default: ''
            },
            rate: {
                type: null,
                default: ''
            },
            telphone: {
                type: null,
                default: ''
            },
            avatar: {
                type: null,
                default: ''
            },

            // list todo
            classicData:{
                type: null,
                default(){
                    return {

                    }
                }
            },


        },
        data() {
            return {
                tel:'tel:' + this.telphone,
                callMsg:'联系管家 ' + this.name,
                openAlert:false
            }
        },
        methods: {
            goDetail() {
                this.$emit('onClick')
            },
            openAlertHandle(){
                this.openAlert = true
            },
            // ---
            openAlertDialog () {
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
    @import "../../assets/scss/util";

    * {
        box-sizing: border-box;
    }

    p {
        margin: 0;
        padding: 0;
    }
    img{
        width: 100%;
        height: 100%;
    }
    .list-item1 {
        width: 100%;
        height: px2rem(77);
        display: flex;
        .left-img {
            width: px2rem(107);
            height: 100%;
            background: #ccc;
            border-radius: px2rem(5);

        }
        .right-box {
            flex: 1;
            padding-left: px2rem(10);
        }
        .title {
            @extend .one-line;
            width: px2rem(219);
            height: px2rem(42);
            font-size: px2rem(13);
            font-weight: bold;
            padding-top: px2rem(5);
        }
        .content {
            @include more-line(2);
            font-size: px2rem(9);
            color: #999;

        }
    }

    .list-item2 {
        display: flex;
        height: px2rem(100);
        background: #fff;
        .left-img {
            width: px2rem(89);
            height: 100%;
            text-align: center;
            img {
                display: inline-block;
                width: px2rem(58);
                height: px2rem(58);
                background: url("../../assets/img/icon_slider.png") no-repeat;
                background-size: cover;
                border-radius: px2rem(29);
                vertical-align: middle;
            }
            &:after {
                vertical-align: middle;
                content: '';
                display: inline-block;
                height: 100%;
                width: 0;
            }

        }
        .info {
            padding-top: px2rem(20);
            font-size: px2rem(13);
            flex: 1;
            color: #666;
            b{
                color: #333;
            }
            p:first-child{
                color: #333;
                font-size: px2rem(14);
                font-weight: bold;

            }
        }

        .btn {
            text-align: center;
            width: px2rem(85);
            a {
                display: inline-block;
                font-size: px2rem(12);
                background: #66d3b8;
                color: #fff;
                width: px2rem(60);
                height: px2rem(25);
                line-height: px2rem(25);
                border-radius: px2rem(3);
                vertical-align: middle;
            }
            &:after {
                vertical-align: middle;
                content: '';
                display: inline-block;
                height: 100%;
                width: 0;
            }
        }
    }
    .list-item3{
        position: relative;
        margin-top: px2rem(10);
        width: 100%;
        height: px2rem(250);
        color: #fff;
        img{
            display: inline-block;
            width: 100%;
            height: 100%;
            background: #9e9e9e;
        }
        .infos{
            position: absolute;
            width: 100%;
            top: px2rem(60);
            z-index: 9;
            text-align: center;
        }
        .tags{
            li{
                position: relative;
                display: inline-block;
                height: px2rem(30);
                padding:0 px2rem(10);
                &:before{
                    position:absolute;
                    left: 0;
                    top:px2rem(7);
                    display: inline-block;
                    content: '';
                    width: px2rem(5);
                    height: px2rem(5);
                    border-radius: px2rem(2.5);
                    background: #fff;

                }
            }
        }

    }

</style>