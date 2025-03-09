/**
 *@des 公用基础
 *@date 2021-8-31
 */
const querybaseinfoset = '/querybaseinfoset';
const provinceList = '/queryallprovinces';// 获取省市区列表
const cityList = '/querycitybyprovinceid';
const regionList = '/querydistrictbycityid';
const collectCreate = '/addattention';// 收藏商品
const collectDel = '/cancelattention';// 删除收藏商品
const transmitCreate = '/jwt/v1/common/transmit/create';// 分享/转发
const advList = '/jwt/v1/common/adv/index';// 广告
const advView = '/jwt/v1/common/adv/view';
const configList = '/jwt/v1/common/config/index';// 配置
const aliPay = '/aliPay';// APP支付宝支付
const toaliwappay = '/toaliwappay';// 支付宝h5支付
const toalipagepay = '/toalipagepay';// 支付宝pc支付
const wechatofficialaccountpayparm = '/wechatofficialaccountpayparm';// 获取微信公众号支付
const wechath5payparm = '/wechath5payparm';// 获取微信H5支付参数
const wechatappletpay = '/forum/forum/wechatappletpayparams';// 获取微信小程序支付

const wechatnotify = '/forum/forum/wechatnotify';// 微信支付回调
const wxpay = '/wxpay';// APP微信支付
const wechatConfig = '/jwt/v1/third-party/wechat-js-sdk';// 充值配置
const notifyAnnounceIndex = '/jwt/v1/common/notify-announce/index';// 公告列表
const notifyAnnounceView = '/jwt/v1/common/notify-announce/view';// 公告详情
const versionsIndex = '/app-versions/versions/index';// 版本检测
const pickupPointIndex = '/jwt/v1/common/pickup-point/index';// 版本检测
const helperIndex = '/help/cate';// 站点帮助-列表
const helperView = '/help/desc';// 站点帮助-详情
const articleIndex = '/article/column';// 站点帮助-列表
const articleView = '/article';// 站点帮助-详情
const bindingEquipment = '/jwt/v1/member/auth/binding-equipment';// 设备绑定(app推送)
const authIsBinding = '/jwt/v1/member/auth/is-binding';// 查询绑定状态
const authCreate = '/jwt/v1/member/auth/create';// 第三方绑定

export {
	articleIndex,articleView,
	querybaseinfoset,
	provinceList,
	cityList,
	regionList,
	collectCreate,
	collectDel,
	transmitCreate,
	advList,
	advView,
	configList,
	wechatConfig,
	notifyAnnounceIndex,
	notifyAnnounceView,
	versionsIndex,
	pickupPointIndex,
	helperIndex,
	helperView,
	bindingEquipment,
	authIsBinding,
	authCreate,
	aliPay,
	toaliwappay,// 支付宝h5支付
	toalipagepay ,// 支付宝pc支付
	wechatofficialaccountpayparm,// 获取微信公众号支付
	wechath5payparm,// 获取微信H5支付参数
	wechatappletpay,// 获取微信小程序支付
	wechatnotify,// 微信支付回调
	wxpay// APP微信支付
};
