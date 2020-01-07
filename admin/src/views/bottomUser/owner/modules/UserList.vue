<!--
 * @name List.vue
 * @author lw
 * @date 2019.12.5
 * @desc 选择用户
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">

          <a-col :md="6" :sm="24">
            <a-form-item label="地区">
              <a-input @click="selectRoom()"  v-model="roomName" :read-only="true" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24" v-if="selectUserStatus">
            <a-form-item label="用户类型">
              <a-select showSearch allowClear placeholder="选择用户类型"  v-model="queryParam.code" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.userTypeCode">
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="真实姓名">
              <a-input v-model="queryParam.realName" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="电话号码">
              <a-input v-model="queryParam.phoneNo" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="年龄级别">
              <a-select showSearch allowClear placeholder="选择年龄级别"  v-model="queryParam.ageLevel" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.ageLevel">
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="性别">
              <a-select showSearch allowClear placeholder="选择性别"  v-model="queryParam.sexual" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.sexual">
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


    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectUserChange,type:'radio'}"
    >
      <span slot="serial" slot-scope="text, record, index">

        {{ index + 1 }}
      </span>

      <a-avatar size="large" shape="square" :src="record | resourceFullAddressFilter" slot="resourceFullAddress" slot-scope="record"/>
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

    </s-table>
    <select-room ref="selectRoom" @selectRoom="selectRoomSuccess"></select-room>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import {mixin} from '@/mixins/mixin'
import {mapState} from 'vuex';
import selectRoom from '@/components/Common/SelectRoom'
export default {
  mixins:[mixin],
  components: {
    STable,
    selectRoom
  },
  props:{
    selectUserStatus:{
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['constants']),
  },
  watch:{
    selectUserStatus(newVal){
      if(newVal){
        this.selectedRowKeys = [];
      }
    }
  },
  data () {
    return {
      queryParam: {
        page: {
          pageNumber: 1,
          pageSize: 10
        },
        code:'OWNER'
      },
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
          title: '姓名',
          dataIndex: 'realName'
        },
        {
          title: '年龄级别',
          dataIndex: 'ageLevelName'
        },
        {
          title: '性别',
          dataIndex: 'sexualName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return this.$api.user.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            res.records.forEach(item=>{
              item.ageLevelName = this.constants.data.ageLevel?this.constants.data.ageLevel[item.ageLevel]['name']:''
              item.sexualName = this.constants.data.sexual?this.constants.data.sexual[item.sexual]['name']:''
            });
            return res
          })
      },
      roomName:''
    }
  },
  methods: {

    onSelectUserChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.$emit('selectedUser',selectedRows)
    },

    selectRoomSuccess(value){
      this.roomName = value.roomName
      this.queryParam = Object.assign(this.queryParam,value)
    },

  }
}
</script>
