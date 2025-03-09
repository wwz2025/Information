/**
 *@des 个人中心相关接口
 *@date 2021-8-31
 */
const querypredepositcount = '/customer/querypredepositcount';

const forumList = '/forum/forum/list';
const memberInfo = '/jwt/customerdetail';// 个人信息
const memberInfoById = '/jwt/customerdetailById';// 根据id查询个人信息
const memberUpdate = '/jwt/user/edit';// 个人信息修改

const addressList = '/querycustomeraddress';// 收货地址列表
const addressDefault = '/jwt/v1/member/address/default';// 默认收货地址
const addressDetail = '/querycustomeraddressbyid';// 默认收货地址
const addressCreate = '/addaddress';// 创建收货地址
const addressUpdate = '/updateaddress';// 修改收货地址
const addressDelete = '/deletecustomeraddress';// 修改收货地址

const couponList = '/getcouponlist';// 获取优惠券列表
const myCouponList = '/coupons';// 获取我的优惠券列表
const couponDetail = '/jwt/v1/marketing/coupon-type/view';// 优惠券详情
const couponReceive = '/jwt/v1/marketing/coupon-type/create';// 领取优惠券
const couponClear = '/jwt/v1/member/coupon/clear';
const orderList = '/querycustomerorders';// 获取我的订单
const orderTakeDelivery = '/receiptorder';// 订单确认收货
const orderRefundApply = '/jwt/v1/member/order-product/refund-apply';// 退货/退款申请
const orderProductSalesReturn =	'/jwt/v1/member/order-product/refund-sales-return';// 产品退货提交物流
const closeOrderRefundApply = '/jwt/v1/member/order-product/refund-close';// 关闭退货/退款申请

const orderDetail = '/orderdetail';// 获取订单详情
const ordersByCode = '/forum/forum/ordersByCode';
const orderDelete = '/jwt/v1/member/order/delete';// 删除已关闭订单

const addbrowserecord= '/addbrowserecord';// 添加我的足迹
const footPrintList = '/querybrowserecords';// 获取我的足迹
const footPrintDel = '/jwt/v1/member/footprint/delete';// 删除我的足迹

const collectList = '/queryattentions';// 收藏列表

// const pointsList = '/points';
const pointsList = '/jwt/forum/forumIn/list';
const pointsTotal = '/jwt/points/total';
const pointTotalList = '/jwt/pointTotal';
// const querypointmallorderlist = '/querypointmallorderlist';// 分页查询用户积分商城订单列表
const querypointmallorderlist = '/jwt/forum/forumOut/list';// 分页查询用户积分商城订单列表
const querypointorderlist = '/jwt/forum/shop/myOrderList';// 分页查询用户积分商城订单列表

const submitpointmallorder = '/submitpointmallorder'; //提交积分商城订单
const confirmreceiptpointmallorder = '/confirmreceiptpointmallorder'; //积分商城订单确认收货
const querypointmallorderdetail = '/querypointmallorderdetail'; //查询积分商城订单详情
const pointorderCount = '/pointorder/count'; //积分订单统计

const querypointskulist = '/querypointskulist'; //分页查询积分商品信息
const querypointtype = '/querypointtype'; //查询所有积分商品分类
const querypointskudetail = '/querypointskudetail'; //查询积分商品信息详情
const queryhotpointskulist  = '/queryhotpointskulist'; //查询推荐的积分商品列表

const creditsLogList = '/predeposits';// 余额日志
const evaluateCreate = '/jwt/v1/member/evaluate/create';// 创建订单评价
const evaluateAgain = '/jwt/v1/member/evaluate/again';// 追加评价
const orderProductIndex = '/jwt/v1/member/order-product/index';// 订单商品
const invoiceList = '/jwt/v1/member/invoice/index';// 发票列表
const invoiceCreate = '/jwt/v1/member/invoice/create';// 发票列表
const invoiceUpdate = '/jwt/v1/member/invoice/update';// 发票编辑
const invoiceDetail = '/jwt/v1/member/invoice/view';// 发票详情
const invoiceDefault = '/jwt/v1/member/invoice/default';// 默认发票
const invoiceDel = '/jwt/v1/member/invoice/delete';// 删除发票
const orderInvoiceList = '/jwt/v1/member/order-invoice/index';// 开票列表
const orderInvoiceCreate = '/jwt/v1/member/order-invoice/create';// 发票补领

