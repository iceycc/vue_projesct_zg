<!--用户徽章吧-->
<template>
  <span class="role" v-if="role != '回答者' && role != '用户' && role != '普通管家'" v-bind:class="getRoleClass(role)">{{role}}</span>
</template>

<script>
  export default {
    name: 'uzLable',
    data() {
      return {};
    },
    props: {
      role: {
        type: String,
        default: ''
      },
    },
    created() {
      if (!this.src) {
        this.src = 'empty';
      }
    },
    methods: {
      getRoleClass(role) {
        /*
        * 返回字段：
        * 金牌管家
        * 管家
        * 达人
        * 问题发起人 或者 赏金发起人 （这个字段是前端判断的）
        * 普通用户(默认)
        * */
        if (role == '金牌管家') {
          return 'role-jinpaiguanjia';
        }
        if(role == '管家'){
          return 'role-guanjia'
        }
        if (role == '达人') {
          return 'role-daren';
        }
        if (role == '问题发起人' || role == '赏金发起人') {
          return 'role-faqiren'
          //  #fe6d6f
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/px2rem";

  .role {
    vertical-align: middle;
    font-size: px2rem(12);
    padding: 0 px2rem(5);
    border-radius: px2rem(10);
    border: px2rem(1) solid #333;
    color: #666;
    line-height: 1;
  }

  .role-jinpaiguanjia {
    border-color: rgb(255, 182, 0);
    color: rgb(255, 182, 0);
    background-color: rgb(254, 250, 229);
  }
  .role-guanjia{
    border-color:#5b9ffe;
    color: #5b9ffe;
    background-color: #bffdfe;
  }
  .role-daren {
    border-color: rgb(255, 143, 159);
    color: rgb(255, 143, 159);
    background-color: rgb(254, 250, 229);
  }
  .role-faqiren{
    border-color: #fe4423;
    color:  #fe4423;
    background-color: rgb(254, 250, 229);
  }
</style>
