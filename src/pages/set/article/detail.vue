<template>
	<view class="helper-detail" v-if="!loading">
		<view v-if="helperDetail.title" class="detail">
			<view class="title">{{ helperDetail.title }}</view>
			<u-parse lazy-load :content="helperDetail.desc || ''"></u-parse>
		</view>

		<u-empty :text="`暂无文章内容`" :iconColor="themeColor.color" mode="data" v-if="!helperDetail.title && !loading">
		</u-empty>
		<!--加载动画-->

	</view>
</template>

<script>
import { articleView } from '@/api/basic';
export default {
	data() {
		return {
			loading: true,
			helperDetail: {},
			helperId: ''
		};
	},
	onLoad(option) {
		this.helperId = option.id;
		this.initData();
	},
	methods: {
		// 数据初始化
		initData() {
			this.getHelperDetail();
		},
		async getHelperDetail() {
			await this.$http.get(articleView, {
				articleId: this.helperId
			}).then(r => {
				this.loading = false;
				this.helperDetail = r;
				uni.setNavigationBarTitle({ title: r.title });
			}).catch(() => {
				this.loading = false;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: $page-color-base;
}
.helper-detail {
	.detail {
		text-align: center;
		padding: $spacing-base $spacing-base;
		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			padding: $spacing-base 0;
		}
	}
}
</style>
