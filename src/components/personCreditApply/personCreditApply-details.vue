<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-form :inline="true" :model="formInline" label-position="left">
      <el-row class="rowMargin">
        <el-card>
          <div slot="header" class="clearfix">
            <h4 style="color: #409EFF;margin: 0">进件概要信息</h4>
          </div>
            <el-row class="rowMargin">
              <el-col :span="8">
                <el-form-item label="进件单号：">
                  <span>{{ formInline.applyId}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="渠道订单编号：">
                  <span>{{ formInline.channelOrderId}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowMargin">
              <el-col :span="8">
                <el-form-item label="商户名称：">
                  <span>{{ formInline.merchantName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产品名称：">
                  <span>{{ formInline.productName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowMargin">
              <el-col :span="8">
                <el-form-item label="贷款申请总额（元）：">
                  <span>{{ formInline.loanApplyAmount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="贷款申请状态：">
                  <span>{{ formInline.loanApplyState}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="rowMargin">
              <el-col :span="8">
                <el-form-item label="还款类型：">
                  <span>{{ formInline.repaymentType}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="进件创建时间：">
                  <span>{{ formInline.createTimestamp}}</span>
                </el-form-item>
              </el-col>
            </el-row>
        </el-card>
      </el-row>
      <el-row class="rowMargin">
      <el-card>
        <div slot="header" class="clearfix">
          <h4 style="color: #409EFF;margin: 0">申请人概要信息</h4>
        </div>
        <el-row class="rowMargin">
          <el-col :span="8">
            <el-form-item label="真实姓名：">
              <span>{{ formInline.realName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证号码：">
              <span>{{ formInline.identityCardNum}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="rowMargin">
          <el-col :span="8">
            <el-form-item label="性别：">
              <span>{{ formInline.gender}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码：">
              <span>{{ formInline.phone}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="rowMargin">
          <el-col :span="8">
            <el-form-item label="学历：">
              <span>{{ formInline.education}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职业：">
              <span>{{ formInline.professional}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="rowMargin">
          <el-col :span="8">
            <el-form-item label="地址详情：">
              <span>{{ formInline.homeAddressDetail}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
      <el-row class="rowMargin" style="text-align: center">
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-row>
    </el-form>
  </el-row>
</template>
<script>
export default {
  name: 'personCreditApplyDetails',
  data () {
    return {
      title: '进件详情',
      applyId: this.$route.params.applyId,
      formInline: {
        applyId: this.$route.params.applyId,
        channelOrderID: '',
        repaymentType: '',
        createTimestamp: '',
        updateTimestamp: '',
        merchantName: '',
        productName: '',
        loanApplyAmount: '',
        loanApplyState: '',
        realName: '',
        identityCardNum: '',
        phone: '',
        gender: '',
        education: '',
        professional: '',
        homeAddressDetail: ''
      }
    }
  },
  methods: {
    init () {
      let _this = this
      if (!_this.applyId) {
        _this.$router.go(-1)
      } else {
        _this.getApplyDetails()
      }
    },
    getApplyDetails () {
      let _this = this
      this.$http.get('/api/creditLoanApply/' + _this.formInline.applyId).then(function (response) {
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
