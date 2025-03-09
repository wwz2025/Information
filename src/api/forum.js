/**
 *@des 内容管理
 *@date 2021-8-31
 */
const articleListUrl= '/jwt/forum/forum/list'; // 查询资讯列表
const view= '/jwt/forum/forum/detail'; // 查询资讯详情
const commentListUrl= '/jwt/cms/commentList'; // 查询评论
const addCommentUrl= '/jwt/cms/comments/save'; // 保存评论
const deleteCommentUrl= '/jwt/cms/comments/delete'; // 删除评论
const addFavouriteAllUrl= '/jwt/forumQuestion/addFavouriteAll'; // 收藏、点赞、浏览等
const removeFavouriteAllUrl= '/jwt/forumQuestion/removeFavouriteAll'; // 取消收藏、点赞、浏览等
const cmsTagsUrl= '/jwt/forum/forumTags'; // 标签列表

const cmsCategoryUrl= '/jwt/forumQuestion/category'; // 标签列表
const addQuestionUrl= '/jwt/forumQuestion/addQuestion'; // 新增在线问答
const editQuestion= '/jwt/forumQuestion/editQuestion'; // 保存在线问答
const delQuestion= '/jwt/forumQuestion/deleteQuestion'; // 保存在线问答
const forumTagsUrl= '/jwt/forum/forumTags'; // 在线问答标签
const countMessagesUrl= '/jwt/message/countMessages'; // 消息汇总
const getMessageListUrl= '/jwt/message/list'; // 消息列表
const getMessageDetailUrl= '/jwt/message/detail'; // 消息列表
const updateReadFlagUrl= '/jwt/message/updateReadFlag'; // 阅读消息列表
const addMessageUrl= '/jwt/message/add'; // 发送私信
const getMessageUsersUrl= '/jwt/message/getUsers'; // 发送私信



const userSignUrl= '/jwt/forum/userSign'; // 用户签到
const indexSignUrl= '/jwt/forum/indexSign'; // 用户签到状态
export {
	articleListUrl,
	view,
	commentListUrl,
	addCommentUrl,
	deleteCommentUrl,
	cmsTagsUrl,
	cmsCategoryUrl,
	addFavouriteAllUrl,
	removeFavouriteAllUrl,
	addQuestionUrl,
	editQuestion,
	delQuestion,
	forumTagsUrl,
	countMessagesUrl,
	getMessageListUrl,
	updateReadFlagUrl,
	addMessageUrl,
	getMessageUsersUrl,
	userSignUrl,
	indexSignUrl,
};
