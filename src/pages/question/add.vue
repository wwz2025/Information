<template>
	<view class="page">
		<!--顶部菜单-->
		<rf-top-bar ></rf-top-bar>


		<view class="top-pic" >
			<view class="top" :class="'bg-' + themeColor.name">
				<image class="bg" :src="userBg" style="width: 100%;height: 100%;"></image>
<!--				<image class="bg" src="/static/calculator.png" style="width: 130px;height: 81px;position: absolute;
				top:160px;right: 0px;"></image>-->
				<view class="desc" style="top: 70px;padding: 10px;">
					<view class="title" style="font-size: 48rpx;text-align: center;">在线发布信息帖子</view>
<!--					<view class="title" style="font-size: 48rpx;text-align: left;">1键发布论坛信息</view>-->
				</view>
			</view>
		</view>
		<u-modal
			:content="content"
			:show="showLogin"
			@confirm="confirmLogin"
		></u-modal>
		<!-- 信息提示弹框-->
		<uni-popup ref="share" background-color="#fff" type="center" >
			<view class="uni-popup-share" style="border-radius: 5px;">
				<view class="uni-dialog-title"><text class="uni-share-title-text uni-popup__success"  style="font-size: 22px;">提示</text></view>
				<view class="uni-dialog-title"><text class="uni-share-title-text" style="font-size: 20px;font-family: YouYuan;">恭喜您，已经保存到草稿箱</text></view>
				<view class="uni-dialog-content">
					<text class="uni-share-text" style="text-align: center;font-size: 17px;font-family: LISU;">您的帖子已收到，请稍安勿躁~<br>工程师/客服正在马不停蹄赶来!</text>
				</view>
				<view class="u-page__button-item" style="display: flex;flex-direction: row;justify-content: center;">
					<view style="width:200upx">
						<u-button
							text="关闭"
							size="normal"
							plain
							shape="circle"
							type="success"
							@click="goBack()"
						></u-button>
					</view>
				</view>
			</view>
		</uni-popup>

		<view class="u-page">
			<view class="u-demo-block">
					<u--form
						labelPosition="left"
						:model="sendDate"
						ref="form1"
					>
						<u-form-item
							label="栏目大类"
							labelWidth="80"
							prop="categoryBigId"
							borderBottom
							ref="item1"
						>
							<view style="color: rgb(153, 153, 153); text-align: left; padding-bottom: 5px;" @click="showPicker" v-if="!sendDate.categoryBigId">
								请选择栏目大类
							</view>
							<view style="text-align: left; padding-bottom: 5px;" @click="showPicker" v-if="sendDate.categoryBigId">
								{{sendDate.categoryBigName}}
							</view>
						</u-form-item>

						<u-picker :show="show1" :columns="categoryBigArr" keyName="name"
											closeOnClickOverlay
											@cancel="pickCancel"
											@confirm="pickConfirm"
											@close="pickClose"
											@change="pickChange"
						></u-picker>

						<u-form-item
							label="栏目小类"
							labelWidth="80"
							prop="categoryId"
							borderBottom
							ref="item1"
							v-if="sendDate.categoryId"
						>
							<view class="u-demo-block" >
								<view class="u-demo-block__content">
									<view
										v-for="(item, index) in categoryArr"
										:key="index"
									>
										<u-tag
											:text="item.name"
											:plain="!item.checked"
											type="warning"
											:name="item.id"
											@click="radioClick"
											shape="circle"
										>
										</u-tag>
									</view>
								</view>
							</view>
						</u-form-item>

						<view class="u-demo-block" v-if="sendDate.categoryId">
							<text class="u-demo-block__title">帖子标签</text>
							<view class="u-demo-block__content">
								<view
									class="u-page__tag-item"
									v-for="(item, index) in question"
									:key="index"
								>
									<u-tag
										:text="item.text"
										:plain="!item.checked"
										type="warning"
										:name="item.value"
										@click="checkboxClick"
										shape="circle"
									>
									</u-tag>
								</view>
							</view>
						</view>

						<u-form-item
							label="详细地址"
							labelWidth="80"
							prop="detailedAddress"
							borderBottom
							ref="item1"
						>
							<u--input
								v-model="sendDate.detailedAddress"
								border="none"
								placeholder="请输入详细地址"
							></u--input>

							<u-icon
								slot="right"
								name="map"
								size="28"
								:color="themeColor.color"
								@click="pointer"
							></u-icon>
						</u-form-item>

						<u-form-item
							label="出发地"
							labelWidth="80"
							prop="departureLocation"
							borderBottom
							ref="item1"
							v-if="sendDate.categoryId===25 ||sendDate.categoryId===26 ||sendDate.categoryId===27 ||sendDate.categoryId===28"
						>
							<u--input
								v-model="sendDate.departureLocation"
								border="none"
								placeholder="请输入出发地"
							></u--input>
						</u-form-item>

						<u-form-item
							label="目的地"
							labelWidth="80"
							prop="destination"
							borderBottom
							ref="item1"
							v-if="sendDate.categoryId===25 ||sendDate.categoryId===26 ||sendDate.categoryId===27 ||sendDate.categoryId===28"
						>
							<u--input
								v-model="sendDate.destination"
								border="none"
								placeholder="请输入目的地"
							></u--input>
						</u-form-item>

						<u-form-item
							label="发车时间"
							labelWidth="80"
							prop="departureTime"
							borderBottom
							ref="item1"
							@click="sendDate.showDepartureTime = true; hideKeyboard()"
							v-if="sendDate.categoryId===28"
						>
							<u--input
								v-model="sendDate.departureTime"
								disabled
								disabledColor="#ffffff"
								placeholder="请选择发车时间"
								border="none"
							></u--input>
							<u-icon
								slot="right"
								name="arrow-right"
							></u-icon>
						</u-form-item>

						<u-datetime-picker
							:show="sendDate.showDepartureTime"
							:value="sendDate.departureTime"
							mode="datetime"
							closeOnClickOverlay
							@confirm="departureTimeConfirm"
							@cancel="departureTimeClose"
							@close="departureTimeClose"
						></u-datetime-picker>

						<u-form-item
							label="车辆信息"
							labelWidth="80"
							prop="vehicleInformation"
							borderBottom
							ref="item1"
							v-if="sendDate.categoryId===28"
						>
							<u--input
								v-model="sendDate.vehicleInformation"
								border="none"
								placeholder="请输入车辆信息"
							></u--input>
						</u-form-item>

						<u-form-item
							label="托运时间"
							labelWidth="80"
							prop="departureTime"
							borderBottom
							ref="item1"
							@click="sendDate.showDepartureTime = true; hideKeyboard()"
							v-if="sendDate.categoryId===27"
						>
							<u--input
								v-model="sendDate.departureTime"
								disabled
								disabledColor="#ffffff"
								placeholder="请选择托运时间"
								border="none"
							></u--input>
							<u-icon
								slot="right"
								name="arrow-right"
							></u-icon>
						</u-form-item>

						<u-form-item
							label="乘车时间"
							labelWidth="80"
							prop="departureTime"
							borderBottom
							ref="item1"
							@click="sendDate.showDepartureTime = true; hideKeyboard()"
							v-if="sendDate.categoryId===25 || sendDate.categoryId===26"
						>
							<u--input
								v-model="sendDate.departureTime"
								disabled
								disabledColor="#ffffff"
								placeholder="请选择乘车时间"
								border="none"
							></u--input>
							<u-icon
								slot="right"
								name="arrow-right"
							></u-icon>
						</u-form-item>

						<u-form-item
							label="乘车人数"
							labelWidth="80"
							prop="passengerCount"
							borderBottom
							ref="item1"
							v-if="sendDate.categoryId===25 || sendDate.categoryId===26"
						>
							<u--input
								v-model="sendDate.passengerCount"
								border="none"
								placeholder="请输入乘车人数"
							></u--input>
						</u-form-item>

						<u-form-item
							label="联系人"
							labelWidth="80"
							prop="contactPerson"
							borderBottom
							ref="item1"
						>
							<u--input
								v-model="sendDate.contactPerson"
								border="none"
								placeholder="请输入联系人"
							></u--input>
						</u-form-item>
						<u-form-item
							label="联系电话"
							labelWidth="80"
							prop="phoneNumber"
							borderBottom
							ref="item1"
						>
							<u--input
								v-model="sendDate.phoneNumber"
								border="none"
								placeholder="请输入联系电话"
								type="number"
								@input="syncPhone"
							></u--input>
						</u-form-item>
