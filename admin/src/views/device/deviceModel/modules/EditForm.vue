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

        <a-form-item
          label="设备厂商"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择设备厂商"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="deviceFactoryList"
            v-decorator="['deviceFactoryId', {initialValue: this.formData.deviceFactoryId?this.formData.deviceFactoryId:''}]"
          >
          </a-select>
        </a-form-item>

        <a-form-item
          label="型号类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select showSearch allowClear placeholder="选择型号类型" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.deviceModelType" v-decorator="['deviceModelType', {initialValue: this.formData.deviceModelType,rules: [{required: true, message: '请选择型号类型！'}]}]">
          </a-select>
        </a-form-item>

        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入名称！'}]}]"/>
        </a-form-item>

        <a-form-item label="序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['serialNo', {initialValue: this.formData.serialNo, rules: [{required: true, message: '请输入序号！'}]}]"/>
        </a-form-item>

        <a-form-item label="屏幕大小" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['size', {initialValue: this.formData.size, rules: [{required: true, message: '请输入屏幕大小！'}]}]"/>
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
  import {mapState} from 'vuex';
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
        deviceFactoryList:[],
        title: '',
      }
    },
    computed: {
      ...mapState(['constants']),
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    methods: {
      add (item) {
        let that = this;
        this.visible = true
        this.form.resetFields()
        this.formData ={}
        this.deviceFactoryList = []
        this.$api.deviceFactory.getAll()
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name
              })
            }
            this.deviceFactoryList = l
          })

        if(item){
          this.title = '修改'
          this.$api.deviceModel.getById({id: item.id})
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
            this.$api.deviceModel.saveOrUpdate(values)
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