const opinionList = '/jwt/complaint/List';// 意见反馈列表
const opinionCreate = '/jwt/complaint';// 意见反馈创建
const opinionDetail = '/jwt/complaint/complaintDetail';// 意见反馈详情

const thirdPartyAuthList = '/jwt/v1/member/auth/index';// 第三方授权列表
const thirdPartyAuthDelete = '/jwt/v1/member/auth/delete';// 解除第三方授权列表
const rechargeConfigIndex = '/jwt/v1/member/recharge-config/index';// 充值金额

const orderCustomerRefundApply = '/jwt/v1/member/order-member/apply';// 申请退款/退货
const orderCustomerSalesReturn ='/jwt/v1/member/order-member/sales-return';// 退货提交物流
const orderCustomerRefundClose = '/jwt/v1/member/order-member/close';// 退款/退货关闭申请

// const uploadImage = '/aliyun/oss/uploadToAliOss';
const uploadImage = '/jwt/oss/uploadAttachment'; // 上传图片

// 消息通知
const notifyIndex = '/jwt/v1/member/notify/index';// 消息列表
const notifyView = '/jwt/v1/member/notify/view';// 消息详情
const notifyRead = '/jwt/v1/member/notify/read';// 单个消息阅读
const notifyReadAll = '/jwt/v1/member/notify/read-all';// 全部已读
const notifyClear = '/jwt/v1/member/notify/clear';// 删除一条或者多条
const notifyClearAll = '/jwt/v1/member/notify/clear-all';// 清空消息记录

const notifyUnRreadCount = '/message/total';// 未读消息个数
const notifySubscriptionConfigIndex ='/jwt/v1/member/notify-subscription-config/index';// 消息提醒配置

const notifySubscriptionConfigUpConfig ='/jwt/v1/member/notify-subscription-config/up-config';// 修改消息提醒配置

const orderProductVirtualIndex ='/jwt/v1/member/order-product-virtual/index';// 虚拟码列表
const orderProductVirtualView ='/jwt/v1/member/order-product-virtual/view';// 虚拟码详情
const productVirtualVerificationVerify ='/jwt/v1/order/product-virtual-verification/verify';// 虚拟码详情

const memberLevelIndex = '/jwt/v1/member/member-level/index';// 会员等级

export {
	forumList,
	querypointskulist,
	querypointtype ,
	querypointskudetail ,
	queryhotpointskulist,
	querypointmallorderlist ,

	querypointorderlist ,

	submitpointmallorder ,
	confirmreceiptpointmallorder ,
	querypointmallorderdetail ,
	pointorderCount,
	pointsTotal,
	pointsList,
	pointTotalList,
	querypredepositcount,
	memberInfo,
	memberInfoById,
	memberUpdate,
	addressList,
	addressCreate,
	addressDefault,
	addressDetail,
	addressUpdate,
	addressDelete,
	couponList,
	myCouponList,
	couponClear,
	couponDetail,
	orderList,
	orderRefundApply,
	closeOrderRefundApply,
	orderProductSalesReturn,
	orderDetail,
	ordersByCode,
	orderDelete,
	orderTakeDelivery,
	couponReceive,
	addbrowserecord,
	footPrintList,
	footPrintDel,
	collectList,
	creditsLogList,
	evaluateCreate,
	evaluateAgain,
	invoiceList,
	invoiceCreate,
	invoiceUpdate,
	invoiceDetail,
	invoiceDefault,
	invoiceDel,
	orderInvoiceCreate,
	orderInvoiceList,
	uploadImage,
	opinionList,
	opinionCreate,
	opinionDetail,
	thirdPartyAuthList,
	thirdPartyAuthDelete,
	rechargeConfigIndex,
	orderCustomerSalesReturn,
	orderCustomerRefundApply,
	orderCustomerRefundClose,
	orderProductIndex,
	notifyIndex,
	notifyView,
	notifyRead,
	notifyReadAll,
	notifyClear,
	notifyClearAll,
	notifyUnRreadCount,
	notifySubscriptionConfigUpConfig,
	notifySubscriptionConfigIndex,
	orderProductVirtualIndex,
	orderProductVirtualView,
	productVirtualVerificationVerify,
	memberLevelIndex
};