<!--						<u-form-item
							label="微信号"
							labelWidth="80"
							prop="wechatId"
							borderBottom
							ref="item1"
						>
							<view class="u-demo-block" >
								<view class="u-demo-block__content">
									<u&#45;&#45;input
										v-model="sendDate.wechatId"
										border="none"
										placeholder="请输入微信号"
									></u&#45;&#45;input>
									<u-tag text="默认与电话相同" plain shape="circle"></u-tag>
								</view>
							</view>
						</u-form-item>-->
						<u-form-item
							label="详情"
							labelWidth="80"
							prop="content"
							borderBottom
							ref="item1"
						>
							<u--textarea v-model="sendDate.content" count placeholder="请输入详情，不低于3个字" maxlength="800"></u--textarea>
						</u-form-item>

<!--						<editor	v-model="sendDate.content" id="editor" class="ql-container"  style="margin-top:5px;" :placeholder="sendDate.contentPlaceHolder" showImgSize showImgToolbar showImgResize
										 @statuschange="onStatusChange" :read-only="readOnly" @ready="onEditorReady">
						</editor>-->
<!--						<u-form-item
							label="添加图片(最多3张)"
							labelWidth="280"
							prop="userInfo.name"
							ref="item1"
						>
							<view class="uni-uploader">
								<view class="uni-uploader-head" >
									<view class="uni-uploader-title" ></view>
									<view class="uni-uploader-info" >{{ imageList.length }}/3</view>
								</view>
							</view>
						</u-form-item>-->

						<view class="feedback-body feedback-uploader rf-uploader" >
							<!-- <text class="u-demo-block__title">文件预览</text> -->
							<view class="u-demo-block__content" style="display: flex;flex-direction: row;flex-wrap: wrap;">
								<view class="u-page__upload-item" style="display: flex;flex-direction: row;flex-wrap: wrap;">
									<u-upload style="padding:2upx 2upx;"
														:fileList="fileList3"
														@afterRead="afterRead"
														@delete="deletePic"
														name="3"
														multiple
														:sizeType="sizeType"
														:maxCount="3"
														:maxSize=5242880
														:previewFullImage="true"
									>

										<view style="bottom: 0px; margin: 20upx 10upx;background-color: #eeeeee;width: 150upx; height: 120upx;border-radius: 10upx;"
													v-if="imageList.length<3">
											<view style="text-align: center;height: 70upx;">
												<image src="/static/upload-image.png" style="margin-top:5upx;width: 80upx; height: 80upx;" mode="scaleToFill"></image></view>
											<view style="color: #999999;text-align: center;padding-bottom: 10upx;">照片/拍摄</view>
										</view>
									</u-upload>
								</view>
								(最多3张)
							</view>
						</view>

						<view class="block">
							<view class="title" style="font-size: 15px;color: red;font-weight: bold;">
								信息置顶
							</view>
							<view class="content">
								<view class="amount">
									<view class="list">
										<view
											class="box"
											v-for="(amount, index) in amountList"
											:key="index"
											@tap="select(amount)"
											:class="amount.price == inputAmount ? 'bg-' + themeColor.name : 'on'"
										>
											<view class="real">置顶{{ amount.give_price }}天</view>
											<text class="real">{{ amount.price }}元</text>
										</view>
									</view>
								</view>
							</view>
						</view>

						<u-form-item
							label="发布条款"
							label-width="80"
							prop="radiovalue1"
							borderBottom
							ref="item1"
						>
							<view class="container">
								<view class="flex-row">
									<u-checkbox-group
										v-model="sendDate.radiovalue1"
										shape="square"
										@change="checkboxChange"
									>
										<u-checkbox
											labelSize="16"
											v-for="(item, index) in sendDate.radiolist1"
											:key="index"
											:label="item.name"
											:name="item.name"
										>
										</u-checkbox>
									</u-checkbox-group>
									<view class="terms" @tap="toTipDetail" >
										我同意，按条款保证信息合法合规
									</view>
								</view>
							</view>
						</u-form-item>

						<view class="pay">
							<button class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="btnLoading" :loading="btnLoading" @click="addQuestion">
								发布
							</button>
