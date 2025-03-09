<template>
	<view class="login-type">
		<!--顶部菜单-->
		<rf-top-bar :scrollTop="scrollTop" :title="title"></rf-top-bar>
		<!--顶部背景图片-->

		<view class="top-pic" >
			<view class="top" :class="'bg-' + themeColor.name">
				<image class="bg" :src="userBg" style="width: 100%;height: 100%;"></image>
				<!--				<image class="bg" src="/static/calculator.png" style="width: 130px;height: 81px;position: absolute;
								top:160px;right: 0px;"></image>-->
				<view class="desc" style="top: 90px;padding: 10px;">
					<view class="title" style="font-size: 78rpx;text-align: center;">{{appName}}</view>
					<!--					<view class="title" style="font-size: 48rpx;text-align: left;">1键发布论坛信息</view>-->
				</view>
			</view>
		</view>

<!--		<view class="u-content">
			<u&#45;&#45;text  :text="appName"  :color="themeColor.color" align="center"
				style="display: flex;justify-content: center;align-items: center;height: 100vh;width: 100%;flex-direction: column;" size="78rpx">
			</u&#45;&#45;text>
		</view>-->

		<view style="padding-top: 60px;
								padding-bottom: 40px;
								position: relative;
								top: -37px;
								border-radius: 7px;
								margin-left: 10px;
								margin-right: 10px;
								margin-top: -14px;
								background: rgb(255, 255, 255);
								border: rgb(242, 242, 242) 2px solid;
								box-shadow: darkgrey 5px 5px 20px 5px;">
<!--			<button class="confirm-btn confirm-btn-bg" :disabled="btnLoading" :class="'text-' + themeColor.name"  @tap="wxLogin()">
				微信一键登录
			</button>-->
			<button class="confirm-btn confirm-btn-bg" :disabled="btnLoading" :loading="btnLoading" :class="'text-' + themeColor.name"  open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				本机一键登录
			</button>
			<button class="confirm-btn confirm-btn-bg" :disabled="btnLoading" :class="'text-' + themeColor.name" @tap="navTo('/pages/public/login')">
				手机或账号登录/注册
			</button>
			<!-- 底部协议 -->
			<view class="u-demo-block__content">
				<view class="u-page__text-item">
					<u-checkbox-group placement="row">
						<u-checkbox
							customStyle="marginBottom: '8px'"
							v-model="hobbies[0]"
							:checked="false"
							label="已阅读并同意"
							name="已阅读并同意"
							@change="notAgreeProtocol()"
							:activeColor="themeColor.color"
						>
						</u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="u-page__text-item" style="margin-right: -20px;">
					<u--text
						text="《注册协议》"
						:color="themeColor.color"
						@click="handleRfProtocolPopupShow()"
					>
						<!--					<navigator url="/pages/set/about/detail?field=protocol_register&title=注册协议" class="path" hover-class="navigator-hover" >
											《注册协议》</navigator>-->
					</u--text>
				</view>
				<view class="u-page__text-item">
					<u--text
						text="《隐私协议》"
						:color="themeColor.color"
						@click="handleRfProtocolPopupShow()"
					>
						<!--					<navigator url="/pages/set/about/detail?field=protocol_privacy&title=隐私协议" class="path" hover-class="navigator-hover" >
												《隐私协议》</navigator >-->
					</u--text>
				</view>

			</view>

		</view>

		<!--	<view class="footer-protocol">

				<text :class="'text-' + themeColor.name" @tap="handleRfProtocolPopupShow">
					<navigator url="/pages/set/about/detail?field=protocol_register&title=注册协议" class="path" hover-class="navigator-hover" >
					《注册协议》</navigator>
				</text>
				<text :class="'text-' + themeColor.name" @tap="handleRfProtocolPopupShow">
					<navigator url="/pages/set/about/detail?field=protocol_privacy&title=隐私协议" class="path" hover-class="navigator-hover" >
						《隐私协议》</navigator >
				</text>
		</view>-->
	</view>
