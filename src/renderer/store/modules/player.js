/*
* 获取当前播放音乐列表
* */
function getCurrentList(){
	let list = localStorage.getItem('currentList')
	return JSON.parse(list)
}
/*
* 设置当前播放列表
* */
function setCurrentList(list){
	localStorage.setItem('currentList',JSON.stringify(list))
}
/*
* 获取当前播放音乐
* */
function getCurrentMusic(){
	let music = localStorage.getItem('currentMusic')
	return JSON.parse(music) || {};
}
/*
* 设置当前播放音乐
* */
function setCurrentMusic(music){
	localStorage.setItem('currentMusic',JSON.stringify(music))
}
/*
* 播放历史列表，因为播放历史应该在播放器关闭时清空，所以这里不存放于localStorage
* */
function updateHistory(){

}
/*
* 获取播放模式
* */
function getPlayMode(){
	let mode = localStorage.getItem('mode')
	return mode || 'loop';
}
function setPlayMode(mode){
	localStorage.setItem('mode',mode)
}


/*
** 获取歌曲 url
*/
async function resolveSong(song) {
	let musicInfo = {};
	//获取音乐封面
	let detail = await $http.get('/song/detail?ids=' + song.id)
	//获取音乐播放地址
	let musicUrlInfo = await $http.get('/music/url?id='+song.id)
	// musicInfo.playUrl = musicUrlInfo.data.data?musicUrlInfo.data.data[0].url:''
	// musicInfo.backupUrl = `http://music.163.com/song/media/outer/url?id=${song.id}.mp3`
	musicInfo.src = musicUrlInfo.data.data[0].url || `http://music.163.com/song/media/outer/url?id=${song.id}.mp3`
	return Object.assign(song,musicInfo);
}
const musicState = {
	state:{
		currentList:getCurrentList(),
		currentMusic:getCurrentMusic(),
		history:[],
		playing:false,
		mode:getPlayMode(),
		currentTime:0
	},
	mutations:{
		setCurrentList(state,currentList){
			state.currentList = currentList;
			setCurrentList(currentList)
		},
		setCurrentMusic(state,currentMusic){
			state.currentMusic = currentMusic;
			setCurrentMusic(currentMusic)
		},
		updateHistory(state,music){
			state.history.push(music)
			state.history.length > 100 && state.history.splice(0, 1)
			console.log(state.history)
		},
		updatePlayerStatus(state){
			state.playing = !state.playing
		},
		updatePlayMode(state,mode){
			state.mode = mode
			setPlayMode(mode)
		},
		updateCurrentTime(state,time){
			state.currentTime = time
		}
	},
	actions:{
		setCurrentList({commit},currentList){
			commit('setCurrentList',currentList)
		},
		async setCurrentMusic({commit},currentMusic){
			currentMusic = await resolveSong(currentMusic);
			commit('setCurrentMusic',currentMusic);
			commit('updateHistory',currentMusic)
		},
		/*
		* 更新音乐播放器状态
		* */
		updatePlayerStatus({commit}){
			commit('updatePlayerStatus')
		},
		updatePlayMode({commit},mode){
			commit('updatePlayMode',mode)
		},
		updateCurrentTime({commit},time){
			commit('updateCurrentTime',time)
		}
	}
};

export default musicState;