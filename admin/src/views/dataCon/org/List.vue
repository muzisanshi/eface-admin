<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.6
 * @desc 主控中心
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="编码">
              <a-input :maxLength="32" v-model="queryParam.code" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="单位全称">
              <a-input :maxLength="64" v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="行政等级">
              <a-select
                showSearch
                allowClear
                placeholder="选择行政等级"
                optionFilterProp="children"
                :filterOption="filterCommonOption"
                :options="constants.list.orgLevel"
                v-model="queryParam.level"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="getOrgPage()">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchFormData">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="一级">
              <a-select showSearch placeholder="- 省 -" v-model="provinceName">
                <a-select-option
                  v-for="(item, index) in allProvinces"
                  :key="index"
                  :value="item.name"
                  @click="getAreaPage(item.id, 1)"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="二级">
              <a-select showSearch placeholder="- 市 -" v-model="cityName">
                <a-select-option
                  v-for="(item, index) in allCities"
                  :key="index"
                  :value="item.name"
                  @click="getAreaPage(item.id, 2)"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="三级">
              <a-select showSearch placeholder="- 区/县 -" v-model="countyName">
                <a-select-option
                  v-for="(item, index) in allCounties"
                  :key="index"
                  :value="item.name"
                  @click="getAreaPage(item.id, 3)"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="四级">
              <a-select showSearch placeholder="- 街道/乡镇 -" v-model="streetName">
                <a-select-option
                  v-for="(item, index) in allStreets"
                  :key="index"
                  :value="item.name"
                  @click="getAreaPage(item.id, 4)"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleEdit(null)">新增</a-button>
      <a-button
        type="danger"
        icon="delete"
        @click="handleDelete"
        :disabled="selectedRowKeys.length < 1"
      >删除</a-button>
    </div>

    <a-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :dataSource="data"
      :loading="orgLoading"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
        <a @click="handleDevice(record)">设备</a>

        <a-divider type="vertical" />

        <a @click="handleEdit(record)">编辑</a>

        <a-divider type="vertical" />

        <a @click="handleEnable(record)">{{ record.enable === true ? '关闭' : '开启' }}</a>
      </span>
    </a-table>

    <edit-form ref="editModal" @ok="getAreaPage(currentParentId, level)" />

    <a-modal
      :title="deviceParent && deviceParent.name + ' > 设备列表'"
      v-model="deviceVisible"
      :footer="null"
      :width="1080"
    >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="设备编号">
                <a-input :maxLength="64" placeholder="输入要搜索的内容" v-model="deviceSearch" />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="getDeviceData">查询</a-button>
                <a-button style="margin-left: 8px" @click="deviceSearch = ''">重置</a-button>
              </span>
            </a-col>

            <a-col :md="6" :sm="24"></a-col>

            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons" style="text-align: right;">
                <a-button type="primary" style="margin-right: 8px" @click="bindVisible = true">绑定</a-button>

                <a-upload
                  name="file"
                  :showUploadList="false"
                  :multiple="false"
                  :action="importUrl"
                  :beforeUpload="beforeUploadImport"
                  @change="handleImportExcel"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  :headers="tokenHeader"
                >
                  <a-button type="primary" icon="import">导入</a-button>
                </a-upload>

                <a-button
                  type="primary"
                  icon="export"
                  style="margin-left: 8px"
                  @click="handleExportXls('/device/exportBindOrgTemplate', '主控中心')"
                >模板</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        rowKey="id"
        :columns="deviceColumns"
        :dataSource="deviceData"
        :pagination="false"
        :loading="deviceLoading"
      >
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="getDeviceInfo(record)">详情</a>

          <a-divider type="vertical" />

          <a @click="deleteDevice(record)">删除</a>
        </span>
      </a-table>
    </a-modal>

    <a-modal title="绑定" v-model="bindVisible" @ok="bindDevice">
      <a-form>
        <a-form-item label="主控单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="32" :disabled="true" v-model="deviceParent.name" />
        </a-form-item>
        <a-form-item label="设备编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="32" :disabled="false" v-model="bindDeviceSn" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal class="deviceInfo" title="设备信息" cancelText="关闭" v-model="deviceInfoVisible">
      <a-form>
        <a-form-item label="主控单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="32" :disabled="true" v-model="deviceParent.name" />
        </a-form-item>

        <a-form-item label="POI信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="32" :disabled="true" v-model="deviceInfo.locationName" />
        </a-form-item>

        <a-form-item label="设备编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="32" :disabled="true" v-model="deviceInfo.sn" />
        </a-form-item>

        <a-form-item label="LBS信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="32" :disabled="false" v-model="deviceInfo.locationName" />
        </a-form-item>

        <a-form-item label="场景备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="32" :disabled="false" v-model="deviceInfo.remark" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import EditForm from './modules/EditForm'
