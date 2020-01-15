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

          <a-col :md="4" :sm="24">
            <a-form-item label="电话号码">
              <a-input :maxLength="32" v-model="queryParam.phoneNo" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="反馈状态">
              <a-select showSearch allowClear placeholder="选择反馈状态"  v-model="queryParam.handleState" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.adviceHandleState">
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
          <a-dropdown :trigger="['click']" :disabled="record.handleState !== 'NOT_HANDLE'">
            <span class="ant-dropdown-link" v-if="record.handleState !== 'NOT_HANDLE'">
              不能操作
            </span>
            <a class="ant-dropdown-link" v-if="record.handleState === 'NOT_HANDLE'">
              操作
              <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleState('RESOLVED',record.id)">已解决</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="handleState('RESOLVED',record.id)">忽略</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import {mixin} from '@/mixins/mixin'
import {mapState} from 'vuex';
export default {
  mixins:[mixin],
  components: {
    STable,
  },
  computed: {
    ...mapState(['constants']),
  },
  data () {
    return {
      columns: [

        {
          title: '账户电话',
          dataIndex: 'userAccountPhoneNo'
        },
        {
          title: '国际电话区号',
          dataIndex: 'areaCode'
        },
        {
          title: '联系电话',
          dataIndex: 'phoneNo'
        },
        {
          title: '反馈内容',
          dataIndex: 'content'
        },
        {
          title: '操作状态',
          dataIndex: 'handleStateName'
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
        return this.$api.advice.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            res.records.forEach(item=>{
              item.handleStateName = this.constants.data.adviceHandleState?this.constants.data.adviceHandleState[item.handleState]['name']:''
            });
            return res
          })
      }
    }
  },
  methods:{
    handleState(value,id){
      let that = this;
      that.$api.advice.updateAdviceHandleState({
        ids: [id],
        handleState:value
      })
        .then(res => {
          that.$notification.success({
            message: '成功',
            description: `操作成功！`
          })
          that.handleOk()
        })
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
