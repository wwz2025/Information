<template>
	<view class="hb-comment">
		<!-- 分割线-start -->
		<view class="seg_line_box">
			<view class="seg_line"></view>
			<view class="seg_dot"></view>
			<view class="seg_line"></view>
		</view>
		<!-- 分割线-end -->
		<!-- 评论主体-start -->
		<view class="comment-list" v-if="commentData.commentSize != 0">
			<!-- 评论主体-顶部数量及发表评论按钮-start -->
			<view class="comment-num">
				<view class="comment-count">{{commentData.commentSize}} 条评论</view>
			</view>
			<!-- 评论主体-顶部数量及发表评论按钮-end -->
			<!-- 评论列表-start -->
			<view class="comment-box" v-for="(item, index) in commentData.comment" :key="index">
				<view class="comment-box-item">
					<view @click="goPersonal(item.userId)">
						<u-avatar :src="item.avatar?fileUrl+item.avatar:headImg" mode="circle" size="30"></u-avatar>
					</view>
					<view class="comment-main">
						<!-- 父评论体-start -->
						<view class="comment-main-top">
							<view class="nick-name-box">
								<!-- <view class="comLogo com1" v-if="index == 0">沙发</view>
								<view class="comLogo com2" v-if="index == 1">板凳</view>
								<view class="comLogo com3" v-if="index == 2">地板</view> -->
								<!-- <view class="comLogo com4" v-if="index >= 0">{{index + 1}}楼</view> -->
								<view class="nick-name" @click="goPersonal(item.userId)">{{item.userName}}</view>
								<span class="comLogo author" v-if="item.userId == authorId">作者</span>
							</view>
							<view class="zan-box" @click="like(item.id,item.isLike)">
								<span
									:class="item.isLike ? 'isLike' : 'notLike'">{{item.upVote > 0 ? item.upVote:''}}</span>
								<u-icon  :name="item.isLike?'thumb-up-fill':'thumb-up'"
									:color="item.isLike?themeColor.name:'#999999'" size="20"></u-icon>
							</view>
						</view>
						<view :id='"item"+item.id' :class='"comment-main-content item"+item.id'>
							<u-read-more :toggle="true" show-height="300" text-indent="0" close-text="展开">
								<rich-text style="color: #000000;" :nodes="item.content"></rich-text>
							</u-read-more>
							<view class="feedback-body feedback-uploader rf-uploader"  style="position: relative;"  v-if="item.contentImage?true:false" >
								<view class="uni-uploader">
									<view class="uni-uploader-body">
										<view class="uni-uploader__files" style="text-align: center;">
													<block v-for="(image, indexMain) in (item.contentImage?item.contentImage:'').split(';')" :key="indexMain">

														<view v-if="item.contentImage.split(';').length>=2" class="uni-uploader__file" style="position: relative;width:160upx;height:160upx;">
																<rf-image class="uni-uploader__img" :src="fileUrl+image"></rf-image>
														</view>
														<view v-if="item.contentImage.split(';').length==1" @tap="previewImage(fileUrl+image)" class="uni-uploader__file" style="position: relative;width: 100%;max-height:600upx;">
																<image
																	mode="aspectFit"
																	lazy-load="true"
																	:src="fileUrl+item.contentImage"
																	style="width:100%;height: 100%;"
																></image>
														</view>
														<!-- <view v-if="item.contentImage.split(';').length==2"	@tap="previewImage(fileUrl+image)" class="uni-uploader__file" style="position: relative;width: 46%; text-align: center;">
																<image
																	mode="aspectFit"
																	lazy-load="true"
																	:src="fileUrl+image"
																	style="width:100%;height: 100%;"
																></image>
														</view> -->
													</block>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="comment-main-top">
							<view class="foot-btn" style="padding-left: 0px;">{{item.address}}</view>
							<view class="zan-box">
								<!-- <view class="foot-btn" @click="rate(item.id,item.totalScore,item.attitudeScore,item.majorScore,item.ratioScore,item.contentScore)">评分</view> -->
								<view class="foot-btn" v-if="item.userId==userId" @click="confirmDelete(item.id)">删除</view>
								<view  v-if="item.userId != authorId && item.email=='1' && authorId==userId" :class="item.attitudeScore?'foot-btn2':'foot-btn'" @click="rate(item,index)">{{item.attitudeScore?'已评分':'评分'}}</view>
								<!-- <view class="foot-time" style="padding-left: 10px;">{{item.address}}</view> -->
								<view class="foot-btn" @click="reply(item.userName,item.userId,item.userName,item.id,item.pids+item.id+',')">回复</view>
							</view>
						</view>
						<!-- 父评论体-end -->
						<!-- 子评论列表-start -->
						<view class="comment-sub-box" >
							<view class="comment-sub-item" v-for="each in item.children" :key="each.id">
								<view class="comment-sub-avatar" @click="goPersonal(each.userId)">
									<u-avatar :src="each.avatar?fileUrl+each.avatar:headImg" mode="circle" size="20"></u-avatar>
								</view>
								<view class="comment-sub-main">
									<view class="sub-comment-main-top" >
										<view style="display: flex;">
											<view class="nick-name" @click="goPersonal(each.userId)">{{each.userName}}</view>
											<span class="comLogo author" v-if="each.userId == authorId">作者</span>
											<view class="nick-name" @click="goPersonal(each.reUserId)" v-if="each.reUserId">{{each.userId==each.reUserId?" ▶ ":" @ "}}{{each.reUserName}}</view>
											<span class="comLogo author" v-if="authorId==each.reUserId">作者</span>
										</view>

										<view class="zan-sum-box" @click="like(each.id,each.isLike)">
											<span
												:class="each.isLike ? 'isLike' : 'notLike'">{{each.upVote > 0 ? each.upVote:''}}</span>
											 <u-icon :name="each.isLike?'thumb-up-fill':'thumb-up'"
												:color="each.isLike?'#2d8cf0':'#999999'" size="20"></u-icon>

										</view>
									</view>
									<view :id='"item"+each.id' :class='"comment-main-content item"+each.id'>
										<u-read-more :toggle="true" show-height="300" text-indent="0" close-text="展开">
											<rich-text  style="color: #000000;"  :nodes="each.content"></rich-text>
										</u-read-more>
										<view class="feedback-body feedback-uploader rf-uploader"  v-if="each.contentImage?true:false">
											<view class="uni-uploader">
												<view class="uni-uploader-body">
													<view class="uni-uploader__files" style="text-align: center;">
														<block v-for="(image, indexSub) in (each.contentImage?each.contentImage:'').split(';')" :key="indexSub">

															<view v-if="each.contentImage.split(';').length>=2" class="uni-uploader__file" style="position: relative;width:140upx;height:140upx;">
																	<rf-image class="uni-uploader__img" :src="fileUrl+image"></rf-image>
															</view>
															<view v-if="each.contentImage.split(';').length==1" @tap="previewImage(fileUrl+image)" class="uni-uploader__file" style="position: relative;width: 100%;max-height:600upx;">
																	<image
																		mode="aspectFit"
																		lazy-load="true"
																		:src="fileUrl+each.contentImage"
																		style="width:100%;height: 100%;"
																	></image>
															</view>
															<!-- <view v-if="each.contentImage.split(';').length==2"	@tap="previewImage(fileUrl+image)" class="uni-uploader__file" style="position: relative;width: 45%; text-align: center;">
																	<image
																		mode="aspectFit"
																		lazy-load="true"
																		:src="fileUrl+image"
																		style="width:100%;height: 100%;"
																	></image>
															</view> -->
														</block>
													</view>
												</view>
											</view>
										</view>
									</view>
									<view class="comment-main-top2">
										<view class="foot-btn" style="padding-left: 0px;">{{each.address}}</view>
										<view class="zan-box">
											<view v-if="each.userId != authorId && each.email=='1' && authorId==userId"  :class="each.attitudeScore?'foot-btn2':'foot-btn'" @click="rate(each,index)">{{each.attitudeScore?'已评分':'评分'}}</view>
											<view class="foot-btn" style="padding-left: 10px;" v-if="each.userId==userId" @click="confirmDelete(each.id)">删除</view>
											<view class="foot-btn"  style="padding-left: 10px;" @click="reply(item.userName,each.userId,each.userName,item.id,each.pids+each.id+',')">回复</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- 子评论列表-end -->
					</view>
				</view>
			</view>
			<!-- 评论列表-end -->
		</view>
		<!-- 评论主体-end -->
		<!-- 无评论-start -->
		<view class="comment-none" v-else>
			暂无评论，<span @click="commentInput" style="color: #007AFF;">抢沙发</span>
		</view>
		<!-- 无评论-end -->
		<!-- 新增评论-start -->

		<!-- 下边的click.stop.prevent用于让上边的click不传下去，以防点到下边的空白处触发closeInput方法 -->
		<!-- <view class="comment-submit-box" v-if="submit" @click="closeInput">
			<view class="comment-add" @click.stop.prevent="stopPrevent" :style="'bottom:' + KeyboardHeight + 'px'">
				<view class="comment-submit">
					<view class="btn-click cancel" @click="closeInput">取消</view>
					<view>
						<u-tag  :text="'回复在 '+ pUser +' 的评论下'" type="info" closeable :show="showTag" @close="tagClose" />
					</view>
					<view>
						<view class="btn-click" @click="add()">评论</view>
					</view>
				</view>
				<view   class="editor-wrapper" style="margin-top: 5px;">
					<editor	v-model="commentReq.content" id="editor" class="ql-container"   style="margin-top:5px;" :placeholder="placeholder" showImgSize showImgToolbar showImgResize
						:adjust-position="false" :show-confirm-bar="false"   @blur="blur" @focus="focusOn" :focus="focus" 	 @statuschange="onStatusChange" :read-only="readOnly" @ready="onEditorReady">
					</editor>
					<view class='toolbar' @click="format" style=" height: 80upx;overflow-y: auto;background-color:#FFFFFF;margin-top: 5px;">
								<view class="iconfont icon-undo" @click="undo"></view>
								<view class="iconfont icon-redo" @click="redo"></view>
								<view class="iconfont icon-shanchu" @click="clear"></view>
								<view class="iconfont icon-charutupian" @click="insertImage" style="float: right;margin-right: 20px;"></view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- 新增评论-end -->
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
				headImg: this.$mAssetsPath.headImg,//空白头像
				fileUrl:this.$mConfig.fileUrl, //文件路径
				placeholder:'发布评论',
				// commentData:{comment:[],commentSize:0},
				// commentReq: {
				// 	pId: null, // 评论父id
				// 	pIds: null,
				// 	reUserName: null,
				// 	content: null // 评论内容
				// },
				// pUser: null, // 标签-回复人
				// showTag: false, // 标签展示与否
				// focus: false, // 输入框自动聚焦
				// submit: false, // 弹出评论
				// KeyboardHeight: 0 ,// 键盘高度
				"commentData":{"comment":[],"commentSize":0},
				"commentReq": {
					"pId": null, // 评论父id
					"pIds": null,
					"reUserName": null,
					"content": null // 评论内容
				},
				"pUser": null, // 标签-回复人
				"showTag": false, // 标签展示与否
				"focus": false, // 输入框自动聚焦
				"submit": false, // 弹出评论
				"KeyboardHeight": 0 ,// 键盘高度
				//editor控件
				// fileUrl:this.$mConfig.fileUrl,
				readOnly: false,
				formats: {},
				hasLogin: false
			};
		},
		// noshow(){
		// 	setTimeout(()=>{
		// 	    this.intoView='item498';
		// 	    //this.move('item498');
		// 	},100)
		// },
		// onShow(){
		//
		// 	uni.$on("reComment",(options)=>{
		// 	         let comment =JSON.parse(options.comment)
		// 	         let index =JSON.parse(options.index);
		// 			 if(comment){
		// 				 // this.commentList[index]=comment;
		// 				 // this.commentData.comment=this.getTree(this.commentList);
		// 				this.commentData.comment[index]=comment;
		//
		// 			 }
		// 	         uni.$off('reComment')
		// 	     })
		// },
		// 加载更多
		onReachBottom() {
			console.log("hb-触底了")
		},
		mounted: function() {
			uni.onKeyboardHeightChange(res => {
				this.KeyboardHeight = res.height;
				// uni.showToast({
				// 	title: '键盘高度'+this.KeyboardHeight,
				// 	duration: 2000
				// });
				if(this.KeyboardHeight>0)
				{
					setTimeout(()=>{
					    uni.pageScrollTo({
					        scrollTop: 2000000,
					        duration : 0
					    })
					},50)
				}
			})
		},
		methods: {
			// 预览图片单张
			previewImage(urls) {
					if (!urls) return;
					let _this = this;
					let imgsArray = [];
					imgsArray[0] = urls
					uni.previewImage({
						current: 0,
						urls: imgsArray
					});
				// if (!urls) return;
				// uni.previewImage({
				// 	urls: urls.split('#$#')
				// });
			},
			// 没用的方法，但不要删
			stopPrevent() {},
			// 回复评论
			reply(pUser, reUserId,reUserName, pId , pIds) {
				this.pUser = pUser;
				this.commentReq.pId = pId;
				this.commentReq.pIds = pIds;
				this.commentReq.reUserId = reUserId;
				this.commentReq.reUserName = reUserName;
				if (reUserName) {
					this.placeholder = '回复 ' + reUserName + '：';
				} else {
					this.placeholder = '';
				}
				this.showTag = true;
				this.commentInput();
			},
			// 删除评论前确认
			confirmDelete(commentId) {
				var that = this;
				uni.showModal({
					title: '警告',
					content: that.deleteTip,
					confirmText: '确认删除',
					success: function(res) {
						if (res.confirm) {
							that.$emit('del', commentId);
						}
					}
				});
			},
			//跳转用户主页
			goPersonal(id) {
				if (this._isWidescreen) { //若为宽屏，则触发右侧详情页的自定义事件
				  uni.$emit('updateDetail', {
					item: encodeURIComponent(JSON.stringify(item))
				  })
				} else {
				  uni.navigateTo({
					url: '/pages/user/personal/index?uid='+id
				  });
				}
			},
			// 新增评论
			add() {
				let that=this;
				this.editorCtx.getContents({
				    success: function(data) {
						that.commentReq.content = data.html;
						if(data.html.trim().length<=0)
						{
							// that.btnLoading = false;
							that.$mHelper.toast("评论内容不能为空");
							return;
						}
						if (that.commentReq.content == null || that.commentReq.content.length < 2) {
							uni.showToast({
								title: '评论内容过短',
								duration: 2000
							});
							return
						}
						that.$emit('add', that.commentReq);
							}
					});

			},
			// 点赞评论
			like(commentId,isLike) {
				this.$emit('like', commentId,isLike);
				//this.$parent.commentlike(commentId)
			},
			// 新增完成
			addComplete() {
				this.commentReq.content = null;
				this.placeholder = '发表评论';
				this.tagClose();
				this.closeInput();
			},
			// 点赞完成-本地修改点赞结果
			likeComplete(commentId) {
				for (var i in this.commentData.comment) {
					if (this.commentData.comment[i].id == commentId) {
						this.commentData.comment[i].isLike ? this.commentData.comment[i].upVote-- : this.commentData
							.comment[i].upVote++;
						this.commentData.comment[i].isLike = !this.commentData.comment[i].isLike;
						return
					}
					for (var j in this.commentData.comment[i].children) {
						if (this.commentData.comment[i].children[j].id == commentId) {
							this.commentData.comment[i].children[j].isLike ? this.commentData.comment[i].children[j]
								.upVote-- : this.commentData.comment[i].children[j].upVote++;
							this.commentData.comment[i].children[j].isLike = !this.commentData.comment[i].children[j]
								.isLike;
							return
						}
					}
				}
			},
			// 评论评分
			rate(comment,index) {
				uni.navigateTo({
					url: '/pages/cms/commentRate?comment='+JSON.stringify(comment)+"&index="+index
				});
			},
			// 删除完成-本地删除评论
			deleteComplete(commentId) {
				for (var i in this.commentData.comment) {
					for (var j in this.commentData.comment[i].children) {
						if (this.commentData.comment[i].children[j].id == commentId) {
							this.commentData.comment[i].children.splice(Number(j), 1);
							return
						}
					}
					if (this.commentData.comment[i].id == commentId) {
						this.commentData.comment.splice(Number(i), 1);
						return
					}
				}
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
			// 标签关闭
			tagClose() {
				this.showTag = false;
				this.pUser = null;
				this.commentReq.pId = null;
				this.commentReq.pIds = null;
				this.placeholder = '发表评论';
			},
			// 输入评论
			commentInput() {
				// TODO 调起键盘方法
				// this.submit = true;
				// setTimeout(() => {
				// 	this.focus = true;
				// }, 50)
				this.hasLogin = this.$mStore.getters.hasLogin;
				if (this.hasLogin) {
				    // this.initData();
						uni.navigateTo({
						  url: '/components/hb-comment/add-comment?commentReq='+JSON.stringify(this.commentReq)
						});
				} else {
						uni.setStorageSync('backToPage', '/components/hb-comment/add-comment?commentReq='+JSON.stringify(this.commentReq));
						// this.navTo('/pages/public/login');
						this.$mRouter.push({ route: '/pages/public/login' });
				}
			},
			// 关闭输入评论
			closeInput() {
				this.focus = false;
				this.submit = false;
			},
			//editor控件
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				let	that=this;
				// 在自定义组件或包含自定义组件的页面中，应使用 this.createSelectorQuery() 来代替uni.createSelectorQuery
				this.createSelectorQuery().select('#editor').context((res) => {
					that.editorCtx = res.context
				}).exec()
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			format(e) {
				let {name,value} = e.target.dataset
				if (!name) return
				this.editorCtx.format(name, value)
			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
				setTimeout(()=>{
						uni.pageScrollTo({
								scrollTop: 2000000,
								duration : 0
						})
				},50)
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
			move(num) {
				this.$nextTick(()=> {
					this.intoView = "item" + num
					console.log("=======---------=========="+this.intoView)
				})
			}

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

	.comment-main-top2 {
		width: 528rpx;
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
		display: flex;
		align-items: center;
	}
	.zan-sum-box{
		padding-right: -25rpx;
		display: flex;
		align-items: center;
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
		position: fixed;
		background-color: #FFFFFF;
		width: 100%;
		padding: 5rpx;
		border: 1px solid #ddd;
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
		height: 400upx;
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
		min-height: 300upx;
		height: 300upx;
		margin-top: 20px;
		/* font-size: 16px; */
		// font-size: $font-lg;
		font-size: 28rpx;
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
/deep/ .rf-uploader .uni-uploader__file {
    margin: 5px;
    width: 85px;
    height: 85px;
}
</style>
