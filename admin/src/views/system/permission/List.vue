<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.8
 * @desc 权限管理list
-->
<template>
  <a-card :bordered="false">

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleEdit(null)" type="primary" icon="plus">新增</a-button>
      <a-button type="danger" icon="delete" @click="handleDelete" :disabled="selectedRowKeys.length < 1">删除</a-button>
    </div>

    <!-- table区域-begin -->
    <div>

      <a-table
        :columns="columns"
        ref="table"
        size="default"
        rowKey="id"
        :pagination="false"
        :dataSource="data"
        @expand="handleExpand"
        :expandedRowKeys="expandedRowKeys"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">

        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>

        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleAddSub(record)">添加子菜单</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
      <a-pagination class="ant-table-pagination ant-pagination" showSizeChanger :showTotal="total => `总共 ${total} 条`"
                    :pageSize.sync="queryParam.page.pageSize"
                    @change="onChange" @showSizeChange="onShowSizeChange" :total="pageElements"
                    v-model="queryParam.page.pageNumber"/>
    </div>
    <!-- table区域-end -->

    <permission-modal ref="editModal" @ok="handleOk"></permission-modal>

  </a-card>
</template>

<script>
  import {mapState} from 'vuex';
  import {STable} from '@/components'
  import PermissionModal from './modules/EditForm'
  import {mixin} from '@/mixins/mixin'

  export default {
    name: 'menuList',
    mixins: [mixin],
    components: {
      STable,
      PermissionModal,
    },
    computed: {
      ...mapState(['constants'])
    },
    data() {
      return {
        queryParam: {
          page: {
            pageNumber: 1,
            pageSize: 10
          }
        },
        description: '这是菜单管理页面',
        // 表头
        columns: [
          {
            title: '编码',
            dataIndex: 'code',
            key: 'code'
          },
          {
            title: '权限名称',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: '权限类型',
            dataIndex: 'permissionTypeName',
            key: 'permissionTypeName'
          },
          {
            title: '父级权限名称',
            dataIndex: 'parentPermissionName',
            key: 'parentPermissionName'
          },
          {
            title: '授权标识',
            dataIndex: 'sn',
            key: 'sn'
          },
          {
            title: '资源地址',
            dataIndex: 'url',
            key: 'url'
          },
          {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: 'center',
            width: 150
          }
        ],
        loading: false,
        url: {
          list: '/sys/permission/list',
          delete: '/sys/permission/delete',
          deleteBatch: '/sys/permission/deleteBatch'
        },
        data: [],
        pageElements: 0,
        expandedRowKeys: []
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      loadData() {
        this.expandedRowKeys = []
        this.$api.permission.getPage(Object.assign({}, this.queryParam))
          .then(res => {
            for (let i = 0, j = res.records.length; i < j; i++) {
              res.records[i].children = []
              res.records[i].permissionTypeName = this.constants.data.permissionType ? this.constants.data.permissionType[res.records[i].permissionType]['name'] : ''
            }
            this.data = res.records
            this.pageElements = res.totalElements
          })
      },

      handleDetail: function (record) {
        this.$refs.editModal.edit(record);
        this.$refs.editModal.title = "详情";
        this.$refs.editModal.disableSubmit = true;
      },
      handleAddSub(record) {
        this.$refs.editModal.title = "添加子菜单";
        this.$refs.editModal.localMenuType = 1;
        this.$refs.editModal.disableSubmit = false;
        this.$refs.editModal.edit(null, record.id);
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
        this.$api.permission.getPage({parentId: id, page: {pageNumber: 1, pageSize: 100}})
          .then(res => {
            for (let i = 0, j = res.records.length; i < j; i++) {
              res.records[i].children = []
              res.records[i].permissionTypeName = this.constants.data.permissionType ? this.constants.data.permissionType[res.records[i].permissionType]['name'] : ''
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

      handleDelete() {
        const that = this
        that.$confirm({
          title: '删除',
          content: '确定删除勾选的记录？',
          onOk() {
            that.$api.permission.del({ids: that.selectedRowKeys})
              .then(res => {
                that.$notification.success({
                  message: '成功',
                  description: `删除成功！`
                })
                that.handleOk()
              })
          },
          onCancel() {
          }
        })
      },
      handleOk() {
        this.loadData()
      },
    }
  }
</script>
<style scoped>

</style>