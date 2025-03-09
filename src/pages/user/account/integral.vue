<template>
	<view class="integral">
		<view class="header" :class="'bg-' + themeColor.name">
			<view class="title">当前积分</view>
			<text class="num" >{{
					score ||
						'0'
				}}
				<!-- {{
					(pointAdd + pointMin) ||
						'0'
				}} -->
			</text>
			<view class="line" />
			<view class="nav">
				<!-- <view class="item">
					<text class="num">
						{{
							(pointAdd -pointMin) ||
								'0'
						}}
					</text>
					<text class="title">累计积分</text>
				</view> -->
				<view class="item">
					<text class="num">
						{{
							(pointAdd) ||
								'0'
						}}
					</text>
					<text class="title">累计收入</text>
				</view>
				<view class="item">
					<text class="num">
						{{
							-(
								pointMin ) || '0'
						}}
					</text>
					<text class="title">累计消费</text>
				</view>
			</view>
			<view class="tab">
				<view
					class="item"
					:class="current === index ? `text-${themeColor.name} on` : ''"
					v-for="(item, index) in navList"
					:key="index"
					@tap="nav(index)"
				>
					{{ item.name }}
				</view>
			</view>
		</view>
		<view class="wrapper">
			<view class="list1" v-if="current==0">
				<view class="tip acea-row row-middle">
					<span class="iconfont icon-shuoming"></span>提示：积分可兑换指定商品
				</view>
				<view
					class="list b-b"
					v-for="(item, index) in integralInList"
					:key="index"
				>
					<view class="wrapper">
        		<view class="address-box" style="font-size: 18px;margin-bottom: 5px;">
        							{{ item.cat=='支出'?getOutType(item.forumInType):getInType(item.forumInType,item.cat)}}
									<text
									class="change-num"
									:class="parseFloat(item.amount) >= 0 ? 'change-num-add' : 'change-num-reduce'"
									>{{ item.amount | numFilter }}</text>
        		</view>
						<view class="address-box" style="margin-bottom: 5px;">
							{{ item.description }}
						</view>
						 <view class="u-box">
							{{ item.storeName  }}
						</view>
					</view>
					<!-- <text class="u-box"  >{{ item.storeName}}</text> -->
				</view>
				<rf-load-more class="load-more" :status="loadingType"></rf-load-more>
			</view>
			<view class="list1" v-if="current==1">
				<view class="tip acea-row row-middle">
        					<span class="iconfont icon-shuoming"></span>提示：积分消费记录
        				</view>
        				<view
        					class="list b-b"
        					v-for="(item, index) in integralOutList"
        					:key="index"
        				>
        					<view class="wrapper">
										<view class="address-box" style="font-size: 18px;margin-bottom: 5px;">
															{{ getOutType(item.forumInType)}}
													<text
													class="change-num"
													:class="parseFloat(item.amount) >= 0 ? 'change-num-add' : 'change-num-reduce'"
													>{{ item.amount | numFilter }}</text>
										</view>
										<view class="address-box" style="margin-bottom: 5px;">
											{{ item.description }}
										</view>
										 <view class="u-box">
											{{ item.storeName  }}
										</view>
        					</view>
        					<!-- <text
        						class="change-num"
        						:class="'change-num-reduce'">-{{ item.skuDetail.point  }}</text> -->
										<!-- <text class="u-box"  >{{ item.storeName}}</text> -->
        				</view>
        				<rf-load-more class="load-more" :status="loadingType"></rf-load-more>
			</view>

		<view class="list1"  v-if="current==2">
			<view class="tip acea-row row-middle">
		  					<span class="iconfont icon-shuoming"></span>提示：积分兑换礼品记录
		  				</view>
		  				<view
		  					class="list b-b"
		  					v-for="(item, index) in orderList"
		  					:key="index"
		  				>
		  					<view class="wrapper">
									<view class="address-box" style="font-size: 18px;margin-bottom: 5px;">
														{{ item.storeOrderGoods[0].goodsName}}
													<text
													class="change-num"
													:class="parseFloat(item.amount) >= 0 ? 'change-num-add' : 'change-num-reduce'"
													>{{-1* item.storeOrderGoods[0].goodsPrice*item.storeOrderGoods[0].goodsNum | numFilter }}</text>
									</view>
									<view class="address-box" style="margin-bottom: 5px;">
										{{
										"单价："+item.storeOrderGoods[0].goodsPrice+
										"，兑换数量："+item.storeOrderGoods[0].goodsNum+"，使用积分："+
										(item.storeOrderGoods[0].goodsPrice*item.storeOrderGoods[0].goodsNum) }}
									</view>
									 <view class="u-box">
										{{ item.addTime | time}}
									</view>
		  					</view>
		  					<!-- <text
		  						class="change-num"
		  						:class="'change-num-reduce'">-{{ item.skuDetail.point  }}</text> -->
									<!-- <text class="u-box"  >{{ item.storeName}}</text> -->
		  				</view>
		  				<rf-load-more class="load-more" :status="loadingType"></rf-load-more>
		</view>

		</view>
		<!--加载动画-->

	</view>
