<template>
	<div class="playing-wrapper">
		<div class="under-layer" :style="`background-image:url(${currentMusic.album.cover.replace('y100y100','y500y500')})`">
			<!-- <canvas class="visualizer" id="visualizer"></canvas> -->
		</div>
		<div class="up-layer">
			<div class="cover">
				<div class="song-cover">
					<img class="song-coverPic" :src="currentMusic.album.cover.replace('y100y100','y250y250')" alt=""/>
				</div>
			</div>
			<lyric-scroller v-if="lyrics" :lyrics="lyrics" :tlyrics="tlyrics"></lyric-scroller>	
		</div>
	</div>
</template>

<script>
	import lyricScroller from '../../components/lyric/index.vue'
	import { mapState } from 'vuex'
	import Universe from '../../util/canvas'
	export default {
		name: "playing",
		watch: {
			playing(playing){
				playing? this.Universe.start() : this.Universe.stop()
			}	
		},
		components:{
			lyricScroller
		},
		computed:mapState({
			currentMusic:state => state.player.currentMusic,
			playing:state => state.player.playing
		}),
		data(){
			return {
				Universe:{},
				lyrics:null
			}
		},
		methods: {

		},
		created(){
			// console.log(this.$refs.player)
			$http.get('/lyric?id='+this.currentMusic.id)
				.then(res => {
					this.lyrics = $util.audio.formatLyric(res.data.lrc.lyric);
					this.tlyrics = res.data.tlyric.lyric?$util.audio.formatLyric(res.data.tlyric.lyric):null;
				})
		},
		mounted() {
			let audio = document.getElementById('player')
			let visualizer = document.getElementById('visualizer')
			this.Universe = new Universe(visualizer)
			// this.playing? this.Universe.start() : this.Universe.stop()
		}
	}
</script>

<style lang="less" scoped>
	.playing-wrapper{
		box-sizing: border-box;
		margin-top: -24px;
		height: 100%;
		padding-bottom: 60px;
		overflow: hidden;
	}
	.under-layer,.up-layer{
		position: absolute;
		width: 100%;
		height: 100%;
	}
	.song-cover{
		position: relative;
		top:64px;
		left: 64px;
        width: 400px;
		height: 400px;
        &:after{
            content: "  ";
            position: absolute;
            left:100px;
            display: block;
            width: 250px;
            height: 250px;
            // border: 1px dashed #fff;
            box-shadow: 0 0 60px 0 #fff inset;
            z-index: 22;
        }
    }
    .song-coverPic{
        position: absolute;
        top: 60px;
        z-index: 23;
        width: 250px;
        height: 250px;
        box-shadow: 0 0 10px 0 #fff;
    }
	.under-layer{
		// z-index:2;
		top: 50%;
		left: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		filter: blur(20px);
		overflow: hidden;
		z-index: 2;
		img{
			display: inline-block;
			height: auto;
			max-width: 100%;
		}
	}
	.visualizer{
		display: block;
    	cursor: pointer;
	}
	.up-layer{
		z-index: 4;
		display: flex;	
		background: rgba(0,0,0,.7)
	}
	.cover{
		width: 50%;
		height: 100%;
	}
	.lyric-scroller{
		flex: 1;
		// background: #fff;
	}
</style>