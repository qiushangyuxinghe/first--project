import Mock from 'mockjs'

// 单例模式：保证全局只有一个List实例
class ListSingleton {
  constructor() {
    if (!ListSingleton.instance) {
      // 初始化200条数据
      this.List = []
      const initialCount = 200
      for (let i = 0; i < initialCount; i++) {
        this.List.push(Mock.mock({
          id: Mock.Random.guid(), // 唯一ID（字符串类型）
          name: Mock.Random.cname(),
          addr: Mock.mock('@county(true)'),
          'age|18-60': 1,
          birth: Mock.Random.date(),
          sex: Mock.Random.integer(0, 1) // 0-女，1-男
        }))
      }
      ListSingleton.instance = this
    }
    return ListSingleton.instance
  }

  // 获取当前列表
  getList() {
    return this.List
  }

  // 替换列表（用于新增/批量操作）
  setList(newList) {
    this.List = newList
    console.log('[单例] 列表已更新，新长度：', this.List.length)
    return this.List
  }

  // 删除指定ID的项
  deleteItem(id) {
    const originalLength = this.List.length
    // 强制字符串比较，避免类型问题
    this.List = this.List.filter(item => String(item.id) !== String(id))
    console.log(`[单例] 删除后
      长度：${this.List.length}（减少了${originalLength - this.List.length}条）`)
    return this.List
  }
}

// 导出单例实例（全局唯一）
export default new ListSingleton()
    