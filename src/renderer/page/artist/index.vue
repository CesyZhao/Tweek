<template>
  <div class="artist-wrapper">
      <div class="top">
        <img class="artist-cover" :src="artist.picUrl.replace(/\?.*$/, '?param=20y10')" alt="">
        <div class="control">
           <span class="artist-label">{{artist.mvSize}} MV{{artist.mvSize>1?"S":""}}</span> 
           <span class="artist-label">{{artist.albumSize}} ALBUM{{artist.albumSize>1?"S":""}}</span>
           <span class="artist-label">
               <i :class="artist.followed?'ion-ios-heart':'ion-ios-heart-outline'"></i>
               {{artist.followed?'unfollow':'follow'}}</span>
           <div class="play-btn" @click="play">
               <i :class="playing?'ion-ios-pause':'ion-ios-play'"></i>
           </div>
            <canvas ref="canvas" />
        </div>
      </div>
      <div class="bottom">
        <el-menu default-active="1000" class="searchType" mode="horizontal" @select="handleSearch">
			<!-- <el-menu-item index="1">Songs</el-menu-item> -->
			<el-menu-item index="1000" style="color:#000">Top50</el-menu-item>
			<el-menu-item index="100" style="color:#000">Albums</el-menu-item>
			<el-menu-item index="1002" style="color:#000">Similar Artists</el-menu-item>
		</el-menu>
        <div class="searchResult">
            <section v-show="selected === '1000'">
                <el-row class="result"  v-for="(song,index) in top50" :key="index" @click.native="playMusic(song,index)">
                    <el-col class="song-indicator list-col" :span="1">       
						<indicator :show="currentMusic.id === song.id" />{{currentMusic.id === song.id? '': index + 1}}
					</el-col>
                    <el-col class="song-name" :span="14">
                        {{song.name}}
                    </el-col>
                    <el-col :span="6">
                        {{song.artists[0].name}}
                    </el-col>
                    <el-col :span="3">
                        {{song.duration}}
                    </el-col>
                </el-row>
            </section>
            <section v-show="selected === '100'">
                <el-row class="result" v-for="(album,index) in albums" :key="index" @click.native="goPlaylist(album.id)">
					<el-col :span="2">
						<img class="album-img" :src="album.picUrl" alt="歌单图片">
					</el-col>
                    <el-col :span="16" class="song-name">
						{{album.name}}
					</el-col>
                    <el-col :span="4" >
						{{album.size}} songs
					</el-col>
				</el-row>
            </section>
            <section v-show="selected === '1002'">

            </section>
        </div>
      </div>
  </div>
