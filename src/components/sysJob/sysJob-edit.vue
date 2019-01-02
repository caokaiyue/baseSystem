<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-col :span="10" :offset="6">
      <el-form ref="formInline" :label-position="labelPosition" :model="formInline" label-width="100px">
        <el-form-item label="系统作业ID">
          <el-input :disabled="true" v-model="formInline.sysJobId"></el-input>
        </el-form-item>
        <el-form-item label="作业名称">
          <el-input :disabled="true" v-model="formInline.sysJobName"></el-input>
        </el-form-item>
        <el-form-item label="作业分组">
          <el-input :disabled="true" v-model="formInline.sysJobGroup"></el-input>
        </el-form-item>
        <el-form-item label="作业参数">
          <el-input v-model="formInline.sysJobParam"></el-input>
        </el-form-item>
        <el-form-item label="调度配置">
          <el-input v-model="formInline.scheduleConfig"></el-input>
        </el-form-item>
        <el-form-item label="作业描述">
          <el-input :disabled="true" type="textarea" v-model="formInline.sysJobDesc" rows="5"></el-input>
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
  name: 'sysJobEdit',
  data () {
    return {
      title: '编辑作业',
      labelPosition: 'left',
      sysJobId: this.$route.params.sysJobId,
      formInline: {
        sysJobId: '',
        sysJobGroup: '',
        sysJobName: '',
        sysJobParam: '',
        scheduleConfig: '',
        sysJobDesc: ''
      }
    }
  },
  methods: {
    init () {
      let _this = this
      if (!_this.sysJobId) {
        _this.$router.go(-1)
      } else {
        _this.getSysJobInfo()
      }
    },
    getSysJobInfo () {
      let _this = this
      this.$http.get('/api/sysJob/' + _this.sysJobId)
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
    },
    onSubmit () {
      let _this = this
      let formInline = {
        sysJobParam: _this.formInline.sysJobParam,
        scheduleConfig: _this.formInline.scheduleConfig
      }
      this.$http({
        url: '/api/sysJob/' + _this.formInline.sysJobId,
        method: 'put',
        params: formInline
      })
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
            if (response.data.code === 0) {
              _this.$router.push('/home/sysJob')
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
