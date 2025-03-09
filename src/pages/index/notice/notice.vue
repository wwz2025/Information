<template>
	<view clas="notice">
		<view class="notice-item" v-for="item in announceList" :key="item.noticeId">
			<view
				class="content"
				@tap="navTo(`/pages/index/notice/detail?id=${item.noticeId}`)"
			>
			<text class="title">公告标题：{{ item.noticeTitle }}</text>
			<view class="bot b-t">
				<text>公告时间：{{ item.createTime  }}</text>
			</view>
			<view class="bot b-t">
				<text>查看公告详情</text>
				<i class="more-icon iconfont iconyou"></i>
			</view>
		</view>
	</view>

	<rf-load-more
		class="load-more"
		:status="loadingType"
		v-if="announceList.length > 0"
	></rf-load-more>

	<u-empty text="暂无数据" :iconColor="themeColor.color" mode="data" v-if="announceList.length === 0 && !loading"></u-empty>
	<!--加载动画-->
	</view>
</template>

<script>
import { noticeList } from '@/api/sms';
import rfLoadMore from '@/components/rf-load-more/rf-load-more.vue';
import moment from '@/utils/moment';
export default {
	components: { rfLoadMore },
	data() {
		return {
			announceList: [], // 公告列表
			loadingType: 'more',
			loading: true,
			pageNum: 0
		};
	},
	filters: {
		// 时间格式化
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.pageNum = 0;
		this.announceList.length = 0;
		this.getNotifyAnnounceIndex('refresh');
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingType === 'nomore') return;
		this.pageNum++
		this.getNotifyAnnounceIndex();
	},
	onLoad() {
		this.initData();
	},
	methods: {
		// 数据初始化
		initData() {
			this.getNotifyAnnounceIndex();
		},
		// 获取通知列表
		async getNotifyAnnounceIndex(type) {
			await this.$http
				.get(`${noticeList}`, { pageNum: this.pageNum })
				.then(r => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					this.loadingType = r.length === 10 ? 'more' : 'nomore';
					this.announceList = [...this.announceList, ...r];
				})
				.catch(() => {
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					this.loading = false;
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
	padding-bottom: 30upx;
}

.notice-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 5px;
}

.time {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 80upx;
	padding-top: 10upx;
	font-size: 26upx;
	color: #7d7d7d;
}

.content {
	width: 710upx;
	padding: 0 24upx;
	background-color: #fff;
	border-radius: 4upx;
}

.title {
	display: flex;
	align-items: center;
	height: 90upx;
	font-size: 32upx;
	color: #303133;
}

.img-wrapper {
	width: 100%;
	height: 260upx;
	position: relative;
}

.pic {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 6upx;
}

.cover {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	font-size: 36upx;
	color: #fff;
}

.introduce {
	display: inline-block;
	padding: 16upx 0;
	font-size: 28upx;
	color: #606266;
	line-height: 38upx;
}

.bot {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 80upx;
	font-size: 24upx;
	color: #707070;
	position: relative;
}

.more-icon {
	font-size: 32upx;
}
</style>
