<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.26
 * @desc 用户信息
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">

          <a-col :md="5" :sm="24">
            <a-form-item label="姓名">
              <a-input :maxLength="64" v-model="queryParam.realName" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="电话号码">
              <a-input :maxLength="32" v-model="queryParam.phoneNo" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="用户类型">
              <a-select showSearch allowClear placeholder="选择用户类型"  v-model="queryParam.code" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.userTypeCode">
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item
              label="地产"
            >
              <a-input @click="selectDataCon(1)" :read-only="true" v-model="queryParam.estateName">
                <a-icon slot="suffix" @click="clearSelected" type="close" style="color: rgba(0, 0, 0, 0.25);"/>
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="位置地址">
              <a-input :maxLength="255" v-model="queryParam.fullAddress" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="识别结果">
              <a-select showSearch allowClear placeholder="选择识别结果"  v-model="queryParam.recResult" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.recResult">
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="8" style="padding-left: 10px">
            <a-form-item label="结束时间" :required="false">
              <a-range-picker
                :defaultValue="[moment().startOf('day').subtract(0, 'days'), moment().endOf('day')]"
                @change="onChange"
                :allowClear="false"
                :disabledDate="disabledDate"
                format="YYYY-MM-DD HH:mm:ss"
                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
              />
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
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :scroll="{ x: 1500 }"
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
          <a @click="handleLookEdit(record)">查看截图</a>
        </template>
      </span>

    </s-table>

    <select-data-Con ref="selectSuccess" @selectSuccess="selectSuccess"></select-data-Con>
    <look-img ref="editModal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import {mixin} from '@/mixins/mixin'
import {mapState} from 'vuex';
import moment from 'moment';
import selectDataCon from '@/components/Common/SelectDataCon'
import lookImg from './LookImg'
export default {
  mixins:[mixin],
  components: {
    STable,selectDataCon,lookImg
  },
  computed: {
    ...mapState(['constants']),
  },
  data () {
    return {
      queryParam:{
        estateName:'',
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 1 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      columns: [
        {
          title: '姓名',
          dataIndex: 'realName'
        },
        {
          title: '电话号码',
          dataIndex: 'phoneNo'
        },
        {
          title: '地产名称',
          dataIndex: 'estateName'
        },
        {
          title: '质量级别',
          dataIndex: 'qualityLevel'
        },
        {
          title: '识别时间',
          dataIndex: 'recDatetime'
        },
        {
          title: '相似度',
          dataIndex: 'similarity'
        },
        {
          title: '识别结果',
          dataIndex: 'recResultName'
        },
        {
          title: '位置名称',
          dataIndex: 'locationName'
        },
        {
          title: '位置地址',
          dataIndex: 'fullAddress'
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed:'right',
          width: '100px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      startDate:'',
      endDate:'',
      loadData: parameter => {
        return this.$api.recRecord.getPage(Object.assign(parameter, this.queryParam,{
          beginDatetime:this.startDate?this.startDate:this.moment().startOf('day').subtract(0, 'days').format(this.dateFormat),
          endDatetime:this.endDate?this.endDate:this.moment().endOf('day').format(this.dateFormat)
        }))
          .then(res => {
            res.records.forEach(item=>{
              item.recResultName = this.constants.data.recResult?this.constants.data.recResult[item.recResult]['name']:''
              item.qualityLevel = item.qualityLevel === 0?'优秀':item.qualityLevel === 1?'良好':item.qualityLevel === 2?'中':'差'
            });
            return res
          })
      }
    }
  },
  methods:{
    moment,

    handleLookEdit (record) {
      this.$refs.editModal.add(record)
    },

    onChange(dates) {
      this.startDate = dates[0].format(this.dateFormat);
      this.endDate = dates[1].format(this.dateFormat)
    },

    disabledDate(current) {
      return current && current > moment().endOf('day').add(1, 'days');
    },

    selectSuccess(value){
      console.log(value)
      this.queryParam.estateName = value.name
      this.queryParam.estateId = value.value
    },
    clearSelected(){
      this.queryParam.estateName = ''
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
