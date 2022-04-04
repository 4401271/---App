<template>
  <div>
    <router-view></router-view>
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