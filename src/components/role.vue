<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-form :inline="true" :model="formInline" label-position="left">
      <el-form-item>
        <el-input v-model="formInline.username" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addRole">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="deleteRole">删除</el-button>
      </el-form-item>
      <div style="width: 100%">
        <el-table
          :data="tableData"
          fit
          stripe
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="id"
            label="id"
            v-if="false"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="name">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="createDate">
          </el-table-column>
          <el-table-column
            prop="menuIdList"
            label="menuIdList"
            v-if="false"
          >
          </el-table-column>
          <el-table-column
            prop="deptIdList"
            label="deptIdList"
            v-if="false"
          >
          </el-table-column>
          <el-table-column label="操作" min-width="50">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="showCurrentMessage(scope.row.id)">删除</el-button>
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
    <el-dialog
      :append-to-body="true"
      title="修改"
      :visible.sync="editVisible">
      <el-form
        ref="editRoleFormInline"
        :model="editRoleFormInline"
        :rules="changeRoleRules"
        label-width="120px">
        <el-form-item label="名称" required="true">
          <el-input v-model="editRoleFormInline.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" required="true">
          <el-input v-model="editRoleFormInline.remark" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">关 闭</el-button>
        <el-button type="primary" @click="submitEditRoleForm">提交</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  name: 'Role',
  data () {
    return {
      title: '角色管理',
      editVisible: false,
      deleteVisible: false,
      currentEditRole: 'add',
      tableData: [],
      formInline: {},
      editRoleFormInline: {
        id: '',
        name: '',
        remark: '',
        menuIdList: null,
        deptIdList: null
      },
      editRoleRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
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
      this.$http.get('/api/role', {
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
          _this.tableData = response.data[0].data.list
          _this.total = response.data[0].data.total
        })
        .catch(function () {
          // console.log(err)
        })
    },
    submitEditRoleForm () {
      let _this = this
      console.log(JSON.stringify(_this.editRoleFormInline))
      this.$refs['editRoleFormInline'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          return false
        }
      })
    },
    addRole () {
      let _this = this
      _this.currentEditRole = 'add'
      _this.editRoleFormInline = {
        id: '',
        name: '',
        remark: '',
        menuIdList: null,
        deptIdList: null
      }
      _this.editVisible = true
    },
    showEdit (data) {
      let _this = this
      _this.currentEditRole = 'edit'
      _this.editRoleFormInline = data
      _this.editVisible = true
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
