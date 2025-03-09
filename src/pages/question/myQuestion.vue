<template>
	<view class="feedback-list">
		<view class="rf-list" v-if="feedbackList.length > 0">
			<view
				class="rf-list-item"
				v-for="(item, index) in feedbackList"
				:key="index"
			>
				<view class="wrapper">

					<view class="u-box" style="display: flex;" >
						<view>
							帖子类型：<text class="nameDark">{{item.forumCategoryName}}</text>
							帖子状态：<text class="nameDark">{{ item.available=='0'?'待发布':
								item.available=='1'?'已发布':
									item.available=='2'?'待审核':''
								}}</text>
						</view>
					</view>

					<view class="u-box" style="display: flex;">
						<view>
							置顶支付：<text  v-if="item.payCount" class="nameDark" :style="{color:themeColor.color}">{{item.payCount}}元</text>
							置顶过期：<text  v-if="item.payCount" class="nameDark" :style="{color:themeColor.color}">{{item.topExpire}}</text>
						</view>
					</view>

					<view class="address-box">
						 <view  @click="navTo(`/pages/question/view?id=${item.id}`)">
							 <text class="address in1line" style="width:540upx;">{{ item.content }}</text>
						 </view>
					</view>

					<view class="u-box" style="display: flex;">
						<view>
							<text class="name">{{item.replyNum}}条评论</text>
							<text class="name">{{item.keywords}}</text>
						</view>
						<view style="right: 10px;position: absolute;">
							<text class="name" @click="navTo(`/pages/question/view?id=${item.id}`)">查看</text>
							<text  :class="'text-red'" class="name" @click="del(index)">删除</text>
						</view>
					</view>
				</view>
			</view>
			<rf-load-more
				v-if="feedbackList.length > 0 && !loading"
				:status="loadingType"
			/>
		</view>
		<view class="add-btn-wrapper" >
			<button  class="add-btn" :class="'bg-' + themeColor.name" @tap="navTo(`/pages/question/add`)">
				+提问
			</button>
		</view>

		<u-empty text="暂无数据" :iconColor="themeColor.color" mode="data"  v-if="feedbackList.length === 0 && !loading">
		</u-empty>
	</view>
</template>

<script>
import { opinionList } from '@/api/userInfo';
import { articleListUrl,delQuestion} from '@/api/forum';

import utils from '@/utils/utils';
import rfLoadMore from '@/components/rf-load-more/rf-load-more';

export default {
	components: {
		rfLoadMore
	},
	data() {
		return {
			pageNum :1,
			feedbackList: [],
			loadingType: 'more',
			loading: true
		};
	},
	filters: {
		feedbackFilter(type) {
			const feedbackType = ['', '功能建议', 'BUG反馈', '业务咨询'];
			return feedbackType[parseInt(type, 10)];
		}
	},
	// 下拉刷新
	onPullDownRefresh() {

		this.pageNum = 1;
		this.feedbackList.length = 0;
		this.getFeedbackList('refresh');
	},
	// 加载更多
	onReachBottom() {
  if (this.loadingType === 'nomore') return;
		this.pageNum++
		this.getFeedbackList();
	},
	onLoad() {
		this.initData();
	},
	methods: {
		time(val) {
			return (val?utils.friendlyDate(new Date(val)):'');
		},
		// 数据初始化
		initData() {
			this.pageNum =1;
			this.feedbackList.length = 0;
			this.getFeedbackList();
		},
		// 获取意见反馈列表
		getFeedbackList(type) {
			this.$http.get(`${articleListUrl}`,
			{pageNum:this.pageNum,pageSize:10,yhid:uni.getStorageSync('userInfo').userId})
			.then(r => {
 					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					this.loadingType = r.list.length === 10&&r.total>this.pageNum*10 ? 'more' : 'nomore';
					this.feedbackList = [...this.feedbackList, ...r.list];
				})
				.catch(() => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		del(index) {
		 uni.showModal({
		    content: '确定删除？',
		    success: (res) => {
		      if (res.confirm) {
						let item = this.feedbackList[index];
						//取消收藏
						this.$http.post(`${delQuestion}`,{
							ids:item.id
						})
						.then(async res => {
							if (res) {
								this.feedbackList.splice(index, 1);
								this.$mHelper.toast("已删除！");
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
	}
};
</script>

<style lang="scss">
page {
	background-color: $page-color-base;
}

.feedback-list {
	position: relative;
	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box {
		display: flex;
		align-items: center;
		margin-top: 16upx;
		.tag {
			font-size: 24upx;
			margin-right: 10upx;
			border: 1px solid;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address {
			font-size: 28upx;
			color: $font-color-dark;
		}
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
		.nameDark {
			color: $font-color-dark;
			margin-right: 30upx;
		}
	}
}
</style>
