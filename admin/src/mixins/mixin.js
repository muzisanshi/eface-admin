/**
 * @name mixin.js
 * @author lw
 * @date 2019.10.20
 * @desc 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为editModal
 */
import api from '@/api/index'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
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
      tokenHeader: { 'authorization': Vue.ls.get(ACCESS_TOKEN) },
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
    },

    /*load加载list数据*/
    handleLoadOk() {
      this.loadData()
    },

    /*重置list传参*/
    resetSearchForm () {
      this.queryParam = {}
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
            this.$message.error(info.file.response.errCode + ':' + info.file.response.errDesc)
          }
          this.loading = false
          break
        case 'error':
          this.$message.error(info.file.response.status + ':' + info.file.response.error)
          this.loading = false
          break
      }
    }

  }

}