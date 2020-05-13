<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.8
 * @desc 地区管理add、edit
-->
<template>
  <a-modal
    :title="title+'地区'"
    :width="740"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false"
    :keyboard="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="行政区划代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="16"
            :disabled="hasAdd === 'UPDATE'"
            v-decorator="['id', {initialValue: this.formData.id,rules: [{required: true,pattern: new RegExp(this.REG_EXPS.POSITIVE_INTEGER, 'g'), message: '请输入有效的行政区划代码！'}]}]"
          />
        </a-form-item>

        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="64"
            v-decorator="['name', {initialValue: this.formData.name,rules: [{required: true, message: '请输入名称！'}]}]"
          />
        </a-form-item>

        <!-- <a-form-item
          label="级别"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >

          <a-select
            showSearch
            placeholder="选择级别"
            optionFilterProp="children"
            :filterOption="filterCountryOption"
            v-decorator="['level', {initialValue: this.formData.level?this.formData.level:'',rules: [{required: true, message: '请选择级别！'}]}]"
          >
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
          </a-select>
        </a-form-item>-->

        <a-form-item label="父级区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-decorator="['parentArea',{initialValue: this.formData.parentArea}]" /> -->
          <a-cascader
            :options="options"
            @change="onChangeAddress"
            :loadData="loadData"
            :disabled="disabledSelectParent"
            :value="initCascader"
            placeholder="选择父级区域"
            changeOnSelect
          />
          <!-- <a-cascader :options="options1" @change="onChangeAddress" :loadData="loadData" placeholder="Please select" changeOnSelect/> -->
        </a-form-item>

        <a-form-item label="邮政编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="16"
            v-decorator="['postCode', {initialValue: this.formData.postCode,rules: [{required: false, message: '请输入邮政编码！'}]}]"
          />
        </a-form-item>

        <a-form-item label="简写名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="64"
            v-decorator="['shortName', {initialValue: this.formData.shortName,rules: [{required: true, message: '请输入简写名称！'}]}]"
          />
        </a-form-item>

        <a-form-item label="经度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="15" v-decorator="['lng',{initialValue: this.formData.lng}]">
            <div slot="addonAfter" @click="selectLng">选择</div>
          </a-input>
        </a-form-item>

        <a-form-item label="纬度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="15" v-decorator="['lat',{initialValue: this.formData.lat}]" />
        </a-form-item>

        <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch :checked="enable" @change="changeEnable" v-decorator="['enable']" />
        </a-form-item>
      </a-form>
      <select-lng ref="selectLngAndLat" :mapName="mapName" @ok="selectSuccess" />
    </a-spin>
  </a-modal>
</template>

