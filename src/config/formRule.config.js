/*
 * 应用表单校验相关配置
 * 依赖：graceChecker.js 进行校验
 * 使用：引入该js到页面，let res = graceChecker.check({phoneNo:"",code:""},formRule.loginRule)
 */

export default {
	/* 用户密码登录 */
	loginByPassRule: [{
		name: 'mobile',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '手机号不能为空'
	}, {
		name: 'mobile',
		checkType: 'phoneno',
		checkRule: '',
		errorMsg: '手机号格式不正确'
	}, {
		name: 'password',
		checkType: 'string',
		checkRule: '6,18',
		errorMsg: '请输入6-18位密码'
	}],

	/* 用户验证码登录 */
	loginByCodeRule: [{
		name: 'mobile',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '手机号不能为空'
	}, {
		name: 'mobile',
		checkType: 'phoneno',
		checkRule: '',
		errorMsg: '手机号格式不正确'
	}, {
		name: 'code',
		checkType: 'string',
		checkRule: '6',
		errorMsg: '请输入6位验证码'
	}],

	/* 发送验证码验证手机号 */
	sendCodeRule: [{
		name: 'mobile',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '手机号不能为空'
	}, {
		name: 'mobile',
		checkType: 'phoneno',
		checkRule: '',
		errorMsg: '手机号格式不正确'
	}],

	/* 编辑新增个人发票 */
	pInvoiceRule: [{
		name: 'title',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '发票抬头不能为空'
	}],

	/* 编辑新增公司发票 */
	cInvoiceRule: [{
		name: 'title',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '发票抬头不能为空'
	}, {
		name: 'duty_paragraph',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '发票税号不能为空'
	}],

	/* 用户注册 */
	registerRule: [{
		name: 'userName',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '用户名不能为空'
	}, {
		name: 'mobile',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '手机号不能为空'
	}, {
		name: 'mobile',
		checkType: 'phoneno',
		checkRule: '',
		errorMsg: '手机号格式不正确'
	}, {
		name: 'code',
		checkType: 'string',
		checkRule: '6',
		errorMsg: '请输入6位验证码'
	}, {
		name: 'password',
		checkType: 'string',
		checkRule: '6,18',
		errorMsg: '请输入6-18位密码'
	}
	],

	/* 密码重置 */
	resetPasswordRule: [{
		name: 'mobile',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '手机号不能为空'
	}, {
		name: 'mobile',
		checkType: 'phoneno',
		checkRule: '',
		errorMsg: '手机号格式不正确'
	}, {
		name: 'code',
		checkType: 'string',
		checkRule: '6',
		errorMsg: '请输入6位验证码'
	}, {
		name: 'password',
		checkType: 'string',
		checkRule: '6,18',
		errorMsg: '请输入6-18位密码'
	}
	],


	/* 在线问答 */
	questionRule: [{
		name: 'categoryId',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '栏目不能为空'
	},
	// 	{
	// 	name: 'tags',
	// 	checkType: 'notnull',
	// 	checkRule: '',
	// 	errorMsg: '标签不能为空'
	// } ,
	// 	{
	// 	name: 'title',
	// 	checkType: 'notnull',
	// 	checkRule: '',
	// 	errorMsg: '标题不能为空'
	// },
		{
		name: 'content',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '问题描述不能为空'
	} ,
	// {
	// 	name: 'hobby',
	// 	checkType: 'notnull',
	// 	checkRule: '',
	// 	errorMsg: '话题不能为空'
	// }
	],

	/* 评分 */
	rateRule: [
	// 	{
	// 	name: 'totalScore',
	// 	checkType: 'notnull',
	// 	checkRule: '',
	// 	errorMsg: '总体评分不能为空'
	// },
	{
		name: 'attitudeScore',
		checkType: 'notnull',
		checkRule	: '',
		errorMsg: '态度评分不能为空'
	} , {
		name: 'majorScore',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '专业评分不能为空'
	}, {
		name: 'ratioScore',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '时效评分不能为空'
	}]
};
