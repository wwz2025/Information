<template>
	<view class="collection">
		<view class="row" v-for="(item, index) in collectionList" :key="index">
			<!-- 删除按钮 -->
			<view class="menu" :class="'bg-' + themeColor.name" @tap.stop="handleDeleteCollection(item.id)">
				<text class="iconfont icon iconiconfontshanchu1"></text>
			</view>
			<!-- 商品 -->
			<view
				class="carrier"
				:class="[
					theIndex === index ? 'open' : oldIndex === index ? 'close' : ''
				]"
				@tap.stop="navTo(item.marketing_type, item.spuId)"
				@touchstart="touchStart(index, $event)"
				@touchmove="touchMove(index, $event)"
				@touchend="touchEnd(index, $event)"
			>
				<view class="left">
					<image
						class="image"
						:src="item.sku && item.sku.url"
					></image>
					<image
						v-if="item.marketing_type"
						class="tag"
						:src="item.marketing_type | marketingTypeTag"
						mode="aspectFill"
					></image>
				</view>
				<view class="mid">
					<view class="title in2line">{{
						item.sku && item.sku.name
					}}</view>
					<view class="data">
						<view class="item"
							><text class="iconfont icontuandui"></text>评价
							{{ (item.sku && item.sku.commentCount) || 0 }}</view
						>
						<view class="item"
							><text class="iconfont iconkechakan"></text>好评
							{{ (item.sku && item.sku.goodCommentCount) || 0 }}</view
						>

					</view>
					<view class="bottom">
						<text class="price" :class="'text-' + themeColor.name">{{ moneySymbol }}{{
							item.sku && item.sku.price
						}}</text>
						<text>{{ item.createTime  }}</text>
					</view>
				</view>
			</view>
		</view>
		<rf-load-more :status="loadingType" v-if="collectionList.length > 0" />

		<u-empty text="快去收藏一些商品吧" :iconColor="themeColor.color" mode="data"  v-if="collectionList.length === 0 && !loading">
		</u-empty>
		<!--加载动画-->

	</view>
</template>

<script>
/**
 * @des 收藏
 *
 * @author taidao-11-22 10:47
 * @copyright 2019
 */