<!--							<button class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="btnLoading" :loading="btnLoading" @click="pay">
								发布
							</button>-->
						</view>
					</u--form>

			</view>
		</view>

	</view>
</template>

<script>
import rfTopBar from '@/components/rf-top-bar';
import { uploadImage } from '@/api/userInfo';
import uniPopup from '@/components/uni-popup/uni-popup.vue';

import { cmsCategoryUrl,addQuestionUrl,forumTagsUrl} from '@/api/forum';

import QQMapWX from '@/utils/qqmap-wx-jssdk.js';

export default {
	components: {
		rfTopBar,
		uniPopup
	 },
	data() {
		return {
			userBg: this.$mAssetsPath.userBg,
			inputAmount: 0, // 支付金额
			inputAmountGive: 0, // 置顶时间
			payType: 1, // 支付类型
			userInfo: {},
			loading: false,
			providerList: [],
			payTypeList: {order_ali_pay: 1,order_wechat_pay: 1},
			isWechat: this.$mPayment.isWechat(),
			amountList: [{price:0,give_price:0},{price:50,give_price:3},{price:98,give_price:7}
				,{price:198,give_price:15},{price:298,give_price:30},{price:788,give_price:90}], // 预设3个可选快捷金额

			content: '您好，请先登录，再使用！',
			showLogin: false,
			sizeType: ['compressed'],
			fileList3: [],
			upPic:false,
			formData: {
				hobby: []
			},
			index: null,
			msgContents: [
			],
			stars: [1, 2, 3, 4, 5],
			imageList: [],

			sendDate: {
				radioValueCheck: false,
				radiovalue1: [],
				radiolist1: [{
					name: '',
					disabled: false
				},],
				questionId: '',//问题编号
				showDepartureTime:false,//默认隐藏发车时间
				detailedAddress:'',//定位位置
				contactPerson:uni.getStorageSync('userInfo').userName,//联系人
				phoneNumber:uni.getStorageSync('userInfo').phonenumber,//电话
				wechatId:'',//微信号
				categoryId: '',
				categoryName: '',
				categoryBigId: '',
				categoryBigName: '',
				// pics: '',
				content: '',//内容
				contentPlaceHolder: '请在此输入您要发的信息内容。',
				id: '',
				title: '',//标题
				tags: '',//标签
				tagName: '',//标签名称
				author:uni.getStorageSync('userInfo').userName,
				coverImage:'',//封面
				available:'',//状态标志 0为草稿 1为已审核 2为待审核 3为拒绝
				departureLocation:'',//出发地
				destination:'',//目的地
				passengerCount:'',//乘车人数
				departureTime:'',//发车时间
				vehicleInformation:'',//车辆信息
				payCount:'',//支付金额
			},
			question:[],
			btnLoading: false,
			reqBody: {},

			editorCtx:null,
			//editor控件
			fileUrl:this.$mConfig.fileUrl,
			readOnly: false,
			formats: {},
			hasLogin: false,
			show1: false,
			categoryBigArr:[],
			categoryArr:[],
			rules: {
				contactPerson: {
					type: 'string',
					min: 1,
					max: 50,
					required: true,
					message: '请填写联系人',
					trigger: ['blur']
				},
				phoneNumber: [{
					type: 'string',
					min: 3,
					max: 50,
					required: true,
					message: '请填写联系电话',
					trigger: ['blur']
				},
					{
						pattern: /^1[3-9]\d{9}$/,
						message: '请输入正确的手机号码',
						trigger: ['blur']
					}],
				wechatId: {
					type: 'string',
					min: 3,
					max: 50,
					required: true,
					message: '请填写微信号',
					trigger: ['blur']
				},
				content: {
					type: 'string',
					min: 3,
					required: true,
					message: '不低于3个字',
					trigger: ['change']
				},
				},

		};
	},
	async onLoad() {
			this.hasLogin = this.$mStore.getters.hasLogin;
		  if (this.hasLogin) {
		      this.initData();
		  } else {
				this.showLogin=true;
					//uni.setStorageSync('backToPage', '/pages/question/add');
					//this.$mRouter.push({ route: '/pages/public/loginMethod' });
					// this.navTo('/pages/public/loginMethod');
		  }
			this.loadBigCategory();
			const location = await this.getLocationInfo();
			this.sendDate.detailedAddress = location.address;
	},
	onReady() {
		// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
		this.$refs.form1.setRules(this.rules)
	},
	methods: {
		checkboxChange(n) {
			console.log('change', n);
			this.sendDate.radioValueCheck=n.length > 0;
		},
		toTipDetail() {
			this.$mRouter.push({
				route: '/pages/question/protocol'
			});
		},
		// 输入框内容变化时触发的事件
		syncPhone(value) {
			// 将手机号码同步到其他控件，这里是更新data中的form对象
			this.sendDate.wechatId= value;
		},
		//获取分类
		loadBigCategory(){
			let category=[];
			let that=this;
			this.$http.get(`${cmsCategoryUrl}`, {parentId:'5'})
				.then(async r => {
					let linList=r;
					for (var j = 0; j < linList.length; j++) {
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
						category.push(entity);
					}
					that.categoryBigArr.push(category);
				})
				.catch(err => {
				});
		},
		//获取分类
		loadCategory(){
			let category=[];
			let that=this;
			this.categoryArr=[];
			this.$http.get(`${cmsCategoryUrl}`, {parentId:this.sendDate.categoryBigId})
				.then(async r => {
					let linList=r;
					for (var j = 0; j < linList.length; j++) {
						let entity={id: "",name: '',region:'',tagId:'',newsList:[],refreshing:0,
							loadMoreStatus:0,  //加载更多 0加载前，1加载中，2没有更多了，3没有数据
							color:'',
							icon:'',
							desc:'',
							checked:(j==0)
						};

						entity.id=linList[j].categoryId;
						entity.name=linList[j].categoryName;
						entity.newsid=j+5;
						entity.region='';
						entity.tagId=linList[j].categoryId;
						entity.icon=linList[j].description;
						entity.desc=linList[j].description;
						category.push(entity);
						that.categoryArr.push(entity);
					}
					that.sendDate.categoryId=that.categoryArr[0].id;
					this.sendDate.contentPlaceHolder=that.categoryArr[0].desc;
					that.initData();
					// that.categoryArr.push(category);
				})
				.catch(err => {
				});
		},
		radioClick(name) {
			const obj=this.categoryArr;
			obj.forEach((value, index) => {
				if(value.id===name)
				{
					value.checked = !value.checked;
					this.sendDate.categoryId=name;
					this.sendDate.contentPlaceHolder=value.desc;
					this.initData();
				}
				else
				{
					value.checked = false;
				}
			});
		},
		//标签多选
		checkboxClick(name) {
			this.question.forEach((value, index) => {
				if(value.value===name)
				{
					console.log(`Value at index ${index} is ${value}`);
					value.checked = !value.checked
				}
			});
		},
		pickChange(e) {
			console.log('change', e);
		},
		showPicker(index) {
			this.show1 = true;
		},
		pickClose() {
			this.show1 = false;
		},
		pickConfirm(e) {
			this.sendDate.categoryBigId=e.value[0].id;
			this.sendDate.categoryBigName=e.value[0].name;
			// this.initData();
			this.loadCategory();
			this.show1 = false;
		},
		pickCancel() {
			this.show1 = false;
		},
		//打开地图获取详细地址
		pointer() {
			const that=this;
			uni.chooseLocation({
				success: async function(res) {
					that.sendDate.detailedAddress = res.address;
					console.log(res.address, "返回地址");
				},
				fail: function(e) {
					console.log(e, "报错");
				}
			})
		},
		//获取位置信息
		async getLocationInfo() {
			return new Promise((resolve) => {
				//位置信息默认数据
				let location = {
					longitude: 0,
					latitude: 0,
					province: "",
					city: "",
					area: "",
					street: "",
					address: "",
				};
				uni.getLocation({
					type: "gcj02",
					success(res) {
						location.longitude = res.longitude;
						location.latitude = res.latitude;
						// 腾讯地图Api
						const qqmapsdk = new QQMapWX({
							key: 'W6HBZ-QRSWZ-MFRXC-Z2QCJ-HJG4E-HYFVM'  //这里填写自己申请的key
						});
						qqmapsdk.reverseGeocoder({
							location,
							success(response) {
								let info = response.result;
								console.log(info);
								location.province = info.address_component.province;
								location.city = info.address_component.city;
								location.area = info.address_component.district;
								location.street = info.address_component.street;
								location.address = info.address;
								resolve(location);
							},
						});
					},
					fail(err) {
						console.log(err)
						resolve(location);
					},
				});
			});
		},
		// 登录
		confirmLogin(){
			this.showLogin=false;
			uni.setStorageSync('backToPage', '/pages/question/add');
			this.$mRouter.push({ route: '/pages/public/loginMethod' });
		},
		onInput(e){
		  e.detail.html=='<p><br></p>'?this.btnDisabled=true:this.btnDisabled=false;
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		// 数据初始化
		initData() {
			//标签
			const questionAdd=[];
			this.question=[];
			if(this.sendDate.categoryId)
			{
				this.$http.get(`${forumTagsUrl}`, {categoryId:this.sendDate.categoryId})
					.then(r => {
							if(r.length<=0)
							{
								return;
							}
							for(var i=0;i<r.length;i++)
							{
								this.question.push({value:r[i].tagId,text:r[i].tagName,checked:(i==0)});
							}
				})
				.catch(() => {
				})
			}
		},
		// 打开相册选图
		uploadImage() {
			const _this = this;
			uni.chooseImage({
				count: 3, // 最多一次可以选择的图片张数
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机
				success: function(res) {
					if (_this.imageList.length + res.tempFiles.length > 3) {
						_this.$mHelper.toast('不要贪心哦，最多只可上传3张照片');
						return;
					}
					_this.handleUploadFile(res.tempFilePaths);
				}
			});
		},
		// 依次上传图片
		handleUploadFile(data) {
			const _this = this;
			_this.upPic=true;//显示上传图片进度

			data.forEach(item => {
				//使用setTimeout保证上传图片顺序
				setTimeout(function(){
						_this.$http
							.upload(uploadImage, { filePath: item, name: 'file' })
							.then(r => {
								_this.imageList.push(r);
							});
					},1000);
			});
		},
		// 删除已选中图片
		close(e) {
			this.imageList.splice(e, 1);
		},
		// 返回上一页
		goBack(){
			let pages = getCurrentPages(); // 当前页面
			let beforePage = pages[pages.length - 2]; // 上一页
			uni.navigateBack({
			    success: function() {
			        beforePage.refreshPage(); // 执行上一页的onLoad方法
				}
			});
		},
		// pay() {
		// 	uni.redirectTo({
		// 		// url: `/pages/user/money/pay?money=${res.orderMoney.toFixed(2)}&orderCode=${res.orderCode}`
		// 		url: `/pages/user/money/pay?money=0.1&orderCode=20240910`
		// 	});
		// },
		// 新增问题
		addQuestion() {
			this.sendDate.payCount=this.inputAmount;//已支付金额
			if(!this.sendDate.radioValueCheck)
			{
				uni.$u.toast('请先同意信息发布的条款！');
				return;
			}
			if(!this.sendDate.categoryId)
			{
				uni.$u.toast('请选择栏目大类！');
				return;
			}
			for(var j=0;j<this.question.length;j++)
			{
				if(this.question[j].checked)
				{
					this.sendDate.tags+=this.question[j].value+',';
				}
			}

			this.btnLoading = true;
			let that=this;
			// 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
			this.$refs.form1.validate().then(res => {
				// uni.$u.toast('校验通过');
				var coverImageUrl=[];
				for(var i=0;i<this.imageList.length;i++)
				{
					coverImageUrl.push(this.imageList[i].path);
				}

				this.sendDate.coverImage=coverImageUrl.join(";");

				this.sendDate.available=this.inputAmount<=0?'1':'0';//如果没有选择支付，就默认发布
				that.$http
					.post(`${addQuestionUrl}`, {
						...that.sendDate
					})
					.then(r => {
						// that.btnLoading = false;//禁止返回的适合重复插入
						that.sendDate.questionId=r.id;
						// that.$mRouter.back();
						// that.$mHelper.toast('您好，小主您的帖子已收到，请稍安勿躁，工程师小哥哥/客服小姐姐正在马不停蹄赶来~');
						// that.index=null;
						// that.sendDate.tags='';
						// that.sendDate.title='';
						// that.sendDate.content='';
						// that.clear();
						if(that.inputAmount>0)
						{
							// that.inputAmount=0.1;	//测试
							that.$refs.share.open();
							setTimeout(() => {
								uni.redirectTo({
									// url: `/pages/user/money/pay?money=${res.orderMoney.toFixed(2)}&orderCode=${res.orderCode}`
									url: `/pages/user/money/pay?money=`+that.inputAmount+`&orderCode=`+that.sendDate.questionId
								});
							}, 1 * 1500);
						}
						else
						{
							that.$mHelper.toast('您的帖子已经发布成功~');
							setTimeout(() => {
								//that.$mRouter.back();
								that.goBack();
							}, 1 * 1500);
						}
					})
					.catch(() => {
						that.btnLoading = false;
					});
			}).catch(errors => {
				that.btnLoading = false;
				uni.$u.toast('帖子校验失败！');
				// return;
			})

			/*// this.reqBody['hobby'] = this.formData.hobby;
			// this.reqBody['categoryId'] = this.sendDate.categoryId;
			// this.reqBody['tags'] = this.sendDate.tags;
			// this.reqBody['title'] =this.sendDate.title;
			// this.reqBody['content'] = this.sendDate.content;
			var coverImageUrl=[];
			for(var i=0;i<this.imageList.length;i++)
			{
				coverImageUrl.push(this.imageList[i].path);
			}

			this.sendDate.coverImage=coverImageUrl.join(";");

			// const cheRes = this.$mGraceChecker.check(
			// 	this.reqBody,
			// 	this.$mFormRule.questionRule
			// );
			// if (!cheRes) {
			// 	this.$mHelper.toast(this.$mGraceChecker.error);
			// 	return;
			// }
			let that=this;

			this.editorCtx.getContents({
			    success: function(data) {
						that.sendDate.content = data.html;
						// if(data.text.trim().length<=0)
						if(data.html.trim()=='<p><br></p>')
						{
							that.btnLoading = false;
							that.$mHelper.toast("问题描述不能为空");
							return;
						}
						 that.$http
							.post(`${addQuestionUrl}`, {
								...that.sendDate
							})
							.then(r => {
								that.sendDate.questionId=r.id;
								that.btnLoading = false;
								// that.$mRouter.back();
								// that.$mHelper.toast('您好，小主您的帖子已收到，请稍安勿躁，工程师小哥哥/客服小姐姐正在马不停蹄赶来~');
								that.index=null;
								that.sendDate.tags='';
								that.sendDate.title='';
								that.sendDate.content='';
								that.clear();
								that.$refs.share.open();
								// setTimeout(() => {
								//  	//that.$mRouter.back();
								// 	that.goBack();
								//  }, 1 * 1500);

								setTimeout(() => {
										uni.redirectTo({
											// url: `/pages/user/money/pay?money=${res.orderMoney.toFixed(2)}&orderCode=${res.orderCode}`
											url: `/pages/user/money/pay?money=0.1&orderCode=`+that.sendDate.questionId
										});
								 }, 1 * 1500);

							})
							.catch(() => {
								that.btnLoading = false;
							});
			  }
			})*/
		},
		/*//editor控件
		readOnlyChange() {
			this.readOnly = !this.readOnly;
		},
		onEditorReady() {
			uni.createSelectorQuery().select('#editor').context((res) => {
				this.editorCtx = res.context;
			}).exec();
		},
		undo() {
			this.editorCtx.undo();
		},
		redo() {
			this.editorCtx.redo();
		},
		format(e) {
			let {
				name,
				value
			} = e.target.dataset;
			if (!name) return;
			// console.log('format', name, value)
			this.editorCtx.format(name, value);
		},
		onStatusChange(e) {
			const formats = e.detail;
			this.formats = formats;
		},
		insertDivider() {
			this.editorCtx.insertDivider({
				success: function() {
					console.log('insert divider success')
				}
			})
		},
		clear() {
			this.editorCtx.clear({
				success: function(res) {
					console.log("clear success");
				}
			})
		},
		removeFormat() {
			this.editorCtx.removeFormat();
		},
		insertDate() {
			const date = new Date();
			const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
			this.editorCtx.insertText({
				text: formatDate
			})
		},
		insertImage() {
			const _this = this;
			uni.chooseImage({
				count: 20,
				sizeType:['compressed'],//图片压缩
				success: (res) => {
					// 在微信小程序中不支持多张图片上传，需要做循环实现多张图片上传
					const tempFilePaths = res.tempFilePaths;
					for(let i = 0;i < tempFilePaths.length; i++) {
						_this.$http
								.upload(uploadImage, { filePath: tempFilePaths[i], name: 'file' })
								.then(r => {
									this.editorCtx.insertImage({
										src: this.fileUrl+r.path,
										alt: '图像',
										success: function() {
											console.log('insert image success')
										}
									})
						});
					}

				}
			})
		} ,*/

		// uView删除图片
		deletePic(event) {
			this[`fileList${event.name}`].splice(event.index, 1)
			this.imageList.splice(event.index, 1);
		},
		// 新增图片
		async afterRead(event) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			let lists = [].concat(event.file)
			let fileListLen = this[`fileList${event.name}`].length
			lists.map((item) => {
				this[`fileList${event.name}`].push({
					...item,
					status: 'uploading',
					message: '上传中'
				})
			})
			for (let i = 0; i < lists.length; i++) {
						const result = await this.uploadFilePromise(lists[i].thumb)
						let item = this[`fileList${event.name}`][fileListLen];
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							// url: result
							url: this.fileUrl+result
						}))
						fileListLen++
			}
		},
		uploadFilePromise(url) {
				let _this=this;
				return new Promise((resolve, reject) => {
					_this.$http
						.upload(uploadImage, { filePath: url, name: 'file' })
						.then(r => {
									setTimeout(() => {
										resolve(r)
									}, 1000)
							_this.imageList.push(r);
						});
				})
			}
		,
		hideKeyboard() {
			uni.hideKeyboard()
		},
		departureTimeClose() {
			this.sendDate.showDepartureTime = false;
			this.$refs.form1.validateField('sendDate.departureTime');
		},
		departureTimeConfirm(e) {
			this.sendDate.showDepartureTime = false;
			this.sendDate.departureTime = uni.$u.timeFormat(e.value, 'yyyy-mm-dd hh:MM');
			this.$refs.form1.validateField('sendDate.departureTime');
		},
		select(item) {
			this.inputAmount = item.price;
			this.inputAmountGive = item.give_price;
		}
	}
};
</script>

