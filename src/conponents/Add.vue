<template>
  <div class="Add">
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片-->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :active="activeName - 0"  align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFromrules" label-position="top" ref="addFormRef" label-width="100px" class="add-from">
       <el-tabs tab-position="left" v-model="activeName" :before-leave="beforeLeave" @tab-click="tabClick">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_number">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_weight">
            <!--          联级选择器-->
            <el-cascader v-model="cascaderArr" :options="catelist"
                         expand-trigger="hover" :props="cascaderProp"
                         @change="cascaderChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="item in manyAttribute" :key="item.attr_id">
            <!-- 复选框组 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyAttribute" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture"
            :headers="headersObj">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
        </el-tab-pane>
       </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%">
      <img :src="previewPath" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getCategories, getAttributes, postGoodlist } from '../api'

export default {
  name: 'Add',
  data () {
    return {
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFromrules: {
        goods_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      catelist: [],
      // 联级选择器双向绑定的数据
      cascaderArr: [],
      cascaderProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 0,
      manyAttribute: [],
      onlyAttribute: [],
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      dialogVisible: false,
      previewPath: ''
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
    cascaderChange () {
      // 判断选中的是不是三级节点
      if (this.cascaderArr.length !== 3) {
        this.disabled = true
        this.cascaderArr = []
      }
      //  选中的是三级节点
    },
    beforeLeave (active, old) {
      if (old === '0' && this.cascaderArr.length !== 3) {
        this.$message.error('请选择第三级节点')
        return false
      }
      return true
    },
    tabClick () {
      if (this.activeName === '1') {
        const path = `categories/${this.cascaderArr[2]}/attributes`
        getAttributes(path, { sel: 'many' })
          .then(data => {
            if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
            data.data.forEach(item => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            })
            this.manyAttribute = data.data
            // console.log(this.getAttribute)
          })
          .catch(err => {
            console.log(err)
          })
      } else if (this.activeName === '2') {
        const path = `categories/${this.cascaderArr[2]}/attributes`
        getAttributes(path, { sel: 'only' })
          .then(data => {
            if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
            this.onlyAttribute = data.data
            // console.log(this.onlyAttribute)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    handlePreview (file) {
      // console.log(file)
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    handleRemove (file) {
      // console.log(file)
      const Url = file.response.data.tmp_path
      // console.log(file.response.data.tmp_path)
      const index = this.addForm.pics.findIndex(index => {
        if (index.pic === Url) return true
      })
      this.addForm.pics.splice(index, 1)
      // console.log(index)
    },
    handleSuccess (response) {
      // console.log(response)
      const info = { pic: response.data.tmp_path }
      this.addForm.pics.push(info)
    },
    add () {
      // console.log(this.addForm.goods_introduce)
      // console.log(this.cascaderArr)
      this.addForm.goods_cat = this.cascaderArr.join(',')
      // this.addForm.attrs = this.manyAttribute
      // console.log(this.manyAttribute)
      this.manyAttribute.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        }
        this.addForm.attrs.push(newInfo)
      })
      this.onlyAttribute.forEach(item => {
        // console.log(item)
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.addForm.attrs.push(newInfo)
      })
      if (this.addForm.goods_name === '') {
        return this.$message.error('请输入合法数据')
      }
      postGoodlist(this.addForm)
        .then(data => {
          if (data.meta.status !== 201) return this.$message.error(data.meta.msg)
          // console.log(data)
          this.$message.success(data.meta.msg)
          this.$router.push('/goods')
        })
        .catch(err => {
          console.log(err)
        })
      // console.log(this.addForm)
    }
  },
  created () {
    this.getCate()
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.el-steps{
  margin: 15px 0 ;
}
.el-tabs{
  min-height: 550px;
}
.el-checkbox{
  margin-right: 10px;
}
.el-dialog{
  img{
    width: 100%;
    height: 100%;
  }
}

.addBtn{
  margin-top: 15px;
}
</style>
