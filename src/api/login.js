/**
 *@des 登录注册相关接口
 *@date 2019/11/15 15:14:47
 *@param login.js
 */
const loginBySmsCode = '/jwt/loginBySms';// 手机号登录
const smsCode = '/jwt/sendSmsCode';// 获取手机验证码
const logout = '/jwt/logout';// 退出登录
const refreshToken = '/jwt/v1/site/refresh';// 刷新token
const verifyAccessToken = '/jwt/sendMobileCode';// 登录令牌有效性检测
const updatePassword = '/jwt/user/updatePassword';// 密码重置
const registerByPass = '/jwt/register';// 密码注册
const sendRegisterCode = '/sendRegisterCode';// 密码注册
const loginByPass = '/jwt/loginByPassword';// 密码登录
const getWxAppPhone= '/jwt/getWxAppPhone';
const getOpenId= '/jwt/getOpenId';// 微信小程序登录
const wechatH5Login = '/jwt/v1/third-party/wechat';// 微信授权登录
const mpWechatLogin = '/jwt/mpWechatLogin';// 微信小程序授权登录
const thirdPartyWechatOpenPlatform = '/jwt/v1/third-party/wechat-open-platform';// App微信授权登录
const updatepaypwd = '/updatepaypwd/update';//修改用户支付密码接口
const authLogin = '/jwt/v1/member/auth/create';// 第三方绑定
const isBindingCheck = '/jwt/v1/member/auth/is-binding';// 查询绑定状态
export {updatepaypwd,
	getWxAppPhone,
	getOpenId,
	registerByPass,
	loginByPass,
	isBindingCheck,
	wechatH5Login,
	mpWechatLogin,
	thirdPartyWechatOpenPlatform,
	authLogin,
	updatePassword,
	smsCode,
	loginBySmsCode,
	logout,
	refreshToken,
	verifyAccessToken
};
