<template>
	<view class="content">
		<view class="top-view" :style="{backgroundImage: 'url(' + background + ')'}">
			<view class="top-view-content">
				<!-- <view class="top-view-content-one">三维博弈ERP</view> -->
				<view class="top-view-content-one">矿山易购Boss端</view>
				<image class="top-view-content-two" src="../../static/img/login/Login-cover.png"></image>
				<view class="top-view-content-three">实时生产跟踪</view>
			</view>
		</view>
		<view class="bottom-view">
			<view class="bottom-view-account">
				<image class="bottom-view-account-uimg" src="../../static/img/login/Login-icon.png"></image>
				<m-input class="bottom-view-accountInput" type="text" placeholder="请输入姓名" v-model="account" />
			</view>
			<view class="bottom-view-pwd">
				<image class="bottom-view-account-pimg" src="../../static/img/login/Login-qrCode.png"></image>
				<m-input class="bottom-view-pwdInput" type="password" placeholder="请输入密码" v-model="password" />
			</view>
			<!-- <button type="primary" class="bottom-view-loginBtn" @tap="handleLoginBtn">登录</button> -->
			<!-- <button class="bottom-view-loginBtn" @tap="handleLoginBtn" open-type="getUserInfo" @getuserinfo="wxGetUserInfo">登录</button> -->
			<button class="bottom-view-loginBtn" open-type="getUserInfo" @getuserinfo="wxGetUserInfo">登录</button>
		</view>
	</view>
</template>

<script>
	import md5 from '../../static/util/md5.js';
	import mInput from '@/components/m-input.vue';
	import img from '../../static/img/login/Login-bg.png';
	import service from '../../static/service/service.js';

	export default {
		components: {
			mInput
		},
		data() {
			return {
				// 账号
				account: 'admin',
				// 密码
				password: '123456',
				// 为了适配小程序 将顶部背景图转成base64
				background: img,
				// 用户头像
				wechatIcon: '',
				// wechatCode
				wechatCode: ''
			}
		},
		methods: {
			wxGetUserInfo: function(res) {
				let _this = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						_this.wechatCode = loginRes.code; 
						// 获取用户信息
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								_this.wechatIcon = infoRes.userInfo.avatarUrl;
							}
						});
					},
				});
				_this.updateUserInfo()
			},
			async updateUserInfo() {
				// 名称判断
				if (this.account.length < 4 || this.account.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的名称'
					});
					return;
				}

				// 密码判断
				if (this.password.length < 6 || this.password.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的密码'
					});
					return;
				}

				const res = await service.login(this.account, md5(this.password), this.wechatIcon, this.wechatCode)
				console.log(res);
				if (res.errno == 0) {
					uni.setStorageSync('token', res.data.token)
					uni.showToast({
						icon: 'none',
						title: '登录成功'
					});
					setTimeout(function() {
						// uni.hideToast(),
						// 	uni.reLaunch({
						// 		url: '../task/task'
						// 	})
					}, 1500);
				} else {
					uni.showToast({
						icon: 'none',
						title: res.errmsg
					})
				}
			}
		}
	}
</script>

<style>
	.top-view {
		width: 100%;
		height: 540upx;
		background-size: cover;
	}

	.top-view-content {
		margin: 25% 10%;
	}

	.top-view-content-one {
		font-size: 48upx;
		font-weight: 600;
		color: rgba(255, 255, 255, 1);
		font-family: PingFangSC-Semibold, PingFangSC;
	}

	.top-view-content-two {
		width: 30upx;
		height: 30upx;
		background-position: center;
	}

	.top-view-content-three {
		margin-top: 7upx;
		margin-left: 9upx;
		font-size: 36upx;
		line-height: 50upx;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.6);
		display: inline-block;
		vertical-align: text-bottom;
		font-family: PingFangSC-Light, PingFangSC;
	}

	.bottom-view {
		margin-top: 58upx;
		width: 100%;
		height: 300upx;
	}

	.bottom-view-account {
		width: 100%;
		height: 104upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.bottom-view-account-uimg {
		width: 32upx;
		height: 32upx;
		margin-left: 66upx;
	}

	.bottom-view-accountInput {
		font-size: 34upx;
		font-weight: 400;
		margin: 0 66upx 0 26upx;
		color: rgba(51, 51, 51, 1);
		border-bottom: 1upx solid #EEEEEE;
	}

	.bottom-view-pwd {
		margin-top: 10upx;
		width: 100%;
		height: 104upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.bottom-view-account-pimg {
		width: 32upx;
		height: 32upx;
		margin-left: 66upx;
	}

	.bottom-view-pwdInput {
		font-size: 34upx;
		font-family: PingFangSC-Regular, PingFangSC;
		font-weight: 400;
		margin: 0 66upx 0 26upx;
		color: rgba(51, 51, 51, 1);
		line-height: 48upx;
		border-bottom: 1upx solid #EEEEEE;
	}

	.bottom-view-loginBtn {
		margin: 88upx 55upx 0 55upx;
		height: 88upx;
		background: rgba(39, 179, 157, 1);
		border-radius: 44upx;
		font-size: 34upx;
		font-family: PingFangSC-Medium, PingFangSC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
</style>
