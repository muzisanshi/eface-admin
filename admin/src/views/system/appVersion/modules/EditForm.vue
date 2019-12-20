<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.12.16
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
          label="APP类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            allowClear
            placeholder="选择APP类型"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="constants.list.appType"
            v-decorator="['appType', {initialValue: this.formData.appType,rules: [{required: true, message: '请选择APP类型！'}]}]">
          </a-select>
        </a-form-item>

        <a-form-item
          label="设备类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            allowClear
            placeholder="选择设备类型"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="constants.list.deviceType"
            v-decorator="['deviceType', {initialValue: this.formData.deviceType,rules: [{required: true, message: '请选择设备类型！'}]}]">
          </a-select>
        </a-form-item>

        <a-form-item label="框架版本" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['frameVer', {initialValue: this.formData.frameVer, rules: [{required: true, message: '请输入框架版本！'}]}]"/>
        </a-form-item>

        <a-form-item label="内核版本" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['rootVer', {initialValue: this.formData.rootVer, rules: [{required: true, message: '请输入内核版本！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="更新内容"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea
            placeholder="更新内容"
            v-decorator="['content',{initialValue: this.formData.content, rules: [{required: true, message: '请输入更新内容！'}]}]"
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
          <span>换行请用"||"隔开</span>
        </a-form-item>

        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['remark',{initialValue: this.formData.remark}]" />
        </a-form-item>

        <a-form-item
          label="框架附件"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-upload
            :action="system.uploadMainUrl"
            listType="picture-card"
            :showUploadList="false"
            accept="image/*"
            :data="imgData"
            @change="handleFrameChange"
            name="file"
          >
            <img v-if="frameImg" :src="frameImg" alt="" style="width: 150px;"/>
            <div v-else>
              <a-icon :type="frameloading ? 'frameloading' : 'plus'" />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item
          label="内核附件"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-upload
            :action="system.uploadMainUrl"
            listType="picture-card"
            :showUploadList="false"
            accept="image/*"
            :data="imgData"
            @change="handleChange"
            name="file"
          >
            <img v-if="rootImg" :src="rootImg" alt="" style="width: 150px;"/>
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
        rootImg: '',
        frameImg:'',
        frameAttId: null,
        rootAttId: null,
        frameloading:false,
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
        this.visible = true
        this.form.resetFields()
        this.formData ={}
        this.rootAttId = null;
        this.frameAttId = null;
        this.rootImg = null;
        this.frameImg = null;
        if(item){
          this.title = '修改'
          this.$api.appVersion.getById({id: item.id})
            .then(res => {
              this.formData = res
              this.rootImg = res.frameAttResourceAddress
              this.frameImg = res.rootAttResourceAddress
            })
        }else{
          this.title = '新增'
        }
      },

      handleFrameChange(info) {
        let that = this;
        switch (info.file.status) {
          case 'uploading':
            this.frameloading = true
            break
          case 'done':
            if (info.file.response.success) {
              that.frameImg = info.file.response.data.resourceFullAddress
              that.frameAttId = info.file.response.data.id
            } else {
              this.$message.error(info.file.response.errCode + ':' + info.file.response.errDesc)
            }
            this.frameloading = false
            break
          case 'error':
            this.$message.error(info.file.response.status + ':' + info.file.response.error)
            this.frameloading = false
            break
        }
      },

      handleChange(info) {
        let that = this;
        switch (info.file.status) {
          case 'uploading':
            this.loading = true
            break
          case 'done':
            if (info.file.response.success) {
              that.rootImg = info.file.response.data.resourceFullAddress
              that.rootAttId = info.file.response.data.id
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

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if(this.formData.id){
              values.id = this.formData.id
            }
            values.frameAttId = this.frameAttId
            values.rootAttId = this.rootAttId
            this.$api.appVersion.saveOrUpdate(values)
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