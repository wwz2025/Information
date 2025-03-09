<template>
	<view class="feedback-detail">
		<view class="feedback-title">
			<text>举报描述</text><text>举报原因：{{reportDetail.reportTypeName}}</text>
		</view>
		<view class="feedback-body">
			<textarea
				disabled
				:value="reportDetail.reportDesc"
				class="feedback-textare"
			/>
		</view>
		<view
			class="feedback-title"
			v-if="reportDetail.reportPic && reportDetail.reportPic.length > 0">
			<text>图片</text>
		</view>
		<view class="uni-uploader-body">
			<view class="uni-uploader__files">
				<block v-for="(image, index) in reportDetail.reportPic" :key="index">
					<view class="uni-uploader__file">
						<rf-image class="uni-uploader__img" :src="image"></rf-image>
					</view>
				</block>
			</view>
		</view>
<!-- 		<view class="feedback-title">
			<text>QQ/邮箱/手机号</text>
		</view>
		<view class="feedback-body">
			<input
				class="feedback-input"
				disabled
				:value="reportDetail.contact_way || '暂未留下联系方式'"
			/>
		</view> -->
		<view class="feedback-title">
			<text>回复内容</text>
		</view>
		<view class="feedback-body">
			<textarea
				disabled
				:value="reportDetail.reply || '管理员未回复'"
				class="feedback-textare"
			/>
		</view>
		<view class="feedback-title">
			<text style="color: #007AFF;" @click="goArticle(reportDetail.targetId)">原文链接>>></text>
		</view>
	</view>
</template>

<script>
/**
 * @des 意见反馈详情
 *
 * @author taidao-03-11 10:20
 * @copyright 2019
 */
import { getReportUrl } from '@/api/profile';
export default {
	data() {
		return {
			reportDetail: {},
			feedbackType: [
				{
					value: '1',
					name: '内容不实'
				},
				{
					value: '2',
					name: '题文不符'
				},
				{
					value: '3',
					name: '低俗色情'
				},
				{
					value: '4',
					name: '广告软文'
				},
				{
					value: '5',
					name: '封面反感'
				},
				{
					value: '6',
					name: '抄袭作品'
				},
				{
					value: '7',
					name: '侵犯俏像权'
				},
				{
					value: '8',
					name: '涉嫌非法集资'
				},
				{
					value: '9',
					name: '侵犯隐私权'
				},
				{
					value: '10',
					name: '侵犯隐私权/商誉'
				},
				{
					value: '11',
					name: '其他问题'
				}
			],
		};
	},
	onLoad(options) {
		this.initData(options);
	},
	methods: {
		// 数据初始化
		initData(options) {
			this.getreportDetail(options.id);
		},
		goArticle(id){
			uni.navigateTo({url:"/pages/cms/view?id="+id})
		},
		// 获取反馈详情
		async getreportDetail(id) {
			await this.$http
				.get(`${getReportUrl}`, {
					id
				})
				.then(r => {
					this.reportDetail = r;
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: $page-color-base;
}

/* 上传 */
.uni-uploader {
	flex: 1;
	flex-direction: column;
}

.uni-uploader-body {
	margin-top: 16upx;
}

.uni-uploader__files {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}

.uni-uploader__file {
	margin: 10upx;
	width: 210upx;
	height: 210upx;
}

.uni-uploader__img {
	display: block;
	width: 210upx;
	height: 210upx;
}

/*问题反馈*/
.feedback-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 20upx;
	color: #8f8f94;
	font-size: 28upx;
}

.feedback-body {
	background: $color-white;
	padding: $spacing-sm $spacing-base;
	.gender-item {
		margin-right: 20upx;

		.gender-item-text {
			padding-left: 10upx;
		}

		radio .wx-radio-input.wx-radio-input-checked {
			background: $uni-color-primary;
			border-color: $uni-color-primary;
		}
	}
}

.feedback-textare {
	height: 200upx;
	font-size: 34upx;
	line-height: 50upx;
	width: 100%;
	box-sizing: border-box;
	padding: 20upx 30upx 0;
}

.feedback-input {
	font-size: 28upx;
	height: 72upx;
	min-height: 50upx;
	padding: 15upx 20upx;
	line-height: 72upx;
}

.feedback-uploader {
	padding: 22upx 20upx;
}
</style>
