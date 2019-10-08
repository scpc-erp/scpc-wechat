
import store from '../../../store/index'

const request = {}

const headers = {
	'Content-Type': 'application/x-www-form-urlencoded',

}
const PORT1 = '/baseinfo'


const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://192.168.2.184:8360' : 'http://swby-scpc.ngrok.ibanzhuan.cn/api'

request.ajax = (url, data, method = 'POST',  power) => {
/*     
	权限判断 因为有的接口请求头可能需要添加的参数不一样，所以这里做了区分
	  == 不通过access_token校验的接口
	  == 文件下载接口列表
	  == 验证码登录 
*/
    switch (power){
        case 1:
            headers['Authorization'] = 'Basic a3N1ZGk6a3N1ZGk='
            break;
        case 2:
            headers['Authorization'] = 'Basic a3N1ZGlfcGM6a3N1ZGlfcGM='
            break;
        case 3:
            responseType = 'blob'
            break;
        default:
            // headers['Authorization'] = `Bearer ${
            //     this.$store.getters.userInfo
            // }`
			const token = uni.getStorageSync('token');
			if (token) {
				headers['token'] = token;
			}
            break;
    }
            
    return uni.request({
        url: BASE_URL + url,
        method: method,
        data: data,
        dataType: 'json',
        header: headers
    }).then(res => {
        if (res[1].data.errno || res[1].data.errno == 0) {
            return res[1].data
        } else {
            throw res[1].data
        }
    }).catch(parmas => {
　　　　　　switch (parmas.code) {
　　　　　　　　case 401:
　　　　　　　　　　uni.clearStorageSync()
　　　　　　　　　　break
　　　　　　　　default:
　　　　　　　　　　uni.showToast({
　　　　　　　　　　　　title: parmas.info,
　　　　　　　　　　　　icon: 'none'
　　　　　　　　　　})
　　　　　　　　　　return Promise.reject()
　　　　　　　　　　break
　　　　　　}

　　})
 } 

export default request