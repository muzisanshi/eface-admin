<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.20
 * @desc 自定义算法
-->
<template>
  <a-modal
    title="自定义算法"
    :width="1040"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="form-group">
        <a-row :gutter="24" v-if="initAlgList.length>0">
          <a-col :span="12">
            <a-form-item
              label="算法常用规则表"
              :labelCol="labelCo1"
              :wrapperCol="wrapperCo1"
            >
              <a-select
                showSearch
                placeholder="选择默认算法"
                optionFilterProp="children"
                :filterOption="filterCommonOption"
                :options="initAlgList"
                v-decorator="['deviceModelId', {initialValue: this.formData.deviceModelId}]"
              >
              </a-select>

            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24" >
          <a-col :span="12">
            <p>识别阀值，范围【0-100】，超过阀值则识别成功</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input
                v-decorator="['recThreshold', {initialValue: this.formData.recThreshold, rules: [{required: true,pattern: new RegExp(/^[0-9]\d*$/, 'g'), message: '请输入0-100的阀值！'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <p>最小人脸检测尺寸，范围【20 inf】，越小精度越低</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input
                v-decorator="['minFaceCheckSize', {initialValue: this.formData.minFaceCheckSize, rules: [{required: true,pattern: new RegExp(/^[0-9]\d*$/, 'g'), message: '请输入检测尺寸！'}]}]"/>
            </a-form-item>

          </a-col>
        </a-row>

        <a-row :gutter="24" >
          <a-col :span="12">
            <p>视频输出尺寸，范围【100 inf】，越大越消耗时间</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input
                v-decorator="['videoOutputSize', {initialValue: this.formData.videoOutputSize, rules: [{required: true,pattern: new RegExp(/^[0-9]\d*$/, 'g'), message: '请输入输出尺寸！'}]}]"/>
            </a-form-item>

          </a-col>
          <a-col :span="12">
            <p>陌生人超时警告时间，范围【0 inf】，单位/秒</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input
                v-decorator="['strangerTimeoutWarnSeconds', {initialValue: this.formData.strangerTimeoutWarnSeconds, rules: [{required: true, message: '请输入警告时间！'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24" >
          <a-col :span="12">
            <p>活体检测（针对USB摄像头生效）</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-select
                size="default"
                placeholder="请选择"
                style="width: 300px"
                optionFilterProp="children"
                v-decorator="['checkAlive', {initialValue: this.formData.checkAlive, rules: [{required: true, message: '请选择活体检测！'}]}]"
              >
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
              </a-select>
            </a-form-item>


          </a-col>
          <a-col :span="12">
            <p>性别检测（开启后影响速度）</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-select
                size="default"
                placeholder="请选择"
                style="width: 300px"
                optionFilterProp="children"
                v-decorator="['checkSexual', {initialValue: this.formData.checkSexual, rules: [{required: true, message: '请选择性别检测！'}]}]"
              >
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24" >
          <a-col :span="12">
            <p>1\2\4\8\16\32 分别表示ROI框\人脸框\名字相似度\跟踪号\性别，可组合</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input
                v-decorator="['showLevel',
            {initialValue: this.formData.showLevel, rules: [{required: true, message: '请输入提示信息！'}]}]"/>
            </a-form-item>

          </a-col>
          <a-col :span="12">
            <p>同时识别最大人数</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input
                v-decorator="['recNum',
            {initialValue: this.formData.recNum, rules: [{required: true, message: '请输入人数！'}]}]"/>
            </a-form-item>

          </a-col>
        </a-row>

        <a-row :gutter="24" >
          <a-col :span="12">
            <p>视频旋转角度，支持0|90|-90|180 四种角度</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input
                v-decorator="['videoRotate',
            {initialValue: this.formData.videoRotate, rules: [{required: true, message: '请输入旋转角度！'}]}]"/>
            </a-form-item>


          </a-col>
          <a-col :span="12">
            <p>视频镜像，1：水平翻转，-1：垂直翻转</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input
                v-decorator="['videoImage',
            {initialValue: this.formData.videoImage, rules: [{required: true, message: '请输入视频镜像！'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24" >
          <a-col :span="12">
            <p>抓拍等级，0:正脸，1:正脸+侧脸，2 :正脸+侧脸+遮挡，3:全部输出</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input
                v-decorator="['captureLevel',
            {initialValue: this.formData.captureLevel, rules: [{required: true, message: '请输入抓拍等级！'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <p>显卡序号</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input
                v-decorator="['graphicCardIndexNum',
            {initialValue: this.formData.graphicCardIndexNum, rules: [{required: true, message: '请输入显卡序号！'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24" >
          <a-col :span="12">
            <p>ROI识别区域（左，右，上，下），取值范围【0 1】</p>
            <div style="width: 300px;">
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="X1" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['roiX1', {initialValue: this.formData.roiX1, rules: [{required: true, message: '请输入X1！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item label="X2" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['roiX2', {initialValue: this.formData.roiX2, rules: [{required: true, message: '请输入X2！'}]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="Y1" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['roiY1', {initialValue: this.formData.roiY1, rules: [{required: true, message: '请输入Y1！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item label="Y2" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['roiY2', {initialValue: this.formData.roiY2, rules: [{required: true, message: '请输入Y2！'}]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>

            </div>
          </a-col>
          <a-col :span="12">
            <p style="">陌生人显示颜色，值范围【0 255】</p>
            <div style="width: 300px;">
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item label="R" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['strangerR', {initialValue: this.formData.strangerR, rules: [{required: true, message: '请输入R！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item label="G" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['strangerG', {initialValue: this.formData.strangerG, rules: [{required: true, message: '请输入G！'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="B" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['strangerB', {initialValue: this.formData.strangerB, rules: [{required: true, message: '请输入B！'}]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>

            </div>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'

  export default {
    mixins:[mixin],
    data () {
      return {
        goodsGroups:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 10 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
        labelCol1: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol1: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
        labelCo1: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCo1: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        visible: false,
        confirmLoading: false,
        formData: {
          recThreshold:0,
          minFaceCheckSize:0,
          videoOutputSize:0,
          strangerTimeoutWarnSeconds:0,
          checkAlive:'',
          checkSexual:'',
          showLevel:1,
          recNum:0,
          videoRotate:0,
          videoImage:1,
          captureLevel:0,
          graphicCardIndexNum:0,
          roiX1:0,
          roiX2:0,
          roiY1:0,
          roiY2:0,
          strangerR:0,
          strangerG:0,
          strangerB:0
        },
        title: '',
        initAlgList:[]
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    methods: {
      add (item) {
        this.visible = true
        this.form.resetFields()
        this.formData ={
          recThreshold:0,
          minFaceCheckSize:0,
          videoOutputSize:0,
          strangerTimeoutWarnSeconds:0,
          checkAlive:'',
          checkSexual:'',
          showLevel:1,
          recNum:0,
          videoRotate:0,
          videoImage:1,
          captureLevel:0,
          graphicCardIndexNum:0,
          roiX1:0,
          roiX2:0,
          roiY1:0,
          roiY2:0,
          strangerR:0,
          strangerG:0,
          strangerB:0
        }
        this.$api.algorithmUsuallyRule.getAll()
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name
              })
            }
            this.initAlgList = l
          })
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        // this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if(this.formData.id){
              values.id = this.formData.id
            }
            let params = {
              algorithm:values
            }
            this.$api.algorithmUsuallyRule.saveOrUpdate(params)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description: this.title + '成功！'
                })
                // this.visible = false
                // this.confirmLoading = false
                // this.form.resetFields()
                // this.$emit('ok', values)
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
  .form-group p{
    margin-bottom: 5px;
  }
  .form-group .ant-form-item{
    margin-bottom: 15px;
  }
  .clearfix:after{
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
  }
  .clearfix{
    *zoom: 1;
  }
</style>