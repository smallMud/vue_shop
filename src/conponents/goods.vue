<template>
  <div class="goods">
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片-->
    <el-card>
      <el-row :gutter="20">
<!--        搜索宽-->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearInput">
            <el-button slot="append" icon="el-icon-search" @click="select"></el-button>
          </el-input>
        </el-col>
<!--        添加商品-->
        <el-col :span="4">
          <el-button type="primary" @click="addCate">添加商品</el-button>
        </el-col>
      </el-row>
<!--      表格-->
      <el-table :data="goods" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="120px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px"></el-table-column>
        <el-table-column label="操作" width="130px">
          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" size="mini"  icon="el-icon-delete"></el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { gitGoodlist } from '../api/index'
// 引入js
import { formartTime } from '../assets/js/tool'
export default {
  name: 'goods',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goods: [],
      total: 0
    }
  },
  methods: {
    getGoods () {
      gitGoodlist(this.queryInfo)
        .then(data => {
          if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
          // console.log(data)
          this.$message.success(data.meta.msg)
          data.data.goods.forEach(value => {
            value.add_time = formartTime(value.add_time)
          })
          this.total = data.data.total
          this.goods = data.data.goods
        })
    },
    select () {
      this.getGoods()
    },
    clearInput () {
      this.getGoods()
    },
    addCate () {
      this.$router.push('/goods/add')
    }
  },
  created () {
    this.getGoods()
  }
}
</script>

<style scoped lang="scss">

</style>
