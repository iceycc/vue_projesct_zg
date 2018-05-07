<template>
  <div>
    <app-bar :title="title"></app-bar>
    <div class="form">
        <mu-text-field fullWidth :underlineShow="false" v-model="username" hintText="管家端账号"/>
        <mu-text-field fullWidth :underlineShow="false" v-model="password" hintText="管家端密码" type="password"/>
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
            console.log(err);
          })
      }
    }
  }
</script>

<style lang="scss">
  @import "../../../assets/scss/px2rem";
  .form{
    text-align: center;
    padding-top:px2rem(50)
  }
  .mu-text-field{
    border: 1px solid #ccc;
    border-radius:px2rem(10);
    padding-left: px2rem(20);
    margin-bottom:px2rem(30);
    width: px2rem(300) !important;
    .mu-text-field-hint {
      text-align: left;
    }
  }

  .submit{
    margin: 0 auto;
    width: px2rem(300);
    height: px2rem(40);
    background: #21d5b8;
    border-radius:px2rem(5);
    color:#fff;
    font-size: px2rem(20);
    line-height: px2rem(40);
  }
</style>
