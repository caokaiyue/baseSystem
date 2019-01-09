<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-form :inline="true" :model="formInline" label-position="left">
      <el-form-item>
        <el-input v-model="formInline.roleName" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="showEdit">新增</el-button>
      </el-form-item>
      <!--<el-form-item>-->
        <!--<el-button type="primary" @click="deleteRole">删除</el-button>-->
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
            prop="roleId"
            label="roleId"
            v-if="false"
          >
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="roleName">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="createTime">
          </el-table-column>
          <el-table-column
            prop="menuIdList"
            label="menuIdList"
            v-if="false"
          >
          </el-table-column>
          <el-table-column label="操作" min-width="50">
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
      :title="currentEditStatus === 'add'?'新增':'修改'"
      :visible.sync="editVisible">
      <el-form
        ref="editRoleFormInline"
        :model="editRoleFormInline"
        label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="editRoleFormInline.roleName" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editRoleFormInline.remark" placeholder="备注"></el-input>
        </el-form-item>
        <el-form-item label="菜单授权">
            <el-tree
              show-checkbox
              accordion
              :auto-expand-parent="false"
              :default-checked-keys="editRoleFormInline.menuIdList"
              node-key="menuId"
              @check="handleCheckChange"
              :data="menuList"
              :expand-on-click-node="false">
            </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">关 闭</el-button>
        <el-button type="primary" @click="submitEditRoleForm(currentEditStatus === 'add'?'post':'put')">提交</el-button>
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
      currentEditStatus: 'add',
      tableData: [],
      formInline: {
        roleName: ''
      },
      editRoleFormInline: {
        id: '',
        roleName: '',
        remark: '',
        menuIdList: []
      },
      editRoleRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      },
      menuList: [],
      total: 0,
      pageNum: 1,
      pageSize: 5
    }
  },
  methods: {
    init () {
      let _this = this
      _this.menuListInit()
      _this.search()
    },
    menuListInit () {
      let _this = this
      this.$http.get(
        // '/api/menulist'
        '/api/admin/sys/menu/list'
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
              _this.menuList = response.data.data
            }
          }
        })
        .catch(function () {})
    },
    request (formInline) {
      let _this = this
      this.$http.get('/api/admin/sys/role/page', {
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
    handleCheckChange (data, checkNodes) {
      let _this = this
      let checkedNodes = checkNodes.checkedNodes
      _this.editRoleFormInline.menuIdList = []
      for (let i = 0; i < checkedNodes.length; i++) {
        // console.log(checkedNodes[i].menuId)
        _this.editRoleFormInline.menuIdList.push(checkedNodes[i].menuId)
      }
    },
    submitEditRoleForm (condition) {
      let _this = this
      _this.$http({
        method: condition,
        url: '/api/admin/sys/role',
        data: _this.editRoleFormInline
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
            // _this.resetForm('editRoleFormInline')
            _this.search()
          }
        }
      }).catch(function () {})
    },
    showEdit (row) {
      let _this = this
      _this.currentEditStatus = row.roleId ? 'edit' : 'add'
      if (row.roleId) {
        _this.editRoleFormInline.roleId = row.roleId
        _this.editRoleFormInline.roleName = row.roleName
        _this.editRoleFormInline.remark = row.remark
        _this.$http({
          method: 'get',
          url: '/api/admin/sys/role/' + row.roleId
        }).then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.editRoleFormInline.menuIdList = response.data.data.menuIdList
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
      // let _this = this
      // _this.deleteUserList = []
      // for (let i = 0; i < val.length; i++) {
      //   _this.deleteUserList.push(val[i].userId)
      // }
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
