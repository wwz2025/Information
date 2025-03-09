<template>
	<view class="content">
		<!--自定义底部工具栏
		<tabbar tabIndex=3 ></tabbar>-->

		<!--页面加载动画-->
		<u-loading-page
			:loadingText="loadingPageData.loadingText"
			:loadingMode="loadingPageData.loadingMode"
			:loading="loading"
			:color="loadingPageData.color"
			:loadingColor="loadingPageData.loadingColor"
		>
		</u-loading-page>

		<!-- 在你的页面或组件的template部分 -->

		<!-- #ifdef MP -->
		<view class="icon-container" 	:style="[{ top: topButton+'px'}]" style="margin-left:15px;position: absolute;width: 82px;border-radius: 80px;background-color: rgba(0, 0, 0, 0.11);">
			<u-icon class="left-icon" name="arrow-left" size="23" color="white" @click="goBack()" ></u-icon>
			<u-line
				direction="column"
				:hairline="false"
				length="23"
				margin="0 8px"
			></u-line>
			<u-icon class="right-icon" name="home" size="25" color="white" @click="goHome()"></u-icon>
		</view>
		<!-- #endif -->
		<!-- #ifndef MP -->
		<view class="icon-container" >
			<u-icon class="left-icon" name="arrow-left" size="23" color="white" @click="goBack()" ></u-icon>
			<u-icon class="right-icon" name="home" size="25" color="white" @click="goHome()"></u-icon>
		</view>
		<!-- #endif -->

			<!-- 用户背景封面 -->
			<!-- <image class="info-cover" @tap="fnMainBgPic" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-5d36bb3d-8e98-4f00-ab8b-b018dc4f5dc6/17b0292c-8a63-4b7b-a6a6-724f416a9958.jpg"
			  mode="scaleToFill"></image> -->

			 <!-- 用户头像关注 -->
			<!-- <label style="background-color: #fbfbfb;"> -->

			<view  class="user">
				<uni-popup ref="popup" type="center">
					<view class="img"  style="text-align: center;">
						<text style="font-size: 45px;" class="iconfont cell-icon icondianzan-ash" 	:style="[{ color: themeColor.color }]"></text>
					</view>
					<view class="text">共获得{{messageText?messageText:0}}个点赞</view>
				</uni-popup>

				<view class="user-section" :class="'bg-' + themeColor.name">
				<image class="bg" :src="userBg"></image>

				<!--用户信息-->
				<view class="user-info-box">
					<view
						class="portrait-box"
					>
<!--						<image
							class="portrait"
							:src="fileUrl+userInfo.avatar || headImg"
							@tap="navTo(userInfo ? '' : 'login')"
						></image>-->
						<u-avatar :src="fileUrl+userInfo.avatar || headImg" mode="circle" size="60">
						</u-avatar>
						<text class="username" @tap="navTo(userInfo ? '' : 'login')">
							{{
								userInfo.userName ||
								userInfo.phonenumber ||
									'登录/注册'
							}}
						</text>
						<!-- <u-tag style="right:0rpx;position: absolute;" v-if='showedit' text="编辑信息" mode="dark" shape="" bg-color="#ff1150" @tap="navTo(userInfo ? '/pages/user/userinfo/userinfo' : 'login')"/>
						<u-tag style="right:0rpx;position: absolute;" v-else :text='userInfo.focusFlag=1?"已关注":"关注"' mode="dark" shape="" bg-color="#ff1150" @tap="addFocus(userInfo.userId,userInfo.isFocus)" />
						 -->
					</view>
				</view>
				<!--vip信息-->
				<view class="vip-card-box">
					<view class="b-btn" >
						{{ userInfo.customerLevel | filterMemberLevel }}
					</view>
					<view class="tit">
						<i class="iconfont iconzuanshi" />
						{{appName}}尊享会员
					</view>
					<text class="e-m">{{appName}} 版权所有</text>
				</view>
			</view>

			<view
				class="cover-container"
				:style="[
					{
						transform: coverTransform,
						transition: coverTransition
					}
				]"
				@touchstart="coverTouchstart"
				@touchmove="coverTouchmove"
				@touchend="coverTouchend"
			>
				<image class="arc" :src="arc"></image>
				<!--余额 优惠券 积分信息-->
				<view class="promotion-center">
					<view class="tj-sction">
						<view class="tj-item" v-for="item in amountList" :key="item.title" @tap="navTo(item.url)" >
							<text class="num" :class="item.value > 0 ? 'text-'+themeColor.name : ''">
								{{ item.value }}
							</text>
							<text class="title">{{ item.title }}</text>
						</view>
					</view>
				</view>

			</view>

			</view>

		<!-- 广告组件 -->
		<!-- #ifndef MP -->
		<mix-advert
			ref="mixAdvert"
			:timedown="8"
			imageUrl="/static/advert.png"
			:url="advertNavUrl"
		></mix-advert>
		<!-- #endif -->

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
						lineWidth="30"
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
						 v-if="loadingTab>0"
					>
					</u-tabs>

		<!-- 下拉刷新组件 -->
		<mix-pulldown-refresh ref="mixPulldownRefresh" class="panel-content" :top="10" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll" :text="pulldownText">
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
							<!--						<text :class="['title', 'title'+item.type]">{{item.title}}</text>-->
							<view class="u-demo-block_content"  @click="navToDetails(item)">
								<view class="u-page__tag-item2">
									<u-avatar :src="item.avatar?fileUrl+item.avatar:headImg" mode="circle" size="40"></u-avatar>
								</view>
								<view class="u-page__tag-item2">
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

							<u-album :urls="item.coverImages" maxCount="6" multipleSize="120"></u-album>

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

	</view>
