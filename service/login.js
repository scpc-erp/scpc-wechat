import request from '../util/request/index.js'
// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';

// 登录
const login = function(user_name, user_pwd) {
	
	return request.ajax('/user/login',{username: user_name, password:user_pwd})
}

// 获取登录的用户详细信息
const getUser = function() {
	return request.ajax('/fac/app/admin/info',null,'GET')
}

// 获取客户列表
export default {
	login
	// sendMessage,
	// getUser,
	// getReport,
	// getCustomList,
	// getMoneyList,
	// getFacMessage,
	// getMoneyOrderList,
	// getFacList,
	// changeFac
}
