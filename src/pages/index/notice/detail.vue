<template>
	<view class="rf-notice-detail" style="background-color: #FFFFFF;height: 100%;">
		<view class="banner" v-if="announceDetail.cover">
			<rf-image class="banner-img" :src="announceDetail.cover"></rf-image>
			<view class="banner-title in2line">{{ announceDetail.noticeTitle }}</view>
		</view>
		<view class="banner-title" v-if="!announceDetail.cover">{{announceDetail.noticeTitle}}</view>
		<view class="article-meta" v-if="announceDetail.createTime">

			<text class="article-author">发布时间：</text>
			<text class="article-time">{{ announceDetail.createTime  }}</text>
		</view>
		<view class="article-content">
			<u-parse lazy-load :content="announceDetail.noticeContent"></u-parse>
		</view>

		<u-empty text="您还没有反馈意见" :iconColor="themeColor.color" mode="data" v-if="!announceDetail && !loading" ></u-empty>
		<!--加载动画-->

	</view>
</template>

<script>
import { noticeDetail } from '@/api/sms';
import moment from '@/utils/moment';

export default {
	data() {
		return {
			announceDetail: {},
			id: undefined,
			loading: true
		};
	},
	filters: {
		// 时间格式化
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		}
	},
	onLoad(event) {
		this.id = event.id;
		this.getNotifyAnnounceView(event.id);
	},
	onShareAppMessage() {
		return {
			title: this.banner.title,
			path: `/pages/index/notice/detail?id=${this.id}`
		};
	},
	methods: {
		// 获取通知列表
		async getNotifyAnnounceView(id) {
			await this.$http
				.get(`${noticeDetail}`, { id })
				.then(r => {
					this.loading = false;
					this.announceDetail = r;
					uni.setNavigationBarTitle({
						title: r.title
					});
				})
				.catch(() => {
					this.loading = false;
				});
		}
	}
};
</script>

<style scoped lang="scss">
page {
	background-color: $color-white;
}
.rf-notice-detail {
	.banner {
		overflow: hidden;
		position: relative;
		background-color: #ccc;
		.banner-img {
			height: 300upx;
			width: 100%;
		}
		.banner-title {
			max-height: 84upx;
			overflow: hidden;
			position: absolute;
			bottom: 0;
			width: 100%;
			font-size: 32upx;
			font-weight: 400;
			line-height: 42upx;
			color: white;
			z-index: 11;
			background-color: rgba(0, 0, 0, 0.25);
			padding: 4upx 20upx;
		}
	}
	.banner-title {
		padding: $spacing-lg $spacing-lg 0;
		font-size: $font-lg;
	}
	.article-meta {
		padding: 20upx 30upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: gray;

		.article-text {
			font-size: 32upx;
			line-height: 50upx;
			margin: 0 20upx;
		}

		.article-author,
		.article-time {
			font-size: 32upx;
		}
	}

	.article-content {
		padding: 0 30upx;
		overflow: hidden;
		font-size: 32upx;
		margin-bottom: 30upx;
	}
}
</style>
