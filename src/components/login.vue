<template>
    <el-container id="login">
      <el-header style="border-bottom: 1px solid rgba(255, 255, 255, 0.5);color: #ECECEC">
        <img src="../assets/logo.png" style="float: left;display: inline-block;height: 30px;margin: 15px 10px 15px 0">
        <p style="display: inline-block;line-height: 30px;height: 30px;float: left;font-size: 16px">
          <strong>物滴新能源车风控系统</strong>
        </p>
      </el-header>
      <el-main style="width: 70%;height: 100%;margin: auto;overflow: hidden">
        <el-row id="content">
          <el-col :span="12" class="bannerDiv">
            <p style="font-size: 2rem"><strong>物华天宝&nbsp;&nbsp;滴翠如珠</strong></p>
          <p>
            以己之美、成人之美、互利互惠、美美与共
          </p>
          </el-col>
          <el-col :span="12" class="loginDiv">
            <el-card :body-style="{ padding: '0px' }" class="box-card">
              <div slot="header">
                <span style="font-size: 1.2em">用户登录</span>
              </div>
              <el-form class="loginForm" ref="formInline" size="medium" @keyup.enter.native='onSubmit' :model="formInline" :rules="rules" >
                <el-form-item prop="username">
                  <el-input placeholder="请输入用户名" v-model="formInline.name"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" placeholder="请输入密码" v-model="formInline.password"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-row>
                    <el-col :span="14">
                      <el-input placeholder="请输入验证码" type="sms" v-model="formInline.captcha"></el-input>
                    </el-col>
                    <el-col :span="10">
                      <img :src="randomCode" alt="点击重试" style="margin: 0 5px;height: 36px;cursor: pointer" @click="getRandomCode" />
                    </el-col>
                  </el-row>
                </el-form-item>
                <div style="text-align: center">
                  <el-button style="width: 70%;margin: 0 auto" type="primary" @click="onSubmit"  :loading="isLogin">登录</el-button>
                </div>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      formInline: {
        name: '',
        password: '',
        captcha: '',
        uuid: ''
      },
      randomCode: '',
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      isLogin: false
    }
  },
  methods: {
    init () {
      let _this = this
      _this.getRandomCode()
    },
    s4 () {
      let s4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      return s4
    },
    getRandomCode () {
      let _this = this
      let uuid = (_this.s4() + _this.s4() + '-' + _this.s4() + '-' + _this.s4() + '-' + _this.s4() + '-' + _this.s4() + _this.s4() + _this.s4())
      console.log(uuid)
      _this.formInline.uuid = uuid
      this.$http({
        url: '/api/ps/captcha.jpg',
        method: 'get',
        params: {
          uuid: uuid
        },
        responseType: 'arraybuffer'
      }).then(response => {
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
      }).then(data => {
        _this.randomCode = data
      })
        .catch(function () {
        })
    },
    onSubmit () {
      let _this = this
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          _this.isLogin = true
          this.$http({
            method: 'post',
            url: '/api/admin/sys/login',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            },
            data: _this.formInline
          })
            .then(function (response) {
              _this.isLogin = false
              if (response.data.code === 0) {
                sessionStorage.setItem('userName', response.data.data.userName)
                sessionStorage.setItem('firstLoginTag', response.data.data.firstLoginTag)
                sessionStorage.setItem('roleName', response.data.data.roleName)
                sessionStorage.setItem('menuList', JSON.stringify(response.data.data.menuList))
                response.data.data.firstLoginTag === 0 ? sessionStorage.setItem('changePwdFormVisible', 'true') : sessionStorage.setItem('changePwdFormVisible', 'false')
                if (sessionStorage.getItem('roleName') === 'ROLE_sysadmin') {
                  _this.$router.push('/home/user')
                } else if (sessionStorage.getItem('roleName') === 'ROLE_bumaster') {
                  _this.$router.push('/home/operationInfo')
                } else if (sessionStorage.getItem('roleName') === 'ROLE_burisker') {
                  _this.$router.push('/home/workspace')
                }
              } else if (response.data.code === 500) {
                _this.$message({
                  message: '验证码已失效',
                  type: response.data.code === 0 ? 'success' : 'error',
                  duration: 2000
                })
                _this.getRandomCode()
              } else {
                _this.$message({
                  message: response.data.msg,
                  type: response.data.code === 0 ? 'success' : 'error',
                  duration: 2000
                })
              }
            })
            .catch(function () {
              _this.isLogin = false
              // console.log(err)
            })
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.init()
    })
  }
}
</script>

<style scoped>
  #login{
    width: 100%;
    height: 100%;
    background: url("../assets/bg.jpg") no-repeat;
    background-size: cover;
  }
  #content {
    margin-top: 10%;
  }
  .loginDiv{
    float: right;
    position: absolute;
    right: 0;
    max-width: 360px;
  }
  .bannerDiv{
    color: #ECECEC;
    text-align: right;
    float: left;
    width: 35%;
    margin: auto 5% 0 15%;
  }
  .loginForm{
    background-color: #ffffff;
    padding: 25px;
  }
</style>
