<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-row class="rowMargin">
      <el-card id="operationInfo">
        <el-row>
          <h4 style="color: #409EFF;margin: 0;text-align: left">运营概要信息</h4>
        </el-row>
        <el-row>
          <el-col :span="4">
            <h2>{{ operationInfo.staticDate }}</h2>
            <p>统计日期</p>
          </el-col>
          <el-col :span="4">
            <h2>{{ operationInfo.applyTotalCount}}</h2>
            <p>进件申请总笔数</p>
          </el-col>
          <el-col :span="4">
            <h2>{{ operationInfo.applyTotalAmount}}</h2>
            <p>进件申请总金额（元）</p>
          </el-col>
          <el-col :span="4">
            <h2>{{ operationInfo.applyAccumulateCount}}</h2>
            <p>累计申请笔数</p>
          </el-col>
          <el-col :span="4">
            <h2>{{ operationInfo.applyAccumulateAmount}}</h2>
            <p>累计申请金额（元）</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <h2>{{ operationInfo.loanerAddCount }}</h2>
            <p>新增贷款申请人数</p>
          </el-col>
          <el-col :span="4">
            <h2>{{ operationInfo.loanerAccumulateCount}}</h2>
            <p>累计贷款申请人数</p>
          </el-col>
          <el-col :span="4">
            <h2>{{ operationInfo.approveAcceptCount}}</h2>
            <p>审核通过笔数</p>
          </el-col>
          <el-col :span="4">
            <h2>{{ operationInfo.approveAcceptAmount}}</h2>
            <p>审核通过金额（元）</p>
          </el-col>
          <el-col :span="4">
            <h2>{{ operationInfo.approveRejectCount}}</h2>
            <p>审核拒绝笔数</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <h2>{{ operationInfo.loanIssuedAmountTotal }}</h2>
            <p>放款总额（元）</p>
          </el-col>
          <el-col :span="4">
            <h2>{{ operationInfo.loanRemainAmountTotal}}</h2>
            <p>贷款总余额（元）</p>
          </el-col>
          <el-col :span="4">
            <h2>{{ operationInfo.overdueCountTotal}}</h2>
            <p>逾期总笔数</p>
          </el-col>
          <el-col :span="4">
            <h2>{{ operationInfo.overdueAmountTotal}}</h2>
            <p>逾期总金额（元）</p>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row class="rowMargin">
      <el-card>
        <el-form :inline="true" :model="formInline" label-position="left">
          <el-row>
            <h4 style="color: #409EFF;margin: 0;text-align: left">日进件申请金额趋势分析</h4>
          </el-row>
          <el-row class="rowMargin" style="margin-top: 20px;text-align: left">
            <el-form-item label="时间">
            <el-date-picker
              v-model="queryTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @focus="inputFocus"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-row>
        </el-form>
        <div id="operationInfoChart" style="width: 100%;height:400px;"></div>
      </el-card>
    </el-row>
  </el-row>
</template>

<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
export default {
  name: 'operationInfo',
  data () {
    return {
      title: '运营概要',
      operationInfo: {
        approveId: this.$route.params.approveId,
        channelOrderID: '',
        repaymentType: '',
        createTimestamp: '',
        shopName: '',
        productName: '',
        loanApplyAmount: '',
        loanApplyState: '',
        realName: '',
        identityCardNum: '',
        phone: '',
        age: '',
        gender: '',
        education: '',
        professional: '',
        homeAddressDetail: ''
      },
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data: ['日进件申请金额']
        },
        xAxis: [
          {
            type: 'category',
            name: '日期',
            axisLabel: {
              interval: 0,
              rotate: 45
            },
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '日进件申请金额',
            // interval: 50000,
            axisLabel: {
              formatter: '{value} 万元'
            }
          }
        ],
        series: [
          {
            name: '日进件申请金额',
            type: 'line',
            data: []
          }
        ]
      },
      queryTime: [],
      formInline: {
        startTime: '',
        endTime: ''
      },
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
            return !(time.getTime() > Date.parse(this.GMTToStr(this.minDate)) - 30 * 24 * 3600 * 1000) || time.getTime() > Date.parse(this.GMTToStr(this.minDate)) ||
              time.getTime() > Date.parse(this.GMTToStr(this.minDate)) - 7 * 24 * 3600 * 1000
          } else {
            return time.getTime() > Date.now() - 8.64e7
          }
        }
      }
    }
  },
  methods: {
    init () {
      let _this = this
      _this.getApprovalHistoryDetails()
      _this.search()
    },
    getApprovalHistoryDetails () {
      let _this = this
      this.$http.get('/api/dmBuStaticDaily/latest').then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            _this.operationInfo = response.data.data
          }
        }
      })
        .catch(function () {
          // console.log(err)
        })
    },
    getChartData (formInline) {
      let _this = this
      if (_this.queryTime !== null && _this.queryTime.length !== 0) {
        _this.formInline.startTime = _this.queryTime[0]
        _this.formInline.endTime = _this.queryTime[1]
      } else {
        _this.queryTime = [_this.$dateFormat(30, 1).startTime, _this.$dateFormat(30, 1).endTime]
        _this.formInline.startTime = _this.$dateFormat(30, 1).startTime
        _this.formInline.endTime = _this.$dateFormat(30, 1).endTime
      }
      let operationInfoChart = echarts.init(document.getElementById('operationInfoChart'))
      operationInfoChart.setOption(_this.option)
      this.$http.get('/api/dmBuStaticDaily/applyTotalAmount', {params: JSON.parse(JSON.stringify(formInline))}).then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            operationInfoChart.setOption({
              xAxis: {
                data: response.data.data.dateTime
              },
              series: [{
                // 根据名字对应到相应的系列
                name: '日进件申请金额',
                data: response.data.data.data
              }]
            })
          }
        }
      })
        .catch(function () {
          // console.log(err)
        })
    },
    inputFocus () {
      let _this = this
      if (_this.maxDate !== null) {
        _this.minDate = null
        _this.maxDate = null
      }
    },
    search () {
      let _this = this
      _this.getChartData(_this.formInline)
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
#operationInfo {
  text-align: center
}
#operationInfo h2 {
  color: #C6D0D4;
}
#operationInfo p {
 font-size: 14px;
}
#operationInfo .el-col-4 {
  padding: 0 20px;
}
</style>
