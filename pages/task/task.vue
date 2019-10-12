<template>
	<view class="content">
		<uni-popup  ref="popup" :show="isHUDShow" @change="closePopup">
			<view class="hud-content-view">
				<view class="order-info">
					<view class="order-num">{{activeRow.SSDD_TEXT}}</view>
					<view class="order-name">{{activeRow.BOMID_TEXT}}</view>
				</view>
				
				<radio-group @change="radioChange">
					<view class="hud-submit-allView" v-for="(item, index) in radioList" :key="item.value">
						<view class="all-prompt">
							<radio class="radioClass" color="#27B39D" :value="item.value" :checked="index === current"/>
							<text>{{item.name}}</text>
						</view>
					</view>	
					<view class="part-input-view">
						<view class="part-input-prompt"  :style="{'line-height':partViewHeight+'rpx'}">完成件数</view>
						<view class="part-input-right">
							<view v-if="current == 0" class="part-input">{{activeRow.JGSL}}</view>
							<uni-number-box @change="numberChange" v-else :min="0" :max="activeRow.JGSL" :value="jgsl"></uni-number-box>
							<view class="part-input-unit"  :style="{'line-height':partViewHeight+'rpx'}">件</view>
						</view>
					</view>
				</radio-group>
				
				<view class="hud-submit-view">
					<button @click="onSubmit" class="hud-submit-btn">确认提交</button>
				</view>
			</view>
		</uni-popup>
		
		<view class="top-view">
			<view class="search-BG-view">
				<image src="../../static/img/task/task-search.png" mode="" class="search-img"></image>
				<m-input class="search-input" type="text" placeholder="搜索任务" @input="listingValueChange" v-model="inputContent" />
			</view>
		</view>
		<view class="content-list">
			<mList class="list" v-for="(item, key) in dataList" @handleSubmitTask="handleSubmitTask(item)" :key="key" :item="item"></mList>
		</view>
	</view>
</template>

<script>
	import mList from '@/components/m-list.vue';
	import mInput from '@/components/m-input.vue';
	import service from '../../static/service/service.js';
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue";

	export default {
		components: {
			mList,
			mInput,
			uniPopup,
			uniNumberBox
		},
		data() {
			return {
				// 请求对象
				params: {
					'tableId': "010401",
					'pageNumber': 1,
					'pageSize': 10,
					'queryKey': ""
				},
				isLoadMore: true,
				activeRow: {},
				dataList: [],
				// 用户输入的内容
				inputContent: '',
				jgsl: 0,
				radioList:[
					{
						value:'0',
						name:'全部提交',
						checked: 'true'
					},{
						value:'1',
						name:'部分提交'
					},
				],
				current: 0,
				// 提交页面的属性
				isHUDShow:false,
				// 提交按钮高度值
				partViewHeight:37
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
				'icon': 'none',
				'title': '刷新成功'
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
					let res = await service.taskList(this.params);
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
					let res = await service.taskListSearch(this.params);
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
			},
			// 点击提交任务,弹出选择提交类型页面
			handleSubmitTask(row) {
				this.activeRow = row
				this.jgsl = this.activeRow.JGSL
				this.isHUDShow = true;
			},
			// 点击radio后方法
			radioChange: function(evt) {
				this.current = evt.detail.value 
				if (evt.detail.value == 0) { 
					this.partViewHeight = 37;
				} else {
					this.partViewHeight = 70;
				}
			},
			//点击提交按钮调用方法
			async onSubmit(){
				let params = {
					gyid: this.activeRow.ID,
					jgjs: this.jgsl
				}
				let res = await service.submitTask(params);
				if (res.errno == 0) {
					uni.showToast({
						title: res.errmsg
					});
					this.isHUDShow = false
					this.initData();
				} else {
					uni.showToast({
						title: res.errmsg
					});
				}
			},
			closePopup(val) {
				this.isHUDShow = val.show
			},
			numberChange(val) {
				this.jgsl = val
			}
		}
	}
</script>

<style lang="less">
	.content {
		background-color: #f7f7f7;
		position: relative;
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

		.uni-input-placeholder {
			color: rgba(255, 255, 255, 1);
		}
	}

	.content-list {
		padding-top: 96upx;
	}

	.list {
		width: 100%;
	}

	.hud-content-view {
		width: 80vw;
		border-radius: 15upx;
		background-color: white;
		display: flex;
		flex-direction: column;
	}

	/*******************************************/
	// 订单信息
	.order-info {
		height: 90upx;
		display: flex;
		flex-direction: row;
		background-color: #EEEEEE;
		border-bottom: 1upx #EEEEEE dashed;
		justify-content: space-between;
		align-items: center;
		box-shadow:0upx 0upx 15upx #EEEEEF; 
		border-radius: 10upx 10upx 0upx 0upx;
	}

	// 订单号
	.order-num {
		margin-left: 46upx;
		font-size: 30upx; 
		font-weight: 400;
		font-family: PingFangSC-Regular, PingFangSC;
		color: rgba(51, 51, 51, 1);
		line-height: 37upx;
	}

	// 订单名称
	.order-name {
		margin-right: 46upx;
		font-size: 30upx;
		font-family: PingFangSC-Regular, PingFangSC;
		color: rgba(51, 51, 51, 1);
		font-weight: 400;
		line-height: 37upx;
	}

	// 全部提交
	.hud-submit-allView {
		width: 100%;
		display: flex;
		border-bottom: 1upx #EEEEEE solid;
		flex-direction: column;
	}
	
	.radioClass{
		color: #27B39D;
		transform: scale(0.7);
	}

	// 全部提交提示文字
	.all-prompt {
		font-size: 28upx;
		font-weight: 500;
		margin: 22upx 0 0 36upx;
		color: rgba(51, 51, 51, 1);
		font-family: PingFangSC-Medium, PingFangSC;
	}

	/*******************************************/
	// 部分提交
	.hud-submit-partView {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	// 部分提交提示文字
	.part-prompt {
		margin: 22upx 0 0 36upx;
		height: 45upx;
		font-size: 28upx;
		font-family: PingFangSC-Medium, PingFangSC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 45upx;
	}

	// 用户输入的view
	.part-input-view {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 19upx 46upx 22upx 46upx;
	}
	
	.part-input-right {
		display: flex;
		justify-content: flex-end;
	}
	
	uni-number-box {
		margin-top: 0upx;
	}

	.part-input-prompt {
		height: 37upx;
		font-size: 25upx;
		font-family: PingFangSC-Regular, PingFangSC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		
		// 用户点击全部更新后撑开的高度为37upx
		// 用户点击部分更新后撑开的高度为70upx
		line-height: 37upx; 
		// line-height: 70upx; 
	}

	.part-input {
		height: 37upx;
		font-size: 25upx;
		font-family: PingFangSC-Regular, PingFangSC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 37upx;
	}

	.part-input-unit {
		height: 37upx;
		font-size: 25upx;
		font-family: PingFangSC-Regular, PingFangSC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		margin-left: 10upx;
		
		// 用户点击全部更新后撑开的高度为37upx
		// 用户点击部分更新后撑开的高度为70upx
		line-height: 37upx;
		// line-height: 70upx; 
	}

	/*******************************************/
	// 底部提交
	.hud-submit-view {
		width: 100%; 
		border-radius: 0upx 0upx 10upx 10upx;
	}

	.hud-submit-btn {
		width: 100%;
		cursor: pointer;
		color: white;
		background: #27B39D;
		font-size: 32upx;
		font-weight: 500;
		font-family: PingFangSC-Medium, PingFangSC;
		border-radius: 0upx 0upx 10upx 10upx;
	}
</style>
