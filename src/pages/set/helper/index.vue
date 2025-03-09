<template>
	<view class="helperList" v-if="!loading">
		<!-- 帮助列表 -->
		<view v-if="helperList.length > 0">
			<u-collapse>
				<u-collapse-item open :title="fItem.name">
					<view class="helper-child-item" v-for="(sItem, sIndex) in fItem.helpLists" :key="sIndex" @tap="navTo(`/pages/set/helper/detail?id=${sItem.id}`)">
						<text>{{ sItem.name }}</text>
						<text class="iconfont iconyou"></text>
					</view>
				</u-collapse-item>
			</u-collapse>
		</view>

		<u-empty text="暂无站点帮助" :iconColor="themeColor.color" mode="data"  v-if="helperList.length === 0 && !loading">
		</u-empty>
		<!--加载动画-->
	</view>
</template>

<script>
import { helperIndex } from '@/api/basic';
export default {
	components: { 
		// uniCollapse, uniCollapseItem 
		},
	data() {
		return {
			loading: true,
			helperList: [],
			pageNum: 0
		};
	},
	onLoad() {
		this.initData();
	},
	methods: {
		// 数据初始化
		initData() {
			this.loading = true;
			this.getHelperList();
		},
		// 通用跳转
		navTo(route) {
			this.$mRouter.push({ route });
		},
		async getHelperList() {
			await this.$http.get(helperIndex).then(r => {
				this.loading = false;
				this.helperList = r;
			});
			this.loading = false;
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: $page-color-base;
}
.helperList {
	margin-top: $spacing-base;
	.helper-child-item {
		margin: $spacing-base $spacing-lg;
		display: flex;
		justify-content: space-between;
	}
}
</style>
