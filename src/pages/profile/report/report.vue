<template>
	<view class="page">
		<view>
			<view class="feedback-title">
						<text>举报原因</text>
					</view>
					<view class="feedback-body">
						<radio-group @change="handleFeedbackTypeChange">
							<view
								class="gender-item"
								v-for="(item, index) in feedbackType"
								:key="index" >
								<radio style="font-size: 2;"
									class="gender-item-radio"
									:color="themeColor.color"
									:value="item.value"
									:checked="item.value === sendDate.reportType"
								/>
								<text class="gender-item-text">{{ item.name }}</text>
							</view>
						</radio-group>
					</view>
					<view class="feedback-title">
						<text>举报描述</text>
						<!-- <text class="feedback-quick" @tap="chooseMsg"
							>快速键入 <text class="iconfont iconxia"></text
						></text> -->
					</view>
					<view class="feedback-body">
						<textarea
							placeholder="请详细描述您的问题和意见..."
							v-model="sendDate.reportDesc"
							class="feedback-textare"
						/>
					</view>
					<view class="feedback-title">
						<text>举报材料<text style="font-weight: normal;"> (选填,提供问题截图,总大小10M以下)</text></text>

					</view>
					<view class="feedback-body feedback-uploader rf-uploader">
						<view class="uni-uploader">
							<view class="uni-uploader-head">
								<view class="uni-uploader-title">点击预览图片</view>
								<view class="uni-uploader-info">{{ imageList.length }}/9</view>
							</view>
							<view class="uni-uploader-body">
								<view class="uni-uploader__files">
									<block v-for="(image, index) in imageList" :key="index">
										<view class="uni-uploader__file" style="position: relative;">
											<rf-image class="uni-uploader__img" :src="image"></rf-image>
											<view class="close-view" @tap="close(index)" :class="'bg-' + themeColor.name">x</view>
										</view>
									</block>
									<view class="uni-uploader__input-box" v-if="imageList.length < 9">
										<view class="uni-uploader__input" @tap="uploadImage"></view>
									</view>
								</view>
							</view>
						</view>
					</view>

			<!-- 		<view class="feedback-title">
						<text>QQ/邮箱/手机号</text>
					</view>
					<view class="feedback-body">
						<input
							class="feedback-input"
							v-model="sendDate.mobile"
							placeholder="(选填,方便我们联系您 )"
						/>
					</view> -->
		</view>
		<view class="button" style="align-items: center;">
			<button
				class="confirm-btn"
				:class="'bg-' + themeColor.name"
				:disabled="btnLoading"
				:loading="btnLoading"
				@tap="send"
			>
				提交
			</button>
		</view>


		<!-- <view class="feedback-title">
			<text>反馈结果可在设置 -> 意见反馈 -> 点击列表后查看！</text>
		</view> -->
	</view>
</template>

<script>
import { opinionCreate, uploadImage } from '@/api/userInfo';
import { addReportUrl } from '@/api/profile';
export default {
	data() {
		return {
			targetId: '2019111911234535884492',
			msgContents: [
				'界面显示错乱',
				'启动缓慢，卡出翔了',
				'UI无法直视，丑哭了',
				'偶发性崩溃'
			],
			stars: [1, 2, 3, 4, 5],
			imageList: [],
			feedbackType: [
				{
					value: '1',
					name: '内容不实'
				},
				{
					value: '2',
					name: '题文不符'
				},
				{
					value: '3',
					name: '低俗色情'
				},
				{
					value: '4',
					name: '广告软文'
				},
				{
					value: '5',
					name: '封面反感'
				},
				{
					value: '6',
					name: '抄袭作品'
				},
				{
					value: '7',
					name: '侵犯俏像权'
				},
				{
					value: '8',
					name: '涉嫌非法集资'
				},
				{
					value: '9',
					name: '侵犯隐私权'
				},
				{
					value: '10',
					name: '侵犯名誉/商誉'
				},
				{
					value: '11',
					name: '其他问题'
				}
			],
			sendDate: {
				targetId: '',//2019111911234535884492
				reportType: '1',
				reportPic: '',
				reportDesc: '',
				module: ''
			},
			btnLoading: false
		};
	},
	onLoad(e) {
		debugger
		if (e.targetId > 0) {
			this.sendDate.targetId = e.targetId;
		}
	},
	methods: {
		// 监听反馈类型事件
		handleFeedbackTypeChange(e) {
			this.sendDate.reportType = e.detail.value;
		},
		// 打开相册选图
		uploadImage() {
			const _this = this;
			uni.chooseImage({
				count: 9, // 最多一次可以选择的图片张数
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机
				success: function(res) {
					if (_this.imageList.length + res.tempFiles.length > 9) {
            _this.$mHelper.toast('不要贪心哦，最多只可上传9张照片');
            return;
					}
					_this.handleUploadFile(res.tempFilePaths);
				}
			});
		},
		// 依次上传图片
		handleUploadFile(data) {
			const _this = this;
			data.forEach(item => {
				_this.$http
					.upload(uploadImage, { filePath: item, name: 'file' })
					.then(r => {
						_this.imageList.push(r);
					});
			});
		},
		// 删除已选中图片
		close(e) {
			this.imageList.splice(e, 1);
		},
		// 快速输入
		chooseMsg() {
			uni.showActionSheet({
				itemList: this.msgContents,
				success: res => {
					this.sendDate.reportDesc = this.msgContents[res.tapIndex];
				}
			});
		},
		// 发送反馈
		async send() {
			this.btnLoading = true;
			this.sendDate.reportPic = JSON.stringify(this.imageList);
			await this.$http.get(`${addReportUrl}`, {
					...this.sendDate
				})
				.then((res) => {
						let router= this.$mRouter;
						this.$mHelper.toast("举报成功！");
						this.btnLoading = false;
						setTimeout(function() {
							router.back();
						}, 1000);
				})
				.catch((e) => {
					this.btnLoading = false;
				});
		}
	}
};
</script>

<style lang="scss">
page {
	height: 100%;
	background-color: $page-color-base;
	//background-color:#ffffff
}
/*问题反馈*/
.feedback-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: $spacing-base;
	margin-top: $spacing-base;
	font-size: $font-base;
	font-weight:bold;
}

.feedback-star-view.feedback-title {
	justify-content: flex-start;
	margin: 0;
}

.feedback-quick {
	position: relative;
	padding-right: 40upx;
	.iconfont {
		font-size: $font-sm;
	}
}

.feedback-body {
	background: $color-white;
	padding: $spacing-sm $spacing-base;
	.gender-item {
		margin: 2upx 31upx;
		display:inline-block;
		//width: 300upx;
		.gender-item-text {
			padding-left: 10upx;
		}
		.gender-item-radio{
			transform:scale(0.8);
		}
		radio .wx-radio-input.wx-radio-input-checked {
			background: $uni-color-primary;
			border-color: $uni-color-primary;
		}
	}
}

.feedback-textare {
	height: 200upx;
	font-size: 34upx;
	line-height: 50upx;
	width: 100%;
	box-sizing: border-box;
	padding: 20upx 30upx 0;
}

.feedback-input {
	font-size: 28upx;
	height: 72upx;
	min-height: 50upx;
	padding: 15upx 20upx;
	line-height: 72upx;
}

.feedback-uploader {
	padding: 22upx 20upx;
}
.button{
	align-items: center;
	display:flex;
	justify-content:center;
}
</style>
