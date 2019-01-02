<template>
  <div style="height: 100%;">
    <div style="height: 60%;overflow-y: auto;padding-right: 20px;">
      <el-row class="rowMargin">
        <el-card>
          <div slot="header" class="clearfix">
            <h4 style="color: #409EFF;margin: 0">审核概要信息</h4>
          </div>
          <!--<el-row class="rowMargin">-->
            <!--<el-col :span="4"><span>进件时间：</span></el-col>-->
            <!--<el-col :span="4"><span>{{ approveData.applySummary.loanApplyDate + '?' }}</span></el-col>-->
          <!--</el-row>-->
          <el-row class="rowMargin">
            <el-col :span="4"><span>进件单号：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.applyId}}</span></el-col>
            <el-col :span="4"><span>审核单号：</span></el-col>
            <el-col :span="4"><span>{{ approveData.approveId }}</span></el-col>
            <el-col :span="4"><span>审核起始时间：</span></el-col>
            <el-col :span="4"><span>{{ approveData.approveStartTime }}</span></el-col>
          </el-row>
          <el-row class="rowMargin">
            <el-col :span="4"><span>渠道名称：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.channelName }}</span></el-col>
          <el-col :span="4"><span>产品名称：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.productName }}</span></el-col>
          </el-row>
        </el-card>
      </el-row>
      <el-row class="rowMargin">
        <el-card>
          <div slot="header" class="clearfix">
            <h4 style="color: #409EFF;margin: 0">借贷交易信息</h4>
          </div>
          <el-row class="rowMargin">
            <el-col :span="4"><span>借款金额（元）：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.loanApplyAmount }}</span></el-col>
            <el-col :span="4"><span>借款期数（月）：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.loanPeriod }}</span></el-col>
            <el-col :span="4"><span>年化利率（%）：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.loanRate }}</span></el-col>
          </el-row>
          <el-row class="rowMargin">
            <el-col :span="4"><span>申请借款日期：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.loanApplyDate }}</span></el-col>
            <el-col :span="4"><span>借款用途：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.loanPurpose }}</span></el-col>
          </el-row>
          <el-row class="rowMargin">
            <el-col :span="4"><span>准驾车型：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.permitClass }}</span></el-col>
            <el-col :span="4"><span>车辆品牌型号：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.carBrandType }}</span></el-col>
            <el-col :span="4"><span>商户名称：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.merchantName }}</span></el-col>
          </el-row>
          <el-row class="rowMargin">
            <el-col :span="4"><span>驾驶证有效期：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.validPeriod }}</span></el-col>
            <el-col :span="4"><span>渠道端订单编号：</span></el-col>
            <el-col :span="4">
              <el-button type="text" :disabled="isTranOrderInfo" style="margin: 0;padding: 0" @click="getTranOrderInfo">
                {{ approveData.applySummary.channelOrderId }}
                <span class="el-icon-info"></span>
              </el-button>
            </el-col>
            <el-col :span="4"><span>渠道订单hash值：</span></el-col>
            <el-col :span="4"><span>{{ approveData.applySummary.channelOrderHash }}</span></el-col>
          </el-row>
        </el-card>
      </el-row>
      <el-row class="rowMargin">
        <el-card>
          <div slot="header" class="clearfix">
            <h4 style="color: #409EFF;margin: 0">申请单信息</h4>
          </div>
          <el-tabs type="border-card" v-model="activeName" style="box-sizing: border-box;height: 100%;overflow-y: auto">
            <el-tab-pane label="借款人基本信息" name="1">
              <el-row class="rowMargin">
                <el-col :span="4"><span>姓名：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.realName }}</span></el-col>
                <el-col :span="4"><span>年龄：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.age }}</span></el-col>
                <el-col :span="4"><span>身份证号码：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.identityCardNum }}</span></el-col>
              </el-row>
              <el-row class="rowMargin">
                <el-col :span="4"><span>户籍省：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.censusProvince }}</span></el-col>
                <el-col :span="4"><span>户籍市：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.censusCity }}</span></el-col>
                <el-col :span="4"><span>户籍区：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.censusDistrict }}</span></el-col>
              </el-row>
              <el-row class="rowMargin">
                <el-col :span="4"><span>户籍具体地址：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.censusAddress }}</span></el-col>
                <el-col :span="4"><span>学历：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.education }}</span></el-col>
                <el-col :span="4"><span>婚姻状况：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.maritalStatus }}</span></el-col>
              </el-row>
              <el-row class="rowMargin">
                <el-col :span="4"><span>职业身份：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.professional }}</span></el-col>
                <el-col :span="4"><span>手机号码：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.phone }}</span></el-col>
                <el-col :span="4"><span>邮箱地址：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.email }}</span></el-col>
              </el-row>
              <el-row class="rowMargin">
                <el-col :span="4"><span>居住地省：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.homeAddressProvince }}</span></el-col>
                <el-col :span="4"><span>居住地市：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.homeAddressCity }}</span></el-col>
                <el-col :span="4"><span>居住地区：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.homeAddressDistrict }}</span></el-col>
              </el-row>
              <el-row class="rowMargin">
                <el-col :span="4"><span>居住地地址：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.homeAddressDetail }}</span></el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="借款人工作信息" name="2">
              <el-row class="rowMargin">
                <el-col :span="4"><span>工作单位名称：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.companyName }}</span></el-col>
                <el-col :span="4"><span>公司行业：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.companyIndustry }}</span></el-col>
              </el-row>
              <el-row class="rowMargin">
                <el-col :span="4"><span>职位：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.position }}</span></el-col>
                <el-col :span="4"><span>单位固定电话：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.companyPhone }}</span></el-col>
                <el-col :span="4"><span>工作单位所在省：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.workProvince }}</span></el-col>
              </el-row>
              <el-row class="rowMargin">
                <el-col :span="4"><span>工作单位所在市：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.workCity }}</span></el-col>
                <el-col :span="4"><span>工作单位所在区：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.workDistrict }}</span></el-col>
                <el-col :span="4"><span>工作单位地址：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.workAddress }}</span></el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="借款人联系人信息" name="3">
              <el-row class="rowMargin">
                <el-col :span="24">第一联系人</el-col>
              </el-row>
              <el-row class="rowMargin">
              <el-col :span="4"><span>姓名：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.contactsName1 }}</span></el-col>
                <el-col :span="4"><span>身份证号码：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.contactsIdCard1 }}</span></el-col>
                <el-col :span="4"><span>手机号码：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.contactsPhone1 }}</span></el-col>
              </el-row>
              <el-row class="rowMargin">
                <el-col :span="4"><span>关系：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.contactsRelationship1 }}</span></el-col>
              </el-row>
              <el-row class="rowMargin">
                <el-col :span="24">第二联系人</el-col>
              </el-row>
              <el-row class="rowMargin">
                <el-col :span="4"><span>姓名：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.contactsName2 }}</span></el-col>
                <el-col :span="4"><span>手机号码：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.contactsPhone2 }}</span></el-col>
                <el-col :span="4"><span>关系：</span></el-col>
                <el-col :span="4"><span>{{ approveData.lonerInfo.contactsRelationship2 }}</span></el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="借款方机构信息" name="4" v-if="approveData.applySummary.productId === '111'">
              <el-row class="rowMargin">
                <el-col :span="4"><span>机构地址：</span></el-col>
                <el-col :span="4"><span>{{ approveData.loanOrgInfo.cuOrgAddress }}</span></el-col>
                <el-col :span="4"><span>机构社会信用代码：</span></el-col>
                <el-col :span="4"><span>{{ approveData.loanOrgInfo.cuOrgCreditNum }}</span></el-col>
              </el-row>
              <el-row class="rowMargin">
                <el-col :span="4"><span>机构名称：</span></el-col>
                <el-col :span="4"><span>{{ approveData.loanOrgInfo.cuOrgName }}</span></el-col>
                <el-col :span="4"><span>机构联系电话：</span></el-col>
                <el-col :span="4"><span>{{ approveData.loanOrgInfo.cuOrgPhone }}</span></el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="影像资料" name="5">
              <el-row>
                <el-col :span="6" v-for="(item, index) in approveData.urlList" :key="index">
                  <el-card style="width: 80%;margin: 0 auto">
                    <img @click="imgPreview(index)" :src="index" style="width:100%;height: 200px">
                    <div style="padding: 14px;">
                      <span>{{item}}</span>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-row>
      <el-row class="rowMargin">
        <el-card>
          <div slot="header" class="clearfix">
            <h4 style="color: #409EFF;margin: 0">风险提示信息</h4>
          </div>
          <el-row class="rowMargin">
            <div style="width: 100%">
              <el-table
                :data="approveData.riskTip"
                fit
                stripe
                style="width: 100%">
                <el-table-column
                  prop="riskItemName"
                  label="风险名称"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="riskDesc"
                  label="风险描述"
                  min-width="200">
                </el-table-column>
                <el-table-column
                  prop="riskLevel"
                  label="风险等级"
                  fixed="right"
                  width="100">
                  <template slot-scope="scope">
                    <el-tag
                      size="small"
                      :type="riskLevelStyle(scope.row.riskLevel)"
                      disable-transitions>
                      {{scope.row.riskLevel}}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-row>
        </el-card>
      </el-row>
    </div>
    <div style="height: 40%;width: 100%;padding-top: 20px;background-color: rgb(242,242,242);z-index: 99;">
      <el-row>
        <el-form ref="formInline" :model="formInline" label-width="150px" :rules="rules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="决策结果">
                <el-select
                  v-model="formInline.decision"
                  @change="selectResult"
                  placeholder="请选择">
                  <el-option label="通过" value="ACCEPT"></el-option>
                  <el-option label="拒绝" value="REJECT"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="拒绝原因类型">
                <el-select
                  v-model="refuseReasonType"
                  @change="getRefuseReasonList"
                  :disabled="formInline.decision !== 'REJECT'"
                  placeholder="请选择">
                  <el-option label="申请人基本资料原因" value="20"></el-option>
                  <el-option label="申请人征信情况原因" value="21"></el-option>
                  <el-option label="其他原因" value="22"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="拒绝原因" prop="refuseCode">
                <el-select
                  v-model="formInline.refuseCode"
                  @change="resetValidate"
                  :disabled="formInline.decision !== 'REJECT'"
                  placeholder="请选择">
                  <el-option :label="item.name"  v-for="item in refuseReasonList" :key="item.id" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="rowMargin">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input type="textarea" v-model="formInline.memo" rows="5"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="rowMargin">
            <el-col :span="8" style="text-align: center">
              <el-button type="primary" :disabled="submitLoading" @click="onSubmit">提交</el-button>
            </el-col>
            <el-col :span="8" style="text-align: center">
              <el-button @click="$router.push('/home/workspace')">返回</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
    </div>
    <el-dialog
      width="80%"
      title="图像预览"
      @closed="closeImgDialog"
      :visible.sync="imgVisible">
      <div style="text-align: center;width: 100%;height: 100%">
        <img id="imgObj" :src="imgUrl" :style="{
          'max-height': imgHeight,
          'transform': 'rotate(' +imgDegree + 'deg)',
          '-ms-transform': 'rotate(' +imgDegree + 'deg)',
          '-moz-transform': 'rotate(' +imgDegree + 'deg)',
          '-webkit-transform': 'rotate(' +imgDegree + 'deg)',
          '-o-transform': 'rotate(' +imgDegree + 'deg)'
           }" alt="...">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeDegree">旋转</el-button>
        <el-button @click="imgVisible = false">返回</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="80%"
      title="链上信息"
      :visible.sync="tranOrderInfoVisible">
      <el-row>
        <el-col :span="12" v-for="(item, index) in tranOrderInfo" :key="item.index">
          <el-col :span="12">
            <strong>{{index}}:</strong>
          </el-col>
          <el-col :span="12">
            <span>{{item}}</span>
          </el-col>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tranOrderInfoVisible = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'manualApprove',
  data () {
    return {
      activeName: '1',
      approveId: this.$route.params.approveId,
      approveData: {
        applySummary: {},
        approveId: '',
        taskId: '',
        approveStartTime: '',
        lonerInfo: {},
        riskTip: [],
        urlList: []
      },
      tranOrderInfo: {},
      isTranOrderInfo: false,
      formInline: {
        taskId: '',
        decision: 'REJECT',
        refuseCode: '',
        memo: ''
      },
      rules: {
        refuseCode: [
          { required: true, message: '请输入拒绝原因', trigger: 'blur' }
        ]
      },
      tableData: [],
      refuseReasonType: '',
      refuseReasonList: [],
      imgVisible: false,
      tranOrderInfoVisible: false,
      imgUrl: '',
      imgDegree: 0,
      imgHeight: '500px',
      submitLoading: false
    }
  },
  methods: {
    init () {
      let _this = this
      if (sessionStorage.currentApproveId) {
        _this.approveId = sessionStorage.currentApproveId
      } else {
        sessionStorage.setItem('currentApproveId', _this.approveId)
      }
      _this.getSysPara()
      _this.show = true
    },
    getSysPara () {
      let _this = this
      this.$http.get('/api/manualApprove/' + _this.approveId)
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.approveData = response.data.data
            }
          }
        })
        .catch(function () {})
    },
    getTranOrderInfo () {
      let _this = this
      _this.isTranOrderInfo = true
      this.$http.get('/api/manualApprove/tranOrderInfo', {
        params: JSON.parse(JSON.stringify(
          {
            channelOrderId: _this.approveData.applySummary.channelOrderId,
            channelOrderHash: _this.approveData.applySummary.channelOrderHash
          }
        ))
      })
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.tranOrderInfo = response.data.data
              _this.tranOrderInfoVisible = true
            }
          }
          _this.isTranOrderInfo = false
        })
        .catch(function () {
          _this.isTranOrderInfo = false
        })
    },
    imgPreview (url) {
      let _this = this
      _this.imgVisible = true
      _this.imgUrl = url
    },
    riskLevelStyle (riskLevel) {
      let riskLevelWords = ''
      switch (riskLevel) {
        case '低':
          riskLevelWords = ''
          break
        case '中':
          riskLevelWords = 'warning'
          break
        case '高':
          riskLevelWords = 'danger'
          break
      }
      return riskLevelWords
    },
    selectResult () {
      let _this = this
      if (_this.formInline.decision === 'ACCEPT') {
        _this.formInline.refuseCode = ''
        _this.refuseReasonType = ''
      }
    },
    getRefuseReasonList () {
      let _this = this
      _this.formInline.refuseCode = ''
      let refuseReasonType = {
        refuseReasonType: _this.refuseReasonType
      }
      this.$http({
        url: '/api/refuseReason',
        method: 'get',
        params: refuseReasonType
      })
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.refuseReasonList = response.data.data
            }
          }
        })
        .catch(function (err) {
          return err
        })
    },
    postApproveInfo () {
      let _this = this
      _this.submitLoading = true
      _this.formInline.taskId = _this.approveData.taskId
      this.$http({
        url: '/api/manualApprove/' + _this.approveId + '/approve',
        method: 'post',
        data: JSON.parse(JSON.stringify(_this.formInline))
      })
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            _this.submitLoading = false
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
            if (response.data.code === 0) {
              _this.$router.push('/home/workspace')
            }
          }
        })
        .catch(function () {
          _this.submitLoading = false
        })
    },
    changeDegree () {
      let _this = this
      let imgObj = document.getElementById('imgObj')
      console.log(imgObj.height)
      if (_this.imgDegree === 270) {
        _this.imgDegree = 0
      } else {
        _this.imgDegree += 90
      }
    },
    closeImgDialog () {
      let _this = this
      _this.imgDegree = 0
    },
    resetValidate () {
      this.$refs['formInline'].clearValidate()
    },
    onSubmit () {
      let _this = this
      this.$refs['formInline'].clearValidate()
      if (_this.formInline.decision === 'ACCEPT') {
        _this.postApproveInfo()
      } else {
        this.$refs['formInline'].validate((valid) => {
          if (valid) {
            _this.postApproveInfo()
          } else {
            return false
          }
        })
      }
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
  .el-tab-pane{
    padding: 5px;
  }
</style>
