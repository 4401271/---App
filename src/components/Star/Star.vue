<template>
  <div :class="`star star-${size}`">
    <span class="star-item" :class="score>1 ? 'on' : score>=0.5? 'half':'off'"></span>
    <span class="star-item" :class="score>2 ? 'on' : score>=1.5? 'half':'off'"></span>
    <span class="star-item" :class="score>3 ? 'on' : score>=2.5? 'half':'off'"></span>
    <span class="star-item" :class="score>4 ? 'on' : score>=3.5? 'half':'off'"></span>
    <span class="star-item" :class="score>5 ? 'on' : score>=4.5? 'half':'off'"></span>
  </div>
</template>

<script>
export default {
  name: "Star",
  props: {
    score: Number,
    size: Number
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixins.styl'
  .star //2x图 3x图
    float left
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('./images/star48_on')
        &.half
          bg-image('./images/star48_half')
        &.off
          bg-image('./images/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star36_on')
        &.half
          bg-image('./images/star36_half')
        &.off
          bg-image('./images/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star24_on')
        &.half
          bg-image('./images/star24_half')
        &.off
          bg-image('./images/star24_off')
</style>