</template>
<script>
	/**
	 * @des 登录类型
	 * @author taidao
	 * @date 2020-01-13 12:02
	 */
	import {getOpenId, getWxAppPhone,mpWechatLogin, wechatH5Login, thirdPartyWechatOpenPlatform, thirdPartyApple } from '@/api/login';
	import rfTopBar from '@/components/rf-top-bar';
	export default {
		components: {
		rfTopBar,
		},
		data() {
			return {
			title: "详细情况",
			userBg: this.$mAssetsPath.userBg,
				show6:true,
				hobbies: [0],
				hobby2: [{text: '',value:1,selected:true}],
				btnLoading: false,
				isRfProtocolPopupShow: false, // 控制协议popup显示
				appAgreementDefaultSelect: false, // 是否允许点击登录按钮
				isAuthLoginShow: true,
				isIosAuthLoginShow: true,
				logo: this.$mSettingConfig.appLogo,
				appName: this.$mSettingConfig.appName,
				promoCodeParams: {},
				styleLoginType: this.$mSettingConfig.styleLoginType,
				wechat: this.$mAssetsPath.wechat,
				apple: this.$mAssetsPath.apple,
				closeThirdPartyLogin: this.$mSettingConfig.closeThirdPartyLogin,
			scrollTop: 0,//是否返回页面顶部
				loginTypeList: [
					{ text: '微信', icon: 'iconweixin' }
				]
			};
		},
		onShow() {
			this.btnLoading = false;
			if (uni.getStorageSync('accessToken')) {
				this.$mRouter.reLaunch({ route: '/pages/index/index' });
			}
		},
		onLoad(options) {

			/*  #ifdef H5  */
			if (this.$mPayment.isWechat()) {
				this.isAuthLoginShow = true;
			}
			/*  #endif  */

			/*  #ifndef H5 */
			this.isAuthLoginShow = true;
			/*  #endif  */

			/*  #ifdef APP-PLUS */
			// console.log(uni.getSystemInfoSync().system > 13);
			if (uni.getSystemInfoSync().platform === 'ios') {
				this.isIosAuthLoginShow = true;
			}
			/*  #endif  */

			// 用户多次点击授权登录会生成多个code 去最后一个code
			this.code = options.code && options.code.split(',')[options.code.split(',').length - 1];
			// 如果不是第一次进来 就不需要强制阅读协议
			if (!uni.getStorageSync('notFirstTimeLogin')) {
				if (!this.appAgreementDefaultSelect) {
					// this.appAgreementDefaultSelect = false;
					this.hobby2[0].selected=false;
				}
			} else {
				// this.appAgreementDefaultSelect = true;
				this.hobby2[0].selected=true;
			}

			const backUrl = uni.getStorageSync('backToPage');
			if (backUrl.indexOf('promo_code') !== -1) {
				this.promoCodeParams.promo_code = JSON.parse(backUrl)['query']['promo_code'];
			}

			const _this = this;
			if (this.code) {
				this.btnLoading = true;
				this.$http
					.get(wechatH5Login, {
						code: this.code,
						..._this.promoCodeParams
					})
					.then(async r => {
						this.btnLoading = false;
						if (!r.login) {
							this.user_info = r.user_info.original;
							uni.showModal({
								content: '您尚未绑定账号，是否跳转登录页面？',
								success: confirmRes => {
									if (confirmRes.confirm) {
										uni.setStorageSync(
											'wechatUserInfo',
											JSON.stringify(_this.user_info)
										);
										_this.$mRouter.push({ route: '/pages/public/login' });
									} else {
										this.btnLoading = false;
									}
								}
							});
						} else {
							await this.$mStore.commit('login', r.user_info);
							const backToPage = uni.getStorageSync('backToPage');
							if (backToPage) {
								if (
									backToPage.indexOf('/pages/profile/profile') !== -1 ||
									// backToPage.indexOf('/pages/cart/cart') !== -1 ||
									backToPage.indexOf('/pages/index/index') !== -1 ||
									// backToPage.indexOf('/pages/notify/notify') !== -1 ||
									// backToPage.indexOf('/pages/category/category') !== -1||
									backToPage.indexOf('/pages/index/msg') !== -1||
									backToPage.indexOf('/pages/index/favourite') !== -1
								) {

									// this.$mRouter.reLaunch(JSON.parse(backToPage));
									this.$mRouter.reLaunch({ route: backToPage });
								} else {
									this.$mRouter.redirectTo(JSON.parse(backToPage));
								}
								uni.removeStorageSync('backToPage');
								uni.removeStorageSync('wechatUserInfo');
							} else {
								this.$mRouter.reLaunch({ route: '/pages/profile/profile' });
							}
						}
					}).catch(() => {
					this.btnLoading = false;
				});
			}
		},
		methods: {
			// 通用跳转
			navTo(route) {
				this.hobbies[0]=true;//点击的时候默认登录，不用选择
				if (this.hobbies[0]) {
					this.appAgreementDefaultSelect = true;
					this.hobby2[0].selected=true;
					uni.setStorageSync('notFirstTimeLogin', true);
					// this.isRfProtocolPopupShow = false;
				} else {
					this.appAgreementDefaultSelect = false;
					this.hobby2[0].selected=false;
					// this.isRfProtocolPopupShow = false;
				}

				if (!this.appAgreementDefaultSelect) {
					this.$mHelper.toast('请勾选并阅读协议，才能进行下一步哦', 1.5 * 1000);
					return;
				}
				this.$mRouter.redirectTo({ route });
				// this.$mRouter.navTo({ route });
			},
			// 显示协议popup
			handleRfProtocolPopupShow() {
				this.hobbies[0]="";
				this.isRfProtocolPopupShow = true;
					this.hobby2[0].selected=false;
			},
			// 不同意协议
			notAgreeProtocol(e) {
				this.hobbies[0]=this.hobbies[0]==1?"":1;
			},
			// 监听是否同意协议
			popupState(e) {
				if (e) {
					this.appAgreementDefaultSelect = true;
					this.hobby2[0].selected=true;
					uni.setStorageSync('notFirstTimeLogin', true);
					this.isRfProtocolPopupShow = false;
				} else {
					this.appAgreementDefaultSelect = false;
					this.hobby2[0].selected=false;
					this.isRfProtocolPopupShow = false;
				}
			},
			getPhoneNumber: function (e) {
					// 参数e是绑定的授权方法自动传入过来的, 主要是为了拿到vi和encryptedData值从后台换取用户联系方式
					if ("getPhoneNumber:ok" != e.detail.errMsg){
							uni.showToast({
								icon:'none',
								title: '快捷登陆失败'
							});
							return;
					}
					var iv = e.detail.iv;
					var encryptedData = e.detail.encryptedData;
					var _this = this;

					let authApi;
					uni.login({
						provider: 'weixin',
						success: async (res) => {
							this.code = res.code;
							if (res.errMsg == 'login:ok') {
									_this.$mHelper.log(res);
									let params = _this.promoCodeParams;
									params = { ...res, ...params };
									params.code = res.code;
									params.iv = iv;
									params.encrypted = encryptedData;
									// authApi = mpWechatLogin;
									// authApi = getOpenId;
									authApi = getWxAppPhone;
									_this.$mHelper.log(params);
									_this.wxAuthLogin(authApi, params);
							}
						}
					});
			},
			wxAuthLogin(authApi, params = {}) {

				this.btnLoading = true;

				const _this = this;
				_this.$http
					.post(authApi, params)
					.then(async r => {
						this.btnLoading = false;
						_this.$mHelper.log(r);

						this.$mHelper.toast('您好，欢迎登录！');
						this.$mStore.commit('login', r);

						uni.removeStorageSync('wechatUserInfo');
						const backToPage = uni.getStorageSync('backToPage');
						uni.removeStorageSync('backToPage');

						if (backToPage) {
							if (
								backToPage.indexOf('/pages/profile/profile') !== -1 ||
								backToPage.indexOf('/pages/cart/cart') !== -1 ||
								backToPage.indexOf('/pages/index/index') !== -1 ||
								backToPage.indexOf('/pages/notify/notify') !== -1 ||
								backToPage.indexOf('/pages/category/category') !== -1||
								backToPage.indexOf('/pages/public/password') !== -1||
								backToPage.indexOf('/pages/index/msg') !== -1||
								backToPage.indexOf('/pages/index/favourite') !== -1
								// ||
								// backToPage.indexOf('/pages/question/add') !== -1
							) {
								// this.$mRouter.reLaunch(JSON.parse(backToPage));
								this.$mRouter.reLaunch({ route: backToPage });
							} else if(backToPage.indexOf('/pages/question/add') !== -1||
								backToPage.indexOf('/components/hb-comment/add-comment') !== -1	)
							{
								uni.navigateTo({
									url:backToPage
								})
								// this.$mRouter.push(JSON.parse(backToPage));
							}
							else {
								this.$mRouter.redirectTo(JSON.parse(backToPage));
							}
						} else {
							this.$mRouter.reLaunch({ route: '/pages/profile/profile' });
						}
					})
			},

			}
	};
