<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-row class="rowMargin">
      <el-card>
        <el-row>
          <h4 style="color: #409EFF;margin: 0;text-align: left">通过率波动分析（近30日）</h4>
        </el-row>
        <el-row>
          <div id="passRateChart" style="width: 100%;height:400px;overflow: auto"></div>
        </el-row>
      </el-card>
    </el-row>

    <el-row class="rowMargin">
      <el-card>
      <el-row class="rowMargin">
        <h4 style="color: #409EFF;margin: 0;text-align: left">拒绝原因分布</h4>
      </el-row>
      <el-row>
          <el-form :inline="true" :model="refuseReasonFormInline" label-position="left">
            <el-form-item label="时间">
              <el-date-picker
                v-model="refuseReasonFormInline.reqDate"
                value-format="yyyy-MM"
                type="month"
                placeholder="选择月">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
          <el-row class="rowMargin">
            <el-col :span="12">
              <h3 class="isNullTips" v-show="isRefuseReasonNull">暂无数据</h3>
              <div v-show="!isRefuseReasonNull" id="refuseReasonChart" style="width: 100%;height:400px;"></div>
            </el-col>
            <el-col :span="12">
              <h3 class="isNullTips" v-show="isApproveRefuseNull">暂无数据</h3>
              <div v-show="!isApproveRefuseNull" id="approveRefuseChart" style="width: 100%;height:400px;"></div>
            </el-col>
          </el-row>
      </el-row>
      </el-card>
    </el-row>

    <el-row class="rowMargin">
      <el-col :span="14">
        <el-card style="height: 565px;">
        <el-row class="rowMargin">
          <h4 style="color: #409EFF;margin: 0;text-align: left">拒绝特征分布</h4>
        </el-row>
          <el-form :inline="true" :model="rejectFeatureFormInline" label-position="left">
            <el-form-item label="特征">
              <el-select
                clearable
                style="width: 120px"
                v-model="rejectFeatureFormInline.featureName"
                placeholder="请选择">
                <el-option label="性别" value="gender"></el-option>
                <el-option label="年龄" value="age"></el-option>
                <el-option label="职业" value="professional"></el-option>
                <el-option label="行业" value="industry"></el-option>
                <el-option label="地域" value="region"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间">
              <el-date-picker
                v-model="rejectFeatureFormInline.applyMonth"
                value-format="yyyy-MM"
                type="month"
                placeholder="选择月">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="rejectFeatureSearch">查询</el-button>
            </el-form-item>
          </el-form>
          <el-row class="rowMargin">
              <h3 class="isNullTips" v-show="isRejectFeatureNull">暂无数据</h3>
              <div v-show="!isRejectFeatureNull" id="rejectFeatureChart" style="width: 100%;height:400px;"></div>
          </el-row>
      </el-card>
      </el-col>
      <el-col :span="10" style="padding-left: 20px">
        <el-card style="height: 565px;overflow-y: auto">
          <el-row class="rowMargin">
            <h4 style="color: #409EFF;margin: 0;text-align: left">商户拒绝率TOP10</h4>
          </el-row>
          <el-form :inline="true" :model="top10MerchantRefuseRateFormInline" label-position="left">
            <el-form-item label="时间">
              <el-date-picker
                style="width: 120px"
                v-model="top10MerchantRefuseRateFormInline.applyMonth"
                value-format="yyyy-MM"
                type="month"
                placeholder="选择月">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="top10MerchantRefuseRateSearch">查询</el-button>
            </el-form-item>
          </el-form>
        <div style="width: 100%">
          <el-table
            :data="tableData"
            fit
            stripe
            style="width: 100%">
            <el-table-column
              prop="merchant"
              label="商户号"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="refuseRate"
              label="拒绝率"
              min-width="150">
            </el-table-column>
            <el-table-column
              prop="approveCount"
              label="拒绝数量"
              min-width="150">
            </el-table-column>
          </el-table>
        </div>
        </el-card>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
