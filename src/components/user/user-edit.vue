<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-col :span="8" :offset="8">
      <el-form ref="formInline" :label-position="labelPosition" :model="formInline" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="formInline.userName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="formInline.userRealName"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formInline.phone"></el-input>
        </el-form-item>
        <el-form-item label="E-MAIL">
          <el-input v-model="formInline.email"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="formInline.roleIdList">
            <el-checkbox v-for="item in roleList"
             :key="item.id"
             :label="item.id"
            >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'userEdit',
  data () {
    return {
      title: '编辑用户',
      labelPosition: 'left',
      sysUserId: this.$route.params.sysUserId,
      formInline: {
        userName: '',
        userRealName: '',
        phone: '',
        email: '',
        roleIdList: []
      },
      roleList: []
    }
  },
  methods: {
    init () {
      let _this = this
      if (!_this.sysUserId) {
        _this.$router.go(-1)
      } else {
        _this.getRoleList()
        this.$http.get('/api/sysUser/' + _this.sysUserId)
          .then(function (response) {
            if (response.data.code !== null && response.data.code !== undefined) {
              if (response.data.code !== 0) {
                _this.$message({
                  message: response.data.msg,
                  type: response.data.code === 0 ? 'success' : 'error',
                  duration: 2000
                })
              } else {
                response.data.data.roleIdList = []
                for (var i = 0; i < response.data.data.roleList.length; i++) {
                  response.data.data.roleIdList.push(response.data.data.roleList[i].id)
                }
                delete response.data.data.roleList
                _this.formInline = response.data.data
              }
            }
          })
          .catch(function () {
            // console.log(err)
          })
      }
    },
    getRoleList () {
      let _this = this
      this.$http.get('/api/sysRole')
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.roleList = response.data.data
            }
          }
        })
        .catch(function () {
          // console.log(err)
        })
    },
    onSubmit () {
      let _this = this
      this.$http({
        url: '/api/sysUser/' + _this.sysUserId,
        method: 'put',
        data: JSON.parse(JSON.stringify(_this.formInline))
      })
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
            if (response.data.code === 0) {
              _this.$router.push('/home/user')
            }
          }
        })
        .catch(function () {
          // console.log(err)
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

</style>