</script>

<style lang="scss">
.top-pic {
	width: 100%;
	position: relative;
	.top {
		height: 460upx;
		position: relative;
		.desc {
			width: 100%;
			position: absolute;
			top: 200upx;
			// left: 40upx;
			font-size: 48upx;
			.title {
				width: 100%;
				font-size: 48upx;
			}
		}
	}
}

.u-page__text-item {
	/**/margin-right: 10px;
	flex: 1;
}

.u-demo-block__content {
	@include flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	width: 84%;
	margin: 0 8% 26px;
}

.line {
	display: block;

	.path {
		color: #007aff;
		display: inline-block;
		text-align: center;
	}
}

page {
	background: #fff;
	height: calc(100% - 88upx);
}

.login-type {
/*	padding-top: 80upx;*/
	.u-content {
		/* 使用Flexbox布局 */
		display: flex;
		/* 水平和垂直居中 */
		justify-content: center;
		align-items: center;
		/* 确保容器占据全部视口高度和宽度，根据实际需求调整 */
		height: 20vh;
		width: 100%;
	}
	.confirm-btn {
		width: 84%;
		margin: 0 7% 50upx;
		height: 84upx;
		line-height: 84upx;
		font-size: $font-lg;
		border: 1upx solid;
	}
	.confirm-btn-bg {
		background: none;
	}
	.footer {
		width: 100%;
		text-align: center;
		position: fixed;
		bottom: 40upx;
		font-size: $font-sm + 2upx;
		.protocol {
			color: $base-color;
			margin: 0 10upx;
		}
		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			margin-bottom: $spacing-base;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			position: relative;
			text {
				padding: 0 $spacing-lg;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
		.login-type-list {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.login-type-btn {
				border: none;
				background: none;
				padding: 0 40upx 0 0;
				margin: 0;
				.image {
					width: 64upx;
					height: 64upx;
				}
				&:after {
					border: none;
				}
			}
			.iconfont {
				font-size: 50upx;
				color: $font-color-base;
			}
		}
	}
}

/deep/ .checklist-box  {
    margin-right: 0px;
}



</style>
