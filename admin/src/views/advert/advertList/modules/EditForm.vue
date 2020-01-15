<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.28
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

        <a-form-item label="广告编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="32"
            v-decorator="['adItem.id',{initialValue: this.formData.adItem.id}]" v-show="false"/>
          <a-input
            v-decorator="['no', {initialValue: this.formData.no, rules: [{required: true, message: '请输入位置名称！'}]}]"/>
        </a-form-item>

        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="64"
            v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入名称！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="广告类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            allowClear
            placeholder="选择广告类型"
            optionFilterProp="children"
            @change="changeFileType"
            :filterOption="filterCommonOption"
            :options="constants.list.adFileType"
            v-decorator="['adItem.adFileType', {initialValue: this.formData.adItem.adFileType,rules: [{required: true, message: '请选择广告类型！'}]}]">
          </a-select>
        </a-form-item>

        <a-form-item
          label="添加文件"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          class="upload-img"
        >
          <a-upload
            :action="system.uploadMainUrl"
            listType="picture"
            style="margin-left: 10px;display: inline-block;float: right;margin-top: 10px;"
            :showUploadList="false"
            :accept="fileType"
            :headers="clientHeader"
            :data="imgData"
            :beforeUpload="beforeFileUpload"
            @change="handleChange"
          >
            <a-input :read-only="true" v-model="fileName"/>
          </a-upload>
        </a-form-item>

        <a-form-item
          label="文件信息"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <div style="width: 150px;height: 150px;border: 1px solid #cccccc;overflow: hidden;display: inline-block;">
            <img v-if="!isVideo" :src="topImg" alt="" style="width: 100%;">
            <video v-if="isVideo" width="150" height="150" ref="videos" controls autoplay>
              <source :src="topImg" type="video/mp4">
            </video>

          </div>
        </a-form-item>

        <a-form-item
          label="是否启用"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="enable" @change="changeEnable" v-decorator="['enable']"/>
        </a-form-item>

        <a-form-item label="开始时间":labelCol="labelCol"
                     :wrapperCol="wrapperCol" :required="true">
          <a-date-picker @change="beginDateChange" v-if="startDate" :value="moment(startDate,'YYYY-MM-DD HH:mm:ss')" format="YYYY-MM-DD HH:mm:ss" showTime/>
          <a-date-picker @change="beginDateChange" v-if="!startDate" format="YYYY-MM-DD HH:mm:ss" showTime/>
        </a-form-item>

        <a-form-item label="结束时间":labelCol="labelCol"
                     :wrapperCol="wrapperCol" :required="true">
          <a-date-picker @change="endDateChange" v-if="endDate" :value="moment(endDate,'YYYY-MM-DD HH:mm:ss')" format="YYYY-MM-DD HH:mm:ss" showTime/>
          <a-date-picker @change="endDateChange" v-if="!endDate" format="YYYY-MM-DD HH:mm:ss" showTime/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  import {mapState} from 'vuex';
  import moment from 'moment';
  import md5 from 'md5'
  const SIGN = {
    clientId: 'admin',
    key: 'da74588912504563e464ffe8956de784'
  }
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
        imgData: {
          attOrigin:'ADMIN',
          attType:'AD'
        },
        title: '',
        topImg:'',
        timeLimit:true,
        startDate:'',
        endDate:'',
        headImageAttId:'',
        fileName:'',
        isVideo:false,
        fileType:'image/png,image/jpg,image/gif,video/mp4'
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    computed: {
      ...mapState(['constants', 'system'])
    },
    methods: {
      moment,
      add (item) {
        let that = this;
        this.visible = true
        this.form.resetFields()
        this.startDate = ''
        this.endDate = ''
        this.formData ={
          no:(new Date()).getTime(),
          adItem:{}
        }
        this.fileType = 'image/png,image/jpg,image/gif,video/mp4';
        this.fileName = '';
        this.headImageAttId = '';
        this.topImg = '';
        this.isVideo = false
        if(item){
          this.title = '修改'
          this.$api.ad.getById({id: item.id})
            .then(res => {
              if(res.adItem.adFileType === 'MP4'){
                this.isVideo = true
              }else{
                this.isVideo = false
              }
              this.formData = res
              this.formData.adItem = res.adItem
              this.startDate = res.beginDatetime
              this.endDate = res.endDatetime
              this.topImg = res.adItem.resourceFullAddress
              this.headImageAttId = res.adItem.attId
              this.fileName = res.adItem.origFilename
              this.enable = this.formData.enable;
              // this.$refs.videos.src = res.adItem.resourceFullAddress
            })
        }else{
          this.title = '新增'
          this.enable = true
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
              that.confirmLoading = false
              that.headImageAttId = info.file.response.data.id
              that.topImg = info.file.response.data.resourceFullAddress
              if(that.isVideo){
                that.$refs.videos.src =info.file.response.data.resourceFullAddress
              }
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

      beforeFileUpload(file) {
        this.confirmLoading = true
        this.fileName = file.name
        const timestamp = new Date().getTime() + ''
        const signature = SIGN.clientId + timestamp + SIGN.key
        this.clientHeader['X-timestamp'] = timestamp
        this.clientHeader['X-signature'] = md5(signature)
        if(file.type.split('/')[0] === 'video'){
          this.formData.adItem.adFileType = 'MP4'
          this.isVideo = true
          this.form.setFieldsValue({ adItem:{adFileType:'MP4'}});
        }else if(file.type.split('/')[0] === 'image'){
          this.isVideo = false
          if(file.type.split('/')[1] === 'gif'){
            this.formData.adItem.adFileType = 'GIF'
            this.form.setFieldsValue({ adItem:{adFileType:'GIF'}});
          }else{
            this.formData.adItem.adFileType = 'IMAGE'
            this.form.setFieldsValue({ adItem:{adFileType:'IMAGE'}});
            if (file.type.indexOf('image') !== -1) {
              const isLt1M = file.size / 1024 / 1024 < 100
              if (!isLt1M) {
                this.$message.error('图片最大为100MB!')
                this.confirmLoading = false
              }
              return isLt1M
            }
          }

        }

        return true
      },

      beginDateChange(date, dateString) {
        this.formData.beginDatetime = dateString;
        this.startDate = dateString
      },

      endDateChange(date, dateString) {
        this.formData.endDatetime = dateString;
        this.endDate = dateString
      },

      changeFileType(value,option){
        if(value === 'IMAGE' || value === 'GIF'){
          this.fileType = 'image/png,image/jpg,image/gif';
          this.isVideo = false
        }else if(value === 'MP4'){
          this.fileType = 'video/mp4';
          this.isVideo = true
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

            if (!values.enable) {
              values.enable = this.enable
            }

            if(this.formData.beginDatetime){
              values.beginDatetime = this.formData.beginDatetime
            }

            if(this.formData.endDatetime){
              values.endDatetime = this.formData.endDatetime
            }

            if (this.headImageAttId) {
              values.adItem.attId = this.headImageAttId
            }else{
              this.$notification.error({
                message: '提示',
                description: '请上传文件！'
              })
              this.confirmLoading = false
              return
            }
            this.$api.ad.saveOrUpdate(values)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description: this.title + '成功！'
                })
                this.visible = false
                this.confirmLoading = false
                this.form.resetFields()
                this.startDate = ''
                this.endDate = ''
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