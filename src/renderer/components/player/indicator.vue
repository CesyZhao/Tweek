<template>
		<div :class="['indicator',playing?'playing':''] " v-if="show">
		</div>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		name: "now-playing",
		props:{
			show:{
				type:Boolean,
				required:true
			}
		},
		computed:mapState({
			playing:state => state.player.playing
		})
	}
</script>

<style lang="less" scoped>
	.indicator{
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #4fa4a1;
		box-shadow: 0 0 5px 0 #4fa4a1;
	}
	.indicator.playing{
		animation: lights 1.5s alternate infinite;
	}
	@keyframes lights {
		0%{background:  rgba(79,164,164,0);}
		100%{
			background: rgba(79,164,164,1);
		}
	}
</style>