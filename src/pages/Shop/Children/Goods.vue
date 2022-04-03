<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="left">
        <ul ref="leftUL">
          <li class="menu-item" v-for="(good, index) in goods" :key="index" :class="{current: index === currentIndex}" @click="clickItem(index)">
            <span class="text bottom-border-1px">
              <img class="icon" :src="good.icon" v-if="good.icon">
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="right">
        <ul ref="rightUL">
          <li class="food-list-hook" v-for="(good, index) in goods" :key="index">  <!-- 右侧轮播分组名：折扣... -->
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods" :key="index">  <!-- 每个分组中的菜品：南瓜粥、红豆薏米粥...  -->
                <div class="icon" @click="showFood(food)">
                  <img width="57" height="57" :src="food.icon" />
                </div>
                <div class="content" >
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{ food.rating }}%</span></div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food"/>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <Food :food="food" ref="food"/>
      <ShopCart/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import BScroll from 'better-scroll'
import Food from "@/components/Food/Food";
import ShopCart from "@/components/ShopCart/ShopCart";
export default {
  name: "Goods",
  data() {
    return{
      // 核心是通过右侧区域的纵坐标和右侧各个版块对应的高度去计算，然后根据计算的结果来控制左侧的显示情况
      scrollY: 0,   // 右侧列表左上角相对于父元素的坐标
      tops: [],    // 记录右侧每个版块的标题栏对应的坐标
      food: {},    // 需要显示的food，开始是一个空对象，点击图片之后才将food数据传递进去
    }
  },

  computed: {
    ...mapState({
      goods: state => state.shop.shop.goods || []
    }),
    // 计算当前滑至第几个区域
    currentIndex() {
      const {scrollY, tops} = this
      // 寻找右侧当前分类项位于top的哪个区域内
      const index = tops.findIndex((top, index)=> scrollY >= top && scrollY < tops[index+1])
      if ( this.leftScroll ){
        const li = this.$refs.leftUL.children[index]
        this.leftScroll.scrollToElement(li, 400)
      }
      return index
    }
  },

  methods: {
    // 添加绑定监听事件
    _addScroll(){
      // 通过实例化Scroll对象来给两个版块添加滑动效果
      this.leftScroll = new BScroll(this.$refs.left, {
        // 禁用了原生的click事件，而是使用的自定义的事件去处理的，默认用不分发，分发默认的click事件
        click: true
      })
      this.rightScroll = new BScroll(this.$refs.right, {
        click: true,
        // probeType: 0
        probeType: 1  // 低频触发  惯性不触发  因为不包含惯性，只需要在滑动结束时监听一下坐标，进行一下修改即可
        // probeType: 2  // 高频触发  惯性不触发
        // probeType: 3  // 高频触发  惯性触发
      })
      // 给右侧滑动添加监听事件，以实时获取坐标状态
      this.rightScroll.on('scroll', ({x, y})=>{
        this.scrollY = Math.abs(y)
      }),
      this.rightScroll.on('scrollEnd', ({x, y})=>{
        this.scrollY = Math.abs(y)
      })
    },
    // 获取右侧所有li对应的高度值
    _getEachTop(){
      let tops = []
      let top = 0
      const lis = Array.from(this.$refs.rightUL.children)
      tops.push(top)
      lis.forEach((li)=>{
        top += li.clientHeight
        tops.push(top)
      })
      this.tops = tops
    },
    clickItem(index){
      this.scrollY = this.tops[index]
      this.rightScroll.scrollTo(0, -this.tops[index], 400)
    },
    showFood(food){
      this.food = food
      this.$refs.food.toggleShow()
    },
  },

  mounted() {
    // 如果数据已经存在，那么就需要我们初始化，因为数据已经存在，所以假如我们不改变数据，数据是无法被watch检测到的，就需要初始化起作用，不然滑动效果就无法起作用，
    if (this.goods.length > 0){
      this._addScroll()
      this._getEachTop()
    }
  },

  watch: {
    goods() {
      this.$nextTick(()=>{
        /* 若使用的是swiper， 这个库需要在获取数据之后才能调用Swiper函数，否则是接受不到数据的，那么我们就需要做一下处理，我们需要监听goods的数据变化，只有当数据变化时，才表示获取到了数据，才可以再去调用Swiper*/
        this._addScroll()
        this._getEachTop()

      })
    }
  },
  components: {
    Food,
    ShopCart
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import "../../../common/stylus/mixins.styl"

.goods
  display: flex
  position: absolute
  top: 225px
  bottom: 46px
  width: 100%
  background: #fff;
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 56px
      padding: 0 12px
      line-height: 14px
      &.current
        position: relative
        z-index: 10
        margin-top: -1px
        background: #fff
        color: $green
        font-weight: 700
        .text
          border-none()
      .icon
        display: inline-block
        vertical-align: top
        width: 12px
        height: 12px
        margin-right: 2px
        background-size: 12px 12px
        background-repeat: no-repeat
      .text
        display: table-cell
        width: 56px
        vertical-align: middle
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px
  .foods-wrapper
    flex: 1
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      bottom-border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .desc, .extra
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .desc
          line-height: 12px
          margin-bottom: 8px
        .extra
          .count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 12px
</style>
