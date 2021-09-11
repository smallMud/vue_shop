<template>
  <div class="Login">
      <div class="login-box">
<!--         设置登入界面logo-->
          <div class="logo-box">
            <img src="../assets/images/logo.png" alt="">
          </div>
<!--        设置form表单-->
        <el-form label-width="0px" ref="loginform" :model="loginfrom" :rules="loginFormRules" class="login-form">
          <el-form-item prop="username">
            <el-input v-model="loginfrom.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginfrom.password" prefix-icon="iconfont icon-3702mima" show-password></el-input>
          </el-form-item>
          <el-form-item class="login-btn">
            <el-button type="primary" @click="login">登入</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
import { getLogin } from '../api/index'
export default {
  name: 'Login',
  data () {
    return {
      loginfrom: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置方法
    reset () {
      this.$refs.loginform.resetFields()
      this.loginfrom.username = ''
      this.loginfrom.password = ''
    },
    // 获取登入状态
    login () {
      this.$refs.loginform.validate((valid) => {
        if (!valid) return
        getLogin(this.loginfrom)
          .then((data) => {
            // console.log(data)
            if (data.meta.status === 200) {
              this.$message.success('恭喜你！登入成功')
              window.sessionStorage.setItem('token', data.data.token)
              this.$router.push('/home')
            } else {
              this.$message.error('请确认账号密码是否正确！')
            }
          })
          .catch((err) => {
            console.log(err)
          })
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/css/mixin";
.Login{
  height: 100%;
  width: 100%;
  background-color: #2b4b6b;
  position: relative;
  .login-box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    @include center();
    .logo-box{
      width: 130px;
      height: 130px;
      border: 1px solid #eeeeee;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 0 10px  #ddd;
      position: absolute;
      @include hCenter();
      top: -65px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .login-form{
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .login-btn{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
