<template>
	<!-- #ifdef MP -->

			<view v-if="scrollTop < 200" class="icon-container" :style="[{ top: topButton+'px'}]"
						style="margin-left:15px;position: fixed;width: 82px;border-radius: 80px;background-color: rgba(0, 0, 0, 0.11);">
						<u-icon class="left-icon" name="arrow-left" size="23" color="white" @click="goBack()" ></u-icon>
						<u-line
							direction="column"
							:hairline="false"
							length="23"
							margin="0 8px"
						></u-line>
						<u-icon class="right-icon" name="home" size="25" color="white" @click="goHome()"></u-icon>
			</view>


			<view v-else-if="scrollTop >= 200" class="icon-container" :style="[{ top: topButton+'px'}]"
						style="margin-left:15px;position: fixed;width: 182px;border-radius: 80px;background-color: rgba(0, 0, 0, 0.11);">
						<u-icon class="left-icon" name="arrow-left" size="23" color="white" @click="goBack()" ></u-icon>
						<u-line
							direction="column"
							:hairline="false"
							length="23"
							margin="0 8px"
						></u-line>
						<u-icon class="right-icon" name="home" size="25" color="white" @click="goHome()"></u-icon>
						<u--text  :text="title" align="center" ></u--text>
			</view>


	<!-- #endif -->


	<!-- #ifndef MP -->
		<u-sticky   v-if="scrollTop < 200"		>
				<view class="icon-container" style="top:0px;">
					<u-icon class="left-icon" name="arrow-left" size="23" color="white" @click="goBack()"  ></u-icon>
					<u-icon class="right-icon" name="home" size="25" color="white" @click="goHome()"></u-icon>
				</view>
		</u-sticky>

		<u-sticky  v-else-if="scrollTop >= 200"  >
				<view class="icon-container"     style="top:0px;background:#ffffff;
											border-bottom: 1px solid rgb(214, 215, 217);
											border-top-color: rgb(214, 215, 217);
											border-right-color: rgb(214, 215, 217);
											border-left-color: rgb(214, 215, 217);" >
						<u-icon class="left-icon" name="arrow-left" size="23" color="white" @click="goBack()" ></u-icon>
						<u--text  :text="title" align="center" ></u--text>
						<u-icon class="right-icon" name="home" size="25" color="white" @click="goHome()"></u-icon>
				</view>
		</u-sticky>


	<!-- #endif -->
</template>

<script>
	export default {
		name: 'rfTopBar',
		props: {
			title: {
				type: String,
				default: ''
			},
			scrollTop: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				topButton:0,//胶囊按钮顶部边缘相对于视口顶部的距离
				homeActive: true
			};
		},
		created(){
			 // #ifdef MP
			 this.topButton = wx.getMenuButtonBoundingClientRect().top;//胶囊按钮顶部边缘相对于视口顶部的距离
			 console.log('胶囊按钮顶部边缘相对于视口顶部的距离:', wx.getMenuButtonBoundingClientRect().top);
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
		}
	};
</script>

<style scoped lang="scss">
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
		/* position: absolute; */
		position: fixed;
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


	.u-page {
		padding: 0;
		flex: 1;
		background-color: $u-bg-color;

		&__item {

			&__title {
				color: $u-tips-color;
				background-color: $u-bg-color;
				padding: 15px;
				font-size: 15px;

				&__slot-title {
					color: $u-primary;
					font-size: 14px;
				}
			}
		}
	}

	.u-nav-slot {
		@include flex;
		align-items: center;
		justify-content: space-between;
		border-width: 0.5px;
		border-radius: 100px;
		border-color: $u-border-color;
		padding: 3px 7px;
		opacity: 0.8;
	}
</style>
