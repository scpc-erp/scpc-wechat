import request from '../util/request/index.js'
// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';

/***************************************** 用户 ******************************************/
// 用户
const login = function(user_name, user_pwd, user_icon, wechat_code) {
	return request.ajax('/wechat/user/login',{username: user_name, password:user_pwd, wxavatar:user_icon, wxcode:wechat_code})
}

/***************************************** 任务模块 ******************************************/
// 任务->列表
const taskList = function (params) {
	return request.ajax('/wechat/task/getTaskList', params, 'GET')
	// return request.ajax('/tableData/queryTableData', params, 'GET')
}

// 任务列表->搜索
const taskListSearch = function (params) {
	return request.ajax('/wechat/task/getTaskList', params, 'GET') 
	// return request.ajax('/tableData/queryTableData', params, 'GET')
}

// 任务列表->提交任务
const submitTask = function (params) {
	return request.ajax('/scglxt/gygx/overWork', params)
}

/***************************************** 我的模块 ******************************************/
// 我的->额定工时
const mineTime = function() {
	return request.ajax('/wechat/user/getTaskStat')
}

// 获取客户列表
export default {
	login,
	taskList,
	taskListSearch,
	submitTask,
	mineTime
}
