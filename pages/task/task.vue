<template>
	<view class="content">
		<view class="top-view">
			<view class="search-BG-view">
				<image src="../../static/img/task/task-search.png" mode="" class="search-img"></image> 
				<m-input class="search-input" type="text" placeholder="搜索任务" @input="listingValueChange" v-model="inputContent"/>
			</view>
		</view>
		<view class="content-list">
			<mList class="list" v-for="(item, key) in dataList" :key="key" :item="item"></mList>
		</view>
	</view>
</template>

<script>
	import mInput from '@/components/m-input.vue'
	import mList from '@/components/m-list.vue';
	import service from '../../service/service.js';
	
	export default {
		components: {
			mList,
			mInput
		},
		data() {
			return {
				// 请求对象
				params: {
					'tableId': "010401",
					'pageNumber': 1,
					'pageSize': 10,
					'queryKey' : "搜索"
				},
				isLoadMore: true,
				dataList: [],
				// 用户输入的内容
				inputContent:''
			}
		},
		
		// 进入页面后刷新数据
		onShow() {
			this.params.pageNumber = 1
			this.params.queryKey = ""
			this.initData(0)
		},
		
		// 下拉刷新
		onPullDownRefresh() {
			this.params.pageNumber = 1
			this.initData(0)
			this.isLoadMore = true
			uni.showToast({
				'icon':'none',
				'title':'刷新成功'
			})
			uni.stopPullDownRefresh()
		},
		
		// 加载更多数据
		onReachBottom() {
			if (this.isLoadMore) {
				this.params.pageNumber++
				this.initData(0)
			}
		},
		methods: {
			async initData(type) {
				// type==0 列表刷新 params不包含queryKey 
				// type==1 搜索刷新 params包含queryKey 
				if (type == 0) {
					let res = await service.taskList(this.params)
					if (res.errno == 0) {
						if (this.params.pageNumber == 1) {
							this.dataList = res.data.data;
						} else {
							this.dataList = this.dataList.concat(res.data.data);
						}
						if (res.data.data.length < 10) {
							this.isLoadMore = false;
						}
					}
				} else {
					let res = await service.taskListSearch(this.params)
					if (res.errno == 0) {
						if (this.params.pageNumber == 1) {
							this.dataList = res.data.data;
						} else {
							this.dataList = this.dataList.concat(res.data.data);
						}
						if (res.data.data.length < 10) {
							this.isLoadMore = false;
						}
					}
				} 
			},
			// 用户搜索后刷新数据
			listingValueChange() { 
				this.params.pageNumber = 1
				this.params.queryKey = this.inputContent 
				this.initData(1)
			}
		}
	}
</script>

<style lang="less">
	.content {
		background-color: #f7f7f7;
	}

	.top-view {
		width: 100%;
		height: 96upx;
		background: rgba(39, 179, 157, 1);
		position: fixed;
		z-index: 999;
	}

	.search-BG-view {
		top: 15upx;
		left: 24upx;
		right: 24upx;
		height: 68upx;
		background: rgba(255, 255, 255, 0.17);
		border-radius: 35upx;
		position: absolute;
	}

	.search-img {
		width: 36upx;
		height: 36upx;
		position: absolute;
		top: 17upx;
		left: 48upx;
	}
	
	.search-input {
		position: absolute;
		height: 100%;
		width: 80%;
		left: 90upx;
		right: 24upx;
		font-size: 28upx;
		color: rgba(255, 255, 255, 1);
		.uni-input-placeholder{
			color: rgba(255, 255, 255, 1);
		}
	}
	.content-list{
		margin-top:96upx;
	}
	.list{ 
		width: 100%;
		top: 96upx; 
	}
</style>
