<template>
  <div>
    <div style="width: 200px;line-height: 60px">
      <img src="../../../static/logo.png" style="float: left;display: inline-block;height: 30px;margin: 15px 10px 15px 0">
      <p style="display: inline-block;line-height: 30px;height: 30px;float: left;font-size: 16px">
        {{ title }}
      </p>
    </div>
    <div style="min-width: 800px;margin: 0;">
      <div style="float: left;margin-left: 30px">
        <el-button type="text" @click="navCollapse">hahahah</el-button>
        <el-button type="text" @click="refresh">刷新</el-button>
      </div>
      <div style="float: right">
        <el-dropdown style="cursor: pointer">
          <span class="el-dropdown-link" style="color: #ffffff;">
          <span class="iconfont icon-wo"></span>
          <span>{{ userInfo.username }}</span>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="changePwdFormVisible = true">
                <span class="iconfont icon-mima"></span>
                <span>修改密码</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <div @click="logout">
                <span class="iconfont icon-tuichu3"></span>
                <span>安全退出</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!--<p style="z-index: 9999;font-size: 0.6rem;display: inline-block;margin: 0"> &lt;!&ndash;@mouseenter="onMouseEnter" @mouseleave="onMouseLeave" &ndash;&gt;-->
        <!--<span class="iconfont icon-wo"></span>-->
        <!--<span style="color: #ffffff;">当前用户：{{ userInfo.username }}</span>-->
      <!--</p>-->
    </div>
    <el-dialog
      :append-to-body="true"
      title="修改密码"
      :visible.sync="changePwdFormVisible">
      <el-alert
        title="首次登陆请修改密码"
        type="warning"
        :closable='false'
        v-if="firstLoginTag === '0'"
        show-icon>
      </el-alert>
      <el-form :model="formInline" ref="formInline" :rules="rules" label-width="150px">
        <el-form-item label="旧密码" prop="password">
          <el-input type="password" v-model="formInline.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="formInline.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码" prop="newRePwd">
          <el-input type="password" v-model="formInline.newRePwd" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changePwdFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePwd('formInline')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'header-container',
  data () {
    let newRePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.formInline.newPassword) {
        callback(new Error('两次输入新密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      title: '物滴Cloud',
      formInline: {
        password: '',
        newPassword: '',
        newRePwd: ''
      },
      show: false,
      rules: {
        password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        newRePwd: [
          { required: true, validator: newRePwd, trigger: 'blur' }
        ]
      },
      userInfo: {},
      firstLoginTag: sessionStorage.getItem('firstLoginTag'),
      changePwdFormVisible: sessionStorage.getItem('changePwdFormVisible') === 'true'
    }
  },
  methods: {
    init () {
      let _this = this
      _this.getUserInfo()
    },
    getUserInfo () {
      let _this = this
      _this.$http({
        method: 'get',
        url: '/api/admin/sys/user/info'
      }).then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            _this.userInfo = response.data.data
          }
        }
      }).catch(function () {})
    },
    logout () {
      let _this = this
      sessionStorage.clear()
      _this.$router.push('/login')
    },
    onMouseEnter () {
      let _this = this
      _this.show = true
    },
    onMouseLeave () {
      let _this = this
      _this.show = false
    },
    changePwd (formInline) {
      let _this = this
      this.$refs[formInline].validate((valid) => {
        if (valid) {
          this.$http({
            url: '/api/admin/sys/user/password',
            method: 'put',
            params: _this.formInline
          })
            .then(function (response) {
              if (response.data.code !== null && response.data.code !== undefined) {
                _this.$message({
                  message: response.data.msg,
                  type: response.data.code === 0 ? 'success' : 'error',
                  duration: 2000
                })
                if (response.data.code === 0) {
                  _this.changePwdFormVisible = false
                }
              }
            })
            .catch(function (err) {
              return err
            })
        } else {
          return false
        }
      })
    },
    navCollapse () {
      this.$store.dispatch('navCollapse')
      console.log(this.$store.state.navCollapse)
    },
    refresh () {
      this.$store.dispatch('refresh')
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
.messageBox{
  height: 200px;
  /*width: 200px;*/
  z-index: 9999;
  right: 20px;
  position: absolute;
}
.headerButton {
  cursor: pointer;
  background-color: #545c64;
  padding: 5px 10px;
  border-radius: 10px;
  opacity: 0.8;
}
.headerButton:hover {
  cursor: pointer;
  background-color: #545c64;
  padding: 5px 10px;
  border-radius: 10px;
  opacity: 1;
}
</style>
