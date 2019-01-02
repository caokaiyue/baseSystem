<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-row class="rowMargin">
      <el-card>
        <el-row class="rowMargin">
          <el-col :span="4"><span>申请单标识：</span></el-col>
          <el-col :span="8"><span>{{ formInline.applyId}}</span></el-col>
          <el-col :span="4"><span>审批标识：</span></el-col>
          <el-col :span="8"><span>{{ formInline.approveId }}</span></el-col>
        </el-row>
        <el-row class="rowMargin">
          <el-col :span="4"><span>流程标识：</span></el-col>
          <el-col :span="8"><span>{{ formInline.procId }}</span></el-col>
          <el-col :span="4"><span>流程实例标识：</span></el-col>
          <el-col :span="8"><span>{{ formInline.procInstanceId }}</span></el-col>
        </el-row>
        <el-row class="rowMargin">
          <el-col :span="4"><span>审批金额（元）：</span></el-col>
          <el-col :span="8"><span>{{ formInline.approveAmount }}</span></el-col>
          <el-col :span="4"><span>评分：</span></el-col>
          <el-col :span="8"><span>{{ formInline.applyScore }}</span></el-col>
        </el-row>
        <el-row class="rowMargin">
          <el-col :span="4"><span>系统审核结果：</span></el-col>
          <el-col :span="8"><span>{{ formInline.machineDecision }}</span></el-col>
          <el-col :span="4"><span>人工审核结果：</span></el-col>
          <el-col :span="8"><span>{{ formInline.manualDecision }}</span></el-col>
        </el-row>
        <el-row class="rowMargin">
          <el-col :span="4"><span>审批起始时间：</span></el-col>
          <el-col :span="8"><span>{{ formInline.approveStartTime }}</span></el-col>
          <el-col :span="4"><span>审批结束时间：</span></el-col>
          <el-col :span="8"><span>{{ formInline.approveEndTime }}</span></el-col>
        </el-row>
        <el-row class="rowMargin">
          <el-col :span="4"><span>审批状态：</span></el-col>
          <el-col :span="8"><span>{{ formInline.approveState }}</span></el-col>
          <el-col :span="4"><span>拒绝原因：</span></el-col>
          <el-col :span="8"><span>{{ formInline.refuseCode }}</span></el-col>
        </el-row>
        <el-row class="rowMargin">
          <el-col :span="4"><span>终审结果：</span></el-col>
          <el-col :span="8"><span>{{ formInline.finalDecision }}</span></el-col>
          <el-col :span="4"><span>审核人：</span></el-col>
          <el-col :span="8"><span>{{ formInline.approveUser }}</span></el-col>
        </el-row>
        <el-row class="rowMargin">
          <el-col :span="4"><span>审核备注：</span></el-col>
          <el-col :span="20"><span>{{ formInline.approveMemo }}</span></el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row class="rowMargin" style="text-align: center">
      <el-button @click="$router.go(-1)">返回</el-button>
    </el-row>
  </el-row>
</template>

<script>
export default {
  name: 'approvalHistoryDetails',
  data () {
    return {
      title: '审批历史详情',
      approveId: this.$route.params.approveId,
      formInline: {
        approveId: this.$route.params.approveId,
        staticDate: '',
        applyTotalCount: '',
        applyTotalAmount: '',
        applyAccumulateCount: '',
        applyAccumulateAmount: '',
        loanerAddCount: '',
        loanerAccumulateCount: '',
        approveAcceptCount: '',
        approveAcceptAmount: '',
        approveRejectCount: '',
        loanIssuedAmountTotal: '',
        loanRemainAmountTotal: '',
        overdueCountTotal: '',
        overdueAmountTotal: ''
      }
    }
  },
  methods: {
    init () {
      let _this = this
      if (!_this.approveId) {
        _this.$router.go(-1)
      } else {
        _this.getApprovalHistoryDetails()
      }
    },
    getApprovalHistoryDetails () {
      let _this = this
      this.$http.get('/api/approveProcessReport/' + _this.formInline.approveId + '/history').then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            _this.formInline = response.data.data
          }
        }
      })
        .catch(function () {
          // console.log(err)
        })
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