<script>
import { mixin } from '@/mixins/mixin'
import selectLng from './selectLngAndLat'
export default {
  mixins: [mixin],
  components: {
    selectLng
  },
  props: {
    areasId: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      confirmLoading: false,
      title: '',
      parentId: null,
      formData: {},
      form: this.$form.createForm(this),
      addChild: false,
      disabledSelectParent: false,
      initCascader: [],
      options: [],
      levelList: [{}],
      arr: [],
      num: 0,
      hasAdd: 'SAVE',
      shortName: '',
      mapName: null
    }
  },
  watch: {
    num(newVal) {
      if (newVal == this.initCascader.length) {
        this.handleAreaArr()
      }
    }
  },
  methods: {
    add(item, addChild) {
      const that = this
      that.visible = true
      that.addChild = false
      that.disabledSelectParent = false
      that.form.resetFields()
      that.initCascader = []
      that.options = []
      that.arr = []
      that.num = 0
      that.formData = {}
      that.shortName = ''
      that.$api.area.getAllParent({}).then(res => {
        const l = []
        for (let i = 0, j = res.length; i < j; i++) {
          l.push({
            value: res[i].id,
            id: res[i].id,
            label: res[i].name,
            level: res[i].level,
            isLeaf: false
          })
        }
        that.options = l
        if (item) {
          that.shortName = item.shortName
          that.$api.area.getById({ id: item.id }).then(res => {
            this.mapName = (res.parentAreaName ? res.parentAreaName : '') + res.name
            if (addChild != 'addChild') {
              that.title = '修改'
              that.formData = res
              that.enable = that.formData.enable
              that.hasAdd = 'UPDATE'
            } else {
              that.title = '新增下级'
              that.addChild = true
              that.enable = true
              that.hasAdd = 'SAVE'
              that.disabledSelectParent = true
              that.formData.level = item.level
              that.form.setFieldsValue({ level: item.level })
            }
            if (item.parentAreaId) {
              that.handleAreaId(res)
              if (that.initCascader.length > 0) {
                if (addChild == 'addChild') {
                  that.initCascader.push(item.id)
                }
                that.getChildArea()
              }
            } else {
              if (addChild == 'addChild') {
                that.initCascader.push(item.id)
              }
            }
          })
        } else {
          that.enable = true
          that.hasAdd = 'SAVE'
          that.title = '新增'
          that.initCascader = that.areasId
          that.getChildArea()
          this.mapName = '成都'
        }
      })
    },

    selectLng() {
      this.mapName = this.form.getFieldValue('name')
      this.$refs.selectLngAndLat.add(this.shortName)
    },

    selectSuccess(item) {
      this.form.setFieldsValue({ lng: item.lng, lat: item.lat })
    },

    handleAreaId(res) {
      const that = this
      if (res.areas && res.areas.length) {
        for (let i = res.areas.length - 1; i >= 0; i--) {
          that.initCascader.push(res.areas[i].id)
        }
      }
    },

    handleAreaArr() {
      this.arr.unshift(this.options)
      const cacheData = [...this.arr]
      for (let i = this.initCascader.length - 1; i >= 0; i--) {
        for (let j = this.arr[i].length - 1; j >= 0; j--) {
          if (this.initCascader[i] === this.arr[i][j].id) {
            cacheData[i][j].children = this.arr[i + 1]
          }
        }
      }
      this.options = cacheData[0]
      this.initCascader = [...this.initCascader]
      this.arr = []
    },

    getChildArea() {
      const that = this
      for (let i = 0; i < that.initCascader.length; i++) {
        this.$api.area
          .getAll({
            parentId: that.initCascader[i]
          })
          .then(res => {
            const l = []
            if (res.length) {
              if (!res[0].hasChildren) {
                for (let i = 0, j = res.length; i < j; i++) {
                  l.push({
                    value: res[i].id,
                    id: res[i].id,
                    label: res[i].name,
                    level: res[i].level,
                    isLeaf: true
                  })
                }
              } else {
                for (let i = 0, j = res.length; i < j; i++) {
                  l.push({
                    value: res[i].id,
                    id: res[i].id,
                    label: res[i].name,
                    level: res[i].level,
                    isLeaf: false
                  })
                }
              }
            }
            that.arr[i] = l
            that.num++
          })
      }
    },

    onChangeAddress(value) {
      this.initCascader = value
    },

    loadData(selectedOptions) {
      const that = this
      const targetOption = selectedOptions[selectedOptions.length - 1]
      if (targetOption.level < 2) {
        targetOption.loading = true
        this.$api.area
          .getAll({
            parentId: targetOption.value
          })
          .then(res => {
            targetOption.loading = false
            const l = []
            if (res.length > 0) {
              for (let i = 0; i < res.length; i++) {
                if (targetOption.level == 1) {
                  l.push({
                    value: res[i].id,
                    label: res[i].name,
                    level: res[i].level
                  })
                } else {
                  l.push({
                    value: res[i].id,
                    label: res[i].name,
                    level: res[i].level
                  })
                }
              }
              targetOption.children = l
              that.options = [...that.options]
            }
          })
      }
    },
    filterCountryOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.formData.id) {
            values.id = this.formData.id
          }
          if (this.initCascader) {
            values.parentAreaId = this.initCascader[this.initCascader.length - 1]
          }
          if (!values.enable) {
            values.enable = this.enable
          }
          values.optType = this.hasAdd
          this.$api.area
            .saveOrUpdate(values)
            .then(res => {
              this.$notification.success({
                message: '成功',
                description: this.title + '成功'
              })
              this.visible = false
              this.confirmLoading = false
              this.form.resetFields()
              this.$emit('ok', values)
            })
            .finally(() => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>
