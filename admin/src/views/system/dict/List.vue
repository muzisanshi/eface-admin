<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.26
 * @desc 数据字典
-->
<template>
  <div>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-card :bordered="false" class="content">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">

                <a-col :md="6" :sm="24">
                  <a-form-item label="编码">
                    <a-input :maxLength="32" v-model="queryParam.code" placeholder=""/>
                  </a-form-item>
                </a-col>

                <a-col :md="6" :sm="24">
                  <a-form-item label="名称">
                    <a-input :maxLength="64" v-model="queryParam.name" placeholder=""/>
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
            <a-button type="primary" icon="plus" @click="handleEdit(null)">新增</a-button>

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
      </a-col>
      <a-col :span="12">
        <dict-value :selectedRow="selectedRowKeys"></dict-value>
      </a-col>
    </a-row>
  </div>

</template>

<script>
import { STable } from '@/components'
import EditForm from './modules/EditForm'
import dictValue from '../dictValue/List'
import { mixin } from '@/mixins/mixin'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  components: {
    STable,
    EditForm,
    dictValue

  },
  data () {
    return {
      columns: [
        {
          title: '编码',
          dataIndex: 'code'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '是否更新',
          dataIndex: 'canUpdate',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '是否显示',
          dataIndex: 'canView',
          scopedSlots: { customRender: 'status' }
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
      loadData: parameter => {
        return this.$api.dictType.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      }
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
          that.$api.dictType.del({ ids: that.selectedRowKeys })
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
    }
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
