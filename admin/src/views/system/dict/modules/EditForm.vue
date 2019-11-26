<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.26
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
          <a-input
            v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入位置名称！'}]}]"/>
        </a-form-item>

        <a-form-item label="编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['code', {initialValue: this.formData.code, rules: [{required: true, message: '请输入编码！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="是否更新"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="canUpdate" @change="changeCanUpdate" v-decorator="['canUpdate']"/>
        </a-form-item>

        <a-form-item
          label="是否显示"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="canView" @change="changeCanView" v-decorator="['canView']"/>
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
        title: '',
        canUpdate:true,
        canView:true,
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

        if(item){
          this.title = '修改'
          this.$api.dictType.getById({id: item.id})
            .then(res => {
              this.formData = res
              this.canUpdate = this.formData.canUpdate;
              this.canView = this.formData.canView;
            })
        }else{
          this.title = '新增'
          this.canUpdate = true
          this.canView = true;
        }
      },

      changeCanUpdate(checked) {
        this.canUpdate = checked
      },

      changeCanView(checked) {
        this.canView = checked
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if(this.formData.id){
              values.id = this.formData.id
            }
            if (!values.canUpdate) {
              values.canUpdate = this.canUpdate
            }
            if (!values.canView) {
              values.canView = this.canView
            }
            this.$api.dictType.saveOrUpdate(values)
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