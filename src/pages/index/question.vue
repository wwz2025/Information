<template>
	<view class="content">
		<scroll-view scroll-y="true" :style="{height: scrollHeight + 'px'}" @scroll="onScroll">

		<!--自定义底部工具栏-->
		<tabbar tabIndex=1 ></tabbar>

		<!--搜索-->
		<view class="u-demo-block__content m-t-10">
			<view class="u-page__tag-item" >
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

		<!-- 轮播图1 -->
		<view class="swiper">
			<view class="swiper-box">
				<rf-swipe-dot :info="index_top" mode="nav" :current="current" field="materialName" >
					<swiper @change="handleDotChange" autoplay="true">
						<swiper-item v-for="(item, index) in index_top"  :key="index" >
							<view class="swiper-item">
								<image :src="fileUrl+item.savePath" mode="aspectFill" />
							</view>
						</swiper-item>
					</swiper>
				</rf-swipe-dot>
			</view>
		</view>


		<view class="u-demo-block" style="padding: 20upx;">
<!--				<text class="u-demo-block__title" style="margin-bottom: 15px;">用户：1000w 发布：390w 浏览：5000w  </text>-->
				<u-scroll-list
					indicatorColor="#fff0f0"
					indicatorActiveColor="#f56c6c"
					@right="right"
					@left="left"
				>
					<view
						class="scroll-list"
						style="flex-direction: row;"
					>
						<view
							class="scroll-list__goods-item"
							v-for="(item, index) in categoryArr"
							:key="index"
							@click="navToMore(item)"
						>
							<view class="u-page__grid__item__icon" @click="navToMore(item)">
								<u-icon
									:name="item.icon"
									size="60"
									:color="themeColor.color"
								></u-icon>
							</view>
							<text class="u-page__grid__item__text"  @click="navToMore(item)">{{item.name}}</text>
						</view>
					</view>
				</u-scroll-list>
		</view>

		<!--页面加载动画-->
		<u-loading-page
			:style="'margin-top: '+(scrollTopTotal+100)*2+'upx;'"
			:loadingText="loadingPageData.loadingText"
			:loadingMode="loadingPageData.loadingMode"
			:loading="loading"
			:color="loadingPageData.color"
			:loadingColor="loadingPageData.loadingColor"
			v-if="loadingState===2"
		>
		</u-loading-page>

		<u-loading-page
			:loadingText="loadingPageData.loadingText"
			:loadingMode="loadingPageData.loadingMode"
			:loading="loading"
			:color="loadingPageData.color"
			:loadingColor="loadingPageData.loadingColor"
			v-if="loadingState===1"
		>
		</u-loading-page>

		<!-- 广告组件 -->
		<!-- #ifndef MP -->
		<mix-advert
			ref="mixAdvert"
			:timedown="8"
			imageUrl="/static/advert.png"
			:url="advertNavUrl"
		></mix-advert>
		<!-- #endif -->

		<!-- 顶部选项卡 -->
		<scroll-view id="nav-bar" ref="nav-bar" class="nav-bar" scroll-x scroll-with-animation :scroll-left="scrollLeft" v-if="loadingTab>0">
			<view
				v-for="(item,index) in tabBars" :key="item.id"
				class="nav-item"
				:class="{current: index === tabCurrentIndex}"

				<!-- #ifndef MP -->
				:style="dynamicStyle"
				<!-- #endif -->

				<!-- #ifdef MP -->
				:style="'color:'+  (index === tabCurrentIndex?backgroundColor:'#303133')"
				<!-- #endif -->

				:id="'tab'+index"
				@click="changeTab(index)"
			>{{item.name}}</view>
		</scroll-view>

		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="90" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll" :text="pulldownText"
													style="transform: translateY(0px); transition: all 0s ease 0s; height: calc(100% - 46px); max-height: calc(100% - 46px);">
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
						<view v-for="(item, index) in tabItem.newsList" :key="index" class="news-item" @click="navToDetails(item)">
							<text :class="['title', 'title'+item.type]">{{item.title}}</text>

							<view class="u-demo-block_content">
							 	<view class="u-page_tag-item" >
							 		<u-tag :text="item.tags_name" type="warning" plain plainFill size="mini" shape="circle" style="display: inline-flex;">
							 		</u-tag>
							 	</view>
							</view>

							<view class="media-foot flex-row">
									<view class="media-info flex-row" style="width: 100%;color: #999999;font-size: 28upx;">
										 {{item.content}}
									</view>
							</view>

							<view :class="['bot', 'bot'+item.type]">
							    <u-avatar :src="item.avatar?fileUrl+item.avatar:headImg" mode="circle" size="20"></u-avatar>
								<text class="time">{{item.author}}</text>
								<text class="time">{{item.replyNum}}条评论</text>
								<text class="time">{{item.keywords}}</text>
							</view>

							<view class="media-item-line"  ></view>
							<!--<view class="right-data">
								<text class="info-text">{{item.replyNum}}条回复</text>
							</view>-->
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

	</scroll-view>
	</view>
