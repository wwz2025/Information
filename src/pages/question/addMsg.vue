<template>
	<view class="page">
		<!-- 信息提示弹框-->
		<uni-popup ref="share" background-color="#fff" type="center" >
			<view class="uni-popup-share" style="border-radius: 5px;">
				<view class="uni-dialog-title"><text class="uni-share-title-text uni-popup__success"  style="font-size: 22px;">提示</text></view>
				<view class="uni-dialog-title"><text class="uni-share-title-text" style="font-size: 20px;font-family: YouYuan;">恭喜您，提问成功</text></view>
						<view class="uni-dialog-content">
							 <text class="uni-share-text" style="text-align: center;font-size: 17px;font-family: LISU;">您的问题已收到，请稍安勿躁~<br>工程师/客服正在马不停蹄赶来!</text>
						</view>
						<view class="u-page__button-item" style="display: flex;flex-direction: row;justify-content: center;">
							<view style="width:200upx">
								<u-button
										text="关闭"
										size="normal"
										plain
										shape="circle"
										type="success"
										@click="goBack()"
								></u-button>
							</view>
						</view>
			</view>
		</uni-popup>

		<view class="feedback-body"  v-if="!sendDate.questionContent">
			<input
				class="feedback-input"
				v-model="sendDate.toName"
				placeholder="请输入标题(5~30个字)"
				disabled
				style="background-color: white;line-height: 96upx;height: 96upx;"
			/>
		</view>

		<block v-if="sendDate.questionContent">
			<view class="feedback-title" style="overflow:auto;">
				<text>{{ sendDate.fromName }} -- {{ sendDate.timeDesc }}</text>
			</view>
			<view class="feedback-body" style="height: 220px;overflow:auto;">
				<u-parse lazy-load :content="sendDate.questionContent"></u-parse>
			</view>
		</block>

		<view  v-if="sendDate.type=='private'" class='toolbar' @tap="format" style="height: 32px;overflow-y: auto;background-color:#FFFFFF;margin-top: 5px;height: 42px;">
			<view class="iconfont icon-undo" @tap="undo"></view>
			<view class="iconfont icon-redo" @tap="redo"></view>
			<view class="iconfont icon-shanchu" @tap="clear"></view>
			<view class="iconfont icon-charutupian" @tap="insertImage" style="float: right;margin-right: 20px;"></view>
		</view>

		<view  v-if="sendDate.type=='private'" class="editor-wrapper" style="margin-top: 5px;overflow:auto;">
			<editor	v-model="sendDate.content" id="editor" class="ql-container"  style="margin-top:5px;" placeholder="问题描述" showImgSize showImgToolbar showImgResize
			 @statuschange="onStatusChange" :read-only="readOnly" @ready="onEditorReady">
			</editor>
		</view>

		<view class="feedback-body feedback-uploader rf-uploader" style="display: none;">
			<view class="uni-uploader">
				<view class="uni-uploader-head" style="padding:5upx 20upx;">
					<view class="uni-uploader-title" style="color: #999999;font-size: 16px;background-color: white;line-height: 72upx;height: 72upx;">上传图片(选填,5M以下)</view>
					<view class="uni-uploader-info" style="color: #999999;font-size: 16px; ">{{ imageList.length }}/6</view>
				</view>
			</view>
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

					<view  style="bottom: 0px; margin: 20upx 10upx;background-color: #eeeeee;width: 150upx; height: 120upx;border-radius: 10upx;">
						 <view style="text-align: center;height: 70upx;">
							 <image src="/static/upload-image.png" style="margin-top:5upx;width: 80upx; height: 80upx;" mode="scaleToFill"></image></view>
						 <view style="color: #999999;text-align: center;padding-bottom: 10upx;">照片/拍摄</view>
					</view>

					</u-upload>
					</view>
				</view>
			</view>

			<button v-if="sendDate.type=='private'" class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="btnLoading" :loading="btnLoading" @tap="send">
				发送信息
			</button>
	</view>
</template>

<script>
import { opinionCreate, uploadImage } from '@/api/userInfo';
import uniPopup from '@/components/uni-popup/uni-popup.vue';