import { mapState } from 'vuex'
import { mixin } from '@/mixins/mixin'

export default {
  components: {
    STable,
    EditForm
  },
  mixins: [mixin],
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      queryParam: {
        page: {
          pageNumber: 1,
          pageSize: 50
        }
      },
      columns: [
        {
          title: '编码',
          dataIndex: 'code'
        },
        {
          title: '单位简称',
          dataIndex: 'shortName'
        },
        {
          title: '单位全称',
          dataIndex: 'name'
        },
        {
          title: '行政等级',
          dataIndex: 'level'
        },
        {
          title: 'POI信息',
          dataIndex: 'address'
        },
        {
          title: '管理员',
          dataIndex: 'managerName'
        },
        {
          title: '手机号码',
          dataIndex: 'managerPhone'
        },
        {
          title: '状态',
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
      enableChecked: false,
      data: [],
      // loadData: parameter => {
      //   return this.$api.org.getPage(Object.assign(parameter, this.queryParam)).then(res => {
      //     res.records.forEach(item => {
      //       const index = this.constants.list.orgLevel.findIndex(i => i.value === item.level)
      //       item.level = this.constants.list.orgLevel ? this.constants.list.orgLevel[index]['label'] : ''
      //     })
      //     return res
      //   })
      // },

      deviceVisible: false,
      deviceParent: {
        name: ''
      },
      deviceColumns: [
        {
          title: '设备编号',
          dataIndex: 'sn'
        },
        {
          title: 'LBS信息',
          dataIndex: 'locationName'
        },
        {
          title: '创建时间',
          dataIndex: 'updateDatetime'
        },
        {
          title: '状态',
          dataIndex: 'enable',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      deviceData: [],
      deviceSearch: '',
      deviceLoading: false,
      bindDeviceSn: '',

      deviceInfoVisible: false,
      deviceInfo: '',

      bindVisible: false,

      importUrl: process.env.VUE_APP_ADMIN_SERVICE_BASE_URL + '/device/importDeviceBindExcel',

      level: 0,
      orgLoading: false,

      allProvinces: [],
      allCities: [],
      allCounties: [],
      allStreets: [],

      provinceParentId: undefined,
      cityParentId: undefined,
      countyParentId: undefined,
      strreetParentId: undefined,
      currentParentId: undefined,

      provinceName: undefined,
      cityName: undefined,
      countyName: undefined,
      streetName: undefined
    }
  },
  computed: {
    ...mapState(['constants'])
  },
  created() {
    this.getAreaPage(this.provinceParentId, this.level)
  },
  methods: {
    handleDelete() {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk() {
          that.$api.org.del({ ids: that.selectedRowKeys }).then(res => {
            that.$notification.success({
              message: '成功',
              description: `删除成功！`
            })
            // that.handleOk()
            that.getAreaPage(that.currentParentId, that.level)
          })
        },
        onCancel() {}
      })
    },

    handleEnable(record) {
      this.$refs.editModal.confirmLoading = true
      this.$api.org
        .editEnable({
          id: record.id
        })
        .then(res => {
          this.$refs.editModal.confirmLoading = false
          // this.$refs.editModal.form.resetFields()
          // this.$refs.table.refresh()
          this.selectedRowKeys = []
          this.selectedRows = []
          this.getOrgPage()
        })
    },

    handleDevice(record) {
      this.deviceVisible = true

      this.deviceParent = record

      console.log(record)

      this.getDeviceData()
    },

    getDeviceData() {
      this.deviceLoading = true
      this.$api.device
        .getPage({
          page: { pageNumber: 1, pageSize: 100 },
          orgId: this.deviceParent.id,
          sn: this.deviceSearch
        })
        .then(res => {
          this.deviceLoading = false
          this.deviceData = res.records
        })
    },

    deleteDevice(record) {
      this.$api.device
        .unBindOrg({
          id: record.id
        })
        .then(res => {
          this.getDeviceData()

          this.$notification.success({
            message: '删除',
            description: '删除成功'
          })
        })
    },

    getDeviceInfo(record) {
      this.deviceInfoVisible = true
      this.deviceInfo = record
    },

    bindDevice() {
      this.$api.device
        .bindOrg({
          deviceSn: this.bindDeviceSn,
          orgId: this.deviceParent.id
        })
        .then(res => {
          this.bindVisible = false
          this.bindDeviceSn = ''

          this.getDeviceData()

          this.$notification.success({
            message: '成功',
            description: '绑定成功'
          })
        })
    },

    getAreaPage(id, level) {
      if (id === '请选择') {
        this.level = 0
      } else {
        this.level = level
      }
      if (id !== '请选择') {
        this.provinceParentId = level === 1 ? id : this.provinceParentId
        this.cityParentId = level === 2 ? id : this.cityParentId
        this.countyParentId = level === 3 ? id : this.countyParentId
        this.strreetParentId = level === 4 ? id : this.strreetParentId
        this.currentParentId = id
      } else {
        if (level === 1) {
          this.provinceParentId = this.cityParentId = this.countyParentId = this.strreetParentId = this.currentParentId = undefined
        } else if (level === 2) {
          this.provinceParentId = this.provinceParentId
          this.cityParentId = undefined
          this.countyParentId = undefined
          this.strreetParentId = undefined
          this.currentParentId = this.provinceParentId
        } else if (level === 3) {
          this.provinceParentId = this.provinceParentId
          this.cityParentId = this.cityParentId
          this.countyParentId = undefined
          this.strreetParentId = undefined
          this.currentParentId = this.cityParentId
        } else if (level === 4) {
          this.provinceParentId = this.provinceParentId
          this.cityParentId = this.cityParentId
          this.countyParentId = this.countyParentId
          this.strreetParentId = undefined
          this.currentParentId = this.countyParentId
        }
      }
      this.$api.area.getPage({ page: { pageNumber: 1, pageSize: 50 }, parentId: this.currentParentId }).then(res => {
        // console.log(level)
        console.log(
          this.provinceParentId,
          this.cityParentId,
          this.countyParentId,
          this.strreetParentId,
          this.currentParentId
        )
        const areaData = res.records
        areaData.unshift({
          id: '请选择',
          name: '请选择'
        })

        if (level === 1) {
          this.allCounties = []
          this.allStreets = []

          this.cityName = undefined
          this.countyName = undefined
          this.streetName = undefined
        }
        if (level === 2) {
          this.allStreets = []

          this.countyName = undefined
          this.streetName = undefined
        }
        if (level === 3) {
          this.streetName = undefined
        }

        // console.log(this.provinceName, this.cityName, this.countyName, this.streetName)

        this.allProvinces = level === 0 ? (id !== '请选择' ? areaData : []) : this.allProvinces
        this.allCities = level === 1 ? (id !== '请选择' ? areaData : []) : this.allCities
        this.allCounties = level === 2 ? (id !== '请选择' ? areaData : []) : this.allCounties
        this.allStreets = level === 3 ? (id !== '请选择' ? areaData : []) : this.allStreets

        this.getOrgPage(id)
      })
    },

    getOrgPage(id) {
      this.orgLoading = true
      this.$api.org
        .getPage(
          Object.assign(
            {
              provinceId: this.provinceParentId,
              cityId: this.cityParentId,
              areaId: this.countyParentId,
              districtId: this.strreetParentId
              // level: this.constants.list.orgLevel[id === '请选择' && this.level !== 0 ? this.level - 1 : this.level].value
            },
            this.queryParam
          )
        )
        .then(res => {
          res.records.forEach(item => {
            const index = this.constants.list.orgLevel.findIndex(i => i.value === item.level)
            item.level = this.constants.list.orgLevel ? this.constants.list.orgLevel[index]['label'] : ''
          })
          // console.log(res)

          this.orgLoading = false
          this.data = res.records

          this.selectedRowKeys = []
          this.selectedRows = []
        })
    },

    resetSearchFormData() {
      this.queryParam = {
        page: { pageNumber: 1, pageSize: 50 }
      }

      this.allProvinces = this.allCities = this.allCounties = this.allStreets = []
      this.level = 0
      this.provinceName = this.cityName = this.countyName = this.streetName = this.provinceParentId = this.cityParentId = this.countyParentId = this.strreetParentId = this.currentParentId = undefined

      this.getAreaPage(this.provinceParentId, this.level)
      this.getOrgPage()
    }
  }
}
</script>

<style lang="scss">
.deviceInfo {
  .ant-modal-footer div {
    text-align: center;

    .ant-btn-primary {
      display: none;
    }
  }
}
</style>
