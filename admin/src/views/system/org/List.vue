<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.6
 * @desc 组织管理
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="组织名称">
              <a-input v-model="queryParam.name"/>
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
      </span>
    </s-table>
    <edit-form ref="editModal" @ok="handleOk"/>
    <div id='allmap' style="width:100%;height:350px;display: none"></div>
  </a-card>
</template>

<script>
import {STable} from '@/components'
import EditForm from './modules/EditForm'
import {mapState} from 'vuex';
import {mixin} from '@/mixins/mixin'
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
          title: '组织名称',
          dataIndex: 'name',
        },
        {
          title: '地区名称',
          dataIndex: 'areaName'
        },
        {
          title: '详细地址',
          dataIndex: 'address'
        },
        {
          title: '文件类型',
          dataIndex: 'fileTypeName'
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
        return this.$api.org.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            res.records.forEach(item => {
              item.fileTypeName = this.constants.data.fileType ? this.constants.data.fileType[item.fileType]['name'] : ''
            });
            return res
          })
      },
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
          that.$api.org.del({ids: that.selectedRowKeys})
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
