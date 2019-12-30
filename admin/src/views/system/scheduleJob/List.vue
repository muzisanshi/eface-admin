<!--
 * @name List.vue
 * @author lw
 * @date 2019.12.6
 * @desc 定时任务
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="任务名称">
              <a-input v-model="queryParam.jobName"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="任务分组">
              <a-input v-model="queryParam.jobGroup"/>
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
      <a-button type="primary" icon="play-circle" @click="handleJob" :disabled="selectedRowKeys.length < 1">立即执行任务</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :scroll="{ x: 2000 }"
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
import {mapState} from 'vuex';
export default {
  mixins:[mixin],
  components: {
    STable,
    EditForm
  },
  data () {
    return {
      columns: [
        {
          title: '任务名称',
          dataIndex: 'jobName'
        },
        {
          title: '任务分组',
          dataIndex: 'jobGroup'
        },
        {
          title: '服务地址',
          dataIndex: 'serviceUrl'
        },
        {
          title: '接口地址',
          dataIndex: 'interfaceUrl'
        },
        {
          title: '定时任务表达式',
          dataIndex: 'cronExpression'
        },
        {
          title: '开启状态',
          dataIndex: 'scheduleStatus'
        },
        {
          title: '执行状态',
          dataIndex: 'triggerState'
        },
        {
          title: '详细备注',
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
        return this.$api.scheduleJob.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            res.records.forEach(item => {
              item.scheduleStatus = this.constants.data.scheduleStatus ? this.constants.data.scheduleStatus[item.scheduleStatus]['name'] : ''
              item.triggerState = item.triggerState === 'NONE' ? '无': item.triggerState === 'NORMAL' ? '正常' : item.triggerState === 'PAUSED' ? '暂停' :  item.triggerState === 'COMPLETE' ? '完成' : item.triggerState === 'ERROR' ? '错误' : item.triggerState === 'BLOCKED' ? '阻塞' :''
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
    handleDelete () {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk () {
          that.$api.scheduleJob.del({ id: that.selectedRowKeys[0] })
            .then(res => {
              that.$notification.success({
                message: '成功',
                description: '删除成功！'
              })
              that.handleOk()
            })
        },
        onCancel () {
        }
      })
    },

    handleJob(){
      const that = this
        that.$api.scheduleJob.executeJob({ id: that.selectedRowKeys[0] })
            .then(res => {
              that.$notification.success({
                message: '成功',
                description: '成功！'
              })
              that.handleOk()
          })
    }
  }
}
</script>
