<template>
  <header class="header">
    <!--<span class="header_search">
      <i class="iconfont iconsousuo"></i>
    </span>-->

    <slot name="header_left"></slot>

    <span class="header_title">
      <span class="header_title_text ellipsis">{{title}}</span>
    </span>

    <slot name="header_right"></slot>

    <!--<span class="header_login">
      <span class="header_login_text">登录|注册</span>
    </span>-->
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
   title: {
     type: String,
     default: 'title',
     required: true
   }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixins.styl'
  .header
    background-color $yellow
    position fixed
    z-index 100
    left 0
    top 0
    width 100%
    height 45px
    .header_search
      position absolute
      left 15px
      top 50%
      transform translateY(-50%)
      width 10%
      height 50%
      .iconsousuo
        font-size 25px
        color #222222
    .header_title
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      width 50%
      color #222222
      text-align center
      .header_title_text
        font-size 17px
        color #222222
        display block
        font-weight: 550
    .header_login
      font-size 14px
      color #222222
      position absolute
      right 15px
      top 50%
      transform translateY(-50%)
      .header_login_text
        color #222222
</style>