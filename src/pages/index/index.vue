<template>
	<view class="content">
		<scroll-view scroll-y="true" :style="{height: scrollHeight + 'px'}" @scroll="onScroll">

			<!--自定义底部工具栏-->
			<tabbar tabIndex=0 ></tabbar>

			<!--搜索-->
<!--			<view class="u-demo-block__content m-t-10" v-if="loadingTab>0 && index_top && announceListTitle && categoryArr"
						@click="search">-->
			<view class="u-demo-block__content m-t-10" @click="search">
				<view class="u-page__tag-item" >
					<u-search
						class="u-search"
						v-model="title"
						:show-action="false"
						:placeholderColor="themeColor.color"
						:searchIconColor="themeColor.color"
						placeholder="91本地生活圈，欢迎大家使用！"
						@clickIcon="search"
						@change="search"
					></u-search>
				</view>
			</view>

			<!-- 轮播图1 -->
			<view class="swiper" v-if="index_top && announceListTitle && categoryArr">
				<view class="swiper-box">
					<rf-swipe-dot :info="index_top" mode="nav" :current="current" field="materialName" >
						<swiper @change="handleDotChange" autoplay="true">
							<swiper-item v-for="(item, index) in index_top"  :key="index" >
								<view class="swiper-item" @click="navToDetails2(item.url)">
									<image :src="fileUrl+item.savePath" mode="aspectFill" />
								</view>
							</swiper-item>
						</swiper>
					</rf-swipe-dot>
				</view>
			</view>

			<!--新闻通知-->
			<u-notice-bar
			    :text="announceListTitle"
					direction="column"
					@click="navTo('/pages/index/notice/notice')"
					v-if="index_top && announceListTitle && categoryArr"
			></u-notice-bar>

			<view class="u-demo-block" style="padding: 20upx;"
						v-if="index_top && announceListTitle && categoryArr">
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
							<view class="u-page__grid__item__icon"  >
								<u-icon
									:name="item.icon"
									size="60"
									:color="themeColor.color"
								></u-icon>
							</view>
							<text class="u-page__grid__item__text">{{item.name}}</text>

<!--							<view class="u-page__grid__item__icon" @click="navToMore(item)">
								<u-icon
									:name="item.icon"
									size="60"
									:color="themeColor.color"
								></u-icon>
							</view>
							<text class="u-page__grid__item__text"  @click="navToMore(item)">{{item.name}}</text>-->
						</view>
					</view>
				</u-scroll-list>
			</view>

			<!--页面加载动画
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
			-->
			<u-loading-page
				:loadingText="loadingPageData.loadingText"
				:loadingMode="loadingPageData.loadingMode"
				:loading="loading"
				:color="loadingPageData.color"
				:loadingColor="loadingPageData.loadingColor"
				v-if="loadingState===1 && !tabBars"
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
			<u-tabs
				:list="tabBars"
				lineWidth="80"
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
<!--			v-if="loadingTab>0 && index_top && announceListTitle && categoryArr"-->
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
					* 已经是最优方案
					* 加载图表在遮罩层最中间，遮罩层是全屏显示的
				-->
				<u-loading-page
					:loadingText="loadingPageData.loadingText"
					:loadingMode="loadingPageData.loadingMode"
					:loading="loading"
					:color="loadingPageData.color"
					:loadingColor="loadingPageData.loadingColor"
					v-if="loadingState>=1"
				>
				</u-loading-page>

					<!--
						* 新闻列表
						* 和nvue的区别只是需要把uni标签转为weex标签而已
						* class 和 style的绑定限制了一些语法，其他并没有不同
					-->
					<view v-for="(item, index) in tabItem.newsList" :key="index" class="news-item">
