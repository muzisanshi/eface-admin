<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.1
 * @desc 账号管理
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="用户名">
              <a-input :maxLength="64" v-model="queryParam.username" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="电话号码">
              <a-input :maxLength="32" v-model="queryParam.phoneNo" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="tableRefresh">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleEdit(null)">新增</a-button>
      <a-button
        type="danger"
        icon="delete"
        @click="handleDelete"
        :disabled="selectedRowKeys.length < 1"
      >删除</a-button>
    </div>

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

      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">修改</a>

        <a-divider v-if="record.managerType === 'OPS'" type="vertical" />
        <a v-if="record.managerType === 'OPS'" @click="selectEstate(record)">绑定地产</a>

        <a-divider v-if="record.managerType === 'ORG'" type="vertical" />
        <a v-if="record.managerType === 'ORG'" @click="openOrg(record)">绑定单位</a>
      </span>
    </s-table>
    <edit-form ref="editModal" @ok="handleOk" />
    <select-estate ref="selectEstate" />

    <a-modal title="绑定单位" v-model="orgVisible" :width="1080" @ok="bindOrg">
      <org-list
        v-if="orgVisible"
        :orgVisible="orgVisible"
        :selectedId="selectedId"
        @selectedOrg="getSelectedOrg"
      ></org-list>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import EditForm from './modules/EditForm'
import selectEstate from './modules/SelectEstate'
import { mapState } from 'vuex'
import { mixin } from '@/mixins/mixin'
import OrgList from '@/views/dataCon/org/List'

export default {
  components: {
    STable,
    EditForm,
    selectEstate,
    OrgList
  },
  mixins: [mixin],
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
          title: '性别',
          dataIndex: 'sexual'
        },
        {
          title: '账户状态',
          dataIndex: 'accountState'
        },
        {
          title: '管理员类型',
          dataIndex: 'managerTypeName'
        },
        {
          title: '单位',
          dataIndex: 'orgName'
        },
        {
          title: '上次登录时间',
          dataIndex: 'lastLoginDatetime'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      enableChecked: false,
      loadData: parameter => {
        return this.$api.manager.getPage(Object.assign(parameter, this.queryParam)).then(res => {
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
      },

      orgVisible: false,
      selectedOrg: [],
      id: '',
      selectedId: []
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
    },

    getSelectedOrg(selectedOrg) {
      this.selectedOrg = selectedOrg
    },

    openOrg(record) {
      this.orgVisible = true
      this.id = record.id

      this.$api.manager
        .getById({
          id: record.id
        })
        .then(res => {
          this.selectedId = [res.orgId]
        })
    },

    bindOrg() {
      // console.log(this.id)
      // console.log(this.selectedOrg)
      this.$api.manager
        .bindOrg({
          id: this.id,
          orgId: this.selectedOrg[0].id
        })
        .then(res => {
          this.orgVisible = false
          this.$notification.success({
            message: '成功',
            description: '绑定成功'
          })
        })
    }
  }
}
</script>
