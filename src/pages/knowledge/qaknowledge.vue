<template>
  <div class="content">
    <div class="hot_word_view">
      <template v-for="item,index in categorys">
        <div class="hot_word" v-bind:class="{'hot_word_select' :category_index === index}"
             @click.stop="selectHotWord(index)">
          {{item.name}}
        </div>
      </template>
    </div>

    <div v-if="isFirst" class="scroll-view">
      <div v-for="item,index in kt_lists">
        <div class="card" @click="onItemClick(item)">
          <div class="card-img">
            <img :src="item.thumb" alt="">
          </div>
          <div class="title-view">
            <div class="title">{{item.title}}</div>
            <span class="reward shadow"
                  v-if="parseFloat(item.q_reward) > 0">{{item.q_reward}}</span>
            <div class="card-content">{{item.remark}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="ketang_imgs" v-else>
      <div v-for="item,key,index in pics" :key="key" class="ketang_img" @click="goKetangDetail($event,key)"
           v-if=" key != 32">
        <span class="title">{{picsTitle | forPicsTitle(index)}}</span>
        <img :src="item" alt=""></div>
    </div>
  </div>

</template>

<script>
  import {Constants, EventBus, mixins, API} from '../../config/index';
  import axios from 'axios';
  import ComponentTemplate from "../../components/template";
  import AutoListView from "../../components/commons/AutoListView";
  import ImgWrapper from "../../components/commons/ImgWrapper";

  export default {
    components: {
      ImgWrapper,
      AutoListView

    },
    mixins: [mixins.base, mixins.wx],
    name: Constants.PageName.qaknowledge,
    data() {
      return {
        isFirst: true,
        url: '',
        category_index: 0,
        categorys: [{
          name: '推荐',
        }, {
          name: '装修前',
        }, {
          name: '装修中',
        }, {
          name: '装修后',
        }],
        flag: null,
        pics: [],
        picsTitle: [],
        kt_lists: [],
        // [@"收房",@"设计",@"建材",@"预算",@"合同”]  :66/67/32/68/69
        // [@"拆改",@"水电",@"防水",@"泥瓦",@"木工",@"油漆",@"竣工"] :70~76
        // [@"软装",@"风水",@"环保",@"家具",@"电器",@"入住",@"保养”]:81/87/82/33/35/83/170
        picsTitlePrevious: ['建材', '收房', '设计', '预算', '合同'],
        picsTitleMiddle: ['拆改', '水电', '防水', '泥瓦', '木工', '油漆', '竣工'],
        picsTitleLast: ['家具', '电器', '软装', '风水', '环保', '入住', '保养'],
      };
    },
    filters: {
      forPicsTitle: (val, index) => {
        return val[index]
      }
    },
    computed: {},
    created() {
      this.initWX(() => {
        this.fenXiang({
          title:'诸葛装修，全方位解决您的装修问题',
          imgUrl:'http://image1.uzhuang.com/zhuge-logo.png'
        },function () {
          // console.log('fenXiang');
        })
        // console.log('wx success');
      });
      this.selectHotWord(0);
    },
    methods: {
      goKetangDetail($event, id) {
        let title = $event.currentTarget.children[0].innerHTML
        this.$router.push({
          name: Constants.PageName.qaKetangDetail,
          query: {
            cid: id,
            title: title
          }
        })
      },
      getList(url) {
        this.url = url;
        axios.get(url, null)
          .then((result) => {
            this.kt_lists = result.data.data
          })
      },
      onItemClick(item) {
        // console.log(item)
        window.location.href = item.url;
        /*this.pushPage({
            name: Constants.PageName.qaDetail,
            query: {
                id: item.id
            }
        });*/
      },
      getPicsData(url, type, picsTitle) {
        this.isFirst = false
        this.loading = true
        this.picsTitle = picsTitle
        let data = {
          type: type
        }
        axios.get(url, {params: data})
          .then((res) => {
            // console.log(res);
            let urls = res.data.data
            this.pics = urls
          })
          .catch((err) => {
            // console.log(err);
          })
      },
      selectHotWord(index) {
        this.category_index = index;
        switch (this.category_index) {
          case 0:
            //信息列表
            this.getList(Constants.Method.ketang_commend);
            this.isFirst = true
            break;
          case 1:
            //信息列表321
            this.getPicsData(Constants.Method.ketang_commend_qzh, 'previous', this.picsTitlePrevious);
            break;
          case 2:
            //信息列表
            this.getPicsData(Constants.Method.ketang_commend_qzh, 'middle', this.picsTitleMiddle);
            break;
          case 3:
            //信息列表
            this.getPicsData(Constants.Method.ketang_commend_qzh, 'last', this.picsTitleLast);
            break;
          default:
            // console.log("猜猜猜")
        }

      },
      gotoSearch() {
        this.pushPage({
          name: Constants.PageName.qaSearch
        });
      },
      openWeb(url) {
        window.location.href = url;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../../assets/scss/px2rem";

  .content {
    background-color: $divider;
    padding-top: px2rem(60);
    height: 100%;
  }
  /*scroll-view*/
  .scroll-view {
    height: 100%;
    overflow: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    .no-data {
      text-align: center;
      margin-top: px2rem(40);
    }
  }
  .hot_word_view {
    position: fixed;
    top: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-y: auto;
    background-color: white;
    z-index: 100;
    .hot_word {
      color: #333;
      flex-grow: 1;
      padding: px2rem(15) 0;
      margin: 0 px2rem(15);
      font-size: px2rem(13);
      text-align: center;
      white-space: nowrap;
      transition: font-size, color 0.2s, 0.2s;
      border-bottom: px2rem(2) solid #fff;
    }
    .hot_word_select {
      color: $mainColor;
      font-size: px2rem(13);
      border-bottom: px2rem(2) solid $mainColor;
    }
  }

  /*11*/
  .ketang_imgs {
    display: flex;
    flex-wrap: wrap;
    .ketang_img {
      position: relative;
      padding: px2rem(10);
      display: inline-block;
      width: 50%;
      height: px2rem(120);

      img {
        width: 100%;
      }
      .title {
        position: absolute;
        padding: px2rem(6);
        color: #fff;
      }
    }
  }

  .card {
    background-color: white;
    display: flex;
    width: 100%;
    padding: px2rem(10);
    border-radius: px2rem(3);
    /*12111111*/
    .card-img {
      box-sizing: border-box;
      vertical-align: top;
      width: px2rem(80);
      height: px2rem(60);
      background: #ccc;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title-view {
      flex: 1;
      box-sizing: border-box;
      padding-left: px2rem(10);
      vertical-align: top;
      width: 65%;
      .title {
        font-size: px2rem(15);
        font-weight: bold;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #555;
      }

      .reward {
        font-size: px2rem(12);
        line-height: 1;
        background-color: RGB(255, 205, 0);
        color: white;
        padding: px2rem(4) px2rem(10);
        border-radius: px2rem(13);
      }
      .reward:before {
        content: '¥';
        font-size: px2rem(10);
      }
    }

    &-content {
      color: #666666;
      font-size: px2rem(14);
      padding: px2rem(10) 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .footer-view {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: $fontcolor_gray;
      padding-top: px2rem(10);
      font-size: px2rem(10);
      .avatar {
        flex-grow: 1;
      }
      .pv {
      }
    }
  }

</style>
