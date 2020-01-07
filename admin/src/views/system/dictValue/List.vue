<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.25
 * @desc 用户类型
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">

          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="字典值">
              <a-input v-model="queryParam.value" placeholder=""/>
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
      <a-button type="primary" icon="plus"  :disabled="selectedRow.length < 1" @click="handleEditItem(null)">新增</a-button>

      <a-button type="danger" icon="delete" @click="handleDelete" :disabled="selectedRowKeys.length < 1">删除</a-button>

    </div>

    <a-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :dataSource="data"
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
          <a @click="handleEditItem(record)">修改</a>
        </template>
      </span>

    </a-table>
    <a-pagination class="ant-table-pagination ant-pagination" :showTotal="total => `总共 ${total} 条`" showSizeChanger
                  :pageSize.sync="queryParam.page.pageSize"
                  @change="onChange" @showSizeChange="onShowSizeChange" :total="pageElements"
                  v-model="queryParam.page.pageNumber"/>
    <edit-form ref="editModal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import EditForm from './modules/EditForm'
import {mixin} from '@/mixins/mixin'
import {mapState} from 'vuex';
export default {
  mixins:[mixin],
  components: {
    STable,
    EditForm

  },
  props:{
    selectedRow:{
      type:Array,
      default:[]
    }
  },
  watch:{
    selectedRow(newVal){
      if(newVal.length>0){
        this.getDictValue();
      }
    }
  },
  data () {
    return {
      queryParam:{
        page: {pageNumber: 1, pageSize: 10}
      },
      columns: [
        {
          title: '字典类型',
          dataIndex: 'dictTypeName'
        },
        {
          title: '字典值',
          dataIndex: 'value'
        },
        {
          title: '字典名称',
          dataIndex: 'name'
        },
        {
          title: '排序序号',
          dataIndex: 'orderNum'
        },
        {
          title: '是否可修改',
          dataIndex: 'canUpdate',
          scopedSlots: {customRender: 'status'}
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '60px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data:[],
      pageElements: 0,
    }
  },
  computed: {
    ...mapState(['constants']),
  },
  methods: {
    handleEditItem (record) {
      this.$refs.editModal.add(record,this.selectedRow[0])
    },
    getDictValue(){
      let that = this;
      this.$api.dictValue.getPage(Object.assign(this.queryParam,{
        dictTypeId:this.selectedRow[0]
      }))
        .then(res => {
          that.data = res.records
          that.pageElements = res.totalElements
        })
    },
    handleOk(){
      this.getDictValue()
    },
    handleDelete () {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk () {
          that.$api.dictValue.del({ ids: that.selectedRowKeys })
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
