<template>
    <div class="hot-view" id="outdiv" v-show="show.ifshow" :class="ClassStyle">
        <div class="hot-view-box" id="indiv">
            <span v-for="item,key,index in datas" :key="index" :class="{active_hot_style:active_hot == index}"
                  @click="doSelect(index,key)">{{item}}</span>
        </div>
    </div>
</template>

<script>
    import {EventBus} from '../../config/index';

    export default {
        name: "downTabsBox",
        props:{
            show:{
                type:null,
                default(){
                    return {
                        ifshow:true
                    }
                }
            },
            ClassStyle:{
                type:null,
                default:''
            },
            datas:{
                type:null,
                default(){
                    return {}
                }
            }
        },
        data(){
            return{
                active_hot:-1,
            }
        },
        mounted(){
            if(this.show){
                this.outClickHandle('indiv','outdiv',() => {
                    this.show.ifshow= false
                })
            }

        },
        watch:{
            // active_hot(oldData,newData) {
            //     console.log(oldData,newData);
            // }
            datas(oldData,newData){
                this.active_hot = -1
            }
        },
        beforeDestroy () {
        },
        methods:{
            doSelect(index,key){
                console.log(key)
                this.active_hot = index
                this.show.ifshow= false
                EventBus.$emit('onChange',key)
            },
            outClickHandle(inDivId,outDivId,callback){
                let inDiv = document.getElementById(inDivId)
                let outDiv = document.getElementById(outDivId)
                outDiv.addEventListener('click',()=>{
                    callback && callback(outDiv)
                })
                inDiv.addEventListener('click',function (e) {
                    e = e || window.event
                    e.stopPropagation()
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";
    .hot-view {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        .hot-view-box {
            background: #fff;
            padding-top: px2rem(25);
            padding-bottom: px2rem(25);
            padding-left: px2rem(19);
        }
        span {
            display: inline-block;
            width: px2rem(70);
            height: px2rem(34);
            margin-right: px2rem(14);
            margin-bottom: px2rem(10);
            text-align: center;
            line-height: px2rem(34);
            border: 1px solid #dcdcdc;
            font-size: px2rem(13);
            border-radius: px2rem(3);
            color:#333;
            &:nth-child(4n) {
                margin-right: 0;
            }
            &.active_hot_style{
                border: 1px solid #0edda2;
                color: #0edda2;
            }
        }
    }

</style>