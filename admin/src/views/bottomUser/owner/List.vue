<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.27
 * @desc 用户管理
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="地区">
              <a-input @click="selectRoom()" v-model="roomName" :read-only="true" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24" v-if="selectUserStatus">
            <a-form-item label="用户类型">
              <a-select
                showSearch
                allowClear
                placeholder="选择用户类型"
                v-model="queryParam.userTypeCode"
                optionFilterProp="children"
                :filterOption="filterCommonOption"
                :options="constants.list.userTypeCode"
              ></a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="真实姓名">
              <a-input :maxLength="64" v-model="queryParam.realName" placeholder />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="电话号码">
              <a-input :maxLength="32" v-model="queryParam.phoneNo" placeholder />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="年龄级别">
              <a-select
                showSearch
                allowClear
                placeholder="选择年龄级别"
                v-model="queryParam.ageLevel"
                optionFilterProp="children"
                :filterOption="filterCommonOption"
                :options="constants.list.ageLevel"
              ></a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="性别">
              <a-select
                showSearch
                allowClear
                placeholder="选择性别"
                v-model="queryParam.sexual"
                optionFilterProp="children"
                :filterOption="filterCommonOption"
                :options="constants.list.sexual"
              ></a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="类型">
              <a-select
                showSearch
                allowClear
                placeholder="选择类型"
                v-model="queryParam.code"
                optionFilterProp="children"
                :filterOption="filterCommonOption"
                :options="userTypeCode"
              ></a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="审核状态">
              <a-select
                showSearch
                allowClear
                placeholder="选择审核状态"
                v-model="queryParam.auditStatus"
                optionFilterProp="children"
                :filterOption="filterCommonOption"
                :options="constants.list.auditStatus"
              ></a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="tableRefresh">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetUserSearchForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator" v-if="!selectUserStatus">
      <a-button type="primary" icon="plus" @click="handleEditUser(null)">新增</a-button>

      <a-button type="primary" icon="upload" @click="importFile()">导入</a-button>

      <a-button
        type="danger"
        icon="delete"
        @click="handleDelete"
        :disabled="selectedRowKeys.length < 1"
      >删除</a-button>

      <a-button
        v-if="selectedRowKeys.length >= 1"
        type="primary"
        @click="auditUser(null, 'AUDIT_PASS')"
      >通过</a-button>

      <a-button
        v-if="selectedRowKeys.length >= 1"
        type="danger"
        @click="auditUser(null, 'AUDIT_NOT_PASS')"
      >不通过</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
    >
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>

      <a-avatar
        size="large"
        shape="square"
        :src="record | resourceFullAddressFilter"
        slot="resourceFullAddress"
        slot-scope="record"
      />

      <a-avatar
        size="large"
        shape="square"
        :src="record | faceFullAddressFilter"
        slot="faceFullAddress"
        slot-scope="record"
      />

      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

      <span slot="action" slot-scope="text, record">
        <template v-if="!selectUserStatus">
          <a @click="handleEditUser(record)">修改</a>

          <template v-if="record.auditStatus === '等待审核'">
            <a-divider type="vertical" />

            <a @click="auditUser(record, 'AUDIT_PASS')">通过</a>

            <a-divider type="vertical" />

            <a @click="auditUser(record, 'AUDIT_NOT_PASS')">不通过</a>
          </template>
        </template>
      </span>
    </s-table>
    <edit-form v-if="!selectUserStatus" ref="editModal" @ok="handleOk" />
    <import-file v-if="!selectUserStatus" ref="importFile" @ok="handleOk" />
    <select-room ref="selectRoom" @selectRoom="selectRoomSuccess"></select-room>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import EditForm from './modules/EditForm'
import ImportFile from './modules/importFile'
import { mixin } from '@/mixins/mixin'
import { mapState } from 'vuex'
import selectRoom from '@/components/Common/SelectRoom'

const userTypeCode = [
  { label: '业主', value: 'OWNER' },
  { label: '访客', value: 'VISITOR' },
  { label: '租客', value: 'RENTER' }
]

