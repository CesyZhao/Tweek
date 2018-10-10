<template>
  <div>
      <canvas ref="mycanvas" id="mycanvas"></canvas>
  </div>
</template>
<script>
    import Universe from '../util/canvas'
    export default{
        mounted(){
            console.log('11111');
            let visualizer = this.$refs.mycanvas;
			this.Universe = new Universe(visualizer)
        }
    }
</script>
<style scoped>
    div {
        width: 100vw;
        height: 100vh;
        box-sizing: border-box;
    }
    #mycanvas {
        display: block;
        cursor: pointer;
    }
</style>
