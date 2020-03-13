<!--
 * @name EditForm.vue
 * @author lxt
 * @date 2020.03.10
 * @desc 编辑
-->
<template>
  <a-modal
    :title="title"
    :width="640"
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
            :maxLength="9"
            :disabled="hasAdd === 'UPDATE'"
            v-decorator="['id', {initialValue: this.formData.id,rules: [{required: true,pattern: new RegExp(this.REG_EXPS.POSITIVE_INTEGER, 'g'), message: '请输入有效的行政区划代码！'}]}]"
          />
        </a-form-item>

        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="64"
            v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入名称！'}]}]"
          />
        </a-form-item>

        <a-form-item label="简写名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="64"
            v-decorator="['shortName', {initialValue: this.formData.shortName, rules: [{required: true, message: '请输入简写名称！'}]}]"
          />
        </a-form-item>

        <a-form-item label="关联区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <select-area ref="selectArea" :initArea="initCascader" @selectedArea="selectedArea"></select-area>
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
import { mapState } from 'vuex'
import selectArea from '@/components/Common/SelectArea'
import selectLng from '../../area/modules/selectLngAndLat'

export default {
  mixins: [mixin],
  props: {
    initArea: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      goodsGroups: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      formData: {},
      title: '',
      initCascader: this.initArea,
      enable: true,
      hasAdd: 'SAVE',
      mapName: null
    }
  },
  components: {
    selectArea,
    selectLng
  },
  computed: {
    ...mapState(['constants'])
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    add(item) {
      const that = this
      that.initCascader = []
      if (this.initArea.length) {
        this.initCascader = this.initArea
      }
      this.visible = true
      this.form.resetFields()
      this.formData = {}

      if (item) {
        this.title = '修改'
        this.$api.street.getById({ id: item.id }).then(res => {
          this.formData = res
          this.hasAdd = 'UPDATE'
          this.enable = this.formData.enable
          let fullAddress = ''
          const [...area] = res.areas
          area.reverse().forEach(element => {
            fullAddress += element.name
          })
          console.log(fullAddress)
          this.mapName = fullAddress + res.shortName
          console.log(this.mapName)
          if (res.areas.length) {
            for (let i = res.areas.length - 1; i >= 0; i--) {
              that.initCascader.push(res.areas[i].id)
            }
            that.$refs.selectArea.initAllArea()
          }
        })
      } else {
        this.title = '新增'
        this.enable = true
        this.hasAdd = 'SAVE'
        this.mapName = '成都'
      }
    },

    selectedArea(area) {
      this.initCascader = area.value
      console.log(area.name.join(''))
      this.mapName = area.name.join('') + this.form.getFieldValue('name')
      // console.log(this.form.getFieldValue('name'))
      // this.inputChange = area.name.join('')
    },

    selectLng() {
      console.log(this.shortName)
      this.$refs.selectLngAndLat.add(this.shortName)
    },

    selectSuccess(item) {
      this.form.setFieldsValue({ lng: item.lng, lat: item.lat })
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
          if (this.initCascader.length > 0) {
            values.areaId = this.initCascader[this.initCascader.length - 1]
          }
          if (!values.enable) {
            values.enable = this.enable
          }
          values.optType = this.hasAdd
          console.log(values)
          this.$api.street
            .saveOrUpdate(values)
            .then(res => {
              this.$notification.success({
                message: '成功',
                description: this.title + '成功！'
              })
              this.visible = false
              this.confirmLoading = false
              this.form.resetFields()
              // this.form.resetFields(['name', 'remark'])
              // this.$emit('addSuccess', res)
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
