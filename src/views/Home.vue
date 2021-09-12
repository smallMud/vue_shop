<template>
  <el-container class="home">
    <el-header>
        <div class="left">
          <img src="../assets/images/logo.png" alt="">
          <span>后台管理平台</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
    <el-container>
      <el-aside :width="isShow ? '64px' : '200px'">
<!--        左侧内容开始-->
<!--        折叠按钮-->
        <div class="aside-btn" @click="setShow">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isShow"
          router
          :collapse-transition="false"
          :default-active="activePath">
<!--          一个导航栏-->
          <el-submenu :index="value.path" v-for="value in menus" :key="value.id">
<!--            一级导航栏-->
            <template slot="title">
              <i :class="iconsObj[value.id]"></i>
              <span>{{value.authName}}</span>
            </template>
<!--            二级导航栏-->
            <el-menu-item :index="'/' + item.path" @click="saveNavState('/' + item.path)" v-for="item in value.children" :key="item.id">
              <i class="el-icon-menu"></i>
              <span>{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!--        左侧内容end-->
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenus } from '../api/index'
export default {
  name: 'Home',
  data () {
    return {
      menus: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      activePath: '',
      isShow: false
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    saveNavState (path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    setShow () {
      this.isShow = !this.isShow
    }
  },
  created () {
    getMenus()
      .then((data) => {
        // console.log(data)
        if (data.meta.status === 200) {
          this.menus = data.data
        } else {
          this.$message.error(data.meta.msg)
        }
      })
      .catch((err) => {
        console.log(err)
      })
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style scoped lang="scss">
.home{
  height: 100%;
  user-select: none;
  .el-header{
    width: 100%;
    background-color: #373d41;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left{
      display: flex;
      justify-content: left;
      position: relative;
      align-items: center;
      img{
        width: 45px;
        height: 45px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      span{
        margin-left: 75px;
        color: #fff;
        font-size: 20px;
      }
    }

  }
  .el-aside{
    background-color: #333744;
    transition: all 0.2s linear;
    .iconfont {
      margin-right: 10px;
    }
    .aside-btn{
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu{
      border-right: none;
    }
  }
}
</style>
