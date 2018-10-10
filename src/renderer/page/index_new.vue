<template>
	<div class="wrapper">
		<div class="content">
			<div class="dragger"></div>
			<options :moreClick="toggleMore"/>
			<router-view></router-view>
			<more :show="ifShowMore" @close="toggleMore" @goSearch="toggleSearch" @goLogin="toggleLogin"/>
			<search :show="ifShowSeach" @close="toggleSearch"/>
			<!-- <controller v-show="!$route.meta.hideController" :music="music"/> -->
			<login :show="ifShowLogin" @close="toggleLogin"/>
		</div>
	</div>
</template>

<script>
	import controller from '../components/player/index'
	import more from '../components/global/more'
	import login from './login'
	export default {
		name: "index_new",
		components: {
			controller,
			more,
			login
		},
		data() {
			return {
				ifShowMore:false,
				ifShowSeach:false,
				ifShowLogin:false,
				music:{}
			}
		},
		methods: {
			toggleMore(){
				this.ifShowMore = !this.ifShowMore
			},
			toggleSearch(){
				this.ifShowSeach = !this.ifShowSeach
			},
			toggleLogin(){
				this.ifShowLogin = !this.ifShowLogin
			}
		}
	}
</script>

<style lang="less" scoped>
	.wrapper{
		flex:1;
		height: 100%;
		border-radius: 2px;
		// background: linear-gradient(to right, #0099f7, #f11712);
	}
	.content{
		height:100%;
		border-radius: 2px;
		/*background: linear-gradient(to top, transparent, rgba(255, 255	, 255, 1));*/
		background: #fff;
	}
	.dragger{
		position: relative;
		background: transparent;
		z-index: 999;
		width: 100%;
		height: 16px;
		-webkit-app-region: drag;
		&:hover{
			cursor: pointer;
		}
	}
</style>