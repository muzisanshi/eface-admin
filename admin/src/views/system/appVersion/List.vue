<!--
 * @name List.vue
 * @author lw
 * @date 2019.12.16
 * @desc APP版本
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">

          <a-col :md="5" :sm="24">
            <a-form-item label="APP类型">
              <a-select showSearch allowClear placeholder="选择APP类型"  v-model="queryParam.appType" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.appType">
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="设备类型">
              <a-select showSearch allowClear placeholder="选择设备类型"  v-model="queryParam.deviceType" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.deviceType">
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="框架版本">
              <a-input v-model="queryParam.frameVer" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="内核版本">
              <a-input v-model="queryParam.rootVer" placeholder=""/>
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
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
    >
      <span slot="serial" slot-scope="text, record, index">

        {{ index + 1 }}
      </span>

      <span slot="frameAttResourceAddress" slot-scope="text, record">
        <template>
          <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 150px;">
            <a :href="record.frameAttResourceAddress">{{record.frameAttResourceAddress}}</a>
          </div>
        </template>
      </span>

      <span slot="rootAttResourceAddress" slot-scope="text, record">
        <template>
          <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 150px;">
            <a :href="record.rootAttResourceAddress">{{record.rootAttResourceAddress}}</a>
          </div>
        </template>
      </span>
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
          title: 'APP类型',
          dataIndex: 'appTypeName'
        },
        {
          title: '设备类型',
          dataIndex: 'deviceTypeName'
        },
        {
          title: '框架版本',
          dataIndex: 'frameVer'
        },
        {
          title: '内核版本',
          dataIndex: 'rootVer'
        },
        {
          title: '框架附件',
          scopedSlots: { customRender: 'frameAttResourceAddress' }
        },
        {
          title: '内核附件',
          scopedSlots: { customRender: 'rootAttResourceAddress' }
        },
        {
          title: '更新内容',
          dataIndex: 'content'
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
      initCascader:[],
      loadData: parameter => {
        return this.$api.appVersion.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            res.records.forEach(item=>{
              item.appTypeName = this.constants.data.appType?this.constants.data.appType[item.appType]['name']:''
              item.deviceTypeName = this.constants.data.deviceType?this.constants.data.deviceType[item.deviceType]['name']:''
            });
            return res
          })
      },
    }
  },
  methods: {

    selectedArea(area) {
      this.queryParam.areaId = area.value[area.value.length-1];
    },

    handleDelete () {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk () {
          that.$api.appVersion.del({ ids: that.selectedRowKeys })
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