export default {
  mixins: [mixin],
  components: {
    STable,
    EditForm,
    selectRoom,
    ImportFile
  },
  props: {
    userType: {
      type: String,
      default: 'OWNER'
    },
    selectUserStatus: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['constants'])
  },
  watch: {
    selectUserStatus(newVal) {
      if (newVal) {
        this.selectedRowKeys = []
      }
    }
  },
  data() {
    return {
      userTypeCode: userTypeCode,
      columns: [
        {
          title: '电话号码',
          dataIndex: 'phoneNo'
        },
        {
          title: '国际电话区号',
          dataIndex: 'areaCode'
        },
        {
          title: '类型',
          dataIndex: 'code'
        },
        {
          title: '姓名',
          dataIndex: 'realName'
        },
        // {
        //   title: '头像',
        //   scopedSlots: { customRender: 'resourceFullAddress' }
        // },
        {
          title: '底库照片',
          scopedSlots: { customRender: 'faceFullAddress' }
        },
        {
          title: '年龄级别',
          dataIndex: 'ageLevelName'
        },
        {
          title: '性别',
          dataIndex: 'sexualName'
        },
        // {
        //   title: '关系',
        //   dataIndex: 'relationship'
        // },
        {
          title: '审核状态',
          dataIndex: 'auditStatus'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return this.$api.user
          .getPage(
            Object.assign(parameter, this.queryParam, {
              // code: this.userType
            })
          )
          .then(res => {
            if (res) {
              res.records.forEach(item => {
                item.ageLevelName = this.constants.data.ageLevel
                  ? this.constants.data.ageLevel[item.ageLevel]['name']
                  : ''

                item.sexualName = this.constants.data.sexual ? this.constants.data.sexual[item.sexual]['name'] : ''

                if (item.faces && item.faces.length) {
                  item.faceFullAddress = item.faces[0].resourceFullAddress
                }

                const codeIndex = userTypeCode.findIndex(i => i.value === item.code)
                item.code = userTypeCode ? userTypeCode[codeIndex]['label'] : ''

                const auditStatusIndex = this.constants.list.auditStatus.findIndex(i => i.value === item.auditStatus)
                item.auditStatus = this.constants.list.auditStatus
                  ? this.constants.list.auditStatus[auditStatusIndex]['label']
                  : ''
              })
              return res
            }
          })
      },
      roomName: ''
    }
  },
  methods: {
    /* 重置list传参 */
    resetUserSearchForm() {
      this.queryParam = {}
      this.initCascader = []
      this.roomName = ''
    },

    selectRoom() {
      this.$refs.selectRoom.add()
    },

    handleEditUser(record) {
      this.$refs.editModal.addEdit(record, this.userType)
    },

    importFile() {
      this.$refs.importFile.add(this.userType)
    },

    selectRoomSuccess(value) {
      this.roomName = value.roomName
      this.queryParam = Object.assign(this.queryParam, value)
      // this.form.setFieldsValue({ roomName: value.roomName});
    },

    handleDelete() {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk() {
          that.$api.user.del({ ids: that.selectedRowKeys }).then(res => {
            that.$notification.success({
              message: '成功',
              description: `删除成功！`
            })
            that.handleOk()
          })
        },
        onCancel() {}
      })
    },

    auditUser(record, auditStatus) {
      // console.log(record)
      // console.log(this.selectedRowKeys)
      const that = this
      this.$confirm({
        title: auditStatus === 'AUDIT_PASS' ? '是否审核通过？' : '是否审核不通过？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          that.$api.user
            .auditUser({
              auditStatus: auditStatus,
              ids: record ? [record.id] : that.selectedRowKeys
            })
            .then(res => {
              that.handleOk()
              that.$notification.success({
                message: '成功',
                description: auditStatus === 'AUDIT_PASS' ? '审核通过成功！' : '审核不通过成功！'
              })
            })
        },
        onCancel() {}
      })
    }
  }
}
</script>
<style scoped>
.hasBack {
  background-color: #b75757;
}
.hasBack td {
  color: #fff;
}
.table-page-search-wrapper .ant-col-sm-24 {
  padding: 0 10px !important;
}
</style>
