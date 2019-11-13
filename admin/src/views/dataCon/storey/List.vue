<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <!--<a-form layout="inline">-->
        <!--<a-row :gutter="48">-->
          <!--<a-col :md="6" :sm="24">-->
            <!--<a-form-item label="编码">-->
              <!--<a-input v-model="queryParam.code" placeholder=""/>-->
            <!--</a-form-item>-->
          <!--</a-col>-->

          <!--<a-col :md="6" :sm="24">-->
            <!--<span class="table-page-search-submitButtons">-->
              <!--<a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>-->
              <!--<a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>-->
            <!--</span>-->
          <!--</a-col>-->
        <!--</a-row>-->
      <!--</a-form>-->
    </div>

    <div class="table-operator" v-if="!selectGoodsStatus">
      <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新增</a-button>
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
          <a @click="handleModify(record)">修改</a>
        </template>
      </span>

    </s-table>
    <create-form ref="createModal" @ok="handleOk"/>
    <edit-form ref="editModal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import createForm from './modules/createForm'
import EditForm from './modules/EditForm'
import {mapState} from 'vuex';
import {mixin} from '@/mixins/mixin'

export default {
  mixins:[mixin],
  components: {
    STable,
    createForm,
    EditForm

  },
  props:{
    selectGoodsStatus:{
      type:Boolean,
      default:false
    }
  },
  watch:{
    selectGoodsStatus(newVal){
      if(newVal){
        this.selectedRowKeys = [];
      }
    }
  },
  computed: {
    ...mapState(['constants']),
  },
  data () {
    return {
      columns: [
        {
          title: '楼栋名称',
          dataIndex: 'buildingName'
        },
        {
          title: '地产名称',
          dataIndex: 'estateName'
        },
        {
          title: '楼层',
          dataIndex: 'name'
        },
        {
          title: '房间数量',
          dataIndex: 'roomNum'
        },
        {
          title: '楼栋单元',
          dataIndex: 'unitName'
        },
        {
          title: '楼栋备注',
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
        return this.$api.storey.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
      countries: [],
      goodsGroups: [],
      allBrand: [],
      uploadFileId: '',
    }
  },
  methods: {

    handleDelete () {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk () {
          that.$api.storey.del({ ids: that.selectedRowKeys })
            .then(res => {
              that.$notification.success({
                message: '成功',
                description: `删除成功！`
              })
              that.handleGoodsOk()
            })
        },
        onCancel () {
        }
      })
    },
    handleGoodsRecord(record){
      this.$refs.editRecordModal.add(this.selectedRows[0])
    },
    handleModify(item){
      this.handleEdit(item)
    },
    handleGoodsOk () {
      this.$refs.table.refresh()
      this.selectedRowKeys = [];
      this.selectedRows = []
    },
  }
}
</script>
<style>
.hasBack{
  background-color:#b75757;
}
.hasBack td {
  color:#fff;
}
</style>
