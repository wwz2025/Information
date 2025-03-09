<template>
	<view class="pay-success" v-if="!loading">
		<!-- #ifdef MP -->
		<view class="icon-container" 	:style="[{ top: topButton+'px'}]" style="margin-left:15px;position: absolute;width: 82px;border-radius: 80px;background-color: rgba(0, 0, 0, 0.11);">
			<u-icon class="left-icon" name="arrow-left" size="23" color="white" @click="goBack()" ></u-icon>
			<u-line
				direction="column"
				:hairline="false"
				length="23"
				margin="0 8px"
			></u-line>
			<u-icon class="right-icon" name="home" size="25" color="white" @click="goHome()"></u-icon>
		</view>
		<!-- #endif -->

		<view class="pay-section" :class="'bg-' + themeColor.name">
			<image class="bg" :src="moneyBg"></image>
			<view class="tips-wrapper">
				<text class="iconfont iconxuanzhong2"></text>
				<view class="content">
					<text class="title">支付成功！</text>
					<view class="tip">感谢您的购买</view>
				</view>
			</view>
		</view>
		<view class="pay-card">
			<!--<view class="pay-card-money" v-if="orderDetail.payMethod==1">
			阶段一:{{moneySymbol}}{{ (orderDetail.price-orderDetail.presalePrice).toFixed(2) }}
			阶段二:{{moneySymbol}}{{ (orderDetail.presalePrice).toFixed(2) }}</view>
			<view class="pay-card-money" v-else>{{moneySymbol}}{{ orderDetail.price }}</view>-->
			<view class="item"><text class="tit">订单编号：</text>{{ orderDetail.orderSn }}</view>
			<view class="item"><text class="tit">下单时间：</text>{{ orderDetail.addTime  }}</view>
			<view class="item"><text class="tit">支付方式：</text>{{ orderDetail.payMethod==1?'微信支付':'账户余额' }}</view>
<!--			<view class="item"><text class="tit">运费：</text>{{ orderDetail.freightPrice }}</view>
			<view class="item"><text class="tit">订单状态：</text>{{ orderDetail.status | orderStatusFilter }}</view>
			<view class="item"><text class="tit">订单类型：</text>{{ orderDetail.orderType | orderTypeFilter }}</view>-->
		</view>
		<view class="btn-group">
<!--			<button
				class="confirm-btn"
				@tap="navTo"
				:class="'bg-' + themeColor.name"
			>查看订单</button>-->
			<button
				class="confirm-btn"
				@tap="toHome"
				:class="'bg-' + themeColor.name"
			>返回首页</button>
		</view>
	</view>
