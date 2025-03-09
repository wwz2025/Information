<template>
	<view class="container" style="background-color: #FFFFFF;height: 100%;">

		<u-modal
			:content="contentLogin"
			:show="showLogin"
			@confirm="confirmLogin"
		></u-modal>

		<!--顶部菜单-->
<!--		<rf-top-bar :scrollTop="scrollTop" :title="title"></rf-top-bar>-->
		<!--页面加载动画-->
		<u-loading-page
			:loadingText="loadingPageData.loadingText"
			:loadingMode="loadingPageData.loadingMode"
			:loading="loading"
			:color="loadingPageData.color"
			:loadingColor="loadingPageData.loadingColor"
		>
		</u-loading-page>
		<u-modal
			:content="'确定拨打电话'+info.warnPhone+'吗？'"
			:show="show2"
			showCancelButton
			closeOnClickOverlay
			@confirm="confirm2"
			@cancel="cancel2"
			@close="close2"
		></u-modal>

		<u-modal :show="show3"  title="微信号" @confirm="close">
			<view class="u-demo-block">
				<view class="u-demo-block_content" style="display: flex;justify-content: center;align-items: center;">
					<view class="u-page__tag-item2">
						<u-icon
							:customStyle="{paddingTop:0+'rpx'}"
							name="chat"
							:size="34"
							:color="themeColor.color"
						></u-icon>
					</view>
					<view class="u-page__tag-item2">
						<rich-text :nodes="info.warnPhone"></rich-text>
					</view>
					<view class="u-page__tag-item2" style="margin-left: 40px;">
						<u-button size="small" type="primary" shape="circle" :plain="true" text="打电话" @click="makeWarnPhoneCall()"></u-button>
					</view>
					<view class="u-page__tag-item2" style="margin-left: 10px;">
						<u-button size="small" type="primary" shape="circle" :plain="true" text="复制微信号" @click="setClipboardData()"></u-button>
					</view>
				</view>
			</view>
		</u-modal>
		<uni-popup ref="popup" type="center">
			{{msgText}}
		</uni-popup>

		<!--回到顶部-->
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>

		<view class="content" v-if="info.article.content">

			<view class="detail">

<!--				<view class="title" style="display: flex;">
					<view style="margin: 10upx 0upx;">{{ info.article.title }}</view>
				</view>-->
				<view class="info" >
					<view class="source-date"  @click="goPersonal(info.article)">
						<view style="float: left;">
							<u-avatar :src="info.article.avatar?fileUrl+ info.article.avatar:headImg" mode="circle" size="60">
							</u-avatar>
						</view>
						<view style="float: left;margin-top: 10upx;margin-left:20upx;">
							<view class="u-demo-block">
								<view class="u-demo-block_content" style="display: flex;justify-content: left;align-items: center;">
									<view class="u-page__tag-item2">
										<u-tag :text="info.article.forumCategory.categoryName" type="warning"  shape="circle" style="display: inline-flex;" ></u-tag>
									</view>
									<view class="u-page__tag-item2">
										<text class="source" style="margin-top: 10upx;margin-left: 10px;">{{ info.article.author?info.article.author:'' }}</text>
									</view>
								</view>
							</view>
<!--							<text class="source" style="margin-top: 10upx;margin-left: 10px;">{{ info.article.author?info.article.author:'' }}</text>-->
							<text class="date hidden" style="margin-top: 10upx;">{{ info.article.keywords }}</text>
							<text class="date hidden" style="margin-top: 10upx;">来自91本地生活圈</text>
						</view>
					</view>
					<view class="read">
						<u-tag :text="info.article.focusFlag==1?'取消关注':'关注'" type="error"  shape="circle" style="display: inline-flex;"
									 @click="addFocus(info.article.yhid,info.article.isFocus)"></u-tag>
					</view>
				</view>

				<view class="u-demo-block__content" v-if="info.article.tagList">
					<view class="u-page__tag-item2" v-for="(item, index) in info.article.tagList"
								:key="index">
						<u-tag
							:text="item.tagName"
							type="warning"
							plain
							plainFill
							size="mini"
							shape="circle"
							style="display: inline-flex;"
						>
						</u-tag>
					</view>
				</view>

				<view class="desc">
					<u-parse :content="info.article.content"></u-parse>
				</view>
				<u-album :urls="info.coverImage" maxCount="6" :multipleSize="deviceWidth"></u-album>
				<u-divider ></u-divider>

				<view class="info" >
					<view class="source-date">
						<view style="float: left;margin-top: 10upx;margin-left:20upx;">
							<u-icon
								:customStyle="{paddingTop:0+'rpx'}"
								name="star"
								:size="28"
								:color="info.is_favorite ? themeColor.color : '#333333'"
								@click="favorite()"
							></u-icon>
						</view>
						<view style="float: left;margin-top: 10upx;margin-left:20upx;">
							<u-icon
								:customStyle="{paddingTop:0+'rpx'}"
								name="thumb-up"
								:size="28"
								:color="info.is_like ? themeColor.color : ''"
								@click="like()"
							></u-icon>
						</view>
					</view>
					<view class="read">
						<text class="time" v-if="info.article.hit">{{info.article.hit}}浏览</text>
						<text class="time" v-if="info.article.upVote">{{info.article.upVote}}点赞</text>
					</view>
				</view>
				<u-gap height="10" bgColor="#f3f4f6" marginTop="20" marginBottom="20"></u-gap>
				<view class="info"  @click="callPhone()">
					<view class="source-date">
						<text class="source" style="margin-top: 10upx;margin-left: 10px;">联系人：{{ info.article.author?info.article.author:'' }}</text>
						<br/>
						<text class="source" style="margin-top: 10upx;margin-left: 10px;" :style="'color:'+themeColor.color">联系时请告知在91本地生活圈看到的</text>
					</view>
					<view class="read" >
						<u-icon
								:customStyle="{paddingTop:0+'rpx'}"
								name="phone"
								:size="34"
								:color="themeColor.color"
							></u-icon>
					</view>
				</view>
				<u-gap height="10" bgColor="#f3f4f6" marginTop="20" marginBottom="20"></u-gap>
				<view class="info"  @click="report()">
					<view class="source-date">
						<text class="source" style="margin-top: 10upx;margin-left: 10px;" :style="'color:'+themeColor.color">如遇无效、虚假、诈骗信息，请立即举报</text>
						<br/>
						<text class="source" style="margin-top: 10upx;margin-left: 10px;">
							出发前请相互核实人员、车辆信息。请勿缴纳定金，谨防上当受骗！
						</text>
					</view>
					<view class="read" >
						<u-icon
							:customStyle="{paddingTop:0+'rpx'}"
							name="server-man"
							:size="34"
							:color="themeColor.color"
						></u-icon>
					</view>
				</view>
				<u-gap height="10" bgColor="#f3f4f6" marginTop="20" marginBottom="20"></u-gap>
				<u-alert
					description="任何收取定金行为都是骗子，请拨打投诉电话：18588616107，微信同号"
					type="error"
					effect="dark"
					fontSize="20"
					showIcon
					@click="callWechat()"
				></u-alert>
			</view>
