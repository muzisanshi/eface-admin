<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.25
 * @desc 编辑
-->
<template>
  <a-modal
    :title="title"
    :width="740"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="64"
            v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入位置名称！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="门禁闸机常用规则"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择门禁闸机常用规则"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="gateBrakeRuleList"
            v-decorator="['gateBrakeRuleId', {initialValue: this.formData.gateBrakeRuleId?this.formData.gateBrakeRuleId:'', rules: [{required: true, message: '请选择门禁闸机常用规则！'}]}]"
          >
          </a-select>
        </a-form-item>

        <a-form-item
          label="类型编码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            allowClear
            placeholder="选择类型编码"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="constants.list.userTypeCode"
            v-decorator="['code', {initialValue: this.formData.code,rules: [{required: true, message: '请选择类型编码！'}]}]">
          </a-select>
        </a-form-item>

        <a-form-item label="排序序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="9"
            v-decorator="['orderNum', {initialValue: this.formData.orderNum, rules: [{required: true, message: '请输入排序序号！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="是否注册"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="enableRegister" @change="changeEnableRegister" v-decorator="['enableRegister']"/>
        </a-form-item>

        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :maxLength="255" v-decorator="['remark',{initialValue: this.formData.remark}]" />
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
        title: '',
        enableRegister:true,
        gateBrakeRuleList:[]
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    computed: {
      ...mapState(['constants']),
    },
    methods: {
      add (item) {
        this.visible = true
        this.form.resetFields()
        this.formData ={}

        this.$api.gateBrakeRule.getAll()
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name
              })
            }
            this.gateBrakeRuleList = l
          })

        if(item){
          this.title = '修改'
          this.$api.userType.getById({id: item.id})
            .then(res => {
              this.formData = res
              this.enableRegister = this.formData.enableRegister;
            })
        }else{
          this.title = '新增'
          this.enableRegister = true
        }
      },

      changeEnableRegister(checked) {
        this.enableRegister = checked
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if(this.formData.id){
              values.id = this.formData.id
            }
            if (!values.enableRegister) {
              values.enableRegister = this.enableRegister
            }
            this.$api.userType.saveOrUpdate(values)
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