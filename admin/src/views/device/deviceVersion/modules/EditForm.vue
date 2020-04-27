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
    :keyboard="false"
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

        <a-form-item label="平台类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            size="default"
            placeholder="请选择平台类型"
            optionFilterProp="children"
            v-decorator="['platformType', {initialValue: this.formData.platformType, rules: [{required: true, message: '请输入平台类型！'}]}]"
          >
            <a-select-option :value="item.value" v-for="(item, index) in constants.data.devicePlatformType" :key="index">{{ item.value }}</a-select-option>
            <!-- <a-select-option value="CLOSE">关闭</a-select-option> -->
          </a-select>
        </a-form-item>

        <a-form-item label="版本" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="64"
            v-decorator="['softVer', {initialValue: this.formData.softVer, rules: [{required: true, message: '请输入版本！'}]}]"/>
        </a-form-item>

        <a-form-item label="构建版本" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :maxLength="9"
            v-decorator="['buildVer', {initialValue: this.formData.buildVer, rules: [{required: true, pattern: new RegExp(this.REG_EXPS.PLUS_INTEGER, 'g'), message: '请输入有效的构建版本！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="内容"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea
            :maxLength="255"
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
          <a-input :maxLength="255" v-decorator="['remark',{initialValue: this.formData.remark}]" />
        </a-form-item>

        <a-form-item
          label="打包附件"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-upload
            :action="system.uploadMainUrl"
            :showUploadList="false"
            accept="*"
            :headers="clientHeader"
            :data="imgData"
            :beforeUpload="beforeUpload"
            @change="handleChange"
            name="file"
          >
            <a v-if="topImg" style="width: 150px;">{{ topImgName }}</a>
            <div v-else>
              <a-button> <a-icon type="upload" /> 上传附件 </a-button>
            </div>
          </a-upload>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { mixin } from '@/mixins/mixin'
import { mapState } from 'vuex'
import selectArea from '@/components/Common/SelectArea'
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
      deviceModelList: [],
      topImg: '',
      topImgName: '',
      headImageAttId: null,
      imgData: {
        jsonParam: JSON.stringify({
          attOrigin: 'ADMIN',
          attType: 'NORMAL'
        })
      }
    }
  },
  components: {
    selectArea
  },
  computed: {
    ...mapState(['constants', 'system'])
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    add (item) {
      const that = this
      this.visible = true
      this.form.resetFields()
      this.formData = {}
      this.deviceModelList = []
      this.headImageAttId = null
      this.topImg = null
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

      if (item) {
        this.title = '修改'
        this.$api.deviceVersion.getById({ id: item.id })
          .then(res => {
            this.formData = res
            this.topImg = res.resourceFullAddress
            this.topImgName = res.updatePackageAttOrigFilename
            this.headImageAttId = res.updatePackageAttId
          })
      } else {
        this.title = '新增'
      }
    },

    handleChange(info) {
      const that = this
      switch (info.file.status) {
        case 'uploading':
          this.loading = true
          break
        case 'done':
          if (info.file.response.success) {
            that.topImgName = that.fileData.title
            that.topImg = info.file.response.data.resourceFullAddress
            that.headImageAttId = info.file.response.data.id
            that.confirmLoading = false
            that.$notification.success({
              message: '成功',
              description: '上传成功！'
            })
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
          if (this.formData.id) {
            values.id = this.formData.id
          }

          values.updatePackageAttId = this.headImageAttId
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
    }
  }
}
</script>
