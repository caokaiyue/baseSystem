<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-col :span="8" :offset="8">
      <el-form ref="formInline" :label-position="labelPosition" :model="formInline" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="formInline.userName"></el-input>
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
            <el-checkbox v-for="item in rolesList"
             :key="item.id"
             :label="item.id">{{item.name}}</el-checkbox>
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
  name: 'userAdd',
  data () {
    return {
      title: '新增用户',
      labelPosition: 'left',
      formInline: {
        userName: '',
        userRealName: '',
        phone: '',
        email: '',
        roleIdList: []
      },
      rolesList: []
    }
  },
  methods: {
    init () {
      let _this = this
      _this.getRoleList()
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
              _this.rolesList = response.data.data
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
        url: '/api/sysUser',
        method: 'post',
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
