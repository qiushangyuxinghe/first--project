// 整个项目api的统一管理
import request from './request'

//请求首页左侧的表格的数据

export default {
    getTableData() {
        return request({
            url: '/home/getTableData',
            method: 'get',
        })
    },
    getCountData() {
        return request({
            url: '/home/getCountData',
            method: 'get',
        })
    },
    getChartData() {
        return request({
            url: '/home/getChartData',
            method: 'get',
        })
    },
    getUserData(data){
        return request({
            url:'/home/getUserData',
            method:'post',
            data,
            mock:false,
        }).then(response => {
        return response
    }).catch(error => {

        throw error
    })
    },
    getMenu(params){
        return request({
            url:'/permission/getMenu',
            method:'post',
            data:params,
        })
    },
    deleteUser(data) {
        return request({
            url: '/home/deleteUser',
            method: 'post',
            data,
        })
    },
    addUser(data) {
         return request({
          url: '/home/addUser',
          method: 'post',
          data,
        })
    },
  // 编辑用户（新增接口，Mock 中也要对应配置）
    updateUser(data) {
        return request({
         url: '/home/updateUser',
         method: 'post',
        data,
        })
    },
    getSearch(data) {
        return request({
         url: '/home/getSearch',
         method: 'post',
         data,
        })
    },
}