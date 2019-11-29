<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.27
 * @desc 编辑
-->
<template>
  <a-modal
    :title="title"
    :width="940"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <p>基本信息</p>
        <a-card class="init-sty">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item
                label="头像"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <div style="width: 60px;height: 60px;border: 1px solid #cccccc;overflow: hidden;display: inline-block;border-radius: 50%">
                  <img :src="topImg" alt="" style="width: 100%;">
                </div>
                <a-upload
                  :action="system.uploadMainUrl"
                  listType="picture"
                  style="margin-left: 10px;display: inline-block;float: right;margin-top: 10px;"
                  :showUploadList="false"
                  accept="image/*"
                  :beforeUpload="beforeUpload"
                  @change="handleChange"
                >
                  <a-button>
                    <a-icon type="upload"/>浏览添加
                  </a-button>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="电话号码" :labelCol="labelCol" :wrapperCol="wrapperCol" class="national-code">
                <a-input v-decorator="['phoneNo', {initialValue: this.formData.phoneNo, rules: [{required: true, message: '请输入电话号码！'}]}]">
                  <a-select
                    showSearch
                    allowClear
                    slot="addonBefore"
                    placeholder="选择区号"
                    optionFilterProp="children"
                    :filterOption="filterCommonOption"
                    :options="nationalAreaCodeList"
                    v-decorator="['nationalAreaCodeId', {initialValue: this.formData.nationalAreaCodeId}]">
                  </a-select>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input
                  v-decorator="['realName', {initialValue: this.formData.realName, rules: [{required: true, message: '请输入姓名！'}]}]"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <p>人脸信息</p>
        <a-card class="init-sty">
          <a-button type="primary" icon="plus" @click="uploadFace">上传人脸</a-button>
        </a-card>

        <p>闸机信息信息</p>
        <a-card class="init-sty">

          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item
                label="关系"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-select
                  showSearch
                  placeholder="选择关系"
                  optionFilterProp="children"
                  :filterOption="filterCommonOption"
                  :options="dictValueList"
                  v-decorator="['userEstate.relationship', {initialValue: this.formData.userEstate.relationship, rules: [{required: true, message: '请选择关系！'}]}]"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="请选择社区"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input @click="selectRoom()" :read-only="true" v-decorator="['roomName', {initialValue: this.formData.gateBrakeLimit.roomName, rules: [{required: true, message: '请选择社区！'}]}]"/>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="开始时间":labelCol="labelCol"
                           :wrapperCol="wrapperCol" :required="true">
                <a-date-picker @change="beginDateChange" v-if="startDate" :value="moment(startDate,'YYYY-MM-DD HH:mm:ss')" format="YYYY-MM-DD HH:mm:ss" showTime/>
                <a-date-picker @change="beginDateChange" v-if="!startDate" format="YYYY-MM-DD HH:mm:ss" showTime/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="结束时间":labelCol="labelCol"
                           :wrapperCol="wrapperCol" :required="true">
                <a-date-picker @change="endDateChange" v-if="endDate" :value="moment(endDate,'YYYY-MM-DD HH:mm:ss')" format="YYYY-MM-DD HH:mm:ss" showTime/>
                <a-date-picker @change="endDateChange" v-if="!endDate" format="YYYY-MM-DD HH:mm:ss" showTime/>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item
                label="备注"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-input
                  v-decorator="['userEstate.id',{initialValue: this.formData.userEstate.id}]" v-show="false"/>
                <a-input v-decorator="['gateBrakeLimit.remark',{initialValue: this.formData.gateBrakeLimit.remark}]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="是否启用"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-switch :checked="enable" @change="changeEnable" v-decorator="['enable']"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

      </a-form>
    </a-spin>
    <select-data-Con ref="selectSuccess" @selectSuccess="selectSuccess"></select-data-Con>
    <select-room ref="selectRoom" @selectRoom="selectRoomSuccess"></select-room>
    <upload-face ref="uploadFace" @uploadFace="uploadFaceSuccess"></upload-face>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  import {mapState} from 'vuex';
  import {ImageUpload} from '@/components'
  import selectDataCon from '@/components/Common/selectDataCon'
  import selectRoom from '@/components/Common/selectRoom'
  import uploadFace from './uploadImg'
  import moment from 'moment';
  export default {
    mixins:[mixin],
    data () {
      return {
        goodsGroups:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        visible: false,
        confirmLoading: false,
        formData: {
          userEstate:{
            id:''
          },
          gateBrakeLimit:{}
        },
        title: '',
        topImg: '',
        dictValueList:[],
        defaultSelect:true,
        relieve:true,
        nationalAreaCodeList:[],
        startDate:'',
        endDate:'',
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        userType:''
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    components: {
      ImageUpload,selectDataCon,selectRoom,uploadFace
    },
    computed: {
      ...mapState(['constants', 'system'])
    },
    methods: {
      moment,

      uploadFace(){
        this.$refs.uploadFace.add()
      },

      uploadFaceSuccess(){

      },

      add (item,userType) {
        let that = this;
        this.visible = true
        this.form.resetFields()
        this.formData ={
          userEstate:{
            id:''
          },
          gateBrakeLimit:{},
          nationalAreaCodeId:''
        }
        this.userType = userType
        this.startDate = '';
        this.endDate = '';
        this.headImageAttId = null;
        this.topImg = null;
        this.$api.dictType.getAll({})
          .then(res => {
            for (let i = 0, j = res.length; i < j; i++) {
              if(res[i].name==='关系'){
                that.$api.dictValue.getPage({
                  page: {
                    pageNumber: 1,
                    pageSize: 10
                  },
                  dictTypeId:res[i].id
                })
                  .then(resValue => {
                    const l = []
                    for (let j = 0;j<resValue.records.length; j++) {
                      l.push({
                        value: resValue.records[j].value,
                        label: resValue.records[j].name
                      })
                    }
                    that.dictValueList = l
                  })
              }
            }
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
            if(item){
              this.title = '修改'
              this.$api.user.getById({
                id: item.id,
                code:userType
              })
                .then(res => {
                  this.formData = res
                  this.formData.userEstate = res.userEstates[0]
                  this.formData.gateBrakeLimit = res.gateBrakeLimits[0]
                  this.defaultSelect = this.formData.userEstate.defaultSelect;
                  this.relieve = this.formData.userEstate.relieve;
                  this.enable = this.formData.gateBrakeLimit.enable;
                  that.topImg = res.resourceFullAddress;
                  that.headImageAttId = res.attId;
                  this.formData.estateName = this.formData.userEstate.estateName;
                  if(this.formData.gateBrakeLimit.roomName){
                    this.formData.gateBrakeLimit.roomName = this.formData.gateBrakeLimit.estateName+'-'+this.formData.gateBrakeLimit.buildingName+'-'+this.formData.gateBrakeLimit.unitName+'-'+this.formData.gateBrakeLimit.storeyName+'-'+this.formData.gateBrakeLimit.roomName
                  }else{
                    if(this.formData.gateBrakeLimit.storeyName){
                      this.formData.gateBrakeLimit.roomName = this.formData.gateBrakeLimit.estateName+'-'+this.formData.gateBrakeLimit.buildingName+'-'+this.formData.gateBrakeLimit.unitName+'-'+this.formData.gateBrakeLimit.storeyName
                    }else{
                      this.formData.gateBrakeLimit.roomName = this.formData.gateBrakeLimit.estateName+'-'+this.formData.gateBrakeLimit.buildingName+'-'+this.formData.gateBrakeLimit.unitName
                    }
                  }
                    this.startDate = this.formData.gateBrakeLimit.beginDatetime
                    this.endDate = this.formData.gateBrakeLimit.endDatetime
                })
            }else{
              this.title = '新增'
              this.defaultSelect = true
              this.relieve = true
              this.enable = true
              this.formData.gateBrakeLimit.beginDatetime = ''
              this.formData.gateBrakeLimit.endDatetime = ''
              this.formData.nationalAreaCodeId=this.nationalAreaCodeList[0].value
            }
          })
      },

      onUploadSuccess(id) {
        this.uploadFileId = id
      },

      selectRoom(){
        this.$refs.selectRoom.add(null)
      },

      selectRoomSuccess(value){
        this.formData.gateBrakeLimit = Object.assign(this.formData.gateBrakeLimit,value)
        this.form.setFieldsValue({ roomName: value.roomName});
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

      beforeUpload(file) {
        this.data.title = file.name
        return true
      },

      beginDateChange(date, dateString) {
        this.formData.gateBrakeLimit.beginDatetime = dateString;
      },

      endDateChange(date, dateString) {
        this.formData.gateBrakeLimit.endDatetime = dateString;
      },

      selectSuccess(value){
        this.formData.estateName = value.name
        this.formData.userEstate.estateId = value.value
        this.form.setFieldsValue({ estateName: value.name});
      },

      changeDefaultSelect(checked) {
        this.defaultSelect = checked
      },

      changeRelieve(checked) {
        this.relieve = checked
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        // this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if(this.formData.id){
              values.id = this.formData.id
            }
            if(this.formData.userEstate.estateId){
              values.userEstate.estateId = this.formData.userEstate.estateId
            }
            if (!values.defaultSelect) {
              values.userEstate.defaultSelect = this.defaultSelect
            }

            if (!values.relieve) {
              values.userEstate.relieve = this.relieve
            }

            if (!values.enable) {
              values.gateBrakeLimit.enable = this.enable
            }

            if(!this.formData.gateBrakeLimit.beginDatetime){
              this.$notification.error({
                message: '提示',
                description: '请选择开始时间'
              })
              return
            }
            if(!this.formData.gateBrakeLimit.endDatetime){
              this.$notification.error({
                message: '提示',
                description: '请选择结束时间'
              })
              return
            }
            values.gateBrakeLimit = Object.assign(this.formData.gateBrakeLimit,values.gateBrakeLimit)
            values.userEstate.code=this.userType

            this.$api.user.saveOrUpdate(values)
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
<style>

  .init-sty .ant-card-body{
    padding: 24px 32px 0;
  }
  .init-sty.ant-card.ant-card-bordered{
    margin-bottom: 20px;
  }

</style>