<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-row class="rowMargin">
      <el-card id="rate">
        <el-row>
          <h4 style="color: #409EFF;margin: 0;text-align: left">进件量与借款人增长分析（近12个月）</h4>
        </el-row>
        <div id="rateChart" style="width: 100%;height:400px;overflow: auto"></div>
      </el-card>
    </el-row>
    <el-row class="rowMargin">
      <el-card>
        <el-row class="rowMargin">
          <h4 style="color: #409EFF;margin: 0;text-align: left">产品进件趋势分析</h4>
        </el-row>
        <el-form :inline="true" :model="productRateFormInline" label-position="left">
          <el-form-item label="时间">
            <el-date-picker
              v-model="productRateQueryTime"
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
            <el-button type="primary" @click="searchProductRateChartData">查询</el-button>
          </el-form-item>
        </el-form>
        <div id="productRateChart" style="width: 100%;height:400px;overflow: auto"></div>
      </el-card>
    </el-row>
  </el-row>
</template>

<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
export default {
  name: 'applyAnalysis',
  data () {
    return {
      title: '进件分析',
      rateFormInline: {
        startTime: '',
        endTime: ''
      },
      productRateFormInline: {
        startTime: '',
        endTime: ''
      },
      rateQueryTime: [],
      productRateQueryTime: [],
      rateOption: {
        tooltip: {
          trigger: 'axis',
          formatter: '{a}:{c}<br/>{a1}:{c1}<br/>{b}',
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
          data: ['进件数', '借款人数']
        },
        xAxis: [
          {
            type: 'category',
            name: '年月',
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
            name: '进件数',
            interval: 1,
            axisLabel: {
              formatter: '{value}'
            }
          }, {
            type: 'value',
            name: '借款人数',
            interval: 1,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '进件数',
            type: 'line',
            yAxisIndex: 0,
            data: []
          }, {
            name: '借款人数',
            type: 'bar',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      productRateOption: {
        tooltip: {
          trigger: 'axis',
          formatter: '{a}:{c}<br/>{a1}:{c1}<br/>{b}',
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
          data: ['贷款总金额（元）', '进件数']
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
            name: '贷款总金额（元）',
            axisLabel: {
              formatter: '{value}'
            }
          }, {
            type: 'value',
            name: '进件数',
            interval: 1,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '贷款总金额（元）',
            type: 'line',
            yAxisIndex: 0,
            data: []
          }, {
            name: '进件数',
            type: 'bar',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      total: 0,
      minDate: null,
      maxDate: null,
      pageNum: 1,
      pageSize: 5,
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
      _this.getRateChartData()
      _this.searchProductRateChartData()
    },
    inputFocus () {
      let _this = this
      if (_this.maxDate !== null) {
        _this.minDate = null
        _this.maxDate = null
      }
    },
    getRateChartData () {
      let _this = this
      let rateChart = echarts.init(document.getElementById('rateChart'))
      rateChart.setOption(_this.rateOption)
      this.$http.get('/api/applyAnalysis/rate').then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            rateChart.setOption({
              xAxis: {
                data: response.data.data.monthList
              },
              series: [{
                // 根据名字对应到相应的系列
                name: '进件数',
                data: response.data.data.applyList
              }, {
                // 根据名字对应到相应的系列
                name: '借款人数',
                data: response.data.data.personList
              }]
            })
          }
        }
      })
        .catch(function () {
          // console.log(err)
        })
    },
    getProductRateChartData () {
      let _this = this
      if (_this.productRateQueryTime !== null && _this.productRateQueryTime.length !== 0) {
        _this.productRateFormInline.startTime = _this.productRateQueryTime[0]
        _this.productRateFormInline.endTime = _this.productRateQueryTime[1]
      } else {
        _this.productRateQueryTime = [_this.$dateFormat(30, 1).startTime, _this.$dateFormat(30, 1).endTime]
        _this.productRateFormInline.startTime = _this.$dateFormat(30, 1).startTime
        _this.productRateFormInline.endTime = _this.$dateFormat(30, 1).endTime
      }
      let productRateChart = echarts.init(document.getElementById('productRateChart'))
      productRateChart.setOption(_this.productRateOption)
      this.$http.get('/api/applyAnalysis/product', {params: JSON.parse(JSON.stringify(_this.productRateFormInline))}).then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            productRateChart.setOption({
              xAxis: {
                data: response.data.data.applyDateList
              },
              series: [{
                // 根据名字对应到相应的系列
                name: '贷款总金额（元）',
                data: response.data.data.amountSumList
              }, {
                // 根据名字对应到相应的系列
                name: '进件数',
                data: response.data.data.applyCountList
              }]
            })
          }
        }
      })
        .catch(function () {
          // console.log(err)
        })
    },
    searchProductRateChartData () {
      let _this = this
      _this.getProductRateChartData()
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
