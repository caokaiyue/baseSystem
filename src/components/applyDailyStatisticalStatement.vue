<template>
  <el-row class="rowMargin">
    <el-row class="rowMargin">
      <h3>{{ title }}</h3>
    </el-row>
    <el-form :inline="true" :model="formInline" label-position="left">
      <el-form-item label="时间">
        <el-date-picker
          v-model="queryTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @focus="inputFocus"
          @change="search"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="downLoad" :disabled="isDownLoad">下载</el-button>
      </el-form-item>
      <div style="width: 100%">
        <el-table
          :data="tableData"
          fit
          stripe
          style="width: 100%">
          <el-table-column
            prop="staticDate"
            label="进件申请日期"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="applyTotalCount"
            label="当日进件申请总笔数"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="applyTotalAmount"
            label="当日进件申请总金额（元）"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="applyAccumulateCount"
            label="累计申请笔数"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="applyAccumulateAmount"
            label="累计申请金额（元）"
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
  </el-row>
</template>

<script>
export default {
  name: 'applyDailyStatisticalStatement',
  data () {
    return {
      title: '进件情况日报表',
      tableData: [],
      formInline: {
        startTime: '',
        endTime: ''
      },
      queryTime: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      minDate: null,
      maxDate: null,
      GMTToStr (time) {
        let date = new Date(time)
        let Str = date.getFullYear() + '-' +
          (date.getMonth() + 1) + '-' +
          date.getDate() + ' ' +
          date.getHours() + ':' +
          date.getMinutes() + ':' +
          date.getSeconds()
        return Str
      },
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.maxDate = maxDate
          this.minDate = minDate
        },
        disabledDate: (time) => {
          if (this.minDate !== null) {
            return !(time.getTime() > Date.parse(this.GMTToStr(this.minDate)) - 365 * 24 * 3600 * 1000) || time.getTime() > Date.parse(this.GMTToStr(this.minDate)) ||
              time.getTime() > Date.parse(this.GMTToStr(this.minDate)) - 7 * 24 * 3600 * 1000
          } else {
            return time.getTime() > Date.now() - 8.64e7
          }
        }
      },
      isDownLoad: false
    }
  },
  methods: {
    init () {
      let _this = this
      _this.search()
    },
    inputFocus () {
      let _this = this
      if (_this.maxDate !== null) {
        _this.minDate = null
        _this.maxDate = null
      }
    },
    getTableData (formInline) {
      let _this = this
      if (_this.queryTime !== null && _this.queryTime.length !== 0) {
        _this.formInline.startTime = _this.queryTime[0]
        _this.formInline.endTime = _this.queryTime[1]
      } else {
        _this.formInline.startTime = ''
        _this.formInline.endTime = ''
      }
      this.$http.get('/api/dmBuStaticDaily', {
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
      _this.getTableData(_this.formInline)
    },
    search () {
      let _this = this
      _this.pageNum = 1
      _this.formInline.pageNum = _this.pageNum
      _this.formInline.pageSize = _this.pageSize
      _this.getTableData(_this.formInline)
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
    downLoad () {
      let _this = this
      _this.isDownLoad = true
      _this.search()
      this.$http({
        method: 'get',
        url: '/api/dmBuStaticDaily/download',
        responseType: 'blob',
        params: JSON.parse(JSON.stringify(_this.formInline))
      })
        .then(function (response) {
          let fileName = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1])
          _this.isDownLoad = false
          _this.downLoadToHref(response.data, fileName)
        })
        .catch(function () {
          _this.isDownLoad = false
        })
    },
    downLoadToHref (docFlow, fileName) {
      if (!docFlow) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([docFlow]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      console.log(link)
      link.click()
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
