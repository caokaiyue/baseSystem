<template>
    <el-row>
      <h3>{{ title }}</h3>
      <el-form :inline="true" :model="formInline" label-position="left">
        <el-form-item label="审批单号">
          <el-input v-model="formInline.channelOrderId" placeholder="审批单号"></el-input>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select
            clearable
            v-model="formInline.loanApplyState"
                      placeholder="请选择">
            <el-option label="新件" value="NEW">新件</el-option>
            <el-option label="审核中" value="APPROVEING">审核中</el-option>
            <el-option label="通过" value="ACCEPT">通过</el-option>
            <el-option label="拒绝" value="REJECT">拒绝</el-option>
            <el-option label="异常" value="EXCEPTION">异常</el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="进件日期">
            <el-date-picker  v-model="createTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        <el-form-item>
              <el-button  type="primary" @click="search" >查询</el-button>
        </el-form-item>
          <div>
            <el-table
              :data="tableData"
              fit
              stripe
              style="width: 100%">
              <el-table-column
                prop="applyId"
                label="申请单编号"
                v-if="false"
                width="180">
              </el-table-column>
              <el-table-column
                prop="channelOrderId"
                label="渠道订单号"
                width="180">
              </el-table-column>
              <el-table-column
                prop="merchantName"
                label="商户">
                width="180">
              </el-table-column>
              <el-table-column
                prop="productName"
                label="产品名称"
                width="180">
              </el-table-column>
              <el-table-column
                prop="realName"
                label="真实姓名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="loanApplyAmount"
                label="申请金额（元）"
                width="180">
              </el-table-column>
              <el-table-column
                prop="loanApplyState"
                label="申请状态"
                width="180">
              </el-table-column>
              <el-table-column
                prop="createTimestamp"
                label="申请单创建时间"
                width="180">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                min-width="200">
                <template slot-scope="scope">
                  <router-link :to="{
                    name:'personCreditApplyDetails',
                    params:{
                      applyId:scope.row.applyId}
                      }">
                    <el-button type="text" size="small" @click="saveSessionApplyId(scope.row.applyId)">
                      查看详情
                    </el-button>
                  </router-link>
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
         </el-form>
    </el-row>
</template>

<script>
export default {
  name: 'personCreditApply',
  data () {
    return {
      title: '进件查询',
      formInline: {
        channelOrderId: '',
        loanApplyState: '',
        startTime: '',
        endTime: ''
      },
      tableData: [],
      createTime: [],
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
      if (_this.createTime !== null && _this.createTime.length !== 0) {
        _this.formInline.startTime = _this.createTime[0]
        _this.formInline.endTime = _this.createTime[1]
      } else {
        _this.formInline.startTime = ''
        _this.formInline.endTime = ''
      }
      this.$http.get('/api/creditLoanApply', {
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

        })
    },
    search () {
      let _this = this
      _this.pageNum = 1
      _this.formInline.pageNum = _this.pageNum
      _this.formInline.pageSize = _this.pageSize
      _this.request(_this.formInline)
    },
    pageTo () {
      let _this = this
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
    },
    saveSessionApplyId (applyId) {
      localStorage.setItem('applyId', applyId)
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
