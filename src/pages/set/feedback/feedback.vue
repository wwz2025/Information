<template>
	<view class="page">
		<view class="feedback-body">
			<radio-group @change="handleFeedbackTypeChange">
				<label
					class="gender-item"
					v-for="(item, index) in feedbackType"
					:key="index"
				>
					<radio
						class="gender-item-radio"
						:color="themeColor.color"
						:value="item.value"
						:checked="item.value === sendDate.type"
					/>
					<text class="gender-item-text">{{ item.name }}</text>
				</label>
			</radio-group>
		</view>

		<view class="feedback-title">
			<text>意见内容</text>
			<text class="feedback-quick" @tap="chooseMsg"
				>快速键入 <text class="iconfont iconxia"></text
			></text>
		</view>
		<view class="feedback-body">
			<textarea
				placeholder="请详细描述..."
				v-model="sendDate.complaintsDesc"
				class="feedback-textare"
			/>
		</view>
		<view class="feedback-body feedback-uploader rf-uploader" >
			<view class="uni-uploader">
				<view class="uni-uploader-head" style="padding:5upx 20upx;">
					<view class="uni-uploader-title" style="color: #999999;font-size: 16px;background-color: white;line-height: 72upx;height: 72upx;">上传图片(选填,5M以下)</view>
					<view class="uni-uploader-info" style="color: #999999;font-size: 16px; ">{{ imageList.length }}/6</view>
				</view>
			</view>
				<!-- <text class="u-demo-block__title">文件预览</text> -->
				<view class="u-demo-block__content" style="display: flex;flex-direction: row;flex-wrap: wrap;">
					<view class="u-page__upload-item" style="display: flex;flex-direction: row;flex-wrap: wrap;">
					<u-upload style="padding:4upx 22upx;"
					    :fileList="fileList3"
					    @afterRead="afterRead"
					    @delete="deletePic"
					    name="3"
					    multiple
							:sizeType="sizeType"
					    :maxCount="6"
							:maxSize=5242880
					    :previewFullImage="true"
					>
					<view style="bottom: 0px; margin: 20upx 10upx;background-color: #eeeeee;width: 150upx; height: 120upx;border-radius: 10upx;">
							 <view style="text-align: center;height: 70upx;">
								 <image src="/static/upload-image.png" style="margin-top:5upx;width: 80upx; height: 80upx;" mode="scaleToFill"></image></view>
							 <view style="color: #999999;text-align: center;padding-bottom: 10upx;">照片/拍摄</view>
					</view>

					</u-upload>
					</view>
				</view>
			</view>
<!-- 		<view class="feedback-title">
			<text>图片(选填,提供问题截图,总大小10M以下)</text>
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
		</view> -->

		<button
			class="confirm-btn"
			:class="'bg-' + themeColor.name"
			:disabled="btnLoading"
			:loading="btnLoading"
			@tap="send"
		>
			保存
		</button>

	</view>
</template>

<script>
import { opinionCreate, uploadImage } from '@/api/userInfo';
export default {
	data() {
		return {
			msgContents: [
				'界面显示错乱',
				'启动缓慢，卡出翔了',
				'UI无法直视，丑哭了',
				'偶发性崩溃'
			],
			stars: [1, 2, 3, 4, 5],
			fileList3: [],
			sizeType: ['compressed'],
			imageList: [],
			feedbackType: [
				{
					value: '1',
					name: '功能建议'
				},
				{
					value: '2',
					name: 'BUG反馈'
				},
				{
					value: '3',
					name: '业务咨询'
				}
			],
			sendDate: {
				type: '1',
				pics: '',
				complaintsDesc: '',
				mobile: ''
			},
			btnLoading: false
		};
	},
	methods: {
		// 监听反馈类型事件
		handleFeedbackTypeChange(e) {
			this.sendDate.type = e.detail.value;
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
		// 新增图片
		async afterRead(event) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式

			let lists = [].concat(event.file)
			let fileListLen = this[`fileList${event.name}`].length
			lists.map((item) => {
				this[`fileList${event.name}`].push({
					...item,
					status: 'uploading',
					message: '上传中'
				})
			})
			for (let i = 0; i < lists.length; i++) {
						const result = await this.uploadFilePromise(lists[i].thumb)
						let item = this[`fileList${event.name}`][fileListLen];
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							// url: result
							url: this.fileUrl+result
						}))
						fileListLen++
			}
		},
		uploadFilePromise(url) {
			let _this=this;
			return new Promise((resolve, reject) => {
				_this.$http
					.upload(uploadImage, { filePath: url, name: 'file' })
					.then(r => {
								setTimeout(() => {
									resolve(r)
								}, 1000)
						_this.imageList.push(r);
					});
			})
		},
		// uView删除图片
		deletePic(event) {
			this[`fileList${event.name}`].splice(event.index, 1)
			this.imageList.splice(event.index, 1);
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
					this.sendDate.complaintsDesc = this.msgContents[res.tapIndex];
				}
			});
		},
		// 发送反馈
		async send() {
			this.btnLoading = true;
			this.sendDate.pics = JSON.stringify(this.imageList);
			// var coverImageUrl=[];
			// for(var i=0;i<this.imageList.length;i++)
			// {
			// 		coverImageUrl.push(this.imageList[i].path);
			// }

			// this.sendDate.coverImage=coverImageUrl.join(";");
			await this.$http
				.post(`${opinionCreate}`, {
					...this.sendDate
				})
				.then(() => {
					this.btnLoading = false;
					// this.$mRouter.back();
					this.$mHelper.toast('恭喜您, 保存成功!');
					setTimeout(() => {
						this.$mRouter.back();
					}, 1 * 1000);
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
	background-color: $page-color-base;
}
/*问题反馈*/
.feedback-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: $spacing-base;
	margin-top: 5px;
	font-size: $font-base;
	background-color: $color-white;
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
	margin-top: 5px;
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
</style>
