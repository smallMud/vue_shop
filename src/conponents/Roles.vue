<template>
  <div class="Roles">
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="list" border :stripe="true" style="width: 100%">
        <el-table-column  type="expand" >
          <template v-slot="scope">
            <el-row :gutter="20" :class="['bdbottom', index1 !== 0 ? '' : 'bdtop','vcenter']" v-for="(item1 , index1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[index2 === 0 ? '' : 'bdtop','vcenter']" v-for="(item2 , index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRight(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
            <template v-slot="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRight">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightDialog(scope.row.id)">分配权限</el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="closeRightDialog">
        <div class="tree">
          <el-tree
            default-expand-all :default-checked-keys="defKeys" show-checkbox :data="tree" :props="treeProps" node-key="id" ref="treeRef"></el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSetRoleRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getRoles, deleteRigth, getRoleRights, setRoleRights } from '../api/index'

export default {
  name: 'Roles',
  data () {
    return {
      list: [],
      tree: [],
      roleId: '',
      defKeys: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      dialogVisible: false
    }
  },
  created () {
    getRoles()
      .then(data => {
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
        this.list = data.data
        // console.log(this.list)
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    getLeafKeys (node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    async removeRight (role, right) {
      console.log(111)
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      // console.log('ok')
      const path = `roles/${role.id}/rights/${right}`
      deleteRigth(path)
        .then(data => {
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
          this.$message.success(data.meta.msg)
          role.children = data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    showRightDialog (id) {
      this.dialogVisible = true
      this.roleId = id
      getRoleRights('rights/tree')
        .then(data => {
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
          this.tree = data.data
          // console.log(this.tree)
        })
        .catch(err => {
          console.log(err)
        })
      this.list.forEach(value => {
        if (value.id === id) {
          // console.log(value)
          this.getLeafKeys(value, this.defKeys)
        }
      })
      // console.log(this.defKeys)
    },
    closeRightDialog () {
      this.defKeys = []
    },
    onSetRoleRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      // console.log(this.roleId)
      const path = `roles/${this.roleId}/rights`
      setRoleRights(path, { rids: idStr })
        .then(data => {
          if (data.meta.status !== 200) {
            return this.$message.error('分配权限失败！')
          }

          this.$message.success('分配权限成功！')
          this.showRightDialog()
          this.dialogVisible = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
.tree{
  width: 100%;
  height: 300px;
  overflow: auto;
}
</style>
