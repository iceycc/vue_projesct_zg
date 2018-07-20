<template>
  <div>
    <app-bar :title="title"></app-bar>
    <div class="form">
        <input type="text" v-model="username" placeholder="管家端账号">
        <input type="password" v-model="password" placeholder="管家端密码">
        <div class="submit" @click="goBindAccount">确认绑定</div>
    </div>
  </div>
</template>

<script>
  import AppBar from '../../../components/commons/AppBar.vue'
  import md5 from 'js-md5';
  import {Constants, EventBus, mixins,API} from '../../../config/index';
  export default {
    name: "",
    components:{
      AppBar
    },
    // 混入对象
    mixins: [mixins.base, mixins.wx],
    data(){
      return{
        title:'账号绑定',
        username:'',
        password:''
      }
    }
    ,
    created(){
      this.initWX(() => {
        this.fenXiang({
          title:'诸葛装修，全方位解决您的装修问题',
          imgUrl:'http://image1.uzhuang.com/zhuge-logo.png'
        },function () {
          // console.log('fenXiang');
        })
        // console.log('wx success');
      });
    },
    methods:{
      goBindAccount(){
        this.username = this.username.replace(/^\s+|\s+$/g,"")
        this.password = this.password.replace(/^\s+|\s+$/g,"")
        if(this.username == ""){
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '用户名不能为空'
          });
          return
        }
        if(this.password==""){
          EventBus.$emit(Constants.EventBus.showToast, {
            message: '密码不能为空'
          });
          return
        }
        let data = {
          username:this.username,
          password:md5(this.password),
        }
        API.post(Constants.Method.bind_account,data)
            .then((result)=>{
              if(result.code == 0 && result.message == 'Successful'){
                EventBus.$emit(Constants.EventBus.showToast, {
                  message: '绑定成功,需要重新登陆'
                });
                setTimeout(()=>{
                  window.localStorage.clear()
                  this.$router.push({
                    name:Constants.PageName.qaLogin
                  })
                },1000)
              }else {
                EventBus.$emit(Constants.EventBus.showToast, {
                  message: '账户或密码错误请重新输入'
                });
              }
            })
          .catch((err)=>{
            // console.log(err);
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/px2rem";
  .form{
    text-align: center;
    padding-top:px2rem(50)
  }

  input{
    width: px2rem(320);
    height: px2rem(50) ;
    border-radius: px2rem(10);
    padding-left: px2rem(20);
    margin-bottom:px2rem(30);
    border: 1px solid #ccc;
    font-size: px2rem(16);
  }
  .submit{
    margin: 0 auto;
    width: px2rem(280);
    height: px2rem(50);
    background: #21d5b8;
    border-radius:px2rem(5);
    color:#fff;
    font-size: px2rem(16);
    line-height: px2rem(50);
  }
</style>
