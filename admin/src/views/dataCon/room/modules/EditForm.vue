<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.12
 * @desc 修改（房间）
-->
<template>
  <a-modal
    title="修改"
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
          label="楼层"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input @click="selectDataCon(3)" :read-only="true" v-decorator="['storeyName', {initialValue: this.formData.storeyName,rules: [{required: true, message: '请选择楼层！'}]}]"/>
        </a-form-item>


        <a-form-item
          label="房间编号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['no', {initialValue: this.formData.no,rules: [{required: true, message: '请输入房间编号！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="房间名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['name', {initialValue: this.formData.name,rules: [{required: true, message: '请输入房间名称！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['remark',{initialValue: this.formData.remark}]"/>
        </a-form-item>

      </a-form>
    </a-spin>
    <select-data-Con ref="selectSuccess" @selectSuccess="selectSuccess"></select-data-Con>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  import selectDataCon from '@/components/Common/SelectDataCon'
  export default {
    mixins:[mixin],
    components: {
      selectDataCon
    },
    data() {
      return {
        labelCol: {
          xs: {span: 24},
          sm: {span: 7}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 13}
        },
        visible: false,
        confirmLoading: false,

        uploadFileId: '',
        clearWays: [],
        enable: true,
        formData: {},
        title: '',
        form: this.$form.createForm(this),
        unitId:'',
      }
    },
    methods: {
      add(item) {
        this.visible = true
        this.form.resetFields()
        this.formData = {};
        if (item) {
          this.$api.room.getById({id: item.id})
            .then(res => {
              this.formData = res
              this.unitId = res.unitId
            })
        }
      },

      selectSuccess(value){
        this.formData.storeyName = value.name
        this.formData.storeyId = value.value
        this.form.setFieldsValue({ storeyName: value.name});
      },

      handleSubmit() {
        const {form: {validateFields}} = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            //修改
            if (this.formData.id) {
              values.id = this.formData.id;
            }
            let params = {
              rooms:[{
                name:values.name,
                id:values.id,
                no:values.no,
                remark:values.remark
              }],
              storeyId:this.formData.storeyId,
            }
            this.$api.room.saveOrUpdate(params)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description:'修改成功'
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