<!--			<view class="comment">
			<scroll-view scroll-y="true" :scroll-into-view="intoView" scroll-with-animation="true">
			<hb-comment ref="hbComment" @add="addCommentOrReply" @del="del" @like="commentLike" @focusOn="focusOn" :deleteTip="'确认删除？'"
				:cmData="commentData" :userId="userInfo.userId" :authorId="info.article.yhid" :authorName="info.article.author" v-if="commentData"></hb-comment>
			</scroll-view>
			</view>

			<block v-if="commentData.commentSize>0">
				<u-loadmore  :status="loadingType"></u-loadmore>
			</block>-->
			<view class="float-empty">
			</view>
			<view class="comment-bar" v-if="loading">
<!--				<view class="input" @tap="initAddComment(true)">
				<text>{{commentContent.length>0?(commentContent.length>10?commentContent.substr(0,10)+"...":commentContent):placeholder}}</text></view>-->
				<view class="operate">
<!--					<view class="info"  @tap="handleScrollTop()">
						<view  class="colorui" style="font-size: 50rpx;" :class="[ commentData.commentSize>0 ? `text-${themeColor.name} cuIcon-communityfill` : 'cuIcon-community']"></view>
						<text  class="count" :class="'bg-' + themeColor.name" v-if="commentData.commentSize> 0">{{ commentData.commentSize }}</text>
					</view>-->
					<view class="like">
						<view @tap="like()" class="colorui" style="font-size: 50rpx;" :class="[ info.is_like ? `text-${themeColor.name} cuIcon-appreciatefill` : 'cuIcon-appreciate']"></view>
					</view>
					<view class="favorite">
							<view @tap="favorite()" class="iconfont" style="font-size: 50rpx;" :class="[ info.is_favorite ? `text-${themeColor.name} iconshixin1` : 'iconguanzhu']"></view>
					</view>
					<!-- <button open-type="share" class="share" @tap="share"><image src="/static/images/icon_share.png"></image></button> -->
				</view>
			</view>

			<view class="comment-bar" >
					<u-grid
						:border="false"
						col="6"
						style="width: 100%;"
					>
						<u-grid-item style="height: 68px;" @click="toHome()">
							<u-icon
								:customStyle="{paddingTop:0+'rpx'}"
								name="home"
								:size="34"
							></u-icon>
							<text class="grid-text" >首页</text>
						</u-grid-item>
						<u-grid-item style="height: 68px;" @click="favorite()" >
							<u-icon
								:customStyle="{paddingTop:0+'rpx'}"
								name="star"
								:size="34"
								:color="info.is_favorite ? themeColor.color : '#333333'"
							></u-icon>
							<text class="grid-text" :class="info.is_favorite ? `text-${themeColor.name} ` : '#333333'">收藏</text>
						</u-grid-item>
						<u-grid-item style="height: 68px;" @click="like()" >
							<u-icon
								:customStyle="{paddingTop:0+'rpx'}"
								name="thumb-up"
								:size="34"
								:color="info.is_like ? themeColor.color : ''"
							></u-icon>
							<text class="grid-text" :class="info.is_like ? `text-${themeColor.name} ` : '#333333'">点赞</text>
						</u-grid-item>
