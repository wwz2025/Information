/**
 *@des 产品营销
 *@date 2019/11/18 13:57:54
 */
// 首页列表
const indexList = '/jwt/v1/index/index';
const queryAllFirstAndSecondCategory= '/queryAllFirstAndSecondCategory';
const storeList = '/store/searchstore';

const productCate = '/typeList';// 产品分类列表
const productCateList = '/jwt/v1/product/cate/list';// 首页推荐分类
const productList = '/goodsList';// 产品列表
// const productDetail = '/queryGoodsDetail';// 产品详情
const productDetail = '/jwt/forum/shop/article';
const productGroupDetail = '/spudetail/grouporders'; // 产品详情中 拼团列表
const combinationView = '/jwt/v1/marketing/combination/view';// 组合套餐详情
const guessYouLikeList = '/recommendskus';// 猜您喜欢
const cartItemCreate = '/shoppingcart/addshoppingcart';// 添加购物车
const marketings= '/shoppingcart/marketings';// 查询单品的促销信息
const cartItemList = '/shoppingcart/carts';// 购物车列表
const cartItemCount = '/shoppingcart/count';// 购物车列表
const updatecartmarketing= '/shoppingcart/updatecartmarketing';// 更新购物车促销信息
const cartItemDel = '/shoppingcart/deletecart';// 删除购物车商品
const cartItemClear = '/shoppingcart/clear';// 清空购物车
const cartItemUpdateNum = '/shoppingcart/cartnum';// 修改购物车商品数量
const cartItemUpdateSku = '/shoppingcart/update-sku';// 修改购物车商品sku
const brandIndex = '/brandList';// 品牌列表
const orderCountStatisic = '/order/count';// 用户中心 订单数量
const orderCreate = '/submitorder';// 订单创建
const orderPreview = '/settlement';// 订单预览
const queryorderforevaluation= '/queryorderforevaluation';//查询订单评价详情
const evaluationdetail= '/evaluationdetail';
const addorderevaluation = '/addorderevaluation';// 添加订单评论
const orderClose = '/cancelorder';// 取消未支付订单
const toprepay = '/toprepay';// 预存款支付
const wechatappletpayparams = '/wechatappletpayparams';// 微信小程序支付
const toaliwappay = '/toaliwappay';// 支付宝h5支付
const wechath5payparm = '/wechath5payparm';// 微信H5支付
const wechatofficialaccountpayparm = '/wechatofficialaccountpayparm';// 微信公众号支付
const orderFreightFee = '/calculatefreight';// 选择快递运费计算
const evaluateList = '/queryskucomments';// 商品评价列表
const orderProductExpressDetails ='/jwt/v1/member/order-product-express/details';// 商品评价列表
const wholesaleProductIndex = '/jwt/v1/marketing/wholesale-product/index';// 拼团产品
const wholesaleIndex = '/jwt/v1/marketing/wholesale/index';// 开团列表
const wholesaleView = '/jwt/v1/marketing/wholesale/view';// 开团详情
const wholesaleGroupState = '/jwt/v1/marketing/wholesale/group-state';// 开团详情
const myWholesaleIndex = '/jwt/v1/member/wholesale/index';// 我的开团列表
const discountProductIndex = '/jwt/v1/marketing/discount-product/index';// 限时折扣列表
const groupBuyIndex = '/jwt/v1/marketing/group-buy/index';// 团购商品列表
const bargainProductIndex = '/jwt/v1/marketing/bargain-product/index';// 砍价商品列表
const bargainLaunchCreate = '/jwt/v1/marketing/bargain-launch/create';// 创建砍价
const bargainLaunchView = '/jwt/v1/marketing/bargain-launch/view';// 砍价详情
const bargainPartakeCreate = '/jwt/v1/marketing/bargain-partake/create';// 帮好友砍价
const bargainLaunchIndex = '/jwt/v1/marketing/bargain-launch/index';// 我的砍价列表
const miniProgramLiveIndex = '/jwt/v1/marketing/mini-program-live/index';// 我的砍价列表
const thirdPartyQrCode = '/jwt/v1/third-party/qr-code';// 我的砍价列表
const queryskucomments= '/queryskucomments';//查询单品评论
const querycommentsummarize= '/querycommentsummarize'; // 查询商品的评论概括
// const articleListUrl= '/cms/articleList'; // 查询资讯列表
// const view= '/cms/view'; // 查询资讯详情

export {
	queryAllFirstAndSecondCategory,productGroupDetail,
	storeList,
	updatecartmarketing,
	queryorderforevaluation,
	addorderevaluation,
	evaluationdetail,
	queryskucomments,
	querycommentsummarize,
	indexList,
	productCate,
	productCateList,
	productList,
	guessYouLikeList,
	productDetail,
	combinationView,
	cartItemCreate,
	cartItemList,
	cartItemDel,
	cartItemClear,
	cartItemUpdateNum,
	brandIndex,
	orderCreate,
	orderClose,
	toprepay,
	marketings,
	wechatappletpayparams,
	toaliwappay,
	wechath5payparm,
	wechatofficialaccountpayparm,
	orderFreightFee,
	evaluateList,
	orderCountStatisic,
	orderPreview,
	orderProductExpressDetails,
	cartItemUpdateSku,
	cartItemCount,
	wholesaleProductIndex,
	wholesaleIndex,
	wholesaleView,
	wholesaleGroupState,
	myWholesaleIndex,
	discountProductIndex,
	groupBuyIndex,
	bargainProductIndex,
	bargainLaunchCreate,
	bargainLaunchView,
	bargainPartakeCreate,
	bargainLaunchIndex,
	miniProgramLiveIndex,
	thirdPartyQrCode,
	// articleListUrl,
	// view
};
