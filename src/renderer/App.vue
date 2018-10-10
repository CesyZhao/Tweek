<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
	export default {
		name: 'Tweek'
	}
</script>

<style>
  #app{
    position: absolute;
    left: 10px;
    right: 10px;
    top:10px;
    bottom: 10px;
    border-radius: 2px;
    box-shadow: 0 0 15px 0 #555;
  }
</style>
