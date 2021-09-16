<template>
  <div class="Categories">
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片-->
    <el-card class="box-card">
      <el-button type="primary" @click="addCatedialogShow">添加分类</el-button>
<!--      表格-->
      <tree-table
        ref="tableRef"
        index-text="#"
        :data="cateLise"
        :columns="columns"
        show-index
        :show-row-hover="false"
        border
        :selection-type = 'false'
        :expand-type = 'false'
        >
<!--        是否有效-->
        <template slot='isok' slot-scope="scope">
          <i style="color : green" class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i style="color : red" class="el-icon-error" v-else></i>
        </template>
<!--        排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
<!--        操作-->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
<!--      底部分页器-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
<!--    对话框-->
    <el-dialog title="添加商品分类" :visible.sync="addCatedialogVisible" width="50%" @close="addCateDialogClosed">
<!--      表单开始-->
      <el-form :model="addCateForm" :rules="addCateFormRules"  ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类名称：">
<!--          联级选择器-->
          <el-cascader expand-trigger="hover" :options="parentCateList"
                       :props="cascaderProps" v-model="selectedKeys"
                       clearable change-on-select @change = 'addSelectId'>
          </el-cascader>
        </el-form-item>
      </el-form>
<!--      表单结束-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategories, addCategories } from '../api/index'
export default {
  name: 'Categories',
  data () {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      cateLise: [],
      // 为table指定数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      // 对话框的显示与隐藏
      addCatedialogVisible: false,
      // 父级分类的列表
      parentCateList: [],
      // 添加分类请求参数
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 匹配规则
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {
    // 获取商品分类
    getCateList () {
      getCategories(this.querInfo)
        .then(data => {
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
          this.cateLise = data.data.result
          // console.log(this.cateLise)
          this.total = data.data.total
          // this.$message.success(data.meta.msg)
        }).catch(err => {
          console.log(err)
        })
    },
    // 分页器配置
    handleSizeChange (val) {
      this.querInfo.pagesize = val
      this.getCateList()
    },
    handleCurrentChange (val) {
      this.querInfo.pagenum = val
      this.getCateList()
    },
    // 对话框的显示
    async addCatedialogShow () {
      await getCategories({ type: 2 })
        .then(data => {
          // console.log(data)
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
          this.parentCateList = data.data
        }).catch(err => {
          console.log(err)
        })
      this.addCatedialogVisible = true
    },
    // 当选中节点变化时触发获取id
    addSelectId () {
      this.addCateForm.cat_level = this.selectedKeys.length
      this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
    },
    // 提交按钮点击
    addCate () {
      // console.log(this.addCateForm)
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('添加失败')
        }
        addCategories(this.addCateForm)
          .then(data => {
            if (data.meta.status !== 201) return this.$message.error(data.meta.msg)
            this.$message.success(data.meta.msg)
            this.getCateList()
          }).catch(err => {
            console.log(err)
          })
        this.addCatedialogVisible = false
      })
    },
    // 表单关闭
    addCateDialogClosed () {
      console.log(1)
      this.$refs.addFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style scoped lang="scss">
.el-button{
  margin-bottom: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
