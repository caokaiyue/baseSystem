<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-form :inline="true" :model="formInline" label-position="left">
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      <div style="width: 100%">
        <el-table
          :data="tableData"
          @expand-change="haha"
          row-key=""
          fit
          stripe
          style="width: 100%">
          <el-table-column
            type="expand"
            min-width="50">
            <template slot-scope="scope">
              <!--<el-table-->
              <!--:data="tableData.children.children"-->
              <!--fit-->
              <!--stripe-->
              <!--style="width: 100%">-->
              <!--<el-table-column-->
              <!--v-for="(item, key) in tableData.children.children"-->
              <!--:key="item.id"-->
              <!--:prop="key"-->
              <!--:label="key"-->
              <!--min-width="200">-->
              <!--</el-table-column>-->
              <!--</el-table>-->
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="name"
            min-width="150"
          >
          </el-table-column>
          <el-table-column
            prop="url"
            label="url"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="type"
            label="type"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="icon"
            label="icon"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="permissions"
            label="permissions"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="sort"
            label="sort"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="createDate"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="resourceList"
            label="resourceList"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="parentName"
            label="parentName"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="message"
            label="message"
            min-width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showCurrentMessage(scope.row.message)">message详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <el-dialog
      :append-to-body="true"
      title="message概览"
      :visible.sync="messageVisible">
      <div v-html="currentMessage.replace(/\n/g,'<br/>')">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="messageVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  name: 'Department',
  data () {
    return {
      title: '部门管理',
      messageVisible: false,
      currentMessage: '',
      tableData: [],
      formInline: {}
    }
  },
  methods: {
    init () {
      let _this = this
      _this.search()
    },
    haha () {
      console.log('haha')
    },
    request (formInline) {
      let _this = this
      this.$http.get('/api/menu', {
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
              _this.tableData = response.data[0].data
            }
          }
          _this.tableData = response.data[0].data
        })
        .catch(function () {
          // console.log(err)
        })
    },
    digui (arr) {
      let _this = this
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children.length > 0) {
          _this.digui(arr[i].children)
        }
      }
    },
    showCurrentMessage (currentMessage) {
      let _this = this
      _this.currentMessage = currentMessage
      _this.messageVisible = true
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
