<!--
 * @name List.vue
 * @author wg
 * @date 2019.6.24
 * @desc 用户管理
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="用户名">
              <a-input v-model="queryParam.username"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="电话号码">
              <a-input v-model="queryParam.phoneNo"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleEdit(null)">新增</a-button>
      <a-button type="danger" icon="delete" @click="handleDelete" :disabled="selectedRowKeys.length < 1">删除</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>

      <a-avatar size="large" shape="square" :src="record | resourceFullAddressFilter" slot="resourceFullAddress" slot-scope="record"/>

      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">修改</a>
        <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="resetPassword(record.id)">重置密码</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
      </span>
    </s-table>
    <edit-form ref="editModal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import {STable} from '@/components'
import EditForm from './modules/EditForm'
import {mapState} from 'vuex';

const statusMap = {
  'true': {
    status: 'success',
    text: '是'
  },
  'false': {
    status: 'default',
    text: '否'
  }
}
export default {
  components: {
    STable,
    EditForm
  },
  data() {
    return {
      queryParam: {},
      columns: [
        {
          title: '#',
          scopedSlots: {customRender: 'serial'}
        },
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '电话号码',
          dataIndex: 'phoneNo'
        },
        {
          title: '姓名',
          dataIndex: 'realName'
        },
        {
          title: '管理员类型',
          dataIndex: 'managerType',
        },
        {
          title: '性别',
          dataIndex: 'sexual'
        },
        {
          title: '邮件',
          dataIndex: 'email'
        },
        {
          title: '账户状态',
          dataIndex: 'accountState'
        },
        {
          title: '上次登录时间',
          dataIndex: 'lastLoginDatetime',
        },
        {
          title: '备注',
          dataIndex: 'remark',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: {customRender: 'action'}
        }
      ],
      enableChecked: false,
      loadData: parameter => {
        return this.$api.manager.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log(res.records)
            res.records.forEach(item => {
              item.managerType = this.constants.data.managerType ? this.constants.data.managerType[item.managerType]['name'] : ''
              item.sexual = this.constants.data.sexual ? this.constants.data.sexual[item.sexual]['name'] : ''
              item.accountState = this.constants.data.accountState ? this.constants.data.accountState[item.accountState]['name'] : ''
            });
            return res
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      isTrue: true,
      isFalse: false
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    },
    resourceFullAddressFilter(record) {
      return record.resourceFullAddress
    }
  },
  computed: {
    ...mapState(['constants'])
  },
  methods: {
    handleEdit(record) {
      this.$refs.editModal.add(record)
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm() {
      this.queryParam = {}
    },

    resetPassword(id) {
        const that = this
        that.$confirm({
          title: '操作',
          content: '确定要重置密码吗？',
          onOk() {
            that.$api.manager.resetPassword({id: id})
              .then(res => {
                that.$notification.success({
                  message: '成功',
                  description: `重置密码成功！`
                })
                that.handleOk()
              })
          },
          onCancel() {
          }
        })
      },

    handleDelete() {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk() {
          that.$api.manager.del({ids: that.selectedRowKeys})
            .then(res => {
              that.$notification.success({
                message: '成功',
                description: `删除成功！`
              })
              that.handleOk()
            })
        },
        onCancel() {
        }
      })
    },
  }
}
</script>
