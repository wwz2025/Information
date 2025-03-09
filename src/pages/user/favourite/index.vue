<template>
	<view class="content">
		<u-modal
			:content="content"
			:show="showLogin"
			@confirm="confirmLogin"
		></u-modal>
		<!--页面加载动画-->
		<u-loading-page
			:loadingText="loadingPageData.loadingText"
			:loadingMode="loadingPageData.loadingMode"
			:loading="loading"
			:color="loadingPageData.color"
			:loadingColor="loadingPageData.loadingColor"
		>
		</u-loading-page>

		<!--搜索-->
		<view class="u-demo-block__content m-t-10" v-if="loadingTab>0">
			<view class="u-page__tag-item">
				<u-search
					class="u-search"
					v-model="title"
					:show-action="false"
					:search-icon-color="themeColor.color"
					@clickIcon="search"
					@clear="search"
					@change="search"
				></u-search>
			</view>
		</view>

		<!-- 顶部选项卡 -->
		<u-tabs
			:list="tabBars"
			lineWidth="40"
			:lineColor="themeColor.color"
			:activeStyle="{
							color:themeColor.color,
							fontWeight: 'bold',
							transform: 'scale(1.05)'
						}"
			:inactiveStyle="{
							transform: 'scale(1)'
						}"
			@click="changeTab"
			:current="tabCurrentIndex"
			itemStyle="padding-left: 10px; padding-right: 10px; height: 34px;"
		>
		</u-tabs>

		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll" :text="pulldownText">
			<!-- 内容部分 -->
			<swiper
				id="swiper"
				class="swiper-box"
				:duration="300"
				:current="tabCurrentIndex"
				@change="changeTab"
			>
				<swiper-item v-for="tabItem in tabBars" :key="tabItem.id">
					<scroll-view
						class="panel-scroll-box"
						:scroll-y="enableScroll"
						@scrolltolower="loadMore"
						>
						<!--
							* 新闻列表
							* 和nvue的区别只是需要把uni标签转为weex标签而已
							* class 和 style的绑定限制了一些语法，其他并没有不同
						-->
						<view v-for="(item, index) in tabItem.newsList" :key="index" class="news-item" @click="navToCmsDetails(item)"  v-if="tabItem.newsId=='fav' || tabItem.newsId=='upvote_article' || tabItem.newsId=='hit'">
								<text :class="['title', 'title'+item.type]" >
									{{item.title}}
								</text>
								<view :class="['bot', 'bot'+item.type]" style="flex-direction: row;display: flex;justify-content: space-between;">
									<text class="author">{{item.favouriteTime}}</text>
									<view class="close-view" @click.stop="cancel(item)" >
										<view class="close-l close-h"></view>
										<view class="close-l close-v"></view>
									</view>
								</view>
								<view class="media-item-line" ></view>
						</view>

						<view v-for="(item, index) in tabItem.newsList" :key="index" class="news-item" @click="navToCommentClick(item)"  v-if="tabItem.newsId=='comment'">
							<view class="comment-top" >
								<view class="comment-avatar">
									<u-avatar :src="item.avatar?fileUrl+item.avatar:headImg" mode="circle" size="30"></u-avatar>
									<view class="nick-name" style="margin: 8rpx 10rpx;">{{item.userName}}:</view>
								</view>
								<view class="close-view" @click.stop="del(item.id,index)" >
									<view class="close-l close-h"></view>
									<view class="close-l close-v"></view>
								</view>
							</view>
							<view class="comment-content">
								<view>
									<rich-text :nodes="item.content" style="width: 500rpx;"></rich-text>
								</view>
								<view>
									<text class="info-text">{{item.address}}</text>
								</view>
							</view>
							<view isShadow class="article-card">
									<text :class="['title', 'title'+item.type]" >
										{{item.article.title}}
									</text>
									<view :class="['bot', 'bot'+item.type]" >
										<text class="author">{{item.article.createTime}}</text>
									</view>
							</view>
							<view class="media-item-line" ></view>
						</view>

						<!-- 加载更多 0加载前，1加载中，2没有更多了，3没有数据-->
						<block v-if="tabItem.loadMoreStatus==3 && loading==false && tabItem.loaded == true && tabItem.newsList.length==0">
							<view class="no-data">
								<u-empty text="暂无数据" :iconColor="themeColor.color" mode="data"  v-if="tabItem.newsList.length === 0  && loading==false">
								</u-empty>
							</view>
						</block>
						<block v-if="tabItem.loadMoreStatus==0 && loading==false && tabItem.loaded == true && tabItem.newsList.length>0">
							<u-loadmore  :loadmoreText="'上拉显示更多'"  ></u-loadmore>
						</block>
						<block v-if="(tabItem.loadMoreStatus==1 ||tabItem.loadMoreStatus==2)   && loading==false && tabItem.loaded == true && tabItem.newsList.length>0">
							<u-loadmore  :status="tabItem.loadMoreStatus==1?'loading':'nomore'"></u-loadmore>
						</block>

					</scroll-view>
				</swiper-item>
			</swiper>
		</mix-pulldown-refresh>

	</view>
