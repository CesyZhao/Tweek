<template>
	<div class="wrapper-home">
		<splash-screen v-if="loading"></splash-screen>
		<div class="background">

		</div>
		<div class="content-wrapper">
			<div class="user-info">
				<div class="avatar">
					<img  :src="userInfo?userInfo.profile.avatarUrl:logo"  alt="">
				</div>
				<div class="user-about">
					<div class="user-name">{{ userInfo? userInfo.username: 'Tweek' }}</div>
					<div class="user-signature">{{ userInfo? userInfo.signature: 'Enjoy the song' }}</div>
				</div>
			</div>
			<div class="contentRow">
				<div class="title">
                    <span>Playlist</span>
                    <i class="el-icon-menu"></i>
                </div>
				 <!--<swiper class="swiper" :options="swiperOption">
                    <swiper-slide class="album" v-for="album in recommendList" :key="album.id" @click.native="goPlaylist(album.id)">
                        <img class="album-img" :src="album.picUrl" alt="">
                        <div class="album-name">{{album.name}}</div>
                    </swiper-slide>
                </swiper>-->
                <div class="item-wrapper">
                    <div class="album" v-for="album in recommendList" :key="album.id">
                        <img class="album-img" :src="album.picUrl" alt="">
                        <div class="album-name">{{album.name}}</div>
                    </div>
                </div>
			</div>
		</div>
	</div>
</template>

<script>
	import recommend from '../assets/icon/music.png'
	import charlie from '../assets/image/charlie.jpg'
	import 'swiper/dist/css/swiper.css'
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import logo from "../assets/image/tweek.png"
	export default {
		name: "home",
		components:{
			swiper,
			swiperSlide,
		},
		data(){
			return {
				loading:true,
				recommend,
				charlie,
				swiperOption: {
					slidesPerView: 4,
                    slicePerColumn: 2,
                  	direction: 'vertical',
                    mousewheel: true,
				},
				recommendList : [],
              	logo
			}
		},
		mounted(){
			this.$http.get('/personalized')
				.then(res => {
					this.recommendList = res.data.result;
					this.loading = false;
				})
		},
	}
</script>

<style lang="less" scoped>
	.wrapper-home{
		box-sizing: border-box;
		position: absolute;
		z-index: 8;
		top: 0;
		width: 100%;
		/*margin-top: 64px;*/
		/*padding: 0 16px;*/
		/*display: flex;
		justify-content: space-around;
		flex-direction: column;*/
		color:#fff;
	}
	.background{
		height: 144px;
		background: #ccc;
	}
	.content-wrapper{
		position: relative;
		top: -32px;
		margin-bottom: -32px;
		padding: 0 12px;
	}
	.user-info{
		position: relative;
		padding: 16px 16px 108px ;
		background: #eee;
		box-shadow: 0 1px 2px 0 #6ef1dc;
		font-family: HelveticaNeue;
		.avatar{
			position: absolute;
			top:-24px;
			width: 84px;
			height: 84px;
			overflow: hidden;
			box-shadow: 0 0 5px 0 #000;
			img{
				width: 100%;
				height: 100%;
				transform: scale(2.5);
			}
		}
		.user-about{
			margin-left: 108px;
			color: black;
			.user-name{
				font-size: 24px;
				line-height: 32px;
			}
			.user-signature{
				color:#6ef1dc;
			}
		}
	}

	.welcome,.description{
		text-align: center;
		span{
			background: linear-gradient(to right,  #0099f7, #f11712);
			-webkit-background-clip: text;
			color:transparent;
			font-weight: bold;
		}
	}
	.welcome{
		font-size:54px;
		letter-spacing:4.5px;
		margin-bottom: 8px;
	}
	.description{
		letter-spacing:2px;
	}
	.searchRow{
		padding:10px 200px 50px 200px;
		.el-button{
			color:#fbfdfb;
		}
	}
	.contentRow{
		height: 445px;
		color: #000;

	}
    .title{
        display: flex;
        justify-content: space-between;
        height: 36px;
        align-items: center;
        i{
            font-size: 20px;
        }
    }
    .item-wrapper{
        height: 408px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        overflow-y: auto ;
        font-family: HelveticaNeue;
        &::-webkit-scrollbar{
            width: 0;
            height: 0;
        }
    }
	.content{
		display: flex;
	}
	.swiper{
		padding-top: 15px;
	}
	.swiper-slide {
		height: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.album{
        width: 160px;
		font-size: 12px;
		&:hover{
			cursor: pointer;
		}
	}
	.album-name{
        width: 100%;
		margin-top: 8px;
        overflow: hidden;
        white-space: nowrap;
		text-overflow: ellipsis;
		color:#333;
	}
	.album-img{
		width: 160px;
		height: 160px;
		transition: all .2s linear;
		&:hover{
			/*transform: scale(1.1);*/
			box-shadow: 0px 0px 15px 0px #4e4d5b;
		}
	}
</style>