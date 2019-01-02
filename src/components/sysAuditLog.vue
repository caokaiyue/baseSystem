<template>

  <el-row>
    <h3>{{ title }}</h3>
    <el-form :inline="true" :model="formInline" label-position="left">
      <el-form-item label="日志等级">
        <el-select
          clearable
          v-model="formInline.logLevel"
          placeholder="请选择">
          <el-option label="INFO" value="INFO"></el-option>
          <el-option label="WARN" value="WARN"></el-option>
          <el-option label="ERROR" value="ERROR"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日志类型">
        <el-select
          clearable
          v-model="formInline.logType"
          placeholder="请选择">
          <el-option label="USERAUDIT" value="USERAUDIT"></el-option>
          <el-option label="SECURITY" value="SECURITY"></el-option>
          <el-option label="AUTOJOB" value="AUTOJOB"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="queryTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <template slot-scope="scope"></template>
      </el-form-item>
      <div style="width: 100%">
        <el-table
          :data="tableData"
          fit
          stripe
          style="width: 100%">
          <el-table-column
            prop="sysLogId"
            label="系统日志ID"
            min-width="200"
            v-if="false"
          >
          </el-table-column>
          <el-table-column
            prop="logSource"
            label="来源"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="logLevel"
            label="日志级别"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="logTimestamp"
            label="日志时间戳"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="logType"
            label="日志类型"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="logInfo"
            label="日志内容"
            min-width="300">
          </el-table-column>
          <el-table-column
            prop="refEntity"
            label="关联主体"
            min-width="100">
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
    </el-form>
  </el-row>
</template>

<script>
export default {
  name: 'sysAuditLog',
  data () {
    return {
      title: '系统审计日志',
      tableData: [],
      formInline: {
        logLevel: '',
        logType: '',
        startTime: '',
        endTime: ''
      },
      queryTime: [],
      isProductStateLoading: false,
      total: 0,
      pageNum: 1,
      pageSize: 5
    }
  },
  methods: {
    init () {
      let _this = this
      _this.search()
    },
    request (formInline) {
      let _this = this
      if (_this.queryTime !== null && _this.queryTime.length !== 0) {
        _this.formInline.startTime = _this.queryTime[0]
        _this.formInline.endTime = _this.queryTime[1]
      } else {
        _this.formInline.startTime = ''
        _this.formInline.endTime = ''
      }
      this.$http.get('/api/sysAuditLog', {
        params: JSON.parse(JSON.stringify(formInline))})
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
    updateProductState (productId, productState) {
      let _this = this
      _this.isProductStateLoading = true
      let _productState = (productState === true) ? 'RELEASE' : 'CLOSED'
      _this.$http({
        method: 'put',
        url: '/api//product/' + productId + '/updateProductState',
        params: {
          productState: _productState
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function () {
        _this.isProductStateLoading = false
      }).catch(function () {
        _this.isProductStateLoading = false
      })
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

</style>