<!--						<u-grid-item style="height: 68px;">
							<u-icon
								:customStyle="{paddingTop:0+'rpx'}"
								name="chat"
								:size="34"
							></u-icon>
							<text class="grid-text">评论</text>
						</u-grid-item>-->
						<u-grid-item bgColor="#39b54a" style="height: 68px;" @click="callWechat()">
							<u-icon
								:customStyle="{paddingTop:0+'rpx'}"
								name="chat"
								:size="34"
								color="#ffffff"
							></u-icon>
							<text class="grid-text" style="color:#ffffff" >微信</text>
						</u-grid-item>
						<u-grid-item :bgColor="themeColor.color" style="height: 68px;" @click="report()">
							<u-icon
								:customStyle="{paddingTop:0+'rpx'}"
								name="server-man"
								:size="34"
								color="#ffffff"
							></u-icon>
							<text class="grid-text" style="color:#ffffff" >举报</text>
						</u-grid-item>
						<u-grid-item bgColor="#e54d42" style="height: 68px;" @click="callPhone()">
							<u-icon
								:customStyle="{paddingTop:0+'rpx'}"
								name="phone"
								:size="34"
								color="#ffffff"
							></u-icon>
							<text class="grid-text" style="color:#ffffff" >打电话</text>
						</u-grid-item>
					</u-grid>
			</view>

				<!-- 更多操作弹框-->
				<uni-popup ref="share" background-color="#fff" type="bottom">
					<view class="uni-popup-share">
						<view class="uni-share-title"><text class="uni-share-title-text">更多操作...</text></view>
						<view class="uni-share-content">
							<view class="uni-share-content-box">
								<view class="uni-share-content-item">
									<view @tap="like()" class="colorui" style="font-size: 60rpx;" :class="[ info.is_like ? `text-${themeColor.name} cuIcon-appreciatefill` : 'cuIcon-appreciate']"></view>
									<text class="uni-share-text">{{info.is_like?'已点赞':'点赞'}}</text>
								</view>
								<view class="uni-share-content-item">
									<view @tap="favorite()" class="iconfont" style="font-size: 60rpx;" :class="[ info.is_favorite ? `text-${themeColor.name} iconshixin1` : 'iconguanzhu']"></view>
									<text class="uni-share-text">{{info.is_favorite?'已收藏':'收藏'}}</text>
								</view>
								<view class="uni-share-content-item">
									<view @tap="report()" class="colorui" style="font-size: 60rpx;" :class="[ info.is_report ? `text-${themeColor.name} cuIcon-warn` : 'cuIcon-warn']"></view>
									<text class="uni-share-text">{{info.is_report?'已举报':'举报'}}</text>
								</view>
							</view>
						</view>
					</view>
				</uni-popup>
				<view @tap="closeShareTip()" class="share-maske" v-show="showShareTip">
					<view class="share-tip">
						<image class="share-tip-info" mode="aspectFit" src="/static/images/share_tip_info.png"></image>
						<image @tap="closeShareTip()" class="share-tip-btn" mode="aspectFit" src="/static/images/share_tip_btn.png"></image>
					</view>
				</view>
				<view @tap="closeBrowserShareTip()" class="share-maske" v-show="showBrowserShareTip">
					<view class="share-tip share-browser-tip">
						<image class="share-tip-info" mode="aspectFit" src="/static/images/share_tip_browser.png"></image>
						<image @tap="closeBrowserShareTip()" class="share-tip-btn" mode="aspectFit" src="/static/images/share_tip_btn.png"></image>
					</view>
				</view>
		</view>

	</view>
</template>

<script>

	import rfTopBar from '@/components/rf-top-bar';

	import { deleteFocusUrl,addFocusUrl} from '@/api/profile';
	import util from '@/utils/utils.js';
	import hbComment from '@/components/hb-comment/hb-comment.vue'
	import {
		view,
		//articleViewUrl,
		commentListUrl,
		addCommentUrl,
		deleteCommentUrl,
		articleUpvoteUrl,
		commentsUpvoteUrl,
		addFavouriteAllUrl,
		removeFavouriteAllUrl
		} from '@/api/forum';

