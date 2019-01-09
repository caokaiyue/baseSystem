<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-form :inline="true" :model="formInline" label-position="left">
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="showEdit">新增</el-button>
      </el-form-item>
      <div style="width: 100%">
        <el-table
          :data="tableData"
          fit
          stripe
          border
          :cell-style="{padding: '0'}"
          :highlight-current-row="true"
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
            prop="menuId"
            label="menuId"
            v-if="false"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            min-width="150"
            v-if="false"
          >
          </el-table-column>
          <el-table-column
            prop="url"
            label="路由"
            >
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            >
            <template slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.type===0 || scope.row.type===1">菜单</el-tag>
              <el-tag size="mini" v-else-if="scope.row.type===2" type="info">按钮</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="icon"
            label="图标"
            >
          </el-table-column>
          <el-table-column
            prop="perms"
            label="授权标识"
            >
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="排序"
            >
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="创建日期"

            v-if="false"
          >
          </el-table-column>
          <el-table-column
            prop="resourceList"
            label="授权资源"
            v-if="false"
            >
          </el-table-column>
          <el-table-column label="操作" min-width="50">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showEdit(scope.row)">修改</el-button>
              <!--<el-button type="text" size="small" @click="showCurrentMessage(scope.row.menuId)">删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <el-dialog
      :append-to-body="true"
      title="修改"
      :visible.sync="editVisible">
      <el-form
        ref="editMenuFormInline"
        :model="editMenuFormInline"
        :rules="editMenuRules"
        label-width="120px">
        <el-form-item label="类型">
          <el-radio-group v-model="editMenuFormInline.type" :disabled="radioDisabled">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editMenuFormInline.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
          <el-popover
            placement="bottom-start"
            :ref="'parentNamePopover'"
            trigger="click">
            <div slot="reference">
              <el-input v-model="editMenuFormInline.parentName" readonly placeholder="上级菜单">
                <i slot="suffix" style="cursor: pointer" @click="clearHandler" class="el-input__icon el-icon-circle-close"></i>
              </el-input>
            </div>
            <el-tree :data="tableDataProtoType" :expand-on-click-node="false" @node-click="handleNodeClick"></el-tree>
          </el-popover>
        </el-form-item>
        <el-form-item label="路由">
          <el-input v-model="editMenuFormInline.url" placeholder="路由"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="editMenuFormInline.orderNum" @change="handleChange" :min="0" :max="10" label="排序"></el-input-number>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="editMenuFormInline.icon" placeholder="图标"></el-input>
        </el-form-item>
        <el-form-item label="授权标识">
          <el-input v-model="editMenuFormInline.perms" placeholder="授权标识"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">关 闭</el-button>
        <el-button type="primary" @click="submitEditMenuForm(currentEditStatus === 'add'?'post':'put')">提交</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      title: '菜单管理',
      editVisible: false,
      currentEditStatus: 'add',
      tableDataProtoType: [],
      tableData: [],
      formInline: {},
      editMenuFormInline: {
        type: 1,
        name: '',
        parentId: 0,
        parentName: '一级目录',
        url: '',
        orderNum: '',
        icon: '',
        perms: ''
      },
      editMenuRules: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级部门不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '上级部门不能为空', trigger: 'blur' }
        ]
      },
      radioDisabled: false,
      expandedIdArr: []
    }
  },
  methods: {
    init () {
      let _this = this
      _this.search()
    },
    expandHandler (row, currentBoolean) {
      let _this = this
      let idx = _this.tableData.indexOf(row)
      _this.tableData[idx].expand = !_this.tableData[idx].expand
      if (currentBoolean) {
        for (let i = 0; i < row.children.length; i++) {
          _this.tableData.splice(idx + i + 1, 0, row.children[i])
          for (let j = 0; j < _this.tableData.length; j++) {
            if (row.children[i].parentId === _this.tableData[j].menuId) {
              row.children[i].textIndent = _this.tableData[j].textIndent + 10
            }
          }
        }
      } else {
        _this.expandedIdArr = []
        _this.digui2(row.menuId)
        _this.tableData.splice(idx + 1, _this.expandedIdArr.length)
        _this.digui(row)
        // console.log(_this.tableData)
      }
      console.log(_this.tableData)
    },
    handleChange () {
      console.log('排序')
    },
    submitEditMenuForm (condition) {
      let _this = this
      _this.$http({
        method: condition,
        url: '/api/admin/sys/menu',
        data: _this.editMenuFormInline
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
    request () {
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
              _this.tableData = response.data.data
              for (let key in response.data.data) {
                _this.tableDataProtoType[key] = response.data.data[key]
              }
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
          _this.expandedIdArr.push(_this.tableData[i].menuId)
          if (_this.tableData[i].children.length > 0) {
            _this.digui2(_this.tableData[i].menuId)
          }
        }
      }
    },
    showEdit (row) {
      let _this = this
      _this.resetForm()
      _this.currentEditStatus = row.menuId ? 'edit' : 'add'
      if (row.menuId) {
        _this.editMenuFormInline.menuId = row.menuId
        _this.editMenuFormInline.type = row.type
        _this.editMenuFormInline.name = row.name
        _this.editMenuFormInline.url = row.url
        _this.editMenuFormInline.orderNum = row.orderNum
        _this.editMenuFormInline.icon = row.icon
        _this.editMenuFormInline.perms = row.perms
        _this.radioDisabled = true
        _this.$http({
          method: 'get',
          url: '/api/admin/sys/menu/' + row.menuId
        }).then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              // _this.editRoleFormInline.menuIdList = response.data.data.menuIdList
              console.log(response.data.data)
            }
          }
        }).catch(function () {})
      } else {
        _this.radioDisabled = false
      }
      _this.editVisible = true
    },
    search () {
      let _this = this
      _this.request(_this.formInline)
    },
    handleNodeClick (data) {
      let _this = this
      this.$refs['parentNamePopover'].doClose()
      _this.editMenuFormInline.parentName = data.name
      _this.editMenuFormInline.parentId = data.menuId
    },
    clearHandler () {
      let _this = this
      _this.editMenuFormInline.parentId = 0
      _this.editMenuFormInline.parentName = '一级目录'
    },
    resetForm () {
      let _this = this
      _this.editMenuFormInline = {
        type: 1,
        name: '',
        parentId: 0,
        parentName: '一级目录',
        url: '',
        orderNum: '',
        icon: '',
        perms: ''
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
.el-menu {
  margin: 5px;
}
</style>