<!--						<text :class="['title', 'title'+item.type]">{{item.title}}</text>-->
						<view class="u-demo-block_content"  @click="navToDetails(item)">
								<view class="u-page__tag-item2">
									<u-avatar :src="item.avatar?fileUrl+item.avatar:headImg" mode="circle" size="40"></u-avatar>
								</view>
								<view class="u-page__tag-item2" v-if="item.isTop">
									<u-tag text="顶" type="error" shape="circle"  @click="navToDetails(item)"></u-tag>
								</view>
								<view class="u-page__tag-item2">
									<u-tag :text="item.forumCategory.categoryName" type="warning"  shape="circle" style="display: inline-flex;" @click="navToDetails(item)"></u-tag>
								</view>
								<view class="u-page__tag-item2">
									<text class="title">{{item.author}}</text>
								</view>
								<view class="item2" style="position: absolute;right: 20px;">
									<u-tag text="打电话" type="error"  shape="circle" @click="navToDetails(item)"></u-tag>
								</view>
						</view>

						<view class="u-demo-block"  v-if="item.tagList">
							<view class="u-demo-block__content" style="display: flex;flex-direction: row;flex-wrap: wrap;">
								<view
									class="u-page__tag-item3"
									v-for="(item1, index1) in item.tagList"
									:key="index1" style="margin-right: 5px;" >
									<u-tag
										:text="item1.tagName"
										plain
										size="mini"
										type="warning"
										:name="item1.id"
										shape="circle"
										v-if="item1.selected"
										@click="navToDetails(item)"
									>
									</u-tag>
								</view>
							</view>
						</view>

						<view class="media-foot flex-row"  @click="navToDetails(item)">
							<view class="media-info flex-row" style="width: 100%;color: #999999;font-size: 28upx;">
								{{item.content}}
							</view>
						</view>

						<u-album :urls="item.coverImages" maxCount="6" :multipleSize="deviceWidth" v-if="item.coverImages.length>0"></u-album>

						<view class="u-demo-block_content" @click="pointer" v-if="item.detailedAddress" style="margin-top: 5px;">
							<view class="u-page__tag-item2" style="margin-right: 0px;">
								<u-icon  name="map" size="16" color="#83bef8"></u-icon>
							</view>

							<view class="u-page__tag-item2">
								<u--text size="13" color="#83bef8" :text="item.detailedAddress" ></u--text>
							</view>
						</view>

						<view :class="['bot', 'bot'+item.type]">
<!--							<u-avatar :src="item.avatar?fileUrl+item.avatar:headImg" mode="circle" size="20"></u-avatar>
							<text class="time">{{item.author}}</text>-->
							<text class="time" v-if="item.hit">{{item.hit}}浏览</text>
							<text class="time" v-if="item.upVote">{{item.upVote}}点赞</text>
							<text class="time">{{item.keywords}}</text>
						</view>
						<!--<view class="right-data">
							<text class="info-text">{{item.replyNum}}条回复</text>
						</view>-->
						<view class="media-item-line"  ></view>

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
import {articleListUrl, cmsTagsUrl, cmsCategoryUrl, addMessageUrl, forumTagsUrl, getMessageUsersUrl} from '@/api/forum';
import mixAdvert from '@/components/mix-advert/vue/mix-advert';
import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
import {
	bannerList,
	homeRecommendSubject,
	homeRecommendProduct,
	homeBrand, noticeList, typeList,
	homeNewProduct,
	indexBanner
} from '@/api/sms';
import rfSwipeDot from '@/components/rf-swipe-dot';
import {mapMutations} from 'vuex';

let windowWidth = 0, scrollTimer = false, tabBar;

