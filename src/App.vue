<template>
  <div>
    <!--在他管理的路由间进行切换，路由不会死亡-->
    <keep-alive exclude="Search">
      <router-view></router-view>
    </keep-alive>
    <FooterGuide/>
  </div>
</template>

<script type="text/ecmascript-6">
  import FooterGuide from "@/components/FooterGuide/FooterGuide";

  export default {
    async mounted() {
      this.$store.dispatch('getAddress')
      this.$store.dispatch('autoLogin')
    },

    components: {
      FooterGuide
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>