<style lang="scss">
page {
	/*background-color: $page-color-base;*/
	background-color: var(--UI-BG-0);
}

.top-pic {
	width: 100%;
	position: relative;
	.top {
		height: 260upx;
		position: relative;
		.desc {
			width: 100%;
			position: absolute;
			top: 10upx;
			// left: 40upx;
			font-size: 48upx;
			.title {
				width: 100%;
				font-size: 48upx;
			}
		}
	}
}

/deep/ .ql-editor.ql-blank:before {
    color: #999999;
    font-style: normal;
	  padding-top: 1px;
}

/deep/ .uni-picker-container .uni-picker-item {
 font-size: 34px;
}

/*问题反馈*/
.feedback-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: $spacing-sm;
	margin-top: $spacing-sm;
	font-size: $font-lg;
}

.feedback-star-view.feedback-title {
	justify-content: flex-start;
	margin: 0;
}
.uni-input {
		font-size: $font-lg;
		padding: 15upx 16upx;
	}
.feedback-quick {
	position: relative;
	padding-right: 40upx;
	.iconfont {
		font-size: $font-lg;
	}
}
/deep/ .checklist-box{
    margin-right: 1px;
}

.feedback-body {
	background: $color-white;
	/* padding: $spacing-sm 6rpx; */
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
	/* padding: 22upx 20upx; */
}

	@import "./editor-icon.css";
	.editor-wrapper {
		/* height: calc(100vh - var(--window-top) - var(--status-bar-height) - 140px); */
		height: 240px;
		background: #fff;
	}

	.iconfont {
		display: inline-block;
		padding: 8px 8px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		/* font-size: 20px; */
	}

	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		/* font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; */
		font-size: $font-lg;
		padding: 0upx 16upx;
	}

	.ql-container {
		box-sizing: border-box;
		padding: 2px 5px;
		width: 100%;
		min-height: 5vh;
		height: 100%;
		margin-top: 10px;
		/* font-size: 16px; */
		font-size: $font-lg;
		line-height: 1;
		background: #eee;
	}

	.ql-active {
		color: #06c;
	}

	/*弹出框提示*/
	.uni-popup-dialog {
		width: 300px;
		border-radius: 5px;
		background-color: #fff;
	}

	/deep/ .uni-popup__wrapper-box{
	    border-radius: 5px;
	}

	.uni-dialog-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 15px;
		padding-bottom: 5px;
	}

	.uni-dialog-title-text {
		font-size: 16px;
		font-weight: 500;
	}

	.uni-dialog-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 5px 15px 15px 15px;
	}

	.uni-popup__success {
		color: #4cd964;
	}

	.rf-uploader .uni-uploader__file {
	    margin: 20upx;
	    width: 120upx;
	    height: 120upx;
	}
	/deep/	.u-upload__wrap{
	    display: flex;
	    flex-direction: row;
	    flex-wrap: wrap;
	}

