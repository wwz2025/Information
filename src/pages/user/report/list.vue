<template>
	<view class="feedback-list">
		<view class="rf-list" v-if="feedbackList.length > 0">
			<view
				class="rf-list-item"
				v-for="(item, index) in feedbackList"
				:key="index"
				@tap="navTo(`/pages/set/feedback/detail?id=${item.id}`)"
			>
				<view class="wrapper">
					<view class="address-box">
						<text class="tag" :class="'text-' + themeColor.name">{{ item.reportType | feedbackFilter }}</text>
						<text class="address in1line">{{ item.complaintsDesc }}</text>
					</view>
					<view class="u-box">
						<text class="name">{{ item.complaintsReplay || '管理员未回复' }}</text>
						<text class="mobile"
							>联系方式：{{ item.username || '暂无' }}</text
						>
					</view>
				</view>
			</view>
			<rf-load-more
				v-if="feedbackList.length > 0 && !loading"
				:status="loadingType"
			/>
		</view>
		<view class="add-btn-wrapper">
			<button class="add-btn" :class="'bg-' + themeColor.name" @tap="navTo(`/pages/set/feedback/feedback`)">
				意见反馈
			</button>
		</view>

		<u-empty text="您还没有反馈意见" :iconColor="themeColor.color" mode="data" v-if="feedbackList.length === 0 && !loading">
		</u-empty>

	</view>
</template>

<script>
import { opinionList } from '@/api/userInfo';

import rfLoadMore from '@/components/rf-load-more/rf-load-more';

export default {
	components: {
		rfLoadMore
	},
	data() {
		return {
			pageNum :0,
			feedbackList: [],
			loadingType: 'more',
			feedbackType: [
				{
					value: '1',
					name: '内容不实'
				},
				{
					value: '2',
					name: '题文不符'
				},
				{
					value: '3',
					name: '低俗色情'
				},
				{
					value: '4',
					name: '广告软文'
				},
				{
					value: '5',
					name: '封面反感'
				},
				{
					value: '6',
					name: '抄袭作品'
				},
				{
					value: '7',
					name: '侵犯俏像权'
				},
				{
					value: '8',
					name: '涉嫌非法集资'
				},
				{
					value: '9',
					name: '侵犯隐私权'
				},
				{
					value: '10',
					name: '侵犯名誉/商誉'
				},
				{
					value: '11',
					name: '其他问题'
				}
			],
			loading: true
		};
	},
	filters: {
		feedbackFilter(type) {
			// const feedbackType = ['', '功能建议', 'BUG反馈', '业务咨询'];
			// return feedbackType[parseInt(type, 10)];
			debugger
			return this.feedbackType[type];
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.pageNum = 0;
		this.feedbackList.length = 0;
		this.getFeedbackList('refresh');
	},
	// 加载更多
	onReachBottom() {
  if (this.loadingType === 'nomore') return;
		this.pageNum++
		this.getFeedbackList();
	},
	onShow() {
		this.initData();
	},
	methods: {
		// 数据初始化
		initData() {
			this.pageNum = 0;
			this.feedbackList.length = 0;
			this.getFeedbackList();
		},
		// 获取意见反馈列表
		async getFeedbackList(type) {
			await this.$http
				.get(`${opinionList}`, { pageNum: this.pageNum })
				.then(r => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					this.loadingType = r.list.length === 10&&r.total>this.pageNum*10 ? 'more' : 'nomore';
					this.feedbackList = [...this.feedbackList, ...r.list];
				})
				.catch(() => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
		navTo(route) {
			this.$mRouter.push({ route });
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: $page-color-base;
}

.feedback-list {
	position: relative;
	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box {
		display: flex;
		align-items: center;
		.tag {
			font-size: 24upx;
			margin-right: 10upx;
			border: 1px solid;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address {
			font-size: 30upx;
			color: $font-color-dark;
		}
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
	}
}
</style>
