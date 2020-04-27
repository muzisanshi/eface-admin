<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.8
 * @desc 地区管理list
-->
<template>
  <a-card :bordered="false" class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input :maxLength="64" v-model="queryParam.name" placeholder="输入要搜索的内容" />
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="loadData()">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchFormData">重置</a-button>
            </span>
          </a-col>

          <!-- <a-col :md="6" :sm="24">
            <a-form-item>
              <a-input-search
                placeholder="输入要搜索的内容"
                v-model="queryParam.name"
                @keypress="loadData"
              />
            </a-form-item>
          </a-col>-->

          <a-col :md="2" :sm="24">
            <span style="height: 32px;line-height: 32px;float:right;">请筛选：</span>
          </a-col>

          <a-col :md="3" :sm="24">
            <a-form-item>
              <a-select showSearch placeholder="- 省 -" v-model="provinceName">
                <!-- <a-select-option value="请选择">请选择</a-select-option> -->
                <a-select-option
                  v-for="(item, index) in allProvinces"
                  :key="index"
                  :value="item.name"
                  @click="expand(item.id, 1)"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="3" :sm="24">
            <a-form-item>
              <a-select showSearch placeholder="- 市 -" v-model="cityName">
                <!-- <a-select-option value="请选择">请选择</a-select-option> -->
                <a-select-option
                  v-for="(item, index) in allCities"
                  :key="index"
                  :value="item.name"
                  @click="expand(item.id, 2)"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="3" :sm="24">
            <a-form-item>
              <a-select showSearch placeholder="- 区/县 -" v-model="countyName">
                <!-- <a-select-option value="请选择">请选择</a-select-option> -->
                <a-select-option
                  v-for="(item, index) in allCounties"
                  :key="index"
                  :value="item.name"
                  @click="expand(item.id, 3)"
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
      <!-- <a-button
        type="danger"
        icon="delete"
        @click="handleDeleteLogic"
        :disabled="selectedRowKeys.length < 1"
      >逻辑删除</a-button>-->
    </div>

    <a-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @expand="handleExpand"
      :expandedRowKeys="expandedRowKeys"
    >
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>

      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <!-- <a-divider type="vertical" />
          <a @click="handleEdit(record,'addChild')">新增下级</a>-->
        </template>
      </span>
    </a-table>

    <a-pagination
      class="ant-table-pagination ant-pagination"
      :showTotal="total => `总共 ${total} 条`"
      showSizeChanger
      :pageSize.sync="queryParam.page.pageSize"
      :pageSizeOptions="['50', '40', '30', '20', '10']"
      @change="onChange"
      @showSizeChange="onShowSizeChange"
      :total="pageElements"
      v-model="queryParam.page.pageNumber"
    />

    <edit-form ref="editModal" :areasId="areasId" @ok="handleLoadOk" />
  </a-card>
</template>

<script>
import EditForm from './modules/EditForm'
import { mixin } from '@/mixins/mixin'

