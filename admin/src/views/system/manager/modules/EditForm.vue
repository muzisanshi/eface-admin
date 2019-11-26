<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.8
 * @desc 新增（账号管理）
-->
<template>
  <a-modal :title="title+'新增用户'" :width="740" :visible="visible" :confirmLoading="confirmLoading" :maskClosable="false" @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['manager.username', {initialValue: this.formData.username, rules: [{required: true, message: '请输入名称！'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="电话号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['manager.phoneNo', {initialValue: this.formData.phoneNo, rules: [{required: true, message: '请输入电话号码！'},{validator: rulePhone}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['manager.realName', {initialValue: this.formData.realName, rules: [{required: true, message: '请输入姓名！'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="管理员类型"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select showSearch allowClear @change="managerTypeChange" placeholder="选择管理员类型" optionFilterProp="children"
                        :filterOption="filterCommonOption" :options="constants.list.managerType"
                        v-decorator="['manager.managerType', {initialValue: this.formData.managerType,rules: [{required: true, message: '请选择管理员类型！'}]}]">
              </a-select>

            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select showSearch allowClear placeholder="选择性别" optionFilterProp="children"
                        :filterOption="filterCommonOption" :options="constants.list.sexual"
                        v-decorator="['manager.sexual', {initialValue: this.formData.sexual, rules: [{required: true, message: '请选择性别！'}]}]">
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">

            <a-form-item
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
                v-decorator="['manager.orgId', {initialValue: this.formData.orgId?this.formData.orgId:'',rules: [{required: true, message: '请选择组织！'}]}]"
              >
              </a-select>
            </a-form-item>

          </a-col>
        </a-row>
        <a-row :gutter="24">

          <a-col :span="12">
            <a-form-item label="账户状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select showSearch allowClear placeholder="选择账户状态" optionFilterProp="children"
                        :filterOption="filterCommonOption" :options="constants.list.accountState"
                        v-decorator="['manager.accountState', {initialValue: this.formData.accountState, rules: [{required: true, message: '请选择账户状态！'}]}]">
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="角色分配" :labelCol="labelCol" :wrapperCol="wrapperCol">

              <a-select
                mode="multiple"
                placeholder="请选择用户角色"
                optionFilterProp="children"
                :filterOption="filterCommonOption"
                :options="roleList"
                v-decorator="['rolesIds', {initialValue: this.formData.roles?this.formData.roles:[],rules: [{required: true, message: '请选择用户角色！'}]}]"
              >
              </a-select>

            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="邮件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['manager.email',{initialValue: this.formData.email}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['manager.remark',{initialValue: this.formData.remark}]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24" v-if="isEstateList">
          <a-col :span="23">
            <a-form-item
              label="地产"
              :labelCol="labelCo1"
              :wrapperCol="wrapperCo1"
            >
              <a-select
                showSearch
                mode="multiple"
                placeholder="选择地产"
                optionFilterProp="children"
                :filterOption="filterCommonOption"
                :options="estateList"
                v-decorator="['manager.estateIds', {initialValue: this.formData.estateIds?this.formData.estateIds:[],rules: [{required: true, message: '请选择地产！'}]}]"
              >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
  import {mapState} from 'vuex';
  import {mixin} from '@/mixins/mixin'

  export default {
    components: {},
    mixins: [mixin],
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

        labelCo1: {
          xs: {span: 24},
          sm: {span: 4}
        },
        wrapperCo1: {
          xs: {span: 24},
          sm: {span: 16}
        },
        visible: false,
        confirmLoading: false,

        uploadFileId: '',
        formData: {},
        title: '',
        form: this.$form.createForm(this),
        countries: [],
        managerTypes: [],
        accountStates: [],
        sexuales: [],
        roleList: [],
        orgList: [],
        estateList:[],
        isEstateList:false
      }
    },
    computed: {
      ...mapState(['constants'])
    },
    methods: {
      onUploadSuccess(id) {
        this.uploadFileId = id
      },
      add(item) {
        this.visible = true
        this.form.resetFields()
        this.formData = {};
        this.$api.role.getAll()
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name
              })
            }
            this.roleList = l
          })

        this.$api.org.getAll()
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name
              })
            }
            this.orgList = l
          })

        this.$api.estate.getAll({
          name:'',
          areaId:''
        })
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name
              })
            }
            this.estateList = l
          })

        if (item) {
          this.title = '修改'
          this.$api.manager.getById({id: item.id})
            .then(res => {
              this.formData = res
            })
        } else {
          this.title = '新增'
        }
      },

      managerTypeChange(value){
        if('OPS' == value){
          this.isEstateList = true
        }else{
          this.isEstateList = false
        }
      },

      handleSubmit() {
        const {form: {validateFields}} = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if (this.formData.id) {
              values.manager.id = this.formData.id;
            }
            this.$api.manager.saveOrUpdate(values)
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
      rulePhone(rule, value, callback) {
        const form = this.form;
        const reg = /^1(3|4|5|7|8)\d{9}$/;
        if (value && !reg.test(value)) {
          callback('请输入正确的电话号码');
        } else {
          callback();
        }
      }
    }
  }
</script>