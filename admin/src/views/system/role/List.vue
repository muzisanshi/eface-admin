<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.8
 * @desc 角色管理list
-->
<template>
  <a-card :bordered="false" class="card-area">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" @keyup.enter.native="$refs.table.refresh(true)">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="名称" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input placeholder="请输入名称查询" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin-top: 5px">
      <a-button @click="handleEdit(null)" type="primary" icon="plus">新增</a-button>
      <a-button type="danger" icon="delete" @click="handleDelete('')" :disabled="selectedRowKeys.length < 1">删除
      </a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <s-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      >

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handlePerssion(record.id)">授权</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </s-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <role-modal ref="editModal" @ok="handleOk"></role-modal>
    <user-role-modal ref="modalUserRole" @checkedMenu='checkedMenu' :selectType="selectMenu"
                     :initChecked="initCheckedKeys"></user-role-modal>
  </a-card>
</template>

<script>
  import {STable} from '@/components'
  import RoleModal from './modules/RoleModal'
  import UserRoleModal from './modules/UserRoleModal'
  import {mixin} from '@/mixins/mixin'
  import JDate from '@/components/Date/selectDate'

  export default {
    name: "RoleList",
    mixins: [mixin],
    components: {
      RoleModal,
      UserRoleModal,
      JDate,
      STable
    },
    data() {
      return {

        description: '角色管理页面',
        data: [],
        // 查询条件
        queryParam: {name: '',},
        // 表头
        columns: [
          {
            title: '角色名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '描述',
            align: "center",
            dataIndex: 'remark'
          },
          {
            title: '创建时间',
            dataIndex: 'createDatetime',
            align: "center"
          },
          {
            title: '更新时间',
            dataIndex: 'updateDatetime',
            align: "center"
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        selectMenu: 'MENU_BUTTON',
        initCheckedKeys: [],
        loadData: parameter => {
          return this.$api.role.getPage(Object.assign(parameter, this.queryParam))
            .then(res => {
              return res
            })
        },
      }
    },
    methods: {
      handlePerssion(roleId) {
        let that = this;
        that.$api.role.getPermissionsById({
          id: roleId
        })
          .then(res => {
            that.initCheckedKeys = res;
            that.$refs.modalUserRole.show();
            that.itemId = roleId;
          })

      },
      handleDelete(id) {
        const that = this
        let ids = [];
        if (id) {
          ids.push(id)
        } else {
          ids = that.selectedRowKeys
        }

        that.$confirm({
          title: '删除',
          content: '确定删除勾选的记录？',
          onOk() {
            that.$api.role.del({ids: ids})
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
      checkedMenu(selectList) {
        let that = this;
        if (selectList.length > 0) {
          that.$api.role.authorize({
            id: that.itemId,
            permissionIds: selectList
          })
            .then(res => {
              that.$notification.success({
                message: '成功',
                description: `授权成功！`
              })
            })
        } else {
          that.$notification.error({
            message: '提示',
            description: `请选择菜单或按钮授权！`
          })
        }
      }
    }
  }
</script>
<style scoped>
</style>