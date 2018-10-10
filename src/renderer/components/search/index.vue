<template>
	<div class="search-wrapper" v-show="show">
		<div class="search-row">
			<input type="text" v-model="keywords" class="search-input" placeholder="Search Here..." @keypress.enter="searchByKeywords" />
			<span class="btn-close" @click="close"><i class="ion-ios-close-empty"></i></span>
		</div>
		<el-menu default-active="1000" class="searchType" mode="horizontal" @select="handleSearch">
			<!-- <el-menu-item index="1">Songs</el-menu-item> -->
			<el-menu-item index="1000">Playlists</el-menu-item>
			<el-menu-item index="100">Singers</el-menu-item>
			<el-menu-item index="1002">Users</el-menu-item>
		</el-menu>
		<div class="searchResult">
			<!-- <section v-show="selected === '1'">
				<el-row class="result"  v-for="(song,index) in songs" :key="index" @click.native="playMusic(song,index)">
					<indicator :show="currentIndex === index" />
					<el-col class="song-name" :span="9">
						{{song.name}}
					</el-col>
					<el-col :span="9">
						{{song.artists[0].name}}
					</el-col>
					<el-col :span="3">
						{{song.duration}}
					</el-col>
				</el-row>
			</section> -->																										
			<section v-show="selected === '1000'">
				<el-row class="result" v-for="(album,index) in albums" :key="index" @click.native="goPlaylist(album.id)">
					<el-col :span="2">
						<img class="album-img" :src="album.coverImgUrl" alt="歌单图片">
					</el-col>
					<el-col :span="8">
						{{album.name}}
					</el-col>
					<el-col :span="8">
						by  {{ album.creator.nickname}}
					</el-col>
					<el-col :span="4">
						{{album.trackCount}} songs
					</el-col>
					<el-col :span="2">
						<i class="ion-ios-heart tracks" ></i>
						{{album.bookCount}}
					</el-col>
				</el-row>
			</section>
			<section v-show="selected === '100'">
				<el-col class="artist" :span="12" v-for="(artist,index) in artists" :key="index" @click.native="goArtist(artist.id,artist)">
					<el-col :span="4">
						<img class="artist-img" :src="artist.picUrl || artist.img1v1Url" alt="歌手头像">
					</el-col>
					<el-col :span="12">
						<el-row class="artist-name">{{artist.name}}</el-row>
						<el-row>{{artist.albumSize}} albums</el-row>
					</el-col>
				</el-col>
			</section>
			<section v-show="selected === '1002'">
				<el-col class="user" v-for="(user,index) in users" :key="index" :span="6">
					<img class="user-img" :src="user.avatarUrl" alt="用户头像">
					<span>{{user.nickname}}</span>
				</el-col>
			</section>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		name: "search-result",
		props:{
			show:{
				require:true
			}
		},
		watch:{
			currentMusic(newSong){
				this.updateIndex(newSong)
			}
		},
		computed:mapState({
			currentMusic:state => state.player.currentMusic
		}),
		data(){
			return {
				keywords:'',
				songs:[],
				albums:[],
				artists:[],
				users:[],
				selected:'1000',
				currentIndex:-1
			}
		},
		methods:{
			close(){
				this.$emit('close')
			},
			updateIndex(song){
				this.currentIndex = song.index
			},
			goPlaylist(id){
				this.close()
				this.$router.push({name:'playlist-detail',params:{id}})
			},
			goArtist(id,artist){
				this.close()
				this.$router.push({name:'artist',params:{id,artist}})
			},
			async playMusic(item, index) {
				let song = await $util.audio.resolveSong(item,index)
				let list = [...this.songs];
				// $util.audio.updateCurrentList(list,this.keywords)
				$util.audio.updateCurrentMusic(song)
				this.close();
			},
			handleSearch(index){
				this.selected = index;
			},
			async searchByKeywords() {
				let query = this.keywords;
				/*let songs = await this.searchSongs(query);
				songs.songs.forEach(item => {
					item.duration = $util.audio.formatDuration(item.duration);
				});
				this.songs = songs.songs;*/
				let albums = await this.searchAlbums(query);
				this.albums = albums.playlists;
				let artists = await this.searchArtists(query);
				this.artists = artists.artists;
				let users = await this.searchUsers(query);
				this.users = users.userprofiles;
			},
			async searchSongs(query) {
				let res = await $http.get(`/search?type=1&keywords=${query}`)
				return res.data.result;

			},
			async searchAlbums(query) {
				let res = await $http.get(`/search?type=1000&keywords=${query}`)
				return res.data.result;

			},
			async searchArtists(query) {
				let res = await $http.get(`/search?type=100&keywords=${query}`)
				return res.data.result;

			},
			async searchUsers(query) {
				let res = await $http.get(`/search?type=1002&keywords=${query}`)
				return res.data.result;

			}
		}
	}
</script>

<style lang="less" scoped>
	.search-wrapper{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		padding: 24px;
		background-color: rgba(0,0,0,.85);
		z-index: 99999;
		border-radius: 2px;
		color:#fff;
	} 
	.search-row{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 54px;
		.search-input{
			height: 54px;
			width:85%;
			padding: 4px;
			border: none;
			font-size: 54px;
			font-family: HelveticaNeue;
			background: transparent;
			color:#fff;
			&:focus{
				outline: none;
			}
		}
		.btn-close{
			font-size: 48px;
			cursor: pointer;
		}
	}
	.searchType{
		margin-top: 8px;
		height: 48px;
		.el-menu-item{
			height: 48px;
			line-height: 48px;
			font-size: 20px;
		}
		border-bottom-color: #909399;
	}
	.searchResult{
		box-sizing: border-box;
		padding: 8px;
		font-size: 14px;
		height: 510px;
		overflow: scroll;
		&::-webkit-scrollbar{
			width: 0;
			height: 0;
		}
	}

	.result{
		margin-top: 4px;
		padding: 4px 8px;
		transition: all .1s ease-in-out;
		display: flex;
		align-items: center;
		&:hover{
			color:#409EFF;
			cursor: pointer;
			img{
				transform: scale(1.5);
				transition: all .3s ease-in-out;
			}
		}
	}
	.album-img{
		width: 40px;
		height: 40px;
	}
	.tracks{
		color:#E21E5C;
	}
	.artist{
		display: flex;
		align-items: center;
		margin-top: 12px;
		padding: 4px 8px;
		&:hover{
			color:#409EFF;
			cursor: pointer;
			.artist-img{
				transform: scale(1.5);
				box-shadow: 0 0 5px 0 #eee;
				transition: all .3s ease-in-out;
			}
		}
	}
	.artist-name{
		font-size: 16px;
		margin-bottom: 8px;
	}
	.artist-img{
		width: 50px;
		height: 50px;
		transition: all .1s ease-in-out;
	}
	.user{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 10px 0;
		&:hover{
			color:#409EFF;
			cursor: pointer;
			.user-img{
				transform: scale(1.1);
				box-shadow: 0 0 5px 0 #eee;
				transition: all .3s ease-in-out;
			}
		}
	}
	.user-img{
		width: 100px;
		height: 100px;
		border-radius: 50%;
		margin-bottom: 16px;
		transition: all .1s ease-in-out;
	}
	.song-name{
		padding: 4px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>