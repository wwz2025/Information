<template>
	<view class="user">
		<tabbar tabIndex=4 ></tabbar>

		<uni-popup ref="popup" type="center">
			<view class="img"  style="text-align: center;">
				<text style="font-size: 45px;" class="iconfont cell-icon icondianzan-ash" 	:style="[{ color: themeColor.color }]"></text>
			</view>
			<view class="text">共获得{{messageText?messageText:0}}个点赞</view>
		</uni-popup>

		<uni-popup ref="popupSign"  background-color="#fff" type="center" >
			<view class="uni-popup-share" style="border-radius: 5px;">
				<view class="uni-dialog-title"><text class="uni-share-title-text uni-popup__success"  style="font-size: 44rpx;">今日已签到</text></view>
				<view class="uni-dialog-content">
					<view class="cu-item">
						<text class="lg cuIcon-sponsor" :class="'text-'+themeColor.name" style="font-size: 100px;"></text>
					</view>
				</view>
				<view class="uni-dialog-title">
					<text class="uni-share-title-text" style="font-size: 15px;font-family: YouYuan;">
						恭喜您，签到成功。奖励100积分!
					</text>
				</view>

				<view class="u-page__button-item" style="display: flex;flex-direction: row;justify-content: center;margin:0 40rpx;">
					<view style="width:200rpx">
						<u-button
							text="我知道了"
							size="normal"
							plain
							shape="circle"
							type="info"
							@click="userSignClose()"
						></u-button>
					</view>
					<view style="width:200rpx;margin-left: 10rpx;">
						<u-button
							text="去使用"
							size="normal"
							plain
							shape="circle"
							type="success"
							@click="userSignUse()"
						></u-button>
					</view>
				</view>
			</view>
		</uni-popup>

		<!--头部-->
		<view class="user-section" :class="'bg-' + themeColor.name">
			<image class="bg" :src="userBg"></image>

			<!--用户信息-->
			<view class="user-info-box">
				<view class="portrait-box" @tap="navTo(userInfo.userName ? '/pages/user/userinfo/userinfo' : 'login')">
					<!-- <image class="portrait" :src="userInfo.avatar?fileUrl+userInfo.avatar:headImg"></image> -->
					<view class='cu-avatar xl radius' :style="[{ backgroundImage:'url('+(userInfo.avatar?fileUrl+userInfo.avatar:headImg)+') '}]">
						<!-- <view v-if="userInfo.userName" class='cu-tag badge xl' @click="navTo(userInfo.userName ? '/pages/user/msg/index' : 'login')">{{msgCout}}</view> -->
					</view>

					<text class="username" @click="navTo(userInfo.userName ? '/pages/user/userinfo/userinfo' : 'login')">
						{{userInfo.userName ||userInfo.phonenumber ||'登录/注册'}}
					</text>
				</view>

				<!-- <view class="cu-capsule line-white round" style="display: inline;float: right;margin-top: 126rpx;"  @click="userSign(userInfo.userName ? 'sign' : 'login')">
					<view class="cu-tag  bg-white" style="padding: 10rpx 24rpx;font-size: 12px;">
						{{signText}}
						<text class="lg text-red cuIcon-roundrightfill" style="margin-left: 15rpx;"></text>
					</view>
				</view> -->

				<view class="cu-capsule round" style="position: absolute;top: 130rpx;margin-left: 140rpx;" @click="navTo(userInfo.userName ? '/pages/user/msg/index' : 'login')">
					<view class='cu-tag bg-red'>
						消息
					</view>
					<view class="cu-tag line-red bg-white" >
						{{msgCout}}
					</view>
				</view>

			</view>
			<!--vip信息-->
			<view class="vip-card-box">
				<view class="b-btn"  @click="userSign(userInfo.userName ? 'sign' : 'login')">
					{{signText}}
					<text class="lg text-red cuIcon-roundrightfill" style="margin-left: 5rpx;"></text>
				</view>
				<!-- <view class="b-btn" >
					{{ userInfo.customerLevel | filterMemberLevel }}
				</view> -->
				<view class="tit">
					<i class="iconfont iconzuanshi" />{{appName}}尊享会员
				</view>
				<text class="e-m">{{appName}} 版权所有</text>
			</view>
		</view>
		<!-- 个人中心 内容区-->
		<view class="cover-container"
			:style="[{transform: coverTransform,transition: coverTransition}]"
			@touchstart="coverTouchstart" @touchmove="coverTouchmove" @touchend="coverTouchend"
		>
			<image class="arc" :src="arc"></image>
			<!--余额 优惠券 积分信息-->
			<view class="promotion-center">
				<view class="tj-sction">
					<view class="tj-item" v-for="item in amountList" :key="item.title" @tap="navTo(item.url)" >
						<text class="num" :class="item.value > 0 ? 'text-'+themeColor.name : ''">
							{{ item.value }}
						</text>
						<text class="title">{{ item.title }}</text>
					</view>
				</view>
			</view>

			<view class="history-section" style="
				display: flex;
				align-items: baseline;
				padding:5px 15px;
				line-height: 60rpx;
				position: relative;">
				<i
					icon="iconfuwu"
					class="iconfont cell-icon iconzuji"
					:style="[{ color: themeColor.color }]"
				/>
				<text class="cell-tit clamp">再小的事情，都值得被记录</text>
				<u-tag  @click="navTo('/pages/question/add')"  plain shape="circle" text="+发布" :color="themeColor.color" :borderColor="themeColor.color"/>
			</view>

			<!--我的服务-->
			<view class="promotion-center">
				<!-- <list-cell icon="iconfuwu" style="font-size:36rpx" :iconColor="themeColor.color" @eventClick="navTo('/pages/set/set')" title="更多服务">
				</list-cell> -->

				<u-cell  title="更多服务" arrow-direction="right" size="16px" :border="false"  :isLink="true"  @click="navTo('/pages/set/set')"  >
					<u-icon slot="icon" size="24" name="setting-fill"  :color="themeColor.color" ></u-icon>
				</u-cell>

				<view class="tj-sction">
					<!-- 分类列表 -->
					<view class="category-list">
						<view
							class="category"
							v-for="(item, index) in settingList"
							:key="index"
							:style="{display: settingItemShowFilter(item.title)}"
							@tap.stop="navTo(item.url)"
						>
							<view v-if="item.title !== '分享'">
								<view class="img">
									<text
										v-if="item.icon=='icondianzan-ash'"
									    style="font-size: 36px;"
										class="colorui cuIcon-appreciate"
										:class="['text-'+themeColor.name]"
									></text>

									<text
										v-if="item.icon!='icondianzan-ash'"
										class="iconfont"
										:class="[item.icon, 'text-'+themeColor.name]"
									></text>

								</view>
								<view class="text">{{ item.title }}</view>
							</view>
							<button
								class="share-btn"
								open-type="share"
								@tap="share"
								v-else
							>
								<view class="img">
									<text
										class="iconfont"
										:class="[item.icon, 'text-'+themeColor.name]"
									></text>
								</view>
								<view class="text">{{ item.title }}</view>
							</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--页面加载动画-->

	</view>
