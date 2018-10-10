<template>
  <div class="playlist-wrapper">
      <splash-screen v-if="loading"></splash-screen>
      <div class="playlist-aside">
            <div class="playlist-cover">
                <img class="playlist-coverPic" :src="playlist.coverImgUrl" alt=""/>
            </div>
            <div class="listener-history">
                <div class="list-header " style="padding-left:12px">LISTENING HISYTORY</div>
                <div class="with-shadow">
                    <div class="listener-avatar ">
                        <img class="userAvatar" v-for="user in listenHistory" :key="user.userId" :src="user.avatarUrl" alt="" />
                    </div>
                    <div class="list-header" style="padding-left:12px">SIMILAR SINGER</div>
                    <div class="listener-avatar">
                        <img class="userAvatar" v-for="singer in similarSinger" :key="singer.id" :src="singer.picUrl" alt="" />
                    </div>
                </div>
            </div>
      </div>
      <div class="playlist-songs">
          <div class="playlist-info">
                <div class="playlist-name">
                   <span> {{playlist.name}} </span>
                </div>
                <!-- <div class="playlist-desc">
                    {{playlist.description}}
                </div> -->
                <div class="playlist-labels">
                    <!-- <span class="playlist-label">Songs: {{playlist.trackCount}}</span> -->
                    <!-- <span class="playlist-label">Subscribers: {{Math.round(playlist.subscribedCount/1000)}} K</span> -->
                    <span class="playlist-label">Played: {{Math.round(playlist.playCount/1000)}} K</span>
                    <span class="playlist-label">By: {{playlist.creatorName}}</span>
                </div>
                <div class="contentRow">
                    <swiper class="swiper" :options="swiperOption">
                        <swiper-slide class="album" v-for="(song,index) in current20" :key="song.id" @click.native="goPlaylist(song.id)">
                            <lazy-image class="song-img" :src="song.album.cover" @load="hideLoader(index)" alt="" />
                            <div v-if="loaded.includes(index)" class="swiper-lazy-preloader"></div>
                        </swiper-slide>
                    </swiper>
                </div>
          </div>
          <div class="list-header border">
                <el-col  :span="4" style="text-align:center;">       
                        TRACK
                </el-col>
                <el-col :span="11">
                    NAME
                </el-col>
                <el-col  :span="7">
                    ARTIST
                </el-col>
                <el-col :span="2">
                   TIME
                </el-col>
          </div>
          <div class="playlist-list">
              <div>
                  <el-row class="playlist-song"  v-for="(song,index) in playlist.songs" :key="index" @click.native="playMusic(song,index)">
                    <!-- <indicator :show="currentIndex === index" /> -->
                    <el-col class="song-indicator list-col" :span="4">       
                        <indicator :show="currentMusic.id === song.id" />{{currentMusic.id === song.id? '': index + 1}}
                    </el-col>
                    <el-col class="song-name list-col" :span="11">
                        {{song.name}}
                    </el-col>
                    <el-col class="list-col" :span="7">
                        {{song.artists[0].name}}
                    </el-col>
                    <el-col :span="2">
                        {{song.duration}}
                    </el-col>
                </el-row>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
    import 'swiper/dist/css/swiper.css'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import lazyImage from '../../components/global/lazyImage.vue'
    export default{
        name:'playlist',
        components:{
            swiper, swiperSlide,lazyImage
        },
        mixins: [$mixins.indicator],
        watch:{ 
            currentMusic(newSong){
                this.getSimilarSinger(newSong)
                this.getListenHistory(newSong)
                this.updateCurrent20(newSong)
            },
            $route(newRoute){
                this.id = newRoute.params.id
                this.getData(this.id)
            }
        },
        data(){
            return {
                loading:true,
                id:this.$route.params.id,
                playlist:{},
                listenHistory:[],
                similarSinger:[],
                loaded:[],
                current20:[],
                swiperOption: {
                    lazy: true,
                    slidesPerView: 10,
                    slidesPerColumn: 1,
					spaceBetween: 0,
				},
            }
        },
        methods:{
             playMusic(item, index) {
				let list = [...this.playlist.songs];
				$util.audio.updateCurrentList(list,this.playlist.name)
				$util.audio.updateCurrentMusic(item)
            },
            getListenHistory(song){
                $http.get('/simi/user?id='+song.id)
                    .then(res => {
                        this.listenHistory = res.data.userprofiles
                    })
            },
            getSimilarSinger(song){
                $http.get('/simi/artist?id='+song.artists[0].id)
                    .then(res => {
                       this.similarSinger = res.data.artists.slice(0,5)
                    })
            },
            updateCurrent20(song){
               let index =  this.current20.findIndex(e => e.id === song.id);
               if(index> -1){
                   return;
               }
                let songs =  this.playlist.songs;
                let indexInlist =  songs.findIndex(e => e.id === song.id);
                this.current20 = songs.slice(indexInlist,indexInlist+10)
                if(indexInlist+10 > songs.length){
                    let rest =songs.slice(indexInlist- (indexInlist+10-songs.length),indexInlist) 
                    this.current20 = rest.concat(this.current20)
                }
            },
            hideLoader(index){
                this.loaded.push(index)
            },
            async fetchDataForPlayList(id){
                try{
                    let res = await $http.get('/playlist/detail?id='+id);
                    let playlist = res.data.playlist;
                    console.log(playlist,'list')
                    let {name, creator:{nickname:creatorName}, playCount, description, coverImgUrl, subscribedCount, trackCount} = playlist;
                    this.playlist = {name, creatorName, playCount, description, coverImgUrl, subscribedCount, trackCount}
                    let songs = playlist.tracks.map(e => {
                        // eslint-disable-next-line
                        console.log(e,'++++++++=')
                        let {al /* Album */, ar /* Artist */} = e;
                        return {
                            id: e.id.toString(),
                            name: e.name,
                            duration: $util.audio.formatDuration(e.duration),
                            album: {
                                id: al.id.toString(),
                                name: al.name,
                                cover: `${al.picUrl}?param=y100y100`,
                                link: `/player/1/${al.id}`
                            },
                            artists: ar.map(e => ({
                                id: e.id.toString(),
                                name: e.name,
                                // Broken link
                                link: e.id ? `/artist/${e.id}` : '',
                            }))
                        };
                    });
                    return songs;
                }catch(err){
                    console.log(err)
                }
            },
            async fetchDataForAlbums(id){
                try{
                    let res = await $http.get(`/album?id=${id}`)
                    // let { name, artist:{name:name}, ,description,picUrl, }
                }catch(err){
                    console.log(err)
                }
            },
            async getData(id){
                this.loading = true;
                let from  = this.$route.params.from;
                let songs = from === 'albums' ? await this.fetchDataForAlbums(id) : await this.fetchDataForPlayList(id)
                this.playlist.songs = songs
                console.log(songs, '==========')
                // 默认显示前20首歌曲的图片
                this.current20 = this.playlist.songs.slice(0,10)
                // 获取最近听过的人以及相似歌手
                this.getListenHistory(songs[0])
                this.getSimilarSinger(songs[0])
                // 保证页面加载完成之后，加载页面才会消失
                this.$nextTick(() => {
                    this.loading = false;
                })
            }
        },
        created () {
            this.getData(this.id)
        }
    }
