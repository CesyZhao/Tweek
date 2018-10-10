import Vue from 'vue'
import indicator from './indicator'

Vue.mixin({
    methods: {
        goPlaylist(id){
            this.$router.push({name:'playlist-detail',params:{id}})
        }
    }
});

export default {
    indicator
}