.u-block{
	padding: 14px;
	&__section{
		margin-bottom:10px;
	}
	&__title {
		margin-top:10px;
		font-size: 15px;
		color: $u-content-color;
		margin-bottom:10px;
	}
	&__flex{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
	}
}

// 使用了cell组件的icon图片样式
.u-cell-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 8rpx;
}

.u-page {
	padding: 15px 15px 40px 15px;
}

.u-demo-block {
	flex: 1;
	/*margin-bottom: 23px;*/

	&__content {
		@include flex(column);
	}

	&__title {
		font-size: 14px;
		color: rgb(143, 156, 162);
		margin-bottom: 8px;
		@include flex;
	}
}

.uni-uploader-head {
	display: flex; /* 开启Flex布局 */
	justify-content: space-between; /* 元素在主轴上均匀分布，两端对齐 */
}

.uni-uploader-title,
.uni-uploader-info{
	padding-right: 10px;
	box-sizing: border-box;
	text-align: center;
}

.u-page__tag-item {
	margin: 2px;
}

.u-demo-block__content {
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
}


.block {
	width: 100%;
	/*padding: 20upx;*/

	.title {
		width: 100%;
		font-size: 34upx;
	}

	.content {
		.my {
			width: 100%;
			height: 120upx;
			display: flex;
			align-items: center;
			font-size: $font-lg;
			border-bottom: solid 1upx #eee;

			.balance {
				margin-right: 6upx;
				font-size: $font-lg + 4upx;
			}
		}

		.amount {
			width: 100%;

			.list {
				display: flex;
				justify-content: space-between;
				padding-top: 20upx;
				flex-wrap: wrap;

				.box {
					width: 31%;
					margin-bottom: 20upx;
					height: 120upx;
					text-align: center;
					border-radius: 10upx;
					box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.05);
					&.on {
						background-color: #f1f1f1;
						color: #333;
					}

					.real {
						font-size: $font-lg;
						margin-top: 10upx;
					}

					.give {
						display: block;
						font-size: $font-sm;
					}
				}
			}

			.num {
				margin-top: 10upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;

				.text {
					padding-right: 10upx;
					font-size: 30upx;
				}

				.give {
					font-size: $font-sm;
				}

				.input {
					width: 28.2vw;
					border-bottom: solid 2upx;
					justify-content: flex-end;
					align-items: center;

					input {
						margin: 0 20upx;
						height: 60upx;
						font-size: 30upx;
						justify-content: flex-end;
						align-items: center;
					}
				}
			}
		}

		.pay-list {
			width: 100%;
			border-bottom: solid 1upx #eee;

			.row {
				width: 100%;
				height: 120upx;
				display: flex;
				align-items: center;

				.icon {
					width: 100upx;
					font-size: 52upx;
					margin-left: 15upx;
				}

				.iconerjiye-yucunkuan {
					color: #fe8e2e;
				}

				.iconweixinzhifu {
					color: #36cb59;
				}

				.iconalipay {
					color: #01aaef;
				}

				.center {
					width: 100%;
					font-size: 30upx;
				}

				.right {
					width: 100upx;
					flex-shrink: 0;
					display: flex;
					justify-content: flex-end;
				}
			}
		}
	}
}

.pay {
	margin-top: 0upx;
	width: 100%;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;

	.btn {
		width: 70%;
		height: 80upx;
		border-radius: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.2);
	}

	.tis {
		margin-top: 10upx;
		width: 100%;
		font-size: 24upx;
		display: flex;
		justify-content: center;
		align-items: baseline;
		color: #999;

		.terms {
			color: #5a9ef7;
		}
	}
}

.flex-row {
	display: flex;
	align-items: center; /* 垂直居中对齐 */
	.terms {
		color: #5a9ef7;
	}
}

/* 如果需要调整间距，可以添加 margin 或 padding */
.flex-row .u-checkbox {
	margin-right: 10px;
}
</style>
