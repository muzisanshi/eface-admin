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
    :maskClosable="false" :keyboard="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="地产"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input @click="selectDataCon(1)" :read-only="true" v-decorator="['estateName', {initialValue: this.formData.estateName,rules: [{required: true, message: '请选择地产！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="文件类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            allowClear
            placeholder="选择文件类型"
            @change="fileTypeChange"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="fileTypeList"
            v-decorator="['fileType', {initialValue: this.formData.fileType,rules: [{required: true, message: '请选择文件类型！'}]}]">
          </a-select>
        </a-form-item>


        <a-form-item
          label="选择文件"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-upload
            :showUploadList="false"
            :accept="selectFileType"
            :headers="clientHeader"
            :data="imgData"
            :beforeUpload="beforeFileUpload"
            name="file"
          >
            <a v-if="fileImgName" style="width: 150px;">{{fileImgName}}</a>
            <div v-else>
              <a-button> <a-icon type="upload" /> 选择文件 </a-button>
            </div>
          </a-upload>
        </a-form-item>

      </a-form>
    </a-spin>
    <select-data-Con ref="selectSuccess" @selectSuccess="selectSuccess"></select-data-Con>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  import {mapState} from 'vuex';
  import md5 from 'md5'
  import selectDataCon from '@/components/Common/SelectDataCon'
  const SIGN = {
    clientId: 'admin',
    key: 'da74588912504563e464ffe8956de784'
  }
  export default {
    mixins:[mixin],
    components: {
      selectDataCon
    },
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
        fileImgName:'',
        fileImg:'',
        fileType:'zip',
        imgData:{
          jsonParam:JSON.stringify({
            attOrigin:'ADMIN',
            attType:'NORMAL',
          })
        },
        selectFileType:'*',
        code:'OWNER',
        file:'',
        fileTypeList:[
          {
            label:'zip格式',
            value:'zip'
          }
        ]
      }
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
        this.code = item
        this.form.resetFields()
        this.formData ={
          fileType:this.fileTypeList[0].value
        }
        this.fileImgName = null;
      },

      selectSuccess(value){
        this.formData.estateName = value.name
        this.formData.estateId = value.value
        this.form.setFieldsValue({ estateName: value.name});
      },

      fileTypeChange(value, option){
        this.fileType = value
      },

      beforeFileUpload(file) {
        if(file.type){
          if(file.type.split('/')[1].indexOf(this.fileType) === -1){
            this.$notification.error({
              message: '提示',
              description: '上传文件和选择文件类型不对应'
            })
            return false
          }
        }else{
          this.$notification.error({
            message: '提示',
            description: '上传文件和选择文件类型不对应'
          })
          return false
        }

        this.fileImgName = file.name
        const timestamp = new Date().getTime() + ''
        const signature = SIGN.clientId + timestamp + SIGN.key
        this.clientHeader['X-timestamp'] = timestamp
        this.clientHeader['X-signature'] = md5(signature)
        this.file = file;
        return false
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if(this.formData.estateId){
              values.estateId = this.formData.estateId
            }else{
              this.$notification.error({
                message: '提示',
                description: '请选择地产'
              })
              this.confirmLoading = false
              return false
            }
            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('code', this.code);
            formData.append('estateId', this.formData.estateId);
            this.$api.user.importUser(formData)
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