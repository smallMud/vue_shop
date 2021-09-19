<template>
  <div class="Order">
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图-->
    <el-card>
<!--      搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="select">
            <el-button slot="append" icon="el-icon-search" @click="select"></el-button>
          </el-input>
        </el-col>
      </el-row>
<!--      表格区域-->
      <el-table :data="Orderlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot="scopre">
            <el-button type="success" size="mini" plain  v-if="scopre.row.pay_status !== '0'">已付款</el-button>
            <el-button type="danger" size="mini" plain  v-else>未付款</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否付款"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot="scopre">
            {{scopre.row.create_time | formartTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="updataDialog = true"></el-button>
          <el-button type="success" size="mini" icon="el-icon-location" @click="progress" ></el-button>
        </el-table-column>
      </el-table>
<!--      分页器-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagesize"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
<!--    修改对话框-->
    <el-dialog title="修改地址" :visible.sync="updataDialog" width="50%">
      <el-form :model="locat" :rules="rules" ref="updateForm" label-width="100px">
        <el-form-item label="省市区/县" prop="cascaderArr">
          <el-cascader expand-trigger="hover" v-model="locat.cascaderArr"  :options="citydata" :props="cascaderProp"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="location">
          <el-input v-model="locat.location"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="updataDialog = false">取 消</el-button>
    <el-button type="primary" @click="updateSub">确 定</el-button>
      </span>
    </el-dialog>
<!--    物流表单-->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">

    </el-dialog>
  </div>
</template>

<script>
import { getOrders } from '../api/index'
import citydata from '../assets/js/citydata'
export default {
  name: 'Order',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      Orderlist: [],
      updataDialog: false,
      citydata,
      cascaderProp: {
        value: 'value',
        label: 'label', // 显示值
        children: 'children' // 指定选项的子选项为选项对象的某个属性值
      },
      locat: {
        cascaderArr: [],
        location: ''
      },
      rules: {
        cascaderArr: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      progressVisible: false
    }
  },
  methods: {
    getorder () {
      getOrders(this.queryInfo)
        .then(data => {
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
          // console.log(data)
          this.total = data.data.total
          this.Orderlist = data.data.goods
          this.$message.success(data.meta.msg)
        })
    },
    select () {
      this.getorder()
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getorder()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getorder()
    },
    updateSub () {
      this.$refs.updateForm.validate(valid => {
        if (!valid) return this.$message.error('请输入省市区/县或详细地址')
        this.$message.success('修改成功！')
        this.updataDialog = false
      })
    },
    async progress () {
      this.progressVisible = true
    }
  },
  created () {
    this.getorder()
  }
}
</script>

<style scoped>

</style>
