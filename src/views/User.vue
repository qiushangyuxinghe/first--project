<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input placeholder="请输入用户名" v-model="formInline.keyWord"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getSearch">搜索</el-button>
                 <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column 
            v-for="item in tableLabel"
            :key="item.prop"
            :width="item.width ? item.width : 125"
            :prop="item.prop"
            :label="item.label" 
            />
            <el-table-column fixed="right" label="Operations" min-width="120">
            <template #default="scope">
                <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                编辑
                </el-button>
                <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination
        class="pager"
        background="true"
        layout="prev, pager, next, jumper" 
        size="small"
        :total="config.total" 
        :current-page="config.page"
        :page-size="config.limit"
        @current-change="handleChange"
        />
    </div>
  <el-dialog 
    v-model="show"
    :title="dialogTitle"
    width="500px"
    align-center
     class="custom-dialog"
  >
    <el-form
    ref="ruleFormRef"
    style="max-width: 600px ; margin: 0 auto;"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
     class="custom-form"
  >
    <el-form-item label="姓名:" prop="username"  class="form-item">
      <el-input placeholder="请输入你的名字" type="text" autocomplete="off" v-model="ruleForm.username"/>
    </el-form-item>
    <el-form-item label="年龄:" prop="userage"  class="form-item">
      <el-input placeholder="请输入你的年龄" type="number" autocomplete="off" v-model="ruleForm.userage"  @input="() => ruleFormRef.value?.clearValidate('userage')" @change="val => ruleForm.userage = Number(val)"/>
    </el-form-item>
    <el-form-item label="性别:" prop="usersex"  class="form-item">
      <el-select v-model="ruleForm.usersex" placeholder="请选择性别" class="custom-select">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="出生日期:" prop="userbirthday"  class="form-item">
      <el-date-picker placeholder="选择出生日期" autocomplete="off" v-model="ruleForm.userbirthday" value-format="YYYY-MM-DD"  type="date"/>
    </el-form-item>
    <el-form-item label="地址:" prop="useradress"  class="form-item">
      <el-input placeholder="请输入你的地址" type="text" autocomplete="off" v-model="ruleForm.useradress"/>
    </el-form-item>
  </el-form>
    <div class="button-container">
    <el-form-item class="create-body">
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        提交
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">全部重填</el-button>
    </el-form-item>
    </div>
  </el-dialog>
</template>

<script setup>
import {ref,getCurrentInstance,onMounted,reactive} from 'vue'
import {ElMessage,ElMessageBox} from 'element-plus'

const tableData = ref([])
const formInline = reactive({
    keyWord:''
})
const tableLabel = reactive([
    { prop:'name', label:'姓名' },
    { prop:'age', label:'年龄' },
    { prop:'sexLabel', label:'性别' },
    { prop:'birth', label:'出生日期', width:200 },
    { prop:'addr', label:'地址', width:400 },
])
const config = reactive({
    total:0,
    page:1,
    limit:10,
})
const ruleForm = reactive({
  username: '',
  userage:null,
  usersex: '',
  userbirthday: '',
  useradress: ''
})
const dialogTitle = ref('新增信息')
const rules = reactive({
  username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  userage: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '年龄必须为数字', trigger: 'blur' }
  ],
  usersex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  userbirthday: [{ required: true, message: '请输入出生日期', trigger: 'blur' }],
  useradress: [{ required: true, message: '请输入地址', trigger: 'blur' }]
})

let show = ref(false)
const currentEditId = ref(null);
const ruleFormRef = ref(null)
const {proxy}=getCurrentInstance()

// 统一的数据转换函数
const transformUserData = (dataArray) => {
    return dataArray.map(item => ({
        ...item,
        sexLabel: item.sex === 1 ? '男' : '女',
        name: item.username || item.name,
        age: item.age,
        birth: item.birthday || item.birth,
        addr: item.address || item.addr,
        status: item.status || 0,
    }))
}

// 分页处理
const handleChange = (page) => {
    config.page = page
    console.log('分页切换 - 目标页:', page)
    getUserData()
}

// 搜索函数
const getSearch = async() => {
    config.page = 1  // 搜索时重置到第一页
    getUserData()
}

