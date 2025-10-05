import Mock from "mockjs"
import homeApi from './mockData/home'
import userApi from './mockData/user'
import menuApi from './mockData/permission'
import listSingleton from './mockData/listSingleton' // 引入单例

// 首页数据接口
Mock.mock('http://127.0.0.1:3002/home/getTableData', "get", homeApi.getTableData)
Mock.mock('http://127.0.0.1:3002/home/getCountData', "get", homeApi.getCountData)
Mock.mock('http://127.0.0.1:3002/home/getChartData', 'get', homeApi.getChartData)

// // 用户列表接口
// Mock.mock('/api/home/getUserData', 'post', userApi.getUserList)

// // 新增用户接口
// Mock.mock('/api/home/addUser', 'post', config => {
//   try {
//     const data = JSON.parse(config.body)
//     // 补充必要字段（与初始化数据格式一致）
//     data.id = Mock.Random.guid() // 生成唯一ID
//     // 从单例获取当前列表并添加新数据
//     const currentList = listSingleton.getList()
//     const newList = [...currentList, data]
//     listSingleton.setList(newList) // 更新单例中的列表
//     return {
//       code: 200,
//       message: '新增成功',
//       data: {
//         data: {
//           ...data,
//           total: newList.length // 返回最新总条数
//         }
//       }
//     }
//   } catch (error) {
//     return {
//       code: 500,
//       message: '新增失败：' + error.message
//     }
//   }
// })

// // 编辑用户接口
// Mock.mock('/api/home/updateUser', 'post', config => {
//   const data = JSON.parse(config.body)
//   const currentList = listSingleton.getList()
//   const index = currentList.findIndex(item => item.id === data.id)
  
//   if (index !== -1) {
//     currentList.splice(index, 1, data)
//     listSingleton.setList(currentList) // 更新单例
//     return {
//       code: 200,
//       message: '编辑成功',
//       data: { data }
//     }
//   }
//   return {
//     code: 500,
//     message: '用户不存在'
//   }
// })

// // 删除用户接口
// Mock.mock('/api/home/deleteUser', 'post', config => {
//   const { id } = JSON.parse(config.body)
//   return userApi.deleteUser({ id })
// })

// 权限接口
Mock.mock('http://127.0.0.1:3002/permission/getMenu', 'post', menuApi.getMenu)
    