</template>

<script>
	import { articleListUrl,cmsTagsUrl,addMessageUrl,forumTagsUrl,getMessageUsersUrl} from '@/api/forum';
	import mixAdvert from '@/components/mix-advert/vue/mix-advert';
	import mixPulldownRefresh from '@/components/mix-pulldown-refresh/mix-pulldown-refresh';
	let windowWidth = 0, scrollTimer = false, tabBar;

	import { memberInfoById } from '@/api/userInfo';
	// import { articleListUrl,cmsTagsUrl} from '@/api/cms';
	import { addFocusUrl,deleteFocusUrl} from '@/api/profile';

	export default {
		components: {
			mixPulldownRefresh,
			mixAdvert
		},
		filters: {
			filterMemberLevel(val) {
				if (!val) return '普通用户';
				return val.name;
			},
			marketingTypeTag(marketingType) {
				let tag;
				switch (marketingType) {
					case 'discount':
						tag = $mAssetsPath.discountTag;
						break;
					case 'bargain':
						tag = $mAssetsPath.bargainTag;
						break;
					case 'group_buy':
						tag = $mAssetsPath.groupTag;
						break;
					case 'wholesale':
						tag = $mAssetsPath.wholesaleTag;
						break;
				}
				return tag;
			}
		},
		data() {
			return {
				topButton:0,//胶囊按钮顶部边缘相对于视口顶部的距离
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
					{id: "1",name: '全部',region:'',tagId:'',newsList:[],refreshing:0,
						loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
					},
					{id: "2",name: '最新',region:'new',tagId:'',newsList:[],refreshing:0,
						loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
					},
					{id: "3",name: '热门',region:'hot',tagId:'',newsList:[],refreshing:0,
						loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
					},
				],

				// fileUrl:this.$mConfig.fileUrl,
				messageText:'',
				settingList: this.$mConstDataConfig.settingList,
				orderSectionList: this.$mConstDataConfig.orderSectionList,
				amountList: this.$mConstDataConfig.amountList,
				orderStatics:{},
				isOpenLiveStreaming: this.$mSettingConfig.isOpenLiveStreaming,
				// headImg: this.$mAssetsPath.headImg,
				vipCardBg: this.$mAssetsPath.vipCardBg,
				arc: this.$mAssetsPath.arc,
				userBg: this.$mAssetsPath.userBg,
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				appName: this.$mSettingConfig.appName,

				uid:'',
				userInfo:{
					nickname:'zetank',
					avatar:"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b9e817e6-7ee6-461f-8e66-4bed243cbe98/ad090f5f-2a0f-4ea8-a8b5-fc8dafa4039e.jpg",
					gender:1,
					city:'广州',
					jor:'职务',
					good:{}
				},
				Information:'性格热情开朗,待人友好,为人诚实谦虚。工作勤奋,认真负责,能吃苦耐劳,尽职 尽责,有耐心。具有亲和力,平易近人,善于与人沟通；摄影、美食分享',
				membertype:'',
				showedit:false,//信息编辑按钮
				//示例mescroll
				mescroll:'',
				// 是否固定导航
				isFixed: false,
				// 距离顶部达到导航距离
				topNum: 0,
				// 选中
				current: 0,
				// 导航距离顶部
				tabbarTop: 0,
				clickRefresh: false,
				// 刷新间隔
				timeOutUserInfo: 0,
				// 激活顶部导航关联页状态
				status: {
					publish: true,
					praise: false,
				},
				toTop:{
					src : 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b9e817e6-7ee6-461f-8e66-4bed243cbe98/0436db82-2e48-4adb-8c87-2eb40e052b90.png' ,
					offset : 300 ,
					duration : 300,
					zIndex: 9990,
					right: 30,
					bottom: 150,
					safearea: false,
					width: 72,
					radius: "50%",
					left: null
				},


				// title:'',
				tagList: [
					{id: "tag01",name: '文章',url:''},
					{id: "tag02",name: '获赞',url:''},
					{id: "tag03",name: '粉丝',url:'/pages/user/fans/index?index=0'},
					{id: "tag04",name: '关注',url:'/pages/user/fans/index?index=1'}
				],
				tabList: [
					{id: "tab01",name: '在线问答',categoryId: "1"},
					// {id: "tab02",name: '视频学习',categoryId: "2"},
					// {id: "tab03",name: '文库资料',categoryId: "3"},
					// {id: "tab04",name: '名师讲堂',categoryId: "4"}
				],
				tabIndex: 0,
				cacheTab: [],
				scrollInto: "",
				navigateFlag: false,
				indicatorLineLeft: 0,
				indicatorLineWidth: 0,
				isTap: false,
				isFocus:false,
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
		async onLoad(option) {
			this.uid = option.uid
			let userId = uni.getStorageSync('userInfo').userId;
			//if(userId == option.uid){
			//	this.showedit=true
			//}
			//this.userInfo = uni.getStorageSync('userInfo');
			//this.userInfoCurr = uni.getStorageSync('userInfo');
			this.userInfo=this.getMemberInfo();

			// 获取屏幕宽度
			windowWidth = uni.getSystemInfoSync().windowWidth;

			// #ifdef MP
			this.topButton = wx.getMenuButtonBoundingClientRect().top;//胶囊按钮顶部边缘相对于视口顶部的距离
			console.log('胶囊按钮顶部边缘相对于视口顶部的距离:', wx.getMenuButtonBoundingClientRect().top);
			// #endif
			this.loadTabbars();
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
			// 返回主页
			goHome(){
				// uni.navigateTo({
				// 	url: '/pages/profile/profile'
				// });
				this.$mRouter.reLaunch({ route: '/pages/index/index' });
			},
			// 返回上一页
			goBack(){
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 上一页
				uni.navigateBack({
					success: function() {
						beforePage.onLoad(); // 执行上一页的onLoad方法
					}
				});
			},
			// 获取用户信息
			async getMemberInfo() {
				await this.$http
					.get(memberInfoById,{
						userId:this.uid,
						})
					.then(async r => {
						this.loading = false;
						this.userInfo = r;
						// this.amountList[0].value= r.score? r.score:'0';
						// this.amountList[0].value= r.questionCount? r.questionCount:'0';
						this.amountList[0].value=  this.userInfo.upvoteCount?  this.userInfo.upvoteCount:'0';
						this.amountList[1].value=  this.userInfo.fansCount?  this.userInfo.fansCount:'0';
						this.amountList[2].value=  this.userInfo.focusCount?  this.userInfo.focusCount:'0';

						console.log(this.userInfo)
					})
					.catch(() => {
					//	this.hasLogin = false;
						this.userInfo = {};
						this.loading = false;
					});
			},
			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e) {
				if (pageAtTop === false) {
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e) {
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if (moveDistance < 0) {
					this.moving = false;
					return;
				}
				this.moving = true;
				if (moveDistance >= 80 && moveDistance < 100) {
					moveDistance = 80;
				}
				if (moveDistance > 0 && moveDistance <= 80) {
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend() {
				if (this.moving === false) {
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
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
							questionRegion:tabItem.region,
							title:this.title,
							yhid:this.uid,
							categoryId:1,//问答
							available:1//已审核
						})
						.then(async r => {
							// 记录结束时间
							that.endTime = Date.now();
							// 计算并更新耗时
							that.timeTaken = that.endTime - that.startTime;
							let list0 = r.list;
							let list = [];

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

			//tab切换
			async changeTab(e){

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
				scrollTimer = setTimeout(()=>{


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

/deep/ .u-loading-page {
    padding-top: 390px;
}

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
		/*  #ifdef  APP-PLUS  */
		/*top: var(--status-bar-height);*/
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
			color: var(--dynamic-background-color);
			&:after{
				width: 50%;
			}
		}
	}

	.swiper-box{
		/*height: 100%;*/
		/*  #ifdef  H5  */
		height: 100%;
		/*  #endif  */
		/*  #ifdef  MP  */
		height: calc(100% - 368px);
		/*  #endif  */
		/*  #ifdef  APP-PLUS  */
		height: calc(100% - 4px) ;
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
		/*  #ifdef  APP-PLUS  */
		/*top: var(--status-bar-height);*/
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
		/*top: var(--status-bar-height);*/
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
		margin-top: -250px;
		flex-direction: column;
	}

.user {
		.user-section {
			height: 520upx;
			padding: 100upx 30upx 0;
			position: relative;
			display: flex;
			.bg {
				position: absolute;
				left: 0;
				top: 0;
				width: 100vw;
				height: 60vw;
				opacity: 0.84;
			}
			.user-info-box {
				height: 180upx;
				display: flex;
				align-items: left;
				position: relative;
				z-index: 1;
				justify-content: space-between;
				.portrait-box {
					display: flex;
					align-items: center;
					flex-direction: row;
					width: 100%;
					padding-top:34px;
					.portrait {
						width: 130upx;
						height: 130upx;
						border: 5upx solid #fff;
						border-radius: 50%;
					}

					.username {
						font-size: $font-lg + 6upx;
						color: $color-white;
						margin-left: 20upx;
					}

					button {
						background-color: transparent;
						font-size: $font-lg + 6upx;
						color: $font-color-dark;
						border: none;
					}

					button::after {
						border: none;
					}
				}
			}

			.vip-card-box {
				display: flex;
				flex-direction: column;
				color: #f7d680;
				height: 240upx;
				background: url('/static/vip-card.png');
				background-size: 100% 100%;
				border-radius: 16upx 16upx 0 0;
				overflow: hidden;
				position: relative;
				padding: 20upx 24upx;
				.b-btn{
					position: absolute;
					right: 24upx;
					top: 24upx;
					width: 132upx;
					height: 40upx;
					text-align: center;
					line-height: 40upx;
					font-size: 22upx;
					color: #36343c;
					border-radius: 20px;
					background: linear-gradient(to left, #f9e6af, #ffd465);
					z-index: 1;
				}
				.tit {
					font-size: $font-base + 2upx;
					color: #f7d680;
					margin-bottom: 28upx;
					display: inline-block;

					.iconfont {
						color: #f6e5a3;
						display: inline-block;
						margin-right: 16upx;
					}
				}
			}
		}

		.cover-container {
			margin-top: -150upx;
			padding: 0 30upx 0upx;
			position: relative;
			background-color: $page-color-base;

			.arc {
				position: absolute;
				left: 0;
				top: -34upx;
				width: 100%;
				height: 36upx;
			}

			.promotion-center {
				background: #fff;
				margin-bottom: 20upx;
				/*分类列表*/
				.category-list {
					width: 100%;
					padding: 0 0 30upx 0;
					border-bottom: solid 2upx #f6f6f6;
					display: flex;
					flex-wrap: wrap;
					.category {
						width: 33.3%;
						margin-top: 50upx;
						display: flex;
						justify-content: center;
						flex-wrap: wrap;
						.img {
							width: 100%;
							display: flex;
							justify-content: center;

							.iconfont {
								font-size: $font-lg + 24upx;
							}
						}

						.text {
							width: 100%;
							display: flex;
							justify-content: center;
							font-size: 24upx;
							color: #3c3c3c;
						}
						.share-btn {
							height: 142upx;
							text-align: left;
							background: none;
							padding: 0;
							margin: 0;
						}

						.share-btn:after {
							border: none;
							border-radius: none;
						}
					}
				}
			}

			.tj-sction {
				@extend %section;
				display: flex;
				flex-direction: row;
				.tj-item {
					@extend %flex-center;
					flex: 1;
					flex-direction: column;
					margin: 30upx 0;
					font-size: $font-sm;
					color: #75787d;
					/*border-right: 2upx solid rgba(0, 0, 0, 0.2);*/
				}

				/*.tj-item:last-child {*/
				/*border-right: none;*/
				/*}*/
				.num {
					//font-size: $font-base;
					font-size: 32upx;
				}
				.title {
					font-size: 30upx;
				}
				.red {
					color: $base-color;
				}
			}

			.order-section {
				@extend %section;
				padding: 28upx 0;

				.order-item {
					@extend %flex-center;
					width: 120upx;
					height: 120upx;
					border-radius: 10upx;
					font-size: $font-sm;
					color: $font-color-dark;
					position: relative;
				}

				.badge {
					position: absolute;
					top: 0;
					right: 4upx;
				}

				.iconfont {
					font-size: 48upx;
				}

				.icon-shouhoutuikuan {
					font-size: 44upx;
				}
			}

			.history-section {
				background: #fff;
				margin-bottom: $spacing-sm;
				.h-list-history {
					margin: 0;
					border-radius: 10upx;
					white-space: nowrap;
					background-color: $page-color-base;
					.h-item-history {
						background-color: $color-white;
						display: inline-block;
						font-size: $font-sm;
						color: $font-color-base;
						width: 180upx;
						margin: $spacing-sm $spacing-sm 0 0;
						border-radius: 10upx;
						position: relative;
						top: 0;
						overflow: hidden;
						.h-item-img {
							width: 180%;
							height: 200upx;
							border-top-left-radius: 12upx;
							border-top-right-radius: 12upx;
							border-bottom: 1upx solid rgba(0, 0, 0, 0.01);
						}
						.tag {
							position: absolute;
							border-top-left-radius: 12upx;
							left: 0;
							right: 0;
							width: 60upx;
							height: 60upx;
						}
						.h-item-text {
							font-size: $font-sm;
							margin: $spacing-sm 4upx;
						}
					}
				}
				.no-foot-print {
					text-align: center;
					padding: 48upx 0;

					.no-foot-print-icon {
						font-size: $font-lg + 2upx;
						margin-right: 10upx;
					}
				}
				.share-btn {
					height: 102upx;
					text-align: left;
					background: none;
					padding: 0;
					margin: 0;
				}

				.share-btn:after {
					border: none;
					border-radius: none;
				}
			}
		}
	}
	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	%section {
		justify-content: space-around;
		display: flex;
		align-content: center;
		background: #fff;
		border-radius: 10upx;
	}


		.cell-icon {
			align-self: center;
			/* width: 56upx;
			max-height: 60upx;
			font-size: 38upx; */
		}
		.cell-tit {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
			margin-right: 10upx;
		}
		.example-body {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			padding: 0;
			font-size: 14px;
			background-color: #ffffff;
		}
		.tag-view {
			/* #ifndef APP-PLUS-NVUE */
			display: flex;
			/* #endif */
			flex-direction: column;
			margin: 10rpx 15rpx;
			justify-content: center;
		}


	/* 在对应的样式部分，如style标签内或外部CSS文件 */
	.icon-container {
		/* #ifdef MP */
		/*top:var(--status-bar-height);*/
		display: flex; /* 使用 Flex 布局 */
		align-items: left;  /* 垂直居中对齐（如果需要）*/
		flex-direction: row; /* 明确指定子元素水平排列 */
		@include flex;
		/*align-items: center;*/
		/*justify-content: space-between;*/
		border-width: 0.5px;
		border-radius: 100px;
		border-color: $u-border-color;
		padding: 3px 7px;
		opacity: 0.8;
		/* #endif */

		/* #ifndef MP */
		top:20px;
		display: flex; /* 使用 Flex 布局 */
		flex-direction: row; /* 明确指定子元素水平排列 */
		justify-content:space-between; /* 图标整体居右对齐 */
		align-items: center; /* 垂直居中对齐（如果需要）*/
		padding: 5px;
		/* #endif */

		background: transparent;
		position: absolute;
		z-index: 1000;
		width: 100%;
	}

	.left-icon,
	.right-icon {
		/* 可以根据需要调整图标自身的样式 */
		width: 25px;
		height: 25px;
		border-radius: 90%;
		background-color: rgba(0, 0, 0, 0.11);
		margin-left: 10px; /* 为左侧图标之后的图标添加间隔 */
	}

/*.u-nav-slot {
	@include flex;
	align-items: center;
	justify-content: space-between;
	border-width: 0.5px;
	border-radius: 100px;
	border-color: $u-border-color;
	padding: 3px 7px;
	opacity: 0.8;
}*/

.u-page__tag-item2 {
	margin-right: 5px;
}

.u-page__tag-item3 {
	margin: 2px;
}
</style>