</script>
<style lang="less" scoped>
    @listHeight:calc(~'100% - 365px');
    .playlist-wrapper{
        display: flex;
        height: calc(~'100% - 60px');
        overflow: hidden;
        margin-top: -24px;
        // border-top-left-radius: 4px;
        // border-top-right-radius: 4px;
        background-color: #fff;
        // font-family:'HelveticaNeue-UltraLight'
    }
    .playlist-aside{
        width: 300px;
        height: 100%;
        // padding:0 24px;
        // box-shadow: 0 -2px 4px 0 #4e4d5b;
    }
    .playlist-cover{
        position: relative;
        width: 300px;
        height: 300px;
        &:after{
            content: "  ";
            position: absolute;
            left:100px;
            display: block;
            width: 200px;
            height: 200px;
            // border: 1px dashed #fff;
            box-shadow: 0 0 60px 0 #fff inset;
            z-index: 22;
        }
    }
    .playlist-coverPic{
        position: absolute;
        border-top-left-radius: 2px;
        // top: 60px;
        z-index: 23;
        width: 300px;
        height: 300px;
        // box-shadow: 0 0 10px 0 #fff;
    }
    .listener-history{
        height: calc(~'100% - 300px');
        // padding:0 12px;
        font-size: 20px;
        // box-shadow: 2px 0 5px 0 #48cfad;
    }
    .listener-avatar{
        display: flex;
        justify-content: space-around;
        margin-top: 12px;
        margin-bottom: 24px;
    }
    .userAvatar{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .playlist-name{
        position: absolute;
        top:36px;
        margin-bottom: 48px;
        overflow: hidden;
        white-space: nowrap;
        font-size: 28px;
        text-overflow: ellipsis;
        font-family: lucida;
        color:#fff;
        span{
            display: inline-block;
            padding: 12px 16px;
            background-color: #000;
        }
    }
    .playlist-desc{
        overflow: hidden;
        text-indent: 28px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        font-size: 14px;
        line-height: 20px;
        color:#333;
    }
    .contentRow{
        position: absolute;
        bottom: 0;
        width: 100%;
        margin-top: 24px;
        overflow-x: auto ;
    }
    .song-img{
        width: 10%;
        height: 60px;
    }
    .list-header{
        height:54px;
        line-height:54px;
        font-size:18px;
        color: #999;
    }
    .playlist-songs{
        // padding: 48px 24px;
        width:calc(~'100% - 300px');
        overflow: hidden;
        color:#8A7680;
    }
    .playlist-list{
        height: calc(~'100% - 365px');
        // box-shadow: 2px -2px 10px 0 #48cfad inset;
        padding: 4px;
        overflow-y: scroll;
        &::-webkit-scrollbar{
            width: 0;
            height: 0;
        }
    } 
    .list-col{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .playlist-song{
        cursor: pointer;
        margin-bottom: 16px;
    }
    .playlist-info{
        position: relative;
        top: -24px;
        height: 300px;
        box-sizing: border-box;
        margin-bottom: -24px;
        // padding: 36px 24px 0 24px;
        background-color: #C1C0C0;
    }
    .playlist-labels{
        margin-top: 24px;
    }
    .playlist-label{
        position: absolute;
        display: inline-block;
        padding: 12px 16px;
        background-color: #000;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #fff;
        &:nth-child(1){
            top:172px;
        }
        &:nth-child(2){
           top:110px;
        }
    
    }
    .song-indicator{
        // padding: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .with-shadow{
        height:calc(~'100% - 36px');
        margin-top: -25px;
        padding-top: 25px;
        box-shadow: 0 30px 30px 0 #48cfad;
    }
    .border{
        border-bottom: 2px solid #999;
    }
</style>
