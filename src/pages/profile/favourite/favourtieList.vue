<template>
  <view class="tabs">
	<view class="tab-bar-top">
	 <!--搜索导航栏-->
	 <view :class="'bg-' + themeColor.name + ' rf-header'">
	 	<view class="input-box" :style="{marginTop:'0px'}">
	 		<input
	 			v-model="title"
	 			@confirm="search"
	 			placeholder="请输入关键字"
	 			placeholder-style="font-size: 24upx; color:#ccc;"
	 			type="text"/>
	 		<text class="icon iconfont iconsousuo2" style="font-size: 22px;" @tap.stop="search"></text>
	 	</view>
	 </view>
	   <scroll-view ref="tabbar1" id="tab-bar" class="tab-bar" :scroll="false" :scroll-x="true" :show-scrollbar="false"
	     :scroll-into-view="scrollInto">
	     <view style="flex-direction: column;">
	       <view style="flex-direction: row;">
	         <view class="uni-tab-item" v-for="(tab,index) in tabList" :key="tab.id" :id="tab.id" :ref="'tabitem'+index"
	           :data-id="index" :data-current="index" @click="ontabtap">
	           <text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
	         </view>
	       </view>
	       <view class="scroll-view-indicator">
	         <view ref="underline" class="scroll-view-underline" :class="isTap ? 'scroll-view-animation':''" :style="{left: indicatorLineLeft + 'px', width: indicatorLineWidth + 'px'}"></view>
	       </view>
	     </view>
	   </scroll-view>
	</view>
    <view class="tab-bar-line"></view>
    <swiper class="tab-box" ref="swiper1" :current="tabIndex" :duration="300" @change="onswiperchange" @transition="onswiperscroll"
      @animationfinish="animationfinish" @onAnimationEnd="animationfinish">
      <swiper-item class="swiper-item" v-for="(page, index) in tabList" :key="index">
        <newsPage class="page-item" :nid="page.newsid" :tagId="page.tagId" :title="title" :region="page.region"  :ref="'page' + index"></newsPage>
      </swiper-item>
    </swiper>

		<!-- <rf-back-top :scrollTop="scrollTop"></rf-back-top> -->
  </view>
</template>

