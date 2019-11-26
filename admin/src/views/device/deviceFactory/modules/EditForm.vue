<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.18
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
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入位置名称！'}]}]"/>
        </a-form-item>

        <a-form-item label="序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['serialNo', {initialValue: this.formData.serialNo, rules: [{required: true, message: '请输入序号！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['remark',{initialValue: this.formData.remark}]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'

  export default {
    mixins:[mixin],
    data () {
      return {
        goodsGroups:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        visible: false,
        confirmLoading: false,
        formData: {},
        title: '',
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    methods: {
      add (item) {
        this.visible = true
        this.form.resetFields()
        this.formData ={}
        if(item){
          this.title = '修改'
          this.$api.deviceFactory.getById({id: item.id})
            .then(res => {
              this.formData = res
            })
        }else{
          this.title = '新增'
        }
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if(this.formData.id){
              values.id = this.formData.id
            }
            this.$api.deviceFactory.saveOrUpdate(values)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description: this.title + '成功！'
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
      },
    }
  }
</script>