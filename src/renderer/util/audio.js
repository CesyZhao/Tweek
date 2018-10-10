import store from '../store'
const audio ={
	pad(number) {
		return ('0' + number).slice(-2);
	},
	/*
	* 格式化时间  毫秒 => 秒
	* */
	formatDuration(duration){
		var minutes = Math.floor(duration / 1000 / 60);
		var second = Math.floor(duration / 1000 - minutes * 60);
		return `${this.pad(minutes)}:${this.pad(second)}`;
	},
	/**
	 * 格式化处理歌词
	*/
	formatLyric(lyric){
		let result = {};
		let lyrics = lyric.split('\n');
		lyrics.map(e => {
			let match = e.match(/\[.+\]/);
			if (!match) {
				return;
			}
			let timestamp = match[0].replace(/\D/g, ':').replace(/^:|:$/g, '').split(':');
			let content = e.replace(/\[.+\]/, '');
			let times = parseInt(+timestamp[0] * 60 * 1000) + parseInt(+timestamp[1] * 1000) + parseInt(timestamp[2]);
			result[times] = content;
		});
		return result;
	},
	/*
	* 准备音乐信息,正常情况下应该使用 playUrl 但是由于接口时不时会 403 所以暂时使用 backupUrl
	* */
	async resolveSong(song,index) {
		let musicInfo = {};
		musicInfo.index = index;
		//获取音乐封面
		let detail = await $http.get('/song/detail?ids=' + song.id)
		musicInfo.coverPic = detail.data.songs[0].al.picUrl
		//获取音乐播放地址
		let musicUrlInfo = await $http.get('/music/url?id='+song.id)
		musicInfo.playUrl = musicUrlInfo.data.data?musicUrlInfo.data.data[0].url:''
		musicInfo.backupUrl = `http://music.163.com/song/media/outer/url?id=${song.id}.mp3`
		// musicInfo.backupUrl = musicUrlInfo.data.data[0].url || `http://music.163.com/song/media/outer/url?id=${song.id}.mp3`
		return Object.assign(song,musicInfo);
	},
	/*
	* 更新当前播放列表以及当前播放音乐;方式及效果待考究,不知道有没有什么遗漏
	* */
	updateCurrentMusic(music){
		const currentMusic = store.state.player.currentMusic || {};
		//音乐相同不重复更新
		if(music.index !== currentMusic.index || music.name !== currentMusic.name){
			store.dispatch('setCurrentMusic',music)
		}
	},
	updateCurrentList(list,listName){
		const currentList = store.state.player.currentList || [{}];
		//列表相同不重复更新
		if(currentList[currentList.length-1].listName !== listName){
			list.push({listName});
			store.dispatch('setCurrentList',list);
		}
	},
	/*
	* 获取当前播放音乐的信息
	* */
	getCurrentMusicInfo(currentList,currentMusic){
		let music = currentList.find(item => item.id === currentMusic.id)
		let index = currentList.findIndex(item => item.id === currentMusic.id)
		if(music && index === currentMusic.index){
			return currentMusic;
		}else{
			return {}
		}

	}
}
export default audio;