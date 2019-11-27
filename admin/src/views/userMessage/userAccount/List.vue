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
              <a-input v-model="queryParam.phoneNo" placeholder=""/>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="账户状态">
              <a-select showSearch allowClear placeholder="选择账户状态"  v-model="queryParam.accountState" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.accountState">
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="性别">
              <a-select showSearch allowClear placeholder="选择性别"  v-model="queryParam.accountState" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.sexual">
              </a-select>
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
          title: '电话号码',
          dataIndex: 'phoneNo'
        },
        {
          title: '账户状态',
          dataIndex: 'accountStateName'
        },
        {
          title: '姓名',
          dataIndex: 'realName'
        },
        {
          title: '年龄级别',
          dataIndex: 'ageLevel'
        },
        {
          title: '性别',
          dataIndex: 'sexualName'
        },
        {
          title: '上次登录时间',
          dataIndex: 'lastLoginDatetime'
        }
      ],
      loadData: parameter => {
        return this.$api.userAccount.getPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            res.records.forEach(item=>{
              item.accountStateName = this.constants.data.accountState?this.constants.data.accountState[item.accountState]['name']:''
              item.sexualName = this.constants.data.sexual?this.constants.data.sexual[item.sexual]['name']:''
            });
            return res
          })
      }
    }
  },
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
