<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-form :inline="true" label-position="left">
      <div style="width: 100%">
        <el-table
          :data="tableData"
          fit
          stripe
          style="width: 100%">
          <el-table-column
            prop="sysJobId"
            label="系统作业标识"
            min-width="150"
          >
          </el-table-column>
          <el-table-column
            prop="sysJobName"
            label="作业名称"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="sysJobParam"
            label="作业参数"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="lastExecTimestamp"
            label="上次执行时间"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="scheduleConfig"
            label="调度配置"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="sysJobGroup"
            label="作业分组"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="jobRunState"
            label="运行状态"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="sysJobState"
            label="作业状态"
            min-width="150">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.sysJobState"
                :disabled="isSysJobStateLoading"
                @change="changeSysJobState(scope.row.sysJobId, scope.row.sysJobState)"
                active-text="活动"
                inactive-text="禁用">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            min-width="300" >
            <template slot-scope="scope">
              <router-link :to="{
                name:'sysJobEdit',
                params:{
                  sysJobId: scope.row.sysJobId
                }
              }">
                <el-button type="text" size="small">
                  编辑
                </el-button>
              </router-link>
              <el-button type="text" size="small" @click="redoVisible = true; currentRedoTarget = scope.row.sysJobId">重做</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <el-dialog
      :append-to-body="true"
      width ="30%"
      title="重做任务日期选择"
      :visible.sync="redoVisible">
      <el-form :inline="true" label-position="left">
        <el-form-item label="重做日期">
          <el-date-picker
          v-model="applyDate"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          >
        </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="redoVisible = false">取 消</el-button>
        <el-button :disabled="isRedoLoading" type="primary" @click="redo(currentRedoTarget)">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  name: 'sysJob',
  data () {
    return {
      title: '自动作业管理',
      tableData: [],
      delUserId: '',
      delUserVisible: false,
      isSysJobStateLoading: false,
      sysJobState: false,
      redoVisible: false,
      currentRedoTarget: '',
      applyDate: '',
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      isRedoLoading: false
    }
  },
  methods: {
    init () {
      let _this = this
      _this.request()
    },
    request () {
      let _this = this
      this.$http.get('/api/sysJob')
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              response.data.data.forEach(item => {
                let sysJobState = (item.sysJobState === 'ACTIVE')
                item.sysJobState = sysJobState
              })
              _this.tableData = response.data.data
            }
          }
        })
        .catch(function () {
          // console.log(err)
        })
    },
    changeSysJobState (sysJobId, sysJobState) {
      let _this = this
      _this.isSysJobStateLoading = true
      let _sysJobState = (sysJobState === true) ? 'ACTIVE' : 'DEACTIVE'
      _this.$http({
        method: 'put',
        url: '/api/sysJob/' + sysJobId + '/changeSysJobState',
        params: {
          sysJobState: _sysJobState
        }
      }).then(function (response) {
        _this.isSysJobStateLoading = false
        if (response.data.code === 4) {
          _this.$message({
            message: '长时间未操作，请重新登录',
            type: response.data.code === 0 ? 'success' : 'error',
            duration: 2000
          })
        }
      }).catch(function () {
        _this.isSysJobStateLoading = false
      })
    },
    redo (sysJobId) {
      let _this = this
      _this.isRedoLoading = true
      _this.$http({
        method: 'get',
        url: '/api/sysJob/' + sysJobId + '/redo',
        params: {
          applyDate: _this.applyDate
        }
      }).then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            _this.request()
          }
        }
        _this.isRedoLoading = false
      }).catch(function () {
        _this.isRedoLoading = false
      })
      _this.redoVisible = false
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