export default {
	components: {
		mixPulldownRefresh,
		mixAdvert,
		rfSwipeDot,
	},
	data() {
		return {
			deviceWidth:0,//设备宽度
			scrollTopTotal: 0, // 页面距离顶部高度
			scrollHeight: 0, // 页面高度
			current: 0, // 轮播图index
			index_top: [], // 广告图
			announceList: [], // 公告列表
			announceListTitle: [], // 公告列表

			startTime: 0,//开始时间-毫秒
			endTime: 0,//结束时间-毫秒
			timeTaken: 0,//计算并更新耗时

			pulldownText: '',//下拉刷新文字提醒
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
			fileUrl: this.$mConfig.fileUrl, //文件路径
			pageNum: 1,//页码
			pageSize: 20,//每页的数量
			tabCurrentIndex: 0, //当前选项卡索引
			scrollLeft: 0, //顶部选项卡左滑距离
			enableScroll: true,
			tabBars: [
				// {id: 0,name: '全部',region:'',tagId:'',newsList:[],refreshing:0,
				// 	loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
				// },
			],
			categoryArr: [],
		}
	},
	computed: {
		dynamicStyle() {
			this.backgroundColor = this.themeColor.color; // 动态背景颜色的初始值
			return {
				'--dynamic-background-color': this.backgroundColor,
			};
		},
		advertNavUrl() {
			let data = {
				title: '测试跳转新闻详情',
				author: '测试作者',
				time: '2019-04-26 21:21'
			}
			return `/pages/details/details?data=${JSON.stringify(data)}`;
		}
	},
	async onLoad() {
		this.deviceWidth =(uni.getSystemInfoSync().screenWidth  -50)/3;
		this.scrollTopTotal =(uni.getSystemInfoSync().windowHeight  -756)/2;
		// 获取屏幕高度
		// this.scrollHeight = uni.upx2px(uni.getSystemInfoSync().windowHeight) + 538-160;
		this.scrollHeight = uni.getSystemInfoSync().windowHeight-10;
		console.log('设备高度：', uni.getSystemInfoSync().windowHeight);
		console.log('scroll高度：', this.scrollHeight);
		console.log('设备高度---：', uni.upx2px(uni.getSystemInfoSync().windowHeight));
		console.log('设备高度---：', uni.upx2px(uni.getSystemInfoSync().windowHeight) + 538-160);
		// this.scrollHeight = uni.getSystemInfoSync().windowHeight;

		// 获取屏幕宽度
		windowWidth = uni.getSystemInfoSync().windowWidth;
		this.loadTabbars();

		this.getBannerList();
		this.getNoticeList();
	},
	onReady() {
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
			//设备高度-(上部高度-滚动条距离)
			this.scrollTopTotal =(uni.getSystemInfoSync().windowHeight -(380-e.detail.scrollTop));

			this.loadingState = 2;
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
				this.$mRouter.switchTab({route});
			} else {
				this.$mRouter.push({route});
			}
		},
		// 轮播图列表 1 轮播图 2 新品推荐广告 3 人气推荐广告 4热门推荐广告 5 分类广告
		async getBannerList() {
			//首页滚动图片
			await this.$http
				.get(`${indexBanner}`, {code: 'mobileMain'})
				.then(async r => {
					this.index_top = r;
				})
				.catch(() => {
					this.loading = false;
				});
		},

		// 公告列表
		async getNoticeList() {
			let that = this;
			that.$http.get(`${noticeList}`, {storeId: 0}).then(r => {
				for(var i=0;i<r.length;i++)
				{
					that.announceListTitle.push(r[i].noticeTitle);
				}
				that.announceList = r;
				//每一个小时进行更新
				setTimeout(function () {
					that.getNoticeList();
				}, 60000)
			});
		},

		// 搜索
		search() {
			uni.navigateTo({
				url: '/pages/question/index?title=' + this.title
			});
		},
		/**
		 * 数据处理方法在vue和nvue中通用，可以直接用mixin混合
		 * 这里直接写的
		 * mixin使用方法看index.nuve
		 */
		//获取分类
		loadTabbars() {
			this.tabBars= [
				// {
				// 	id: 100, name: '最新信息', region: '', tagId: '', newsList: [], refreshing: 0,
				// 	loadMoreStatus: 0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
				// 	badge: {
				// 		isDot: true
				// 	}
				// },
				// {
				// 	id: 101, name: '热门', region: 'hot', tagId: '', newsList: [], refreshing: 0,
				// 	loadMoreStatus: 0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
				// 	badge: {
				// 		isDot: true
				// 	}
				// },
			];
			let that = this;
			this.$http.get(`${cmsCategoryUrl}`, {parentId: '5'})
				.then(async r => {
					let linList = r;
					var tab={
							id: 100, name: '推荐信息', region: '', tagId: '', newsList: [], refreshing: 0,
							loadMoreStatus: 0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
							badge: {
								isDot: true
							}
						};
					that.tabBars.push(tab);
					for (var j = 0; j < linList.length; j++) {
						let entity = {
							id: "", name: '', region: '', tagId: '', newsList: [], refreshing: 0,
							loadMoreStatus: 0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
							color: '',icon: '',loaded:false,number:1
						};

						entity.id = linList[j].categoryId;
						entity.name = linList[j].categoryName;
						entity.newsid = j + 5;
						entity.region = '';
						entity.tagId = linList[j].categoryId;
						entity.icon = linList[j].description;
						entity.loaded = false;
						entity.number = j+1;

						that.categoryArr.push(entity);
						that.tabBars.push(entity);
					}
					that.loadNewsList('add');
					that.tabBars[0].loaded = true;
				})
				.catch(err => {
				});
			// this.loadNewsList('add');
			// this.tabBars[0].loaded = true;
		},
		//新闻列表
		loadNewsList(type) {
			let that = this;
			// 记录开始时间
			this.startTime = Date.now();

			let tabItem = this.tabBars[this.tabCurrentIndex];
			if (!this.loading) {
				//type add 加载更多 refresh下拉刷新
				if (type === 'add') {
					if (tabItem.loadMoreStatus === 2) {
						return;
					}
					tabItem.loadMoreStatus = 1;
				}
				// #ifdef APP-PLUS
				else if (type === 'refresh') {
					tabItem.refreshing = true;
				}
				// #endif
			}

			this.pulldownText = "";
			this.$http.get(`${articleListUrl}`, {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				// tags:this.tagId.toString(),
				// questionRegion:this.region,
				tags: "",
				// questionRegion: tabItem.id >= 100 ? tabItem.region : '',
				title: this.title,
				categoryId: tabItem.id >= 100 ? '' : tabItem.id,//问答
				available: 1//已审核
			})
				.then(async r => {
					// 记录结束时间
					that.endTime = Date.now();
					// 计算并更新耗时
					that.timeTaken = that.endTime - that.startTime;
					let list0 = r.list;
					let list = [];
					if (type === 'refresh') {
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
					// let entity= {};

					list0.forEach(item => {
						let entity= {};
						entity = { ...item, coverImages: [] };
						if(item.coverImage)
						{
							for(var i=0;i<(item.coverImage).split(';').length;i++)
							{
								entity.coverImages.push(that.fileUrl+(item.coverImage).split(';')[i]);
							}
						}
						list.push(entity);
					})

					//下拉刷新 关闭刷新动画
					if (type === 'refresh') {
						list.forEach(item => {
							item.type = "0";
							// item.coverImages=[];
							// for(var i=0;i<(item.coverImage).split(';').length;i++)
							// {
							// 	item.coverImages.push(this.fileUrl+(item.coverImage).split(';')[i]);
							// }
							tabItem.newsList.push(item);
						})
						setTimeout(() => {
							// this.loading = false;
							this.pulldownText = "已是最新数据";
						}, that.timeTaken > 300 ? 0 : 300 - that.timeTaken)
						setTimeout(() => {
							// this.loading = false;
							this.pulldownText = "";
						}, that.timeTaken > 300 ? 300 : 600 - that.timeTaken)
						//数据量小，性能高的时候，使用setTimeout，让用户感知刷新
						setTimeout(() => {
							this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
							// #ifdef APP-PLUS
							tabItem.refreshing = false;
							// #endif

							tabItem.loadMoreStatus = r.isFirstPage && r.list.length === 0 ? 3 : (r.isLastPage ? 2 : 0);//3是没有数据，2是最后一页，否则就是0有更多数据可以加载
						}, that.timeTaken > 800 ? 0 : 800 - that.timeTaken)
					}
					//上滑加载 处理状态
					if (type === 'add') {
						if (r.isFirstPage) {
							//第一页初次加载，300
							setTimeout(() => {
								this.loading = false;
								tabItem.loadMoreStatus = r.isFirstPage && r.list.length === 0 ? 3 : (r.isLastPage ? 2 : 0);//3是没有数据，2是最后一页，否则就是0有更多数据可以加载

								setTimeout(() => {
									list.forEach(item => {
										// let entity= {};
										// entity = { ...item, coverImages: [] };
										item.type = "0";
										// if(item.coverImage)
										// {
										// 	for(var i=0;i<(item.coverImage).split(';').length;i++)
										// 	{
										// 		entity.coverImages.push(that.fileUrl+(item.coverImage).split(';')[i]);
										// 	}
										// }
										tabItem.newsList.push(item);
									})
								}, that.timeTaken > 400 ? 0 : 400 - that.timeTaken)
							}, that.timeTaken > 300 ? 0 : 300 - that.timeTaken)
						} else {
							//没有数据的时候，使用setTimeout，让用户感知隐藏刷新和显示无数据的时间间隔
							setTimeout(() => {
								tabItem.loadMoreStatus = r.isFirstPage && r.list.length === 0 ? 3 : (r.isLastPage ? 2 : 0);//3是没有数据，2是最后一页，否则就是0有更多数据可以加载
								setTimeout(() => {
									list.forEach(item => {
										item.type = "0";
										// item.coverImages=[];
										// for(var i=0;i<(item.coverImage).split(';').length;i++)
										// {
										// 	item.coverImages.push(this.fileUrl+(item.coverImage).split(';')[i]);
										// }
										tabItem.newsList.push(item);
									})
								}, that.timeTaken > 300 ? 0 : 300 - that.timeTaken)
							}, that.timeTaken > 300 ? 0 : 300 - that.timeTaken)
						}
					}

					this.loadingTab = 1;//显示选项卡
					// if(type === 'refresh' && tabItem.loadMoreStatus === 2){
					// 	this.$refs.mixPulldownRefresh && this.$refs.mixPulldownRefresh.endPulldownRefresh();
					// 	tabItem.refreshing = false;
					// 	return;
					// }
				})
				.catch(err => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
		//新闻分类详情
		navToMore(item) {
			uni.navigateTo({
				url: '/pages/question/index?id=' + item.number
			});
		},

		//新闻详情
		navToDetails(item) {
			uni.navigateTo({
				url: '/pages/question/view?id=' + item.id
			});
		},

		//新闻详情
		navToDetails2(id) {
			uni.navigateTo({
				url: '/pages/question/view?id=' + id
			});
		},
		//下拉刷新
		onPulldownReresh() {
			this.pageNum = 1;
			this.loadNewsList('refresh');
		},
		//上滑加载
		loadMore() {
			//没有数据禁止上滑加载
			if (this.tabBars[this.tabCurrentIndex].loadMoreStatus !== 3) {
				this.pageNum++;
				this.loadNewsList('add');
			}
		},
		//设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
		setEnableScroll(enable) {
			if (this.enableScroll !== enable) {
				this.enableScroll = enable;
			}
		},


		//tab切换
		async changeTab(e) {

			this.loadingState = 2;

			if (scrollTimer) {
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
			let that=this;
			//延迟300ms,等待swiper动画结束再修改tabbar
			scrollTimer = setTimeout(() => {

				//第一次切换tab，动画结束后需要加载数据
				let tabItem = this.tabBars[this.tabCurrentIndex];
				if (this.tabCurrentIndex !== 0 && tabItem.loaded !== true) {
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
		//打开地图获取详细地址
		pointer() {
			const that=this;
			uni.chooseLocation({
				success: async function(res) {
					that.model1.detailedAddress = res.address;
					console.log(res.address, "返回地址");
				},
				fail: function(e) {
					console.log(e, "报错");
				}
			})
		},
	}
}
</script>

<style lang='scss'>

.loading-container {
	/* 设置容器的高度 */
	height: 50vh; /* 使用视口高度的百分比 */
	/* 或者使用固定高度 */
	/* height: 500px; */
	/* 保持容器居中 */
	display: flex;
	align-items: center;
	justify-content: center;
}

page, .content {
	background-color: $page-color-base;
	height: 100%;
	overflow: hidden;
}

.content {
	background-color: $color-white;
}

.swiper-box {
	/*height: 100%;*/
	/*  #ifndef  APP-PLUS  */
	height: calc(100% - 68px);
	/*  #endif  */
	/*  #ifdef  APP-PLUS  */
	height: calc(100% - 64px - var(--status-bar-height));
	/*  #endif  */
}

.u-loadmore {
	padding-bottom: 20px;
}

.panel-scroll-box {
	height: 100%;

	.panel-item {
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
.video-wrapper {
	width: 100%;
	height: 440upx;

	.video {
		width: 100%;
	}
}

view {
	display: flex;
	flex-direction: column;
}

.img {
	width: 100%;
	height: 100%;
}

.news-item {
	position: relative;
}

/* 修改结束 */

/* 新闻列表  emmm 仅供参考 */
.news-item {
	width: 750upx;
	padding: 24upx 30upx;
	border-bottom-width: 1px;
	border-color: #eee;
	background-color: #fff;
}

.title {
	font-size: 32upx;
	color: #303133;
	line-height: 46upx;
}

.bot {
	flex-direction: row;
}

.author {
	font-size: 26upx;
	color: #aaa;
}

.time {
	font-size: 26upx;
	color: #aaa;
	margin-left: 20upx;
}

.img-list {
	flex-shrink: 0;
	flex-direction: row;
	background-color: #fff;
	width: 220upx;
	height: 140upx;
}

.img-wrapper {
	flex: 1;
	flex-direction: row;
	height: 140upx;
	position: relative;
	overflow: hidden;
}

.img {
	flex: 1;
}

.img-empty {
	height: 20upx;
}

/* 图在左 */
.img-list1 {
	position: absolute;
	left: 30upx;
	top: 24upx;
}

.title1 {
	padding-left: 240upx;
}

.bot1 {
	padding-left: 240upx;
	margin-top: 20upx;
}

/* 图在右 */
.img-list2 {
	position: absolute;
	right: 30upx;
	top: 24upx;
}

.title2 {
	padding-right: 210upx;
}

.bot2 {
	margin-top: 20upx;
}

/* 底部3图 */
.img-list3 {
	width: 700upx;
	margin: 16upx 0upx;
}

.img-wrapper3 {
	margin-right: 4upx;
}

/* 底部大图 */
.img-list-single {
	width: 690upx;
	height: 240upx;
	margin: 16upx 0upx;
}

.img-wrapper-single {
	height: 240upx;
	margin-right: 0upx;
}

.video-tip {
	position: absolute;
	left: 0;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .3);
}

.video-tip-icon {
	width: 60upx;
	height: 60upx;
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

.right-data {
	text-align: right;
	margin-top: -20px;
}

.u-demo-block__content {
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

.mix-refresh-content {
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

/deep/ .rf-swiper-slide .rf-swiper[data-v-3dd1c9a6] {
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

.u-page__tag-item {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: row;
	/*margin-right: 20px;*/
}
.title {
	margin-right: 10px; /* 可以根据需要调整间距 */
}

.u-page__tag-item2 {
	margin-right: 5px;
}

.u-page__tag-item3 {
	margin: 2px;
}
</style>
