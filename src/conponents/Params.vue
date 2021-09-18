<template>
  <div class="Params">
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片-->
    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
<!--          联级选择器-->
          <el-cascader v-model="cascaderArr" :options="catelist"
                       expand-trigger="hover" :props="cascaderProp"
                        @change="cascaderChange"></el-cascader>
        </el-col>
      </el-row>
<!--      标签页-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
<!--        动态参数-->
        <el-tab-pane label="动态参数" name="many"></el-tab-pane>
<!--        静态参数-->
        <el-tab-pane label="静态参数" name="only"></el-tab-pane>
      </el-tabs>
<!--      添加按钮-->
      <el-button size="medium" type="primary" :disabled="disabled" @click="addDialogVisible = true">添加{{byAttribute.Attr}}</el-button>
<!--      表格-->
      <el-table :data="attributes" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="deleteTag(i, scope.row)">{{item}}</el-tag>
            <!-- 输入的文本框 -->
            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
            </el-input>
            <!-- 添加按钮 -->
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="attr_name" :label="byAttribute.Attr+'名称'" ></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateFromShow(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="open(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      添加对话框-->
      <el-dialog :title="'添加' + byAttribute.state + byAttribute.Attr" :visible.sync="addDialogVisible" width="50%" @close="addFromClose">
        <el-form :model="addForm" :rules="addFromrules" ref="addFormRef" label-width="100px" >
          <el-form-item :label=" byAttribute.state + byAttribute.Attr" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addfromsub">确 定</el-button>
        </span>
      </el-dialog>
      <!--      修改对话框-->
      <el-dialog :title="'修改' + byAttribute.state + byAttribute.Attr" :visible.sync="updateDialogVisible" width="50%" @close="updateFromClose">
        <el-form :model="updateFormold" :rules="updateFromrules" ref="updateFormRef" label-width="100px" >
          <el-form-item :label=" byAttribute.state + byAttribute.Attr" prop="attr_name">
            <el-input v-model="updateFormold.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updatefromsub">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getCategories, getAttributes, addAttributes,
  updateAttributes, deleteAttributes
} from '../api/index'
export default {
  name: 'Params',
  data () {
    return {
      queryInfo: {
        type: '',
        pagenum: '',
        pagesize: ''
      },
      catelist: [],
      // 联级选择器双向绑定的数据
      cascaderArr: [],
      cascaderProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      // 获取到的参数
      attributes: [],
      // 添加对话框的显示与隐藏
      addDialogVisible: false,
      // 点击按钮是否可以点击
      disabled: true,
      addForm: {
        attr_name: '',
        attr_sel: ''
      },
      addFromrules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      // 修改对话框的显示与隐藏
      updateDialogVisible: false,
      // 点击按钮是否可以点击
      updateFormold: {
        attr_name: ''
      },
      updateForm: {},
      updateFromrules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getCate () {
      getCategories(this.queryInfo)
        .then(data => {
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
          // console.log(data)
          this.catelist = data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 联机选择器焦点发生变化
    cascaderChange () {
      // console.log(this.cascaderArr)
      // 判断选中的是不是三级节点
      if (this.cascaderArr.length !== 3) {
        this.disabled = true
        this.cascaderArr = []
        return
      }
      //  选中的是三级节点
      this.disabled = false
      this.getAttribute()
    },
    // 获取属性的方法
    async getAttribute () {
      const path = `categories/${this.byId}/attributes`
      await getAttributes(path, { sel: this.activeName })
        .then(data => {
          if (data.meta.status !== 200) return this.$message.error('你可能选的不是三级分类')
          // console.log(data)
          this.attributes = data.data
          this.attributes.forEach((item) => {
            // console.log(value.attr_vals)
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 控制文本框的显示与隐藏
            item.inputVisible = false
            // 文本框中输入的值
            item.inputValue = ''
          })
          // console.log(this.attributes)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 监听标签页的切换
    handleClick () {
      this.getAttribute()
      // console.log(this.activeName)
    },
    // 清空添加表单数据
    addFromClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加属性提交
    addfromsub () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return this.$message.error('请输入合法属性！')
        const path = `categories/${this.byId}/attributes`
        this.addForm.attr_sel = this.activeName
        addAttributes(path, this.addForm)
          .then(data => {
            if (data.meta.status !== 201) return this.$message.error(data.meta.msg)
            this.$message.success(data.meta.msg)
            this.getAttribute()
          })
          .catch(err => {
            console.log(err)
          })
        this.addDialogVisible = false
      })
    },
    // 清空修改表单数据
    updateFromClose () {
      this.$refs.updateFormRef.resetFields()
    },
    updatefromsub () {
      this.$refs.updateFormRef.validate(valid => {
        if (!valid) return this.$message.error('请输入合法属性！')
        // alert('添加成功')
        const path = `categories/${this.byId}/attributes/${this.updateForm.attr_id}`
        updateAttributes(path,
          {
            attr_name: this.updateFormold.attr_name,
            attr_sel: this.activeName
          })
          .then(data => {
            if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
            this.$message.success(data.meta.msg)
            this.getAttribute()
          })
          .catch(err => {
            console.log(err)
          })
      })
      this.updateDialogVisible = false
    },
    // 点击显示修改对话框
    updateFromShow (row) {
      this.updateForm = row
      this.updateFormold.attr_name = row.attr_name
      this.updateDialogVisible = true
    },
    // 删除弹出
    async open (row) {
      const confirmResult = await this.$confirm('您确定要永远删除这个属性吗？', '删除属性', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const path = `categories/${this.byId}/attributes/${row.attr_id}`
      deleteAttributes(path)
        .then(data => {
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
          this.$message.success(data.meta.msg)
          this.getAttribute()
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 文本框失去焦点，或摁下了 Enter 都会触发
    handleInputConfirm (row) {
      row.inputVisible = false
    },
    // 点击按钮，展示文本输入框
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      // this.$nextTick(() => {
      //   this.$refs.saveTagInput.$refs.input.focus()
      // })
    },
    deleteTag (i, row) {
      row.attr_vals.splice(i, 1)
      const path = `categories/${this.byId}/attributes/${row.attr_id}`
      updateAttributes(path,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        .then(data => {
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
          this.$message.success(data.meta.msg)
          this.getAttribute()
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created () {
    this.getCate()
  },
  computed: {
    byId () {
      if (this.cascaderArr.length === 3) {
        return this.cascaderArr[2]
      }
      return null
    },
    byAttribute () {
      if (this.activeName === 'only') {
        return {
          Attr: '属性',
          state: '静态'
        }
      }
      return {
        Attr: '参数',
        state: '动态'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-row{
  margin: 20px 0 ;
  el-col{
    span{
      font-size: 20px;
      font-weight: bold;
    }
  }
}
.el-tag{
  margin: 0 5px;
}
.input-new-tag{
  width: 120px;
}
</style>
