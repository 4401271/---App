<template>
  <div>
    <ShopHeader/>
    <div class="tab">
      <div class="tab-item">
        <router-link :to="`/shop/${id}/goods`" replace>点餐</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="`/shop/${id}/ratings`" replace>评价</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="`/shop/${id}/info`" replace>商家</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import ShopHeader from "@/components/ShopHeader/ShopHeader";
import { mapState } from 'vuex'
import { saveCartFoods } from '@/utils'
export default {
  name: "Shop",
  props: ['id'],
  mounted() {
    this.$store.dispatch('getShop', this.id)
    // 对页面的关闭和刷新添加一个监听
    window.addEventListener('unload', ()=>{
      const { shop: {id}, cartFoods } = this.shop
      saveCartFoods(id, cartFoods)
    })
  },
  computed: {
    ...mapState({
      shop: state => state.shop
    })
  },
  // beforeDestroy表示当前组件销毁前，这个状态在刷新界面时并不会被触发，因此我们若想要让其在刷新时被触发，需要为其添加页面卸载的监听，页面的刷新其实经历了卸载和装载的过程
  beforeDestroy() {
    // shop: {id}是一个多层解构赋值，this中的shop表示shop模块，里面包含了和shop有关的state、mutations、actions，我们先从shop中取得shop状态和cartFoods状态
    // shop=1这个就表示赋默认值，就是假如shop模块中没有shop这个状态，那就给这个shop状态赋值为1
    // const { shop: {id}, cartFoods } = this.shop
    // saveCartFoods(id, cartFoods)
  },
  components: {
    ShopHeader
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .tab
    height 40px
    line-height 40px
    background #fff
    bottom-border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      float left
      width: 33.33333%
      text-align center
      font-size 14px
      color rgb(77, 85, 93)
      a
        display block
        position relative
        &.router-link-active
          color #333
          &::after
            content ''
            position absolute
            left 50%
            bottom 1px
            width 35px
            height 2px
            transform translateX(-50%)
            background $yellow

</style>