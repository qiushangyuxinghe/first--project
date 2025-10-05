import axios from 'Axios';
import {ElMessage} from 'element-plus'
import config from "@/config"
const service = axios.create({
    baseURL: config.baseApi,
});

service.interceptors.request.use(
    (config) => {
        console.log('🟡 发出请求:', {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            data: config.data
        })
        return config
    },
    (error) => {
        console.error('❌ 请求拦截器错误:', error)
        return Promise.reject(error)
    }
)

// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        
        // 检查响应结构
        if (!response.data) {
            ElMessage.error('服务器返回空数据')
            return Promise.reject(new Error('服务器返回空数据'))
        }
        
        // 如果后端返回的是标准结构 {code, data, message}
        if (response.data.code !== undefined) {
            if (response.data.code === 200) {
                return response.data.data
            } else {
                ElMessage.error(response.data.message || '请求失败')
                return Promise.reject(new Error(response.data.message))
            }
        }
        
        // 如果后端直接返回数据数组（没有code包装）
        return response.data
        
    },
    (error) => {
        // 网络错误处理
        console.error('🔴 响应拦截器捕获的错误:', error)
        console.error('错误详情:', {
            message: error.message,
            code: error.code,
            config: error.config
        })
        
        if (error.code === 'ECONNREFUSED') {
            ElMessage.error('无法连接到服务器，请检查后端服务是否运行')
        } else if (error.code === 'NETWORK_ERROR') {
            ElMessage.error('网络错误，请检查连接')
        } else {
            ElMessage.error(error.message || '请求失败')
        }
        
        return Promise.reject(error)
    }
)
function request(options){
    options.method = options.method || 'get'
    //关于get请求参数的调整
    if(options.method.toLowerCase() === "get"){
        options.params = options.data
    }
    //对mock的开关做一个处理
    let isMock = config.mock//默认是false
    if(typeof options.mock !== "undefined"){
        isMock = options.mock
    }
    //针对环境做一个处理
    if(config.env === "prod"){
        //不能用mock
        service.defaults.baseURL = config.baseApi
    }else {
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
    }
    return service(options)
}

export default request