</template>
<script>
/**
 * @des 积分中心
 *
 * @author taidao-01-10 15:24
 * @copyright 2019
 */
import { pointsList,pointTotalList,querypointmallorderlist ,querypointorderlist,
        submitpointmallorder ,
        confirmreceiptpointmallorder ,
        querypointmallorderdetail ,
        pointorderCount } from '@/api/userInfo';
import rfLoadMore from '@/components/rf-load-more/rf-load-more.vue';

import moment from '@/utils/moment';
export default {
	name: 'Integral',
	components: {
		rfLoadMore
	},
	data() {
		return {
			navList: [{ name: '积分变动' }, { name: '积分消费' }, { name: '积分订单' }],
			current: 0,
			pointAdd:uni.getStorageSync('userInfo').totalInScore,
			pointMin:uni.getStorageSync('userInfo').totalOutScore,
			integralInList: [],
			integralOutList:[],
			orderList:[],
			loadingType: 'more',
			pageNum :1,
			userInfo: {},
			loading: true,
			score: uni.getStorageSync('userInfo').score
		};
	},
	onLoad() {
		this.initData();
	},
	filters: {
		time(val) {
			// return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
			return moment((new Date(val))).format('YYYY-MM-DD HH:mm:ss');
		},
		numFilter(val) {
			return val >= 0 ? `+${val.toString()}` : val;
		}
	},
	// 加载更多
	onReachBottom() {
  if (this.loadingType === 'nomore') return;
		this.pageNum++;
		this.getIntegralInList();
	},
	methods: {
		toCategory() {
			this.$mRouter.reLaunch({ route: '/pages/category/category' });
		},
		getInType(forumInType,cat)
		{

			if(forumInType==1){
			  return  "每日登陆";
			}
			else if(forumInType==2){
			  return   "每日签到";
			}
			else if(forumInType==3){
			  return   "发表帖子";
			}
			else if(forumInType==4){
			  return   "评论";
			}
			else if(forumInType==5){
			  return   "发帖被点赞";
			}
			else if(forumInType==6){
			  return   "帖子被推荐";
			}
			else if(forumInType==7){
			  return   "帖子为热门";
			}
			else if(forumInType==8){
			  return   "发表文档或视频";
			}
			else if(forumInType==9){
			  return   "文档或视频被下载";
			}
			else if(forumInType==10){
			  return   "文档或视频为“精品”、“精选”";
			}
			else if(forumInType==11){
			  return   "购买商品";
			}
			else if(forumInType==12){
			  return   "正确举报违规";
			}
			else if(forumInType==13){
			  return   "对工作人员答复内容评分";
			}
			else if(forumInType==14){
			  return   "帖子被收藏";
			}
		},
		getOutType(forumOutType)
		{
				if(forumOutType==1){
						return "发表恶意灌水评论";
				}
				else if(forumOutType==2){
						return "发表恶意灌水评论";
				}
				else if(forumOutType==3){
						return "客户自己删除帖子";
				}
				else if(forumOutType==4){
						return "客户自己删除评论";
				}
				else if(forumOutType==5){
						return "帖子被取消点赞";
				}
				else if(forumOutType==6){
						return "帖子被取消收藏";
				}
				else if(forumOutType==7){
						return "帖子被取消收藏";
				}
				else if(forumOutType==8){
						return "下载文档或视频";
				}
				else if(forumOutType==9){
						return "兑换礼品";
				}
		},
		nav(index) {
			this.loading = true;
			this.current = index;
			this.pageNum = 1;
			this.integralInList.length = 0;
			if(index==0){
				this.integralInList =[];
				this.getIntegralInList();
			}else if(index==1){
				this.integralOutList =[];
				this.querypointmallorderlist();
			}else if(index==2){
				this.orderList =[];
				this.querypointorderlist();
			}
		},
		initData() {
			this.userInfo = uni.getStorageSync('userInfo') || undefined;
			this.getIntegralInList();
		},

    		querypointorderlist(){
    		 this.$http
        				.get(`${querypointorderlist}`, {
        					pageNum: this.pageNum,
									pageSize: 10,
									userId:uni.getStorageSync('userInfo').userId
        				})
        				.then(r => {

        					this.loading = false;
        					if(r.list){
        					this.loadingType = r.list.length === 10&&r.total>this.pageNum*10 ? 'more' : 'nomore';
        					this.orderList = [...this.orderList, ...r.list];
        					}
        				})
        				.catch(() => {
        					this.loading = false;
        				});
    		},

    		querypointmallorderlist(){
    		 this.$http
        				.post(`${pointsList}`, {
        					pageNum: this.pageNum,
									pageSize: 10,
									userId:uni.getStorageSync('userInfo').userId,
									cat:'支出'
        				})
        				.then(r => {

        					this.loading = false;
        					if(r.list){
        					this.loadingType = r.list.length === 10&&r.total>this.pageNum*10 ? 'more' : 'nomore';
        					this.integralOutList = [...this.integralOutList, ...r.list];
        					}
        				})
        				.catch(() => {
        					this.loading = false;
        				});
    		},
		 getIntegralInList() {
			 this.$http
				.post(`${pointsList}`, {
					pageNum: this.pageNum,
					pageSize: 10,
					userId:uni.getStorageSync('userInfo').userId
				})
				.then(r => {

					this.loading = false;
					if(r.list){
					this.loadingType = r.list.length === 10&&r.total>this.pageNum*10 ? 'more' : 'nomore';
					this.integralInList = [...this.integralInList, ...r.list];
					}
				})
				.catch(() => {
					this.loading = false;
				});
		}
	}
};
</script>
<style scoped lang="scss">
page {
	background-color: $color-white;
}
.integral {
	background-color: $color-white;
	/*  #ifndef H5  */
	height: 100vh;
	/*  #endif  */
	.header {
		opacity: 0.9;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		width: 100%;
		height: 420upx;
		font-size: $font-base;
		color: #fff;
		padding: 20upx 0;
		text-align: center;
		position: relative;
		.title {
			font-size: $font-lg;
			margin: 10upx 0;
		}
		.num {
			/*<!--color: $base-color;-->*/
			font-size: $font-lg + 4upx;
			font-weight: lighter;
			line-height: 1;
		}
		.line {
			width: 10%;
			height: 3upx;
			background-color: #fff;
			margin: 20upx auto 30upx;
		}
		.nav {
			width: 100%;
			display: flex;
			.item {
				flex: 1;
				.num {
					font-size: $font-lg + 4upx;
					display: block;
					line-height: 1;
				}
			}
		}
		.tab {
			position: absolute;
			bottom: -2upx;
			display: flex;
			width: 80%;
			margin: 0 10%;
			border-radius: 20upx 20upx 0 0;
			background-color: #f7f7f7;
			height: 80upx;
			line-height: 80upx;
			font-size: $font-base;
			color: #bbb;
			.item {
				font-size: $font-lg - 2upx ;
				flex: 1;
				text-align: center;
				line-height: 80upx;
			}
			.on {
				background-color: #fff;
				font-weight: bold;
				border-radius: 20upx 0 0 0;
			}
			.on:last-child {
				border-radius: 0 20upx 0 0;
			}
		}
	}
}
.wrapper .list1 {
	background-color: #fff;
	.tip {
		font-size: $font-sm;
		width: 90%;
		margin: $spacing-base 5%;
		height: 64upx;
		line-height: 64upx;
		border-radius: 30upx;
		background-color: #fff5e2;
		border: 1px solid #ffeac1;
		color: #c8a86b;
		text-align: center;
	}
	.list {
		display: flex;
		align-items: center;
		padding: 20upx 36upx;
		background: #fff;
		position: relative;
		.wrapper {
			display: flex;
			flex-direction: column;
			flex: 1;
			.address-box {
				display: flex;
				align-items: center;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.u-box {
				color: $font-color-light;
				font-size: $font-sm;
			}
		}
		.change-num {
			font-size: $font-lg + 4upx;
			color: $font-color-base;
		}
		.change-num-add {
			//color: #16ac57;
			color: #ff1150;
		}
		.change-num-reduce {
			color: $base-color;
		}
	}
}
.wrapper .list2 {
	/*background-color: #F76260;*/
}
.wrapper .list2 .item {
	background-image: linear-gradient(to right, #fff7e7 0%, #fffdf9 100%);
	width: 90%;
	margin: $spacing-base 5%;
	height: 120upx;
	line-height: 120upx;
	position: relative;
	border-radius: 20upx;
	padding: 0 20upx;
	display: flex;
}
.wrapper .list2 .item .pictrue {
	width: 60upx;
	height: 100upx;
	margin: 20upx 0;
	image {
		width: 80%;
		height: 80%;
	}
}
.wrapper .list2 .item .name {
	flex: 1;
	font-size: $font-sm;
	font-weight: bold;
	color: #c8a86b;
	margin: 0 20upx;
}
.wrapper .list2 .item .earn {
	font-size: $font-sm;
	color: #c8a86b;
	border: 2upx solid #c8a86b;
	text-align: center;
	height: 48upx;
	margin: 36upx 0;
	width: 120upx;
	border-radius: 10upx;
}
</style>
