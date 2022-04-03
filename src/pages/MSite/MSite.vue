<template>
  <section class="msite">
    <!--首页头部-->
    <Header :title="address.name || '正在定位中...'">
      <span class="header_search" slot="header_left">
        <i class="iconfont iconsousuo"></i>
      </span>

      <span class="header_login" slot="header_right">
        <span class="header_login_text" @click="$router.push('/login')" v-show="!user._id">登录|注册</span>
      </span>
    </Header>

    <!--首页导航-->
    <nav class="msite_nav">
      <!--   使用的判别方法是判断categoriesArr中的数据是否已经存在，即长度是否大于0   -->
      <div class="swiper-container" ref="sc1" v-if="categoriesArr.length > 0">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(cs, index1) in categoriesArr" :key="index1">
            <a href="javascript:" class="link_to_food" v-for="(c, index2) in cs" :key="index2">
              <div class="food_container">
                <img :src="'https://fuss10.elemecdn.com'+c.image_url">
              </div>
              <span>{{c.title}}</span>
            </a>
          </div>
        </div>

        <!-- 分页指示器 -->
        <div class="swiper-pagination"></div>

      </div>
      <img src="./images/msite_back.svg" alt="loading..." v-else>
    </nav>

    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont iconxuanxiangqiacaidananniu"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <div class="shop_container">
        <ul class="shop_list" v-if="shops.length>0">
          <li class="shop_li border-1px" v-for="shop in shops" :key="shop.id" @click="$router.push(`/shop/${shop.id}`)">
            <!--
            这种设置跳转路由的方式，会导致重定向失效！！！
            @click="$router.push({
              name: 'shop',
              params: {
                id: shop.id
              }
            })-->
            <a>
              <div class="shop_left">
                <img class="shop_img" :src="'https://fuss10.elemecdn.com' + shop.image_path">
              </div>
              <div class="shop_right">
                <section class="shop_detail_header">
                  <h4 class="shop_title ellipsis">{{shop.name}}</h4>
                  <ul class="shop_detail_ul">
                    <li class="supports" v-for="(support, index) in shop.supports" :key="index">{{support.icon_name}}</li>
                  </ul>
                </section>
                <section class="shop_rating_order">
                  <section class="shop_rating_order_left">
                    <Star :score="shop.rating" :size="24"/>
                    <div class="rating_section">
                      {{shop.rating}}
                    </div>
                    <div class="order_section">
                      月售{{ shop.recent_order_num }}单
                    </div>
                  </section>
                  <section class="shop_rating_order_right">
                    <span class="delivery_style delivery_right">{{shop.delivery_mode.text}}</span>
                  </section>
                </section>
                <section class="shop_distance">
                  <p class="shop_delivery_msg">
                    <span>¥{{shop.float_minimum_order_amount}}起送</span>
                    <span class="segmentation">/</span>
                    <span>{{shop.piecewise_agent_fee.tips}}</span>
                  </p>
                </section>
              </div>
            </a>
          </li>
        </ul>
        <ul v-else>
          <li>
            <img src="./images/shop_back.svg" alt="loading">
          </li>
          <li>
            <img src="./images/shop_back.svg" alt="loading">
          </li>
          <li>
            <img src="./images/shop_back.svg" alt="loading">
          </li>
          <li>
            <img src="./images/shop_back.svg" alt="loading">
          </li>
          <li>
            <img src="./images/shop_back.svg" alt="loading">
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
  import Swiper from 'swiper'
  import 'swiper/swiper-bundle.css'
  import {mapState} from 'vuex'
  import chunk from 'lodash/chunk'

  export default {
    name: "Msite",
    computed:{
      ...mapState({
        address: state => state.msite.address,
        categories: state => state.msite.categories,
        shops: state => state.msite.shops,
        user: state => state.user.user,
      }),

      /*categoriesArr(){
        const {categories} = this
        const bigArr = []
        let smallArr = []

        categories.forEach((c)=>{
          smallArr.push(c)
          if ( smallArr.length === 8 ){
            bigArr.push(smallArr)
            smallArr = []
          }
        })

        return bigArr
      }*/

      // 实现方式2：使用lodash实现
      categoriesArr(){
        return chunk(this.categories, 8)
      }
    },



    async mounted() {
 
      await this.$store.dispatch('getCategories')
      await this.$store.dispatch('getShops')
      // 方法二：dispatch
      new Swiper ('.swiper-container', {
        loop: true, // 循环模式选项

        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination',
        },

        // 如果需要滚动条
        scrollbar: {
          el: '.swiper-scrollbar',
        },
      })
      /* 原来调用Swiper的位置 */

    },
    /*
    * Swiper对象必须要在列表数据显示之后创建
    * 解决由于同步调用Swiper而导致的：调用Swiper时数据已获取，但获取的知识初始数据[]，因此列表尚无法显示而产生的轮播图无法滑动的问题
    *   问题的实质：在原来调用Swiper时，通过getCategories获取的数据还是[]，还并未真正获取到数据，数据列表是在经过后面一系列计算之后才真正产生的，因此调用Swiper会出现问题
    *
    * 解决方案一：watch
    *   将categories数据状态放至watch中进行监听，当数据发生改变时便使之触发Swiper的调用即可
    * 方案二：dispatch
    *   在dispatch前加上await，就表示是在数据加载完成之后才会接着执行剩下的代码，因此只要将Swiper的代码放至dispatch之后即可保证数据列表已经加载完成
    * */

    // 方案一：
    /*watch: {
      categories(){
        this.$nextTick(()=>{
          new Swiper ('.swiper-container', {
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
            },

            // 如果需要滚动条
            scrollbar: {
              el: '.swiper-scrollbar',
            },
          })
        })
      }
    }*/
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixins.styl'
  .msite  //首页
    width 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            padding-top 19px
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 40px
                  height 40px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0
        .iconxuanxiangqiacaidananniu
          margin 0 5px 0 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px
      .shop_container
        margin-bottom 50px
        .shop_list
          .shop_li
            bottom-border-1px(#f1f1f1)
            width 100%
            >a
              clearFix()
              display block
              box-sizing border-box
              padding 15px 8px
              width 100%
              .shop_left
                float left
                box-sizing border-box
                width 23%
                height 75px
                padding-right 10px
                .shop_img
                  display block
                  width 100%
                  height 100%
              .shop_right
                float right
                width 77%
                .shop_detail_header
                  clearFix()
                  width 100%
                  .shop_title
                    float left
                    width 200px
                    color #333
                    font-size 16px
                    line-height 16px
                    font-weight 700
                    &::before
                      content '品牌'
                      display inline-block
                      font-size 11px
                      line-height 11px
                      color #333
                      background-color #ffd930
                      padding 2px 2px
                      border-radius 2px
                      margin-right 5px
                  .shop_detail_ul
                    float right
                    margin-top 3px
                    .supports
                      float left
                      font-size 10px
                      color #999
                      border 1px solid #f1f1f1
                      padding 0 2px
                      border-radius 2px
                .shop_rating_order
                  clearFix()
                  width 100%
                  margin-top 18px
                  margin-bottom 8px
                  .shop_rating_order_left
                    float left
                    color #ff9a0d
                    .rating_section
                      float left
                      font-size 10px
                      color #ff6000
                      margin-left 4px
                    .order_section
                      float left
                      font-size 10px
                      color #666
                      transform scale(.8)
                  .shop_rating_order_right
                    float right
                    font-size 0
                    .delivery_style
                      transform-origin 35px 0
                      transform scale(.7)
                      display inline-block
                      font-size 12px
                      padding 1px
                      border-radius 2px
                    .delivery_left
                      color #fff
                      margin-right -10px
                      background-color #02a774
                      border 1px solid #02a774
                    .delivery_right
                      color #02a774
                      border 1px solid #02a774
                .shop_distance
                  clearFix()
                  width 100%
                  font-size 12px
                  .shop_delivery_msg
                    float left
                    transform-origin 0
                    transform scale(.9)
                    color #666
                  .segmentation
                    color #ccc

</style>