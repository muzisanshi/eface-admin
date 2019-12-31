<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.6.25
 * @desc 新增修改（楼栋）
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
          label="地产"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input @click="selectDataCon(1)" :read-only="true" v-decorator="['estateName', {initialValue: this.formData.estateName,rules: [{required: true, message: '请选择地产！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="楼栋名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['buildingName', {initialValue: this.formData.buildingName,rules: [{required: true, message: '请输入楼栋名称！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="单元名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['name', {initialValue: this.formData.name,rules: [{required: true, message: '请输入单元名称！'}]}]"/>
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
        buildId:'',
        estateName:''
      }
    },
    methods: {
      add(item) {
        this.visible = true
        this.form.resetFields()
        this.formData = {};
        if (item) {
          this.$api.subject.getById({id: item.id})
            .then(res => {
              this.formData = res
              this.buildId = res.buildId
            })
        }
      },

      selectSuccess(value){
        this.formData.estateName = value.name
        this.formData.estateId = value.value
        this.form.setFieldsValue({ estateName: value.name});
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
            values.buildId = this.buildId
            let params = {
              buildings:[{
                buildName:values.buildingName,
                id:values.buildId,
                units:[{
                  id:values.id,
                  name:values.name,
                  remark:values.remark
                }]
              }],
              estateId:this.formData.estateId

            }
            this.$api.subject.saveOrUpdate(params)
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