import { addQuestionUrl,addMessageUrl,forumTagsUrl,getMessageUsersUrl,getMessageDetailUrl} from '@/api/forum';
export default {
	components: {
		uniPopup
	 },
	data() {
		return {
			sizeType: ['compressed'],
			fileList3: [],
			upPic:false,
			formData: {
				// value: 1,
				hobby: []
			},
			index: null,
			msgContents: [
				/* '界面显示错乱',
				'启动缓慢，卡出翔了',
				'UI无法直视，丑哭了',
				'偶发性崩溃' */
			],
			stars: [1, 2, 3, 4, 5],
			imageList: [],
			feedbackType: [
				{
					value: 1,
					text: '在线问答'
				},
				{
					value: 2,
					text: '文库资料'
				},
				{
					value: 3,
					text: '视频学习'
				},
				{
					value: 4,
					text: '名师课堂'
				}
			],
			sendDate: {
				// categoryId: 1,
				// pics: '',
				questionContent: '',
				content: '',
				title: '',
				timeDesc: '',
				// tags: '',
				// tagName: '',
				// author:uni.getStorageSync('userInfo').userName,
				// coverImage:'',
				toId:uni.getStorageSync('userInfo').userId,
				toName:uni.getStorageSync('userInfo').userName,
				type:'private',
				fromId:'',
				fromName:'系统管理员',
			},
			question:[],
			btnLoading: false,
			reqBody: {},

			//editor控件
			fileUrl:this.$mConfig.fileUrl,
			readOnly: false,
			formats: {},
			hasLogin: false
		};
	},
	onLoad(options) {
		this.hasLogin = this.$mStore.getters.hasLogin;
		if (this.hasLogin) {
				this.initData(options);
		} else {
				uni.setStorageSync('backToPage', '/pages/question/addMsg');
				this.$mRouter.push({ route: '/pages/public/loginMethod' });
		}
	},
	methods: {

		onInput(e){
		  e.detail.html=='<p><br></p>'?this.btnDisabled=true:this.btnDisabled=false;
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		// 数据初始化
		initData(options) {
			this.sendDate.toId=options.userId;
			this.sendDate.toName=options.userName;
			this.sendDate.type=options.type;
			if(options.msgId)
			{
				this.$http
					.get('/jwt/message/detail'+'/'+options.msgId)
					.then(async r => {
						this.sendDate.timeDesc= r.timeDesc;
						// this.sendDate.questionContent=
						// "<font style='font-weight: bold;font-size: 16px; color:#1e90ff' >"+
						// (this.sendDate.type=='private'?this.sendDate.toName:'系统管理员')+" "+r.timeDesc+"</font><br>"+r.htmlContent;
						this.sendDate.questionContent= r.htmlContent;
					})
					.catch(() => {
					});
			}
		},
		// 监听反馈类型事件
		handleCatChange(e) {
			this.sendDate.categoryId = e.detail.value;
			this.initData();
		},
		// 监听反馈类型事件
		handleTagChange(e) {
			this.sendDate.tags =e.detail.value+',';
			var items = this.question,values = e.detail.value;

			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				const item = items[i]
				if(values.indexOf(item.value) >= 0){
					this.$set(item,'checked',true)
				}else{
					this.$set(item,'checked',false)
				}
			}
		},
		// 监听反馈类型事件
		bindPickerChange(e) {
			this.formData.hobby=[this.question[e.detail.value].value];
			this.sendDate.tags =this.question[e.detail.value].value+',';
			this.index=e.detail.value;
		},
		// 打开相册选图
		uploadImage() {
			const _this = this;
			uni.chooseImage({
				count: 6, // 最多一次可以选择的图片张数
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机
				success: function(res) {
					if (_this.imageList.length + res.tempFiles.length > 6) {
						_this.$mHelper.toast('不要贪心哦，最多只可上传6张照片');
						return;
					}
					_this.handleUploadFile(res.tempFilePaths);
				}
			});
		},
		// 依次上传图片
		handleUploadFile(data) {
			const _this = this;
			_this.upPic=true;//显示上传图片进度
			data.forEach(item => {
				//使用setTimeout保证上传图片顺序
				setTimeout(function(){
						_this.$http
							.upload(uploadImage, { filePath: item, name: 'file' })
							.then(r => {
								_this.imageList.push(r);
							});
					},1000);
			});
		},
		// 删除已选中图片
		close(e) {
			this.imageList.splice(e, 1);
		},
		// 快速输入
		chooseMsg() {
			console.log(this.msgContents)
			uni.showActionSheet({
				itemList: this.msgContents.toString().split(','),
				success: res => {
					this.sendDate.tagName =this.msgContents[res.tapIndex];
					for(var i=0;i<this.question.length;i++)
					{
						if(this.msgContents[res.tapIndex]==this.question[i].tagName)
						{
							this.sendDate.tags =this.question[i].tagId+',';
							console.log(this.sendDate.tags)
						}
					}
				}
			});
		},
		// 返回上一页
		goBack(){
			let pages = getCurrentPages(); // 当前页面
			let beforePage = pages[pages.length - 2]; // 上一页
			uni.navigateBack({
			    success: function() {
			        beforePage.refreshPage(); // 执行上一页的onLoad方法
				}
			});
		},
		// 发送反馈
		async send() {
			this.btnLoading = true;

			let that=this;

			this.editorCtx.getContents({
			    success: function(data) {
						that.sendDate.content = data.html;
						if(data.html.trim()=='<p><br></p>')
						{
							that.btnLoading = false;
							that.$mHelper.toast("问题描述不能为空");
							return;
						}
						 that.$http
							.get(`${addMessageUrl}`, {
								...that.sendDate
							})
							.then(() => {
								that.btnLoading = false;
								that.index=null;
								that.sendDate.tags='';
								that.sendDate.title='';
								that.sendDate.content='';
								that.clear();
								that.$refs.share.open();
								setTimeout(() => {
								 	//that.$mRouter.back();
									that.goBack();
								 }, 1 * 1500);
							})
							.catch(() => {
								that.btnLoading = false;
							});
			  }
			})

		},

		//editor控件
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return
				// console.log('format', name, value)
				this.editorCtx.format(name, value)

			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success')
					}
				})
			},
			clear() {
				this.editorCtx.clear({
					success: function(res) {
						console.log("clear success")
					}
				})
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
			},
			insertImage() {
				const _this = this;
				uni.chooseImage({
					count: 20,
					sizeType:['compressed'],//图片压缩
					success: (res) => {
						// 在微信小程序中不支持多张图片上传，需要做循环实现多张图片上传
						const tempFilePaths = res.tempFilePaths;
						for(let i = 0;i < tempFilePaths.length; i++) {
							_this.$http
									.upload(uploadImage, { filePath: tempFilePaths[i], name: 'file' })
									.then(r => {
										// _this.imageList.push(r);
										this.editorCtx.insertImage({
											src: this.fileUrl+r.path,
											width: '45%',
											height: '45%',
											// alt: '图像',
											success: function() {
												console.log('insert image success')
											}
										})
							});
						}

					}
				})
			} ,

			// uView删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
				this.imageList.splice(event.index, 1);
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


	}
};
</script>

