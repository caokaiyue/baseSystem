<template>
  <div id="app">
    <keep-alive :exclude="['home', 'login']">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app{
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-header{
    line-height: 60px;
  }
</style>