</template>

<script>
	import { myFavouriteUrl,fansListUrl,focusListUrl,addFocusUrl,deleteFocusUrl} from '@/api/profile';

	import { getMessageListUrl,updateReadFlagUrl} from '@/api/forum';
	import {removeFavouriteAllUrl,deleteCommentUrl} from '@/api/cms';


	import mixAdvert from '@/components/mix-advert/vue/mix-advert';
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	let windowWidth = 0, scrollTimer = false, tabBar;

	export default {
		components: {
			mixPulldownRefresh,
			mixAdvert
		},
		data() {
			return {
				content: '您好，请先登录，再使用！',
				showLogin: false,

				startTime:0,//开始时间-毫秒
				endTime:0,//结束时间-毫秒
				timeTaken: 0,//计算并更新耗时

				pulldownText:'',//下拉刷新文字提醒
				backgroundColor: '', // 动态背景颜色的初始值
				loading: true,
				loadingTab: 0,
				loadingPageData: {
					// 自定义提示内容
					loadingText: this.$mSettingConfig.appName,
					// 自定义加载动画模式
					loadingMode: 'semicircle',
					// 自定义背景色
					color: '#C8C8C8',
					loadingColor: '#C8C8C8'
				},
				title: '',
				headImg: this.$mAssetsPath.headImg,//空白头像
				fileUrl:this.$mConfig.fileUrl, //文件路径
				pageNum:1,//页码
				pageSize:20,//每页的数量
				tabCurrentIndex: 0, //当前选项卡索引
				tabQueryCurrentIndex: 0, //外部传参进来的选项卡索引
				scrollLeft: 0, //顶部选项卡左滑距离
				enableScroll: true,
				tabBars: [
					{id: "0",name: '收藏',newsId: "fav",region:'',tagId:'cms',newsList:[],refreshing:0,
						loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
							badge: {
							isDot: true
						},
						loaded : false
					},
					// {id: "1",name: '评论',newsId: "comment",region:'',tagId:'cms',newsList:[],refreshing:0,
					// 	loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
					// },
					{id: "2",name: '点赞',newsId: "upvote_article",region:'',tagId:'cms',newsList:[],refreshing:0,
						loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
						loaded : false
					},
					{id: "3",name: '历史',newsId: "hit",region:'',tagId:'cms',newsList:[],refreshing:0,
						loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
						loaded : false
					},
					{id: "4",name: '举报',newsId: "report",region:'',tagId:'cms',newsList:[],refreshing:0,
						loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
						loaded : false
					},

				],
			}
		},
		computed: {
			dynamicStyle() {
				this.backgroundColor= this.themeColor.color; // 动态背景颜色的初始值
				return {
					'--dynamic-background-color': this.backgroundColor,
				};
			},
			advertNavUrl(){
				let data = {
					title: '测试跳转新闻详情',
					author: '测试作者',
					time: '2019-04-26 21:21'
				}
				return `/pages/details/details?data=${JSON.stringify(data)}`;
			}
		},
		async onLoad(e) {
			this.hasLogin = this.$mStore.getters.hasLogin;
			if (this.hasLogin) {
				// this.initData();
				// 获取屏幕宽度
				windowWidth = uni.getSystemInfoSync().windowWidth;
				if(e.index){
					this.tabCurrentIndex=parseInt(e.index || '0');
					this.tabQueryCurrentIndex=parseInt(e.index || '0');
					// this.tabBars[this.tabCurrentIndex].loaded = true;
				}
				this.loadTabbars();
			} else {
				this.showLogin=true;
				// uni.setStorageSync('backToPage', '/pages/index/favourite');
				// this.$mRouter.push({ route: '/pages/public/loginMethod' });
				// this.navTo('/pages/public/loginMethod');
			}
		},
		onReady(){
			/**
			 * 启动页广告 使用文档（滑稽）
			 * 1. 引入组件并注册
			 * 		import mixAdvert from '@/components/mix-advert/vue/mix-advert';
			 *      components: {mixAdvert},
					 <!-- #ifndef MP -->
						<mix-advert
							ref="mixAdvert"
							:timedown="8"
							imageUrl="/static/advert.png"
							:url="advertNavUrl"
						></mix-advert>
					<!-- #endif -->
			 * 	2. 调用组件的initAdvert()方法进行初始化
			 *
			 *  初始化的时机应该是在splash关闭时，否则会造成在app端广告显示了数秒后首屏才渲染出来
			 */
			// // #ifndef MP
			// this.$refs.mixAdvert.initAdvert();
			// // #endif
		},
		methods: {
			// 登录
			confirmLogin(){
				this.showLogin=false;
				uni.setStorageSync('backToPage', '/pages/index/favourite');
				this.$mRouter.push({ route: '/pages/public/loginMethod' });
			},
			// 搜索
			search(){
				this.tabBars[this.tabCurrentIndex].loadMoreStatus=0;//0加载前
				this.loadNewsList('refresh');
			},
			/**
			 * 数据处理方法在vue和nvue中通用，可以直接用mixin混合
			 * 这里直接写的
			 * mixin使用方法看index.nuve
			 */
			//获取分类
			loadTabbars(){
				this.loadNewsList('add');
				this.tabBars[this.tabCurrentIndex].loaded = true;
				// this.tabBars[0].loaded = true;
			},
			//新闻列表
			loadNewsList(type){
				let that=this;
				// 记录开始时间
				this.startTime = Date.now();

				let tabItem = this.tabBars[this.tabCurrentIndex];

				if(!this.loading)
				{
					//type add 加载更多 refresh下拉刷新
					if(type === 'add'){
						if(tabItem.loadMoreStatus === 2){
							return;
						}
						tabItem.loadMoreStatus = 1;
					}
					// #ifdef APP-PLUS
					else if(type === 'refresh'){
						tabItem.refreshing = true;
					}
					// #endif
				}

				this.pulldownText="";
				this.$http.get(`${myFavouriteUrl}`,
							{
								pageNum:this.pageNum,
								pageSize:this.pageSize,
								operateCode:tabItem.newsId,
								yhid:uni.getStorageSync('userInfo').userId,
								// category:tabItem.tagId,
								title:this.title
							}
						)
						.then(async r => {
							// 记录结束时间
							that.endTime = Date.now();
							// 计算并更新耗时
							that.timeTaken = that.endTime - that.startTime;

							let list = r.list;
							if(type === 'refresh'){
								tabItem.newsList = []; //刷新前清空数组
							}
							// list.forEach(item=>{
							// 	// if(item.coverImage)
							// 	// {
							// 	// 	item.type="2";
							// 	// }
							// 	item.type="0";
							// 	tabItem.newsList.push(item);
							// })

							//下拉刷新 关闭刷新动画
							if(type === 'refresh'){
								list.forEach(item=>{
									item.type="0";
									tabItem.newsList.push(item);
								})
								setTimeout(()=>{
									// this.loading = false;
									this.pulldownText="已是最新数据";
							  	}, that.timeTaken>300?0:300-that.timeTaken)
								setTimeout(() => {
									// this.loading = false;
									this.pulldownText = "";
								}, that.timeTaken > 300 ? 300 : 600 - that.timeTaken)
							  	//数据量小，性能高的时候，使用setTimeout，让用户感知刷新
							  	setTimeout(()=>{
							  		this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
							  		// #ifdef APP-PLUS
							  		tabItem.refreshing = false;
							  		// #endif
							  		tabItem.loadMoreStatus =r.isFirstPage && r.list.length===0?3:(r.isLastPage ? 2: 0);//3是没有数据，2是最后一页，否则就是0有更多数据可以加载
							  	}, that.timeTaken>800?0:800-that.timeTaken)
							  }
							//上滑加载 处理状态
							if(type === 'add'){
								if(r.isFirstPage)
								{
									//第一页初次加载，300
									setTimeout(()=>{
										this.loading = false;
										tabItem.loadMoreStatus =r.isFirstPage && r.list.length===0?3:(r.isLastPage ? 2: 0);//3是没有数据，2是最后一页，否则就是0有更多数据可以加载

										setTimeout(()=>{
													list.forEach(item=>{
															item.type="0";
														tabItem.newsList.push(item);
													})
												}, that.timeTaken>400?0:400-that.timeTaken)
									}, that.timeTaken>300?0:300-that.timeTaken)
								}
								else
								{
									//没有数据的时候，使用setTimeout，让用户感知隐藏刷新和显示无数据的时间间隔
									setTimeout(()=>{
										tabItem.loadMoreStatus =r.isFirstPage && r.list.length===0?3:(r.isLastPage ? 2: 0);//3是没有数据，2是最后一页，否则就是0有更多数据可以加载
										setTimeout(()=>{
													list.forEach(item=>{
															item.type="0";
														tabItem.newsList.push(item);
													})
												}, that.timeTaken>300?0:300-that.timeTaken)
									}, that.timeTaken>300?0:300-that.timeTaken)
								}


							}

							this.loadingTab=1;//显示选项卡
							// if(type === 'refresh' && tabItem.loadMoreStatus === 2){
							// 	this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
							// 	tabItem.refreshing = false;
							// 	return;
							// }
						})
						.catch(err => {
							this.loading = false;
							if(type === 'refresh'){
								uni.stopPullDownRefresh();
							}
					});
			},
			// //新闻详情
			// navToDetails(item){
			// 	uni.navigateTo({
			// 		url:'/pages/question/addMsg?userId='+item.fromId+'&userName='+item.fromName+'&msgId='+item.id+'&type='+item.type
			// 		// '&questionContent='+item.htmlContent
			// 	})
			// },

			//下拉刷新
			onPulldownReresh(){
				this.pageNum=1;
				this.loadNewsList('refresh');
			},
			//上滑加载
			loadMore(){
				//没有数据禁止上滑加载
				if(this.tabBars[this.tabCurrentIndex].loadMoreStatus!==3)
				{
					this.pageNum++;
					this.loadNewsList('add');
				}
			},
			//设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
			setEnableScroll(enable){
				if(this.enableScroll !== enable){
					this.enableScroll = enable;
				}
			},

			//tab切换
			async changeTab(e){
				this.loadingState = 2;
					if(scrollTimer){
						//多次切换只执行最后一次
						clearTimeout(scrollTimer);
						scrollTimer = false;
				}
				let index = e.index;
				//e=number为点击切换，e=object为swiper滑动切换
				if (typeof e.index === 'number') {
					index = e.index;
					this.tabCurrentIndex = index;
				}
				else
				{
					index = e.detail.current;
					this.tabCurrentIndex = index;
				}
				//延迟300ms,等待swiper动画结束再修改tabbar
				scrollTimer = setTimeout(()=>{

					//第一次切换tab，动画结束后需要加载数据
					let tabItem = this.tabBars[this.tabCurrentIndex];

					//外部传参，不同选项卡首次加载
					// if(this.tabCurrentIndex !== 0 && tabItem.loaded !== true){
					if(this.tabCurrentIndex !== this.tabQueryCurrentIndex && tabItem.loaded !== true){
						this.loading = true;//第一次切换tab，需要加载动画
						this.loadNewsList('add');
						tabItem.loaded = true;
					}
				}, 300)

			},
			//获得元素的size
			getElSize(id) {
				return new Promise((res, rej) => {
					let el = uni.createSelectorQuery().select('#' + id);
					el.fields({
						size: true,
						scrollOffset: true,
						rect: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},

			navToCmsDetails(detail) {
					let	id=detail.questionId;
					let	category=detail.category;
					if(category=='cms')
					{
						uni.navigateTo({url:"/pages/cms/view?id="+id})
					}
					else  if(category=='question')
					{
						uni.navigateTo({url:"/pages/question/view?id="+id})
					}
			},

			navToCommentClick(obj){
				let id=obj.tid;
				let commentId=obj.id;
				let category=obj.type;
				if(category=='cms')
				{
					uni.navigateTo({url:"/pages/cms/view?id="+id+"&commentId="+commentId})
				}
				else  if(category=='question')
				{
					uni.navigateTo({url:"/pages/question/view?id="+id+"&commentId="+commentId})
				}
			},
			/*删除评论*/
			del(comment_id,index) {
				let pageList=this.tabBars[this.tabCurrentIndex].newsList;
				uni.showModal({
					content: '删除评论？',
					success: (res) => {
						if (res.confirm) {
							this.$http.get(`${deleteCommentUrl}`,{id:comment_id})
								.then(async res => {
									if (res) {
										pageList = pageList.filter(obj => obj.id !== res);
										this.tabBars[this.tabCurrentIndex].newsList=pageList;
										this.$mHelper.toast("已移除！");
									}
								})
								.catch(err => {
									this.$mHelper.toast(err.msg);
									uni.stopPullDownRefresh();
								});
						}
					}
				})
			},
			/*取消收藏、点赞、历史、浏览*/
			cancel(item) {
				let pageList=this.tabBars[this.tabCurrentIndex].newsList;
				uni.showModal({
					content: '不感兴趣？',
					success: (res) => {
						if (res.confirm) {
							//取消收藏
							this.$http.post(`${removeFavouriteAllUrl}`,{
								questionId:item.questionId,
								title:item.title,
								category:item.category,
								operateCode:item.operateCode
							})
								.then(async res => {
									if (res) {
										pageList = pageList.filter(obj => obj.id !== item.id);
										this.tabBars[this.tabCurrentIndex].newsList=pageList;
										this.$mHelper.toast("已移除！");
									}
								})
								.catch(err => {
									this.$mHelper.toast(err.msg);
									// uni.stopPullDownRefresh();
								});
						}
					}
				})
			},
		}
	}
</script>

<style lang='scss'>

	page, .content{
		background-color: $page-color-base;
		height: 100%;
		overflow: hidden;
	}

	.content{
		background-color: $color-white;
	}
	/* 顶部tabbar */
	.nav-bar{
		position: relative;
		z-index: 10;
		height: 90upx;
		white-space: nowrap;
		box-shadow: 0 2upx 8upx rgba(0,0,0,.06);
		background-color: #fff;
		.nav-item{
			display: inline-block;
			width: 150upx;
			height: 90upx;
			text-align: center;
			line-height: 90upx;
			font-size: 30upx;
			color: #303133;
			position: relative;
			&:after{
				content: '';
				width: 0;
				height: 0;
				border-bottom: 4upx solid  var(--dynamic-background-color); /* 使用CSS变量 */
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				transition: .3s;
			}
		}
		.current{
			color: var(--dynamic-background-color);
			&:after{
				width: 50%;
			}
		}
	}

	.swiper-box{
		/*height: 100%;*/
		/*  #ifdef  MP  */
		height: calc(100% - 22px);
		/*  #endif  */
		/*  #ifdef  H5  */
		height: calc(100% - 5px) ;
		/*  #endif  */
		/*  #ifdef  APP-PLUS  */
		height: calc(100% - 5px) ;
		/*  #endif  */
	}

	.u-loadmore {
	    padding-bottom: 20px;
	}

	.panel-scroll-box{
		height: 100%;

		.panel-item{
			background: #fff;
			padding: 30px 0;
			border-bottom: 2px solid #000;
		}
	}

	/**
	 * 新闻列表 直接拿的nvue样式修改，,
	 * 一共需要修改不到10行代码, 另外px需要直接修改为upx，只有单位不一样，计算都是一样的
	 * 吐槽：难道不能在编译的时候把nuve中的upx转为px? 这样就不用修改单位了
	 */
	.video-wrapper{
		width: 100%;
		height: 440upx;
		.video{
			width: 100%;
		}
	}

	view{
		display:flex;
		flex-direction: column;
	}
	.img{
		width: 100%;
		height: 100%;
	}
	.news-item{
		position:relative;
	}
	/* 修改结束 */

	/* 新闻列表  emmm 仅供参考 */
	.news-item{
		width: 750upx;
		padding: 24upx 30upx;
		border-bottom-width: 1px;
		border-color: #eee;
		background-color: #fff;
	}
	.title{
		font-size: 32upx;
		color: #303133;
		line-height: 46upx;
	}
	.bot{
		flex-direction: row;
	}
	.author{
		font-size: 26upx;
		color: #aaa;
	}
	.time{
		font-size: 26upx;
		color: #aaa;
		margin-left: 20upx;
	}
	.img-list{
		flex-shrink: 0;
		flex-direction: row;
		background-color: #fff;
		/*width: 220upx;
		height: 140upx;*/
	}
	.img-wrapper{
		flex: 1;
		flex-direction: row;
		height: 140upx;
		position: relative;
		overflow: hidden;
	}
	.img{
		flex: 1;
	}
	.img-empty{
		height: 20upx;
	}

	/* 图在左 */
	.img-list1{
		position:absolute;
		left: 30upx;
		top: 24upx;
	}
	.title1{
		padding-left: 120upx;
	}
	.bot1{
		padding-left: 120upx;
		margin-top: 20upx;
	}
	/* 图在右 */
	.img-list2{
		position:absolute;
		right: 30upx;
		top: 24upx;
	}
	.title2{
		padding-right: 210upx;
	}
	.bot2{
		margin-top: 20upx;
	}
	/* 底部3图 */
	.img-list3{
		width: 700upx;
		margin: 16upx 0upx;
	}
	.img-wrapper3{
		margin-right: 4upx;
	}
	/* 底部大图 */
	.img-list-single{
		width: 690upx;
		height: 120upx;
		margin: 16upx 0upx;
	}
	.img-wrapper-single{
		height: 120upx;
		margin-right: 0upx;
	}

	.video-tip{
		position: absolute;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.3);
	}
	.video-tip-icon{
		width: 60upx;
		height:60upx;
	}

	.u-page_tag-item {
		margin-right: 20px;
	}

	.u-demo-block_content {
		display: inline-flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
	}

	.media-info {
		margin-top: 26rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.media-foot {
		margin-top: 6px;
		margin-bottom: 20px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.flex-row {
		flex-direction: row;
	}

	.media-item-line {
		position: absolute;
		left: 15px;
		right: 15px;
		bottom: 0;
		height: 1px;
		background-color: #ebebeb;
	}

	.info-text {
		color: #999999;
		font-size: 12px;
	}

	.right-data{
		text-align: right;
		margin-top: -20px;
	}

	.u-demo-block__content{
		position: relative;
		z-index: 10;
		white-space: nowrap;
	}
	.u-page__tag-item {
		@include flex(column);
		flex: 1;
	}

	.m-t-10 {
		margin-top: 5px;
		margin-bottom: 2px;
	}

	.no-data {
		/* 使用Flexbox布局 */
		display: flex;
		/* 水平和垂直居中 */
		justify-content: center;
		align-items: center;
		/* 确保容器占据全部视口高度和宽度，根据实际需求调整 */
		height: 100vh;
		width: 100%;
		margin-top: -150px;
		flex-direction: column;
	}

	.close-view {
		position: relative;
		align-items: center;
		flex-direction: row;
		width: 20px;
		height: 15px;
		line-height: 15px;
		border-width: 1upx;
		border-style: solid;
		border-color: #aaaaaa;
		border-radius: 4px;
		justify-content: center;
		text-align: center;
	}

	.close-l {
		position: absolute;
		width: 9px;
		height: 1px;
		background-color: #aaaaaa;
	}

	.close-h {
		transform: rotate(45deg);
	}

	.close-v {
		transform: rotate(-45deg);
	}

	.article-card{
		border-color:#e6e6e6;
		box-shadow: 5rpx 5rpx 15rpx #888888;
		border-radius: 30rpx;
		padding: 20rpx;
		background-color: #fff;
		width: 100%;
		height: 100%;
		z-index: 3;
	}
	.comment-top{
		flex-direction:row;
		display: flex;
		justify-content: space-between;
	}
	.comment-avatar{
		flex-direction:row;
	}
	.comment-content{
		flex-direction:row;
		display: flex;
		justify-content: space-between;
		padding: 0rpx 0rpx 0rpx 50rpx;
		margin: 8rpx 10rpx;
	}
</style>
