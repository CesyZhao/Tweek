<template>
    <div class="lyric-wrapper">
        <div class="song-info">
            <h2>{{currentMusic.name}}</h2>
            <span>singer:{{currentMusic.artists[0].name}}</span>
        </div>
        <div ref="wrapper" class="wrapper">
            <ul class="lyric wheel-scroll">
                <li v-for="(lyric,key) in lyrics" ref="lyricLine" :key="key" :class="['wheel-item',nextIndex-1 === times.indexOf(key)? 'active':'']"> 
                    <div class="lyric-row">{{lyric}}</div>
                    <div class="tlyric-row" v-if="tlyrics">{{tlyrics[key]}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import betterScroll from 'better-scroll';
    export default{
        name: 'lyric-scroller',
        props: {
            lyrics:{
                type:Object,
                required:true
            },
            tlyrics:{
                required:true
            }
        },
        data(){
            return {
                 times:[],
                 nextIndex:0,
                 num : typeof this.tlyrics === 'object'?4:9
            }
        },
        watch:{
            currentTime(newTime){
                this.findNextIndex(newTime)
            }
        },
        computed:mapState({
            currentMusic:state => state.player.currentMusic,
            currentTime:state => state.player.currentTime
        }),
        mounted(){
            this.scroller = new betterScroll(this.$refs.wrapper,{})  
            this.times = Object.keys(this.lyrics)
        },
        methods:{
            findNextIndex(time){
                let nextIndex = this.times.findIndex(item =>{
                     return +item > time
                })
                this.nextIndex = nextIndex
                if (nextIndex > this.num) {  
                    let lineEl = this.$refs.lyricLine[nextIndex - this.num]  
                    this.scroller.scrollToElement(lineEl, 1000)  
                } else {  
                    this.scroller.scrollToElement(0, 0, 1000)  
                }  
            }
        }
    }
</script>
<style scoped lang="less">
    .lyric-wrapper{
        width: 50%;
        height: 100%;
        box-sizing: border-box;
        padding: 16px 16px 96px 16px;
    }
    .wrapper{
        box-sizing: border-box;
        height: 100%;
        overflow: hidden;
        // overflow-y: scroll;
        &::-webkit-scrollbar{
            width: 0;
            height: 0;
        }
    }
    .wheel-scroll{
        padding: 0 0 12px 0;
        list-style: none;
        .wheel-item{
            list-style: none;
            // overflow: hidden;
            white-space: nowrap;
            color:#aaa
        }
        .active{
            color:#fff;
        }
    }
    .lyric-row,.tlyric-row{
        height: 32px;
        line-height: 24px;
        font-size: 16px;
    }
    .tlyric-row{
        font-size: 12px;
    }
</style>
