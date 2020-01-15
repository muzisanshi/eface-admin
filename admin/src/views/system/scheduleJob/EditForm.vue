<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.12.6
 * @desc 新增修改（定时任务）
-->
<template>
  <a-modal
    :title="title+'定时任务'"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="任务名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="64" v-decorator="['jobName', {initialValue: this.formData.jobName, rules: [{required: true, message: '请输入任务名称！'}]}]" />
        </a-form-item>

        <a-form-item
          label="任务分组"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="64" v-decorator="['jobGroup', {initialValue: this.formData.jobGroup,rules: [{required: true, message: '请输入任务分组！'}]}]" />
        </a-form-item>

        <a-form-item
          label="服务地址"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="255" v-decorator="['serviceUrl', {initialValue: this.formData.serviceUrl,rules: [{required: true, message: '请输入服务地址！'}]}]" />
        </a-form-item>

        <a-form-item
          label="接口地址"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="255" v-decorator="['interfaceUrl', {initialValue: this.formData.interfaceUrl,rules: [{required: true, message: '请输入接口地址！'}]}]" />
        </a-form-item>

        <a-form-item
          label="任务表达式"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="64" v-decorator="['cronExpression', {initialValue: this.formData.cronExpression,rules: [{required: true, message: '请输入任务表达式！'}]}]" />
        </a-form-item>

        <a-form-item
          label="开启状态"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择开启状态"
            optionFilterProp="children"
            :filterOption="filterCountryOption"
            :options="constants.list.scheduleStatus"
            v-decorator="['scheduleStatus', {initialValue: this.formData.scheduleStatus,rules: [{required: true, message: '请选择开启状态！'}]}]"
          >
          </a-select>
        </a-form-item>

        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="255" v-decorator="['remark', {initialValue: this.formData.remark}]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex';
import {mixin} from '@/mixins/mixin'
export default {
  mixins:[mixin],
  data () {
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

      uploadFileId: '',
      formData: {},
      title: '',
      form: this.$form.createForm(this)
    }
  },
  computed: {
    ...mapState(['constants'])
  },
  methods: {
    add (item) {
      this.visible = true
      this.form.resetFields()
      this.formData = {}

      if(item){
          this.title = '修改'
          this.$api.scheduleJob.getById({ id: item.id })
          .then(res => {
            this.formData = res
          })
        }else{
          this.title = '新增'
        }
    },
    filterCountryOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if(this.formData.id){
            values.id = this.formData.id;
          }
          this.$api.scheduleJob.saveOrUpdate(values)
            .then(res => {
              this.$notification.success({
                message: '成功',
                description: this.title +'成功'
              })
              this.visible = false
              this.confirmLoading = false
              this.form.resetFields()
              this.$emit('ok', values)
            }).finally(() => {
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