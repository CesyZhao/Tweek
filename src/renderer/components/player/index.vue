<template>
	<div class="progress-wrapper" v-if="currentMusic">
		<el-progress class="progress" :stroke-width="2"  :percentage="percentage" :show-text="false"/>
		<div class="player">
			<div class="player-info">
				<audio id="player" ref="player" :src="currentMusic.src"
				       @canplay="ready" @timeupdate="updateProgress" @error="handleError" :loop="mode === 'reload'"
				       @end="musicEnd" ></audio>
				<div @click="toPlayingPage" class="coverPic">
					<img class="music-album" :src="currentMusic.album.cover">
				</div>
				<div class="music-info" >
					<div class="music-info-name">{{currentMusic.name}}</div>
					<div class="music-info-singer">{{currentMusic.artists[0].name}}</div>
				</div>
			</div>
			<div class="play-btns">
				<el-button  type="text" @click="prevSong">
					<i class="ion-ios-skipbackward"></i>
				</el-button>
				<el-button @click="play" type="text" >
					<i :class="playing?'ion-ios-pause':'ion-ios-play'"></i>
				</el-button>
				<el-button  type="text" @click="nextSong">
					<i class="ion-ios-skipforward"></i>
				</el-button>
			</div>
			<div class="user-btns">
				<span class="timer">{{currentTime}}/{{currentMusic.duration}}</span>
				<el-button  type="text" >
					<i class="ion-ios-heart-outline"></i>
				</el-button>
				<el-button  type="text" @click="changeMode">
					<i :class="'ion-ios-'+mode"></i>
				</el-button>
				<el-popover
					ref="popoverVolume"
					placement="top"
					width="150"
					trigger="hover">
					<el-progress class="volume" :stroke-width="4"  :percentage="92" :show-text="false"/>
				</el-popover>
				<el-button v-popover:popoverVolume  type="text" >
					<i class="ion-ios-volume-high"></i>
				</el-button>
				<el-button  type="text" >
					<i class="ion-ios-clock-outline"></i>
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import modes from '../../config/modes'
	import decoder from '../../util/audioDecode'
	import visualizer from '../../util/visualizer'
	import { mapState } from 'vuex'
	export default {
		name: "music-controller",
		props:{
			music:{
				type:Object
			}
		},
		computed:mapState({
			currentList:state => state.player.currentList,
			currentMusic:state => state.player.currentMusic,
			playing:state => state.player.playing,
			mode:state => state.player.mode,
			history:state => state.player.history
		}),
		watch:{
			currentList(){
				// this.getCurrentMusicInfo()
				this.$nextTick(() => {
					this.play()
				})

			},
			currentMusic(){
				// this.getCurrentMusicInfo()
				this.$nextTick(() => {
					this.play()
				})
			},
			playing(newState){
				this.updatePlayerStatus(newState)
			}
		},
		data(){
			return{
				currentMusicInfo:{},
				currentTime:'00:00',
				percentage:0,
				musicReady:false
			}
		},
		methods:{
			getCurrentMusicInfo(){
				return $util.audio.getCurrentMusicInfo(this.currentList,this.currentMusic)
			},
			updateProgress(e){
				this.$store.dispatch('updateCurrentTime',Math.round(e.target.currentTime * 1000))
				this.currentTime = $util.audio.formatDuration(e.target.currentTime * 1000)
				this.percentage = e.target.currentTime/e.target.duration * 100 || 0
			},
			ready(){
				this.musicReady = true
			},
			play(){
				let player = this.$refs.player;
				this.$store.dispatch('updatePlayerStatus');
			},
			updatePlayerStatus(newState){
				let player = this.$refs.player;
				if(newState){
					try{
						player.play();
					}catch(err){
						this.$store.dispatch('updatePlayerStatus');
					}
				}else{
					player.pause();
				}
			},
			toPlayingPage(){
				this.$router.push({name:'playing-detail'})
			},

			changeMode(){
				let index = modes.indexOf(this.mode)
				let mode;
				if(++index < modes.length){
					mode = modes[index]
					console.log(mode);
				}else{
					mode = 'loop'
				}
				this.$store.dispatch('updatePlayMode',mode)
			},
			async nextSong() {
				const mode = this.mode;
				let next,nextIndex,nextSong
				if(mode === 'loop' || mode === 'reload'){
					let index = this.currentList.findIndex(e => e.id === this.currentMusic.id)
					// 由于存在用来辨别歌单的对象 {name:***} 所以歌单长度减一
					nextIndex = ++index<this.currentList.length-1?index:0;
					nextSong = this.currentList[nextIndex];
				}else{
					//随机模式下，从当前播放歌单除了当前歌曲的剩余歌曲中取一首 songs 即剩余歌曲
					let songs = this.currentList.filter(e => !this.history.includes(e.id))
					if (songs.length) {
						nextSong = songs[Math.floor(Math.random() * songs.length)];
					} else {
						// 当剩余歌曲长度为0 开始新一轮随机
						nextSong = this.currentList[Math.floor(Math.random() * this.currentList.length)];
					}
				}
				$util.audio.updateCurrentMusic(nextSong)
			},
			async prevSong() {
				const mode = this.mode;
				let prev,prevSong,prevIndex
				if (mode === 'loop' || mode === 'reload') {
					let index = this.currentList.findIndex(e => e.id === this.currentMusic.id)
					// 由于存在用来辨别歌单的对象 {name:***} 所以歌单长度减二
					prevIndex = --index >= 0 ? index : this.currentList.length - 2;
					prevSong = this.currentList[prevIndex]
				} else {
					//随机模式的上一首，从播放历史列表中取，假如历史中上一首不存在于当前播放列表，则开始新一轮的随机
					let prevIndexInHistory = this.history.findIndex(i =>  i.id === this.currentMusic.id)
					prevSong = this.history[prevIndexInHistory -1]
					if( !prevSong || this.currentList.findIndex(i => i.id === prevSong.id) < 0){
						prevSong = this.currentList[Math.floor(Math.random() * this.currentList.length)];
					}
				}
				$util.audio.updateCurrentMusic(prevSong)
			},
			musicEnd(){
				if(this.mode !== 'reload'){
					this.nextSong();
				}
			},
			handleError(e){
				this.nextSong();
			}
		},
		created(){
			// this.getCurrentMusicInfo();
		}
	}
