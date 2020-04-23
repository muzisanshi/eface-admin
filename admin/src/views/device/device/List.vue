<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.18
 * @desc 设备管理
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="地产位置">
              <a-input @click="selectRoom()" v-model="roomName" :read-only="true" />
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="SN">
              <a-input :maxLength="64" v-model="queryParam.sn" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="型号名称">
              <a-input :maxLength="64" v-model="queryParam.deviceModelName" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="设备名称">
              <a-input :maxLength="32" v-model="queryParam.name" placeholder=""/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="位置名称">
              <a-input :maxLength="64" v-model="queryParam.locationName" placeholder=""/>
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

          <a-col :md="5" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="loadData()">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchFormDevice">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator" v-if="!selectDeviceStatus">
      <a-button type="primary" icon="plus" @click="handleEditInit(null)">新增</a-button>

      <!--<a-upload-->
      <!--name="file"-->
      <!--:showUploadList="false"-->
      <!--:multiple="false"-->
      <!--:action="importUrl"-->
      <!--@change="handleImportExcel"-->
      <!--:headers="tokenHeader"-->
      <!--&gt;-->
      <!--<a-button type="primary" icon="import">导入</a-button>-->
      <!--</a-upload>-->

      <!--<a-button type="primary" icon="export" @click="handleExportXls('/device/exportExcel','设备信息')">导出</a-button>-->

      <!--      <a-button type="primary" @click="recoverDevice" v-if="selectedRows.length === 1 && selectedRows[0].deviceStatus === '离线'">上线</a-button>-->

      <a-button type="primary" @click="resetDevice" v-if="selectedRows.length === 1 && selectedRows[0].deviceStatus === '在线'">重置</a-button>

      <a-button type="primary" @click="openGateBrake" v-if="selectedRows.length === 1 && selectedRows[0].deviceStatus === '在线'">开启闸机</a-button>

      <a-button type="primary" @click="lowerHairUser(selectedRows[0].id)" v-if="selectedRows.length === 1 && selectedRows[0].deviceStatus === '在线'">同步底库用户</a-button>

      <a-button type="primary" @click="rejectDevice" v-if="selectedRows.length === 1 && selectedRows[0].deviceStatus === '在线'">下线</a-button>

      <a-button type="danger" icon="delete" @click="handleDelete" :disabled="selectedRowKeys.length < 1">删除</a-button>

    </div>

    <a-table
      ref="table"
      size="default"
      rowKey="id"
      :pagination="false"
      :columns="columns"
      :scroll="{ x: 1800 }"
      :dataSource="data"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectDeviceChange}"
      @expand="handleExpand"
    >
      <span slot="serial" slot-scope="text, record, index">

        {{ index + 1 }}
      </span>

      <span slot="deviceStatus" slot-scope="text, record">
        <template>
          <div>
            <span v-if="record.deviceStatus === '在线'" style="width: 6px;height: 6px;background-color: #52c41a;display: inline-block;border-radius: 50%;margin-right: 8px;margin-bottom: 2px;"></span>
            <span v-if="record.deviceStatus !== '在线'" style="width: 6px;height: 6px;background-color: #FA6274;display: inline-block;border-radius: 50%;margin-right: 8px;margin-bottom: 2px;"></span>
            <span>{{ record.deviceStatus }}</span>
          </div>
        </template>
      </span>

      <div slot="expandedRowRender" slot-scope="record, index, indent, expanded" style="margin: 0">
        <p style="margin: 0; border-bottom: 1px dashed #DDD; padding: 10px 0;">主机信息:</p>
        <div class="mainEngine-mess">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="人脸显示数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <span>{{ itemData.mainEngine.faceShowNum?itemData.mainEngine.faceShowNum+'':'' }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="人脸显示时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <span>{{ itemData.mainEngine.faceShowSeconds }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="人证对比" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <span>{{ itemData.mainEngine.witnessComparison?'是':'否' }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="访客注册" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <span>{{ itemData.mainEngine.visitorRegister?'是':'否' }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="有效分钟" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <span>{{ itemData.mainEngine.validMinutes }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="主机备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <span>{{ itemData.mainEngine.remark }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="Ip地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <span>{{ itemData.mainEngine.network.ip }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="子网掩码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <span>{{ itemData.mainEngine.network.subnetMask }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="默认网关" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <span>{{ itemData.mainEngine.network.defaultGateway }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="MAC地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <span>{{ itemData.mainEngine.network.macAddress }}</span>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <p style="margin: 0; border-bottom: 1px dashed #DDD; padding: 10px 0;" v-if="itemData.cameras">相机信息:</p>

        <div class="mainEngine-mess">
          <div v-for="item in itemData.cameras" style="margin: 0; border-bottom: 1px dashed #DDD;">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item label="相机类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.cameraType?constants.data.cameraType[item.cameraType]['name'] : '' }}</span>
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="流媒体地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.streamAddress }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="解码类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.streamDecodeType?constants.data.streamDecodeType[item.streamDecodeType]['name'] : '' }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.remark }}</span>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item label="设备位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.locationName }}</span>
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="网络开关类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.gateBrake.networkSwitchType?constants.data.networkSwitchType[item.gateBrake.networkSwitchType]['name'] : '' }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="方向" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.gateBrake.direction?constants.data.direction[item.gateBrake.direction]['name'] : '' }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="备注(门禁闸机)" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.gateBrake.remark }}</span>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">

              <a-col :span="6">
                <a-form-item label="Ip地址(门禁闸机)" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.gateBrake.network.ip }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="子网掩码(门禁闸机)" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.gateBrake.network.subnetMask }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="默认网关(门禁闸机)" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.gateBrake.network.defaultGateway }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="MAC地址(门禁闸机)" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.gateBrake.network.macAddress }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item label="Ip地址(相机配置)" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.network.ip }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="子网掩码(相机配置)" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.network.subnetMask }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="默认网关(相机配置)" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.network.defaultGateway }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="MAC地址(相机配置)" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.network.macAddress }}</span>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <span>{{ item.enable?'是':'否' }}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>

      </div>

      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

      <span slot="action" slot-scope="text, record">
        <template v-if="!selectDeviceStatus">
          <a @click="handleEditInit(record)">修改</a>
          <a-divider type="vertical"/>
          <a @click="lowerHairUser(record.id)">同步底库用户</a>
        </template>
      </span>

    </a-table>
    <a-pagination
      class="ant-table-pagination ant-pagination"
      :showTotal="total => `总共 ${total} 条`"
      showSizeChanger
      :pageSize.sync="queryParam.page.pageSize"
      @change="onChange"
      @showSizeChange="onShowSizeChange"
      :total="pageElements"
      v-model="queryParam.page.pageNumber"/>
    <edit-form v-if="!selectDeviceStatus" ref="editModal" @ok="handleLoadOk"/>
    <select-room ref="selectRoom" @selectRoom="selectRoomSuccess"></select-room>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import EditForm from './modules/EditForm'
