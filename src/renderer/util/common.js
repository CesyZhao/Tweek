const util = {
	pad(number) {
		return ('0' + number).slice(-2);
	},
	formatDuration(duration){
		var minutes = Math.floor(duration / 1000 / 60);
		var second = Math.floor(duration / 1000 - minutes * 60);
		return `${this.pad(minutes)}:${this.pad(second)}`;
	}
};
export default util;