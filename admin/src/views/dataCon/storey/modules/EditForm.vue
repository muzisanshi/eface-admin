<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.12
 * @desc 新增修改（楼层）
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
          label="楼栋单元"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <!--<a-input @click="selectDataCon(2)" :read-only="true" v-decorator="['unitName', {initialValue: this.formData.unitName,rules: [{required: true, message: '请选择楼栋单元！'}]}]"/>-->
          <a-input :disabled="true" v-decorator="['unitName', {initialValue: this.formData.unitName,rules: [{required: true, message: '请选择楼栋单元！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="楼层"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="64"
            v-decorator="['name', {initialValue: this.formData.name,rules: [{required: true, message: '请输入楼层！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="房间数量"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="9"
            v-decorator="['roomNum', {initialValue: this.formData.roomNum,rules: [{required: true, message: '请输入房间数量！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="255" v-decorator="['remark',{initialValue: this.formData.remark}]"/>
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
          this.$api.storey.getById({id: item.id})
            .then(res => {
              this.formData = res
              this.unitId = res.unitId
            })
        }
      },

      selectSuccess(value){
        this.formData.unitName = value.name
        this.formData.unitId = value.value
        this.form.setFieldsValue({ unitName: value.name});
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
              storeys:[{
                name:values.name,
                id:values.id,
                roomNum:values.roomNum,
                remark:values.remark
              }],
              unitId:this.formData.unitId
            }
            this.$api.storey.saveOrUpdate(params)
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