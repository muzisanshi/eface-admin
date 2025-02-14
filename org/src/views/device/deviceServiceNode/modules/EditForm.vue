<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.12.5
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
        <a-form-item label="设备厂商" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            showSearch
            placeholder="选择设备厂商"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="deviceFactoryList"
            v-decorator="[
              'deviceFactoryId',
              {
                initialValue: this.formData.deviceFactoryId ? this.formData.deviceFactoryId : (this.title === '修改' && this.formData.deviceFactory) ? this.formData.deviceFactory.id : '',
                rules: [{required: true, message: '请选择设备厂商！'}]
              }
            ]"
          ></a-select>
        </a-form-item>
        <a-form-item label="节点ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="9"
            v-decorator="['workId', {initialValue: this.formData.workId, rules: [{required: true,pattern: new RegExp(this.REG_EXPS.POSITIVE_INTEGER, 'g'), message: '请输入节点ID(数字)！'}]}]"
          />
        </a-form-item>
        <a-form-item label="内网IP" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="32"
            v-decorator="['innerIp', {initialValue: this.formData.insideIp, rules: [{required: true, message: '请输入内网IP！'}]}]"
          />
        </a-form-item>

        <a-form-item label="外网IP" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="32"
            v-decorator="['outerIp', {initialValue: this.formData.outerIp, rules: [{required: true, message: '请输入外网IP！'}]}]"
          />
        </a-form-item>

        <a-form-item label="内网端口" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="9"
            v-decorator="['innerPort', {initialValue: this.formData.innerPort, rules: [{required: true,pattern: new RegExp(this.REG_EXPS.PLUS_INTEGER, 'g'), message: '请输入内网端口！'}]}]"
          />
        </a-form-item>

        <a-form-item label="外网端口" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="9"
            v-decorator="['outerPort', {initialValue: this.formData.outerPort, rules: [{required: true,pattern: new RegExp(this.REG_EXPS.PLUS_INTEGER, 'g'), message: '请输入外网端口！'}]}]"
          />
        </a-form-item>

        <a-form-item label="最大连接数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="9"
            v-decorator="['maxConnectionsSize', {initialValue: this.formData.maxConnectionsSize, rules: [{required: true,pattern: new RegExp(this.REG_EXPS.PLUS_INTEGER, 'g'), message: '请输入最大连接数！'}]}]"
          />
        </a-form-item>

        <a-form-item label="是否使用ssl" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch :checked="useSSL" @change="changeUseSSL" v-decorator="['useSSL']" />
        </a-form-item>

        <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch :checked="enable" @change="changeEnable" v-decorator="['enable']" />
        </a-form-item>

        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="255" v-decorator="['remark',{initialValue: this.formData.remark}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { mixin } from '@/mixins/mixin'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
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
      deviceFactoryList: [],
      title: '',
      useSSL: false
    }
  },
  computed: {
    ...mapState(['constants'])
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    add(item) {
      let that = this
      this.visible = true
      this.form.resetFields()
      this.formData = {}
      this.deviceFactoryList = []
      this.$api.deviceFactory.getAll().then(res => {
        const l = []
        for (let i = 0, j = res.length; i < j; i++) {
          l.push({
            value: res[i].id,
            label: res[i].name
          })
        }
        this.deviceFactoryList = l
      })

      if (item) {
        this.title = '修改'
        this.$api.deviceServiceNode.getById({ id: item.id }).then(res => {
          this.formData = res
        })
      } else {
        this.title = '新增'
        this.enable = true
        this.useSSL = false
      }
    },

    changeUseSSL(checked) {
      this.useSSL = checked
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

          if (!values.enable) {
            values.enable = this.enable
          }

          if (!values.useSSL) {
            values.useSSL = this.useSSL
          }

          this.$api.deviceServiceNode
            .saveOrUpdate(values)
            .then(res => {
              this.$notification.success({
                message: '成功',
                description: this.title + '成功！'
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