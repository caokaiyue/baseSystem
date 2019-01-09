<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-row class="rowMargin">
      <el-button type="primary" @click="search">查询</el-button>
      <el-button type="primary" @click="showEdit">新增</el-button>
    </el-row>
      <div style="width: 100%">
        <el-table
          :data="tableData"
          row-key=""
          fit
          stripe
          style="width: 100%">
          <el-table-column
            label="名称"
            min-width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.children.length>0" :style="{ paddingLeft: scope.row.textIndent + 'px' }">
                <div style="display: inline-block" v-if="scope.row.expand" @click="expandHandler(scope.row, false)">
                  <span class="iconfont icon-caret-down"></span>
                </div>
                <div style="display: inline-block" v-else @click="expandHandler(scope.row, true)">
                  <span class="iconfont icon-caret-right"></span>
                </div>
                <p style="display: inline-block">{{scope.row.name}}</p>
              </div>
              <div v-else :style="{ paddingLeft: scope.row.textIndent + 'px' }">
                <p style="padding-left: 16px">{{scope.row.name}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="children"
            v-if="false"
          >
          </el-table-column>
          <el-table-column
            prop="expand"
            v-if="false"
          >
          </el-table-column>
          <el-table-column
            prop="textIndent"
            label="textIndent"
            v-if="false"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="name"
            v-if="false"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="排序"
            min-width="200">
          </el-table-column>
          <el-table-column
            prop="parentName"
            label="上级部门"
            min-width="200">
          </el-table-column>
          <el-table-column label="操作" min-width="50">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">修改</el-button>
              <!--<el-button type="text" size="small" @click="delDept(scope.row.deptId)">删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    <el-dialog
      :append-to-body="true"
      :title="currentEditStatus === 'add'?'新增':'修改'"
      :visible.sync="editVisible">
      <el-form
        ref="editDeptFormInline"
        :model="editDeptFormInline"
        :rules="editDeptRules"
        label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="editDeptFormInline.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-popover
            placement="bottom-start"
            :ref="'parentNamePopover'"
            trigger="click">
              <div slot="reference">
                <el-input v-model="editDeptFormInline.parentName" readonly placeholder="上级菜单">
                  <i slot="suffix" style="cursor: pointer" @click="clearHandler" class="el-input__icon el-icon-circle-close"></i>
                </el-input>
              </div>
            <el-tree :data="tableData" :expand-on-click-node="false" @node-click="handleNodeClick"></el-tree>
          </el-popover>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="editDeptFormInline.orderNum" :min="0" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">关 闭</el-button>
        <el-button type="primary" @click="submitEditDeptForm(currentEditStatus === 'add'?'post':'put')">提交</el-button>
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
      editVisible: false,
      currentEditStatus: 'add',
      tableData: [],
      editDeptFormInline: {
        deptId: '',
        name: '',
        parentId: 0,
        orderNum: 0,
        parentName: '一级部门'
      },
      expandedIdArr: [],
      editDeptRules: {
        name: [
          { required: true, message: '部门名称名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      let _this = this
      _this.search()
    },
    request (formInline) {
      let _this = this
      this.$http.get(
        // '/api/menu'
        '/api/admin/sys/dept/list')
        // , {params: JSON.parse(JSON.stringify(formInline))}
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
              _this.tableData = response.data.data
            }
          }
        })
        .catch(function () {
          // console.log(err)
        })
    },
    expandHandler (row, currentBoolean) {
      let _this = this
      let idx = _this.tableData.indexOf(row)
      _this.tableData[idx].expand = !_this.tableData[idx].expand
      if (currentBoolean) {
        for (let i = 0; i < row.children.length; i++) {
          _this.tableData.splice(idx + i + 1, 0, row.children[i])
          for (let j = 0; j < _this.tableData.length; j++) {
            if (row.children[i].parentId === _this.tableData[j].deptId) {
              row.children[i].textIndent = _this.tableData[j].textIndent + 10
            }
          }
        }
      } else {
        _this.expandedIdArr = []
        _this.digui2(row.deptId)
        _this.tableData.splice(idx + 1, _this.expandedIdArr.length)
        _this.digui(row)
      }
    },
    digui (arr) {
      let _this = this
      if (arr instanceof Array) {
        for (let i = 0; i < arr.length; i++) {
          arr[i].label = arr[i].name
          arr[i].expand = false
          arr[i].textIndent = 0
          _this.digui(arr[i])
        }
      }
      if (arr instanceof Object) {
        _this.digui(arr.children)
      }
    },
    digui2 (currentId) {
      let _this = this
      for (let i = 0; i < _this.tableData.length; i++) {
        if (_this.tableData[i].parentId === currentId) {
          _this.expandedIdArr.push(_this.tableData[i].deptId)
          if (_this.tableData[i].children.length > 0) {
            _this.digui2(_this.tableData[i].deptId)
          }
        }
      }
    },
    search () {
      let _this = this
      _this.request(_this.formInline)
    },
    showEdit (row) {
      let _this = this
      _this.currentEditStatus = row.deptId ? 'edit' : 'add'
      if (row.deptId) {
        for (let key in _this.editDeptFormInline) {
          _this.editDeptFormInline[key] = row[key]
        }
        if (_this.editDeptFormInline['parentId'] === 0) {
          _this.editDeptFormInline['parentName'] = '一级部门'
        }
      } else {
        _this.resetForm()
      }
      _this.editVisible = true
    },
    submitEditDeptForm (condition) {
      let _this = this
      _this.$http({
        method: condition,
        url: '/api/admin/sys/dept',
        data: _this.editDeptFormInline
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
            _this.resetForm('editDeptFormInline')
            _this.search()
          }
        }
      }).catch(function () {})
    },
    resetForm () {
      let _this = this
      _this.editDeptFormInline = {
        deptId: '',
        name: '',
        parentId: 0,
        orderNum: 0,
        parentName: '一级部门'
      }
    },
    handleNodeClick (data) {
      let _this = this
      this.$refs['parentNamePopover'].doClose()
      _this.editDeptFormInline.parentName = data.name
      _this.editDeptFormInline.parentId = data.deptId
    },
    clearHandler () {
      let _this = this
      _this.editDeptFormInline.parentId = 0
      _this.editDeptFormInline.parentName = '一级部门'
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
