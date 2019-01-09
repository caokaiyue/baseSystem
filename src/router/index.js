import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const Home = (resolve) => {
  require(['../components/home'], resolve)
}
const Login = (resolve) => {
  require(['../components/login'], resolve)
}
const User = (resolve) => {
  require(['../components/user'], resolve)
}
const Department = (resolve) => {
  require(['../components/department'], resolve)
}
const Role = (resolve) => {
  require(['../components/role'], resolve)
}
const ExceptionLog = (resolve) => {
  require(['../components/exceptionLog'], resolve)
}
const OperationLog = (resolve) => {
  require(['../components/operationLog'], resolve)
}
const Menu = (resolve) => {
  require(['../components/menu'], resolve)
}
const ProductEdit = (resolve) => {
  require(['../components/product/product-edit'], resolve)
}
const ApproveHistory = (resolve) => {
  require(['../components/approveHistory'], resolve)
}
const ApproveHistoryDetails = (resolve) => {
  require(['../components/approveHistory/approveHistory-details'], resolve)
}
const PersonCreditApply = (resolve) => {
  require(['../components/personCreditApply'], resolve)
}
const PersonCreditApplyDetails = (resolve) => {
  require(['../components/personCreditApply/personCreditApply-details'], resolve)
}
const UserAdd = (resolve) => {
  require(['../components/user/user-add'], resolve)
}
const UserEdit = (resolve) => {
  require(['../components/user/user-edit'], resolve)
}
const Merchant = (resolve) => {
  require(['../components/merchant'], resolve)
}
const MerchantAdd = (resolve) => {
  require(['../components/merchant/merchant-add'], resolve)
}
const SysAuditLog = (resolve) => {
  require(['../components/sysAuditLog'], resolve)
}
const SysPara = (resolve) => {
  require(['../components/sysPara'], resolve)
}
const SysParaEdit = (resolve) => {
  require(['../components/sysPara/sysPara-edit'], resolve)
}
const SysJob = (resolve) => {
  require(['../components/sysJob'], resolve)
}
const SysJobEdit = (resolve) => {
  require(['../components/sysJob/sysJob-edit'], resolve)
}
const OperationInfo = (resolve) => {
  require(['../components/operationInfo'], resolve)
}
const ApproveAnalysis = (resolve) => {
  require(['../components/approveAnalysis'], resolve)
}
const ApplyAnalysis = (resolve) => {
  require(['../components/applyAnalysis'], resolve)
}
const ApplyDailyStatisticalStatement = (resolve) => {
  require(['../components/applyDailyStatisticalStatement'], resolve)
}
const ApproveArchive = (resolve) => {
  require(['../components/approveArchive'], resolve)
}
const ApproveArchiveDetails = (resolve) => {
  require(['../components/approveArchive/approveArchive-details'], resolve)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      redirect: {name: 'login'}
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/home/user',
          name: 'user',
          component: User
        }, {
          path: '/home/department',
          name: 'department',
          component: Department
        }, {
          path: '/home/role',
          name: 'role',
          component: Role
        }, {
          path: '/home/exceptionLog',
          name: 'exceptionLog',
          component: ExceptionLog
        }, {
          path: '/home/operationLog',
          name: 'operationLog',
          component: OperationLog
        }, {
          path: '/home/menu',
          name: 'menu',
          component: Menu
        }, {
          path: '/home/product/product-edit',
          name: 'productEdit',
          component: ProductEdit
        }, {
          path: '/home/approveHistory',
          name: 'approveHistory',
          component: ApproveHistory
        }, {
          path: '/home/personCreditApply',
          name: 'personCreditApply',
          component: PersonCreditApply
        }, {
          path: '/home/personCreditApply/personCreditApplyDetails',
          name: 'personCreditApplyDetails',
          component: PersonCreditApplyDetails
        }, {
          path: '/home/user/user-add',
          name: 'userAdd',
          component: UserAdd
        }, {
          path: '/home/user/user-edit',
          name: 'userEdit',
          component: UserEdit
        }, {
          path: '/home/merchant',
          name: 'merchant',
          component: Merchant
        }, {
          path: '/home/merchant/merchant-add',
          name: 'merchantAdd',
          component: MerchantAdd
        }, {
          path: '/home/sysAuditLog',
          name: 'sysAuditLog',
          component: SysAuditLog
        }, {
          path: '/home/sysPara',
          name: 'sysPara',
          component: SysPara
        }, {
          path: '/home/sysPara/sysPara-edit',
          name: 'sysParaEdit',
          component: SysParaEdit
        }, {
          path: '/home/sysJob',
          name: 'sysJob',
          component: SysJob
        }, {
          path: '/home/sysJob/sysJobEdit',
          name: 'sysJobEdit',
          component: SysJobEdit
        }, {
          path: '/home/operationInfo',
          name: 'operationInfo',
          component: OperationInfo
        }, {
          path: '/home/approveAnalysis',
          name: 'approveAnalysis',
          component: ApproveAnalysis
        }, {
          path: '/home/applyAnalysis',
          name: 'applyAnalysis',
          component: ApplyAnalysis
        }, {
          path: '/home/applyDailyStatisticalStatement',
          name: 'applyDailyStatisticalStatement',
          component: ApplyDailyStatisticalStatement
        }, {
          path: '/home/approveArchive',
          name: 'approveArchive',
          component: ApproveArchive
        }, {
          path: '/approveHistory-details',
          name: 'approveHistoryDetails',
          component: ApproveHistoryDetails
        }]
    }, {
      path: '/approveArchiveDetails',
      name: 'approveArchiveDetails',
      component: ApproveArchiveDetails
    }
  ]
})
