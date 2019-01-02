<template>
  <div>
    <div id="report" style="overflow: auto; padding: 0 20%">
      <el-row>
        <div v-html="details">
        </div>
      </el-row>
    </div>
    <el-row class="backBtn">
      <el-col :offset="4" :span="8">
        <el-button type="primary" @click="h2c" :disabled="isDownLoading">下载</el-button>
      </el-col>
      <el-col :span="8">
        <el-button @click="closeWin">关闭</el-button>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
  name: 'approvalHistoryDetails',
  data () {
    return {
      title: '审批档案详情',
      approveId: localStorage.getItem('approveId'),
      details: '',
      isDownLoading: false,
      formInline: {
        approveId: localStorage.getItem('approveId'),
        staticDate: '',
        applyTotalCount: '',
        applyTotalAmount: '',
        applyAccumulateCount: '',
        applyAccumulateAmount: '',
        loanerAddCount: '',
        loanerAccumulateCount: '',
        approveAcceptCount: '',
        approveAcceptAmount: '',
        approveRejectCount: '',
        loanIssuedAmountTotal: '',
        loanRemainAmountTotal: '',
        overdueCountTotal: '',
        overdueAmountTotal: ''
      }
    }
  },
  methods: {
    init () {
      let _this = this
      if (!_this.approveId) {
        _this.$router.go(-1)
      } else {
        _this.getApprovalHistoryDetails()
      }
    },
    getApprovalHistoryDetails () {
      let _this = this
      this.$http.get('/api/approveProcessReport/' + _this.formInline.approveId).then(function (response) {
        _this.details = response.data
      })
        .catch(function () {
          // console.log(err)
        })
    },
    // downLoad () {
    //   let _this = this
    //   _this.isDownLoading = true
    //   this.$http({
    //     method: 'post',
    //     url: '/api/approveProcessReport/' + _this.approveId + '/download',
    //     responseType: 'blob'
    //   })
    //     .then(function (response) {
    //       let fileName = response.headers['content-disposition'].split(';')[1].split('=')[1]
    //       _this.isDownLoading = false
    //       _this.downLoadToHref(response.data, fileName)
    //     })
    //     .catch(function () {
    //       _this.isDownLoading = false
    //       // console.log(error)
    //     })
    // },
    // downLoadToHref (docFlow, fileName) {
    //   if (!docFlow) {
    //     return
    //   }
    //   let url = window.URL.createObjectURL(new Blob([docFlow]))
    //   let link = document.createElement('a')
    //   link.style.display = 'none'
    //   link.href = url
    //   link.setAttribute('download', fileName)
    //   document.body.appendChild(link)
    //   link.click()
    // },
    closeWin () {
      window.close()
    },
    h2c () {
      let target = document.querySelector('#report')
      target.style.background = '#FFFFFF'
      html2canvas(target).then(canvas => {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        //  一页pdf显示html页面生成的canvas高度;
        let pageHeight = contentWidth / 592.28 * 841.89
        //  未生成pdf的html页面高度
        let leftHeight = contentHeight
        //  页面偏移
        let position = 0
        //  a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight

        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let pdf = new JsPDF('', 'pt', 'a4')
        //  有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //  当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          console.log(pdf)
          pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          console.log(2)
          while (leftHeight > 0) {
            pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            //  避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage()
            }
          }
        }
        pdf.save('content.pdf')
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
  body {
    width: 100%;
  }
  .backBtn{
    text-align: center;
    padding: 30px;
  }
</style>
