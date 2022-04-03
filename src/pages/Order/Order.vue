<template>
  <!--订单-->
  <section class="order">
    <Header title="订单"></Header>
    <section class="order_no_login">
      <img src="./images/person.png">
      <h3>登录后查看外卖订单</h3>
      <button>立即登陆</button>
    </section>
  </section>
</template>

<script>
export default {
name: "Msite"
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixins.styl'
  .order  //订单
    width 100%
    .order_no_login
      padding-top 140px
      width 60%
      margin 0 auto
      text-align center
      >img
        display block
        width 100%
        height 30%
      >h3
        padding 10px 0
        font-size 17px
        color $yellow
      >button
        display inline-block
        background $yellow
        font-size 14px
        color #222222
        border 0
        outline none
        border-radius 5px
        padding 10px 20px
</style>