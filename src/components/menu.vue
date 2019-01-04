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
          fit
          stripe
          :highlight-current-row="true"
          style="width: 100%">
          <el-table-column
            label="名称"
            min-width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.children.length>0" :style="{ paddingLeft: scope.row.textIndent + 'px' }">
                <div style="display: inline-block" v-if="scope.row.expand" @click="expandHandler(scope.row, false)">
                  <span class="iconfont icon-caret-right"></span>
                </div>
                <div style="display: inline-block" v-else @click="expandHandler(scope.row, true)">
                  <span class="iconfont icon-caret-down"></span>
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
            prop="sort"
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
              <el-button type="text" size="small" @click="showCurrentMessage(scope.row.id)">删除</el-button>
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
        <el-form-item label="状态">
          <el-radio-group v-model="editMenuFormInline.status">
            <el-radio :label="3">停用</el-radio>
            <el-radio :label="6">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" required="true">
          <el-input v-model="editMenuFormInline.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" required="true">
          <el-input v-model="editMenuFormInline.pid" placeholder="上级菜单"></el-input>
        </el-form-item>
        <el-form-item label="路由" required="true">
          <el-input v-model="editMenuFormInline.url" placeholder="路由"></el-input>
        </el-form-item>
        <el-form-item label="排序" required="true">
          <el-input-number v-model="editMenuFormInline.sort" @change="handleChange" :min="1" :max="10" label="排序"></el-input-number>
        </el-form-item>
        <el-form-item label="图标" required="true">
          <el-input v-model="editMenuFormInline.icon" placeholder="图标"></el-input>
        </el-form-item>
        <el-form-item label="授权资源" required="true">
          <el-input v-model="editMenuFormInline.perms" placeholder="授权资源"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">关 闭</el-button>
        <el-button type="primary" @click="submitEditMenuForm">提交</el-button>
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
      currentMessage: '',
      tableData: [],
      formInline: {},
      editMenuFormInline: {
        status: '',
        name: '',
        pid: '',
        url: '',
        sort: '',
        icon: '',
        perms: ''
      },
      expandedMenuIdArr: []
    }
  },
  methods: {
    init () {
      let _this = this
      _this.search()
    },
    editMenuRules () {
      console.log('haha')
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
        _this.expandedMenuIdArr = []
        _this.digui2(row.menuId)
        _this.tableData.splice(idx + 1, _this.expandedMenuIdArr.length)
        _this.digui(row)
        // console.log(_this.tableData)
      }
      console.log(_this.tableData)
    },
    handleChange () {
      console.log('排序')
    },
    submitEditMenuForm () {
      console.log('提交')
    },
    request (formInline) {
      let _this = this
      this.$http.get('/api/menulist'
        // '/api/admin/sys/menu/list'
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
            }
          }
        })
        .catch(function () {})
    },
    digui (arr) {
      let _this = this
      if (arr instanceof Array) {
        for (let i = 0; i < arr.length; i++) {
          arr[i].expand = false
          arr[i].textIndent = 0
          _this.digui(arr[i])
        }
      }
      if (arr instanceof Object) {
        // for (let i in arr) {
        //   arr[i].textIndent = 10
        // console.log(arr[i].textIndent)
        // }
        _this.digui(arr.children)
      }
    },
    digui2 (currentMenuId) {
      let _this = this
      for (let i = 0; i < _this.tableData.length; i++) {
        if (_this.tableData[i].parentId === currentMenuId) {
          _this.expandedMenuIdArr.push(_this.tableData[i].menuId)
          if (_this.tableData[i].children.length > 0) {
            _this.digui2(_this.tableData[i].menuId)
          }
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
  .el-table__row {
    height: 35px;
  }
</style>
