/* eslint-disable */
import Request from './request';
import {refreshToken} from '@/api/login';
import indexConfig from '@/config/index.config';
import mHelper from '@/utils/helper';
import store from '@/store';

const http = new Request();

// request全局参数设置
http.setConfig(config => {
	/* 设置全局配置 */
	config.baseUrl = indexConfig.baseUrl; /* 根域名不同 */
	const systemInfo = uni.getSystemInfoSync();
	const systemInfoHeaders = {
		'device-name': systemInfo.brand, // 设备名称
		width: systemInfo.screenWidth, // 屏幕宽度
		height: systemInfo.screenHeight, // 屏幕高度
		os: systemInfo.platform, // 客户端平台
		'os-version': systemInfo.system // 操作系统版本
	};
	config.header = {
		...config.header,
		...systemInfoHeaders
	};
	return config;
});

let isRefreshing = false;
let requests = [];
http.interceptor.request(
	config => {
		/* 请求之前拦截器 */
		config.header['Authorization'] = 'Bearer ' + uni.getStorageSync('accessToken');
		// 单商户
		// config.header['merchant-id'] = uni.getStorageSync('merchantId') || 1;
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// 刷新refreshToken
async function handleRefreshToken(refresh_token) {
	const params = {};
	params.group = mHelper.platformGroupFilter();
	params.refresh_token = refresh_token;
	await http.post(refreshToken, params).then(async r => {
		store.commit('login', r);
		isRefreshing = false;
	});
}

http.interceptor.response(
	async response => {
		let message =response.data.msg?response.data.msg:response.data.message
		/* 请求之后拦截器 */
		switch (response.data.code) {
			case 0:
				return response.data.data?response.data.data:response.data;
			case 400:
				mHelper.toast('错误的请求');
				return Promise.reject(message);
				break;
			case 401:
				isRefreshing = false;
				// refreshToken 的返回状态为401
				if (response.config.url === refreshToken) {
					uni.removeStorageSync('accessToken');
					await store.commit('logout');
					uni.showModal({
						content: '登录已过期，是否跳转登录页面？',
						success: confirmRes => {
							if (confirmRes.confirm) {
								mHelper.backToLogin();
								throw message;
							}
						}
					});
					break;
				} else {
					// 如果refreshToken为空 则直接跳转登录
					if (!store.state.refreshToken) {
						uni.removeStorageSync('accessToken');
						await store.commit('logout');
						uni.showModal({
							content: '登录已过期，是否跳转登录页面？',
							success: confirmRes => {
								if (confirmRes.confirm) {
									mHelper.backToLogin();
									throw message;
								}
							}
						});
						throw message;
					} else {
						// isRefreshing同一个页面只执行一次
						if (!isRefreshing) {
							isRefreshing = true;
							// 刷新token
							await handleRefreshToken(store.state.refreshToken, response);
							requests.forEach(cb => cb());
							requests = [];
							isRefreshing = false;
							return http.request(response.config);
						} else {
							return new Promise(resolve => {
								// 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
								requests.push(() => {
									resolve(http.request(response.config));
								});
							});
						}
					}
				}
				break;
			case 405:
				mHelper.toast('当前操作不被允许');
				return Promise.reject(message);
			case 404:
				mHelper.toast(message);
				return Promise.reject(message);
			case 429:
				mHelper.toast('请求过多，先休息一下吧');
				return Promise.reject(message);
			case 500:
				mHelper.toast(message?message:'服务器打瞌睡了');
				return Promise.reject(message);
			default:
				mHelper.toast(response.data.msg);
				return Promise.reject(response.data.msg);
		}
	},
	error => {
		return Promise.reject(error);
	}
);

export {http};
