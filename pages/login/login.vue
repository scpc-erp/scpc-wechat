<template>
	<view class="content">
		<view class="status_bar">
			<!-- 由于取消了导航条这里放个占位导航条view -->
		</view>
		<view class="top-view">
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
				<input type="text" placeholder="请输入姓名" class="bottom-view-accountInput"/>
			</view>
			<view class="bottom-view-pwd">
				<image class="bottom-view-account-pimg" src="../../static/img/login/Login-qrCode.png"></image>	
				<input type="text" placeholder="请输入密码" class="bottom-view-pwdInput"/>
			</view> 
			<button type="primary" class="bottom-view-loginBtn">登录</button>
		</view>
	</view>
</template>

<script></script>

<style>
	.status_bar{
		height: var(--status-bar-height);
		width: 100%;
	}
	
	.top-view{
		width: 100%;
		height: 540upx; 
		background: url('../../static/img/login/Login-bg.png');
		background-size: cover;
	}
		
	.top-view-content{ 
		margin: 25% 10%; 
	}
		
	.top-view-content-one{
		font-size: 48upx;  
		font-weight:600;
		color:rgba(255,255,255,1); 
		font-family:PingFangSC-Semibold,PingFangSC;
	}
	
	.top-view-content-two{ 
		width: 30upx;
		height: 30upx; 
		background-position: center; 
	}
	
	.top-view-content-three{
		margin-top: 7upx;
		margin-left: 9upx;
		font-size:36upx;
		line-height: 50upx;
		font-weight:300;
		color:rgba(255,255,255,0.6); 
		display: inline-block; 
		vertical-align:text-bottom;
		font-family:PingFangSC-Light,PingFangSC;
	}
	
	.bottom-view{
		margin-top: 58upx;
		width: 100%;
		height: 300upx;
	}
		
	.bottom-view-account{
		width: 100%; 
		height: 104upx; 
		display:flex;
		flex-direction: row;
	}
	
	.bottom-view-account-uimg{
		width: 32upx;
		height: 32upx;
		left: 66upx; 
		top: 30upx;
	}
	
	.bottom-view-accountInput {
		width:560upx;
		height:100%;
		font-size:34upx;
		font-family:PingFangSC-Regular,PingFangSC;
		font-weight:400;
		margin-left: 100upx;
		color:rgba(51,51,51,1);
		line-height:48upx;
		border-bottom: 1upx solid #EEEEEE;
	}
	
	.bottom-view-pwd{
		margin-top: 10upx;  
		width: 100%; 
		height: 104upx; 
		display: flex;
	}
	
	.bottom-view-account-pimg{
		width: 32upx;
		height: 32upx;
		left: 66upx; 
		top: 30upx;
	}
	
	.bottom-view-pwdInput{
		width:560upx;
		height:100%;
		font-size:34upx;
		font-family:PingFangSC-Regular,PingFangSC;
		font-weight:400;
		margin-left: 100upx;
		color:rgba(51,51,51,1);
		line-height:48upx;
		border-bottom: 1upx solid #EEEEEE;
	}
	
	.bottom-view-loginBtn{
		width: 640upx;
		height: 88upx;
		margin: 0 auto;
		margin-top: 88upx;
		background:rgba(39,179,157,1);
		border-radius:44upx;
		font-size:34upx;
		font-family:PingFangSC-Medium,PingFangSC;
		font-weight:500;
	}
</style>