// 统一的获取数据函数
const getUserData = async () => {
    try {
        const params = {
            page: config.page,
            limit: config.limit,
            name: formInline.keyWord || ''  // 搜索关键词
        }
        
        console.log('请求参数:', params)
        const data = await proxy.$api.getUserData(params)
        console.log('响应数据:', data)
        
        if (data && data.list) {
            const activeUsers = data.list.filter(item => item.status === 0 || item.status === undefined)
            tableData.value = transformUserData(activeUsers)
            config.total = data.count 
            console.log('分页信息 - 总数:', config.total, '当前页:', config.page)
            // 如果当前页没有有效数据且不是第一页，自动跳转到上一页
            if (activeUsers.length === 0 && config.page > 1) {
                console.log('当前页无有效数据，跳转到上一页')
                config.page -= 1
                getUserData() // 重新获取
                return
            }

        } else {
            console.error('返回数据格式错误:', data)
            tableData.value = []
            config.total = 0
        }
        
    } catch (err) {
        console.error('获取数据失败：', err)
        ElMessage.error('获取数据失败，请重试')
    }
}

// 编辑操作
const handleEdit = (row) => {
    resetForm(ruleFormRef.value)
    dialogTitle.value = '编辑信息'
    currentEditId.value = row.id
    ruleForm.username = row.name
    ruleForm.userage = Number(row.age)
    ruleForm.usersex = row.sex === 1 ? '男' : '女'
    ruleForm.userbirthday = row.birth
    ruleForm.useradress = row.addr
    show.value = true
}

// 删除操作
const handleDelete = (row) => {
    ElMessageBox.confirm('你确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
    }).then(async () => {
        try {
            await proxy.$api.deleteUser({id:row.id})
            ElMessage.success('删除成功')
            getUserData()
        } catch (error) {
            ElMessage.error('删除失败，请重试')
            console.error('删除失败', error)
        }
    }).catch(() => {
        ElMessage.info('已取消删除')
    });
};

// 提交表单
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      const formData = {
        name: ruleForm.username,
        age: ruleForm.userage,
        sex: ruleForm.usersex === '男' ? 1 : 0,
        birth: ruleForm.userbirthday,
        addr: ruleForm.useradress
      }
      try {
        if (currentEditId.value) {
          formData.id = currentEditId.value
          await proxy.$api.updateUser(formData)
          ElMessage.success('修改成功')
        } else {
          await proxy.$api.addUser(formData)
          ElMessage.success('新增成功')
        }
        
        show.value = false
        resetForm(formEl)
        getUserData() // 刷新数据
        
      } catch (error) {
        console.error('操作失败：', error)
        ElMessage.error(currentEditId.value ? '修改失败' : '新增失败')
      }
    } else {
      ElMessage.error('表单验证失败')
    }
  })
}

// 重置表单
const resetForm = (formEl) => {
    if (formEl) {
        formEl.resetFields()
    }
    ruleForm.username = ''
    ruleForm.userage = null
    ruleForm.usersex = ''
    ruleForm.userbirthday = ''
    ruleForm.useradress = ''
}

// 新增信息
const handleAdd = () => {
  resetForm(ruleFormRef.value)
  dialogTitle.value = "新增信息"
  currentEditId.value = null
  show.value = true
}
// 重置搜索
const handleReset = () => {
    formInline.keyWord = ''
    config.page = 1
    getUserData()
}
onMounted(()=>{
   getUserData()
})
</script>

<style scoped lang="less">
.user-header{
    display:flex;
    justify-content: space-between;
}
.table{
    position: relative;
    height:520px;
    .pager{
        position: absolute;
        right:600px;
        bottom:30px;
    }
    .el-table{
        width:100%;
        height:500px;
    }
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
}

.create-body {
  display: flex;
  gap: 10px;
}

// 删除按钮样式优化
.delete-btn {
  margin-left: 10px;
  background-color: #f56c6c !important;
  border-color: #f56c6c !important;
}

// 解决样式穿透问题
// 删除按钮样式（直接作用于当前组件的按钮，scoped有效）
.delete-btn {
  margin-left: 10px;
}

// 自定义类名样式（通过父级类名限制作用域，避免scoped穿透问题）

.custom-form {
  max-width: 600px;
  margin: 0 auto;
}
.form-item {
  margin-bottom: 15px;
}
.custom-select {
  width: 100%;
}
</style>