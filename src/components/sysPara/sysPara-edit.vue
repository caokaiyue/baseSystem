<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-col :span="8" :offset="8">
      <el-form ref="formInline" :label-position="labelPosition" :model="formInline" label-width="80px">
        <el-form-item label="参数值">
          <el-input v-model="formInline.sysParaValue"></el-input>
        </el-form-item>
        <el-form-item label="参数描述">
          <el-input v-model="formInline.sysParaDesc"></el-input>
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
  name: 'sysParaEdit',
  data () {
    return {
      title: '编辑系统参数',
      labelPosition: 'left',
      sysParaId: this.$route.params.sysParaId,
      formInline: {
        sysParaValue: '',
        sysParaDesc: ''
      }
    }
  },
  methods: {
    init () {
      let _this = this
      if (!_this.sysParaId) {
        _this.$router.go(-1)
      } else {
        this.$http.get('/api/sysPara/' + _this.sysParaId.toString().replace(/\./g, '_'))
          .then(function (response) {
            if (response.data.code !== null && response.data.code !== undefined) {
              if (response.data.code !== 0) {
                _this.$message({
                  message: response.data.msg,
                  type: response.data.code === 0 ? 'success' : 'error',
                  duration: 2000
                })
              } else {
                _this.formInline = response.data.data
              }
            }
          })
          .catch(function () {
            // console.log(err)
          })
      }
    },
    onSubmit () {
      let _this = this
      this.$http({
        url: '/api/sysPara/' + _this.sysParaId,
        method: 'put',
        params: JSON.parse(JSON.stringify(_this.formInline))
      })
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
            if (response.data.code === 0) {
              _this.$router.push('/home/sysPara')
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