</script>

<style lang="less" scoped>
	.progress-wrapper{
		position: absolute;
		width: 100%;
		bottom:0;
		height: 60px;
		display: flex;
		flex-direction: column;
		border-bottom-left-radius: 2px;
		border-bottom-right-radius: 2px;
		background-color: rgba(255, 255, 255, 1);
		i:hover{
			text-shadow: 0 0 8px #fff;
		}
		z-index: 2222;
	}
	.progress{
		flex: 1;
		line-height: 1;
		background-color: transparent;
	}
	.player{
		margin-top: -3px;
		flex: 9;
		display: flex;
		color:#333;
		.coverPic:hover{
			cursor: pointer;
		}
		.play-btns{
			width: 60%;
			button+button{
				margin-left:24px;
			}
		}
		.user-btns{
			width: 20%;
		}
		i{
			font-size: 20px;
			color:#333;
		}
		.play-btns{
			button:nth-of-type(2){
				text-align: center;
				i{
					font-size: 28px;
				}
			}
		}
		.user-btns{
			margin-right: 12px;
			i{
				font-size: 18px;
			}
			button:nth-of-type(2){
				i{
					font-size: 18px;
				}
			}
			button:nth-of-type(3){
				margin-left: 10px;
				i{
					font-size: 26px;
				}
			}
		}
		/*background-color: #fff;*/
	}
	.player-info{
		width: 20%;
		height: 100%;
		overflow: hidden;
		display: flex;
		align-items: center;
		&>div:nth-child(2){
			margin:0 2px;
			width: 25%;
		}
		&>div:nth-child(3){
			margin-left: 2px;
			width: 75%;
		}
		img{
			margin-left: 1px;
		}
	}
	.music-info{
		display: flex;
		flex-direction: column;
	}
	.timer{
		font-size: 12px;
		margin-right: 12px;
	}
	.play-btns,.user-btns{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.music-album{
		width: 47px;
		height: 48px;
	}
	.music-info-name{
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-bottom: 8px;
		font-size: 13px;
	}
	.music-info-singer{
		width: 100%;
		font-size: 12px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.volume{
		width: 100%;
	}
</style>