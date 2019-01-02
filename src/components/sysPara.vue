<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-form :inline="true" :model="formInline" label-position="left">
      <el-form-item label="参数标识">
        <el-input v-model="formInline.sysParaId" placeholder="参数标识"></el-input>
      </el-form-item>
      <el-form-item label="参数值">
        <el-input v-model="formInline.sysParaValue" placeholder="参数值"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>

      <div style="width: 100%">
        <el-table
          :data="tableData"
          fit
          stripe
          style="width: 100%">
          <el-table-column
            prop="sysParaId"
            label="参数标识"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="sysParaValue"
            label="参数值"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="sysParaDesc"
            label="参数描述"
            min-width="200">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            min-width="150" >
            <template slot-scope="scope">
              <router-link :to="{
                name:'sysParaEdit',
                params:{
                  sysParaId:scope.row.sysParaId
                }
              }">
                <el-button type="text" size="small">
                  编辑
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
  name: 'sysPara',
  data () {
    return {
      title: '系统参数管理',
      tableData: [],
      formInline: {
        sysParaId: '',
        sysParaValue: '',
        sysParaDesc: ''
      },
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
      this.$http.get('/api/sysPara', {
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
      _this.pageTo()
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
