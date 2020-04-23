<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.8
 * @desc 修改密码
-->
<template>
  <a-modal
    title="修改密码"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="旧密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            type="password"
            autocomplete="false"
            v-decorator="['oldPassword', {initialValue: this.formData.oldPassword,rules: [{required: true, message: '请输入旧密码！'}], validateTrigger: 'blur'}]" />
        </a-form-item>

        <a-form-item
          label="新密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            type="password"
            autocomplete="false"
            v-decorator="['newPassword', {initialValue: this.formData.newPassword,rules: [{required: true, message: '请输入新密码！'}], validateTrigger: 'blur'}]" />
        </a-form-item>

        <a-form-item
          label="确认新密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            type="password"
            autocomplete="false"
            v-decorator="['confirmPassword', {initialValue: this.formData.confirmPassword,rules: [{required: true, message: '请输入确认新密码！'}], validateTrigger: 'blur'}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { mapState, mapActions } from 'vuex'
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
      form: this.$form.createForm(this),
      formGoodsData: {}
    }
  },
  computed: {
    ...mapState(['constants'])
  },
  methods: {
    ...mapActions(['Logout']),
    add (item) {
      const thiz = this
      this.visible = true
      this.form.resetFields()
      this.formData = {}
    },
    handleSubmit () {
      const { form: { validateFields }, Logout } = this
      validateFields((errors, values) => {
        console.log(values)
        if (!errors) {
          // 修改
          if (values.newPassword !== values.confirmPassword) {
            this.$notification.error({
              message: '提示',
              description: '新密码和确认密码不一致'
            })
            return false
          }
          this.confirmLoading = true
          this.$api.manager.updatePassword(values)
            .then(res => {
              this.$notification.success({
                message: '成功',
                description: '修改密码成功'
              })
              this.visible = false
              this.confirmLoading = false
              this.form.resetFields()
              const token = sessionStorage.getItem('ACCESS_TOKEN')
              Logout(token)
                .then((res) => {
                  setTimeout(() => {
                    window.location.reload()
                  }, 1000)
                })
                .catch(err => {})
                .finally(() => {
                })

              this.store.dispatch('Logout').then(() => {

              })
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
