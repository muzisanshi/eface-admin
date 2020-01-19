<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.8
 * @desc 新增（账号管理）
-->
<template>
  <a-modal :title="title+'用户'" :width="840" :visible="visible" :confirmLoading="confirmLoading" :maskClosable="false" :keyboard="false" @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :maxLength="64"
                v-decorator="['manager.username', {initialValue: this.formData.username, rules: [{required: true, message: '请输入名称！'}]}]"/>
            </a-form-item>
          </a-col>
          <!--<a-col :span="12">-->
            <!--<a-form-item label="电话号码" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
              <!--<a-input-->
                <!--v-decorator="['manager.phoneNo', {initialValue: this.formData.phoneNo, rules: [{required: true, message: '请输入电话号码！'},{validator: rulePhone}]}]"/>-->
            <!--</a-form-item>-->
          <!--</a-col>-->

          <a-col :span="12">
            <a-form-item label="电话号码" :labelCol="labelCol" :wrapperCol="wrapperCol" class="national-code">
              <a-input :maxLength="32" v-decorator="['manager.phoneNo', {initialValue: this.formData.phoneNo, rules: [{required: true, message: '请输入电话号码！'}]}]">
                <a-select
                  showSearch
                  allowClear
                  slot="addonBefore"
                  placeholder="选择区号"
                  optionFilterProp="children"
                  :filterOption="filterCommonOption"
                  :options="nationalAreaCodeList"
                  v-decorator="['manager.nationalAreaCodeId', {initialValue: this.formData.nationalAreaCodeId}]">
                </a-select>
              </a-input>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :maxLength="64"
                v-decorator="['manager.realName', {initialValue: this.formData.realName, rules: [{required: true, message: '请输入姓名！'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="类型"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select showSearch
                        allowClear
                        placeholder="选择类型"
                        optionFilterProp="children"
                        :filterOption="filterCommonOption"
                        @change="manageTypeChange"
                        :options="constants.list.managerType"
                        v-decorator="['manager.managerType', {initialValue: this.formData.managerType?this.formData.managerType:constants.list.managerType[0].value,rules: [{required: true, message: '请选择类型！'}]}]">
              </a-select>

            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select showSearch allowClear placeholder="选择性别" optionFilterProp="children"
                        :filterOption="filterCommonOption" :options="constants.list.sexual"
                        v-decorator="['manager.sexual', {initialValue: this.formData.sexual?this.formData.sexual:constants.list.sexual[1].value, rules: [{required: true, message: '请选择性别！'}]}]">
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="账户状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select showSearch allowClear placeholder="选择账户状态" optionFilterProp="children"
                        :filterOption="filterCommonOption" :options="constants.list.accountState"
                        v-decorator="['manager.accountState', {initialValue: this.formData.accountState?this.formData.accountState:constants.list.accountState[1].value, rules: [{required: true, message: '请选择账户状态！'}]}]">
              </a-select>
            </a-form-item>
          </a-col>

        </a-row>
        <a-row :gutter="24">

          <a-col :span="12" v-if="isOrgInput">

            <a-form-item
              label="组织"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                showSearch
                placeholder="选择组织"
                optionFilterProp="children"
                @change="orgChange"
                :filterOption="filterCommonOption"
                :options="orgList"
                v-decorator="['manager.orgId', {initialValue: this.formData.orgId?this.formData.orgId:'',rules: [{required: true, message: '请选择组织！'}]}]"
              >
              </a-select>
            </a-form-item>

          </a-col>

          <a-col :span="12">
            <a-form-item label="角色" :labelCol="labelCol" :wrapperCol="wrapperCol">

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

          <a-col :span="12" v-if="formData.id">
            <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :maxLength="32" v-decorator="['manager.password',{initialValue: this.formData.password}]"/>
            </a-form-item>
          </a-col>

          <a-col :span="12" v-else>
            <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :maxLength="32" v-decorator="['manager.password',{initialValue: this.formData.password, rules: [{required: true, message: '请填写密码！'}]}]"/>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="邮件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :maxLength="64" v-decorator="['manager.email',{initialValue: this.formData.email}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :maxLength="255" v-decorator="['manager.remark',{initialValue: this.formData.remark}]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <!--<a-row :gutter="24" v-if="isEstateList">-->
          <!--<a-col :span="23">-->
            <!--<a-form-item-->
              <!--label="地产"-->
              <!--:labelCol="labelCo1"-->
              <!--:wrapperCol="wrapperCo1"-->
            <!--&gt;-->
              <!--<a-select-->
                <!--showSearch-->
                <!--mode="multiple"-->
                <!--placeholder="选择地产"-->
                <!--optionFilterProp="children"-->
                <!--:filterOption="filterCommonOption"-->
                <!--:options="estateList"-->
                <!--v-decorator="['manager.estateIds', {initialValue: this.formData.estateIds?this.formData.estateIds:[],rules: [{required: true, message: '请选择地产！'}]}]"-->
              <!--&gt;-->
              <!--</a-select>-->
            <!--</a-form-item>-->
          <!--</a-col>-->
        <!--</a-row>-->

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
        nationalAreaCodeList:[],
        isOrgInput:false
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

        this.$api.nationalAreaCode.getAll()
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].areaCode
              })
            }
            this.nationalAreaCodeList = l
            if (item) {
              this.title = '修改'
              this.$api.manager.getById({id: item.id})
                .then(res => {
                  let orgIds = ''
                  this.formData = res
                  if(res.managerType === 'ORG'){
                    this.isOrgInput = true
                    orgIds = res.orgId
                  }else{
                    this.isOrgInput = false
                    orgIds = ''
                  }
                  this.getRoleList(orgIds)
                })
            } else {
              this.getRoleList('')
              this.title = '新增'
              this.formData.nationalAreaCodeId=this.nationalAreaCodeList[0].value
            }

          })


      },

      manageTypeChange(value){
        if(value === 'ORG'){
          this.isOrgInput = true
          this.roleList = []
          this.formData.orgId = ''
          this.form.setFieldsValue({
            rolesIds:[],
          });
        }else{
          this.isOrgInput = false
          this.getRoleList('')
          this.form.setFieldsValue({
            rolesIds:[],
          });
        }
      },

      orgChange(value,option){
        this.getRoleList(value)
      },

      getRoleList(value){
        this.$api.role.getAll({
          orgId:value
        })
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