/**
 * @name mixin.js
 * @author lw
 * @date 2019.10.20
 * @desc 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为editModal
 */

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
    }
  },
  created () {},

  methods: {

    filterDeliverTypeOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

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
    changeDeleted(checked) {
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

  }

}