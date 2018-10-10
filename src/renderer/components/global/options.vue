<template>
	<div class="options">
		<div>
			<el-button type="text" @click="moreClick">
				<i class="ion-navicon-round more"></i>
			</el-button>
			<el-button type="text">
				<i class="ion-stats-bars bar">

				</i>
			</el-button>
		</div>
	</div>
</template>

<script>

export default {
	name: "options",

	props:{
		moreClick:{
			required:true,
			type:Function
		}
	},

  	data() {
	  return {
        logo
	  }
	}
}
</script>

<style lang="less" scoped>
	.options{
		position: absolute;
		z-index: 8888;
		left: 0;
		top: 8px;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 24px;
		padding:0 12px;
		 -webkit-app-region: no-drag;
		.bar,.more{
			color: #333;
			font-size: 20px;
		}
	}
	.user-info{
		width: 32px;
		height: 32px;
		border-radius: 50%;
		overflow: hidden;
	}
	.avatar{
		width: 100%;
		height: 100%;
		transform: scale(2);
		margin-right: 18px;
	}
</style>