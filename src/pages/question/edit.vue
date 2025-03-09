<template>
	<view class="feedback-detail">

		<view class="feedback-body">
			<input
				class="feedback-input"
				v-model="feedbackDetail.title"
				placeholder="请输入标题"
			/>
		</view>

		<view class="feedback-body">
			<textarea
				placeholder="请输入问题描述..."
				v-model="feedbackDetail.content"
				class="feedback-textare"
			/>
		</view>

		<view class="feedback-title" style="background-color: white;line-height: 72upx;margin-top: 5px;">
				<text>请选择话题：</text>
				<picker  style="float: left;width: 60%;" @change="bindPickerChange" :value="index" :range="question" range-key="text">
					<view class="uni-input" style="font-size: 16px;">{{question[index].text}}</view>
				</picker>
		</view>

		<view
			class="feedback-title"
			v-if="feedbackDetail.covers && feedbackDetail.covers.length > 0"
		>
			<text>图片</text>
		</view>
		<view class="uni-uploader-body">
			<view class="uni-uploader__files">
				<block v-for="(image, index) in feedbackDetail.covers" :key="index">
					<view class="uni-uploader__file">
						<rf-image class="uni-uploader__img" :src="image"></rf-image>
					</view>
				</block>
			</view>
		</view>


		<view class="feedback-title">
			<text>{{'创建时间:'+feedbackDetail.keywords}}</text>
		</view>
		<button
			class="confirm-btn"
			:class="'bg-' + themeColor.name"
			:disabled="btnLoading"
			:loading="btnLoading"
			@tap="send"
		>
			保存
		</button>
	</view>
</template>

<script>
/**
 * @des 意见反馈详情
 *
 * @author taidao-03-11 10:20
 * @copyright 2019
 */

	import {
		view,
		editQuestion,
		forumTagsUrl
		} from '@/api/forum';

export default {
	data() {
		return {
			formData: {
				value: 1,
				hobby: []
			},
			index: 0,
			feedbackDetail: {categoryId:1},
			question:[],
			btnLoading: false,
			feedbackType: [
				{
					value: 1,
					text: '在线问答'
				},
				{
					value: 2,
					text: '文库资料'
				},
				{
					value: 3,
					text: '视频学习'
				},
				{
					value: 4,
					text: '名师课堂'
				}
			],
			reqBody: {}
		};
	},
	onLoad(options) {
		this.getFeedbackDetail(options.id);

	},
	methods: {
		// 数据初始化
		initData(options) {
			//标签
			this.question=[];
			this.$http
				.get(`${forumTagsUrl}`, {tagType:this.feedbackDetail.categoryId})
				.then(r => {
					for(var i=0;i<r.total;i++)
					{
						//复选框联动
						if(i==0 && options=='change')
						{
							this.formData.hobby=[r.list[i].tagId];
							this.feedbackDetail.tags=r.list[i].tagId+',';
						}
						//下拉选项卡
						if(this.feedbackDetail.tags==r.list[i].tagId+',')
						{
							this.index=i;
						}
						this.question.push({value:r.list[i].tagId,text:r.list[i].tagName});
					}
						// this.question=r.list;
				})
				.catch(() => {
				})
		},
		// 监听反馈类型事件
		handleCatChange(e) {
			this.feedbackDetail.categoryId = e.detail.value;
			this.initData('change');
		},
		// 监听反馈类型事件
		handleTagChange(e) {
			this.feedbackDetail.tags =e.detail.value+',';
			var items = this.question,values = e.detail.value;

			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				const item = items[i]
				if(values.indexOf(item.value) >= 0){
					this.$set(item,'checked',true)
				}else{
					this.$set(item,'checked',false)
				}
			}
		},
		// 监听反馈类型事件
		bindPickerChange(e) {

			this.formData.hobby=[this.question[e.detail.value].value];
			this.feedbackDetail.tags =this.question[e.detail.value].value+',';
			this.index=e.detail.value;
		},
		// 获取反馈详情
		async getFeedbackDetail(id) {
			await this.$http
				.post(`${view}/`+id)
				.then(r => {
					  this.feedbackDetail = r;
						this.feedbackDetail.categoryId= parseInt(this.feedbackDetail.categoryId);

						this.feedbackDetail.tags.substring(0,this.feedbackDetail.tags.length-1).split(",").forEach(item => {
						        this.formData.hobby.push(+item);
						 });

						this.initData();
				});
		},
		// 发送反馈
		async send() {
			this.reqBody['hobby'] = this.formData.hobby;
			this.reqBody['categoryId'] = this.feedbackDetail.categoryId;
			this.reqBody['tags'] = this.feedbackDetail.tags;
			this.reqBody['title'] =this.feedbackDetail.title;
			this.reqBody['content'] = this.feedbackDetail.content;
			// this.reqBody['userName'] = this.sendDate.;
			const cheRes = this.$mGraceChecker.check(
				this.reqBody,
				this.$mFormRule.questionRule
			);
			if (!cheRes) {
				this.$mHelper.toast(this.$mGraceChecker.error);
				return;
			}

			this.btnLoading = true;
			// this.sendDate.tags=this.formData.hobby.toString();
			// this.sendDate.pics = JSON.stringify(this.imageList);

			this.feedbackDetail.keywords='';
			 await this.$http
				.post(`${editQuestion}`, {
					...this.feedbackDetail
				})
				.then(() => {
					this.btnLoading = false;
					// this.$mRouter.back();

					this.$mHelper.toast('恭喜您, 保存成功!');
					setTimeout(() => {
						this.$mRouter.back();
					}, 1 * 1000);
				})
				.catch(() => {
					this.btnLoading = false;
				});
		}

	}
};
</script>

<style lang="scss">
page {
	background-color: $page-color-base;
}

/deep/ .checklist-box{
    margin-right: 1px;
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
	padding: $spacing-sm;
	margin-top: $spacing-base;
	font-size: $font-lg;
}

.feedback-body {
	background: $color-white;
	padding: $spacing-sm 6rpx;
	margin-top: 5px;
	.gender-item {
		margin-right: 2upx;

		.gender-item-text {
			padding-left: 5upx;
		}

		radio .wx-radio-input.wx-radio-input-checked {
			background: $uni-color-primary;
			border-color: $uni-color-primary;
		}
	}
}

.feedback-textare {
	height: 300upx;
	font-size: $font-lg;
	line-height: 50upx;
	width: 100%;
	box-sizing: border-box;
	padding: 15upx 20upx 0;
}

.feedback-input {
	font-size: $font-lg;
	height: 72upx;
	min-height: 50upx;
	padding: 15upx 20upx;
	line-height: 72upx;
}

.feedback-uploader {
	padding: 22upx 20upx;
}
</style>
