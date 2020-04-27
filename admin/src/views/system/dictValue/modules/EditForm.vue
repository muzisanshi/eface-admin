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
    :keyboard="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="64"
            v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入位置名称！'}]}]"/>
        </a-form-item>
        <a-form-item label="字典值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="64"
            v-decorator="['value', {initialValue: this.formData.value, rules: [{required: true, message: '请输入字典值！'}]}]"/>
        </a-form-item>
        <a-form-item label="排序序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="9"
            v-decorator="['orderNum', {initialValue: this.formData.orderNum, rules: [{required: true, message: '请输入排序序号！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="是否更新"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="canUpdate" @change="changeCanUpdate" v-decorator="['canUpdate']"/>
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
import { mixin } from '@/mixins/mixin'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  data () {
    return {
      goodsGroups: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      formData: {},
      title: '',
      canUpdate: true,
      dictTypeId: ''
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  computed: {
    ...mapState(['constants'])
  },
  methods: {
    add (item, id) {
      this.visible = true
      this.form.resetFields()
      this.formData = {}
      this.dictTypeId = id
      if (item) {
        this.title = '修改'
        this.$api.dictValue.getById({ id: item.id })
          .then(res => {
            this.formData = res
            this.canUpdate = this.formData.canUpdate
          })
      } else {
        this.title = '新增'
        this.canUpdate = true
      }
    },

    changeCanUpdate(checked) {
      this.canUpdate = checked
    },

    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.formData.id) {
            values.id = this.formData.id
          }
          if (this.dictTypeId) {
            values.dictTypeId = this.dictTypeId
          }
          if (!values.canUpdate) {
            values.canUpdate = this.canUpdate
          }
          this.$api.dictValue.saveOrUpdate(values)
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
    }
  }
}
</script>
