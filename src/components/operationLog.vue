<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-form :inline="true" :model="formInline" label-position="left">
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <template slot-scope="scope">                                                                                                                                                                                                                                                                                                                                                                                                     </template>
      </el-form-item>
      <div style="width: 100%">
        <el-table
          :data="tableData"
          fit
          stripe
          style="width: 100%">
          <el-table-column
            prop="5c20963078c2fd3bac128d86"
            label="产品ID"
            min-width="200"
            v-if="false"
          >
          </el-table-column>
          <el-table-column
            prop="userId"
            label="userId"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="username"
            label="username"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="operation"
            label="operation"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="time"
            label="time"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="method"
            label="method"
            min-width="350">
          </el-table-column>
          <el-table-column
            prop="requestUrl"
            label="requestUrl"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="urlMethod"
            label="urlMethod"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="moduleName"
            label="moduleName"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="status"
            label="status"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="userAgent"
            label="userAgent"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="params"
            label="params"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="ip"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="gmtCreate"
            label="gmtCreate"
            min-width="200">
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
    <el-dialog
      :append-to-body="true"
      title="message概览"
      :visible.sync="messageVisible">
      <div v-html="currentMessage.replace(/\n/g,'<br/>')">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="messageVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  name: 'OperationLog',
  data () {
    return {
      title: '操作日志',
      messageVisible: false,
      currentMessage: '',
      tableData: [],
      formInline: {},
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
      this.$http.get('/api/record/operation/log', {
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
              // 格式化status的boolean到string
              for (let i = 0; i < response.data.data.rows.length; i++) {
                response.data.data.rows[i].status = response.data.data.rows[i].status.toString()
              }
              _this.tableData = response.data.data.rows
              _this.total = response.data.data.total
            }
          }
        })
        .catch(function () {
          // console.log(err)
        })
    },
    showCurrentMessage (currentMessage) {
      let _this = this
      _this.currentMessage = currentMessage
      _this.messageVisible = true
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

</style>
