<template>
    <view>
        <view class="password-type-2" v-if="styleLoginType === 'two'">
            <!--顶部返回按钮-->
            <!-- <text class="back-btn iconfont iconzuo" @tap="navBack">
            </text> -->
		<!--顶部菜单-->
		<rf-top-bar :scrollTop="scrollTop" :title="title"></rf-top-bar>
            <view class="login-top" :class="'bg-' + themeColor.name">
                <image class="bg" :src="userBg" style="width: 100%;height: 100%;">
                </image>
                <view class="desc">
                    <view class="title">
                        Hi~
                    </view>
                    <text>
                        {{ type == 1 ? '修改密码' : '找回密码' }}！
                    </text>
                </view>
<!--                <image class="login-pic" :src="loginPic">
                </image>-->
            </view>
            <view class="login-type-content" style="border-radius: 7px;
												margin-left: 10px;
												margin-right: 10px;
												margin-top: -14px;
												background: rgb(255, 255, 255);
												border: rgb(242, 242, 242) 2px solid;
												box-shadow: darkgrey 5px 5px 20px 5px ;
												height:110vw;
												">
                <!-- <image class="login-bg" :src="loginBg"></image> -->
                <view class="main">
                    <view class="login-type-form">
                        <view class="input-item">
													<u-input class="login-type-input"
																	 prefixIcon="phone"
																	 :prefixIconStyle="'font-size: 32px;color:' +themeColor.color"
																	 type="number"
																	 name="mobile"
																	 v-model="resetPasswordParams.mobile"
																	 placeholder="请输入手机号码"
																	 maxlength="11"
																	 clearable
																	 border="bottom"
													>
													</u-input>
                        </view>
                        <view class="input-item input-item-sms-code">
													<u-input placeholder="请输入验证码"
																	 class="login-type-input"
																	 type="number"
																	 v-model="resetPasswordParams.code"
																	 maxlength="6"
																	 border="bottom"
																	 prefixIcon="order"
																	 :prefixIconStyle="'font-size: 32px;color:' +themeColor.color">
														<template slot="suffix">
															<u-code
																ref="uCode"
																@change="codeChange"
																seconds="20"
																changeText="X秒重新获取"
															></u-code>
															<u-button
																@tap="getSmsCode()"
																:text="tips"
																:color="themeColor.color"
																size="mini"
															></u-button>
														</template>
													</u-input>
                        </view>
                        <view class="input-item">
													<u-input class="login-type-input"
																	 prefixIcon="lock"
																	 :prefixIconStyle="'font-size: 32px;color:' +themeColor.color"
																	 type="password"
																	 v-model="resetPasswordParams.password"
																	 placeholder="请输入密码"
																	 maxlength="20"
																	 clearable
																	 border="bottom" >
													</u-input>
                        </view>
                        <view class="input-item">
													<u-input class="login-type-input"
																	 prefixIcon="lock"
																	 :prefixIconStyle="'font-size: 32px;color:' +themeColor.color"
																	 type="password"
																	 v-model="resetPasswordParams.password_repetition"
																	 placeholder="请输入确认密码"
																	 maxlength="20"
																	 clearable
																	 border="bottom" >
													</u-input>
                        </view>
                    </view>
                    <view class="login-type-tips">
                        <view @tap="navTo('/pages/public/login')" class="forget-section">
                            马上登陆
                        </view>
                        <text @tap="toHome">
                            返回主页
                        </text>
                    </view>
                    <button class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="btnLoading"
                    :loading="btnLoading" @tap="toUpdatePassword">
                        {{ type == 1 ? '确认修改' : '找回密码' }}
                    </button>
                </view>
            </view>
            <view class="login-type-bottom" :class="'text-' + themeColor.name">
                {{ appName }} 版权所有
            </view>
        </view>
    </view>
</template>

