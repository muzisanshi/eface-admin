<!--
 * @name EditForm.vue
 * @author 王刚
 * @date 2019.10.8
 * @desc 账户设置
-->
<template>
  <a-modal
    title="修改账户"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
       
        <a-form-item
          label="用户名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['username', {initialValue: this.formData.username,rules: [{required: true, message: '请输入用户名！'}]}]" />
        </a-form-item>
        
        <a-form-item
          label="真实姓名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['realName', {initialValue: this.formData.realName,rules: [{required: true, message: '请输入真实姓名！'}]}]" />
        </a-form-item>
        
        <a-form-item
          label="手机号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['phoneNo', {initialValue: this.formData.phoneNo,rules: [{required: true, message: '请输入手机号！'}]}]" />
        </a-form-item>
        
        <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select showSearch placeholder="选择性别" optionFilterProp="children" :filterOption="filterCountryOption" :options="constants.list.sexual" v-decorator="['sexual', {initialValue: this.formData.sexual?this.formData.sexual:'',rules: [{required: true, message: '请选择性别！'}]}]">
          </a-select>
        </a-form-item>
        
        <a-form-item
          label="邮箱"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['email', {initialValue: this.formData.email,rules: [{required: true, message: '请输入邮箱！'}]}]" />
        </a-form-item>
        
        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['remark', {initialValue: this.formData.remark}]" />
        </a-form-item>
        
        

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import Vue from 'vue'
  import {MANAGER} from '@/store/mutation-types'
import { mapState,mapMutations } from 'vuex';
export default {
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
      visible: false,
      confirmLoading: false,

      uploadFileId: '',
      formData: {},
      title:'',
      form: this.$form.createForm(this),
      allPriceLevel:[],
      consumerGroups:[],
      options: [{
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [{
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [{
            value: 'xihu',
            label: 'West Lake',
          }],
        }],
      }, {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [{
          value: 'nanjing',
          label: 'Nanjing',
          children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          }],
        }],
      }],
      initCascader:[],
      formGoodsData: {},
    }
  },
  computed: {
    ...mapState(['constants'])
  },
  methods: {
    ...mapMutations(['SET_INFO']),
    add (item) {
      let thiz = this
      this.visible = true
      this.form.resetFields()
      this.formData = {}
      thiz.$api.user.getUserInfo()
      .then(res => {
        thiz.formData = res
      })
    },
    filterCountryOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    onConsumerGroupChange(value) {
      this.goodsGroupIds = value
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          //修改
          this.$api.user.updateInfo(values)
            .then(res => {
              this.$notification.success({
                message: '成功',
                description: '修改成功'
              })
              let managerMess = Vue.ls.get(MANAGER)
              managerMess.username = values.username;
              managerMess.realName = values.realName
              managerMess.phoneNo = values.phoneNo
              managerMess.sexual = values.sexual
              managerMess.email = values.email
              managerMess.remark = values.remark
              Vue.ls.set(MANAGER, managerMess)
              this.SET_INFO(managerMess)
              this.visible = false
              this.confirmLoading = false
              this.form.resetFields()
              this.$emit('ok', values)
            }).finally(() => {
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>