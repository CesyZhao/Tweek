<template>
	<transition  enter-active-class="fadeInDown" leave-active-class="fadeOutUp">
		<div  :class="['loginWrapper',show?'sidebar-show':'']">
			<el-button type="text" class="btn-close" @click="close">
				<i class="ion-ios-arrow-thin-right" />
			</el-button>
			<img class="logo" :src="logo" alt="logo图片">
			<el-form ref="loginForm" :rules="rules" :model="form" size="mini">
				<el-form-item  prop="username">
					<el-input  v-model="form.username" placeholder="请输入手机号">
						<i slot="prefix" class="ion-ios-person"></i>
					</el-input>
				</el-form-item>
				<el-form-item  prop="password">
					<el-input v-model="form.password" type="password" placeholder="请输入密码">
						<i slot="prefix" class="ion-ios-locked"></i>
					</el-input>
				</el-form-item>
				<el-form-item  >
					<span class="logo-error">{{loginError}}</span>
				</el-form-item>
				<el-form-item  >
					<el-button :disabled="loginDisabled" :loading="logining" class="btn-login" @click="login">登  录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</transition>
</template>

<script>
	import logo from '../assets/image/favicon.png'
	export default {
		name: "login",
		props:{
			show:{
				required:true
			}
		},
		data(){
			return {
				logo,
				rules:{
					username:[{required:true,message: '请输入用户名'}],
					password:[{required:true,message:'请输入密码'}]
				},
				form:{},
				logining:false,
				loginDisabled:false,
				loginError:''
			}
		},
		methods:{
			close(){
				this.$emit('close')
			},
			login(){
				this.loginDisabled = true;
				const form  = this.$refs.loginForm;
				form.validate(valid => {
					if(valid){
						this.logining = true;
						$http.get(`/login/cellphone?phone=${this.form.username}&password=${this.form.password}`)
							.then(res => {
								if(res.data.code === 200){
									this.$store.dispatch('setUserInfo',res.data);
									this.$store.dispatch('updateUserPlayLists',res.data.account.id);
									this.close();
								}else{
									this.loginError = res.data.msg
								}
							})
							.finally(() => {
								this.logining = false;
							})
					}
					this.loginDisabled = false;
				})

			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../style/components.less";
	.loginWrapper{
		.sidebar-right(8889);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		i{
			font-size: 20px;
		}
	}
	.logo{
		width: 100px;
		height: 100px;
		border-radius: 50%;
		margin-top: 48px;
		margin-bottom: 108px;
		animation: lights 2.5s alternate infinite;
	}
	@keyframes lights {
		0%{ box-shadow:  0 0 0px rgba(13,235,249,0);}
		100%{
			box-shadow:  0 0 40px rgba(13,235,249,1);
		}
	}
	.btn-login{
		width: 100%;
		background: transparent;
		color:#fdfdfb;
	}
	.logo-error{
		height: 12px;
		line-height: 12px;
		font-size: 12px;
		color:#841010;
	}
</style>