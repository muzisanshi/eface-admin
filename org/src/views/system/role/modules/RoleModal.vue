<!--
 * @name RoleModal.vue
 * @author lw
 * @date 2019.11.8
 * @desc 新增（角色管理）
-->
<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :maskClosable="false" :keyboard="false"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;height: 85%;overflow-y: hidden">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称">
          <a-input :maxLength="64" placeholder="请输入角色名称"
                   v-decorator="[ 'name', {initialValue: this.formData.name,rules: [{required: true, message: '请输入角色名称！'}]}]"/>
        </a-form-item>

       <!-- <a-form-item
          label="组织"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择组织"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="orgList"
            v-decorator="['orgId', {initialValue: this.formData.orgId?this.formData.orgId:''}]"
          >
          </a-select>
        </a-form-item> -->

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-textarea :maxLength="255" :rows="5" placeholder=" " v-decorator="[ 'remark', {initialValue: this.formData.remark} ]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'

  export default {
    name: "RoleModal",
    mixins: [mixin],
    data() {
      return {
        title: "操作",
        visible: false,
        roleDisabled: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        formData: {},
        // orgList: []
      }
    },
    created() {
    },
    methods: {
      add(record) {
        this.form.resetFields();
        this.formData = {};
        this.visible = true;
        // this.orgList = [];
        let that = this;
        // this.$api.org.getAll()
        //   .then(res => {
        //     const l = []
        //     for (let i = 0, j = res.length; i < j; i++) {
        //       l.push({
        //         value: res[i].id,
        //         label: res[i].name
        //       })
        //     }
        //     that.orgList = l
        //   })
        if (record) {
          this.title = '修改'
          this.$api.role.getById({
            id: record.id
          })
            .then(res => {
              this.formData = res
            })
        } else {
          this.enable = true
          this.title = '新增'
        }
      },
      handleOk() {
        const {
          form: {
            validateFields
          }
        } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          console.log(values)
          if (!errors) {
            //修改
            if (this.formData.id) {
              values.id = this.formData.id;
            }
            this.$api.role.saveOrUpdate(values)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description: this.title + '成功'
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

<style scoped>

</style>