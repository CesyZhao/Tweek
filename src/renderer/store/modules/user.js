import $http from '../../http/http'

/*
* 获取用户信息
* */
function getUserInfo(){
	const userInfo = localStorage.getItem('userInfo')
	return JSON.parse(userInfo);
}
/*
* 设置用户信息
* */
function setUserInfo(userInfo){
	localStorage.setItem('userInfo',userInfo)
}
/*
* 从远程服务更新用户歌单信息
* */
function getUserPlayListsRemote(id){
	// const id = localStorage.getItem('userInfo').account.id;
	return $http.get(`/user/playlist?uid=${id}`)
}
/*
* 获取用户歌单信息
* */
function getUserPlayLists(){
	const userPlayLists = localStorage.getItem('userPlayLists')
	return JSON.parse(userPlayLists);
}
/*
* 设置用户歌单信息
* */
function setUserPlayLists(playlist){
	localStorage.setItem('userPlayLists',JSON.stringify(playlist))
}
/*
* 获取用户喜欢的音乐
* */
function getUserFavoriteList(){
	const favoiteList = localStorage.getItem('userFavoriteList');
	return JSON.parse(favoiteList);
}
/*
* 设置用户喜欢的音乐
* */
function setUserFavoriteList(list){
	localStorage.setItem('userFavoriteList',JSON.stringify(list))
}
/*
* 获取用户收藏的歌单
* */
function getUserTrackList(){
	const userTrackList = localStorage.getItem('userTrackList');
	return JSON.parse(userTrackList);
}
/*
* 设置用户收藏的歌单
* */
function setUserTrackList(list){
	localStorage.setItem('userTrackList',JSON.stringify(list))
}
/*
* 获取用户创建的歌单
* */
function getUserCreateList(){
	const userCreateList = localStorage.getItem('userCreateList');
	return JSON.parse(userCreateList);
}
/*
* 设置用户创建的歌单
* */
function setUserCreateList(list){
	localStorage.setItem('userCreateList',JSON.stringify(list))
}

const userState = {
	state:{
		userInfo : getUserInfo(),
		userPlayLists: getUserPlayLists(),
		userFavoriteList:getUserFavoriteList(),
		userTrackList:getUserTrackList(),
		userCreateList:getUserCreateList()
	},
	mutations:{
		setUserInfo(state,userInfo){
			state.userInfo = userInfo;
			setUserInfo(JSON.stringify(userInfo))
		},
		setUserPlayLists(state,userPlayLists){
			state.userPlayLists = userPlayLists;
			setUserPlayLists(userPlayLists);
			state.userFavoriteList = getUserFavoriteList()
		},
		setUserFavoriteList(state,userFavoriteList){
			state.userFavoriteList = userFavoriteList;
			setUserFavoriteList(userFavoriteList)
		},
		setUserTrackList(state,userTrackList){
			state.userTrackList = userTrackList;
			setUserTrackList(userTrackList)
		},
		setUserCreateList(state,userCreateList){
			state.userCreateList = userCreateList;
			setUserCreateList(userCreateList)
		}
	}
	,
	actions:{
		setUserInfo({commit},userInfo){
			commit('setUserInfo',userInfo)
		},
		/*
		* 用户歌单发生改变时,更新视图上需要显示的歌单信息
		* */
		updateUserPlayLists({commit},id){
			getUserPlayListsRemote(id).then(res => {
				let favoriteList= [],trackList=[],createList=[];
				res.data.playlist.forEach(item => {
					const userNickName = JSON.parse(localStorage.getItem('userInfo')).profile.nickname
					//分类歌单内容
					if(userNickName === item.creator.nickname){
						if(item.creator.nickname+'喜欢的音乐' === item.name){
							favoriteList.push(item)
						}else{
							createList.push(item)
						}
					}else{
						trackList.push(item)
					}
				})
				commit('setUserFavoriteList',favoriteList);
				commit('setUserTrackList',trackList);
				commit('setUserCreateList',createList);
			})
		},
	}
}
export default userState;