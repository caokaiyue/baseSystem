<template>
  <el-row>
    <el-col :span="12" style="line-height: 60px">
      <img src="../../../static/logo.png" style="float: left;display: inline-block;height: 30px;margin: 15px 10px 15px 0">
      <p style="display: inline-block;line-height: 30px;height: 30px;float: left;font-size: 16px">
        {{ title }}
      </p>
    </el-col>
    <el-col :span="12" style="text-align: right">
      <p style="z-index: 9999;font-size: 0.6rem;display: inline-block;margin: 0"> <!--@mouseenter="onMouseEnter" @mouseleave="onMouseLeave" -->
        <span class="iconfont icon-wo"></span>
        <span style="color: #ffffff;">当前用户：{{ userName }}</span>
        <transition name="el-fade-in-linear">
          <div v-show="show" class="messageBox">
            <el-tabs type="card" style="color: #909399;">
              <el-tab-pane label="公    告">
                站内信站内信站内信站内信站内信站内信站内信站内信站
                内信站内信站内信站内信站内信站内信站内信站内信站内
                信站内信站内信站内信站内信站内信
              </el-tab-pane>
              <el-tab-pane label="站内信">站内信</el-tab-pane>
            </el-tabs>
          </div>
        </transition>
      </p>
      <a class="headerButton" type="text" size="small" @click="changePwdFormVisible = true">
        <span class="iconfont icon-mima"></span>
        <span>修改密码</span>
      </a>
      <a class="headerButton" type="text" size="small" @click="logout">
        <span class="iconfont icon-tuichu3"></span>
        <span>安全退出</span>
      </a>
    </el-col>
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
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input type="password" v-model="formInline.oldPwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="formInline.newPwd" auto-complete="off"></el-input>
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
  </el-row>
</template>

<script>
export default {
  name: 'header-container',
  data () {
    let newRePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.formInline.newPwd) {
        callback(new Error('两次输入新密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      title: '物滴Cloud',
      formInline: {
        oldPwd: '',
        newPwd: '',
        newRePwd: ''
      },
      show: false,
      rules: {
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        newRePwd: [
          { required: true, validator: newRePwd, trigger: 'blur' }
        ]
      },
      userName: sessionStorage.getItem('userName'),
      firstLoginTag: sessionStorage.getItem('firstLoginTag'),
      changePwdFormVisible: sessionStorage.getItem('changePwdFormVisible') === 'true'
    }
  },
  methods: {
    logout () {
      let _this = this
      this.$http.get('/api/logout')
        .then(function () {
          sessionStorage.removeItem('userName')
          sessionStorage.removeItem('roleName')
          sessionStorage.removeItem('menuList')
          sessionStorage.removeItem('workState')
          _this.$router.push('/login')
        })
        .catch(function () {
          sessionStorage.removeItem('userName')
          sessionStorage.removeItem('roleName')
          sessionStorage.removeItem('menuList')
          sessionStorage.removeItem('workState')
          _this.$router.push('/login')
        })
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
            url: '/api/sysUser/current/changePwd',
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
    }
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