export default {
	components: {
		rfTopBar,
		hbComment
	 },
	data() {
		return {
			contentLogin: '您好，请先登录，再使用！',
			showLogin: false,
			hasLogin: false,
			title: "详细情况",
			userBg: this.$mAssetsPath.userBg,
			deviceWidth:0,//设备宽度
			content: '',
			show3: false,
			show2: false,
			loading: true,
			loadingPageData: {
				// 自定义提示内容
				loadingText: this.$mSettingConfig.appName,
				// 自定义加载动画模式
				loadingMode: 'semicircle',
				// 自定义背景色
				color: '#C8C8C8',
				loadingColor: '#C8C8C8'
			},
			headImg: this.$mAssetsPath.headImg,//空白头像
			fileUrl:this.$mConfig.fileUrl, //文件路径
			id: '',
			info: {
				warnPhone:'18588616107',
				article:{ title:'',coverImage:'', hit:0, rows: 0, list: [] },
				comment: { rows: 0, list: [] } ,
				is_like:false,
				is_favorite:false,
				is_report:false,
				coverImage:[]
			},
			pid:null,
			pids:null,
			reUser:null,
			placeholder:"发布评论",
			commentContent: '',//评论内容
			commentContentImage:'',//评论图片
			replyCommentId: 0,
			replyNickname: '',
			showAddComment: false,
			showCommenBar: true,
			addCommentFocus: false,
			hasMoreData: false,
			// showPageLoading: true,
			shareUrl: '',
			showShareTip: false,
			showH5Share: false,
			showBrowserShareTip: false,
			msgText:"",
			scrollTop: 0,//是否返回页面顶部
			userInfo:null,
			pageList:[],
			commentList:[],
			pageNum: 0,
			// loading: true,
			loadingType: 'loading',
			commentData : {
				"commentSize": 0,
				"comment": {}
			},
			intoView: ''
		};
	},
	onShow(){
		let comment =null;
		let index =null;
		uni.$on("reComment",(options)=>{
			 comment =JSON.parse(options.comment);
			 index =JSON.parse(options.index);
			 if(comment){
				 this.commentList[index]=comment;
				 this.commentData.comment=this.getTree(this.commentList);
			 }
			 uni.$off('reComment')
		 })
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onLoad(e) {
		this.hasLogin = this.$mStore.getters.hasLogin;
		this.deviceWidth =(uni.getSystemInfoSync().screenWidth  -50)/3;
		console.log('Screen width:', uni.getSystemInfoSync().screenWidth);
		console.log('Screen width1:', this.deviceWidth);
		if (e.id) {
			this.id = e.id;
		}
		this.userInfo = uni.getStorageSync('userInfo');
		this.getArticle().then(res => {
			if(this.userInfo){
				this.read();
			}
		});
		if (e.commentId > 0) {
			setTimeout(()=>{
				this.toHref('.item'+e.commentId);
			},500)
		}
	},
	onPullDownRefresh() {
		// uni.showLoading({
		// 	title: '刷新中'
		// });
		this.pageNum = 0;
		this.getArticle();
	},
	// 加载更多
	onReachBottom() {
		console.log("触底了")
		this.pageNum++;
		if(this.loadingType === 'loading'){
			this.getComment();
		}
	},
	onNavigationBarButtonTap(e) {
		this.$refs.share.open()
		const index = e.index;
		if (index === 0) {
			this.navDetailShow = true;
		}
	},
	/*小程序分享*/
	// onShareAppMessage() {
	// 	return {
	// 		path: '/pages/article/detail?id=' + this.info.id,
	// 		success: function(e) {},
	// 		title: this.info.title,
	// 		imageUrl: this.info.photo_url
	// 	};
	// },
	methods: {
		//复制微信号到剪切板
		setClipboardData() {
			uni.setClipboardData({
				data: this.info.warnPhone, // 要复制的数据
				success: function () {
					uni.$u.toast('复制成功')
					console.log('复制成功');
					// 可以在这里执行复制成功后的操作
				},
				fail: function (error) {
					console.error('复制失败', error);
					// 可以在这里处理复制失败的情况
				}
			});
		},
		callWechat() {
			this.show3 = true
		},
		callPhone() {
			this.show2 = true
		},
		confirm2() {
			this.show2 = false;
			this.makePhoneCall();
		},
		cancel2() {
			this.show2 = false;
		},
		close2() {
			this.show2 = false;
		},
		close() {
			this.show3 = false;
		},
		//打报警电话
		makeWarnPhoneCall() {
			uni.makePhoneCall({
				phoneNumber: this.info.warnPhone,
				success: () => {
					console.log('拨打电话成功');
				},
				fail: (err) => {
					console.error('拨打电话失败:', err);
				}
			});
		},
		//打电话
		makePhoneCall() {
			uni.makePhoneCall({
				phoneNumber: this.info.article.phoneNumber,
				success: () => {
					console.log('拨打电话成功');
				},
				fail: (err) => {
					console.error('拨打电话失败:', err);
				}
			});
		},
		// 新增评论
		add(commentReq) {
			console.log('接收评论数据:' + JSON.stringify(commentReq))
			let that=this;
		},
		// // 预览图片单张
		// previewImage(urls) {
		// 	if (!urls) return;
		// 	let _this = this;
		// 	let imgsArray = [];
		// 	imgsArray[0] = urls
		// 	uni.previewImage({
		// 			current: 0,
		// 			urls: imgsArray
		// 	});
		// 	// if (!urls) return;
		// 	// uni.previewImage({
		// 	// 	urls: urls.split('#$#')
		// 	// });
		// },
		splitData(str){
			return str?'':str.split(';');
		},
		addFocus(id,isFocus){
			if (!this.hasLogin) {
				this.showLogin=true;
				return;
			}
			this.$http.get((this.info.article.focusFlag==1?`${deleteFocusUrl}`:`${addFocusUrl}`)+id)
				.then(async r => {
					if(r){
						this.isFocus=!this.isFocus;
						if(this.info.article.focusFlag==1){
							this.info.article.focusFlag=0;
						}else{
							this.info.article.focusFlag=1;
						}
						this.$mHelper.toast(this.info.article.focusFlag==1?"已关注":"已取消");
						//this.$mHelper.toast(this.isFocus?"已关注":"已取消");
					}
				})
				.catch(err => {
					this.isLoading = false;
					uni.stopPullDownRefresh();
				});
		},
		/*加载数据*/
		loadData() {
			this.getArticle();
		},

		//滑动超过200时显示按钮
		handleScrollTop() {
		 if(this.scrollTop<=0)
		 {
				this.scrollTop=1;
				const query = uni.createSelectorQuery().in(this);
				query.select('.comment').boundingClientRect();
				query.exec((res) => {
				 uni.pageScrollTo({
					 scrollTop: res[0].top,
					 duration: 300
				 });
				});
		 }
		 else
		 {
				this.scrollTop=0;
				const query = uni.createSelectorQuery().in(this);
				query.select('.container').boundingClientRect();
				query.exec((res) => {
				 uni.pageScrollTo({
					 scrollTop: res[0].top,
					 duration: 300
				 });
				});

		 }
		},
		// 输入框聚焦
		focusOn(text,placeholder) {console.log('text:',text);
			if (text != null && text.length > 0) {
				this.commentContent=text;
				console.log('commentContent:',this.commentContent);
			}
			if(placeholder){
				this.placeholder=placeholder;
			}
			this.showAddComment=false;
		},
		//格式化评论列表数据结构
		getTree(data) {
			let result = [];
			let map = {};
			data.forEach(item => {
				map[item.id] = item;
				if(map[item.id].children){
					map[item.id].children = []
				}
			});
			data.forEach(item => {
				let parent = map[item.pid];
				if (parent) {
					(parent.children || (parent.children = [])).push(item);
				} else {
					result.push(item);
				}
			});
			return result;
		},
		/*获取文章详情*/
		async getArticle() {
				await this.$http.post(`${view}`+"/"+this.id)
					.then(async res => {
						console.log('res:',res);
						if (res) {
							this.info.article = res;
							this.info.is_favorite=res.favouriteFlag==1?true:false;
							this.info.is_like=res.upvoteFlag==1?true:false;
							this.info.is_report=res.reportFlag?true:false;
							// this.info.coverImage=res.coverImage?this.splitData(res.coverImage):'';
							if(res.coverImage)
							{
								for(var i=0;i<(res.coverImage).split(';').length;i++)
								{
									this.info.coverImage.push(this.fileUrl+(res.coverImage).split(';')[i]);
								}
							}
							this.getComment();// 获取评论
							this.loading=false;

							// this.showPageLoading = false;
							// uni.stopPullDownRefresh();
						} else{
							this.$mHelper.toast(res);
						}
					})
					.catch(err => {
							// uni.stopPullDownRefresh();
					});
		},

		/*文章点赞*/
		async like() {
			if (!this.hasLogin) {
				this.showLogin=true;
				return;
			}
			await this.$http.post(!this.info.is_like?`${addFavouriteAllUrl}`:`${removeFavouriteAllUrl}`,{
				questionId:this.id,
				title:!this.info.is_like?this.info.article.content:'',
				category:'question',
				operateCode:'upvote_article'
			})
			.then(async res => {
				if (res) {
					this.info.is_like = !this.info.is_like;
					let msg = this.info.is_like ? '点赞成功' : '已取消点赞';
					this.$mHelper.toast(msg);
				}
			})
			.catch(err => {
				this.$mHelper.toast(err.msg);
				uni.stopPullDownRefresh();
			});
		},

		/*评论点赞*/
		async commentLike(comment_id,is_comment_like) {
			await this.$http.post(is_comment_like?`${removeFavouriteAllUrl}`:`${addFavouriteAllUrl}`,{
				questionId:comment_id,
				category:'question',
				operateCode:'upvote_comment'
			})
			.then(async res => {
				if (res) {
					this.$refs.hbComment.likeComplete(comment_id);
				}
			})
			.catch(err => {
				this.$mHelper.toast(err.msg);
				uni.stopPullDownRefresh();
			});
		},

		/*收藏*/
		async favorite() {
				if (!this.hasLogin) {
					this.showLogin=true;
					return;
				}
				await this.$http.post(this.info.is_favorite?`${removeFavouriteAllUrl}`:`${addFavouriteAllUrl}`,{
					questionId:this.id,
					title:this.info.is_favorite?'':this.info.article.content,
					category:'question',
					operateCode:'fav'
				})
				.then(async res => {
					if (res) {
						this.info.is_favorite =!this.info.is_favorite ;
						let msg = this.info.is_favorite ? '收藏成功' : '已取消收藏';
						this.$mHelper.toast(msg);
					}
				})
				.catch(err => {
					this.$mHelper.toast(err.msg);
					uni.stopPullDownRefresh();
				});
		},

		/*举报*/
		report(){
			if (!this.hasLogin) {
				this.showLogin=true;
				return;
			}
			if(this.info.is_report){
				uni.navigateTo({url:"/pages/user/report/detail?id="+this.info.article.reportFlag})
			}else{
				uni.navigateTo({url:"/pages/user/report/report?targetId="+this.info.article.id+"&module=question"})
			}
		},

		/*初始化添加评论*/
		initAddComment(status) {
			if (status) {
				//初始化登录
				//this.$app.initLogin();
			}
			this.showAddComment = status;
			this.commentContent = '';
			if (this.replyCommentId > 0) {
				this.replyCommentId = 0;
				this.replyNickname = '';
			}
			this.$refs.hbComment.commentInput();
			setTimeout(() => {
				this.addCommentFocus = status;
			}, 200);
		},

		/**
		* 用于把用utf16编码的字符转换成实体字符，以供后台存储
		* @param  {string} str 将要转换的字符串，其中含有utf16字符将被自动检出
		* @return {string}     转换后的字符串，utf16字符将被转换成&#xxxx;形式的实体字符
		*/
		transEmoji(str) {
			    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
			    str = str.replace(patt, function(char){
			            var H, L, code;
			            if (char.length===2) {
			                H = char.charCodeAt(0); // 取出高位
			                L = char.charCodeAt(1); // 取出低位
			                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
			                return "&#" + code + ";";
			            } else {
			                return char;
			            }
			        });
			    return str;
		},

		/*添加评论或回复*/
		addCommentOrReply(commentReq) {
			this.commentContent =this.transEmoji(commentReq.content);
			this.commentContentImage=commentReq.contentImage;
			this.reUser=commentReq.reUser;
			this.pids=commentReq.pIds;
			console.log("this.commentReq.pIds",this.commentReq);
			if (this.commentContent == '') {
				this.$alert('评论内容不能为空');
				return;
			}
			if (commentReq.pId) {
				this.replyCommentId=commentReq.pId;
				this.addReply();
			} else {
				this.addComment();
			}
		},

		/*添加评论*/
		async addComment() {
			await this.$http.get(`${addCommentUrl}`,{
				tid:this.id,
				content: this.commentContent,
				contentImage: this.commentContentImage,
				type:'question'
			})
			.then(async res => {
				if (res) {
					this.commentList=[res,...this.commentList];
					this.commentData.comment=this.getTree(this.commentList);
					this.commentData.commentSize++;
					this.showAddComment = false;
					this.commentContent = '';
					this.replyCommentId=null;
					this.reUser=null;
					this.pids=null;
					this.$mHelper.toast('评论成功');
					this.$refs.hbComment.addComplete();
				}
			})
			.catch(err => {
				this.$mHelper.toast(err.msg);
				uni.stopPullDownRefresh();
			});
		},

		/*添加回复*/
		async addReply(pId) {
			await this.$http.get(`${addCommentUrl}`,{
				tid:this.id,
				pid:this.replyCommentId,
				pids:this.pids,
				email:this.reUser,
				content: this.commentContent,
				contentImage: this.commentContentImage,
				type:'question'
			})
			.then(async res => {
				if (res) {
					//this.getComment();
					this.commentList=[res,...this.commentList];
					this.commentData.comment=this.getTree(this.commentList);
					this.commentData.commentSize++;
					this.showAddReply = false;
					this.commentContent = '';
					this.replyCommentId=null;
					this.reUser=null;
					this.pids=null;
					this.$mHelper.toast('回复成功');
					this.$refs.hbComment.addComplete();
				}
			})
			.catch(err => {
				//myalert(err.msg);
				uni.stopPullDownRefresh();
			});
		},

		/*删除评论*/
		async del(comment_id) {
			await this.$http.get(`${deleteCommentUrl}`,{
				id:comment_id
			})
			.then(async res => {
				if (res) {
					let index0 = this.commentList.findIndex(item => {
					       if (item.id == comment_id) {
					            return true
					       }
					})
					this.commentData.commentSize--;
					this.commentList.splice(index0, 1)

					this.commentData.comment=this.getTree(this.commentList);
					this.$mHelper.toast('删除成功');
					this.$refs.hbComment.addComplete();
				}
			})
			.catch(err => {
				this.$mHelper.toast(err.msg);
				uni.stopPullDownRefresh();
			});
		},

		/*查看个人信息*/
		goPersonal(item) {
			if (this._isWidescreen) { //若为宽屏，则触发右侧详情页的自定义事件
			  uni.$emit('updateDetail', {
				item: encodeURIComponent(JSON.stringify(item))
			  })
			} else {
			  uni.navigateTo({
				url: '/pages/user/personal/index?uid='+item.yhid
			  });
			}
		},

		/*初始化回复*/
		initAddReply(comment_id, nickname) {
			this.initAddComment(true);
			this.replyCommentId = comment_id;
			this.replyNickname = nickname;
		},

		/*获取评论*/
		async getComment() {
			await this.$http.get(`${commentListUrl}`,{
				pageNum:this.pageNum,
				pageSize:5,
				tid:this.id,
				type:'question'
			})
			.then(async res => {

				if (res.list.length>0) {
					this.commentData.commentSize=res.rows;
					this.pageList=res.list;
					this.commentList=[...this.commentList,...res.list];
					console.log('commentList:',this.commentList);
					this.commentData.comment=this.getTree(this.commentList);
					// this.initMPShare(); //公众号分享
					if(res.list.length<5){
						this.loadingType="nomore";
					}
				} else {
					this.loadingType="nomore";
				}
				// this.showPageLoading = false;
			})
			.catch(err => {
					uni.stopPullDownRefresh();
			});
		},

			/*阅读*/
			async read() {
				await this.$http.post(`${addFavouriteAllUrl}`,{
					questionId:this.id,
					title:this.info.article.content,
					category:'question',
					operateCode:'hit',
				})
				.then(async res => {
					if (res) {
						//this.$mHelper.toast(res);
					}
				})
				.catch(err => {
					this.$mHelper.toast(err.msg);
					uni.stopPullDownRefresh();
				});
			},

		/*打开外部链接*/
		openLink(url) {
			console.log(url);
			window.location.href = url;
		},

		/*关闭H5分享*/
		closeH5Share() {
			this.showH5Share = false;
		},

		/*关闭微信分享提示*/
		closeShareTip() {
			this.showShareTip = false;
		},
		/*显示浏览器分享提示*/
		showBrowserShareTips() {
			this.showH5Share = false;
			this.showBrowserShareTip = true;
		},
		/*关闭浏览器分享提示*/
		closeBrowserShareTip() {
			this.showBrowserShareTip = false;
		},

		/*分享*/
		share() {
			// #ifdef H5
			if (util.isWechatOrQQ()) {
				this.showShareTip = true;
			} else {
				this.showH5Share = true;
			}
			// #endif

			console.log('share');

			// #ifdef MP
			uni.showShareMenu();
			// #endif
		},

		/*初始化公众号分享*/
		initMPShare() {
			// #ifdef H5
			let domain = location.href.split('/pages/')[0];
			/*分享链接*/
			let link = domain + '/pages/article/detail?id=' + this.info.id;
			if (this.$app.isWechat()) {
				/*初始化分享*/
				wechatMP.initShare(this, {
					title: this.info.title,
					desc: '',
					link: link,
					imgUrl: this.info.photo_url
				});
			} else {
				this.shareUrl = link;
			}
			// #endif
		},

		/*跳转至评论详情*/
		redirectCommentDetail(id, replyCount) {
			if (replyCount > 0) {
				uni.navigateTo({
					url: 'commentDetail?id=' + info.comment.id
				});
			}
		},

		/*复制*/
		copyText(text) {
			uni.setClipboardData({
				data: text,
				success: res => {
					this.$alert('原文链接已复制', 'success');
				}
			});
		},

		/*弹窗*/
		myalert(text) {
			this.msgText = text;
			this.$refs.popup.open();
			setTimeout(() => {
				this.$refs.popup.close()
			}, 1000);
		},

		// 锚点定位
		toHref(className) {
			  let thas = this
				// 先定位到顶方
			  uni.pageScrollTo({
				  scrollTop: 0,
				  duration: 0
			  });
			// 再调用此方法回到相应位置  id为项目中要回到指定位置的元素的id
			uni.createSelectorQuery().select(className).boundingClientRect(function(rect){
				console.log(rect, 'rect')
				uni.pageScrollTo({
					scrollTop: rect.top,
					duration: 300
				});
				  // rect.id      // 节点的ID
				  // rect.dataset // 节点的dataset
				  // rect.left    // 节点的左边界坐标
				  // rect.right   // 节点的右边界坐标
				  // rect.top     // 节点的上边界坐标
				  // rect.bottom  // 节点的下边界坐标
				  // rect.width   // 节点的宽度
				  // rect.height  // 节点的高度
			}).exec()
		},

		/*返回首页*/
		toHome() {
			this.$mRouter.reLaunch({ route: '/pages/index/index' });
		},

		// 登录
		confirmLogin(){
			this.showLogin=false;
			uni.setStorageSync('backToPage', '/pages/project/view?id='+this.id);
			this.$mRouter.push({ route: '/pages/public/loginMethod' });
		},
	}
};
</script>

<style scoped lang="scss">
.grid-text
{
	font-size: 12px;
}
page {
	background-color: $color-white;
}
.detail {
	padding: 30rpx 30rpx;
	background: #fff;
	.title {
		font-size: 36rpx;
		color: #262626;
		line-height: 50rpx;
		font-weight: bold;
	}
	.info {
		/* margin-top: 26rpx; */
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	.source-date {
			.source {
				/*color: #666;*/
				font-size: 32upx;
				color: #303133;
				line-height: 46upx;
			}
			.date {
				color: #999;
				margin-left: 24rpx;
			}
		}
		.read {
			color: #999;
		}
	}
	.desc {
		margin-top: 50rpx;
		overflow: hidden;
		color: #262626;
		.wxParse {
			color: #262626;
		}
	}
}
.comment {
	padding: 20rpx 32rpx 0;
	background: #fff;
	.title {
		display: flex;
		align-items: center;
		font-size: 36rpx;
		color: #262626;
		font-weight: bold;
		border-bottom: 1rpx solid #eee;
		text {
			padding-bottom: 20rpx;
			line-height: normal;
		}
		.count {
			padding-bottom: 20rpx;
			font-size: 30rpx;
			color: #999;
			margin-left: 10rpx;
			line-height: normal;
		}
	}
	.item {
		display: flex;
		justify-content: space-between;
		padding: 30rpx 0 20rpx;
		border-bottom: 1rpx solid #eee;
		&:last-child {
			border-bottom: 0;
		}
		.avatar {
			flex-grow: 0;
			flex-shrink: 0;
			margin-right: 20rpx;
			image {
				width: 45rpx;
				height: 45rpx;
				border-radius: 50%;
			}
		}
		.comment-info {
			flex-grow: 1;
			flex-shrink: 1;
			.nickname-like {
				display: flex;
				justify-content: space-between;
				.nickname {
					font-size: 32rpx;
					color: #444;
					font-weight: bold;
				}
				.like {
					display: flex;
					align-items: center;
					image {
						width: 32rpx;
						height: 32rpx;
						margin-right: 14rpx;
					}
					.like-count {
						color: #999;
						font-size: 30rpx;
					}
				}
			}
			.comment-desc {
				color: #444;
				font-size: 32rpx;
				line-height: 1.6;
				margin-top: 15rpx;
			}
			.reply-count {
				background: #f2f2f2;
				padding: 8rpx 20rpx;
				font-size: 30rpx;
				color: #999;
				margin: 20rpx 0 24rpx;
			}
			.date-reply {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.date {
					display: flex;
					align-items: center;
					color: #b4b4b4;
					font-size: 28rpx;
					margin-right: 20rpx;
					margin-top: 4rpx;
				}
				.reply {
					flex-grow: 0;
					flex-shrink: 0;
					font-size: 28rpx;
					color: #999;
				}
			}
		}
	}
	.no-comment {
		padding: 40rpx 0;
		color: #999;
		font-size: 30rpx;
	}
}

.comment-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 120rpx;
	background-color: #ffffff;
	box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.3);
	display: flex;
	flex-direction: row;
	.input {
		flex-grow: 0;
		flex-shrink: 0;
		margin: 20rpx 10rpx 20rpx 20rpx;
		display: flex;
		align-items: center;
		background: #f2f2f2;
		width: 480rpx;
		border-radius: 40rpx 40rpx 40rpx 40rpx;
		text {
			font-size: 32rpx;
			color: #aaa;
			margin-left: 38rpx;
		}
	}
	.operate {
		width: 100%;
		flex-grow: 1;
		flex-shrink: 1;
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-right: 10rpx;
		view,
		navigator {
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 25%;
			image {
				width: 45rpx;
				height: 45rpx;
			}
		}
		.info,
		.like {
			position: relative;
			.count {
				position: absolute;
				top: -15rpx;
				right: -4rpx;
				//background-color: #007AFF;
				display: flex;
				align-items: center;
				border-radius: 50rpx;
				padding: 0 10rpx;
				font-size: 22rpx;
				color: #fff;
				height: 30rpx;
				line-height: 30rpx;
			}
		}
		.share {
			display: flex;
			justify-content: space-around;
			padding: 0;
			background: transparent;
			image {
				width: 45rpx;
				height: 45rpx;
				border: 0;
			}
			&:after {
				display: none;
			}
		}
	}
}
.float-empty {
	height: 120rpx;
	width: 100%;
	display: block;
	background: #fff;
}
.add-comment {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #ffffff;
	z-index: 9999;
	.info {
		display: flex;
		flex-direction: row;
		padding: 20rpx 20rpx 20rpx 20rpx;
		.input {
			flex-grow: 1;
			flex-shrink: 1;
			display: flex;
			align-items: center;
			background: #f2f2f2;
			border-radius: 40rpx 40rpx 0 40rpx;
			padding: 20rpx 32rpx 20rpx;
			line-height: normal;
			textarea {
				//padding: 10rpx 0;
				width: 100%;
				font-size: 32rpx;
				line-height: 42rpx;
				background: #f2f2f2;
			}
		}
		.add {
			flex-grow: 0;
			flex-shrink: 0;
			width: 150rpx;
			display: flex;
			align-items: center;
			margin-left: 10rpx;
		}
		.cancel {
			position: absolute;
			right: 10rpx;
			top: 2rpx;
			/deep/.icon {
				font-size: 40rpx;
				color: #ccc;
			}
		}
	}
}
.h5-share {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #ffffff;
	border-top: 1rpx solid #ddd;
	padding-top: 20rpx;
	padding-bottom: 20rpx;
	.title {
		font-size: 30rpx;
		text-align: center;
		height: 50rpx;
	}
	.share-icon {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		view {
			flex-grow: 0;
			flex-shrink: 0;
			text-align: center;
			image {
				margin-top: 35rpx;
				width: 80rpx;
				height: 80rpx;
			}
			text {
				display: block;
			}
		}
	}
	.share-btn {
		margin: 30rpx 30rpx 15rpx;
		border: 1rpx solid #ffd100;
		background: #ffd100;
		border-radius: 15rpx;
		font-size: 32rpx;
		text-align: center;
		padding: 12rpx 0;
		color: #fff;
	}
}
.share-maske {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.6);
	z-index: 99999;
	.share-tip {
		position: absolute;
		top: 100rpx;
		left: 0;
		text-align: center;
		.share-tip-info {
			height: 240rpx;
		}
		.share-tip-btn {
			margin-top: 400rpx;
			height: 82rpx;
		}
	}
	.share-browser-tip {
		top: 300rpx;
		.share-tip-info {
			height: 240rpx;
		}
		.share-tip-btn {
			margin-top: 200rpx;
		}
	}
}
.declaration {
	margin: 50rpx 0;
	font-size: 34rpx;
	color: #999;
}
.uni-popup-share {
	background-color: #fff;
}

