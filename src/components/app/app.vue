<template>
  <div>
    <router-view></router-view>
    <!--<v-footer></v-footer>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import footer from '../footer/footer.vue'
  export default {
    components: {
      'v-footer': footer
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