</template>
<script>
    import { mapState } from 'vuex';
    import sine from '../../components/canvas/sine.js' ;
    export default{
        name:'artist',
        watch:{
            $route(newRoute){
                this.artist = newRoute.params.artist;
                this.getTop50(this.artist.id)
                this.getAllAlbums(this.artist.id)
            },
        },
        computed:mapState({
             playing:state => state.player.playing,
             currentMusic: state => state.player.currentMusic,
             currentList:state =>  state.player.currentList
        }),
        data(){
            return {
                artist:this.$route.params.artist,
                top50:[],
                albums:[],
                selected:'1000',
                currentIndex:-1
            }
        },
        methods: {
            async getTop50(id){
                try{
                    let res = await $http.get(`/artists?id=${id}`)
                    console.log(res.data.hotSongs);
                    this.top50 = res.data.hotSongs.map(e => {
                        let {al /* Album */, ar /* Artist */} = e;
                        return {
                            id: e.id.toString(),
                            name: e.name,
                            duration: $util.audio.formatDuration(e.dt),
                            album: {
                                id: al.id.toString(),
                                name: al.name,
                                cover: `${al.picUrl}?param=y100y100`, 
                                link: `/player/1/${al.id}`
                            },
                            artists: [ar.find(ar => ar.name.includes(this.artist.name))]
                        };
                        // item.artist[0] = item.ar.find(ar => ar.name.includes(this.artist.name))
                        // item.duration  = $util.audio.formatDuration(item.dt)
                        // return item;
                    });
                }catch(err){
                    console.log(err)
                }
            },
            async getAllAlbums(id){
                try{
                    let res = await $http.get(`/artist/album?id=${id}&limit=10000`)
                    this.albums = res.data.hotAlbums;
                    console.log('als',this.albums)
                }catch(err){
                    console.log(err)
                }
            },
            async getSimilarArtists(id){
                try{
                    let res = await $http.get(`/simi/artist?id=${id}`)
                    this.similarArtists = res.data.artists
                }catch(err){
                    console.log(err)
                }
            },
            handleSearch(index){
				this.selected = index;
            },
            goPlaylist(id){
               this.$router.push({name:'playlist-detail',params:{id,from:'albums'}})
            },
            play(){
                this.$store.dispatch('updatePlayerStatus')
                let list = [...this.top50];
				$util.audio.updateCurrentList(list,this.artist.name)
				$util.audio.updateCurrentMusic(list[0])
            }
        },
        created(){
            this.playing && this.$store.dispatch('updatePlayerStatus')
           this.getTop50(this.artist.id)
           this.getAllAlbums(this.artist.id)
           this.getSimilarArtists(this.artist.id)
        },
        mounted(){
            console.log(this.$refs.canvas)
            sine.show(this.$refs.canvas);
            // sine.hide();
        }
    }
</script>
<style lang="less" scoped>
    @windowWidth:100%;
    .artist-wrapper{
        margin-top: -24px;
        height: 100%;
        overflow: hidden;
        background-color: #fff;
    }
    .top{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 350px;
        overflow: hidden;
        box-shadow: 0 0 36px 0 rgba(0, 0, 0, .5);
    }
    .control{
        position: absolute;
        left: 0;
        top:0;
        width: 100%;
        height: 100%;
        display: flex;
        box-sizing: border-box;
        padding-left: 48px;
        padding-bottom: 36px;
        // background: #fff;
    }
    .artist-label{
        align-self: flex-end;
        padding: 8px 16px;
        margin-left: 16px;
        background-color: #fff;
        border-radius: 8px;
        color:#000;
        white-space: nowrap;
        // box-shadow: 0 0 24px 0 rgba(13,235,249,.8);
    }
    .bottom{
        height: 55%;
        padding: 0 24px;
    }
    .artist-cover{
        position: absolute;
        left: 0;
        top:0;
        width: 100%;
        height: 100%;
        // width: 180px;
        // height: 180px;
        // box-shadow: 0 0 24px 0 rgba(13,235,249,.8);
    }
    .play-btn{
        position: absolute;
        left: 64px;
        top: 96px;
        height: 64px;
        width: 64px;
        line-height: 64px;
        text-align: center;
        border-radius: 64px;
        background: #16c182;
        font-size: 24px;
        box-shadow: 0 0 24px rgba(0, 0, 0, .5);
        cursor: pointer;
        z-index: 9;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        // width: 64px;
        // height: 64px;
        // margin-top: 24px;
        // margin-left: 64px;
        // background: linear-gradient(to right bottom, #4fa4a1 , #432c7a);
        // // box-shadow: 0 0 24px 0 rgba(13,235,249,.8);
        // border-radius: 50%;
        // color:#eee;
        // font-size: 24px;
        &:hover{
            cursor: pointer;
        }
    }
    .searchResult{
		box-sizing: border-box;
		padding: 8px;
		font-size: 14px;
		height: 340px;
		overflow: scroll;
		&::-webkit-scrollbar{
			width: 0;
			height: 0;
		}
	}
    .result{
		margin-top: 4px;
		padding: 8px 8px;
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
    .song-name{
        overflow: hidden;
        padding-right: 16px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .album-img{
		width: 40px;
		height: 40px;
    }
    canvas{
        transform: translate(-300px,-205px);
    }
</style>

