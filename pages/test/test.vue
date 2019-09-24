<template>
	<button type="primary" @tap='handleClick'></button>
</template>

<script>
	export default {
		methods:{
			handleClick() { 
				uni.navigateBack({
					delta:1
				});
			}
		}
	}
</script>

<style>
		
	button{
		width: 150upx;
		height: 150upx;
	}
</style>