import { mapState } from 'vuex'
import { mixin } from '@/mixins/mixin'
import selectRoom from '@/components/Common/SelectRoom'
export default {
  mixins: [mixin],
  components: {
    STable,
    EditForm,
    selectRoom
  },
  props: {
    selectDeviceStatus: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    selectDeviceStatus(newVal) {
      if (newVal) {
        this.selectedRowKeys = []
      }
    }
  },
  computed: {
    ...mapState(['constants'])
  },
  data () {
    return {
      queryParam: {
        page: {
          pageNumber: 1,
          pageSize: 10
        }
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      columns: [],
      importUrl: process.env.VUE_APP_ADMIN_SERVICE_BASE_URL + '/device/importExcel',
      data: [],
      pageElements: 0,
      itemData: {
        mainEngine: {
          network: {}
        },
        cameras: []
      },
      roomName: ''
    }
  },
  created() {
    if (this.selectDeviceStatus) {
      this.columns = [
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
          title: '设备状态',
          dataIndex: 'deviceStatusName'
        },
        {
          title: '上线时间',
          dataIndex: 'onlineDatetime'
        },
        {
          title: '版本',
          dataIndex: 'softVer'
        },
        {
          title: '构建版本',
          dataIndex: 'buildVer'
        },
        {
          title: '设备配置版本',
          dataIndex: 'configVer'
        },
        {
          title: '数据库配置版本',
          dataIndex: 'dbConfigVer'
        },
        {
          title: '平台类型',
          dataIndex: 'platformType'
        },
        {
          title: '是否启用',
          dataIndex: 'enable',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '备注',
          dataIndex: 'remark'
        }
      ]
    } else {
      this.columns = [
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
          title: '设备状态',
          dataIndex: 'deviceStatus',
          scopedSlots: { customRender: 'deviceStatus' }
        },
        {
          title: '上线时间',
          dataIndex: 'onlineDatetime'
        },
        {
          title: '版本',
          dataIndex: 'softVer'
        },
        {
          title: '构建版本',
          dataIndex: 'buildVer'
        },
        {
          title: '设备配置版本',
          dataIndex: 'configVer'
        },
        {
          title: '数据库配置版本',
          dataIndex: 'dbConfigVer'
        },
        {
          title: '平台类型',
          dataIndex: 'platformType'
        },
        {
          title: '是否启用',
          dataIndex: 'enable',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '180px',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
    this.loadData()
  },
  methods: {

    resetSearchFormDevice () {
      this.queryParam = {
        page: { pageNumber: 1, pageSize: 10 }
      }
      this.initCascader = []
      this.roomName = ''
    },

    selectRoom() {
      this.$refs.selectRoom.add(null)
    },

    recoverDevice() {
      this.$api.device.recoverConnect({ deviceSn: this.selectedRows[0].sn })
        .then(res => {
          this.$notification.success({
            message: '成功',
            description: `上线成功！`
          })
          this.handleLoadOk()
        })
    },

    resetDevice() {
      this.$api.device.resetDevice({ deviceSn: this.selectedRows[0].sn })
        .then(res => {
          this.$notification.success({
            message: '成功',
            description: `重置成功！`
          })
          this.handleLoadOk()
        })
    },

    openGateBrake() {
      this.$api.device.openGateBrake({ deviceSn: this.selectedRows[0].sn })
        .then(res => {
          this.$notification.success({
            message: '成功',
            description: `开启闸机成功！`
          })
          this.handleLoadOk()
        })
    },

    rejectDevice() {
      this.$api.device.rejectConnect({ deviceSn: this.selectedRows[0].sn })
        .then(res => {
          this.$notification.success({
            message: '成功',
            description: `下线成功！`
          })
          this.handleLoadOk()
        })
    },

    selectRoomSuccess(value) {
      this.roomName = value.roomName
      this.queryParam = Object.assign(this.queryParam, value)
      // this.form.setFieldsValue({ roomName: value.roomName});
    },

    loadData() {
      this.data = []
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$api.device.getPage(Object.assign({}, this.queryParam))
        .then(res => {
          res.records.forEach(item => {
            item.deviceStatus = item.deviceStatus === 'OFFLINE' ? '离线' : '在线'
          })
          this.data = res.records
          this.pageElements = res.totalElements
        })
    },
    handleDelete () {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk () {
          that.$api.device.del({ ids: that.selectedRowKeys })
            .then(res => {
              that.$notification.success({
                message: '成功',
                description: `删除成功！`
              })
              that.handleLoadOk()
            })
        },
        onCancel () {
        }
      })
    },
    handleExpand(expanded, record) {
      if (expanded) {
        this.$api.device.getById({ id: record.id })
          .then(res => {
            this.itemData = res
          })
      } else {
        this.itemData = {
          mainEngine: {
            network: {}
          },
          cameras: []
        }
      }
    },

    onSelectDeviceChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      if (this.selectDeviceStatus) {
        this.$emit('selectedDevice', selectedRows)
        this.selectAdStatus = false
      }
    },

    lowerHairUser(id) {
      console.log(id)
      const that = this
      that.$confirm({
        title: '提示',
        content: '确定下发底库用户？',
        onOk () {
          that.$api.device.syncUser({ id: id })
            .then(res => {
              that.$notification.success({
                message: '成功',
                description: `下发底库用户成功！`
              })
            })
        },
        onCancel () {
        }
      })
    },

    handleEditInit(record) {
      this.$refs.editModal.addEdit(record)
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
.mainEngine-mess .ant-form-item{
  margin-bottom: 0;
}
</style>
