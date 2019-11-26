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
          <a-col :md="4" :sm="24">
            <a-form-item label="sn">
              <a-input v-model="queryParam.sn" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="型号名称">
              <a-input v-model="queryParam.deviceModelName" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="设备名称">
              <a-input v-model="queryParam.name" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="位置">
              <a-input v-model="queryParam.locationName" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus"  @click="handleEditInit(null)">新增</a-button>

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

      <a-button type="danger" icon="delete" @click="handleDelete" :disabled="selectedRowKeys.length < 1">删除</a-button>

    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @expand="handleExpand"
      @expandedRowsChange="handleExpand"
      @expandedRowRender="handleExpand"
    >
      <span slot="serial" slot-scope="text, record, index">

        {{ index + 1 }}
      </span>

      <a-avatar size="large" shape="square" :src="record | resourceFullAddressFilter" slot="resourceFullAddress" slot-scope="record"/>


      <div slot="expandedRowRender" @expandedRowRender="handleExpand" slot-scope="record, index, indent, expanded" style="margin: 0">
        <p style="margin: 0; border-bottom: 1px dashed #DDD; padding: 10px 0;">主机信息:</p>
        <!--<div class="mainEngine-mess">-->
          <!--<a-row :gutter="24">-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="人脸显示数量" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.faceShowNum}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="人脸显示时间" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.faceShowSeconds}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="人证对比" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.witnessComparison?'是':'否'}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="访客注册" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.visitorRegister?'是':'否'}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
          <!--</a-row>-->
          <!--<a-row :gutter="24">-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="有效分钟" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.validMinutes}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="主机备注" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.remark}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="网络开关类型" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.gateBrake.networkSwitchType?constants.data.networkSwitchType[record.mainEngine.gateBrake.networkSwitchType]['name'] : ''}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="方向" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.gateBrake.direction?constants.data.direction[record.mainEngine.gateBrake.direction]['name'] : ''}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
          <!--</a-row>-->
          <!--<a-row :gutter="24">-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="门禁闸机备注" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.gateBrake.remark}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="Ip地址" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.gateBrake.network.ip}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="子网掩码" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.gateBrake.network.subnetMask}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="默认网关" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.gateBrake.network.defaultGateway}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
          <!--</a-row>-->

          <!--<a-row :gutter="24">-->
            <!--<a-col :span="6">-->
              <!--<a-form-item label="MAC地址" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                <!--<span>{{record.mainEngine.gateBrake.network.macAddress}}</span>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
          <!--</a-row>-->
        <!--</div>-->
        <!--<p style="margin: 0; border-bottom: 1px dashed #DDD; padding: 10px 0;" v-if="record.cameras">相机信息:</p>-->

        <!--<div class="mainEngine-mess">-->
          <!--<div v-for="item in record.cameras">-->
            <!--<a-row :gutter="24">-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="相机类型" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.cameraType?constants.data.cameraType[item.cameraType]['name'] : ''}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->

              <!--<a-col :span="6">-->
                <!--<a-form-item label="流媒体地址" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.streamAddress}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="解码类型" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.streamDecodeType?constants.data.streamDecodeType[item.streamDecodeType]['name'] : ''}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.remark}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
            <!--</a-row>-->


            <!--<a-row :gutter="24">-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="设备位置" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.locationName}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->

              <!--<a-col :span="6">-->
                <!--<a-form-item label="网络开关类型" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.gateBrake.networkSwitchType?constants.data.networkSwitchType[item.gateBrake.networkSwitchType]['name'] : ''}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="方向" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.gateBrake.direction?constants.data.direction[item.gateBrake.direction]['name'] : ''}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="备注(门禁闸机)" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{ item.gateBrake.remark }}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
            <!--</a-row>-->

            <!--<a-row :gutter="24">-->

              <!--<a-col :span="6">-->
                <!--<a-form-item label="Ip地址(门禁闸机)" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.gateBrake.network.ip}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="子网掩码(门禁闸机)" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.gateBrake.network.subnetMask}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="默认网关(门禁闸机)" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.gateBrake.network.defaultGateway}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="MAC地址(门禁闸机)" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.gateBrake.network.macAddress}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
            <!--</a-row>-->
            <!--<a-row :gutter="24">-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="Ip地址(网络配置)" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.network.ip}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="子网掩码(网络配置)" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.network.subnetMask}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="默认网关(网络配置)" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.network.defaultGateway}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
              <!--<a-col :span="6">-->
                <!--<a-form-item label="MAC地址(网络配置)" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
                  <!--<span>{{item.network.macAddress}}</span>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
            <!--</a-row>-->

            <!--<a-row :gutter="24">-->

            <!--</a-row>-->
          <!--</div>-->
        <!--</div>-->

      </div>

      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEditInit(record)">修改</a>
        </template>
      </span>

    </s-table>
    <edit-form ref="editModal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import EditForm from './modules/EditForm'
import {mapState} from 'vuex';
import {mixin} from '@/mixins/mixin'

export default {
  mixins:[mixin],
  components: {
    STable,
    EditForm,
  },
  computed: {
    ...mapState(['constants']),
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
      columns: [
        {
          title: 'sn',
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
          title: '版本',
          dataIndex: 'softVer'
        },
        {
          title: '是否启用',
          dataIndex: 'enable',
          scopedSlots: {customRender: 'status'}
        },
        {
          title: '是否删除',
          dataIndex: 'deleted',
          scopedSlots: {customRender: 'status'}
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
        return this.$api.device.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
      importUrl:process.env.VUE_APP_BASE_API+'/device/importExcel',
      expandedRowKeys:[]
    }
  },
  methods: {

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
              that.handleOk()
            })
        },
        onCancel () {
        }
      })
    },
    handleExpand(expanded, record) {
      console.log(expanded, record)
    },

    handleEditInit(record){
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
