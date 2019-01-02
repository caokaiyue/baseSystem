<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-form :inline="true" :model="formInline" label-position="left">
      <el-form-item label="姓名">
        <el-input v-model="formInline.realName" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="formInline.identityCardNum" placeholder="身份证号"></el-input>
      </el-form-item>
      <el-form-item label="申请单号">
        <el-input v-model="formInline.applyId" placeholder="申请单号"></el-input>
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
        <template slot-scope="scope">
        </template>
      </el-form-item>
      <div style="width: 100%">
        <el-table
          :data="tableData"
          fit
          stripe
          style="width: 100%">
          <el-table-column
            prop="approveId"
            label="审批标识"
            min-width="auto">
          </el-table-column>
          <el-table-column
            prop="applyId"
            label="申请单标识"
            min-width="auto">
          </el-table-column>
          <el-table-column
            prop="realName"
            label="借款人"
            min-width="auto">
          </el-table-column>
          <el-table-column
            prop="identityCardNum"
            label="身份证号"
            min-width="auto">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号码"
            min-width="auto">
          </el-table-column>
          <el-table-column
            prop="approveAmount"
            label="审批金额（元）"
            min-width="auto">
          </el-table-column>
          <el-table-column
            prop="finalDecision"
            label="终审结果"
            min-width="auto">
          </el-table-column>
          <el-table-column
            prop="approveUser"
            label="审核人"
            min-width="auto">
          </el-table-column>
          <el-table-column
            prop="refuseCode"
            label="拒绝原因码"
            min-width="auto">
          </el-table-column>
          <el-table-column
            prop="approveState"
            label="审批状态"
            min-width="auto">
          </el-table-column>
          <el-table-column
            prop="approveStartTime"
            label="审批起始时间"
            min-width="auto">
          </el-table-column>
          <el-table-column
            prop="approveEndTime"
            label="审批结束时间"
            min-width="auto">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            min-width="100">
            <template slot-scope="scope">
              <router-link :to="{
                name:'approveHistoryDetails',
                params:{
                  approveId:scope.row.approveId
                }
              }">
                <el-button type="text" size="small">
                  查看
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
  name: 'approvalHistory',
  data () {
    return {
      title: '审批历史查询',
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      queryTime: [],
      formInline: {
        realName: '',
        phone: '',
        identityCardNum: '',
        applyId: '',
        startTime: '',
        endTime: ''
      }
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
      this.$http.get('/api/approveProcessReport/history', {
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