<script>
  // #ifdef APP-PLUS
  const dom = weex.requireModule('dom');
  // #endif
	import { articleListUrl,cmsTagsUrl} from '@/api/cms';

  import newsPage from './news-page.nvue';

  // 缓存每页最多
  const MAX_CACHE_DATA = 100;
  // 缓存页签数量
  const MAX_CACHE_PAGE = 3;
  const TAB_PRELOAD_OFFSET = 1;

  export default {
    components: {
      newsPage
    },
    data() {
      return {
		title:'',
        tabList: [
					{id: "tab01",name: '推荐',newsid: 1,region:'recommend',tagId:''},
					{id: "tab02",name: '最新',newsid: 2,region:'new',tagId:''},
					{id: "tab03",name: '热门',newsid: 3,region:'hot',tagId:''},
				],
        tabIndex: 0,
        cacheTab: [],
        scrollInto: "",
        navigateFlag: false,
        indicatorLineLeft: 0,
        indicatorLineWidth: 0,
        isTap: false,
				// scrollTop: 0,//是否返回页面顶部
      }
    },
    //返回页面顶部
   //  onPageScroll(e) {

   //  	this.scrollTop = e.scrollTop;
   //  },
		//下拉刷新
		onPullDownRefresh() {
			;
		    this.pageList[this.tabIndex].refreshData(true);
		        console.log('refresh');
		        setTimeout(function () {
		            uni.stopPullDownRefresh();
		        }, 1000);
		},

	// onLoad(options) {
	onLoad() {
		this._lastTabIndex = 0;
		this.swiperWidth = 0;
		this.tabbarWidth = 0;
		this.tabListSize = {};
		this._touchTabIndex = 0;
		//动态加载选项卡
		this.loadData();

    },
    methods: {
		// 搜索资讯列表
		search(){
			for (var i = 0; i < this.tabList.length; i++) {
				this.clearTabData(i);
				this.loadTabData(i);
			}
		},
		async	loadData(refresh) {
					await this.$http.get(`${cmsTagsUrl}`, {})
						.then(async r => {
							  ;
								let linList=r.list;
								for (var j = 0; j < linList.length; j++) {
										let entity={id: "",name: '',newsid: 0,region:'',tagId:''};
										entity.id="tab0"+(j+4);
									 	entity.name=linList[j].tagName;
									 	entity.newsid=j+4;
									 	entity.region='';
									 	entity.tagId=linList[j].tagId;
										this.tabList.push(entity);
								}
								setTimeout(() => {
									this.pageList = [];
									for (var i = 0; i < this.tabList.length; i++) {
										let item = this.$refs['page' + i]
										if (Array.isArray(item)) {
											this.pageList.push(item[0])
										} else {
											this.pageList.push(item)
										}
									}
									console.log("============",this.pageList)
									this.switchTab(this.tabIndex);
									this.selectorQuery();
								}, 500)

						})
						.catch(err => {
							// this.errorInfo = err;
							this.isLoading = false;
							if (refresh) {
								uni.stopPullDownRefresh();
							}
							// if (this.dataList.length == 0) {
							//   this.isNoData = true;
							// }
						});
			},
      ontabtap(e) {
        let index = e.target.dataset.current || e.currentTarget.dataset.current;
        //let offsetIndex = this._touchTabIndex = Math.abs(index - this._lastTabIndex) > 1;

        // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-QQ
        this.isTap = true;
        var currentSize = this.tabListSize[index];
        this.updateIndicator(currentSize.left, currentSize.width);
        this._touchTabIndex = index;
        // #endif

        this.switchTab(index);

      },
      onswiperchange(e) {

        // 注意：百度小程序会触发2次
        // #ifndef APP-PLUS || H5 || MP-WEIXIN || MP-QQ
        let index = e.target.current || e.detail.current;
        this.switchTab(index);
        // #endif
      },
      onswiperscroll(e) {
        if (this.isTap) {
          return;
        }

        var offsetX = e.detail.dx;
        var preloadIndex = this._lastTabIndex;
        if (offsetX > TAB_PRELOAD_OFFSET) {
          preloadIndex++;
        } else if (offsetX < -TAB_PRELOAD_OFFSET) {
          preloadIndex--;
        }
        if (preloadIndex === this._lastTabIndex || preloadIndex < 0 || preloadIndex > this.pageList.length - 1) {
          return;
        }
        if (this.pageList[preloadIndex].dataList.length === 0) {
          this.loadTabData(preloadIndex);
        }

        // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-QQ
        var percentage = Math.abs(this.swiperWidth / offsetX);
        var currentSize = this.tabListSize[this._lastTabIndex];
        var preloadSize = this.tabListSize[preloadIndex];
        var lineL = currentSize.left + (preloadSize.left - currentSize.left) / percentage;
        var lineW = currentSize.width + (preloadSize.width - currentSize.width) / percentage;
        this.updateIndicator(lineL, lineW);
        // #endif
      },
      animationfinish(e) {
        // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-QQ
        let index = e.detail.current;
        if (this._touchTabIndex === index) {
          this.isTap = false;
        }
        this._lastTabIndex = index;
        this.switchTab(index);
        this.updateIndicator(this.tabListSize[index].left, this.tabListSize[index].width);
        // #endif
      },
      selectorQuery() {
        // #ifdef APP-NVUE
        dom.getComponentRect(this.$refs.tabbar1, res => {
          this.tabbarWidth = res.size.width;
        });
        dom.getComponentRect(this.$refs['swiper1'], res => {
          this.swiperWidth = res.size.width;
        });
        for (var i = 0; i < this.tabList.length; i++) {
        	this.getElementSize(dom, this.$refs['tabitem' + i][0], i);
        }
        // 因 nvue 暂不支持 class 查询
        var queryTabSize = uni.createSelectorQuery().in(this);
        for (var i = 0; i < this.tabList.length; i++) {
          queryTabSize.select('#' + this.tabList[i].id).boundingClientRect();
        }
        queryTabSize.exec(rects => {
          rects.forEach((rect) => {
            this.tabListSize[rect.dataset.id] = rect;
          })
          this.updateIndicator(this.tabListSize[this.tabIndex].left, this.tabListSize[this.tabIndex].width);
          this.switchTab(this.tabIndex);
        });
        // #endif

        // #ifdef MP-WEIXIN || H5 || MP-QQ
        uni.createSelectorQuery().in(this).select('.tab-box').fields({
          dataset: true,
          size: true,
        }, (res) => {
          this.swiperWidth = res.width;
        }).exec();
        uni.createSelectorQuery().in(this).selectAll('.uni-tab-item').boundingClientRect((rects) => {
		  console.log("------------",rects)
		  rects.forEach((rect) => {
            this.tabListSize[rect.dataset.id] = rect;
          })
          this.updateIndicator(this.tabListSize[this.tabIndex].left, this.tabListSize[this.tabIndex].width);
        }).exec();
        // #endif
      },
      getElementSize(dom, ref, id) {
        dom.getComponentRect(ref, res => {
          this.tabListSize[id] = res.size;
        });
      },
      updateIndicator(left, width) {
        this.indicatorLineLeft = left;
        this.indicatorLineWidth = width;
      },
      switchTab(index) {
        if (this.pageList[index].dataList.length === 0) {
          this.loadTabData(index);
        }

        if (this.tabIndex === index) {
          return;
        }

        // 缓存 tabId
        if (this.pageList[this.tabIndex].dataList.length > MAX_CACHE_DATA) {
          let isExist = this.cacheTab.indexOf(this.tabIndex);
          if (isExist < 0) {
            this.cacheTab.push(this.tabIndex);
          }
        }

        this.tabIndex = index;

        // #ifdef APP-NVUE
        this.scrollTabTo(index);
        // #endif
        // #ifndef APP-NVUE
        this.scrollInto = this.tabList[index].id;
        // #endif

        // 释放 tabId
        if (this.cacheTab.length > MAX_CACHE_PAGE) {
          let cacheIndex = this.cacheTab[0];
          this.clearTabData(cacheIndex);
          this.cacheTab.splice(0, 1);
        }
      },
      scrollTabTo(index) {
        const el = this.$refs['tabitem' + index][0];
        let offset = 0;
        // TODO fix ios offset
        if (index > 0) {
          offset = this.tabbarWidth / 2 - this.tabListSize[index].width / 2;
          if (this.tabListSize[index].right < this.tabbarWidth / 2) {
            offset = this.tabListSize[0].width;
          }
        }
        dom.scrollToElement(el, {
          offset: -offset
        });
      },
      loadTabData(index) {

        this.pageList[index].loadData();
      },
      clearTabData(index) {
        this.pageList[index].clear();
      }
    }
  }
