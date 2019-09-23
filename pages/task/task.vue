<template>
	<view class="content">
		<view class="search-view">
			<m-input class="search-input" type="search" placeholder="请输入姓名" v-model="account"/>
		</view>
	</view>
</template>

<script>
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
</style>
