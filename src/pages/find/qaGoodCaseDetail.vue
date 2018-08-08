<template>
    <div class="scroll-view">
        <AppBar :title="title"></AppBar>
        <section class="case-info">
            <div class="case-div">
                <img id="cover-img" src="http://mimage1.uzhuang.com/image/original/8228c020nm0fr000p6189p.jpg" alt="效果图">
                <div class="casename-designer">
                    <a class="designer-face" href="mobile-designer.html?designer_id=2909"><img :src="design.thumb"></a>
                    <h3 class="case-name">
                        <p style="font-size:12px;">设计师 - <span class="names" style="font-size:12px;">{{design.title}}</span></p>
                    </h3>
                    <h3 class="case-name">
                        {{infos.name}}
                    </h3>
                </div>
                <div class="div-ceng"></div>
            </div>
            <div class="detail-info">
                <span>#{{infos.housetype}}</span>
                <span>#{{infos.area}}㎡</span>

                <span v-for="i,index in infos.style" :key="index"><i class="dian"></i>{{i}}</span>

            </div>
            <ul class="main">
                <li class="content-li" v-for="item,index in data2" :key="index">
                    <a class="link-bimg"><img class="" :src="item.photo"></a>
                    <div class="font">
                        <p class="num">
                            {{index + 1}}
                        </p>
                        <p class="info">
                            {{item.alt}}
                        </p>
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import AppBar from "../../components/commons/AppBar"
    import axios from "axios"
    let api_url = 'http://m.uzhuang.com/index.php?m=wap&f=biz_photo&v=particulars_listing'

    export default {
        name: "qaGoodCaseDetail",
        data(){
            return {
                title:'精品案例',
                design:{},
                data2:[],
                infos:{}
            }
        },
        components:{
            AppBar
        },
        created(){
            let id = this.$route.query.id
            axios.get(api_url,{params:{id}})
                .then(result=>{
                    this.design = result.data.data.design
                    this.data2 = result.data.data.hebing
                    this.infos = result.data.data.picture[0]
                    console.log(this.data);

                })
        }

    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";
    img{
        width: 100%;
        height: 100%;
    }
    .scroll-view {
        overflow: scroll;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
    }
    .case-info{
        text-align: center;

        .case-div{
            position: relative;
            width: 100%;
            height: px2rem(270) ;
        }
        .designer-face{
            margin: 0 auto 0.625rem;
            display: block;
            width: px2rem(64);
            height: px2rem(64);
            img{
                border-radius: 50%;
            }
        }
        .casename-designer {
            position: absolute;
            width: 100%;
            height: px2rem(60);
            top: 50%;
            margin-top: px2rem(-60);
            color: #fff;
        }
    }
    .dian{
        display: inline-block;
        width: px2rem(3);
        height: px2rem(3);
        background: #000;
        vertical-align: middle;
        border-radius: px2rem(1.5);
        margin: 0 px2rem(6);
    }
    .detail-info{
        color:#666;
        margin: px2rem(10) 0 px2rem(30);
    }
    .content-li{
        .link-bimg{
            display: inline-block;
            width: 100%;
            height: px2rem(250);
        }
        image{
            width: 100%;
            height: 100%;
        }
        .num{
            width: px2rem(30);
            text-align: center;
        }
        .info{

            padding-left: px2rem(10);

        }

        .font{
            display: flex;
            font-style: italic;
            font-weight: bold;
            margin-bottom: px2rem(30);

        }
    }


</style>