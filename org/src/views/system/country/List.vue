<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="编码">
              <a-input :maxLength="32" v-model="queryParam.code"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input :maxLength="64" v-model="queryParam.name"/>
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
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>

      <a-avatar size="large" shape="square" :src="record | resourceFullAddressFilter" slot="resourceFullAddress" slot-scope="record"/>

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
            title: '#',
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '图片',
            scopedSlots: { customRender: 'resourceFullAddress' }
          },
          {
            title: '编码',
            dataIndex: 'code'
          },
          {
            title: '名称',
            dataIndex: 'name'
          },
          {
            title: '简写标志',
            dataIndex: 'shortMark'
          },
          {
            title: '全写标志',
            dataIndex: 'fullMark'
          },
          {
            title: '国际电话区号',
            dataIndex: 'nationalAreaCode.areaCode'
          },
          {
            title: '是否启用注册登录',
            dataIndex: 'nationalAreaCode.enableLoginRegister'
          },
          {
            title: '排序序号',
            dataIndex: 'nationalAreaCode.orderNum'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
          }
        ],
        loadData: parameter => {
          return this.$api.country.getPage(Object.assign(parameter, this.queryParam))
            .then(res => {
              res.records.forEach(item=>{
                item.nationalAreaCode.enableLoginRegister = item.nationalAreaCode.enableLoginRegister?'是':'否'
              });
              return res
            })
        }
      }
    },
    methods: {
      handleDelete () {
        const that = this
        that.$confirm({
          title: '删除',
          content: '确定删除勾选的记录？',
          onOk () {
            that.$api.country.del({ ids: that.selectedRowKeys })
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