.uni-share-title {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 40px;
}

.uni-share-title-text {
	font-size: 14px;
	color: #666;
}

.uni-share-content {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	justify-content: center;
	padding-top: 10px;
}

.uni-share-content-box {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	flex-wrap: wrap;
	width: 360px;
}

.uni-share-content-item {
	width: 90px;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	justify-content: center;
	padding: 10px 0;
	align-items: center;
}

.uni-share-content-item:active {
	background-color: #f5f5f5;
}

.uni-share-image {
	width: 30px;
	height: 30px;
}

.uni-share-text {
	margin-top: 10px;
	font-size: 14px;
	color: #3B4144;
}

.uni-share-button-box {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	padding: 10px 15px;
}

.uni-share-button {
	flex: 1;
	border-radius: 50px;
	color: #666;
	font-size: 16px;
}

.uni-share-button::after {
	border-radius: 50px;
}


.follow{
	margin-right: 20rpx;
}
.follow2{
	margin-right: 20rpx;
	color: #007AFF;
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

.u-page__tag-item {
	margin: 2upx 0 5upx 0;
}

.u-demo-block__content {
  display: inline-flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
}

/deep/ .u-tag{
    display: inline-flex;
}

.grid-text{
	line-height: 1;
}
/deep/ .u-grid-item{
	height: 68px;
	padding-bottom: calc(env(safe-area-inset-bottom) / 2);
}

.u-page__tag-item2 {
	margin: 2px;
}

.album {
	@include flex;
	align-items: flex-start;

	&__avatar {
		background-color: $u-bg-color;
		padding: 5px;
		border-radius: 3px;
	}

	&__content {
		margin-left: 10px;
		flex: 1;
	}
}

.time{
	font-size: 26upx;
	color: #aaa;
	margin-left: 20upx;
}
</style>
