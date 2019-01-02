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
            label="名称"
            min-width="150"
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
              <el-tag size="mini" v-if="scope.row.type===0">菜单</el-tag>
              <el-tag size="mini" v-else-if="scope.row.type===1" type="info">按钮</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="icon"
            label="图标"
            >
          </el-table-column>
          <el-table-column
            prop="permissions"
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
          <el-table-column
            prop="parentName"
            label="上级菜单"
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
        :rules="changeRoleRules"
        label-width="120px">
        <el-form-item label="状态">
          <el-radio-group v-model="editUserFormInline.status">
            <el-radio :label="3">停用</el-radio>
            <el-radio :label="6">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" required="true">
          <el-input v-model="editMenuFormInline.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" required="true">
          <el-input v-model="editMenuFormInline.remark" placeholder="上级菜单"></el-input>
        </el-form-item>
        <el-form-item label="路由" required="true">
          <el-input v-model="editMenuFormInline.remark" placeholder="路由"></el-input>
        </el-form-item>
        <el-form-item label="排序" required="true">
          <el-input-number v-model="editMenuFormInline.remark" @change="handleChange" :min="1" :max="10" label="排序"></el-input-number>
        </el-form-item>
        <el-form-item label="图标" required="true">
          <el-input v-model="editMenuFormInline.remark" placeholder="图标"></el-input>
        </el-form-item>
        <el-form-item label="授权资源" required="true">
          <el-input v-model="editMenuFormInline.remark" placeholder="授权资源"></el-input>
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
  name: 'Menu',
  data () {
    return {
      title: '菜单管理',
      editVisible: false,
      currentMessage: '',
      tableData: [],
      formInline: {},
      editMenuFormInline: {
      },
      tmp: []
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
          _this.digui(response.data[0].data)
          _this.tableData = _this.tmp
        })
        .catch(function () {
          // console.log(err)
        })
    },
    digui (arr) {
      let _this = this
      for (let i = 0; i < arr.length; i++) {
        _this.tmp.push(arr[i])
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
