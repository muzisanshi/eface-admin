<!--
 * @name List.vue
 * @author lw
 * @date 2019.12.16
 * @desc 同步用户记录
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">



          <a-col :md="4" :sm="24">
            <a-form-item label="设备名称">
              <a-input v-model="queryParam.deviceName" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="设备SN">
              <a-input v-model="queryParam.deviceSn" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="执行状态">
              <a-select showSearch allowClear placeholder="选择执行状态"  v-model="queryParam.executeStatus" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.actionExecuteStatus">
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="报文最后发送状态">
              <a-select showSearch allowClear placeholder="报文最后发送状态"  v-model="queryParam.lastMsgSendStatus" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.msgSendStatus">
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
      <a-button type="primary" @click="rePush" :disabled="selectedRowKeys.length < 1">重新推送</a-button>


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
  </a-card>
</template>

<script>
import { STable } from '@/components'
import {mapState} from 'vuex';
import {mixin} from '@/mixins/mixin'

export default {
  mixins:[mixin],
  components: {
    STable,
  },
  computed: {
    ...mapState(['constants']),
  },
  data () {
    return {
      columns: [
        {
          title: '用户电话',
          dataIndex: 'userPhoneNo'
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName'
        },
        {
          title: '设备SN',
          dataIndex: 'deviceSn'
        },
        {
          title: '执行状态',
          align:'center',
          dataIndex: 'executeStatusName'
        },
        {
          title: '执行次数',
          align:'center',
          dataIndex: 'executeNum'
        },
        {
          title: '报文发送成功次数',
          align:'center',
          dataIndex: 'msgSendSuccessNum'
        },
        {
          title: '执行描述',
          dataIndex: 'executeDesc'
        },
        {
          title: '报文最后发送状态',
          align:'center',
          dataIndex: 'lastMsgSendStatusName'
        },
        {
          title: '最后执行时间',
          dataIndex: 'lastExecuteDatetime'
        }
      ],
      loadData: parameter => {
        return this.$api.userAction.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            res.records.forEach(item=>{
              item.executeStatusName = this.constants.data.actionExecuteStatus?this.constants.data.actionExecuteStatus[item.executeStatus]['name']:''
              item.lastMsgSendStatusName = this.constants.data.msgSendStatus?this.constants.data.msgSendStatus[item.lastMsgSendStatus]['name']:''
            });
            return res
          })
      },
    }
  },
  methods: {

    rePush () {
      const that = this
      that.$confirm({
        title: '重新推送',
        content: '确定重新推送勾选的记录？',
        onOk () {
          that.$api.userAction.rePush({ ids: that.selectedRowKeys })
            .then(res => {
              that.$notification.success({
                message: '成功',
                description: `重新推送成功！`
              })
              that.handleOk()
            })
        },
        onCancel () {
        }
      })
    },

    handleDelete () {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk () {
          that.$api.userAction.del({ ids: that.selectedRowKeys })
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