</template>
<script>
import { orderDetail,ordersByCode  } from '@/api/userInfo';
import moment from '@/utils/moment';
import mConstDataConfig from '@/config/constData.config';
export default {
	data() {
		return {
			topButton:0,//胶囊按钮顶部边缘相对于视口顶部的距离
			loading: true,
			type: '',
			id: '',
			orderCode: '',
			moneyBg: this.$mAssetsPath.moneyBg,
			moneySymbol: this.moneySymbol,
			orderDetail: {}
		};
	},
	onLoad(options) {
		// #ifdef MP
		this.topButton = wx.getMenuButtonBoundingClientRect().top;//胶囊按钮顶部边缘相对于视口顶部的距离
		// #endif
		this.type = options.type;
		this.id = options.id;
		this.orderCode = options.orderCode?options.orderCode:'c3b4debd72aa46dea88ef';
		this.getOrderDetail();
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		},
		orderStatusFilter(orderStatus) {
			let state = null;
			mConstDataConfig.orderStatus.forEach(orderItem => {
				if (orderItem.key === parseInt(orderStatus, 10)) {
					state = orderItem.value;
				}
			});
			return state;
		},
		orderTypeFilter(orderStatus) {
    			let state = null;
    			mConstDataConfig.orderType.forEach(orderItem => {
    				if (orderItem.key === parseInt(orderStatus, 10)) {
    					state = orderItem.value;
    				}
    			});
    			return state;
    		},

	},
	methods: {
		// 返回主页
		goHome(){
			this.$mRouter.reLaunch({ route: '/pages/index/index' });
		},
		// 返回上一页
		goBack(){
			let pages = getCurrentPages(); // 当前页面
			let beforePage = pages[pages.length - 2]; // 上一页
			uni.navigateBack({
				success: function() {
					beforePage.onLoad(); // 执行上一页的onLoad方法
				}
			});
		},
		// 获取订单详情
		async getOrderDetail() {
			await this.$http
				.get(`${ordersByCode}`, {
					orderCode: this.orderCode, // 订单id
					simplify: 1 // 获取简化订单详情
				})
				.then(r => {
					debugger
					this.loading = false;
					this.orderDetail = r;
				}).catch(() => {
					this.loading = false;
				});
		},
		navTo() {
			let route;
			switch (this.type) {
				case 'wholesale':
					route = `/pages/marketing/wholesale/detail?id=${this.id}`;
					break;
				default:
					route = '/pages/order/order?state=-1';
					break;
			}
			this.$mRouter.push({ route });
		},
		// 返回主页
		toHome() {
			this.$mRouter.reLaunch({ route: '/pages/index/index' });
		}
	}
};
</script>
<style lang="scss">
page {
	background-color: $page-color-base;
}
.pay-success {
	.pay-section {
		height: 400upx;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			height: 60vw;
		}
		.tips-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			color: $color-white;
			.iconfont {
				font-size: 132upx;
				margin-right: $spacing-base;
			}
			.content {
				.title {
					font-size: $font-lg + 4upx;
				}
				.tip {
					font-size: $font-sm + 2upx;
				}
			}
		}
	}
	.pay-card {
		width: 90%;
		height: 590upx;
		background-color: $color-white;
		border-radius: 12upx;
		margin: -80upx 5% 0;
		box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.05);
		.pay-card-money {
			text-align: center;
			font-size: $font-lg + 12upx;
			padding: $spacing-base 0;
			color: $color-black;
			font-weight: 500;
			border-bottom: 1upx solid rgba(0, 0, 0, 0.05);
		}
		.item {
			height: 80upx;
			line-height: 80upx;
			margin-left: $spacing-lg;
			color: $font-color-dark;
			.tit {
				color: $font-color-light;
			}
		}
	}
	.btn-group {
		padding-top: 60upx;
		.confirm-btn {
			margin-top: $spacing-lg;
			width: 72%;
		}
	}
}


/* 在对应的样式部分，如style标签内或外部CSS文件 */
.icon-container {
	/* #ifdef MP */
	/*top:var(--status-bar-height);*/
	display: flex; /* 使用 Flex 布局 */
	align-items: left;  /* 垂直居中对齐（如果需要）*/
	flex-direction: row; /* 明确指定子元素水平排列 */
	@include flex;
	/*align-items: center;*/
	/*justify-content: space-between;*/
	border-width: 0.5px;
	border-radius: 100px;
	border-color: $u-border-color;
	padding: 3px 7px;
	opacity: 0.8;
	/* #endif */

	/* #ifndef MP */
	top:20px;
	display: flex; /* 使用 Flex 布局 */
	flex-direction: row; /* 明确指定子元素水平排列 */
	justify-content:space-between; /* 图标整体居右对齐 */
	align-items: center; /* 垂直居中对齐（如果需要）*/
	padding: 5px;
	/* #endif */

	background: transparent;
	position: absolute;
	z-index: 1000;
	width: 100%;
}

.left-icon,
.right-icon {
	/* 可以根据需要调整图标自身的样式 */
	width: 25px;
	height: 25px;
	border-radius: 90%;
	background-color: rgba(0, 0, 0, 0.11);
	margin-left: 10px; /* 为左侧图标之后的图标添加间隔 */
}
</style>