require('echarts/lib/chart/pie')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
export default {
  name: 'approveAnalysis',
  data () {
    return {
      title: '审核分析',
      tableData: [],
      refuseReasonFormInline: {
        reqDate: ''
      },
      rejectFeatureFormInline: {
        applyMonth: '',
        featureName: ''
      },
      top10MerchantRefuseRateFormInline: {
        applyMonth: ''
      },
      isRefuseReasonNull: false,
      isApproveRefuseNull: false,
      isRejectFeatureNull: false,
      passRateChartOption: {
        tooltip: {
          trigger: 'axis',
          formatter: '{a}:{c}%<br/>{b}',
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
          data: ['通过率']
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
            name: '通过率',
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '通过率',
            type: 'line',
            data: []
          }
        ]
      },
      refuseReasonChartOption: {
        title: {
          text: '拒绝原因分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          // orient: 'vertical',
          // top: 'middle',
          bottom: 10,
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      approveRefuseChartOption: {
        title: {
          text: '审核拒绝分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      rejectFeatureChartOption: {
        title: {
          text: this.text,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    init () {
      let _this = this
      let yyyy = new Date().getFullYear()
      let mm = new Date().getMonth().toString().length > 1 ? new Date().getMonth().toString() : '0' + new Date().getMonth().toString()
      _this.refuseReasonFormInline.reqDate = yyyy + '-' + mm
      _this.rejectFeatureFormInline.applyMonth = yyyy + '-' + mm
      _this.top10MerchantRefuseRateFormInline.applyMonth = yyyy + '-' + mm
      _this.rejectFeatureFormInline.featureName = 'gender'
      _this.getPassRateChartData()
      _this.getRefuseReasonChartData()
      _this.getRejectFeatureChartData()
      _this.getTop10MerchantRefuseRateData()
    },
    getPassRateChartData () {
      let _this = this
      let passRateChart = echarts.init(document.getElementById('passRateChart'))
      passRateChart.setOption(_this.passRateChartOption)
      this.$http.get('/api/approveAnalysis/passRate').then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            passRateChart.setOption({
              xAxis: {
                data: response.data.data.dateOf30Days
              },
              series: [{
                // 根据名字对应到相应的系列
                name: '通过率',
                data: response.data.data.passRateFluctuation
              }]
            })
          }
        }
      })
        .catch(function () {
          // console.log(err)
        })
    },
    getRefuseReasonChartData () {
      let _this = this
      let refuseReasonChart = echarts.init(document.getElementById('refuseReasonChart'))
      let approveRefuseChart = echarts.init(document.getElementById('approveRefuseChart'))
      refuseReasonChart.setOption(_this.refuseReasonChartOption)
      approveRefuseChart.setOption(_this.approveRefuseChartOption)
      this.$http.get('/api/approveAnalysis/refuseReason', {
        params: JSON.parse(JSON.stringify(_this.refuseReasonFormInline))
      }).then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            if (response.data.data.refuseReasonList.length <= 0) {
              _this.isRefuseReasonNull = true
            } else {
              _this.isRefuseReasonNull = false
            }
            if (response.data.data.approveRefuseList.length <= 0) {
              _this.isApproveRefuseNull = true
            } else {
              _this.isApproveRefuseNull = false
            }
            refuseReasonChart.setOption({
              series: [{
                data: response.data.data.refuseReasonList
              }]
            })
            approveRefuseChart.setOption({
              series: [{
                data: response.data.data.approveRefuseList
              }]
            })
          }
        }
      })
        .catch(function () {
          // console.log(err)
        })
    },
    getRejectFeatureChartData () {
      let _this = this
      let rejectFeatureChart = echarts.init(document.getElementById('rejectFeatureChart'))
      rejectFeatureChart.setOption(_this.rejectFeatureChartOption)
      this.$http.get('/api/approveAnalysis/rejectFeature', {
        params: JSON.parse(JSON.stringify(_this.rejectFeatureFormInline))
      }).then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            if (response.data.data.rejectFeature.length <= 0) {
              _this.isRejectFeatureNull = true
            } else {
              _this.isRejectFeatureNull = false
            }
            rejectFeatureChart.setOption({
              series: [{
                data: response.data.data.rejectFeature
              }]
            })
          }
        }
      })
        .catch(function () {
          // console.log(err)
        })
    },
    getTop10MerchantRefuseRateData () {
      let _this = this
      this.$http.get('/api/approveAnalysis/top10MerchantRefuseRate', {
        params: JSON.parse(JSON.stringify(_this.top10MerchantRefuseRateFormInline))
      }).then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            _this.tableData = response.data.data
          }
        }
      })
        .catch(function () {})
    },
    search () {
      let _this = this
      _this.getRefuseReasonChartData()
    },
    rejectFeatureSearch () {
      let _this = this
      _this.getRejectFeatureChartData()
    },
    top10MerchantRefuseRateSearch () {
      let _this = this
      _this.getTop10MerchantRefuseRateData()
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
.isNullTips{
  color: #C6D0D4;
  text-align: center;
  margin: 200px 0;
}
</style>
