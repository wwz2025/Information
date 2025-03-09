/**
 *@des 内容管理
 *@date 2021-8-31
 */
const articleListUrl = '/jwt/cms/articleList'; // 查询资讯列表
const view = '/jwt/cms/article'; // 查询资讯详情
const commentListUrl = '/jwt/cms/commentList'; // 查询评论
const addCommentUrl = '/jwt/cms/comments/save'; // 保存评论
const deleteCommentUrl = '/jwt/cms/comments/delete'; // 删除评论
const addCommentRate = '/jwt/cms/comments/update'; // 客服评分
const addFavouriteAllUrl = '/jwt/forumQuestion/addFavouriteAll'; // 收藏、点赞、浏览等
const removeFavouriteAllUrl = '/jwt/forumQuestion/removeFavouriteAll'; // 取消收藏、点赞、浏览等
const cmsTagsUrl = '/jwt/cms/article/cmsTags'; // 取消收藏
export {
    articleListUrl,
    view,
    commentListUrl,
    addCommentUrl,
    deleteCommentUrl,
    cmsTagsUrl,
    addFavouriteAllUrl,
    removeFavouriteAllUrl,
    addCommentRate
};
