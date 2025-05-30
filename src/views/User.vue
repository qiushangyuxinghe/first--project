<template>
    <div class="user-header">
        <el-button type="primary">新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="请输入">
                <el-input placeholder="请输入用户名" v-model="formInline.keyWord"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
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
            <template #default>
                <el-button type="primary" size="small" @click="handleClick">
                编辑
                </el-button>
                <el-button type="danger" size="small">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination
        class="pager"
        background 
        layout="prev, pager, next" 
        size="small"
        :total="config.total" 
        :current-page="config.page"
        @current-change="handleChange"
        />
        <!-- <el-table-column fixed="right" label="Operations" min-width="120">
            <template #="scoped">
                <el-button type="primary" size="small" @click="handleClick">
                    编辑
                </el-button>
                <el-button type="danger" size="small" @click="handleDelete(scoped.row)">
                    删除
                </el-button>
            </template>
        </el-table-column> -->
    </div>
</template>

<script setup>
import {ref,getCurrentInstance,onMounted,reactive} from 'vue'
import {ElMessage,ElMessageBox} from 'element-plus'
const handleClick = () => {
  console.log('click')
}
const tableData = ref([])
const formInline = reactive({
    keyWord:''
})
const tableLabel = reactive([
    {
        prop:'name',
        label:'姓名'
    },
    {
        prop:'age',
        label:'年龄'
    },
    {
        prop:'sexLabel',
        label:'性别'
    },
    {
        prop:'birth',
        label:'出生日期',
        width:200
    },

    {
        prop:'addr',
        label:'地址',
        width:400
    },
])
const config = reactive({
    name:'',
    total:0,
    page:1
})

const handleChange = (page)=>{
    config.page = page
    getUserData()
}
const getUserData = async ()=>{
    let data = await proxy.$api.getUserData(config)
    tableData.value = data.list.map(item=>({
        ...item,
        sexLabel : item.sex === 1 ? '男' : '女'
    }))
    config.total = data.count
}

const handleSearch = ()=>{
    config.name = formInline.keyWord
    getUserData()
}
const {proxy}=getCurrentInstance()

// const handleDelete = (val)=>{
//     ElMessage.confirm('你确定要删除吗？').then(async ()=>{
//         await proxy.$api.deleteUser({id:val.id})
//         ElMessage({
//             showClose:true,
//             message:'删除成功',
//             type:'success'
//         })
//     })
// }
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
</style>