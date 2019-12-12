<!--
 * @name List.vue
 * @author lw
 * @date 2019.5.29
 * @desc 地产管理
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="24">
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
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
        </template>
      </span>
    </s-table>
    <edit-form ref="editModal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import EditForm from './EditForm'
import {mixin} from '@/mixins/mixin'

export default {
  mixins:[mixin],
  components: {
    STable,
    EditForm
  },
  data () {
    return {
      queryParam: {
        enable:''
      },
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '编码',
          dataIndex: 'code'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '组织名称',
          dataIndex: 'orgName'
        },
        {
          title: '地区名称',
          dataIndex: 'areaName'
        },
        {
          title: '详细地址',
          dataIndex: 'fullAddress'
        },
        {
          title: '街道办',
          dataIndex: 'streetOfficeName'
        },

        {
          title: '纬度',
          dataIndex: 'lat'
        },
        {
          title: '经度',
          dataIndex: 'lng'
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
      enableChecked:false,
      loadData: parameter => {
        return this.$api.estate.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
    }
  },
  methods: {
    handleDelete () {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk () {
          that.$api.estate.del({ ids: that.selectedRowKeys })
            .then(res => {
              that.$notification.success({
                message: '成功',
                description: `删除成功！`
              })
              that.handleOk()
            })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
