<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="iconfont iconjian" v-if="food.count>0" @click.stop="updateFoodCount(false, $event)"></div>
    </transition>
    <div class="cart-count" v-if="food.count>0">{{food.count}}</div>
    <div class="iconfont iconjiacai" @click.stop="updateFoodCount(true, $event)"></div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
export default {
  name: "CartControl",
  props: {
    food: Object
  },
  methods: {
    updateFoodCount: throttle(function (isAdd) {
      this.$store.dispatch('updateFoodCount', {food: this.food, isAdd})
    }, 200, {trailing: false}) // {trailing: false}：控制在1s内，如果多次点击，仅响应第一次点击（默认是响应2次，且第二次是在过了1s后才响应）
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins.styl"
.cartcontrol
  font-size: 0
  .cart-decrease
    display: inline-block
    padding: 6px
    line-height: 24px
    font-size: 24px
    color: rgb(0, 160, 220)

  .iconjian
    display: inline-block
    padding 6px
    line-height 24px
    font-size 22px
    color $yellow
    &.move-enter-active, &.move-leave-active
      transition all .5s
    &.move-enter, &.move-leave-to
      opacity 0
      transform translateX(15px) rotate(180deg)
  .cart-count
    display: inline-block
    vertical-align: top
    width: 12px
    padding-top: 6px
    line-height: 24px
    text-align: center
    font-size: 10px
    color: rgb(147, 153, 159)
  .iconjiacai
    display: inline-block
    padding: 6px
    line-height: 24px
    font-size: 22px
    color $yellow
</style>
