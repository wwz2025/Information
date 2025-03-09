const CONFIG = {
	// 开发环境配置
	development: {
		assetsPath: '/static', // 静态资源路径
		qqMapKey:'MVGBZ-R2U3U-W5CVY-2PQID-AT4VZ-PDF35',
		baseUrl: 'https://taidaotk.com/ruoyi-admin-info', // 后台接口请求地址
		hostUrl: 'https://taidaotk.com/ruoyi-admin-info', // H5地址(前端运行地址)
		fileUrl: 'https://taidaotk.com/ruoyi-admin-info', // 文件地址(前端运行地址)
		websocketUrl: '', // websocket服务端地址
		weixinAppId: 'wxd36292db0016c973' // 微信公众号appid
	},
	// 生产环境配置
	production: {
		assetsPath: '/static', // 静态资源路径
		baseUrl: 'https://taidaotk.com/ruoyi-admin-info', // 后台接口请求地址
		hostUrl: 'https://taidaotk.com/ruoyi-admin-info', // H5地址(前端运行地址)
		fileUrl: 'https://taidaotk.com/ruoyi-admin-info', // 文件地址(前端运行地址)
		websocketUrl: '', // websocket服务端地址
		weixinAppId: '' // 微信公众号appid
	}

};
export default CONFIG[process.env.NODE_ENV];