</template>

<script>
	import { articleListUrl,cmsTagsUrl,cmsCategoryUrl,addMessageUrl,forumTagsUrl,getMessageUsersUrl} from '@/api/forum';
	import mixAdvert from '@/components/mix-advert/vue/mix-advert';
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	import {
		bannerList,
		homeRecommendSubject,
		homeRecommendProduct,
		homeBrand,noticeList,typeList,
		homeNewProduct,
		indexBanner
	} from '@/api/sms';
	import rfSwipeDot from '@/components/rf-swipe-dot';
	import rfFloorIndex from '@/components/rf-floor-index';
	import rfFloorPIndex from '@/components/rf-floor-p-index';
	import rfSearchBar from '@/components/rf-search-bar';
	import rfProductList from '@/components/rf-product-list';
	import { mapMutations } from 'vuex';

	let windowWidth = 0, scrollTimer = false, tabBar;

	export default {
		components: {
			mixPulldownRefresh,
			mixAdvert,

			rfFloorIndex,rfFloorPIndex,
			rfSwipeDot,
			rfProductList,
			rfSearchBar
		},
		data() {
			return {
				scrollTopTotal: 0, // 页面距离顶部高度
				scrollHeight: 0, // 页面高度
				current: 0, // 轮播图index
				index_top: [], // 广告图
				// announceList: [], // 公告列表

				startTime:0,//开始时间-毫秒
				endTime:0,//结束时间-毫秒
				timeTaken: 0,//计算并更新耗时

				pulldownText:'',//下拉刷新文字提醒
				backgroundColor: '', // 动态背景颜色的初始值
				loadingState: 1,
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
				scrollLeft: 0, //顶部选项卡左滑距离
				enableScroll: true,
				tabBars: [
					// {id: 0,name: '全部',region:'',tagId:'',newsList:[],refreshing:0,
					// 	loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
					// },
					{id: 100,name: '最新',region:'new',tagId:'',newsList:[],refreshing:0,
						loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
					},
					{id: 101,name: '热门',region:'hot',tagId:'',newsList:[],refreshing:0,
						loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
					},
				],
				categoryArr:[],
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
		async onLoad() {
			// 获取屏幕高度
			this.scrollHeight = uni.upx2px(uni.getSystemInfoSync().windowHeight)+538;
			// this.scrollHeight = uni.getSystemInfoSync().windowHeight;

			// 获取屏幕宽度
			windowWidth = uni.getSystemInfoSync().windowWidth;
			this.loadTabbars();

			this.getBannerList();
			// this.getNoticeList();
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
			// #ifndef MP
			// this.$refs.mixAdvert.initAdvert();
			// #endif
		},
		methods: {
			onScroll(e) {
				console.log('滚动视图的滚动距离：', e.detail.scrollTop);
				this.scrollTopTotal=e.detail.scrollTop;
				// 在这里可以写入你的滚动相关逻辑
			},
			// 监听轮播图切换
			handleDotChange(e) {
				this.current = e.detail.current;
			},
			// 通用跳转
			navTo(route, type) {
				console.log(route);
				if (!route) return;
				if (type === 'tab') {
					this.$mRouter.switchTab({ route });
				} else {
					this.$mRouter.push({ route });
				}
			},
			// 轮播图列表 1 轮播图 2 新品推荐广告 3 人气推荐广告 4热门推荐广告 5 分类广告
			async getBannerList() {
				//首页滚动图片
				await this.$http
					.get(`${indexBanner}`, {code:'mobileMain'})
					.then(async r => {
						this.index_top=r;
					})
					.catch(() => {
						this.loading = false;
						// if (type === 'refresh') {
						// 	uni.stopPullDownRefresh();
						// }
					});
			},

			// 公告列表
			async getNoticeList() {
				// let that=this;
				// that.$http.get(`${noticeList}`,{storeId:0}).then(r => {
				// 	that.announceList = r;
				// 	//每一个小时进行更新
				// 	setTimeout(function(){
				// 		that.getNoticeList();
				// 	},60000)
				// });
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

				let that=this;
				this.$http.get(`${cmsCategoryUrl}`, {parentId:'5'})
					.then(async r => {

						let linList=r;
						for (var j = 0; j < linList.length; j++) {
							// let entity={id: "",name: '',newsid: 0,region:'',tagId:''};

							let entity={id: "",name: '',region:'',tagId:'',newsList:[],refreshing:0,
								loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
								color:'',
								icon:'',
							};

							entity.id=linList[j].categoryId;
							entity.name=linList[j].categoryName;
							entity.newsid=j+5;
							entity.region='';
							entity.tagId=linList[j].categoryId;
							entity.icon=linList[j].description;

							that.categoryArr.push(entity);
							that.tabBars.push(entity);
						}
					})
					.catch(err => {
					});
				this.loadNewsList('add');
				this.tabBars[0].loaded = true;
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
				this.$http.get(`${articleListUrl}`, {
							pageNum:this.pageNum,
							pageSize:this.pageSize,
							// tags:this.tagId.toString(),
							// questionRegion:this.region,
							tags:"",
							questionRegion:tabItem.id>=100?tabItem.region:'',
							title:this.title,
							categoryId:tabItem.id>=100?'':tabItem.id,//问答
							available:1//已审核
						})
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
							// 	item.type="";
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
			//新闻详情
			navToMore(item){
				// debugger
				uni.navigateTo({
					url: '/pages/question/index?id='+item.id
				});
			},

			//新闻详情
			navToDetails(item){
				uni.navigateTo({
				  url: '/pages/question/view?id='+item.id
				});
			},

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

			// scrollToTargetWx() {
			// 	const query = uni.createSelectorQuery().in(this);
			// 	query.select('.u-demo-block').boundingClientRect();
			// 	query.exec((res) => {
			// 		uni.pageScrollTo({
			// 			scrollTop: res[0].top,
			// 			duration: 300
			// 		});
			// 	});
			// },
			//tab切换
			async changeTab(e){
				// nav-bar
				// this.scrollToTargetWx();
				this.loadingState=2;
				const query = uni.createSelectorQuery().in(this);
				query.select('#nav-bar').boundingClientRect((rect) => {
					console.log('元素距离顶部的距离:', rect.top);
					this.scrollTopTotal=rect.top;
				}).exec();

				if(scrollTimer){
					//多次切换只执行最后一次
					clearTimeout(scrollTimer);
					scrollTimer = false;
				}
				let index = e;
				//e=number为点击切换，e=object为swiper滑动切换
				if(typeof e === 'object'){
					index = e.detail.current
				}
				if(typeof tabBar !== 'object'){
					tabBar = await this.getElSize("nav-bar")
				}
				//计算宽度相关
				let tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;
				let nowWidth = 0;
				//获取可滑动总宽度
				for (let i = 0; i <= index; i++) {
					let result = await this.getElSize('tab' + i);
					width += result.width;
					if(i === index){
						nowWidth = result.width;
					}
				}
				if(typeof e === 'number'){
					//点击切换时先切换再滚动tabbar，避免同时切换视觉错位
					this.tabCurrentIndex = index;
				}
				//延迟300ms,等待swiper动画结束再修改tabbar
				scrollTimer = setTimeout(()=>{
					if (width - nowWidth/2 > windowWidth / 2) {
						//如果当前项越过中心点，将其放在屏幕中心
						this.scrollLeft = width - nowWidth/2 - windowWidth / 2;
					}else{
						this.scrollLeft = 0;
					}
					if(typeof e === 'object'){
						this.tabCurrentIndex = index;
					}
					this.tabCurrentIndex = index;

					//第一次切换tab，动画结束后需要加载数据
					let tabItem = this.tabBars[this.tabCurrentIndex];
					if(this.tabCurrentIndex !== 0 && tabItem.loaded !== true){
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
		z-index: 1;
		height: 90upx;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
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
			font-size: 36upx;
			color: var(--dynamic-background-color);
			&:after{
				width: 50%;
			}
		}
	}

	.swiper-box{
		/*height: 100%;*/
		/*  #ifndef  APP-PLUS  */
		height: calc(100% - 68px);
		/*  #endif  */
		/*  #ifdef  APP-PLUS  */
		height: calc(100% - 64px - var(--status-bar-height)) ;
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
		width: 220upx;
		height: 140upx;
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
		padding-left: 240upx;
	}
	.bot1{
		padding-left: 240upx;
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
		height: 240upx;
		margin: 16upx 0upx;
	}
	.img-wrapper-single{
		height: 240upx;
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
		font-size: 24upx;
	}

	.right-data{
		text-align: right;
		margin-top: -20px;
	}

	.u-demo-block__content{
		position: relative;
		z-index: 10;
		white-space: nowrap;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
	}
	.u-page__tag-item {
		@include flex(column);
		flex: 1;
	}

	.m-t-10 {
		margin-top: 5px;
		margin-bottom: 2px;
	}
	.mix-refresh-content{
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
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



	/*轮播图*/
	.swiper {
		width: 100%;
		/*margin-bottom: 20upx;*/
		padding: 20upx;
		display: flex;
		justify-content: center;
		.swiper-box {
			width: 100%;
			height: 40vw;
			overflow: hidden;
			border-radius: 15upx;
			box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
			//兼容ios，微信小程序
			position: relative;
			z-index: 0;
			swiper {
				width: 100%;
				height: 40vw;
				swiper-item {
					image {
						width: 100%;
						height: 40vw;
					}
				}
			}
		}
	}

	/*轮播图2*/
	.swiper-item-text {
		position: absolute;
		bottom: 16upx;
		left: 30upx;
		height: 48upx;
		line-height: 48upx;
		background: rgba(0, 0, 0, 0.2);
		width: 90%;
		color: $color-white;
		border-bottom-left-radius: 12upx;
		padding-left: 20upx;
	}
	/*新闻通知*/
	.swiper-slide-header {
		.picfont {
			font-size: $font-lg + 8upx;
			font-weight: 600;
		}
	}
	/deep/.rf-swiper-slide .rf-swiper[data-v-3dd1c9a6]
	{
		width: 100%;
	}

	.scroll-list {

		box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
		@include flex(column);

		&__goods-item {
			margin-right: 20px;

			&__image {
				width: 60px;
				height: 60px;
				border-radius: 4px;
			}

			&__text {
				color: #f56c6c;
				text-align: center;
				font-size: 24upx;
				margin-top: 5px;
			}
		}

		&__show-more {
			background-color: #fff0f0;
			border-radius: 3px;
			padding: 3px 6px;
			@include flex(column);
			align-items: center;

			&__text {
				font-size: 24upx;
				width: 12px;
				color: #f56c6c;
				line-height: 16px;
			}
		}

		&__line {
			@include flex;
			margin-top: 10px;

			&__item {
				margin-right: 15px;

				&__image {
					width: 61px;
					height: 48px;
				}

				&__text {
					margin-top: 5px;
					color: $u-content-color;
					font-size: 24upx;
					text-align: center;
				}

				&--no-margin-right {
					margin-right: 0;
				}
			}
		}
	}

</style>