</script>
<style lang="scss">
	.tab-bar-top{
		z-index:20;
		.rf-header{
			width: 100%;
			z-index:20;
			align-items: center;
			height: 110upx;
			padding-top: 25upx;
			.input-box {
				width: 710upx;
				height: 60upx;
				font-size: $font-sm;
				box-sizing: border-box;
				color: #999;
				display: flex;
				align-items: center;
				overflow: hidden;
				background-color: $page-color-base;
				border-radius: 30upx;
				position: relative;
				margin: 10upx 20upx 0upx 20upx;
				.iconsousuo2 {
					z-index: 100;
					display: flex;
					align-items: center;
					position: absolute;
					top: 0;
					right: 0;
					width: 60upx;
					height: 60upx;
					font-size: $font-lg + 4upx;
					color: $font-color-dark;
				}
				input {
					margin-top: 11upx;
					width: 100%;
					padding-left: 28upx;
					height: 28upx;
					color: $font-color-base;
					font-size: 28upx;
				}
			}
			.rf-header-right{
				width: 60upx;
				height: 60upx;
				image{
					width: 40upx;
					height: 40upx;
				}
			}
		}
		.index-cate {
			white-space: nowrap;
			z-index: 10;
			background-color: $color-white;
			/*#ifndef MP*/
			position: fixed;
			/*#endif*/
			padding-top: 20upx;
			margin-bottom: $spacing-sm;
			.index-cate-item {
				display: inline-block;
				height: 75upx;
				line-height: 75upx;
				margin: 0 15upx;
				text-align: center;
				width: 120upx;
				font-size: $font-base;
			}
			.active {
				font-weight: 500;
				border-bottom: 2px solid;
			}
		}
		.main-wrapper {
			/* margin-top: 85upx; */
			margin-top: 5upx;
			/*#ifdef MP*/
			margin-top: 0;
			/*#endif*/
		}}
</style>

<style>
  /* #ifndef APP-PLUS */
  page {
    width: 100%;
    min-height: 100%;
    display: flex;
  }
  /* #endif */


  .tabs {
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    background-color: #ffffff;
    /* #ifdef MP-ALIPAY || MP-BAIDU */
    height: 100vh;
    /* #endif */
  }

  .tab-bar {
    /* #ifdef APP-PLUS */
    width: 750rpx;
    /* #endif */
    height: 42px;
    flex-direction: row;
    /* #ifndef APP-PLUS */
    white-space: nowrap;
    /* #endif */
  }

  /* #ifndef APP-NVUE */
  .tab-bar ::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
  }

  /* #endif */

  .scroll-view-indicator {
    position: relative;
    height: 2px;
    background-color: transparent;
  }

  .scroll-view-underline {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0;
    background-color: #007AFF;
  }

  .scroll-view-animation {
    transition-duration: 0.2s;
    transition-property: left;
  }

  .tab-bar-line {
    height: 0px;
    background-color: #cccccc;
  }

  .tab-box {
    flex: 1;
  }

  .uni-tab-item {
    /* #ifndef APP-PLUS */
    display: inline-block;
    /* #endif */
    flex-wrap: nowrap;
    padding-left: 20px;
    padding-right: 20px;
  }

  .uni-tab-item-title {
    color: #555;
    font-size: 15px;
    height: 40px;
    line-height: 40px;
    flex-wrap: nowrap;
    /* #ifndef APP-PLUS */
    white-space: nowrap;
    /* #endif */
  }

  .uni-tab-item-title-active {
    color: #007AFF;
  }

  .swiper-item {
    flex: 1;
    flex-direction: column;
  }

  .page-item {
    flex: 1;
    flex-direction: row;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
</style>
