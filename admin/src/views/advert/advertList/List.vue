<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.28
 * @desc 广告列表
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="名称">
              <a-input :maxLength="64" v-model="queryParam.name" placeholder />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="广告编号">
              <a-input :maxLength="32" v-model="queryParam.no" placeholder />
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
                <a-select-option value>请选择</a-select-option>
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
              </a-select>
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

    <div class="table-operator" v-if="!selectAdStatus">
      <a-button type="primary" icon="plus" @click="handleEdit(null)">新增</a-button>

      <a-button
        type="danger"
        icon="delete"
        @click="handleDelete"
        :disabled="selectedRowKeys.length < 1"
      >删除</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectAdChange}"
    >
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>

      <a-avatar
        size="large"
        shape="square"
        :src="record | resourceFullAddressFilter"
        slot="resourceFullAddress"
        slot-scope="record"
      />
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

      <span slot="action" slot-scope="text, record">
        <template v-if="!selectAdStatus">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="openDevice(record)">查看播放设备</a>
        </template>
      </span>
    </s-table>
    <edit-form v-if="!selectAdStatus" ref="editModal" @ok="handleOk" />

    <a-modal v-model="deviceVisible" title="查看播放设备" :width="1080" @ok="deviceVisible = false">
      <!-- <a-spin :spinning="!deviceVisible"> -->
      <a-table rowKey="id" :columns="deviceColumns" :data-source="deviceData"></a-table>
      <!-- </a-spin> -->
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import EditForm from './modules/EditForm'
import { mixin } from '@/mixins/mixin'

export default {
  mixins: [mixin],
  components: {
    STable,
    EditForm
  },
  props: {
    selectAdStatus: {
      type: Boolean,
      default: false
    },
    playType: {
      type: String,
      default: 'ALL'
    }
  },
  watch: {
    selectAdStatus(newVal) {
      if (newVal) {
        this.selectedRowKeys = []
        this.$refs.table.refresh(true)
      }
    }
  },
  data() {
    return {
      queryParam: {
        enable: 'true'
      },
      columns: [
        {
          title: '广告编号',
          dataIndex: 'no'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '开始时间',
          dataIndex: 'beginDatetime'
        },
        {
          title: '结束时间',
          dataIndex: 'endDatetime'
        },
        {
          title: '是否启用',
          dataIndex: 'enable',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        if (this.selectAdStatus) {
          this.columns = [
            {
              title: '广告编号',
              dataIndex: 'no'
            },
            {
              title: '名称',
              dataIndex: 'name'
            },
            {
              title: '开始时间',
              dataIndex: 'beginDatetime'
            },
            {
              title: '结束时间',
              dataIndex: 'endDatetime'
            },
            {
              title: '是否启用',
              dataIndex: 'enable',
              scopedSlots: { customRender: 'status' }
            }
          ]
        } else {
          this.columns = [
            {
              title: '广告编号',
              dataIndex: 'no'
            },
            {
              title: '名称',
              dataIndex: 'name'
            },
            {
              title: '开始时间',
              dataIndex: 'beginDatetime'
            },
            {
              title: '结束时间',
              dataIndex: 'endDatetime'
            },
            {
              title: '是否启用',
              dataIndex: 'enable',
              scopedSlots: { customRender: 'status' }
            },
            {
              title: '操作',
              dataIndex: 'action',
              width: '180px',
              scopedSlots: { customRender: 'action' }
            }
          ]
        }
        return this.$api.ad
          .getPage(
            Object.assign(parameter, this.queryParam, {
              playType: this.playType
            })
          )
          .then(res => {
            return res
          })
      },

      deviceVisible: false,
      deviceColumns: [
        {
          title: 'SN',
          dataIndex: 'sn'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '设备型号',
          dataIndex: 'deviceModelName'
        },
        {
          title: '位置信息',
          dataIndex: 'locationName'
        },
        {
          title: '屏幕名称',
          dataIndex: 'screenWindowName'
        }
      ],
      deviceData: []
    }
  },
  methods: {
    onSelectAdChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys

      const hash = {}
      let rowsIds = []
      let defferentId = ''
      this.selectedRows = [...this.selectedRows, ...selectedRows]
      this.selectedRows = this.selectedRows.reduce(function(item, next) {
        hash[next.id] ? '' : (hash[next.id] = true && item.push(next))
        return item
      }, [])

      if (selectedRowKeys.length < this.selectedRows.length) {
        let newRows = []
        rowsIds = []
        this.selectedRows.map(item => {
          rowsIds.push(item.id)
        })

        defferentId = this.selectedRowKeys.concat(rowsIds).filter(function(v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v)
        })

        newRows = this.selectedRows.filter(item => !defferentId.some(ele => ele === item.id))

        this.selectedRows = [...newRows]
      }

      if (this.selectAdStatus) {
        console.log('最终', this.selectedRows)
        this.$emit('selectedAd', this.selectedRows)
      }
    },

    handleDelete() {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk() {
          that.$api.ad.del({ ids: that.selectedRowKeys }).then(res => {
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

    openDevice(record) {
      this.deviceVisible = true

      this.$api.ad
        .getDevices({
          id: record.id
        })
        .then(res => {
          console.log(res)
          this.deviceData = res
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
