/**
 * @name mixin.js
 * @author lw
 * @date 2019.10.20
 * @desc 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为editModal
 */
import api from '@/api/index'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import md5 from 'md5'
const SIGN = {
  clientId: 'admin',
  key: 'da74588912504563e464ffe8956de784'
}
export const mixin = {
  data () {
    return {
      queryParam: {},
      loading: false,
      selectedRowKeys: [],
      selectedRows: [],
      enable: true,
      deleted: false,
      visible: false,
      tokenHeader: {
        'JWT-MANAGER-ACCOUNT-AUTHORIZATION': Vue.ls.get(ACCESS_TOKEN),
        'X-clientId': SIGN.clientId
      },
      clientHeader: {
        'X-clientId': SIGN.clientId
      },
      fileData: {
        title: ''
      },
      REG_EXPS: {
        //排列序号验证(整数)
        INTEGER: /^[-\+]?\d+$/,
        //最小计量单位验证(正整数)
        PLUS_INTEGER:/^[1-9]\d*$/,
        //重量验证(正整数,正小数,0)
        JUST_NUMBER: /^\d+(?=\.{0,1}\d+$|$)/,

        //数字验证（只能是数字和点）
        HAS_ENG_NUMBER: /^[\.\d]*$/,

        //库存验证(为正整数和零)
        POSITIVE_INTEGER:/^([1-9]\d*|[0]{1,1})$/,

        //金额验证(正数以及最多小数点后两位,金额)
        PLUS_MONEY: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,

        //密码验证(6到16位数字和字母组成)
        PASSWORD:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,

        //默认地址(a到z的大小英文,数字,空格,和英文符号)
        REP_ADDRESS:/^([\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F?a-zA-Z\s0-9]+)$/,

        //邮箱地址
        MAILBOX:/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,

        //发货人名称(英文.包括空格)
        NUM:/^([a-zA-Z\s]+)$/,

        //仓库默认发货电话
        REP_PHONE:/^[+]?[0-9]*$/
      }
    }
  },
  created () {},

  methods: {

    filterCommonOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    /*parameter加载list数据*/
    handleOk () {
      this.$refs.table.refresh()
      this.selectedRowKeys = []
      this.selectedRows = []
    },

    /*load加载list数据*/
    handleLoadOk() {
      this.loadData()
      this.selectedRowKeys = []
      this.selectedRows = []
    },

    /*重置list传参*/
    resetSearchForm () {
      this.queryParam = {
        page: { pageNumber: 1, pageSize: 10 }
      }
      this.initCascader = []
    },

    tableRefresh () {
      this.$refs.table.refresh(true)
      this.selectedRowKeys = []
      this.selectedRows = []
    },

    /*分页change方法*/
    onShowSizeChange (current, pageSize) {
      this.queryParam.page.pageSize = pageSize
      this.onChange(current)
    },

    onChange (current) {
      this.queryParam.page.pageNumber = current
      this.loadData()
    },

    //是否启用赋值
    changeEnable(checked) {
      this.enable = checked
    },

    //是否删除赋值
    changeDeleted (checked) {
      this.deleted = checked
    },

    //弹窗关闭
    handleCancel () {
      this.visible = false
      this.confirmLoading = false
    },

    //新增修改
    handleEdit (record) {
      this.$refs.editModal.add(record)
    },

    /*选择行change事件*/
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    /*选择地产、楼栋信息*/
    selectDataCon (num,index) {
      this.$refs.selectSuccess.selectData(num)
      this.curPaneIndex = index
    },

    //导出
    handleExportXls (url, fileName) {
      if(!fileName || typeof fileName != 'string') {
        fileName = '导出文件'
      }
      let param = { ...this.queryParam }
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param['ids'] = this.selectedRowKeys
      }
      console.log('导出参数', param)
      api.manager.downFile(url, param).then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName + '.xls')
        } else {
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        }
      })
    },
    //导入
    handleImportExcel (info) {
      switch (info.file.status){
        case 'uploading':
          this.loading = true
          break
        case 'done':
          if ('00' === info.file.response.respCode) {
            if (info.file.response.data.failRecords.length > 0) {
              this.$notification.open({
                message: '导入错误信息',
                description: function () {
                  let messageContent = ''
                  info.file.response.data.failRecords.map((item,index) => {
                    if (index === info.file.response.data.failRecords.length - 1) {
                      messageContent += '第' + item.rowNum + '行' + item.errorMsg
                    } else {
                      messageContent += '第' + item.rowNum + '行' + item.errorMsg + ',\xa0\xa0'
                    }
                  })
                  return messageContent
                },
                duration: 0
              })
            } else {
              this.$message.success(`${info.file.name} 文件上传成功`)
            }
            this.handleOk()
          } else {
            this.$message.error(info.file.response.errDesc)
          }
          this.loading = false
          break
        case 'error':
          this.$message.error(info.file.response.error)
          this.loading = false
          break
      }
    },
    beforeUploadImport (file){
      this.confirmLoading = true
      this.fileData.title = file.name
      const timestamp = new Date().getTime() + ''
      const signature = SIGN.clientId + timestamp + SIGN.key
      this.tokenHeader['X-timestamp'] = timestamp
      this.tokenHeader['X-signature'] = md5(signature)
      return true
    },
    //上传之前
    beforeUpload (file) {
      this.confirmLoading = true
      this.fileData.title = file.name
      const timestamp = new Date().getTime() + ''
      const signature = SIGN.clientId + timestamp + SIGN.key
      this.clientHeader['X-timestamp'] = timestamp
      this.clientHeader['X-signature'] = md5(signature)
      if (file.type.indexOf('image') !== -1) {
        const isLt1M = file.size / 1024 / 1024 < 1
          if (!isLt1M) {
            this.$message.error('图片最大为1MB!')
            this.confirmLoading = false
          }
        return isLt1M
      } else {
        return true
      }
    }

  }

}