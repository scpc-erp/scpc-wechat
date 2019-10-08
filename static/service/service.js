import request from '../util/request/index.js'
// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';

/***************************************** 用户 ******************************************/
// 用户
const login = function(user_name, user_pwd, user_icon, wechat_code) {
	// return request.ajax('/user/login',{username: user_name, password:user_pwd})
	return request.ajax('/wechat/user/login',{username: user_name, password:user_pwd, wxavatar:user_icon, wxcode:wechat_code})
}

/***************************************** 任务模块 ******************************************/
// 任务列表
const taskList = function (params) {
	return request.ajax('/tableData/queryTableData', params, 'GET')
}

// 任务列表搜索
const taskListSearch = function (params) {
	return request.ajax('/tableData/queryTableData', params, 'GET')
}

// 获取客户列表
export default {
	login,
	taskList,
	taskListSearch
}
