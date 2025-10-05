import listSingleton from './listSingleton' // 引入单例

// 解析URL参数工具函数
function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) return {}
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}

export default {
  // 获取用户列表（带分页和搜索）
  getUserList: config => {
    // 从请求中解析参数
    let { name = '', page = 1, limit = 10 } = param2Obj(config.url)
    try {
      const body = JSON.parse(config.body)
      name = body.name || name
      page = body.page || page
      limit = body.limit || limit
    } catch (e) {
      console.log('[getUserList] 非POST请求，使用URL参数')
    }

    // 从单例中获取数据并筛选
    let mockList = [...listSingleton.getList()]
    if (name) {
      mockList = mockList.filter(user => user.name.includes(name))
    }

    // 分页计算
    const start = (page - 1) * limit
    const end = page * limit
    const pageList = mockList.slice(start, end)
    return {
      code: 200,
      data: {
        list: pageList,
        count: listSingleton.getList().length // 从单例获取总条数
      }
    }
  },

  // 删除用户
  deleteUser: ({ id }) => {
    const newList = listSingleton.deleteItem(id)
    return {
      code: 200,
      message: '删除成功',
      data: newList
    }
  },

  // 供外部修改列表（如新增）
  setList: (newList) => {
    return listSingleton.setList(newList)
  }
}
    