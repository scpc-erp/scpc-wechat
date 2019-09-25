<template>
	<view class="content">
		<view class="top-view">
			<view class="top-info-imgView"></view>
			<view class="top-info-view"> 
				<view class="top-info-leftView">
					<image src="../../static/img/mine/mine-topInfoBG.png" mode="scaleToFill" class="info-icon"></image>
				</view>
				<view class="top-info-rightView">
					<text class="info-name">纪的腿毛</text>
					<text class="info-class">CNC</text>
				</view>
			</view>
		</view> 
	</view>
</template>

<script>
</script>

<style>
	.content {
		background-color: #f7f7f7;
	}
	
	.top-view{
		width: 100%;
		height: 260upx; 
		background: url('../../static/img/mine/mine-topBG.png');
		background-size: cover;
	}
	
	.top-info-imgView {
		margin: 20upx 20upx 0 20upx;
		height: 220upx;
		background: url('../../static/img/mine/mine-topInfoBG.png');
		background-size: cover;
	}
	
	.top-info-view {
		margin: -220upx 20upx 0 20upx;
		height: 220upx;
		border-radius: 20upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	
	.top-info-leftView .info-icon {
		width: 120upx;
		height: 120upx;
		border:1px solid rgba(39,179,157,1);
		margin-left: 30upx;
		border-radius: 70upx;
	}
	
	.top-info-rightView {
		display: flex;
		flex-direction: column;
	}
	
	.top-info-rightView .info-name { 
		height:50upx;
		font-size:36upx;
		font-family:PingFangSC-Medium,PingFangSC;
		font-weight:500;
		color:rgba(51,51,51,1);
		line-height:50upx;
		margin-top: -10upx;
		margin-left: 30upx;
	}
	
	.top-info-rightView .info-class {
		height:40upx;
		font-size:28upx;
		font-family:PingFangSC-Medium,PingFangSC;
		font-weight:500;
		color:rgba(39,179,157,1);
		line-height:40upx;
		margin-left: 30upx;
		margin-top: 10upx;
	}
</style>
