<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.11
 * @desc 楼栋管理
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">

          <a-col :md="6" :sm="24">
            <a-form-item label="地区">
              <select-area ref="selectAreaAll" :initArea="initCascader"
                           @selectedArea="selectedArea($event)"></select-area>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="地产名称">
              <a-input v-model="queryParam.estateName" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="楼栋名称">
              <a-input v-model="queryParam.buildingName" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="单元名称">
              <a-input v-model="queryParam.name" placeholder=""/>
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
      <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新增</a-button>

      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :action="importUrl"
        @change="handleImportExcel"
        :headers="tokenHeader"
        :beforeUpload="beforeUpload"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>

      <a-button type="primary" icon="export" @click="handleExportXls('/unit/exportExcel','楼栋单元信息')">导出</a-button>

      <a-button type="danger" icon="delete" @click="handleDelete" :disabled="selectedRowKeys.length < 1">删除</a-button>
      <!--http://172.16.30.246:25000/adminService/unit/importExcel-->

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
import selectArea from '@/components/Common/selectArea'
export default {
  mixins:[mixin],
  components: {
    STable,
    createForm,
    EditForm,
    selectArea

  },
  computed: {
    ...mapState(['constants','system']),
  },
  data () {
    return {
      columns: [
        {
          title: '地产名称',
          dataIndex: 'estateName'
        },
        {
          title: '楼栋名称',
          dataIndex: 'buildingName'
        },
        {
          title: '单元名称',
          dataIndex: 'name'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],

      loadData: parameter => {
        return this.$api.subject.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
      countries: [],
      goodsGroups: [],
      allBrand: [],
      uploadFileId: '',
      initCascader:[],
      importUrl:process.env.VUE_APP_BASE_API+'/unit/importExcel'
    }
  },
  methods: {

    handleDelete () {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk () {
          that.$api.subject.del({ ids: that.selectedRowKeys })
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

    selectedArea(area) {
      this.queryParam.areaId = area.value[area.value.length-1];
      this.queryParam.level = area.level[area.level.length-1];
    },

    beforeUpload (file) {
      return true
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
