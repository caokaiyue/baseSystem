<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-form :inline="true" :model="formInline" label-position="left">
      <el-form-item>
        <el-input v-model="formInline.username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUser">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="deleteUser">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="outputUser">导出</el-button>
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
            prop="username"
            label="username">
          </el-table-column>
          <el-table-column
            prop="realName"
            label="realName">
          </el-table-column>
          <el-table-column
            prop="headUrl"
            label="headUrl">
          </el-table-column>
          <el-table-column
            prop="gender"
            label="gender">
          </el-table-column>
          <el-table-column
            prop="email"
            label="email"
            >
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="mobile"
            >
          </el-table-column>
          <el-table-column
            prop="deptId"
            label="deptId"
            >
          </el-table-column>
          <el-table-column
            prop="superAdmin"
            label="superAdmin"
            >
          </el-table-column>
          <el-table-column
            prop="status"
            label="status"
            >
          </el-table-column>
          <el-table-column
            prop="remark"
            label="remark"
            >
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="createDate"
            >
          </el-table-column>
          <el-table-column
            prop="roleIdList"
            label="roleIdList"
            >
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="deptName"
            >
          </el-table-column>
          <el-table-column
            prop="message"
            label="message"
            >
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
        ref="editUserFormInline"
        :model="editUserFormInline"
        :rules="editUserRules"
        label-width="120px">
        <el-form-item label="用户名" required="true">
          <el-input v-model="editUserFormInline.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" required="true">
          <el-input v-model="editUserFormInline.deptName" placeholder="所属部门"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editUserFormInline.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="editUserFormInline.confirmPassword" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" required="true">
          <el-input v-model="editUserFormInline.realName" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editUserFormInline.gender">
            <el-radio :label="3">男</el-radio>
            <el-radio :label="6">女</el-radio>
            <el-radio :label="9">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" required="true">
          <el-input v-model="editUserFormInline.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" required="true">
          <el-input v-model="editUserFormInline.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="角色配置">
          <el-select
            v-model="editUserFormInline.roleIdList"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="角色配置">
            <el-option
              v-for="item in roleIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="editUserFormInline.status">
            <el-radio :label="3">停用</el-radio>
            <el-radio :label="6">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">关 闭</el-button>
        <el-button type="primary" @click="submitEditUserForm">提交</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  name: 'User',
  data () {
    return {
      title: '用户管理',
      editVisible: false,
      deleteVisible: false,
      currentEditUser: 'add',
      tableData: [],
      formInline: {},
      editUserFormInline: {
        id: '',
        username: '',
        realName: '',
        headUrl: null,
        gender: 0,
        email: '',
        mobile: '',
        deptId: '',
        superAdmin: 0,
        status: 1,
        remark: null,
        createDate: '',
        roleIdList: null,
        deptName: ''
      },
      editUserRules: {
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
      this.$http.get('/api/user', {
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
    submitEditUserForm () {
      let _this = this
      console.log(JSON.stringify(_this.editUserFormInline))
      this.$refs['editUserFormInline'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          return false
        }
      })
    },
    addUser () {
      let _this = this
      _this.currentEditUser = 'add'
      _this.editUserFormInline = {
        id: '',
        username: '',
        realName: '',
        headUrl: null,
        gender: 0,
        email: '',
        mobile: '',
        deptId: '',
        superAdmin: 0,
        status: 1,
        remark: null,
        createDate: '',
        roleIdList: null,
        deptName: ''
      }
      _this.editVisible = true
    },
    showEdit (data) {
      let _this = this
      _this.currentEditUser = 'edit'
      _this.editUserFormInline = data
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
