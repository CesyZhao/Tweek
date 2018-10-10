<template>
	<div :class="['more-wrapper',show?'sidebar-show':'']">
		<el-button type="text" class="btn-close" @click="close">
			<i class="ion-ios-arrow-thin-right" />
		</el-button>
		<div class="more-content">
			<div class="user-info">
				<img  :src="userInfo?userInfo.profile.avatarUrl:logo" class="avatar" alt="">
				<div class="userInfo-options">
					<div class="username" type="text" @click="goLogin">{{userInfo?userInfo.profile.nickname:'Login'}}</div>
					<div v-show="userInfo" class="logout">logout</div>
				</div>
			</div>
			<ul class="menu">
				<li class="menu-item" @click="goHome">Home</li>
				<li  class="menu-item" @click="goSearch">Search</li>
				<li  class="menu-item">Local Music</li>
				<li  class="menu-item">My Favorite</li>
				<li  class="menu-item">Albums</li>
				<li  class="menu-item">Preferences</li>
				<li  class="menu-item" @click="test">Minimize</li>
				<li  class="menu-item" @click="quit">Quit</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import { ipcRenderer } from 'electron'
	import logo from "../../assets/image/favicon.png"
	import { mapState } from 'vuex'
	import notifier  from 'electron-notifications'
	// import logo from '../../assets/image/favicon.png'
	export default {
		name: "more",
		props:{
			show:{
				required:true
			}
		},
		data(){
			return {
				logo,
			}
		},
		computed:mapState({
			userInfo:state => state.user.userInfo,
			currentMusic: state => state.player.currentMusic
		}),
		methods:{
			close(){
				this.$emit('close')
			},
			goHome(){
				this.close();
				this.$router.push({name:'home-page'})
			},
			goSearch(){
				this.close();
				this.$emit('goSearch')
			},
			goLogin(){
				!this.userInfo && this.$emit('goLogin')
			},
			quit(){
				ipcRenderer.send('asynchronous-message', 'close');
			},
			test(){
				ipcRenderer.send('asynchronous-message', 'minimize');
				// const notification = notifier.notify('Tweek', {
				// 	message: this.currentMusic.name,
				// 	icon: this.currentMusic.album.cover,
				// 	buttons: ['Previous', 'Next'],
				// 	duration:10000
				// 	})
				// console.log(notification)
				// notification.on('buttonClicked',() => {
				// 	notification.send('setup', 'Tweek1', {
				// 		message: this.currentMusic.name,
				// 		icon: this.currentMusic.album.cover,
				// 		buttons: ['Previous', 'Next'],
				// 		duration:10000
				// 	});
				// })
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../../style/components.less";
	.more-wrapper{
		.sidebar-right(8889);
		font-family: HelveticaNeue;
		overflow-y: hidden;
	}
	.more-content{
		padding-top: 36px;
		padding-left: 24px;
	}
	.user-info{
		display: flex;
	}
	.btn-close{
		color:#333;
	}
	.userInfo-options{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		cursor: pointer;
	}
	.avatar{
		width: 48px;
		height: 48px;
		border-radius: 50%;
		margin-right: 18px;
	}
	.username{
		font-size: 20px;
	}
	.menu{
		list-style: none;
		padding: 10px;
		font-size: 24px;
	}
	.menu-item{
		margin-top: 20px;
		display: flex;
		flex-direction: column;
		cursor: pointer;
		font-weight: bold;
		&::after{
			content: ' ';
			position: relative;
			top:-8px;
			z-index: -1;
			width: 0;
			height: 1px;
			background: #333;
			transition: all .1s ease-in-out;
			}
		&:hover{
			&::after{
				width: 100%;
			}
		}
	}
</style>