<style lang="scss">
page {
	background-color: $page-color-base;
}

/deep/ .ql-editor.ql-blank:before {
    color: #999999;
    font-style: normal;
}

/deep/ .uni-picker-container .uni-picker-item {
 font-size: 34px;
}

/*问题反馈*/
.feedback-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: $spacing-sm;
	margin-top: $spacing-sm;
	font-size: $font-lg;
}

.feedback-star-view.feedback-title {
	justify-content: flex-start;
	margin: 0;
}
.uni-input {
		font-size: $font-lg;
		padding: 15upx 16upx;
	}
.feedback-quick {
	position: relative;
	padding-right: 40upx;
	.iconfont {
		font-size: $font-lg;
	}
}
/deep/ .checklist-box{
    margin-right: 1px;
}

.feedback-body {
	background: $color-white;
	padding: $spacing-sm 6rpx;
	margin-top: 5px;
	.gender-item {
		margin-right: 2upx;

		.gender-item-text {
			padding-left: 5upx;
		}

		radio .wx-radio-input.wx-radio-input-checked {
			background: $uni-color-primary;
			border-color: $uni-color-primary;
		}
	}
}

.feedback-textare {
	height: 300upx;
	font-size: $font-lg;
	line-height: 50upx;
	width: 100%;
	box-sizing: border-box;
	padding: 15upx 20upx 0;
}

.feedback-input {
	font-size: $font-lg;
	height: 72upx;
	min-height: 50upx;
	padding: 15upx 20upx;
	line-height: 72upx;
}

.feedback-uploader {
	/* padding: 22upx 20upx; */
}

	@import "./editor-icon.css";
	.editor-wrapper {
		/* height: calc(100vh - var(--window-top) - var(--status-bar-height) - 140px); */
		height: 200px;
		background: #fff;
	}

	.iconfont {
		display: inline-block;
		padding: 8px 8px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		/* font-size: 20px; */
	}

	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		/* font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; */
		font-size: $font-lg;
		padding: 0upx 16upx;
	}

	.ql-container {
		box-sizing: border-box;
		padding: 12px 15px;
		width: 100%;
		min-height: 100vh;
		height: 100%;
		margin-top: 20px;
		/* font-size: 16px; */
		font-size: $font-lg;
		line-height: 2.5;
	}

	.ql-active {
		color: #06c;
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

	.rf-uploader .uni-uploader__file {
	    margin: 20upx;
	    width: 120upx;
	    height: 120upx;
	}
	/deep/	.u-upload__wrap{
	    display: flex;
	    flex-direction: row;
	    flex-wrap: wrap;
	}
</style>
