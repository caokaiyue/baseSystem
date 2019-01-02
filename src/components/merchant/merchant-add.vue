<template>
  <el-row>
    <h3>{{ title }}</h3>
    <el-col :span="10" :offset="7">
      <el-form ref="formInline" :label-position="labelPosition" :model="formInline" label-width="150px">
        <el-form-item label="商户名称">
          <el-input v-model="formInline.merchantName"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码">
          <el-input v-model="formInline.socialCreditNo"></el-input>
        </el-form-item>
        <el-form-item label="省">
          <el-select
            v-model="formInline.province"
            @change="getCityList"
            placeholder="请选择">
            <el-option v-for="item in provinceList"
               :key="item.id"
               :label="item.name"
               :value="item.id"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市">
          <el-select
            v-model="formInline.city"
            placeholder="请选择"
            :disabled="formInline.province === ''"
          >
            <el-option v-for="item in cityList"
               :key="item.id"
               :label="item.name"
               :value="item.id"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作地址">
          <el-input v-model="formInline.workAddress"></el-input>
        </el-form-item>
        <el-form-item label="法人姓名">
          <el-input v-model="formInline.legalPersonName"></el-input>
        </el-form-item>
        <el-form-item label="法人身份证号">
          <el-input v-model="formInline.legalPersonIdcard"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名">
          <el-input v-model="formInline.linkPersonName"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机号">
          <el-input v-model="formInline.linkPersonPhone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'merchantAdd',
  data () {
    return {
      title: '新增商户',
      labelPosition: 'left',
      formInline: {
        merchantName: '',
        socialCreditNo: '',
        province: '',
        city: '',
        workAddress: '',
        legalPersonName: '',
        legalPersonIdcard: '',
        linkPersonName: '',
        linkPersonPhone: ''
      },
      provinceList: [],
      cityList: []
    }
  },
  methods: {
    init () {
      let _this = this
      _this.getProvinceList()
    },
    getProvinceList () {
      let _this = this
      this.$http.get('/api/dimRegion/province')
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.provinceList = response.data.data
            }
          }
        })
        .catch(function () {
          // console.log(err)
        })
    },
    getCityList () {
      let _this = this
      this.$http.get('/api/dimRegion/province/city', {params: JSON.parse(JSON.stringify(
        {
          provinceCode: _this.formInline.province
        }))})
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.cityList = response.data.data
            }
          }
        })
        .catch(function () {
          // console.log(err)
        })
    },

    onSubmit () {
      let _this = this
      this.$http({
        url: '/api/wudiMerchant',
        method: 'post',
        data: JSON.parse(JSON.stringify(_this.formInline))
      })
        .then(function (response) {
          if (response.data.code !== null && response.data.code !== undefined) {
            if (response.data.code !== 0) {
              _this.$message({
                message: response.data.msg,
                type: response.data.code === 0 ? 'success' : 'error',
                duration: 2000
              })
            } else {
              _this.$router.push('/home/merchant')
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

</style>
