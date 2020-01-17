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
        <a-form-item
          label="编码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="32" v-decorator="['code', {initialValue: this.formData.code, rules: [{required: true, message: '请输入编码！'}]}]" />
        </a-form-item>

        <a-form-item
          label="名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="64" v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入名称！'}]}]" />
        </a-form-item>

        <a-form-item
          label="简写标志"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="32" v-decorator="['shortMark', {initialValue: this.formData.shortMark, rules: [{required: true, message: '请输入简写标志！'}]}]" />
        </a-form-item>

        <a-form-item
          label="全写标志"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="64" v-decorator="['fullMark', {initialValue: this.formData.fullMark,rules: [{required: true, message: '请输入全写标志！'}]}]" />
        </a-form-item>

        <a-form-item
          label="国际电话区号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="8" v-decorator="['nationalAreaCode.areaCode', {initialValue: this.formData.nationalAreaCode.areaCode,rules: [{required: true, message: '请输入国际电话区号！'}]}]" />
        </a-form-item>

        <a-form-item
          label="是否启用注册登录"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="enableLoginRegister" @change="changeLoginRegister" v-decorator="['nationalAreaCode.enableLoginRegister']"/>
        </a-form-item>

        <a-form-item
          label="排序序号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="9" v-decorator="['nationalAreaCode.orderNum', {initialValue: this.formData.nationalAreaCode.orderNum,rules: [{required: true, message: '请输入排序序号！'}]}]" />
        </a-form-item>

        <a-form-item
          label="图片"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <image-upload
            :tooltipVisible="visible"
            :imageUrl="formData.imageAttachment?formData.imageAttachment.resourceFullAddress:''"
            advice="建议图片大小：300px*200px"
            @uploadSuccess="onUploadSuccess"
          >
          </image-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { ImageUpload } from '@/components'
  import {mixin} from '@/mixins/mixin'
  export default {
    mixins:[mixin],
    components: {
      ImageUpload
    },
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
        formData: {
          nationalAreaCode:{}
        },
        form: this.$form.createForm(this),
        title:'新增',
        enableLoginRegister:true
      }
    },
    methods: {
      onUploadSuccess (item) {
        this.formData.imageAttachment = item
      },
      add (item) {
        this.visible = true
        this.form.resetFields()
        this.formData = {
          nationalAreaCode:{}
        }
        this.confirmLoading = false
        if(item){
          this.title = '修改'
          this.$api.country.getById({id: item.id})
            .then(res => {
              this.formData = res
              this.enableLoginRegister = this.formData.nationalAreaCode.enableLoginRegister;
              this.formData.imageAttachment= {
                resourceFullAddress:res.resourceFullAddress
              }
            })
        }else{
          this.title = '新增'
          this.enableLoginRegister = true
        }
      },
      changeLoginRegister(checked) {
        this.enableLoginRegister = checked
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if(this.formData.imageAttachment) {
              values.imageAttId = this.formData.imageAttachment.id
            }
            if(this.formData.id){
              values.id = this.formData.id
            }
            if(this.formData.imageAttId){
              values.imageAttId = this.formData.imageAttId
            }
            if(this.formData.nationalAreaCode.id){
              values.nationalAreaCode.id = this.formData.nationalAreaCode.id
            }
            if (!values.nationalAreaCode.enableLoginRegister) {
              values.nationalAreaCode.enableLoginRegister = this.enableLoginRegister
            }
            this.$api.country.saveOrUpdate(values)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description: this.title+`成功！`
                })
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
              }).finally(() => {
              this.form.resetFields()
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
