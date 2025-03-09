<template>
<view class="page">
	<view  class="editor-wrapper" style="margin-top: 5px;">
		<view class='toolbar' @click="format" style="display: none;height: 80upx;overflow-y: auto;background-color:#FFFFFF;margin-top: 5px;">
			<view class="iconfont icon-undo" @click="undo"></view>
			<view class="iconfont icon-redo" @click="redo"></view>
			<view class="iconfont icon-shanchu" @click="clear"></view>
			<view class="iconfont icon-charutupian" @click="insertImage" style="float: right;margin-right: 20px;"></view>
		</view>
		<editor	v-model="commentReq.content" id="editor" class="ql-container" @input="onInput"   style="margin-top:5px;" :placeholder="placeholder" showImgSize showImgToolbar showImgResize
			:adjust-position="false" :show-confirm-bar="false"   @blur="blur" @focus="focusOn" :focus="focus" 	 @statuschange="onStatusChange" :read-only="readOnly" @ready="onEditorReady">
		</editor>
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

	<button class="confirm-btn" :class="'bg-' + themeColor.name"  :disabled="btnDisabled" :loading="btnLoading" @click="addComment">
		{{ commentReq.reUserName?'回复':'发布' }}
	</button>

	</view>
</template>

<script>
import { opinionCreate, uploadImage } from '@/api/userInfo';
	export default {
		name: 'hb-comment',
		props: {
			authorId:"",
			userId:"",
			cmData: {
				type: Object,
				default: () => {
					return null;
				}
			},
			deleteTip: {
				type: String,
				default: () => {
					return '操作不可逆，如果评论下有子评论，也将被一并删除，确认？';
				}
			},
		},
		watch: {
			cmData: {
				handler: function(newVal, oldVal) {
					this.commentData = newVal;
				},
				immediate: true
			}
		},
		data() {
			return {
				fileList3: [],
				imageList: [],
				fileUrl:this.$mConfig.fileUrl,
				placeholder:'发布评论',
				commentData: "",
				commentReq: {
					pId: null, // 评论父id
					pIds: null,
					reUserName: null,
					content: null ,// 评论内容
					contentImage:null
				},
				pUser: null, // 标签-回复人
				showTag: false, // 标签展示与否
				focus: false, // 输入框自动聚焦
				submit: false, // 弹出评论
				KeyboardHeight: 0 ,// 键盘高度
				readOnly: false,
				formats: {},
				btnLoading: false,
				btnDisabled: false,
				editorCtx:null
			};
		},
		onLoad(e) {
			if (e.commentReq) {
				this.commentReq = JSON.parse(e.commentReq);
				if (this.commentReq.reUserName) {
					this.placeholder = '回复 ' + this.commentReq.reUserName + '：';
				} else {
					this.placeholder = '发布评论';
				}
				//this.commentReq = encodeURIComponent(JSON.stringify(e.commentReq));
			}
		},
		mounted: function() {
			uni.onKeyboardHeightChange(res => {
				this.KeyboardHeight = res.height;
				// if(this.KeyboardHeight>0)
				// {
				// 	setTimeout(()=>{
				// 	    uni.pageScrollTo({
				// 	        scrollTop: 2000000,
				// 	        duration : 0
				// 	    })
				// 	},50)
				// }
			})
		},
		methods: {
			// 没用的方法，但不要删
			stopPrevent() {},
			// 新增评论
			async addComment() {
				var contentImageUrl=[];
				for(var i=0;i<this.imageList.length;i++)
				{
					contentImageUrl.push(this.imageList[i].path);
				}

				this.commentReq.contentImage=contentImageUrl.join(";");

				this.btnLoading = true;
				let that=this;
				this.editorCtx.getContents({
				    success: function(data) {
						that.commentReq.content = data.html;
						// e.detail.html=='<p><br></p>'?this.btnDisabled=true:this.btnDisabled=false;
						if(data.html.trim()=='<p><br></p>')
						{
							that.btnLoading = false;
							that.$mHelper.toast("评论内容不能为空");
							return;
						}
						if (that.commentReq.content == null || that.commentReq.content.length < 2) {
							uni.showToast({
								title: '评论内容过短',
								duration: 2000
							});
							return;
						}
						let pages = getCurrentPages(); // 当前页面
						let beforePage = pages[pages.length - 2]; // 上一页
						uni.navigateBack({
							success: function() {
								beforePage.$vm.addCommentOrReply(that.commentReq); // 执行上一页的onLoad方法
							}
						});
						}
				});
			},
			// 新增完成
			addComplete() {
				this.commentReq.content = null;
				this.placeholder = '发布评论';
				this.tagClose();
				this.closeInput();
			},
			// 输入框失去焦点
			blur() {
				this.focus = false;
				this.$emit('focusOn',this.commentReq.content,this.placeholder);
			},
			// 输入框聚焦
			focusOn() {
				//if (this.commentReq.content != null && this.commentReq.content.length > 0) {
					//this.$emit('focusOn',this.commentReq.content);
				//}
			},
			onInput(e){
			  // e.detail.html=='<p><br></p>'?this.btnDisabled=true:this.btnDisabled=false;
			},
			// 标签关闭
			tagClose() {
				this.showTag = false;
				this.pUser = null;
				this.commentReq.pId = null;
				this.commentReq.pIds = null;
				this.placeholder = '发布评论';
			},
			// 输入评论
			commentInput() {
				// TODO 调起键盘方法
				this.submit = true;
				setTimeout(() => {
					this.focus = true;
				}, 50)
			},
			// 关闭输入评论
			closeInput() {
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 上一页
				uni.navigateBack({
				    success: function() {
					}
				});
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
					count: 3,
					sizeType:['compressed'],//图片压缩
					success: (res) => {
						// 在微信小程序中不支持多张图片上传，需要做循环实现多张图片上传
						const tempFilePaths = res.tempFilePaths;

						for(let i = 0;i < tempFilePaths.length; i++) {
							_this.$http
									.upload(uploadImage, { filePath: tempFilePaths[i], name: 'file' })
									.then(r => {
										// _this.imageList.push(r);
										_this.editorCtx.insertImage({
											src: _this.fileUrl+r.path,
											alt: '图像',
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
							//
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

<style lang="scss"  scoped>
	page {
		background-color: $page-color-base;
    font-style: normal;
	}

/deep/ .ql-editor.ql-blank:before {
    color: #999999;
    font-style: normal;
}

/deep/	.u-tag{
		border-style:none;
	}
	.hb-comment {
		padding: 10rpx;
	}

	.top-read {
		font-size: 28rpx;
		padding-left: 10rpx;
		color: #999999;
	}

	.seg_line_box {
		display: flex;
		height: 5rpx;
		justify-content: space-between;
		margin: 5rpx 0;
	}

	.seg_line {
		width: 45%;
		border-bottom: 1rpx solid #e1e1e1;
	}

	.seg_dot {
		width: 8%;
		border-bottom: 5rpx dotted #dbdbdb;
	}

	.comment-num {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
	}

	.comment-count{
		width: 100%;
		font-family: Sans-serif;
		font-weight: bold;
		font-size: 28rpx;
		color: #827f7f;
		line-height: normal;
		align-content: center;
		justify-content: center;
		display: flex;
	}

	.comment-box {
		padding: 10rpx 0;
	}

	.comment-box-item {
		display: flex;
	}
	.comment-main {
		padding-left: 20rpx;
	}

	.comment-sub-main {
		padding: 10rpx 10rpx 10rpx 10rpx;
	}

	.comment-sub-avatar{
		padding: 18rpx 10rpx 10rpx 10rpx;

	}

	.comment-main-top {
		width: 598rpx;
		padding-top: 6rpx;
		display: flex;
		justify-content: space-between;
	}

	.sub-comment-main-top {
		width: 508rpx;
		padding-top: 10rpx;
		display: flex;
		justify-content: space-between;
	}

	.nick-name-box {
		display: flex;
		align-items: center;
	}

	.comLogo {
		height: 33rpx;
		margin-right: 18rpx;
		font-size: 22rpx;
		border-radius: 7rpx;
		padding: 3rpx 11rpx;
		color: #FFFFFF;
	}

	.author {//ff0f6b
		background-color: #ff1150;
	}

	.com1 {
		background-color: #d218b1;
	}

	.com2 {
		background-color: #f19c0b;
	}

	.com3 {
		background-color: #c8da85;
	}

	.com4 {
		background-color: #bfd0da;
	}

	.nick-name {
		color: #999999;
		margin-right: 10rpx;
	}
	.zan-box{
		padding-right: 15rpx;
	}
	.zan-sum-box{
		padding-right: -25rpx;
	}
	.isLike {
		font-size: 28rpx;
		color: #2d8cf0;
	}

	.notLike {
		font-size: 28rpx;
		color: #999999;
	}

	.comment-main-content {
		padding: 10rpx 10rpx 10rpx 0;
	}

	.comment-main-foot {
		display: flex;
		font-size: 22rpx;
	}

	.foot-btn {
		font-size: 26rpx;
		padding-left: 20rpx;
		//font-family: Sans-serif;
		//font-weight: bold;
		color: #999999;
		//color: #007AFF;
	}

	.foot-btn2 {
		padding-left: 20rpx;
		color: #007AFF;
	}

	.comment-sub-box {
		padding: 20rpx 0;
	}

	.comment-sub-item {
		display: flex;
		//background-color:#f2f2f2 ;
		border-radius: 5px;
	}

	.comment-none {
		padding: 20rpx;
		width: 100%;
		text-align: center;
		color: #999999;
	}

	.comment-submit-box {
		position: fixed;
		display: flex;
		align-items: flex-end;
		z-index: 9900;
		left: 0;
		top: var(--window-top);
		top:0;
		// bottom: 0;
		background-color: rgba($color: #000000, $alpha: 0.5);
		width: 100%;
	}

	.comment-add {
		//position: fixed;
		background-color: #FFFFFF;
		width: 100%;
		padding: 5rpx;
		// border: 1px solid #ddd;
		transition: .3s;
		-webkit-transition: .3s;
	}

	.btn-click {
		color: #007AFF;
		font-size: 28rpx;
		padding: 10rpx;
	}

	.cancel {
		color: #606266;
	}

	.textarea {
		height: 200upx;
		padding: 16rpx;
		width: 100%;
	}

	.comment-submit {
		padding: 5rpx 20rpx 0 20rpx;
		border-bottom: 1px dashed #ddd;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	@import "./editor-icon.css";
	.editor-wrapper {
		/* height: calc(100vh - var(--window-top) - var(--status-bar-height) - 140px); */
		height: 500upx;
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
		min-height: 500upx;
		height: 500upx;
		margin-top: 20px;
		/* font-size: 16px; */
		// font-size: $font-lg;
		font-size: 32rpx;
		line-height: 1.5;
	}

	.ql-active {
		color: #06c;
	}

.feedback-body {
	background: $color-white;
	/* padding: $spacing-sm 6rpx; */
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
</style>
