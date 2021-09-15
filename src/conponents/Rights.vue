<template>
  <div class="Rights">
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="list" border :stripe="true" style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == 0">低级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1">中级</el-tag>
            <el-tag type="warning" v-else>高级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRights } from '../api/index'
export default {
  name: 'Rights',
  data () {
    return {
      list: []
    }
  },
  created () {
    getRights('rights/list')
      .then(data => {
        // console.log(data)
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
        this.list = data.data
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style scoped>

</style>
