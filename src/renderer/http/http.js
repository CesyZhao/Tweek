import Vue from 'vue'
import axios from 'axios';
import  message  from 'iview/src/components/message';

const instance = axios.create({
	xhrFields: {
		withCredentials: true
	},
	timeout:50000
})
instance.interceptors.response.use((resp) => {
	return resp;
},(error) => {
	if(error.response){
		switch(error.response.status){
			case 401:
				message.warning({
					content:'Your authorization is expired!',
					duration:1
				})
				break;
			case 403:
				message.error({
					content:'Access denied,full authorization is required!',
					duration:3
				})
				break;
			case 404:
				message.error({
					content:'Oops,the file you\'re looking for does not exist!',
					duration:3
				})
				break;
			case 500:
				message.error({
					content:'Sorry,something went wrong,pelease try again!',
					duration:3
				})
				break;
		}
	}
	return Promise.reject(error);
})
export default instance;