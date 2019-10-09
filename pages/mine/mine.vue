<template>
	<view class="content">
		<view class="top-view" :style="{backgroundImage: 'url(' + background + ')'}">
			<view class="top-info-imgView">
				<view class="top-info-leftView">
					<image v-bind:src="userIcon" mode="scaleToFill" class="info-icon"></image>
				</view>
				<view class="top-info-rightView">
					<text class="info-name">{{userName}}</text>
					<text class="info-class">{{userGroup}}</text>
				</view>
			</view>
		</view>
		
		<view class="bottom-view">
			<view class="prompt-bg-view">
				<!-- 额定工时提示 -->
				<view class="prompt_view">
					<image src="../../static/img/mine/mine-time.png" mode="" class="left_image"></image>
					<text class="prompt-text">额定工时</text>
					<!-- <image src="../../static/img/mine/mine-right.png" mode="" class="right_image" @tap="handleTimeButton"></image> -->
				</view>
				<!-- 额定工时内容 -->
				<view class="content-view">
					<view class="content-oneView">
						<text>{{month}}</text>
						<view class="content-text-twoView">
							<text class="bottom-text">本月</text>
						</view>
					</view>
					<view class="content-twoView">
						<text >{{week}}</text>
						<view class="content-text-twoView">
							<text class="bottom-text">本周</text>
						</view>
					</view>
					<view class="content-threeView">
						<text>{{day}}</text>
						<view class="content-text-twoView">
							<text class="bottom-text">本日</text>
						</view>
					</view> 
				</view>
			</view>

<!-- 			<view class="prompt-bg-view"> 
				<view class="prompt_view">
					<image src="../../static/img/mine/mine-task.png" mode="" class="left_image"></image>
					<text class="prompt-text">我的任务</text>					
					<image src="../../static/img/mine/mine-right.png" mode="" class="right_image" @tap="handleTaskButton"></image>
				</view> 
				<view class="content-view">
					<view class="content-oneView">
						<text class="task_text">30</text>
						<view class="content-text-twoView">
							<text class="bottom-text">未开始</text>
						</view>
					</view>
					<view class="content-twoView">
						<text class="task_text">11</text>
						<view class="content-text-twoView">
							<text class="bottom-text">进行中</text>
						</view>
					</view>
					<view class="content-threeView">
						<text class="task_text">111</text>
						<view class="content-text-twoView">
							<text class="bottom-text">已完成</text>
						</view>
					</view> 
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import img from '../../static/img/mine/mine-topBG.png';
	import service from '../../static/service/service.js';
	
	export default {
		data() {
			return {
				// 为了适配小程序 将顶部背景图转成base64
				background: img,
				userName:uni.getStorageSync("user_name"),
				userIcon: uni.getStorageSync("user_icon"),
				userGroup:uni.getStorageSync("user_group"),
				day:'0',
				month:'0',
				week:'0'
			}
		},
		methods:{
			// 暂时不用
			handleTimeButton(){
				// uni.navigateTo({
				// 	url: '../mine/mineTimes'
				// })
			},
			// 暂时不用
			handleTaskButton(){
				// uni.navigateTo({
				// 	url: '../mine/mineTask'
				// })
			},
			
			onLoad() {
			},
			
			onShow(){
				this.userName = uni.getStorageSync("user_name");
				this.userIcon = uni.getStorageSync("user_icon");
				this.userGroup = uni.getStorageSync("user_group");
				this.initData();
			},
			
			async initData(){ 
				const res = await service.mineTime(); 
				this.day = res.data.hour.day
				this.week = res.data.hour.week
				this.month = res.data.hour.month
			}
		}
	}
</script>

<style lang="less">
	.content {
		background-color: #f7f7f7;
	}
	
	// 顶部css
	.top-view{
		width: 100%;
		height: 260upx;  
		background-size: cover;
	}
	
	.top-info-imgView {
		margin: 20upx 20upx 0 20upx;
		height: 220upx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		background: url('../../static/img/mine/mine-topInfoBG.png');
		background-size: cover;
		
		.top-info-leftView  {
			.info-icon{
				width: 120upx;
				height: 120upx;
				border:1px solid rgba(39,179,157,1);
				margin-left: 30upx;
				border-radius: 70upx;
			}
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
	}
	
	// 底部css
	.bottom-view{
		width: 95%;
		margin: 20upx 20upx 0upx 20upx;
		
		.prompt-bg-view{
			border-radius: 16upx;
			background-color: white;
			// height: 238upx; 
			
			.prompt_view{
				margin: 0 30upx 0 30upx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				height: 88upx;
				
				.left_image{
					width: 32upx;
					height:32upx;
				}

				.prompt-text{
					font-weight:500;
					font-size:32upx;
					line-height:45upx; 
					margin-left: 20upx; 
					margin-right: auto;
					color:rgba(51,51,51,1);
					font-family:PingFangSC-Medium,PingFangSC;
				}
				
				.right_image{
					width: 28upx;
					height:28upx;
				}
			} 
				
			.prompt_view:nth-child(1){
				margin-top: 20upx;
			}
		}
		
		// 底部内容view
		.content-view{
			width: 100%;
			display: flex; 
			justify-content: center;  
			
			font-size:36upx;
			font-family:PingFangSC-Medium,PingFangSC;
			font-weight:500;
			color:rgba(39,179,157,1);
			line-height:50upx;
			padding-bottom: 37upx;
			
			.content-oneView{
				flex-grow: 0.3; 
				align-items: center;
				display: flex;
				flex-direction: column;
			}
			
			.content-twoView{ 
				align-items: center;
				display: flex;
				flex-direction: column; 
				flex-grow: 0.3;
			}
			
			.content-threeView{ 
				align-items: center;
				display: flex;
				flex-direction: column; 
				flex-grow: 0.3; 
			}
			
			.bottom-text{ 
				font-size:26upx;
				font-family:PingFangSC-Regular,PingFangSC;
				font-weight:400;
				color:rgba(102,102,102,1);
				line-height:37upx;
			}
			
			.task_text{
				color:rgba(72,157,240,1); 
			}
		}
	}
</style>
