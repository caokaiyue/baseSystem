<template>
   <el-menu id="side-nav"
           :default-active="$route.path"
           class="el-menu-vertical-demo"
           background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b"
           v-bind:router="true">
     <el-submenu index="1" v-if="menuList.business.length>0">
       <template slot="title">
       <i class="el-icon-location"></i>
       <span>业务配置</span>
       </template>
     <el-menu-item-group>
       <el-menu-item v-if="isExist('20001',menuList.business)" index="/home/product">产品管理</el-menu-item>
       <el-menu-item v-if="isExist('20003',menuList.business)" index="/home/merchant">商户管理</el-menu-item>
     </el-menu-item-group>
     </el-submenu>
     <el-submenu index="2" v-if="menuList.entry.length>0">
       <template slot="title">
         <i class="el-icon-location"></i>
         <span>进件管理</span>
       </template>
       <el-menu-item-group>
         <el-menu-item v-if="isExist('30001',menuList.entry)" index="/home/personCreditApply">进件查询</el-menu-item>
       </el-menu-item-group>
     </el-submenu>
     <el-submenu index="3" v-if="menuList.approve.length>0">
       <template slot="title">
         <i class="el-icon-location"></i>
         <span>审批管理</span>
       </template>
       <el-menu-item-group>
         <el-menu-item v-if="isExist('40002',menuList.approve)" index="/home/workspace">
         <i class="el-icon-menu"></i>
         <span slot="title">我的工作台</span>
       </el-menu-item>
         <el-menu-item v-if="isExist('40001',menuList.approve)" index="/home/approveHistory">审批历史查询</el-menu-item>
         <el-menu-item v-if="isExist('40003',menuList.approve)" index="/home/approveArchive">审批档案</el-menu-item>
       </el-menu-item-group>
     </el-submenu>
     <el-submenu index="4" v-if="menuList.warning.length>0">
       <template slot="title">
         <i class="el-icon-location"></i>
         <span>监测预警</span>
       </template>
       <el-menu-item-group>
         <el-menu-item v-if="isExist('50001',menuList.warning)" index="/home/operationInfo">运营概要</el-menu-item>
         <el-menu-item v-if="isExist('50002',menuList.warning)" index="/home/applyAnalysis">进件分析</el-menu-item>
         <el-menu-item v-if="isExist('50003',menuList.warning)" index="/home/approveAnalysis">审核分析</el-menu-item>
         <el-menu-item v-if="isExist('50004',menuList.warning)" index="/home/yuqi">贷后分析</el-menu-item>
         <el-menu-item v-if="isExist('50005',menuList.warning)" index="/home/yuqi">风险预警</el-menu-item>
       </el-menu-item-group>
     </el-submenu>
     <el-submenu index="5" v-if="menuList.operation.length>0">
       <template slot="title">
         <i class="el-icon-location"></i>
         <span>运营报表</span>
       </template>
       <el-menu-item-group>
         <el-menu-item v-if="isExist('60001',menuList.operation)" index="/home/applyDailyStatisticalStatement">进件情况日报表</el-menu-item>
         <!--<el-menu-item v-if="isExist('60002',menuList.operation)" index="/home/approveDailyStatisticalStatement">审核统计日报表</el-menu-item>-->
         <el-menu-item v-if="isExist('60003',menuList.operation)" index="/home/yuqi">审核员工作量统计报表</el-menu-item>
       </el-menu-item-group>
     </el-submenu>
     <el-submenu index="6" v-if="menuList.systemManage.length>0">
       <template slot="title">
         <i class="el-icon-location"></i>
         <span>系统管理</span>
       </template>
       <el-menu-item-group>
         <el-menu-item v-if="isExist('10001',menuList.systemManage)" index="/home/user">用户管理</el-menu-item>
         <el-menu-item v-if="isExist('10002',menuList.systemManage)" index="/home/sysAuditLog">系统事件查看</el-menu-item>
         <el-menu-item v-if="isExist('10003',menuList.systemManage)" index="/home/yuqi">系统公告管理</el-menu-item>
         <el-menu-item v-if="isExist('10004',menuList.systemManage)" index="/home/sysPara">系统参数配置</el-menu-item>
         <el-menu-item v-if="isExist('10005',menuList.systemManage)" index="/home/sysJob">自动作业管理</el-menu-item>
       </el-menu-item-group>
     </el-submenu>
     <el-submenu index="7">
       <template slot="title">
         <i class="el-icon-location"></i>
         <span>权限管理</span>
       </template>
       <el-menu-item-group>
         <el-menu-item index="/home/user">用户管理</el-menu-item>
         <el-menu-item index="/home/department">部门管理</el-menu-item>
         <el-menu-item index="/home/role">角色管理</el-menu-item>
       </el-menu-item-group>
     </el-submenu>
     <el-submenu index="8">
       <template slot="title">
         <i class="el-icon-location"></i>
         <span>日志查看</span>
       </template>
       <el-menu-item-group>
         <el-menu-item index="/home/exceptionLog">异常日志</el-menu-item>
         <el-menu-item index="/home/operationLog">操作日志</el-menu-item>
       </el-menu-item-group>
     </el-submenu>
     <el-submenu index="9">
       <template slot="title">
         <i class="el-icon-location"></i>
         <span>系统管理</span>
       </template>
       <el-menu-item-group>
         <el-menu-item index="/home/menu">菜单管理</el-menu-item>
       </el-menu-item-group>
     </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'side-nav',
  data () {
    return {
      menuList: {
        systemManage: [],
        business: [],
        entry: [],
        approve: [],
        warning: [],
        operation: []
      }
    }
  },
  methods: {
    init () {
      let _this = this
      let menuList = JSON.parse(sessionStorage.getItem('menuList'))
      for (let i = 0; i < menuList.length; i++) {
        switch (menuList[i][0]) {
          case '1':
            _this.menuList.systemManage.push(menuList[i])
            break
          case '2':
            _this.menuList.business.push(menuList[i])
            break
          case '3':
            _this.menuList.entry.push(menuList[i])
            break
          case '4':
            _this.menuList.approve.push(menuList[i])
            break
          case '5':
            _this.menuList.warning.push(menuList[i])
            break
          case '6':
            _this.menuList.operation.push(menuList[i])
            break
        }
      }
    },
    isExist (str, arr) {
      let result = false
      for (let i = 0; i < arr.length; i++) {
        if (str === arr[i]) {
          result = true
          return result
        }
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
  #side-nav{
    width: 200px;
    background-color: #545c64;
    height: 100%;
  }
</style>
