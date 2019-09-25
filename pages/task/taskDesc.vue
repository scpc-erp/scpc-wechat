<template>
	<view class="content" >
		<view class="top-view" :style="{backgroundImage: 'url(' + background + ')'}"></view>
	</view>
</template>

<script>
	
	import img from '../../static/img/task/task-desc-topBG.png';
	export default {
		components:{
			
		},
		data() {
			return { 
				// 为了适配小程序 将顶部背景图转成base64
				background: img
			}
		},
		onLoad() {
			let base64 = uni.getFileSystemManager().readFileSync(this.background, 'base64');
			this.background = 'data:image/png;base64,' + base64;
		}
	}
	
</script>

<style>
	.top-view{
		width: 100%;
		height: 318upx; 
		background-size: cover;
	}
</style>
