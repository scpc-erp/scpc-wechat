<template>
	<view class="content">
		<view class="all-item">
			<view class="row-one">
				<text class="order-top-Num">{{item.SSDD_TEXT}}</text>
				<text class="order-status" :class="{'status-danger':item.DDLEVEL=='0401','status-warning':item.DDLEVEL=='0402'}">{{leavel[item.DDLEVEL]}}</text>
			</view>
			<view class="row-two">
				<text class="order-name">{{item.BOMID_TEXT}}</text>
			</view>
			<view class="row-three">
				<view class="">
					<text class="order-time">{{item.BZGS}}</text>
					<text class="order-time-prompt">工时</text>
				</view>
				<view class="">
					<text class="order-num">{{item.JGSL}}</text>
					<text class="order-num-prompt">数量(个数)</text>
				</view>
			</view>
			<view class="row-four">
				<view class="order-radio"></view>
				<text class="order-push-time-prompt">交货日期</text>
				<text class="order-push-time">{{item.ENDTIME}}</text>
				<button type="primary" class="submit">提交任务</button>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		name: 'm-list',
		// 接收参数
		props: {
			item: Object
		},
		data() {
			return {
				leavel:{
					'0401':'紧急',
					'0402':'重要',
					'0403':'普通'
				}
			};
		},
		methods:{
			openDetail(id,name){
				uni.navigateTo({
					url: '../../pages/custom/custom-money-list?cid='+id + '&name=' + name,
				});
			}
		}
	}
</script>

<style lang="less">
	.all-item{
		height: 314upx;
		margin: 20upx 20upx 0 20upx;
		background:rgba(255,255,255,1);
		border-radius:16upx;
	}
	
	.row-one{
		display: flex;
		justify-content: space-between;
	}
	
	.order-top-Num{
		height:42upx;
		font-size:30upx;
		font-family:PingFangSC-Medium,PingFangSC;
		font-weight:500;
		color:rgba(153,153,153,1);
		line-height:42upx;
		margin-top: 26rpx;
		margin-left: 40rpx;
	}
	
	.order-status{
		font-size:22upx;
		font-family:PingFangSC-Regular,PingFangSC;
		font-weight:400;
		color:rgba(39,179,157,1);
		line-height:30upx;
		background:rgba(39,179,157,0.16);
		border-radius:6upx;
		border:1upx solid rgba(39,179,157,1);
		height: 30upx;
		padding: 5upx 10upx;
		margin-top: 26rpx;
		margin-right: 40rpx;
	}
	
	.status-warning {
		color: #E8A010;
		background:rgba(232,160,16,0.16);
		border:1upx solid #E8A010;
	}
	
	.status-danger{
		color: #E8541E;
		border:1upx solid #E8541E;
		background:rgba(232,84,30,0.16);
	}
	
	.row-two{
		display: flex;
		justify-content: space-between;
		margin: 19upx 0 0 40upx;
	}
	
	.order-name{
		height:45upx;
		font-size:32upx;
		font-family:PingFangSC-Medium,PingFangSC;
		font-weight:500;
		color:rgba(51,51,51,1);
		line-height:45upx;
	}
	
	.row-three{
		display: flex;
		justify-content: flex-start;
		margin: 25upx 40upx 0 40upx;
		padding-bottom: 15upx;
		border-bottom: 0.1upx dashed #B5B5B5;
	}
	
	.order-time{
		height:56upx;
		font-size:40upx;
		line-height:56upx;
		font-weight:500;
		color:rgba(39,179,157,1);
		font-family:PingFangSC-Medium,PingFangSC;
	}
	
	.order-time-prompt{
		height:56upx;
		color: #666666;
		font-size:24upx;
		font-weight:500;
		line-height:56upx;
		font-family:PingFangSC-Medium,PingFangSC;
	}
	
	.order-num{
		margin-left:60upx;
		height:56upx;
		font-size:40upx;
		font-family:PingFangSC-Medium,PingFangSC;
		font-weight:500;
		color:rgba(39,179,157,1);
		line-height:56upx;
	}
	
	.order-num-prompt{
		height:56upx;
		font-size:24upx;
		font-family:PingFangSC-Medium,PingFangSC;
		font-weight:500;
		color: #666666;
		line-height:56upx;
	}
	
	.row-four{
		height: 88upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	
	.order-radio{
		width:20upx;
		height:20upx;
		background:rgba(39,179,157,1);
		border-radius: 35upx;
		margin-left: 40upx;
		margin-right: 10upx;
	}
	
	.order-push-time-prompt{
		width:96upx;
		height:33upx;
		font-size:24upx;
		font-family:PingFangSC-Regular,PingFangSC;
		font-weight:400;
		color:rgba(153,153,153,1);
		line-height:33upx;
	}
	
	.order-push-time{
		height:33upx;
		font-size:24upx;
		font-family:PingFangSC-Regular,PingFangSC;
		font-weight:400;
		color:#666666;
		line-height:33upx;
	}
	
	.submit{
		width:158upx;
		height:60upx;
		background:rgba(39,179,157,1);
		border-radius:30upx;
		font-size:25upx;
		font-family:PingFangSC-Medium,PingFangSC;
		font-weight:500;
		color:rgba(255,255,255,1);
		line-height:60upx;
		margin-right: 40upx;
	}
</style>
