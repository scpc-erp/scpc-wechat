<template>
	<view class="content">
		<view class="top-view">
			<view class="search-BG-view"> 
				<image src="../../static/img/task/task-search.png" mode="" class="search-img"></image>
				<!-- <input class="search-input" type="text" placeholder="搜索任务"/> -->
				<m-input class="search-input" type="text" placeholder="搜索任务"/>
			</view>
		</view>
	</view>
</template>

<script>
	import mInput from '@/components/m-input.vue'
	export default {
		components:{
			mInput
		},
		methods:{
			handleClick() {
				console.log('12341234');
				uni.navigateTo({
					url:'../test/test'
				});
			}
		}
	}
</script>

<style lang="less">
	
	input{
		font:900 23px;
	}
	.content{
		background-color: #f7f7f7;
	}
	
	.top-view{
		width: 100%;
		height: 96upx;
		background:rgba(39,179,157,1);
		position: relative; 
	}
	
	.search-BG-view{ 
		height:68upx;
		background:rgba(255,255,255,0.17);
		border-radius:35px;
		border-radius: 35upx;
		position: absolute;
		top: 15upx;
		left: 24upx;
		right: 24upx;
	}
	
	.search-img{
		width: 36upx;
		height: 36upx;
		position: absolute;
		top: 17upx;
		left: 48upx;
	}
	
	uni-input{
			position: absolute;
			height: 100%;
			width: 80%;
			left: 90upx;
			right: 24upx;
			font-size:28upx !important;
			line-height: 100%;
			font-family:PingFangSC-Regular,PingFangSC;
			font-weight:400; 
			color:rgba(255,255,255,1) !important; 
	}
</style>
