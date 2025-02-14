<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.11
 * @desc 房间管理
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="地区">
              <select-area ref="selectAreaAll" :initArea="initCascader"
                           @selectedArea="selectedArea($event)"></select-area>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="地产名称">
              <a-input :maxLength="64" v-model="queryParam.estateName" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="3" :sm="24">
            <a-form-item label="楼栋名称">
              <a-input :maxLength="64" v-model="queryParam.buildingName" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="3" :sm="24">
            <a-form-item label="单元名称">
              <a-input :maxLength="64" v-model="queryParam.unitName" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="3" :sm="24">
            <a-form-item label="楼层名称">
              <a-input :maxLength="64" v-model="queryParam.storeyName" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="3" :sm="24">
            <a-form-item label="房间名称">
              <a-input :maxLength="64" v-model="queryParam.name" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="3" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="tableRefresh">查询</a-button>
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
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="handleImportExcel"
        :headers="tokenHeader"
        :beforeUpload="beforeUploadImport"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>

      <a-button type="primary" icon="export" @click="handleExportXls('/room/exportExcel','房间信息')">导出</a-button>

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
import createForm from './modules/CreateForm'
import EditForm from './modules/EditForm'
import {mapState} from 'vuex';
import {mixin} from '@/mixins/mixin'
import selectArea from '@/components/Common/SelectArea'

export default {
  mixins:[mixin],
  components: {
    STable,
    createForm,
    EditForm,
    selectArea

  },
  computed: {
    ...mapState(['constants']),
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
          title: '楼栋单元',
          dataIndex: 'unitName'
        },
        {
          title: '楼层',
          dataIndex: 'storeyName'
        },
        {
          title: '房间名称',
          dataIndex: 'name'
        },
        {
          title: '房间编号',
          dataIndex: 'no'
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
        return this.$api.room.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
      countries: [],
      goodsGroups: [],
      allBrand: [],
      uploadFileId: '',
      initCascader:[],
      importUrl:process.env.VUE_APP_ORG_SERVICE_BASE_URL + '/room/importExcel'
    }
  },
  methods: {

    handleDelete () {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk () {
          that.$api.room.del({ ids: that.selectedRowKeys })
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

    selectedArea(area) {
      this.queryParam.areaId = area.value[area.value.length-1];
      this.queryParam.level = area.level[area.level.length-1];
    },


    handleGoodsRecord(record){
      this.$refs.editRecordModal.add(this.selectedRows[0])
    },
    handleModify(item){
      this.handleEdit(item)
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
