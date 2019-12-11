<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.12.11
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
            v-decorator="['deviceModelId', {initialValue: this.formData.deviceModelId?this.formData.deviceModelId:'', rules: [{required: true, message: '请选择设备型号！'}]}]"
          >
          </a-select>
        </a-form-item>

        <a-form-item label="版本" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['softVer', {initialValue: this.formData.softVer, rules: [{required: true, message: '请输入版本！'}]}]"/>
        </a-form-item>


        <a-form-item
          label="是否强制更新"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="forcedUpdate" @change="changeForcedUpdate" v-decorator="['forcedUpdate']"/>
        </a-form-item>

        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea
            placeholder="内容"
            v-decorator="['content',{initialValue: this.formData.content, rules: [{required: true, message: '请输入内容！'}]}]"
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-item>

        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['remark',{initialValue: this.formData.remark}]" />
        </a-form-item>

        <a-form-item
          label="打包附件"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-upload
            :action="system.uploadMainUrl"
            listType="picture-card"
            :showUploadList="false"
            accept="image/*"
            :data="imgData"
            :beforeUpload="beforeUpload"
            @change="handleChange"
            name="file"
          >
            <img v-if="topImg" :src="topImg" alt="" style="width: 150px;"/>
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  import {mapState} from 'vuex';
  import selectArea from '@/components/Common/selectArea'
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
        deviceModelList:[],
        forcedUpdate:true,
        topImg: '',
        headImageAttId: null,
        imgData:{
          attOrigin:'ADMIN',
          attType:'NORMAL'
        },
      }
    },
    components: {
      selectArea
    },
    computed: {
      ...mapState(['constants', 'system'])
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
        this.headImageAttId = null;
        this.topImg = null;
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
          this.$api.deviceVersion.getById({id: item.id})
            .then(res => {
              this.formData = res
              this.topImg = res.resourceFullAddress
            })
        }else{
          this.title = '新增'
          this.forcedUpdate = true
        }
      },

      changeForcedUpdate(checked) {
        this.forcedUpdate = checked
      },

      handleChange(info) {
        let that = this;
        switch (info.file.status) {
          case 'uploading':
            this.loading = true
            break
          case 'done':
            if (info.file.response.success) {
              that.topImg = info.file.response.data.resourceFullAddress
              that.headImageAttId = info.file.response.data.id
            } else {
              this.$message.error(info.file.response.errCode + ':' + info.file.response.errDesc)
            }
            this.loading = false
            break
          case 'error':
            this.$message.error(info.file.response.status + ':' + info.file.response.error)
            this.loading = false
            break
        }
      },

      beforeUpload() {
        return true
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {

          if (!errors) {
            if(this.formData.id){
              values.id = this.formData.id
            }
            if (!values.forcedUpdate) {
              values.forcedUpdate = this.forcedUpdate
            }
            values.headImageAttId = this.headImageAttId
            this.$api.deviceVersion.saveOrUpdate(values)
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