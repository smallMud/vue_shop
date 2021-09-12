<template>
  <div class="user">
<!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    搜索-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="Users">
            <el-button slot="append" @click="Users">搜索</el-button>
          </el-input>
        </el-col>
        <el-col :span="3"><el-button type="primary" @click="dialogVisible = true">添加用户</el-button></el-col>
      </el-row>
      <!--    表格-->
      <el-table
        :data="userlist"
        :stripe="true"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            @change="userStatechanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180px">
          <template v-slot="sc">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updataFromShow(sc.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" @click="open(sc.row.id)" icon="el-icon-delete" size="mini"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
<!--      添加用户弹窗-->
      <el-dialog
        title="添加用户信息"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addformClose"
        >
        <el-form ref="addform" :rules="addFromRules" :model="addForm" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input show-password v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addFormValid">确 定</el-button>
        </span>
      </el-dialog>
<!--      修改用户弹窗-->
      <el-dialog
        title="添加用户信息"
        :visible.sync="updatafromShow"
        width="50%"
        @close="updataformClose"
      >
        <el-form ref="updatafromRef" :rules="updatafromRules" :model="updatafrom" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="updatafrom.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="updatafrom.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="updatafrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
    <el-button @click="updatafromShow = false">取 消</el-button>
    <el-button type="primary" @click="updataFormValid">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// deleteUser
import {
  getUsers, setUserInfo, addUser, getUser,
  updataUser, deleteUser
} from '../api'

export default {
  name: 'user',
  data () {
    // 自定义邮箱规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 自定义电规则
    var checkMoblie = (rule, value, cd) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cd()
      }
      return cd(new Error('请输入合法的电话号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      // 添加用户
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的规则
      addFromRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMoblie, trigger: 'blur' }
        ]
      },
      // 修改用户弹窗的状态
      updatafromShow: false,
      // 修改用户
      updatafrom: {},
      // 修改用户的规则
      updatafromRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMoblie, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.Users()
  },
  methods: {
    // 获取用户数据方法
    Users () {
      getUsers(this.queryInfo)
        .then((data) => {
          // console.log(data)
          if (data.meta.status !== 200) return this.$message.error('数据获取失败')
          this.userlist = data.data.users
          this.total = data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSizeChange (newval) {
      // console.log(newval)
      this.queryInfo.pagesize = newval
      this.Users()
    },
    handleCurrentChange (newval) {
      // console.log(newval)
      this.queryInfo.pagenum = newval
      this.Users()
    },
    userStatechanged (userinfo) {
      // console.log(userinfo)
      const url = `users/${userinfo.id}/state/${userinfo.mg_state}`
      setUserInfo(url)
        .then(data => {
          if (data.meta.status !== 200) return this.$message.error('更改状态失败')
          this.$message.success('更改状态成功！')
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 监听添加用户弹窗个关闭
    addformClose () {
      this.$refs.addform.resetFields()
    },
    // 添加用户表单的检验
    addFormValid () {
      this.$refs.addform.validate(valid => {
        // console.log(valid)
        const judge = this.userlist.forEach(value => {
          if (value.username === this.addForm.username) {
            this.$message.error('用户已存在')
            return false
          }
          return true
        })
        if (!judge && !valid) return
        addUser(this.addForm)
          .then(data => {
            if (data.meta.status !== 201) return this.$message.error('用户添加失败')
            this.dialogVisible = false
            this.$message.success('用户添加成功')
            this.Users()
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    // 修改用户信息获取数据
    updataFromShow (id) {
      const path = `users/${id}`
      getUser(path)
        .then(data => {
          if (data.meta.status !== 200) return
          this.updatafrom = data.data
          // console.log(this.updatafrom)
          this.updatafromShow = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 监听修改用户弹窗个关闭
    updataformClose () {
      this.$refs.updatafromRef.resetFields()
    },
    // 修改用户表单的检验
    updataFormValid () {
      this.$refs.updatafromRef.validate(valid => {
        // console.log(valid)
        if (!valid) return
        const path = `users/${this.updatafrom.id}`
        updataUser(path, { email: this.updatafrom.email, mobile: this.updatafrom.mobile })
          .then(data => {
            if (data.meta.status !== 200) return this.$message.error('修改失败')
            this.updatafromShow = false
            this.$message.success('修改成功')
            this.Users()
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    //  删除用户
    async open (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult === 'cancel') {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      if (confirmResult === 'confirm') {
        const path = `users/${id}`
        deleteUser(path)
          .then(data => {
            if (data.meta.status !== 200) return this.$message.error('删除用户失败')
            this.$message.success('删除用户成功')
            this.queryInfo.pagenum = 1
            this.Users()
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
