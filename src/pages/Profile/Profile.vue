<template>
  <!--我的-->
  <section class="profile">
    <Header title="个人信息"></Header>
    <section class="profile-number">
      <router-link :to="user._id ? '/userinfo' : '/login'" class="profile-link">
        <div class="profile_image">
          <i class="iconfont icongeren2"></i>
        </div>
        <div class="user-info">
          <p class="user-info-top" v-if="!user.phone">{{user.name ? user.name : '登录|注册'}}</p>
          <p class="user-number">
            <span class="user-icon">
              <i class="iconfont iconshouji"></i>
            </span>
            <span class="icon-mobile-number">{{user.phone ? user.phone : '暂无绑定手机号'}}</span>
          </p>
        </div>
        <span class="arrow">
          <i class="iconfont iconjiantou3"></i>
        </span>
      </router-link>
    </section>
    <section class="profile_info_data border-1px">
      <ul class="info_data_list">
        <a href="javascript:" class="info_data_link">
          <span class="info_data_top"><span>0.00</span>元</span>
          <span class="info_data_bottom">我的余额</span>
        </a>
        <a href="javascript:" class="info_data_link">
          <span class="info_data_top"><span>0</span>个</span>
          <span class="info_data_bottom">我的优惠</span>
        </a>
        <a href="javascript:" class="info_data_link">
          <span class="info_data_top"><span>0</span>分</span>
          <span class="info_data_bottom">我的积分</span>
        </a>
      </ul>
    </section>
    <section class="profile_my_order border-1px">
      <!-- 我的订单 -->
      <a href='javascript:' class="my_order">
          <span>
            <i class="iconfont icondingdan"></i>
          </span>
        <div class="my_order_div">
          <span>我的订单</span>
          <span class="my_order_icon">
              <i class="iconfont iconjiantou"></i>
            </span>
        </div>
      </a>
      <!-- 积分商城 -->
      <a href='javascript:' class="my_order">
          <span>
            <i class="iconfont iconjifen"></i>
          </span>
        <div class="my_order_div">
          <span>积分商城</span>
          <span class="my_order_icon">
              <i class="iconfont iconjiantou"></i>
            </span>
        </div>
      </a>
      <!-- 硅谷外卖会员卡 -->
      <a href="javascript:" class="my_order">
          <span>
            <i class="iconfont iconVIP"></i>
          </span>
        <div class="my_order_div">
          <span>会员中心</span>
          <span class="my_order_icon">
              <i class="iconfont iconjiantou"></i>
            </span>
        </div>
      </a>
    </section>
    <section class="profile_my_order border-1px">
      <!-- 服务中心 -->
      <a href="javascript:" class="my_order">
          <span>
            <i class="iconfont iconjianzhu"></i>
          </span>
        <div class="my_order_div">
          <span>服务中心</span>
          <span class="my_order_icon">
              <i class="iconfont iconjiantou"></i>
            </span>
        </div>
      </a>
    </section>
    <section class="profile_logout"  v-show="user._id">
      <mt-button class="logout_button" type="danger" @click="logout">退出登录</mt-button>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
import {mapState} from 'vuex'
import {MessageBox} from 'mint-ui'
export default {
  name: "Profile",
  computed: {

    ...mapState({
      user: state => state.user.user,
    }),

  },
  methods:{
    logout(){
      MessageBox.confirm("确定要退出登录吗").then(
        () =>{
          this.$store.dispatch("logout")
        }
      )
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixins.styl'
  .profile //我的
    width 100%
    overflow hidden
    .profile-number
      margin-top 45.5px
      .profile-link
        clearFix()
        position relative
        display block
        background $yellow
        padding 20px 10px
        .profile_image
          float left
          width 60px
          height 60px
          border-radius 50%
          overflow hidden
          vertical-align top
          .icongeren2
            font-size 60px
        .user-info
          float left
          margin-top 8px
          margin-left 15px
          .user-info-top
            font-weight: 700
            font-size 18px
            color #222222
            padding-bottom 8px
          .user-number
            .user-icon
              display inline-block
              margin 5px 5px 0 0
              width 20px
              height 20px
              .iconshouji
                font-size 20px
            .icon-mobile-number
              font-size 14px
              color #222222
              text-align center
        .arrow
          width 12px
          height 12px
          position absolute
          right 15px
          top 40%
    .profile_info_data
      bottom-border-1px(#e4e4e4)
      width 100%
      background #fff
      overflow hidden
      .info_data_list
        clearFix()
        .info_data_link
          float left
          width 33%
          text-align center
          border-right 1px solid #f1f1f1
          .info_data_top
            display block
            width 100%
            font-size 14px
            color #333
            padding 15px 5px 10px
            span
              display inline-block
              font-size 30px
              color #f90
              font-weight 700
              line-height 30px
          .info_data_bottom
            display inline-block
            font-size 14px
            color #666
            font-weight 400
            padding-bottom 10px
        .info_data_link:nth-of-type(2)
          .info_data_top
            span
              color #ff5f3e
        .info_data_link:nth-of-type(3)
          border 0
          .info_data_top
            span
              color #6ac20b
    .profile_my_order
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      margin-left 15px
      .my_order
        display flex
        align-items center
        padding-left 15px
        >span
          display flex
          align-items center
          width 20px
          height 20px
          >.iconfont
            margin-left -10px
            font-size 30px
          .icondingdan
            padding-left: 3px
            color #02a774
            font-size 20px
          .iconjifen
            color #ff5f3e
            font-size 20px
          .iconVIP
            color #f90
            font-size 20px
          .iconjianzhu
            color #02a774
            font-size 20px
        .my_order_div
          width 100%
          border-bottom 1px solid #f1f1f1
          padding 18px 10px 18px 0
          font-size 16px
          color #333
          display flex
          justify-content space-between
          span
            display block
          .my_order_icon
            width 10px
            height 10px
            .iconjiantou
              color #bbb
              font-size 10px

    .profile_logout
      .logout_button
        width: 100%
</style>