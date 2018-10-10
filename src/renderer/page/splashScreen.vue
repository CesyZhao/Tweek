<template>
	<div class="splashScreen" >
		<div class="wrapper">
			<!-- <div>
				<img :src="loading" class="logo">
			</div> -->

			<div class="svg-box">
				<svg class="lds-balls" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
					<circle cx="62.0344" cy="74.7275" r="5" fill="#0055a5">
						<animate attributeName="cx" values="80;59.270509831248425" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
						<animate attributeName="cy" values="50;78.53169548885461" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
						<animate attributeName="fill" values="#0055a5;#45aee7" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
					</circle>
					<circle cx="30.2016" cy="69.0866" r="5" fill="#45aee7">
						<animate attributeName="cx" values="59.270509831248425;25.72949016875158" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
						<animate attributeName="cy" values="78.53169548885461;67.6335575687742" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
						<animate attributeName="fill" values="#45aee7;#bda0b2" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
					</circle>
					<circle cx="25.7295" cy="37.0687" r="5" fill="#bda0b2">
						<animate attributeName="cx" values="25.72949016875158;25.729490168751575" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
						<animate attributeName="cy" values="67.6335575687742;32.366442431225806" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
						<animate attributeName="fill" values="#bda0b2;#ce64a6" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
					</circle>
					<circle cx="54.7984" cy="22.9214" r="5" fill="#ce64a6">
						<animate attributeName="cx" values="25.729490168751575;59.27050983124842" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
						<animate attributeName="cy" values="32.366442431225806;21.46830451114539" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
						<animate attributeName="fill" values="#ce64a6;#d8f05b" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
					</circle>
					<circle cx="77.2361" cy="46.1958" r="5" fill="#d8f05b">
						<animate attributeName="cx" values="59.27050983124842;80" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
						<animate attributeName="cy" values="21.46830451114539;49.99999999999999" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
						<animate attributeName="fill" values="#d8f05b;#0055a5" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animate>
					</circle>
				</svg>
			</div>
			<div>
				<span>{{script}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	import logo from '../assets/image/favicon.png'
	import scripts from '../config/loading'
	import loading from '../assets/image/loading2.gif'
	export default {
		name: "splashscreen",
		/*	props:{
				show:{
					type:Boolean,
					required:true
				}
			},*/
		data(){
			return {
				loading,
				logo,
				script:''
			}
		},
		created(){
			this.script = scripts[Math.floor(Math.random() * scripts.length)];
		}
	}
</script>

<style lang="less" scoped>
	.logo{
		width: 50px;
		height: 50px;
		margin-bottom: 78px;
	}
	.splashScreen{
		position: absolute;
		z-index: 9999;
		left:0;
		right: 0;
		top:0;
		bottom:0;
		background: #fff;
		// background: linear-gradient(to right bottom, #4fa4a1 , #432c7a);
		// background: -webkit-linear-gradient(to right bottom, #4fa4a1 , #432c7a);
		transition:1s ease-in-out;
		.wrapper{
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		border-radius: 2px;
	}
	.svg-box{
		width: 100px;
		height: 100px;
		margin-bottom: 78px;
	}
</style>