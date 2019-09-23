<template>
	<view class="top-view">
		<view class="top-view-content">
			<!-- <view class="top-view-content-one">三维博弈ERP</view> -->
			<view class="top-view-content-one">矿山易购Boss端</view>
			<image class="top-view-content-two" src="../../static/img/login/Login-cover.png"></image>
			<view class="top-view-content-three">实时生产跟踪</view>
		</view>
	</view>
</template>

<script></script>

<style>
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
</style>
