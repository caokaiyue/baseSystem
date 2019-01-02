<template>
    <el-container id="home">
      <el-header class="header">
        <header-container></header-container>
      </el-header>
      <el-container style="height: 100%">
        <el-aside width="200px" style="overflow-x: hidden;">
          <side-nav></side-nav>
        </el-aside>
        <el-main style="background-color: #ECECEC;height: 100%">
          <keep-alive :exclude="[
          'workspace', 'manualApprove', 'ExceptionLog', 'productEdit',
          'user', 'userAdd', 'userEdit', 'merchant', 'SysAuditLog',
           'sysPara', 'sysParaEdit', 'sysJob', 'sysJobAdd', 'sysJobEdit', 'personCreditApply',
           'personCreditApplyDetails', 'approvalHistory',
          'approvalHistoryDetails', 'operationInfo', 'approveAnalysis',
           'applyAnalysis', 'applyDailyStatisticalStatement']">
            <router-view/>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import HeaderContainer from './layout/header-container'
import SideNav from './layout/side-nav'
export default {
  components: { SideNav, HeaderContainer },
  name: 'home',
  data () {
    return {
      msg: 'home'
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$destroy()
    sessionStorage.removeItem('changePwdFormVisible')
    next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #home{
    width: 100%;
    height: 100%;
  }
  .header{
    background-color: #333333;
    color: #ffffff;
  }
</style>
