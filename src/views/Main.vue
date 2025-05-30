<template>
    <div class="common-lay">
        <el-container class="lay-contain">
            <!-- 左侧自定义组件 -->
            <commonAside></commonAside>
             <el-container>
                <el-header class="el-head">
                <CommonHead></CommonHead>
                </el-header>
                <CommonTab></CommonTab>
                <el-main class="right-main">
                    <router-view></router-view>
                </el-main>
             </el-container>
        </el-container>
    </div>
</template>

<script setup>
import CommonAside from '@/components/CommonAside.vue'
import CommonHead from '@/components/CommonHeader.vue'
import CommonTab from '@/components/CommonTab.vue';
</script>

<style scoped lang="less">
.common-lay, .lay-contain{
    height:100%;
}
.el-head {
    background-color: #333;
}
</style>
