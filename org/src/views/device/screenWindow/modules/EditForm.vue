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
    :maskClosable="false" :keyboard="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="设备型号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择设备型号"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="deviceModelList"
            v-decorator="['deviceModelId', {initialValue: this.formData.deviceModelId?this.formData.deviceModelId:''}]"
          >
          </a-select>
        </a-form-item>

        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="64"
            v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入名称！'}]}]"/>
        </a-form-item>

        <a-form-item label="下标" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="9"
            v-decorator="['indexNum', {initialValue: this.formData.indexNum, rules: [{required: true,pattern: new RegExp(this.REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的下标！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="是否下发广告"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="canDistAd" @change="changeCanDistAd" v-decorator="['canDistAd']"/>
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
        deviceModelList:[],
        title: '',
        canDistAd:true
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
        this.deviceModelList = []
        this.$api.deviceModel.getAll({})
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name
              })
            }
            this.deviceModelList = l
          })

        if(item){
          this.title = '修改'
          this.$api.screenWindow.getById({id: item.id})
            .then(res => {
              this.formData = res
              this.canDistAd = res.canDistAd
            })
        }else{
          this.title = '新增'
          this.canDistAd = true
        }
      },

      changeCanDistAd(checked) {
        this.canDistAd = checked
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {

          if (!errors) {
            if(this.formData.id){
              values.id = this.formData.id
            }

            if (!values.canDistAd) {
              values.canDistAd = this.canDistAd
            }

            this.$api.screenWindow.saveOrUpdate(values)
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