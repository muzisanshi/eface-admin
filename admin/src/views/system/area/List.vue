<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.8
 * @desc 地区管理list
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
          <a-col :md="4" :sm="24">
            <a-form-item label="是否启用">
              <a-select
                size="default"
                placeholder="请选择"
                optionFilterProp="children"
                v-model="queryParam.enable"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="loadData()">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleEdit(null)">新增</a-button>
      <a-button type="danger" icon="delete" @click="handleDelete" :disabled="selectedRowKeys.length < 1">删除</a-button>
      <a-button type="danger" icon="delete" @click="handleDeleteLogic" :disabled="selectedRowKeys.length < 1">逻辑删除
      </a-button>
    </div>

    <a-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :dataSource="data"
      :pagination="false"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @expand="handleExpand"
      :expandedRowKeys="expandedRowKeys"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>

      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit(record,'addChild')">新增下级</a>
        </template>
      </span>

    </a-table>
    <a-pagination class="ant-table-pagination ant-pagination" :showTotal="total => `总共 ${total} 条`" showSizeChanger
                  :pageSize.sync="queryParam.page.pageSize"
                  @change="onChange" @showSizeChange="onShowSizeChange" :total="pageElements"
                  v-model="queryParam.page.pageNumber"/>
    <edit-form ref="editModal" @ok="handleLoadOk"/>
  </a-card>
</template>

<script>
  import EditForm from './modules/EditForm'
  import {mixin} from '@/mixins/mixin'
  export default {
    components: {
      EditForm
    },
    mixins: [mixin],
    data() {
      return {
        queryParam: {
          page: {
            pageNumber: 1,
            pageSize: 10
          }
        },
        columns: [
          {
            title: '名称',
            dataIndex: 'name'
          },
          {
            title: '级别',
            dataIndex: 'level'
          },
          {
            title: '父级区域名称',
            dataIndex: 'parentAreaName'
          },
          {
            title: '邮政编码',
            dataIndex: 'postCode'
          },
          {
            title: '简写名称',
            dataIndex: 'shortName'
          },

          {
            title: '拼英名称',
            dataIndex: 'pinyinName'
          },
          {
            title: '拼英简写',
            dataIndex: 'pinyinShortName'
          },
          {
            title: '是否启用',
            dataIndex: 'enable',
            scopedSlots: {customRender: 'status'}
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: {customRender: 'action'}
          }
        ],
        data: [],
        pageElements: 0,
        expandedRowKeys: [],
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      loadData() {
        this.data = []
        this.expandedRowKeys = []
        this.selectedRows = []
        this.$api.area.getPage(Object.assign({}, this.queryParam))
          .then(res => {
            for (let i = 0, j = res.records.length; i < j; i++) {
              res.records[i].children = []
            }
            this.data = res.records
            this.pageElements = res.totalElements
          })
      },
      handleDelete() {
        const that = this
        that.$confirm({
          title: '删除',
          content: '确定删除勾选的记录？',
          onOk() {
            that.$api.area.del({ids: that.selectedRowKeys})
              .then(res => {
                that.$notification.success({
                  message: '成功',
                  description: `删除成功！`
                })
                that.handleLoadOk()
              })
          },
          onCancel() {
          }
        })
      },
      handleDeleteLogic() {
        const that = this
        that.$confirm({
          title: '逻辑删除',
          content: '确定逻辑删除勾选的记录？',
          onOk() {
            that.$api.area.delLog({ids: that.selectedRowKeys})
              .then(res => {
                that.$notification.success({
                  message: '成功',
                  description: `逻辑删除成功！`
                })
                that.handleLoadOk()
              })
          },
          onCancel() {
          }
        })
      },
      handleEdit(record, addChild) {
        this.$refs.editModal.add(record, addChild)
      },

      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      buildSubData(data, children, parentId) {
        for (let i = 0, j = data.length; i < j; i++) {
          let d = data[i]
          if (d.id === parentId) {
            d.children = children
            break
          }
          d.children = this.buildSubData(d.children, children, parentId)
        }
        return data
      },
      expand(id) {
        this.$api.area.getPage({parentId: id, page: {pageNumber: 1, pageSize: 100}})
          .then(res => {
            for (let i = 0, j = res.records.length; i < j; i++) {
              res.records[i].children = []
            }
            this.data = this.buildSubData(this.data, res.records, id)
          })
      },
      handleExpand(expanded, record) {
        const l = this.expandedRowKeys
        if (this.expandedRowKeys.includes(record.id)) {
          l.splice(l.findIndex(element => element === record.id), 1)
        } else {
          l.push(record.id)
          this.expand(record.id)
        }
        this.expandedRowKeys = l
      },
    }
  }
</script>
