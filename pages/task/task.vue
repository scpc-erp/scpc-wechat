<template>
	<view class="content">
		<view class="search-view">
			<m-input class="search-input" type="search" placeholder="请输入姓名" v-model="account"/>
			<button type="primary" @tap="handleClick">点我</button>
		</view>
	</view>
</template>

<script>
	export default {
		methods:{
			handleClick() {
				console.log('12341234');
				uni.navigateTo({
					url:'../test/test',
					animationType: 'pop-in',
					animationDuration: 200
				});
			}
		}
	}
</script>

<style>
	.content{
		background-color: #f7f7f7;
	}
	
	.search-view{
		width: 100%;
		height: 96upx;
		background:rgba(39,179,157,1);
	}
	
	.search-input{
		background-color: #27B39D;
	}
	
	button{
		width: 150upx;
		height: 150upx;
		background-color: red;
	}
</style>
