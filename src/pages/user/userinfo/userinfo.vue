<template>
	<view class="userinfo">
		<!--头像 + 背景-->
		<view class="user-section" :class="'bg-' + themeColor.name">
			<image class="bg" :src="userBg"></image>
			<u-avatar size="100" :src="fileUrl+profileInfo.avatar || headImg" shape="circle"  @click="uploadImage" ></u-avatar>
		</view>
		<view class="input-content">
			<view class="input-item">
				<text class="tit">手机号</text>
				<input type="number" v-model="profileInfo.phonenumber" disabled placeholder="请输入手机号码" />
			</view>

			<view class="input-item">
				<text class="tit">昵　称</text>
				<input type="text" v-model="profileInfo.userName" placeholder="请输入您的姓名" />
			</view>

			<view class="input-item">
				<text class="tit">性　别</text>
				<radio-group @change="handleGenderChange">
					<label class="gender-item" v-for="(item, index) in genders" :key="index" >
					<radio class="gender-item-radio" :color="themeColor.color" :value="item.value" :checked="item.value === profileInfo.sex"/>
					<text class="gender-item-text">{{ item.name }}</text>
					</label>
				</radio-group>
			</view>
			<!-- <view class="input-item">
				<text class="tit">密码</text>
				<input
					type="number"
					v-model="profileInfo.paypassword"
					placeholder="请输入您的预存款支付密码"
				/>
			</view> -->
			<view class="input-item">
				<text class="tit">邮　箱</text>
				<input v-model="profileInfo.email" placeholder="请输入您的邮箱" />
			</view>
			<button class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="btnLoading" :loading="btnLoading" @tap="toUpdateInfo" > 确认修改 </button>
		</view>
		<!--加载动画-->
		<!--进度条加载-->
	</view>
</template>

<script>
/**
 * @des 修改用户信息
 *
 * @author taidao
 *
 * @copyright 2019
 */
import { memberInfo, memberUpdate, uploadImage } from '@/api/userInfo';
import moment from '@/utils/moment';

export default {
	data() {
		return {
			fileUrl:this.$mConfig.fileUrl,
			loadProgress: 0,
			CustomBar: this.CustomBar,
			profileInfo: {},
			genders: [
				// {
				// 	value: '0',
				// 	name: '未知'
				// },
				{
					value: '1',
					name: '男'
				},
				{
					value: '2',
					name: '女'
				}
			],
			birthday: moment().format('YYYY-MM-DD HH:mm:ss'),
			token: null,
			loading: true,
			headImg: this.$mAssetsPath.headImg,
			userBg: this.$mAssetsPath.userBg,
			btnLoading: false
		};
	},
	onLoad() {
		this.initData();
	},
	methods: {
		// 上传头像
		uploadImage() {
			// 从相册选择图片
			const _this = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album'],
				success: function(res) {
					_this.handleUploadFile(res.tempFilePaths);
				}
			});
		},
		// 上传头像
		handleUploadFile(data) {
			const _this = this;
			const filePath = data.path || data[0];
			_this.$http
				.upload(uploadImage, {
					filePath,
					name: 'file'
				})
				.then(r => {
					_this.profileInfo.avatar = r.path;
					_this.handleUpdateInfo(_this.profileInfo);
				});
		},
		// 监听日期更改
		bindDateChange(e) {
			this.birthday = e.target.value;
			this.profileInfo.birthday=this.birthday+" 00:00:00"
		},
		// 监听性别更改
		handleGenderChange(e) {
			this.profileInfo.sex = e.detail.value;
		},
		// 数据初始化
		initData() {
			this.token = uni.getStorageSync('accessToken') || undefined;
			this.getMemberInfo();
		},
		// 获取用户信息
		async getMemberInfo() {
			await this.$http
				.get(memberInfo)
				.then(r => {
					this.loading = false;
					this.profileInfo = r;
					this.birthday = this.profileInfo.birthday;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 更新用户信息
		async toUpdateInfo() {
			this.handleUpdateInfo();
		},
		// 更新用户信息
		async handleUpdateInfo() {
			this.btnLoading = true;
			this.loadProgress = this.loadProgress + 6;
			const timer = setInterval(() => {
				this.loadProgress = this.loadProgress + 6;
			}, 50);
			await this.$http
				.post(`${memberUpdate}`, {
					...this.profileInfo,
					birthday: this.birthday+" 00:00:00"
				})
				.then(() => {
					clearInterval(timer);
					this.loadProgress = 0;
					this.$mHelper.toast('恭喜您, 资料修改成功!');
					setTimeout(() => {
						this.$mRouter.back();
					}, 1 * 1000);
				})
				.catch(() => {
					this.btnLoading = false;
				});
			},
		//时间格式化函数，此处仅针对yyyy-MM-dd hh:mm:ss 的格式进行格式化
		dateFormat(time) {
				var date=new Date(time);
				var year=date.getFullYear();
				/* 在日期格式中，月份是从0开始的，因此要加0
				 * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
				 * */
				var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
				var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
				var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
				var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
				var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
				// 拼接
				return year+"-"+month+"-"+day;
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: $color-white;
}

.userinfo {
	.user-section {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 320upx;
		padding: 40upx 30upx 0;
		overflow: hidden;
		position: relative;
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			opacity: 0.84;
		}

		.portrait-box {
			clear: both;
			z-index: 2;
		}

		.portrait {
			position: relative;
			width: 200upx;
			height: 200upx;
			border-radius: 50%;
			border: 6upx solid #fff;
		}

		.yticon {
			position: absolute;
			line-height: 1;
			z-index: 5;
			font-size: 48upx;
			color: #fff;
			padding: 4upx 6upx;
			border-radius: 6upx;
			background: rgba(0, 0, 0, 0.4);
		}

		.pt-upload-btn {
			right: 0;
			bottom: 10upx;
		}

		.bg-upload-btn {
			right: 20upx;
			bottom: 16upx;
		}
	}

	.input-content {
		padding: 40upx 60upx;

		.input-item {
			display: flex;
			padding: 0 30upx;
			background: $page-color-light;
			height: 80upx;
			line-height: 80upx;
			border-radius: 4px;
			margin-bottom: 30upx;

			&:last-child {
				margin-bottom: 0;
			}

			.tit {
				width: 100upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
			}

			input {
				width: calc(100% - 100upx);
				height: 80upx;
				line-height: 80upx;
				font-size: $font-base + 2upx;
				color: $font-color-dark;
			}

			.date {
				height: 80upx;
				line-height: 80upx;
				font-size: $font-base + 2upx;
				color: $font-color-dark;
			}

			.gender-item {
				margin-right: 20upx;

				.gender-item-text {
					padding-left: 10upx;
				}

				radio .wx-radio-input.wx-radio-input-checked {
					background: $uni-color-primary;
					border-color: $uni-color-primary;
				}
			}
		}
	}
}
</style>
