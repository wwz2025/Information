import Vue from 'vue';
import Vuex from 'vuex';
import $mConstDataConfig from '@/config/constData.config';
import console from "@dcloudio/uni-h5/src/core/helpers/console";

Vue.use(Vuex);
const ACCESSTOKEN = uni.getStorageSync('accessToken') || '';
const REFERRER = uni.getStorageSync('referrer') || '';
const USER = uni.getStorageSync('user') || {};
const REFRESHTOKEN = uni.getStorageSync('refreshToken') || '';
const GLOBALCONFIG = uni.getStorageSync('globalConfig') || {};
const CARTNUM = uni.getStorageSync('cartNum') || 0;
const NOTIFYNUM = uni.getStorageSync('notifyNum') || 0;
const IMHISTORY = uni.getStorageSync('imHistory') || [];
const IMNOREAD = uni.getStorageSync('imNoRead') || 0;
// const THEMECOLOR = uni.getStorageSync('themeColor') || {title: '官方', name: 'rf', color: '#fa436a'};//系统皮肤颜色初始化修改

const THEMECOLOR =uni.getStorageSync('themeColor') ||  {"title":"海蓝","name":"blue","color":"#0081ff","tabList":[
// 	"/static/tab-home-blue.png","/static/tab-cart-blue.png"
// ,"/static/tab-cate-blue.png","/static/tab-notify-blue.png","/static/tab-my-blue.png"
	]};

const store = new Vuex.Store({
	state: {
		accessToken: ACCESSTOKEN,// 用户token
		userInfo: USER.member,// 用户信息
		referrer: REFERRER,// 推荐人
		openId: '',// 小程序openid
		networkState: 'unknown',// 网络状态，用于下载提醒
		globalConfig: GLOBALCONFIG,
		refreshToken: REFRESHTOKEN,
		cartNum: CARTNUM,// 购物车数字角标
		notifyNum: NOTIFYNUM,// 消息中心数字角标
		imHistory: IMHISTORY,// 历史聊天消息，仅保存最后100条
		imNoRead: IMNOREAD,// 当前未读聊天消息数量
		isImPanel: false,// 当前是否处于聊天面板
		isStuffService: false,// 当前是否人工客服服务
		themeColor: THEMECOLOR
	},
	getters: {
		// 全局配置
		themeColor: state => {
			return state.themeColor;
		},
		// 全局配置
		globalConfig: state => {
			return state.globalConfig;
		},
		// 获取网络状态
		networkStatus: state => {
			return state.networkState;
		},
		// 判断用户是否登录
		hasLogin: state => {
			console.log('state')
			console.log(state)
			return !!state.accessToken;
		}
	},
	mutations: {
		login(state, provider) {
			console.log('provider')
			console.log(provider)
			state.accessToken = provider.access_token;
			state.refreshToken = provider.refresh_token;
			state.userInfo = provider.member;
			state.user = provider;
			uni.setStorageSync('user', provider);
			uni.setStorageSync('accessToken', provider.access_token);
			uni.setStorageSync('refreshToken', provider.refresh_token);
			uni.setStorageSync('userInfo', provider.member);
		},
		logout(state) {
			console.log('logout触发了退出')
			state.accessToken = '';
			state.refreshToken = '';
			state.userInfo = {};
			uni.removeStorageSync('accessToken');
			uni.removeTabBarBadge({index: $mConstDataConfig.notifyIndex});
			uni.removeTabBarBadge({index: $mConstDataConfig.cartIndex});
			uni.removeStorageSync('refreshToken');
			uni.removeStorageSync('userInfo');
		},
		setReferrer(state, referrer) {
			state.referrer = referrer;
			uni.setStorageSync('referrer', referrer);
		},
		setOpenId(state, openId) {
			state.openId = openId;
			uni.setStorageSync('openId', openId);
		},
		setNetworkState(state, provider) {
			state.networkState = provider;
		},
		setCartNum(state, provider) {
			state.cartNum = provider;
			uni.setStorageSync('cartNum', provider);
			if (!provider || parseInt(provider, 10) === 0) {
				uni.removeTabBarBadge({
					index: $mConstDataConfig.cartIndex
				});
			} else {
				uni.setTabBarBadge({
					index: $mConstDataConfig.cartIndex,
					text: provider.toString()
				});
			}
		},
		setNotifyNum(state, provider) {
			state.notifyNum = provider;
			uni.setStorageSync('notifyNum', provider);
			if (parseInt(provider, 10) === 0) {
				uni.removeTabBarBadge({
					index: $mConstDataConfig.notifyIndex
				});
			} else {
				uni.setTabBarBadge({
					index: $mConstDataConfig.notifyIndex,
					text: provider.toString()
				});
			}
		},
		setGlobalConfig(state, provider) {
			state.globalConfig = provider;
			uni.setStorageSync('globalConfig', provider);
		},
		addImHistory(state, provider) {
			if (provider) {
				let data = state.imHistory;
				data.push(provider);
				uni.setStorageSync('imHistory', data);
				state.imHistory = data;
				if (!state.isImPanel) {
					this.commit('addImNoRead', 1);
				}
			}
		},
		clearImHistory(state) {
			state.imHistory = [];
			uni.setStorageSync('imHistory', []);
			state.imNoRead = 0;
			uni.setStorageSync('imNoRead', 0);
		},
		addImNoRead(state, provider) {
			state.imNoRead = state.imNoRead + provider;
			// if (state.imNoRead > $mAppConfig.imHisotryNum) {
			// 	state.imNoRead = $mAppConfig.imHisotryNum;
			// }
			uni.setStorageSync('imNoRead', state.imNoRead);
		},
		setIsImPanel(state, provider) {
			state.isImPanel = provider;
			if (provider) {
				state.imNoRead = 0;
				uni.setStorageSync('imNoRead', 0);
			}
		},
		setIsStuffService(state, provider) {
			state.isStuffService = provider;
		},
		setThemeColor(state, val) {
			state.themeColor = val;
			uni.setStorageSync('themeColor', val);
		}
	},
	actions: {
		globalConfigChange({commit}, info) {
			commit('setGlobalConfig', info);
		},
		networkStateChange({commit}, info) {
			commit('setNetworkState', info);
		},
		logout({commit}) {
			commit('logout');
		}
	}
});

export default store;
