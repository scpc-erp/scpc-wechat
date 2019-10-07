<template>
	<view class="content">
		<topTab :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange" :textFlex="true"></topTab>
		<!-- <view class="time-view" @click="openDatetimePicker">{{customerDate}}</view> -->
		<datePicker  style="margin-top:110upx" fields="day" start="1970-00-00" end="2500-12-30" :value="pickerValue" @change="bindChange"></datePicker>

		<view class="total_task_view">
			<view class="total-task-text">共3个任务</view>
			<view class="total-time-text">112工时</view>
		</view>
		<view class="content-list">
			<mList class="list" v-for="(item, key) in 10" @handleSubmitTask="handleSubmitTask" :key="key" :item="item"></mList>
		</view>
	</view>
</template>

<script>
	import topTab from '@/components/wuc-tab/wuc-tab.vue';
	import datePicker from '@/components/datePicker/rattenking-dtpicker.vue';
	import mList from '@/components/m-list.vue';

	export default {
		components: {
			topTab,
			mList,
			datePicker
		},
		data() {
			return {
				TabCur: 0,
				pickerValue: '',
				tabList: [{
						name: '全部'
					},
					{
						name: '日'
					},
					{
						name: '周'
					},
					{
						name: '月'
					}
				],
			}
		},
		methods: {
			tabChange(index) {
				this.TabCur = index;
				console.log("task中的index为=" + index)
			},
			bindChange(value) {
				console.log(value)
			}
			// ,
			// bindCancel(){
			// 	console.log('123')
			// }
		}
	}
</script>

<style>
	.content {
		background-color: #f7f7f7;
	}

	.time-view {
		margin: 110upx 20upx 0upx 20upx;
		background-color: white;
		border-radius: 10upx;
		text-align: center;
		height: 78upx;
		justify-content: center;
		line-height: 78upx;
		font-size: 26upx;
		font-family: PingFangSC-Semibold, PingFangSC;
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
		line-height: 78upx;
	}

	.total_task_view {
		margin-top: 20upx;
		line-height: 45upx;
		padding: 0 30upx;
		display: flex;
		justify-content: space-between;
		font-size: 32upx;
		font-family: PingFangSC-Medium, PingFangSC;
		font-weight: 500;
	}

	.total-time-text {
		color: rgba(39, 179, 157, 1);
	}

	.total-task-text {
		color: rgba(51, 51, 51, 1);
	}
</style>
