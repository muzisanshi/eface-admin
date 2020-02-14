<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.26
 * @desc 用户信息
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :form="form">
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
            <a-form-item label="选择时间段" :required="false">
              <a-range-picker
                v-decorator="['rangeTimePicker',{initialValue: this.defaultDate}]"
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
              <a-button style="margin-left: 8px" @click="resetSearchBUForm">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="danger" icon="delete" @click="handleDelete" :disabled="selectedRowKeys.length < 1">删除</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :scroll="{ x: 1500 }"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectUserChange}"
    >
      <span slot="serial" slot-scope="text, record, index">

        {{ index + 1 }}
      </span>
      <a-avatar size="large" shape="square" :src="record | resourceFullAddressFilter" slot="resourceFullAddress" slot-scope="record"/>
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

      <span slot="temperature" slot-scope="text, record">
        <template>
          <div>
            <span v-if="parseFloat(record.t) <36" class="tImgColor" style="color: #5286F2">{{record.t+'℃/'+record.fahrenheit+'℉'}}</span>
            <span v-if="parseFloat(record.t) <37.2 && parseFloat(record.t) >=36" class="tImgColor" style="color: #aeea68">{{record.t+'℃/'+record.fahrenheit+'℉'}}</span>
            <span v-if="parseFloat(record.t) >=37.2 && parseFloat(record.t) <37.6" class="tImgColor" style="color: #FFB94E">{{record.t+'℃/'+record.fahrenheit+'℉'}}</span>
            <span v-if="parseFloat(record.t) >37.6" class="tImgColor" style="color: #EA2E45">{{record.t+'℃/'+record.fahrenheit+'℉'}}</span>
          </div>
        </template>
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
  beforeCreate () {
    this.form = this.$form.createForm(this);
  },
  data () {
    return {
      queryParam:{
        estateName:'',
      },
      defaultDate:[moment().startOf('day').subtract(0, 'days'), moment().endOf('day')],
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
          title: '体温检查',
          scopedSlots: { customRender: 'resourceFullAddress' }
        },
        {
          title: '体温（℃/℉）',
          dataIndex: 'temperature',
          scopedSlots: { customRender: 'temperature' }
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
              item.temperature = '';
              item.resourceFullAddress = item.tImageResourceAddress?item.tImageResourceAddress:'';
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

    resetSearchBUForm(){
      // this.defaultDate = [moment().startOf('day').subtract(0, 'days'), moment().endOf('day')];
      this.form.setFieldsValue({
        rangeTimePicker:[moment().startOf('day').subtract(0, 'days'), moment().endOf('day')]
      });
      this.startDate = this.moment().startOf('day').subtract(0, 'days').format(this.dateFormat)
      this.endDate = this.moment().endOf('day').format(this.dateFormat)
      this.queryParam = {
        beginDatetime:this.startDate?this.startDate:this.moment().startOf('day').subtract(0, 'days').format(this.dateFormat),
        endDatetime:this.endDate?this.endDate:this.moment().endOf('day').format(this.dateFormat),
        page: { pageNumber: 1, pageSize: 10 }
      }
      this.initCascader = []
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
    },

    onSelectUserChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys

      let that = this;
      let hash = {},rowsIds = [],defferentId = '';
      that.selectedRows = [...this.selectedRows,...selectedRows]
      that.selectedRows = that.selectedRows.reduce(function(item, next) {
        hash[next.id] ? '' : hash[next.id] = true && item.push(next);
        return item
      }, [])

      if(selectedRowKeys.length < that.selectedRows.length){
        let newRows = [];
        rowsIds = []
        that.selectedRows.map((item)=>{
          rowsIds.push(item.id)
        })
        defferentId = this.selectedRowKeys.concat(rowsIds).filter(function(v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v);
        });
        newRows = that.selectedRows.filter(pane => pane.id !== defferentId[0])
        that.selectedRows = [...newRows]
      }

      if(this.selectAdStatus){
        this.$emit('selectedAd',that.selectedRows)
      }

    },

    handleDelete () {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk () {
          let params = []
          if(that.selectedRows.length){
            that.selectedRows.forEach((item,index)=>{
              let obj = {
                id:item.id,
                recDatetime:item.recDatetime
              }
              params.push(obj)
            })
          }
          that.$api.recRecord.del({ deleteParams: params })
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