</template>
<script>
/**
 * @des 个人中心
 *
 * @author taidao-01-10 11:41
 * @copyright 2019
 */
import { footPrintList, memberInfo, notifyUnRreadCount } from '@/api/userInfo';
import { orderCountStatisic } from '@/api/product';
import { mapMutations } from 'vuex';
import $mAssetsPath from '@/config/assets.config';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import { countMessagesUrl,userSignUrl,indexSignUrl} from '@/api/forum';

let startY = 0, moveY = 0, pageAtTop = true;
export default {
	components: {
		uniPopup
	},
	data() {
		return {
			fileUrl:this.$mConfig.fileUrl,
			messageText:'',
			settingList: this.$mConstDataConfig.settingList,
			orderSectionList: this.$mConstDataConfig.orderSectionList,
			amountList: this.$mConstDataConfig.amountList,
			orderStatics:{},
			isOpenLiveStreaming: this.$mSettingConfig.isOpenLiveStreaming,
			headImg: this.$mAssetsPath.headImg,
			vipCardBg: this.$mAssetsPath.vipCardBg,
			arc: this.$mAssetsPath.arc,
			userBg: this.$mAssetsPath.userBg,
			coverTransform: 'translateY(0px)',
			coverTransition: '0s',
			moving: false,
			userInfo: {
				// 用户信息
				promoter: null // 分销商信息
			},
			footPrintList: [], // 足迹列表
			loading: true,
			appName: this.$mSettingConfig.appName,
			hasLogin: false,
			msgCout:0,//未读消息数量
			signText:'签到'
		};
	},
	filters: {
		filterMemberLevel(val) {
			if (!val) return '普通用户';
				return val.name;
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
	computed: {
		// 判断推广中心是否显示 当有分销商信息的时候显示
		settingItemShowFilter() {
			return function (val) {
				let type = 'block';
				if (val === '推广中心' && this.userInfo.promoter) {
					type = 'none';
				} else if (val === '直播' && !this.isOpenLiveStreaming) {
					type = 'none';
				}
				return type;
			};
		}
	},
	// 小程序分享
	onShareAppMessage() {
		return {
			title: `欢迎来到${this.appName}`,
			path: '/pages/index/index'
		};
	},
	async onShow() {
		uni.hideTabBar({
			animation: false
		});
		// 初始化数据
		await this.initData();
	},
	// #ifndef MP
	onNavigationBarButtonTap(e) {
		const index = e.index;
		if (index === 0) {
			this.navTo('/pages/set/set');
		} else if (index === 1) {
			// #ifdef APP-PLUS
			// eslint-disable-next-line
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			this.$mRouter.switchTab({ route: '/pages/notify/notify' });
		}
	},
	// #endif
	methods: {
		...mapMutations(['setNotifyNum', 'setCartNum']),
		// 分享
		share() {
			const url = `${this.$mConfig.hostUrl}/pages/index/index`;
			// #ifdef H5
			this.$mHelper.h5Copy(url);
			// #endif
			// #ifdef APP-PLUS
			const shareImg = `${this.$mSettingConfig.appLogo}`;
			this.$mHelper.handleAppShare(url, this.appName, `欢迎来到${this.appName}`, shareImg);
			// #endif
		},
		...mapMutations(['login']),
		// 数据初始化
		async initData() {
			this.hasLogin = this.$mStore.getters.hasLogin;

			uni.setTabBarStyle({
				selectedColor: this.themeColor.color,
				borderStyle: 'white'
			});
			this.themeColor.tabList && this.themeColor.tabList.forEach((selectedIconPath, index) => {
				uni.setTabBarItem({
					index,
					selectedIconPath
				});
			});
			if (this.hasLogin) {
				await this.getMemberInfo();
				// await this.orderCountStatisic();
				await this.initNotifyNum();
				await this.initIndexSign();
				// 获取足迹列表
				// await this.getFootPrintList();
			} else {
				this.loading = false;
				this.resetSectionData();
			}
		},
		// 获取用户信息
		async getMemberInfo() {
			await this.$http
				.get(memberInfo)
				.then(async r => {
					this.loading = false;
					this.userInfo = r;

					// this.amountList[0].value=this.userInfo.score?this.userInfo.score:'0';
					// this.amountList[1].value=this.userInfo.questionCount?this.userInfo.questionCount:'0';
					this.amountList[0].value=this.userInfo.upvoteCount?this.userInfo.upvoteCount:'0';
					this.amountList[1].value=this.userInfo.fansCount?this.userInfo.fansCount:'0';
					this.amountList[2].value=this.userInfo.focusCount?this.userInfo.focusCount:'0';

					await this.setSectionData(r);
				})
				.catch(() => {
				//	this.hasLogin = false;
					this.userInfo = {};
					this.resetSectionData();
					this.loading = false;
				});
		},
		// 设置签到状态
		async initIndexSign () {
			await this.$http.get(indexSignUrl).then(r => {
				if(r.alreadySign)
				{
					this.signText='已签到';
				}
			});
		},
		// 设置未读消息个数
		async initNotifyNum () {
			await this.$http.get(countMessagesUrl).then(r => {
				this.msgCout=r.mcount+r.pcount+r.ccount;
			});
		},

		// 清空个人中心的各模块状态
		resetSectionData() {
			this.userInfo = {};
			uni.removeTabBarBadge({ index: this.$mConstDataConfig.cartIndex });
			uni.removeTabBarBadge({ index: this.$mConstDataConfig.notifyIndex });
			this.amountList[0].value = 0;
			this.amountList[1].value = 0;
			this.amountList[2].value = 0;
			// this.orderSectionList[0].num = 0;
			// this.orderSectionList[1].num = 0;
			// this.orderSectionList[2].num = 0;
			// this.orderSectionList[3].num = 0;
			// this.orderSectionList[4].num = 0;
		},

		// 给个人中心的各模块赋值
		setSectionData(data) {
			// 更新userInfo缓存
			uni.setStorageSync('userInfo', data);
		},
		// 用户关闭
		userSignClose() {
			this.$refs.popupSign.close();
		},
		//用户积分兑换
		userSignUse() {
			this.navTo(`/pages/product/list?param=${JSON.stringify({ is_recommend: 1,goodsType:38 })}`,'');
		},
		// 用户签到
		userSign(data) {
			if(data=='login')
			{
				this.navTo('login');
			}
			else
			{
				this.$http.get(userSignUrl).then(r => {
					this.signText='已签到';
					this.$refs.popupSign.open();
					setTimeout(() => {
						this.$refs.popupSign.close()
					}, 10000);
				});
			}
		},

		// 统一跳转接口,拦截未登录路由
		navTo(route) {
			if(route=="upvote")
			{
				this.messageText = this.userInfo.upvoteCount;
				this.$refs.popup.open();
				// setTimeout(() => {
				// 	this.$refs.popup.close()
				// }, 1000);
			}

 			if (!route) return;
			if (route === '/pages/index/notice/notice') {
				this.$mRouter.push({ route });
			}else if (!this.hasLogin) {
				uni.removeStorageSync('backToPage');
				// this.$mRouter.push({ route: '/pages/public/login' });
				this.$mRouter.push({route: '/pages/public/loginMethod'});
			}else if(route.indexOf('/pages/user/fans/index?')!=-1){
				route=route+'&uid='+this.userInfo.userId;
				this.$mRouter.push({ route });
			}else{
				this.$mRouter.push({ route });
			}
		},
		/**
		 *  会员卡下拉和回弹
		 *  1.关闭bounce避免ios端下拉冲突
		 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
		 *    transition设置0.1秒延迟，让css来过渡这段空窗期
		 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
		 */
		coverTouchstart(e) {
			if (pageAtTop === false) {
				return;
			}
			this.coverTransition = 'transform .1s linear';
			startY = e.touches[0].clientY;
		},
		coverTouchmove(e) {
			moveY = e.touches[0].clientY;
			let moveDistance = moveY - startY;
			if (moveDistance < 0) {
				this.moving = false;
				return;
			}
			this.moving = true;
			if (moveDistance >= 80 && moveDistance < 100) {
				moveDistance = 80;
			}
			if (moveDistance > 0 && moveDistance <= 80) {
				this.coverTransform = `translateY(${moveDistance}px)`;
			}
		},
		coverTouchend() {
			if (this.moving === false) {
				return;
			}
			this.moving = false;
			this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
			this.coverTransform = 'translateY(0px)';
		}
	}
};
</script>
<style lang="scss" scoped>
page {
	min-height: 100vh;
	background-color: $page-color-base;
}
.user {
	min-height: 100vh;
	padding-bottom: 80rpx;
	background-color: $page-color-base;
	.user-section {
		height: 520rpx;
		padding: 80rpx 30rpx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			height: 60vw;
			opacity: 0.84;
		}
		.user-info-box {
			height: 180rpx;
			display: flex;
			align-items: center;
			position: relative;
			z-index: 1;
			justify-content: space-between;

			.portrait-box {
				display: flex;
				align-items: center;
 				.cu-avatar.xl {
						width: 130rpx;
						height: 130rpx;
						font-size: 2.5em;
				}
				.cu-avatar {
						font-variant: small-caps;
						margin: 0;
						padding: 0;
						display: inline-flex;
						text-align: center;
						justify-content: center;
						align-items: center;
						/* background-color: #ccc; */
						color: #ffffff;
						white-space: nowrap;
						position: relative;
						width: 32px;
						height: 32px;
						background-size: cover;
						background-position: center;
						vertical-align: middle;
						font-size: 1.5em;
				}
				.radius {
					border: 5rpx solid #fff;
					border-radius: 50%;
				}


				.portrait {
					width: 130rpx;
					height: 130rpx;
					border: 5rpx solid #fff;
					border-radius: 50%;
				}

				.username {
					font-size: $font-lg + 6upx;
					color: $color-white;
					margin-left: 20rpx;
				}

				button {
					background-color: transparent;
					font-size: $font-lg + 6upx;
					color: $font-color-dark;
					border: none;
				}

				button::after {
					border: none;
				}
			}
		}

		.vip-card-box {
			display: flex;
			flex-direction: column;
			color: #f7d680;
			height: 240rpx;
			background: url('/static/vip-card.png');
			background-size: 100% 100%;
			border-radius: 16rpx 16rpx 0 0;
			overflow: hidden;
			position: relative;
			padding: 20rpx 24rpx;
			.b-btn{
				position: absolute;
				right: 24rpx;
				top: 24rpx;
				width: 132rpx;
				height: 40rpx;
				text-align: center;
				line-height: 40rpx;
				font-size: 22rpx;
				color: #36343c;
				border-radius: 20px;
				background: linear-gradient(to left, #f9e6af, #ffd465);
				z-index: 1;
			}
			.tit {
				font-size: $font-lg + 2upx;
				color: #f7d680;
				margin-bottom: 28rpx;
				.iconfont {
					color: #f6e5a3;
					display: inline-block;
					margin-right: 16rpx;
				}
			}
		}
	}

	.cover-container {
		margin-top: -150rpx;
		padding: 0 30rpx 20rpx;
		position: relative;
		background-color: $page-color-base;

		.arc {
			position: absolute;
			left: 0;
			top: -34rpx;
			width: 100%;
			height: 36rpx;
		}

		.promotion-center {
			background: #fff;
			margin-bottom: 20rpx;
			/*分类列表*/
			.category-list {
				width: 100%;
				padding: 0 0 30rpx 0;
				border-bottom: solid 2rpx #f6f6f6;
				display: flex;
				flex-wrap: wrap;
				.category {
					width: 33.3%;
					margin-top: 50rpx;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					.img {
						width: 100%;
						display: flex;
						justify-content: center;

						.iconfont {
							font-size: $font-lg + 38upx;
						}
					}

					.text {
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 28rpx;
						color: #3c3c3c;
					}
					.share-btn {
						height: 142rpx;
						text-align: left;
						background: none;
						padding: 0;
						margin: 0;
					}

					.share-btn:after {
						border: none;
						border-radius: none;
					}
					// .icondianzan-ash:before{
					// 	font-size: 90rpx;
					// }
				}
			}
		}

		.tj-sction {
			@extend %section;
			display: flex;

			.tj-item {
				@extend %flex-center;
				flex: 1;
				flex-direction: column;
				margin: 30rpx 0;
				font-size: $font-sm;
				color: #75787d;
				/*border-right: 2rpx solid rgba(0, 0, 0, 0.2);*/
			}

			/*.tj-item:last-child {*/
			/*border-right: none;*/
			/*}*/
			.num {
				//font-size: $font-base;
				font-size: 36rpx;
			}
			.title {
				font-size: 32rpx;
			}
			.red {
				color: $base-color;
			}
		}

		.order-section {
			@extend %section;
			padding: 28rpx 0;

			.order-item {
				@extend %flex-center;
				width: 120rpx;
				height: 120rpx;
				border-radius: 10rpx;
				font-size: $font-sm;
				color: $font-color-dark;
				position: relative;
			}

			.badge {
				position: absolute;
				top: 0;
				right: 4rpx;
			}

			.iconfont {
				font-size: 48rpx;
			}

			.icon-shouhoutuikuan {
				font-size: 44rpx;
			}
		}

		.history-section {
			background: #fff;
			margin-bottom: $spacing-sm;
			.h-list-history {
				margin: 0;
				border-radius: 10rpx;
				white-space: nowrap;
				background-color: $page-color-base;
				.h-item-history {
					background-color: $color-white;
					display: inline-block;
					font-size: $font-sm;
					color: $font-color-base;
					width: 180rpx;
					margin: $spacing-sm $spacing-sm 0 0;
					border-radius: 10rpx;
					position: relative;
					top: 0;
					overflow: hidden;
					.h-item-img {
						width: 180%;
						height: 200rpx;
						border-top-left-radius: 12rpx;
						border-top-right-radius: 12rpx;
						border-bottom: 1rpx solid rgba(0, 0, 0, 0.01);
					}
					.tag {
						position: absolute;
						border-top-left-radius: 12rpx;
						left: 0;
						right: 0;
						width: 60rpx;
						height: 60rpx;
					}
					.h-item-text {
						font-size: $font-sm;
						margin: $spacing-sm 4rpx;
					}
				}
			}
			.no-foot-print {
				text-align: center;
				padding: 48rpx 0;

				.no-foot-print-icon {
					font-size: $font-lg + 2upx;
					margin-right: 10rpx;
				}
			}
			.share-btn {
				height: 102rpx;
				text-align: left;
				background: none;
				padding: 0;
				margin: 0;
			}

			.share-btn:after {
				border: none;
				border-radius: none;
			}
		}
	}
}
%flex-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
%section {
	justify-content: space-around;
	display: flex;
	align-content: center;
	background: #fff;
	border-radius: 10rpx;
}


	.cell-icon {
		align-self: center;
		width: 56rpx;
		max-height: 60rpx;
		font-size: 38rpx;
	}
	.cell-tit {
		flex: 1;
		//font-size: $font-base;
		font-size: 32rpx;
		color: $font-color-dark;
		margin-right: 10rpx;
	}
	/deep/ uni-text.cell-tit.clamp{
		font-size: 32rpx;
	}
	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #ffffff;
	}
	.tag-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		margin: 10rpx 15rpx;
		justify-content: center;
	}

	/deep/ .iconzuji:before{
		font-size: 43rpx;
	}
	/deep/ .iconfuwu:before {
	    font-size: 38rpx;
	}
	/deep/ .mix-list-cell .cell-tit {
	    flex: 1;
	    font-size: 32rpx;
	    color: #303133;
	    margin-right: 10rpx;
	}

	/*弹出框提示*/
	.uni-popup-dialog {
		width: 300px;
		border-radius: 5px;
		background-color: #fff;
	}

	/deep/ .uni-popup__wrapper-box{
	    border-radius: 5px;
	}

	.uni-dialog-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 15px;
		padding-bottom: 5px;
	}

	.uni-dialog-title-text {
		font-size: 16px;
		font-weight: 500;
	}

	.uni-dialog-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 5px 15px 15px 15px;
	}

	.uni-popup__success {
		color: #4cd964;
	}
</style>
