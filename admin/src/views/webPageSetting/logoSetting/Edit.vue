<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.28
 * @desc 首页设置
-->
<template>
  <a-card :bordered="false" class="content">
      <a-form :form="form">

        <a-form-item label="系统LOGO文字" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['logoText', {initialValue: this.formData.logoText, rules: [{required: true, message: '请输入系统LOGO文字！'}]}]"/>
        </a-form-item>

        <a-form-item label="系统LOGO文字-子标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['logoSubTitle', {initialValue: this.formData.logoSubTitle, rules: [{required: true, message: '请输入名称！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="系统LOGO图片"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="upload-img"
        >
          <a-upload
            :action="system.uploadMainUrl"
            listType="picture"
            style="margin-left: 10px;display: inline-block;float: right;margin-top: 10px;width: 220px;"
            :showUploadList="false"
            :accept="fileType"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <div style="width: 200px;height: 50px;border: 1px solid #f1f1f1;">
              <img :src="logoImage" alt="" style="height: 100%"/>
            </div>

            <div style="margin-top: 10px">
              <a-button type="primary" class="ant-upload-text">浏览上传</a-button>
              <a-button type="primary" style="margin-left: 10px" @click.stop="delLogoImage">删除</a-button>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item
          label="是否显示系统LOGO图片(登录页)"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="showLogoImageToLoginPage" @change="changeToLogin" v-decorator="['showLogoImageToLoginPage']"/>
        </a-form-item>

        <a-form-item
          label="是否显示系统LOGO图片(首页)"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="showLogoImageToIndexPage" @change="changeToIndex" v-decorator="['showLogoImageToIndexPage']"/>
        </a-form-item>

        <a-form-item
          label="登录页背景"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="upload-img"
        >
          <a-upload
            :action="system.uploadMainUrl"
            listType="picture"
            style="margin-left: 10px;display: inline-block;float: right;margin-top: 10px;width: 170px;"
            :showUploadList="false"
            :accept="fileType"
            :beforeUpload="beforeUpload"
            @change="handleBgChange"
          >
            <div style="width: 150px;height: 150px;border: 1px solid #f1f1f1;">
              <img :src="loginBgImage" alt="" style="height: 100%"/>
            </div>

            <div style="margin-top: 10px">
              <a-button type="primary" class="ant-upload-text">浏览上传</a-button>
              <a-button type="primary" style="margin-left: 10px" @click.stop="delLogoImage">删除</a-button>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item
          label="是否显示登录页背景(登录页)"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="loginBgImageToLoginPage" @change="changeBgToLogin" v-decorator="['loginBgImageToLoginPage']"/>
        </a-form-item>

        <div style="margin-top: 10px;text-align: right">
          <a-button type="primary" @click="handleSubmit">保存</a-button>
        </div>

      </a-form>
  </a-card>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  import {mapState, mapActions} from 'vuex';
  import moment from 'moment';
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
        formData: {
          adItem:{}
        },
        title: '',
        logoImage:'',
        loginBgImage:'',
        loginBgImageId:'',
        logoImageId:'',
        showLogoImageToLoginPage:false,
        showLogoImageToIndexPage:true,
        loginBgImageToLoginPage:true,
        fileType:'image/*'
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    computed: {
      ...mapState(['constants', 'system'])
    },
    created(){
      this.add()
    },
    methods: {
      ...mapActions(['loadLogoData']),
      moment,
      add () {
        this.visible = true
        this.form.resetFields()
        this.formData ={
          no:(new Date()).getTime(),
          adItem:{}
        }
        this.headImageAttId = '';
        this.$api.webPageSetting.getInfo()
          .then(res => {
            this.formData = res
            this.logoImage = this.formData.logoImage?this.formData.logoImage.resourceFullAddress:'';
            this.loginBgImage = this.formData.loginBgImage? this.formData.loginBgImage.resourceFullAddress:'';
            this.logoImageId = this.formData.logoImageAttId;
            this.loginBgImageId = this.formData.loginBgImageAttId;
            this.showLogoImageToLoginPage = this.formData.showLogoImageToLoginPage;
            this.showLogoImageToIndexPage = this.formData.showLogoImageToIndexPage;
            this.loginBgImageToLoginPage = this.formData.loginBgImageToLoginPage;
          })
        // if(){
          this.title = '修改'
        //
        // }else{
        //   this.title = '新增'
        //   this.showLogoImageToLoginPage = false
        //   this.showLogoImageToIndexPage = true
        //   this.loginBgImageToLoginPage = true
        // }
      },

      handleChange(info) {
        let that = this;
        switch (info.file.status) {
          case 'uploading':
            this.loading = true
            break
          case 'done':
            if (info.file.response.success) {
              that.logoImage = info.file.response.data.resourceFullAddress
              that.logoImageId = info.file.response.data.id
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

      handleBgChange(info) {
        let that = this;
        switch (info.file.status) {
          case 'uploading':
            this.loading = true
            break
          case 'done':
            if (info.file.response.success) {
              that.loginBgImage = info.file.response.data.resourceFullAddress
              that.loginBgImageId = info.file.response.data.id
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

      beforeUpload(file) {
        return true
      },

      changeToLogin(checked) {
        this.showLogoImageToLoginPage = checked
      },

      changeToIndex(checked) {
        this.showLogoImageToIndexPage = checked
      },

      changeBgToLogin(checked) {
        this.loginBgImageToLoginPage = checked
      },


      delLogoImage(){
        console.log('111')
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if(this.formData.id){
              values.id = this.formData.id
            }

            if (!values.showLogoImageToLoginPage) {
              values.showLogoImageToLoginPage = this.showLogoImageToLoginPage
            }

            if (!values.showLogoImageToIndexPage) {
              values.showLogoImageToIndexPage = this.showLogoImageToIndexPage
            }

            if (!values.loginBgImageToLoginPage) {
              values.loginBgImageToLoginPage = this.loginBgImageToLoginPage
            }

            if (this.logoImageId) {
              values.logoImageAttId = this.logoImageId
            }else{
              this.$notification.error({
                message: '提示',
                description: '请上传系统LOGO图片！'
              })
              this.confirmLoading = false
              return
            }

            if (this.loginBgImageId) {
              values.loginBgImageAttId = this.loginBgImageId
            }else{
              this.$notification.error({
                message: '提示',
                description: '请上传系统LOGO图片！'
              })
              this.confirmLoading = false
              return
            }

            this.$api.webPageSetting.saveOrUpdate(values)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description: this.title + '成功！'
                })
                this.confirmLoading = false
                this.loadLogoData();
                this.form.resetFields()

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
<style>
.upload-img .ant-col-sm-16 .ant-form-item-children{
  display: block;
  width: 100%;
}
.upload-img .ant-col-sm-16 .ant-form-item-children>span{
  display: block!important;
  width: 100%;
  float: none!important;
  margin: 0!important;
}
.upload-img .ant-col-sm-16 .ant-form-item-children>span>.ant-upload{
  width: 100%;
}
</style>