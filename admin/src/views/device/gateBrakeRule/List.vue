<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.25
 * @desc 门禁闸机常用规则
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">

          <a-col :md="4" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="是否时间限制">
              <a-select
                size="default"
                placeholder="请选择"
                optionFilterProp="children"
                v-model="queryParam.timeLimit"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
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
import {mixin} from '@/mixins/mixin'

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
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '是否时间限制',
          dataIndex: 'timeLimit',
          scopedSlots: {customRender: 'status'}
        },
        {
          title: '有效时间',
          dataIndex: 'validTime'
        },
        {
          title: '有效分钟数',
          dataIndex: 'validMinutes'
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
        return this.$api.gateBrakeRule.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            res.records.forEach(item=>{
              item.validTime = this.timeStamp(item.validMinutes)
            });
            return res
          })
      }
    }
  },
  methods: {

    timeStamp (StatusMinute) {
      var day=parseInt(StatusMinute/60/24);
      var hour=parseInt(StatusMinute/60%24);
      var min= parseInt(StatusMinute % 60);
      StatusMinute="";
      if (day > 0)
      {
        StatusMinute= day + "天";
      }
      if (hour>0)
      {
        StatusMinute += hour + "小时";
      }
      if (min>0)
      {
        StatusMinute += parseFloat(min) + "分钟";
      }
      return StatusMinute;
    },
    handleDelete () {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk () {
          that.$api.gateBrakeRule.del({ ids: that.selectedRowKeys })
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
