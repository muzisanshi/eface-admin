<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.6
 * @desc 主控中心
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="组织名称">
              <a-input :maxLength="64" v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="编码">
              <a-input :maxLength="32" v-model="queryParam.code" />
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
      </span>
    </s-table>
    <edit-form ref="editModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import EditForm from './modules/EditForm'
import { mapState } from 'vuex'
import { mixin } from '@/mixins/mixin'

export default {
  components: {
    STable,
    EditForm
  },
  mixins: [mixin],
  data() {
    return {
      columns: [
        {
          title: '编码',
          dataIndex: 'code'
        },
        {
          title: '单位简称',
          dataIndex: 'shortName'
        },
        {
          title: '单位全称',
          dataIndex: 'name'
        },
        {
          title: '行政等级',
          dataIndex: 'level'
        },
        {
          title: 'POI信息',
          dataIndex: 'poiInfo'
        },
        {
          title: '管理员',
          dataIndex: 'managerName'
        },
        {
          title: '手机号码',
          dataIndex: 'managerPhone'
        },
        {
          title: '状态',
          dataIndex: 'enable',
          scopedSlots: { customRender: 'status' }
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
        return this.$api.org.getPage(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      }
    }
  },
  computed: {
    ...mapState(['constants'])
  },
  methods: {
    handleDelete() {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk() {
          that.$api.org.del({ ids: that.selectedRowKeys }).then(res => {
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
