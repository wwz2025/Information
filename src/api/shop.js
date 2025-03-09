/**
 *@des 产品管理
 *@date 2021-8-31
 */
const articleListUrl= '/jwt/forum/forum/list'; // 查询资讯列表
const view= '/jwt/forum/shop/article'; // 查询产品详情
const payPointsUrl= '/jwt/forum/shop/payPoints'; // 查询资讯详情
const commentListUrl= '/jwt/cms/commentList'; // 查询评论
const addCommentUrl= '/jwt/cms/comments/save'; // 保存评论
const deleteCommentUrl= '/jwt/cms/comments/delete'; // 删除评论
const addFavouriteAllUrl= '/jwt/forumQuestion/addFavouriteAll'; // 收藏、点赞、浏览等
const removeFavouriteAllUrl= '/jwt/forumQuestion/removeFavouriteAll'; // 取消收藏、点赞、浏览等
const cmsTagsUrl= '/jwt/forum/forumTags'; // 标签列表
export {
	articleListUrl,
	view,
	payPointsUrl,
	commentListUrl,
	addCommentUrl,
	deleteCommentUrl,
	cmsTagsUrl,
	addFavouriteAllUrl,
	removeFavouriteAllUrl
};
