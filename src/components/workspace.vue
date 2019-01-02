<template>
  <transition name="el-fade-in-linear">
    <div v-show="show" style="height: 100%;">
      <div style="height: 60%;overflow-y: auto;">
        <el-card>
        <el-row class="rowMargin" style="height: 40px;line-height: 40px;text-align: center">
          <el-col :span="2" class="label">
            工作状态：
          </el-col>
          <el-col :span="3">
            <el-select
              @change="updateWorkState"
              v-model="workState"
              placeholder="请选择">
              <el-option label="工作中" value="NORMAL">工作中</el-option>
              <el-option label="忙碌" value="BUSY">忙碌</el-option>
              <el-option label="离开" value="LEAVE">离开</el-option>
            </el-select>
          </el-col>
          <el-col :span="3" class="label">
            待处理任务数：
          </el-col>
          <el-col :span="2">
            {{processingTaskQuantity}}
          </el-col>
          <el-col :span="3" class="label">
            今日累计处理数：
          </el-col>
          <el-col :span="2">
            {{todayProcessedTaskQuantity}}
          </el-col>
          <el-col :span="3" class="label">
            累计处理数：
          </el-col>
          <el-col :span="2">
            {{processedTaskQuantity}}
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="search">刷新</el-button>
          </el-col>
        </el-row>
        <el-row class="rowMargin">
          <div style="width: 100%">
            <el-table
              :data="tableData"
              fit
              stripe
              style="width: 100%">
              <el-table-column
                prop="approveId"
                label="审批单号"
                min-width="200"
              >
              </el-table-column>
              <el-table-column
                prop="approveStartTime"
                label="审批起始日期"
                min-width="200">
              </el-table-column>
              <el-table-column
                prop="loanApplyAmount"
                label="申请金额（元）"
                min-width="200">
              </el-table-column>
              <el-table-column
                prop="realName"
                label="申请人姓名"
                min-width="150">
              </el-table-column>
              <el-table-column
                prop="loanPeriod"
                label="期限（月）"
                min-width="150">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                min-width="200">
                <template slot-scope="scope">
                  <router-link :to="{
                    name:'manualApprove',
                    params:{
                      approveId:scope.row.approveId}
                      }">
                    <el-button type="text" size="small" @click="saveSessionApproveId(scope.row.approveId)">
                      审批
                    </el-button>
                  </router-link>
                  <el-button type="text" size="small" @click="applyReturn(scope.row.approveId)">
                    退回
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            :current-page="pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-row>
          </el-card>
      </div>
      <el-card>
        <div slot="header">
          <span>操作日志</span>
        </div>
          <el-row class="log">
            <el-table
              :data="auditLog"
              fit
              height="180"
              stripe
              style="width: 100%">
              <el-table-column
                prop="logTimestamp"
                label="操作时间"
                width="200"
              >
              </el-table-column>
              <el-table-column
                prop="logLevel"
                label="等级"
                width="150">
              </el-table-column>
              <el-table-column
                prop="logInfo"
                label="信息"
                min-width="150">
              </el-table-column>
            </el-table>
          </el-row>
      </el-card>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'workspace',
  data () {
    return {
      title: '我的工作台',
      show: false,
      workState: sessionStorage.workState ? sessionStorage.workState : 'LEAVE',
      sysUserID: '',
      processingTaskQuantity: '请等待...',
      processedTaskQuantity: '请等待...',
      todayProcessedTaskQuantity: '请等待...',
      auditLog: [],
      formInline: {},
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5
    }
  },
  methods: {
    init () {
      let _this = this
      _this.search()
      _this.getAuditLog()
      _this.show = true
    },
    updateWorkState () {
      let _this = this
      let workState = {
        workState: _this.workState
      }
      this.$http({
        url: '/api/sysUser/current/workState/update',
        method: 'put',
        params: workState
      })
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              sessionStorage.setItem('workState', workState.workState)
              _this.workState = sessionStorage.workState
            }
          }
        })
        .catch(function (err) {
          return err
        })
    },
    getAuditLog () {
      let _this = this
      this.$http.get('/api/sysAuditLog/userLog')
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.auditLog = response.data.data
            }
          }
        })
        .catch(function () {})
    },
    request (formInline) {
      let _this = this
      this.$http.get('/api/approveProcessReport/processing/currentUser/count')
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.processingTaskQuantity = response.data.data
            }
          }
        })
        .catch(function () {})
      this.$http.get('/api/approveProcessReport/processed/currentUser/count')
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.processedTaskQuantity = response.data.data
            }
          }
        })
        .catch(function () {})
      this.$http({
        url: '/api/approveProcessReport/processing/currentUser',
        method: 'get',
        params: JSON.parse(JSON.stringify(formInline))
      })
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.tableData = response.data.data.rows
              _this.total = response.data.data.total
            }
          }
        })
        .catch(function () {
          // console.log(err)
        })
      this.$http.get('/api/approveProcessReport/processed/today/currentUser/count')
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.todayProcessedTaskQuantity = response.data.data
            }
          }
        })
        .catch(function () {})
    },
    saveSessionApproveId (approveId) {
      sessionStorage.setItem('currentApproveId', approveId)
    },
    applyReturn (approveId) {
      let _this = this
      this.$http.get('/api/manualApprove/' + approveId + '/redistribute')
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.search()
            }
          }
        })
        .catch(function () {
          // console.log(err)
        })
    },
    pageTo () {
      let _this = this
      _this.formInline.pageNum = _this.pageNum
      _this.formInline.pageSize = _this.pageSize
      _this.request(_this.formInline)
    },
    search () {
      let _this = this
      _this.pageNum = 1
      _this.formInline.pageNum = _this.pageNum
      _this.formInline.pageSize = _this.pageSize
      _this.request(_this.formInline)
    },
    handleSizeChange (val) {
      let _this = this
      _this.pageSize = val
      _this.search()
    },
    handleCurrentChange (val) {
      let _this = this
      _this.pageNum = val
      _this.pageTo()
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
  .label{
    font-weight: 700;
  }
  .log {
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
    z-index: 99;
  }
</style>