import { collectList } from '@/api/userInfo';
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import { collectDel } from '@/api/basic';
import moment from '@/utils/moment';
import $mAssetsPath from '@/config/assets.config';
export default {
	components: {
		rfLoadMore
	},
	data() {
		return {
			collectionList: [],
			pageNum :0,
			loadingType: 'more',
			loading: true,
			moneySymbol: this.moneySymbol,
			// 控制滑动效果
			theIndex: null,
			oldIndex: null
		};
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		},
		marketingTypeTag(marketingType) {
			let tag;
			switch (marketingType) {
				case 'discount':
					tag = $mAssetsPath.discountTag;
					break;
				case 'bargain':
					tag = $mAssetsPath.bargainTag;
					break;
				case 'group_buy':
					tag = $mAssetsPath.groupTag;
					break;
				case 'wholesale':
					tag = $mAssetsPath.wholesaleTag;
					break;
			}
			return tag;
		}
	},
	onShow() {
		this.initData();
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.pageNum = 0;
		this.collectionList = [];
		this.loading = true;
		this.getCollectionList('refresh');
	},
	// 加载更多
	onReachBottom() {
  if (this.loadingType === 'nomore') return;
		this.pageNum++
		this.getCollectionList();
	},
	methods: {
		async handleDeleteCollection(id) {
			await this.$http
				.delete(`${collectDel}?id=${id}`, {
					pageNum: this.pageNum
				})
				.then(() => {
					this.$mHelper.toast('取消收藏成功');
					this.pageNum = 0;
					this.collectionList.length = 0;
					this.getCollectionList();
					this.oldIndex = null;
					this.theIndex = null;
				});
		},
		// 数据初始化
		initData() {
			this.pageNum = 0;
			this.collectionList.length = 0;
			this.getCollectionList();
		},
		// 控制左滑删除效果
		touchStart(index, event) {
			// 多点触控不触发
			if (event.touches.length > 1) {
				this.isStop = true;
				return;
			}
			this.oldIndex = this.theIndex;
			this.theIndex = null;
			// 初始坐标
			this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
		},
		touchMove(index, event) {
			// 多点触控不触发
			if (event.touches.length > 1) {
				this.isStop = true;
				return;
			}
			let moveX = event.touches[0].pageX - this.initXY[0];
			let moveY = event.touches[0].pageY - this.initXY[1];

			if (this.isStop || Math.abs(moveX) < 5) {
				return;
			}
			if (Math.abs(moveY) > Math.abs(moveX)) {
				// 竖向滑动-不触发左滑效果
				this.isStop = true;
				return;
			}

			if (moveX < 0) {
				this.theIndex = index;
				this.isStop = true;
			} else if (moveX > 0) {
				if (this.theIndex != null && this.oldIndex === this.theIndex) {
					this.oldIndex = index;
					this.theIndex = null;
					this.isStop = true;
					setTimeout(() => {
						this.oldIndex = null;
					}, 150);
				}
			}
		},
		touchEnd(index, $event) {
			// 结束禁止触发效果
			this.isStop = false;
		},
		// 获取收藏列表
		async getCollectionList(type) {
			await this.$http
				.get(`${collectList}`, {
					pageNum: this.pageNum
				})
				.then(r => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					if(r.list){
					this.loadingType = r.list.length === 10&&r.total>this.pageNum*10 ? 'more' : 'nomore';
					this.collectionList = [...this.collectionList, ...r.list];
					}
				})
				.catch(() => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
		navTo(type, id) {
			let route = `/pages/product/product?id=${id}`;
			switch (type) {
				case 'discount':
					route = `/pages/marketing/discount/product?id=${id}`;
					break;
				case 'bargain':
					route = `/pages/marketing/bargain/product?id=${id}`;
					break;
				case 'group_buy':
					route = `/pages/marketing/group/product?id=${id}`;
					break;
				case 'wholesale':
					route = `/pages/marketing/wholesale/product?id=${id}`;
					break;
			}
			this.$mRouter.push({ route });
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: $page-color-base;
}
.collection {
	.row {
		width: calc(94%);
		height: 200upx;
		margin: 20upx auto;
		border-radius: 15upx;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
		z-index: 4;
		border: 0;
		.menu {
			.icon {
				color: #fff;
				font-size: 60upx;
			}
			position: absolute;
			width: 29%;
			height: 100%;
			right: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 2;
		}
		.carrier {
			@keyframes showMenu {
				0% {
					transform: translateX(0);
				}
				100% {
					transform: translateX(-30%);
				}
			}
			@keyframes closeMenu {
				0% {
					transform: translateX(-30%);
				}
				100% {
					transform: translateX(0);
				}
			}
			&.open {
				animation: showMenu 0.25s linear both;
			}
			&.close {
				animation: closeMenu 0.15s linear both;
			}
			background-color: #fff;
			position: absolute;
			width: 100%;
			padding: 0 0;
			height: 100%;
			z-index: 3;
			display: flex;
			align-items: center;
			.left {
				width: 22vw;
				height: 22vw;
				margin-left: 20upx;
				margin-right: 10upx;
				position: relative;
				.image {
					border-radius: 10upx;
					width: 22vw;
					height: 22vw;
				}
				.tag {
					position: absolute;
					left: 0;
					top: 0;
					width: 60upx;
					height: 60upx;
				}
			}
			.mid {
				width: 100%;
				margin: 10upx 10upx 0;
				.title {
					height: 60upx;
					line-height: 1.2;
					font-size: $font-base;
				}
				.data {
					width: 100%;
					display: flex;
					align-items: center;
					margin: 10upx 0 5upx;
					font-size: $font-base;
					color: $font-color-base;
					.item {
						flex: 1;
					}
					.iconfont {
						color: $font-color-light;
						margin-right: 10upx;
					}
					.status {
						padding: 6upx 20upx;
						opacity: 0.8;
						color: $color-white;
						font-size: $font-sm;
						border-radius: 6upx;
					}
				}
				.bottom {
					line-height: 1.2;
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: $font-sm;
					color: $font-color-light;
					.price {
						font-size: $font-lg;
					}
				}
			}
		}
	}
}
</style>
