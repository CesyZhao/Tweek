<template>
  <div class="swiper-lazy-box">
    <img class="swiper-lazy" :data-src="src" ref="imgEle">
  </div>
</template>

<script>
  export default {
    name: 'lazyImage',
    props: {
      src: String
    },
    mounted(){
      this.$refs.imgEle.src = this.src
    }
  }
</script>
<style scoped lang="less">
    .swiper-lazy-box{
      width: 100%;
      height: 100%;
    }
    .swiper-lazy{
      width: 100%;
       height: 100%;
       vertical-align: middle;
    }
</style>
