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
        <el-button type="primary" @click="showEdit">新增</el-button>
      </el-form-item>
      <!--<el-form-item>-->
        <!--<el-button type="primary" @click="deleteUser">删除</el-button>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
        <!--<el-button type="primary" @click="outputUser">导出</el-button>-->
      <!--</el-form-item>-->
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
            prop="userId"
            label="userId"
            v-if="false"
          >
          </el-table-column>
          <el-table-column
            prop="username"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="deptName"
            label="部门名称">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="手机">
          </el-table-column>
          <el-table-column
            prop="deptId"
            label="deptId"
            v-if="false"
            >
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            >
          </el-table-column>
          <el-table-column
            prop="roleIdList"
            label="roleIdList"
            v-if="false"
            >
          </el-table-column>
          <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">修改</el-button>
              <!--<el-button type="text" size="small" @click="showCurrentMessage(scope.row.id)">删除</el-button>-->
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
      :title="currentEditUser === 'add'?'新增':'修改'"
      :visible.sync="editVisible">
      <el-form
        ref="editUserFormInline"
        :model="editUserFormInline"
        :rules="editUserRules"
        label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserFormInline.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="所属部门">
            <el-popover
              placement="bottom-start"
              :ref="'deptNamePopover'"
              trigger="click">
              <div slot="reference">
                <el-input v-model="editUserFormInline.deptName" readonly placeholder="上级菜单">
                  <i slot="suffix" style="cursor: pointer" @click="clearHandler" class="el-input__icon el-icon-circle-close"></i>
                </el-input>
              </div>
              <el-tree :data="deptList" :expand-on-click-node="false" @node-click="handleNodeClick"></el-tree>
            </el-popover>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="editUserFormInline.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="editUserFormInline.confirmPassword" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="editUserFormInline.realName" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editUserFormInline.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
            <el-radio :label="-1">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserFormInline.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserFormInline.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="角色配置">
          <el-select
            v-model="editUserFormInline.roleIdList"
            multiple
            style="width:100%"
            placeholder="角色配置">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="editUserFormInline.status">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="editVisible = false">关 闭</el-button>
        <el-button type="primary" @click="submitEditUserForm(currentEditStatus === 'add'?'post':'put')">提交</el-button>
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
        userId: '',
        username: '',
        realName: '',
        gender: -1,
        email: '',
        mobile: '',
        deptId: 0,
        deptName: '一级部门',
        status: 1,
        roleIdList: []
      },
      editUserRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      },
      roleList: [],
      deptList: [],
      deleteUserList: [],
      total: 0,
      pageNum: 1,
      pageSize: 5
    }
  },
  methods: {
    init () {
      let _this = this
      _this.roleListInit()
      _this.deptListInit()
      _this.search()
    },
    request (formInline) {
      let _this = this
      this.$http.get(
        // '/api/user'
        '/api/admin/sys/user/page'
        , {params: JSON.parse(JSON.stringify(formInline))})
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
    roleListInit () {
      let _this = this
      this.$http.get(
        // '/api/menulist'
        '/api/admin/sys/role/list'
      )
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.digui(response.data.data)
              _this.roleList = response.data.data
            }
          }
        })
        .catch(function () {})
    },
    deptListInit () {
      let _this = this
      this.$http.get(
        // '/api/menulist'
        '/api/admin/sys/dept/list'
      )
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.digui(response.data.data)
              _this.deptList = response.data.data
            }
          }
        })
        .catch(function () {})
    },
    digui (arr) {
      let _this = this
      if (arr instanceof Array) {
        for (let i = 0; i < arr.length; i++) {
          arr[i].label = arr[i].name
          _this.digui(arr[i])
        }
      }
      if (arr instanceof Object) {
        _this.digui(arr.children)
      }
    },
    handleNodeClick (data) {
      let _this = this
      console.log(data)
      this.$refs['deptNamePopover'].doClose()
      _this.editUserFormInline.deptName = data.name
      _this.editUserFormInline.deptId = data.deptId
    },
    submitEditUserForm (condition) {
      let _this = this
      _this.$http({
        method: condition,
        url: '/api/admin/sys/user',
        data: _this.editUserFormInline
      }).then(function (response) {
        if (response.data.code !== null && response.data.code !== undefined) {
          if (response.data.code !== 0) {
            _this.$message({
              message: response.data.msg,
              type: response.data.code === 0 ? 'success' : 'error',
              duration: 2000
            })
          } else {
            _this.editVisible = false
            _this.search()
          }
        }
      }).catch(function () {})
    },
    showEdit (row) {
      let _this = this
      _this.resetForm()
      _this.currentEditStatus = row.userId ? 'edit' : 'add'
      if (row.userId) {
        _this.editUserFormInline = row
        _this.$http({
          method: 'get',
          url: '/api/admin/sys/user/' + row.userId
        }).then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.editUserFormInline.roleIdList = response.data.data.roleIdList
            }
          }
        }).catch(function () {})
      }
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
    },
    handleSelectionChange (val) {
      console.log(val)
      let _this = this
      _this.deleteUserList = []
      for (let i = 0; i < val.length; i++) {
        _this.deleteUserList.push(val[i].userId)
      }
    },
    clearHandler () {
      let _this = this
      _this.editUserFormInline.deptId = 0
      _this.editUserFormInline.deptName = '一级部门'
    },
    resetForm () {
      let _this = this
      _this.editUserFormInline = {
        userId: '',
        username: '',
        realName: '',
        gender: -1,
        email: '',
        mobile: '',
        deptId: 0,
        deptName: '一级部门',
        status: 1,
        roleIdList: []
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

</style>
