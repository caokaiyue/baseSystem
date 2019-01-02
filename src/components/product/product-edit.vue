<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-form ref="formInline" :model="formInline" label-width="150px">
      <el-tabs
        type="border-card"
        style="min-height: 400px"
        v-model="activeName">
        <el-tab-pane label="产品详情" name="1">
          <el-row class="rowMargin">
            <el-col :span="8" :offset="8">
              <el-form-item label="产品名称">
                <span>{{ formInline.productName }}</span>
              </el-form-item>
              <el-form-item label="限额（元）">
                <el-input v-model="formInline.limitAmount"></el-input>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ formInline.createTimestamp }}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ formInline.updateTimestamp }}</span>
              </el-form-item>
              <el-form-item label="产品状态">
                <span>{{ formInline.productState }}</span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button @click="$router.push('/home/product')">返回</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="规则查询" name="2">
          <el-table
            :data="rulesList"
            fit
            stripe
            style="width: 100%">
            <el-table-column
              prop="ruleCode"
              label="规则码"
              min-width="200"
              v-if="false"
            >
            </el-table-column>
            <el-table-column
              prop="ruleName"
              label="规则名称"
              min-width="150">
            </el-table-column>
            <el-table-column
              prop="ruleModel"
              label="规则模式"
              min-width="200">
            </el-table-column>
            <el-table-column
              prop="rulePriority"
              label="优先级"
              min-width="200">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              min-width="100" >
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editRule(scope.row)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-dialog
      :append-to-body="true"
      title="规则详情"
      :visible.sync="editRuleVisible">
      <el-form :model="ruleInfo" ref="ruleInfo" label-width="150px">
        <el-row>
          <el-col :offset="1" :span="20">
            <el-form-item label="规则名称：" prop="ruleName">
              <span> {{ ruleInfo.ruleName }}</span>
            </el-form-item>
            <el-form-item label="优先级：" prop="rulePriority">
              <span> {{ ruleInfo.rulePriority }}</span>
            </el-form-item>
            <el-form-item label="模式：" prop="rulePriority">
              <span> {{ ruleInfo.ruleModel }}</span>
            </el-form-item>
            <el-form-item label="条件：" prop="rulePriority">
              <p style="margin: 0"> {{ ruleInfo.ruleCondition }}</p>
            </el-form-item>
            <!--<el-form-item label="模式" prop="ruleModel">-->
              <!--<el-select-->
                <!--v-model="ruleInfo.ruleModel"-->
                <!--placeholder="请选择">-->
                <!--<el-option label="TRUE" value="true"></el-option>-->
                <!--<el-option label="FALSE" value="false"></el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="条件" prop="ruleCondition">-->
              <!--<el-input type="textarea" v-model="ruleInfo.ruleCondition" auto-complete="off" rows="10"/>-->
            <!--</el-form-item>-->
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="editRuleVisible = false">取 消</el-button>-->
        <el-button @click="editRuleVisible = false">关 闭</el-button>
        <!--<el-button type="primary" @click="submitProductRule">确 定</el-button>-->
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  name: 'productEdit',
  data () {
    return {
      title: '产品配置',
      activeName: '1',
      productId: this.$route.params.productId,
      formInline: {
        productId: this.$route.params.productId,
        userName: '',
        realName: '',
        identityCardNumber: '',
        phone: '',
        email: ''
      },
      ruleInfo: {},
      rulesList: [],
      editRuleVisible: false
    }
  },
  methods: {
    init () {
      let _this = this
      if (!_this.productId) {
        _this.$router.go(-1)
      } else {
        _this.getProductInfo()
        _this.getRules()
      }
    },
    getProductInfo () {
      let _this = this
      this.$http.get('/api/product/' + _this.formInline.productId).then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            _this.formInline = response.data.data
            // _this.roleList = response.data.data.roleList
            // delete _this.formInline.roleName
          }
        }
      })
        .catch(function () {
          // console.log(err)
        })
    },
    getRules () {
      let _this = this
      // let formData = JSON.stringify({productId: _this.formInline.productId})
      this.$http.get('/api/product/' + _this.formInline.productId + '/admittanceRule')
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              for (let i = 0; i < response.data.data.length; i++) {
                response.data.data[i]['ruleModel'] += ''
              }
              _this.rulesList = response.data.data
            }
          }
        })
        .catch(function () {
          // console.log(err)
        })
    },
    editRule (ruleInfo) {
      let _this = this
      _this.editRuleVisible = true
      _this.ruleInfo = ruleInfo
    },
    // submitProductRule () {
    //   let _this = this
    //   this.$http({
    //     url: '/api/product/' + _this.formInline.productId + '/updateRule',
    //     method: 'put',
    //     data: JSON.parse(JSON.stringify(_this.ruleInfo))
    //   })
    //     .then(function (response) {
    //       if (response.data.code !== null && response.data.code !== undefined) {
    //         _this.$message({
    //           message: response.data.msg,
    //           type: response.data.code === 0 ? 'success' : 'error',
    //           duration: 2000
    //         })
    //         if (response.data.code === 0) {
    //           _this.editRuleVisible = false
    //           _this.getRules()
    //           // _this.$router.push('/home/product')
    //         }
    //       }
    //     })
    //     .catch(function () {
    //       // console.log(err)
    //     })
    // },
    onSubmit () {
      let _this = this
      this.$http({
        url: '/api/product/' + _this.formInline.productId,
        method: 'put',
        params: {limitAmount: _this.formInline.limitAmount}
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
              _this.$router.push('/home/product')
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
