<!--
 * @name List.vue
 * @author lw
 * @date 2019.12.5
 * @desc 节点管理
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">

          <a-col :md="4" :sm="24">
            <a-form-item label="内网IP">
              <a-input v-model="queryParam.innerIp" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="外网IP">
              <a-input v-model="queryParam.outerIp" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="是否使用ssl">
              <a-select
                size="default"
                placeholder="请选择"
                optionFilterProp="children"
                v-model="queryParam.useSSL"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="是否启用">
              <a-select
                size="default"
                placeholder="请选择"
                optionFilterProp="children"
                v-model="queryParam.enable"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="tableRefresh">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus"  @click="handleEdit(null)">新增</a-button>

      <a-button type="danger" icon="delete" @click="handleDelete" :disabled="selectedRowKeys.length < 1">删除</a-button>

    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'radio'}"
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
import EditForm from './modules/EditForm'
import {mapState} from 'vuex';
import {mixin} from '@/mixins/mixin'

export default {
  mixins:[mixin],
  components: {
    STable,
    EditForm,
  },
  computed: {
    ...mapState(['constants']),
  },
  data () {
    return {
      columns: [
        {
          title: '节点ID',
          dataIndex: 'workId'
        },
        {
          title: '内网IP',
          dataIndex: 'insideIp'
        },
        {
          title: '外网IP',
          dataIndex: 'outerIp'
        },
        {
          title: '内网端口',
          dataIndex: 'innerPort'
        },
        {
          title: '外网端口',
          dataIndex: 'outerPort'
        },
        {
          title: '最大连接数',
          dataIndex: 'maxConnectionsSize'
        },
        {
          title: '是否使用ssl',
          dataIndex: 'useSSL',
          scopedSlots: {customRender: 'status'}
        },
        {
          title: '是否启用',
          dataIndex: 'enable',
          scopedSlots: {customRender: 'status'}
        },
        {
          title: '在线数量',
          dataIndex: 'countOnline'
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
      loadData: parameter => {
        return this.$api.deviceServiceNode.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
      importUrl:process.env.VUE_APP_ADMIN_SERVICE_BASE_URL+'/deviceModel/importExcel'
    }
  },
  methods: {

    handleDelete () {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk () {
          that.$api.deviceServiceNode.del({ id: that.selectedRowKeys[0] })
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
    },
  }
}
</script>
<style scoped>
.hasBack{
  background-color:#b75757;
}
.hasBack td {
  color:#fff;
}
  .table-page-search-wrapper .ant-col-sm-24{
    padding: 0 10px!important;
  }
</style>
