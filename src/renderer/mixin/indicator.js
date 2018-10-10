import { mapState } from 'vuex'
const indicator = {
    computed:mapState({
        currentMusic: state =>  state.player.currentMusic
    })
}
export default indicator;