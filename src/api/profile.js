/**
 *@des 配置管理
 *@date 2021-8-31
 */
const myFavouriteUrl= '/jwt/forumQuestion/myFavouriteListAll'; //查看我的收藏、评论、点赞、举报
const addReportUrl= '/jwt/forum/report/addReport'; //添加举报
const getReportUrl= '/jwt/forum/report/getReport'; //查看举报详情
const fansListUrl= '/jwt/forum/focus/fansList/'; //粉丝列表
const focusListUrl= '/jwt/forum/focus/focusList/'; //关注列表
const addFocusUrl= '/jwt/forum/focus/add/'; //添加关注，路径参数focus_user_id
const deleteFocusUrl= '/jwt/forum/focus/delete/'; //取消关注，路径参数focus_user_id
export {
	myFavouriteUrl,
	addReportUrl,
	getReportUrl,
	fansListUrl,
	focusListUrl,
	addFocusUrl,
	deleteFocusUrl
};
