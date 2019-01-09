<template>
   <el-menu id="side-nav"
     :default-active="$route.path"
     background-color="#545c64"
     text-color="#fff"
     active-text-color="#ffd04b"
      :collapse="isCollapse"
     v-bind:router="true">
     <el-button type="text" @click = 'isCollapse = !isCollapse'>ahahah</el-button>
     <template v-for="(item, index) in testList">
       <el-submenu :index="index.toString()" :key="item.menuId">
         <template slot="title">
           <i class="el-icon-location"></i>
           <span>{{item.name}}</span>
         </template>
           <el-menu-item-group>
             <template v-for="childrenItem in item.children">
             <el-menu-item :index="childrenItem.url" :key="childrenItem.menuId">用户管理</el-menu-item>
             </template>
           </el-menu-item-group>
       </el-submenu>
     </template>
     <el-submenu index="10">
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
     <el-submenu index="11">
       <template slot="title">
         <i class="el-icon-location"></i>
         <span>日志查看</span>
       </template>
       <el-menu-item-group>
         <el-menu-item index="/home/exceptionLog">异常日志</el-menu-item>
         <el-menu-item index="/home/operationLog">操作日志</el-menu-item>
       </el-menu-item-group>
     </el-submenu>
     <el-submenu index="13">
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
      isCollapse: false,
      menuList: {
        systemManage: [],
        business: [],
        entry: [],
        approve: [],
        warning: [],
        operation: []
      },
      testList: []
    }
  },
  computed: {
    // isCollapse () {
    //   return this.$store.state.navCollapse
    // }
  },
  methods: {
    init () {
      let _this = this
      // let menuList = JSON.parse(sessionStorage.getItem('menuList'))
      // for (let i = 0; i < menuList.length; i++) {
      //   switch (menuList[i][0]) {
      //     case '1':
      //       _this.menuList.systemManage.push(menuList[i])
      //       break
      //     case '2':
      //       _this.menuList.business.push(menuList[i])
      //       break
      //     case '3':
      //       _this.menuList.entry.push(menuList[i])
      //       break
      //     case '4':
      //       _this.menuList.approve.push(menuList[i])
      //       break
      //     case '5':
      //       _this.menuList.warning.push(menuList[i])
      //       break
      //     case '6':
      //       _this.menuList.operation.push(menuList[i])
      //       break
      //   }
      // }
      _this.test1()
    },
    isExist (str, arr) {
      let result = false
      for (let i = 0; i < arr.length; i++) {
        if (str === arr[i]) {
          result = true
          return result
        }
      }
    },
    test1 () {
      let _this = this
      this.$http.get('/api/admin/sys/menu/nav')
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.testList = response.data.data
            }
          }
        })
        .catch(function () {
          // console.log(err)
        })
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
    background-color: #545c64;
    height: 100%;
  }
</style>
