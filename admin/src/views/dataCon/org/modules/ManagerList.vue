<template>
  <s-table
    ref="table"
    size="default"
    rowKey="id"
    :columns="columns"
    :data="loadData"
    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
  >
    <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>

    <a-avatar
      size="large"
      shape="square"
      :src="record | resourceFullAddressFilter"
      slot="resourceFullAddress"
      slot-scope="record"
    />

    <span slot="status" slot-scope="text">
      <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
    </span>
  </s-table>
</template>

<script>
import { STable } from '@/components'
import { mapState } from 'vuex'
import { mixin } from '@/mixins/mixin'

export default {
  components: {
    STable
  },
  mixins: [mixin],
  props: {
    managerId: {
      type: String,
      default: ''
    }
  },
  watch: {
    managerId() {
      this.selectedRowKeys = []
      this.$refs.table.refresh(true)
    }
  },
  data() {
    return {
      columns: [
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '电话号码',
          dataIndex: 'fullPhoneNo'
        },
        {
          title: '姓名',
          dataIndex: 'realName'
        },
        {
          title: '账户状态',
          dataIndex: 'accountState'
        }
      ],
      enableChecked: false,
      loadData: parameter => {
        return this.$api.manager
          .getPage(Object.assign(parameter, this.queryParam, { orgId: this.managerId }))
          .then(res => {
            res.records.forEach(item => {
              item.fullPhoneNo = item.areaCode + item.phoneNo
              item.sexual = this.constants.data.sexual ? this.constants.data.sexual[item.sexual]['name'] : ''
              item.accountState = this.constants.data.accountState
                ? this.constants.data.accountState[item.accountState]['name']
                : ''
              item.managerTypeName = this.constants.data.managerType
                ? this.constants.data.managerType[item.managerType]['name']
                : ''
            })
            return res
          })
      }
    }
  },
  computed: {
    ...mapState(['constants'])
  },
  methods: {
    resetPassword(id) {
      const that = this
      that.$confirm({
        title: '操作',
        content: '确定要重置密码吗？',
        onOk() {
          that.$api.manager.resetPassword({ id: id }).then(res => {
            that.$notification.success({
              message: '成功',
              description: `重置密码成功！`
            })
            that.handleOk()
          })
        },
        onCancel() {}
      })
    },

    selectEstate(record) {
      this.$refs.selectEstate.add(record)
    },

    handleDelete() {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk() {
          that.$api.manager.del({ ids: that.selectedRowKeys }).then(res => {
            that.$notification.success({
              message: '成功',
              description: `删除成功！`
            })
            that.handleOk()
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>
