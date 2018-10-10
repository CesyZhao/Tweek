
const index = r => require.ensure([],() => r(require('../page/index_new.vue')))
const home = r => require.ensure([],() => r(require('../page/home')))
// const searchResult = r => require.ensure([], () => r(require('../page/search/index')))
const playingDetail = r => require.ensure([], () => r(require('../page/playing/index.vue')))
const playlist = r => require.ensure([], () => r(require('../page/playlist/index')))
const artist = r => require.ensure([], () => r(require('../page/artist/index')))
export default [
	{
		path: '/', component:index,
		children:[
			{ path:'/', name:'home-page',component:home},
			{ path:'/playlist/:id', name:'playlist-detail',component:playlist},
			// { path:'/searchResult/:query',name:'search-result',component:searchResult },
			{ path:'/playingDetail',name:'playing-detail',component:playingDetail },
			{ path:'/artist/:id/:artist',name:'artist',component:artist,meta: { hideController:true } }
		]

	},
	// { path:'/searchResult/:query',name:'search-result',component:searchResult },
]