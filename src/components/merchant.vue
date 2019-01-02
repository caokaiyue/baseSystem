<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-form :inline="true" :model="formInline" label-position="left">
      <el-form-item label="商户编号">
        <el-input v-model="formInline.merchantId" placeholder="商户编号"></el-input>
      </el-form-item>
      <el-form-item label="组织机构信用代码">
        <el-input v-model="formInline.socialCreditNo" placeholder="组织机构信用代码"></el-input>
      </el-form-item>
      <el-form-item label="商户名称">
        <el-input v-model="formInline.merchantName" placeholder="商户名称"></el-input>
      </el-form-item>
      <el-form-item label="控制状态">
        <el-select
          clearable
          v-model="formInline.merchantState"
          placeholder="请选择">
          <el-option label="正常" value="ACTIVE"></el-option>
          <el-option label="锁定" value="LOCKED"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <template slot-scope="scope">
          <router-link
            :to="{name:'merchantAdd'}">
            <el-button size="medium">新增商户</el-button>
          </router-link>
        </template>
      </el-form-item>
      <div style="width: 100%">
        <el-table
          :data="tableData"
          fit
          stripe
          style="width: 100%">
          <el-table-column
            prop="merchantId"
            label="商户编号"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            prop="merchantName"
            label="商户名称"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="workAddress"
            label="工作地址"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="创建时间"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="legalPersonName"
            label="法人姓名"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="linkPersonName"
            label="联系人姓名"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="linkPersonPhone"
            label="联系人手机"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="socialCreditNo"
            label="统一社会信用代码"
            min-width="200">
          </el-table-column>
          <el-table-column
            label="商户状态"
            width="180">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.merchantState"
                :disabled="isMerchantStateLoading"
                @change="updateMerchantState(scope.row.merchantId, scope.row.merchantState)"
                active-text="正常"
                inactive-text="锁定">
              </el-switch>
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
  name: 'merchant',
  data () {
    return {
      title: '商户管理',
      tableData: [],
      formInline: {
        merchantId: '',
        socialCreditNo: '',
        merchantName: '',
        merchantState: ''
      },
      isMerchantStateLoading: false,
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
      this.$http.get('/api/wudiMerchant', {
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
              response.data.data.rows.forEach(item => {
                let condition = (item.merchantState === 'ACTIVE')
                item.merchantState = condition
              })
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
    updateMerchantState (merchantId, merchantState) {
      let _this = this
      _this.isMerchantStateLoading = true
      let _merchantState = (merchantState === true) ? 'ACTIVE' : 'LOCKED'
      _this.$http({
        method: 'put',
        url: '/api/wudiMerchant/' + merchantId,
        params: {
          merchantState: _merchantState
        }
      }).then(function (response) {
        _this.isMerchantStateLoading = false
        if (response.data.code === 4) {
          _this.$message({
            message: '长时间未操作，请重新登录',
            type: response.data.code === 0 ? 'success' : 'error',
            duration: 2000
          })
        }
      }).catch(function () {
        _this.isMerchantStateLoading = false
      })
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
