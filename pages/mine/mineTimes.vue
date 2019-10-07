<template>
	<view class="content">
		<topTab :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange" :textFlex="true"></topTab>
		<view class="total_task_view">共3个任务</view>
		<view class="content-list">
			<mList class="list" v-for="(item, key) in 10" @handleSubmitTask="handleSubmitTask" :key="key" :item="item"></mList>
		</view>
	</view>
</template>

<script> 
	import topTab from '@/components/wuc-tab/wuc-tab.vue';
	import datePicker from '@/components/datePicker/simple-datetime-picker.vue';
	import mList from '@/components/m-list.vue';
	
	export default {
		components: {
			topTab,
			mList,
			datePicker
		},
		data() {
			return {
				TabCur:0,
				tabList:[
					{name: '全部'},
					{name: '未开始'},
					{name: '进行中'},
					{name: '已完成'}
				]
			}
		},
		methods: {
			tabChange(index) {
				console.log("task中的index为="+index)
				this.TabCur = index;
			}
		}
	}
</script>

<style>
	.content {
		background-color: #f7f7f7; 
	}
	
	.total_task_view{
		margin-top: 90upx;
		font-size:32upx;
		font-family:PingFangSC-Medium,PingFangSC;
		font-weight:500;
		color:rgba(51,51,51,1);
		line-height:45upx;
		padding: 26upx 0upx 0upx 30upx;
	}
</style>