<script>
import { smsCode, updatePassword } from '@/api/login';
import moment from '@/utils/moment';
import rfTopBar from '@/components/rf-top-bar';
export default {
		components: {
		rfTopBar,
		},
	data() {
		return {
			tips: '',
			value: '',
			userBg: this.$mAssetsPath.userBg,
			resetPasswordParams: {
				mobile: '',
				password: '',
				password_repetition: '',
				code: ''
			},
			btnLoading: false,
			type: null,
			smsCodeBtnDisabled: true,
			loginBg: this.$mAssetsPath.loginBg,
			loginPic: this.$mAssetsPath.loginPic,
			appName: this.$mSettingConfig.appName,
			styleLoginType: this.$mSettingConfig.styleLoginType,
			reqBody: {},
			codeSeconds: 0 // 验证码发送时间间隔
		};
	},
	onLoad(options) {
		const time =
			moment().valueOf() / 1000 - uni.getStorageSync('pwdSmsCodeTime');
		if (time < 120) {
			this.codeSeconds =
				this.$mConstDataConfig.sendCodeTime - parseInt(time, 10);
			this.handleSmsCodeTime(this.codeSeconds);
		} else {
			this.codeSeconds = this.$mConstDataConfig.sendCodeTime;
			this.smsCodeBtnDisabled = false;
			uni.removeStorageSync('pwdSmsCodeTime');
		}
		this.type = options.type;
	},
	methods: {
		codeChange(text) {
			this.tips = text;
		},
		// 获取手机验证码
		async getSmsCode() {
			this.reqBody['mobile'] = this.resetPasswordParams['mobile'];
			let checkSendCode = this.$mGraceChecker.check(
				this.reqBody,
				this.$mFormRule.sendCodeRule
			);
			if (!checkSendCode) {

				this.$mHelper.toast(this.$mGraceChecker.error);
				return;
			}

			await this.$http
				.get(smsCode, {
					mobile: this.resetPasswordParams.mobile,
					usage: 'forgetpwd'
				})
				.then(r => {
					if (r.code==0) {
						this.$mHelper.toast(`验证码发送成功`);
					} else {
						this.$mHelper.toast('验证码发送失败');
						return;
					}
					this.smsCodeBtnDisabled = true;
					uni.setStorageSync('pwdSmsCodeTime', moment().valueOf() / 1000);
					this.handleSmsCodeTime(119);
				});
		},
		handleSmsCodeTime(time) {
			let timer = setInterval(() => {
				if (time === 0) {
					clearInterval(timer);
					this.smsCodeBtnDisabled = false;
				} else {
					this.codeSeconds = time;
					this.smsCodeBtnDisabled = true;
					time--;
				}
			}, 1000);
		},
		navBack() {
			this.$mRouter.back();
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		toHome() {
			this.$mRouter.reLaunch({ route: '/pages/index/index' });
		},
		// 更新密码
		async toUpdatePassword() {
			this.reqBody['mobile'] = this.resetPasswordParams['mobile'];
			this.reqBody['password'] = this.resetPasswordParams['password'];
			this.reqBody['code'] = this.resetPasswordParams['code'];
			this.reqBody['customerId'] = uni.getStorageSync('userInfo').id;
			const cheRes = this.$mGraceChecker.check(
				this.reqBody,
				this.$mFormRule.resetPasswordRule
			);
			if (!cheRes) {
				this.$mHelper.toast(this.$mGraceChecker.error);
				return;
			}
			if (
				this.resetPasswordParams['password'] !==
				this.resetPasswordParams['password_repetition']
			) {
				this.$mHelper.toast('两次输入的密码不一致');
				return;
			}
			this.reqBody['password_repetition'] = this.resetPasswordParams[
				'password_repetition'
			];
			this.reqBody.group = this.$mHelper.platformGroupFilter();
			await this.$http
				.post(updatePassword, this.reqBody)
				.then(r => {
				console.log(r)
				 // -1 参数错误  -2 验证码错误 -3 用户不匹配 0 失败 1 成功
				if(r==-1)
				{
					this.$mHelper.toast('参数错误');
					return false;
				}else if(r==-2)
				{
					this.$mHelper.toast('验证码错误');
					return false;
				}else if(r==-1)
				{
					this.$mHelper.toast('参数错误');
					return false;
				}else if(r==-3)
				{
					this.$mHelper.toast('用户不匹配');
					return false;
				}
					this.btnLoading = false;
					this.$mStore.commit('logout');
					this.$mHelper.toast('密码重置成功');
					uni.setStorageSync('loginMobile', this.reqBody['mobile']);
					uni.setStorageSync('loginPassword', this.reqBody['password']);

					setTimeout(() => {
					this.$mRouter.push({ route: '/pages/public/login' });
								}, 1000);
				})
				.catch(() => {
					this.btnLoading = false;
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background: $color-white;
}
.container {
	padding-top: 60px;
	position: relative;
	width: 100vw;
	overflow: hidden;
	.wrapper {
		position: relative;
		width: 100vw;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;

		.welcome {
			position: relative;
			left: 50upx;
			top: -90upx;
			font-size: 46upx;
			color: #555;
			text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
		}

		.input-content {
			padding: 0 60upx;
		}

		.input-item {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			padding: 0 30upx;
			background: $page-color-light;
			height: 120upx;
			border-radius: 4px;
			margin-bottom: 50upx;

			&:last-child {
				margin-bottom: 0;
			}

			.tit {
				height: 50upx;
				line-height: 56upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
			}

			input {
				height: 60upx;
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				width: 100%;
			}
		}

		.input-item-sms-code {
			position: relative;

			.sms-code-btn {
				position: absolute;
				right: 20upx;
				color: #111;
				bottom: 20upx;
				font-size: 28upx;
			}

			.sms-code-resend {
				color: #999;
			}
		}

		.forget-section {
			font-size: $font-sm + 2upx;
			color: $font-color-spec;
			text-align: center;
			margin-top: 40upx;
		}
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: '';
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.register-section {
		margin: 50upx 0 50upx 0;
		width: 100%;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
			margin-right: 10upx;
		}
	}
}
.password-type-2 {
	width: 100%;
	position: relative;
	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 0upx;
		font-size: 48upx;
		color: $color-white;
	}
	.login-top {
		height: 460upx;
		position: relative;
		.desc {
			position: absolute;
			top: 200upx;
			left: 40upx;
			font-size: 48upx;
			.title {
				font-size: 48upx;
			}
		}
		.login-pic {
			position: absolute;
			width: 220upx;
			height: 270upx;
			right: 30upx;
			top: 100upx;
		}
	}
	.login-type-content {
		position: relative;
		top: -72upx;
		.login-bg {
			width: 94vw;
			height: 114vw;
			margin: 0 3vw;
		}
		.main {
			width: 94vw;
			position: absolute;
			top: 0;
			left: 0vw;
			.nav-bar {
				display: flex;
				height: 100upx;
				justify-content: center;
				align-items: center;
				position: relative;
				z-index: 10;
				.nav-bar-item {
					flex: 1;
					display: flex;
					height: 100%;
					line-height: 96upx;
					font-size: $font-lg;
					display: flex;
					margin: 0 120upx;
					justify-content: center;
				}
				.nav-bar-item-active {
					border-bottom: 5upx solid;
				}
			}
			.login-type-form {
				width: 80%;
				margin: 50upx auto;
				.input-item {
					position: relative;
					height: 90upx;
					line-height: 90upx;
					margin-bottom: $spacing-lg;
					.iconfont {
						font-size: 50upx;
						position: absolute;
						left: 0;
					}
					.login-type-input {
						height: 90upx;
						padding-left: 80upx;
						border-bottom: 1upx solid rgba(0, 0, 0, .1);
					}
					.sms-code-btn, sms-code-resend {
						width: 300upx;
						font-size: $font-base - 2upx;
					}
				}
			}
			.login-type-tips {
				padding: 0 50upx;
				display: flex;
				justify-content: space-between;
			}
			.confirm-btn {
				height: 80upx;
				line-height: 80upx;
			}
		}
	}
	.login-type-bottom {
		width: 100%;
		padding-bottom: 30upx;
		text-align: center;
		font-size: $font-lg;
	}
}
</style>
