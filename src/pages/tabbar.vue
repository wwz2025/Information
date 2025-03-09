<template>
	<view>
		<view class="cu-bar tabbar bg-white pos-bottom" style="border-top:1rpx #DCDFE6 solid ; background-color: #FFFFFF; z-index: 1000;width: 100%;flex-direction: row;">
			<view class="action" @click="setTab(item)" v-for="(item,index) in tabbar" :key="index"  >
				<block v-if="tabIndex == index">
					<view  style="position: absolute;right: 10upx;top: 10upx;" v-if="index===3">
						<u-badge :value="msgCout" numberType="ellipsis" max="99"></u-badge>
					</view>
					<view v-if="item.center">
						<image class="logo_btn" mode="widthFix" src="../static/tab-question.png" :class="'bg-' + themeColor.name"></image>
					</view>
<!--					<view style="font-size: 27px;" v-else  :class="[item.icon, 'text-'+themeColor.name]" :style="'color:'+themeColor.color"></view>-->
					<view class="icon-container" v-else >
						<u-icon	:name="item.icon" :size="34" :color="themeColor.color" style="flex-direction: column;" class="u-icon--tab"></u-icon>
					</view>
					<text style="font-size: 12px;" v-if="!item.center" :class="['text-'+themeColor.name]" :style="'color:'+themeColor.color+';width:100%;'">{{ item.text }}</text>
				</block>
				<block v-else>
					<view  style="position: absolute;right: 10upx;top: 10upx;" v-if="index===3">
						<u-badge :value="msgCout" numberType="ellipsis" max="99"></u-badge>
					</view>
					<view v-if="item.center">
						<image class="logo_btn" mode="widthFix" src="../static/tab-question.png" :class="'bg-' + themeColor.name"></image>
					</view>
<!--					<view  style="font-size: 27px;" v-else  :class="[item.icon]"></view>-->
					<view class="icon-container" v-else >
						<u-icon	:name="item.icon" :size="34" style="flex-direction: column;" class="u-icon--tab"></u-icon>
					</view>
					<text  style="font-size: 12px;width:100%;"  v-if="!item.center">{{ item.text }}</text>

				</block>
			</view>

<!--			<view  style="position: absolute;right: 10upx;top: 10upx;">
				<u-badge :value="msgCout" numberType="ellipsis" max="99"></u-badge>
			</view>-->
		</view>
	</view>
</template>

<script>
import { countMessagesUrl,userSignUrl,indexSignUrl} from '@/api/forum';
	export default {
		data() {
			return {
				index: 0,
				msgCout: 0,
				tabbar: [{
						icon: "home",
						text: "首页",
						page: "../index/index",
						center: false
					},
					// {
					// 	icon: "cuIcon-form",
					// 	text: "问答",
					// 	page: "../index/question",
					// 	// page: "../index/msg",
					// 	center: false
					// },
					// {
					// 	icon: "cuIcon-news",
					// 	text: "新资讯",
					// 	page: "../newsDemo/index",
					// 	center: false
					// },
					{
						icon: "star",
						text: "收藏",
						// page: "../index/cms",
						page: "../index/favourite",
						center: false
					},
					{
						icon: "cuIcon-add",
						text: "发布",
						page: "../question/add",
						// pages/user/favourite/index?index=0
						center: true
					},{
						icon: "email",
						text: "消息",
						// page: "../index/question",
						page: "../index/msg",
						center: false
					},
					{
						icon: "account",
						text: "我的",
						page: "../profile/profile",
						center: false
					}
				],
			}
		},
		name: 'tabbar',
		computed: {

		},
		props: {
			tabIndex: {
				type:String,
				default: 0
			}
		},
		mounted() {
			this.index = this.tabIndex;
			// 设置未读消息个数
			this.$http.get(countMessagesUrl).then(r => {
				this.msgCout=r.mcount+r.pcount+r.ccount;
			});
		},
		onShow() {
			uni.hideTabBar({
				animation: false
			});
		},
		methods: {
			setTab(item) {
				if(item.page =="../question/add")
				{
					uni.navigateTo({
						url:item.page
					})
				}
				uni.switchTab({
					url:item.page
				})
			}
		}
	}
</script>
<style lang='scss' scoped>
	 .logo_btn{
			width: 58*2rpx;
			height: 58*2rpx;
			position: absolute;
			z-index: 2;
			border-radius: 50%;
			top: -100rpx;
			left: 0rpx;
			right: 0;
			margin: auto;
			padding: 0;
	 }

	 .pos-bottom {
			position: fixed!important;
			bottom: 0!important;
			width: 100%;
	 }
	 .bg-white {
			background-color: #fff;
			color: #666;
	 }
	 .cu-bar {
			font-size: 16px;
			display: flex;
			position: relative;
			align-items: center;
			min-height: 120rpx;
			/*justify-content: space-between;*/
		 justify-content: center;

		 .tabbar {
			 padding: 0;
			 height: calc(120rpx + env(safe-area-inset-bottom) / 2);
			 padding-bottom: calc(env(safe-area-inset-bottom) / 2);
		 }
	}
	.cu-bar .tabbar .action [class*="cuIcon-"]{
		 margin: 0 auto 0px;
	}

	 .icon-container {
			display: flex;       /* 开启 Flex 布局 */
			justify-content: center; /* 水平居中 */
			align-items: center; /* 垂直居中 */
			height: 100%;        /* 可以设置高度，确保占满其父元素的高度 */
	 }

</style>