export default {
  components: {
    EditForm
  },
  mixins: [mixin],
  data() {
    return {
      queryParam: {
        page: {
          pageNumber: 1,
          pageSize: 50
        }
      },
      columns: [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '级别',
          dataIndex: 'level'
        },
        {
          title: '父级区域名称',
          dataIndex: 'parentAreaName'
        },
        {
          title: '行政区划代码',
          dataIndex: 'id'
        },
        {
          title: '邮政编码',
          dataIndex: 'postCode'
        },
        {
          title: '简写名称',
          dataIndex: 'shortName'
        },
        {
          title: '经度',
          dataIndex: 'lng'
        },
        {
          title: '纬度',
          dataIndex: 'lat'
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
      data: [],
      pageElements: 0,
      expandedRowKeys: [],

      allProvinces: [],
      allCities: [],
      allCounties: [],
      allStreets: [],
      level: 0,

      provinceName: undefined,
      cityName: undefined,
      countyName: undefined,

      provinceParentId: undefined,
      cityParentId: undefined,
      countyParentId: undefined,
      currentParentId: undefined,

      areasId: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.data = []
      this.expandedRowKeys = []
      this.selectedRows = []
      this.$api.area
        .getPage(
          Object.assign(
            {
              parentId: this.currentParentId
            },
            this.queryParam
          )
        )
        .then(res => {
          for (let i = 0, j = res.records.length; i < j; i++) {
            // res.records[i].children = []
            delete res.records[i].children
          }
          this.data = res.records
          this.pageElements = res.totalElements

          const selectData = res.records.slice()
          selectData.unshift({
            id: '请选择',
            name: '请选择'
          })

          this.allProvinces = this.level === 0 ? selectData : this.allProvinces
          this.allCities = this.level === 1 ? selectData : this.allCities
          this.allCounties = this.level === 2 ? selectData : this.allCounties
          this.allStreets = this.level === 3 ? selectData : this.allStreets
        })
    },
    handleDelete() {
      const that = this
      that.$confirm({
        title: '删除',
        content: '确定删除勾选的记录？',
        onOk() {
          that.$api.area.del({ ids: that.selectedRowKeys }).then(res => {
            that.$notification.success({
              message: '成功',
              description: `删除成功！`
            })
            that.handleLoadOk()
          })
        },
        onCancel() {}
      })
    },
    handleDeleteLogic() {
      const that = this
      that.$confirm({
        title: '逻辑删除',
        content: '确定逻辑删除勾选的记录？',
        onOk() {
          that.$api.area.delLog({ ids: that.selectedRowKeys }).then(res => {
            that.$notification.success({
              message: '成功',
              description: `逻辑删除成功！`
            })
            that.handleLoadOk()
          })
        },
        onCancel() {}
      })
    },
    handleEdit(record, addChild) {
      this.areasId = [this.provinceParentId, this.cityParentId, this.countyParentId]
        .slice(0, this.level)
        .filter(Boolean)
      console.log(this.areasId)
      this.$refs.editModal.add(record, addChild)
    },

    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    buildSubData(data, children, parentId) {
      for (let i = 0, j = data.length; i < j; i++) {
        const d = data[i]
        if (d.id === parentId) {
          d.children = children
          break
        }
        d.children = this.buildSubData(d.children, children, parentId)
      }
      return data
    },
    expand(id, level) {
      this.level = level

      if (id !== '请选择') {
        this.provinceParentId = level === 1 ? id : this.provinceParentId
        this.cityParentId = level === 2 ? id : this.cityParentId
        this.countyParentId = level === 3 ? id : this.countyParentId
        this.currentParentId = id
      } else {
        if (level === 1) {
          this.provinceParentId = this.cityParentId = this.countyParentId = this.currentParentId = undefined
        } else if (level === 2) {
          this.provinceParentId = this.provinceParentId
          this.cityParentId = undefined
          this.countyParentId = undefined
          this.currentParentId = this.provinceParentId
        } else if (level === 3) {
          this.provinceParentId = this.provinceParentId
          this.cityParentId = this.cityParentId
          this.countyParentId = undefined
          this.currentParentId = this.cityParentId
        }
      }

      this.$api.area
        .getPage({ parentId: this.currentParentId, page: { pageNumber: 1, pageSize: 50 }, name: this.queryParam.name })
        .then(res => {
          for (let i = 0, j = res.records.length; i < j; i++) {
            // res.records[i].children = []
            delete res.records[i].children
          }
          console.log(res)
          // this.data = this.buildSubData(this.data, res.records, id)

          this.data = res.records
          this.pageElements = res.totalElements

          const selectData = res.records.slice()
          selectData.unshift({
            id: '请选择',
            name: '请选择'
          })

          if (this.level === 1) {
            this.allCounties = []
            this.allStreets = []

            this.cityName = undefined
            this.countyName = undefined
          }
          if (this.level === 2) {
            this.allStreets = []

            this.countyName = undefined
          }
          this.allCities = this.level === 1 ? (id !== '请选择' ? selectData : []) : this.allCities
          this.allCounties = this.level === 2 ? (id !== '请选择' ? selectData : []) : this.allCounties
          this.allStreets = this.level === 3 ? (id !== '请选择' ? selectData : []) : this.allStreets
        })
    },
    handleExpand(expanded, record) {
      const l = this.expandedRowKeys
      if (this.expandedRowKeys.includes(record.id)) {
        l.splice(
          l.findIndex(element => element === record.id),
          1
        )
      } else {
        l.push(record.id)
        this.expand(record.id)
      }
      this.expandedRowKeys = l
    },

    resetSearchFormData() {
      this.queryParam = {
        page: { pageNumber: 1, pageSize: 50 }
      }

      this.allProvinces = this.allCities = this.allCounties = this.allStreets = []
      this.level = 0
      this.provinceName = this.cityName = this.countyName = this.provinceParentId = this.cityParentId = this.countyParentId = this.currentParentId = undefined
      this.areasId = []

      this.loadData()
    }
  }
}
</script>
