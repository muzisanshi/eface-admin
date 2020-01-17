<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.21
 * @desc 编辑
-->
<template>
  <a-modal
    :title="title"
    :width="1040"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" class="form-group">
        <a-row :gutter="24" >
          <a-col :span="12">
            <a-form-item
              style="width: 300px;"
              label="名称" :labelCol="labelCo1" :wrapperCol="wrapperCo1"
            >
              <a-input :maxLength="64"
                v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入名称！'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              style="width: 300px;"
              label="备注" :labelCol="labelCo1" :wrapperCol="wrapperCo1"
            >
              <a-input :maxLength="255"
                v-decorator="['remark', {initialValue: this.formData.remark}]"/>
            </a-form-item>

          </a-col>
        </a-row>
        <a-row :gutter="24" >
          <a-col :span="12">
            <p>识别阀值，范围【0-100】，超过阀值则识别成功</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input :maxLength="9"
                v-decorator="['algorithm.recThreshold', {initialValue: this.formData.algorithm.recThreshold, rules: [{required: true,pattern: new RegExp(this.REG_EXPS.POSITIVE_INTEGER, 'g'), message: '请输入0-100的阀值！'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <p>最小人脸检测尺寸，范围【20 inf】，越小精度越低</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input :maxLength="9"
                v-decorator="['algorithm.minFaceCheckSize', {initialValue: this.formData.algorithm.minFaceCheckSize, rules: [{required: true,pattern: new RegExp(this.REG_EXPS.POSITIVE_INTEGER, 'g'), message: '请输入检测尺寸！'}]}]"/>
            </a-form-item>

          </a-col>
        </a-row>

        <a-row :gutter="24" >
          <a-col :span="12">
            <p>视频输出尺寸，范围【100 inf】，越大越消耗时间</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input :maxLength="9"
                v-decorator="['algorithm.videoOutputSize', {initialValue: this.formData.algorithm.videoOutputSize, rules: [{required: true,pattern: new RegExp(this.REG_EXPS.POSITIVE_INTEGER, 'g'), message: '请输入输出尺寸！'}]}]"/>
            </a-form-item>

          </a-col>
          <a-col :span="12">
            <p>陌生人超时警告时间，范围【0 inf】，单位/秒</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input :maxLength="9"
                v-decorator="['algorithm.strangerTimeoutWarnSeconds', {initialValue: this.formData.algorithm.strangerTimeoutWarnSeconds, rules: [{required: true, message: '请输入警告时间！'}]}]"/>
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
                v-decorator="['algorithm.checkAlive', {initialValue: this.formData.algorithm.checkAlive?'true':'false', rules: [{required: true, message: '请选择活体检测！'}]}]"
              >
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
              </a-select>
            </a-form-item>


          </a-col>
          <a-col :span="12">
            <p>性别年龄检测（开启后影响速度）</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-select
                size="default"
                placeholder="请选择"
                style="width: 300px"
                optionFilterProp="children"
                v-decorator="['algorithm.checkSexualAge', {initialValue: this.formData.algorithm.checkSexualAge?'true':'false', rules: [{required: true, message: '请选择性别检测！'}]}]"
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
              <a-input :maxLength="9"
                v-decorator="['algorithm.showLevel',
            {initialValue: this.formData.algorithm.showLevel, rules: [{required: true, message: '请输入提示信息！'}]}]"/>
            </a-form-item>

          </a-col>
          <a-col :span="12">
            <p>同时识别最大人数</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input :maxLength="9"
                v-decorator="['algorithm.recNum',
            {initialValue: this.formData.algorithm.recNum, rules: [{required: true, message: '请输入人数！'}]}]"/>
            </a-form-item>

          </a-col>
        </a-row>

        <a-row :gutter="24" >
          <a-col :span="12">
            <p>视频旋转角度，支持0|90|-90|180 四种角度</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input :maxLength="9"
                v-decorator="['algorithm.videoRotate',
            {initialValue: this.formData.algorithm.videoRotate, rules: [{required: true, message: '请输入旋转角度！'}]}]"/>
            </a-form-item>


          </a-col>
          <a-col :span="12">
            <p>视频翻转，1：水平翻转，-1：垂直翻转</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input :maxLength="9"
                v-decorator="['algorithm.videoFlip',
            {initialValue: this.formData.algorithm.videoFlip, rules: [{required: true, message: '请输入视频镜像！'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24" >
          <a-col :span="12">
            <p>抓拍等级，0:正脸，1:正脸+侧脸，2 :正脸+侧脸+遮挡，3:全部输出</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input :maxLength="9"
                v-decorator="['algorithm.captureLevel',
            {initialValue: this.formData.algorithm.captureLevel, rules: [{required: true, message: '请输入抓拍等级！'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <p>显卡序号</p>
            <a-form-item
              style="width: 300px;"
            >
              <a-input :maxLength="9"
                v-decorator="['algorithm.graphicCardIndexNum',
            {initialValue: this.formData.algorithm.graphicCardIndexNum, rules: [{required: true, message: '请输入显卡序号！'}]}]"/>
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
                    <a-input :maxLength="9"
                      v-decorator="['algorithm.roiX1', {initialValue: this.formData.algorithm.roiX1, rules: [{required: true, message: '请输入X1！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item label="X2" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="9"
                      v-decorator="['algorithm.roiX2', {initialValue: this.formData.algorithm.roiX2, rules: [{required: true, message: '请输入X2！'}]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="Y1" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="9"
                      v-decorator="['algorithm.roiY1', {initialValue: this.formData.algorithm.roiY1, rules: [{required: true, message: '请输入Y1！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item label="Y2" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="9"
                      v-decorator="['algorithm.roiY2', {initialValue: this.formData.algorithm.roiY2, rules: [{required: true, message: '请输入Y2！'}]}]"/>
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
                    <a-input :maxLength="9"
                      v-decorator="['algorithm.strangerR', {initialValue: this.formData.algorithm.strangerR, rules: [{required: true, message: '请输入R！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item label="G" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="9"
                      v-decorator="['algorithm.strangerG', {initialValue: this.formData.algorithm.strangerG, rules: [{required: true, message: '请输入G！'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="B" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="9"
                      v-decorator="['algorithm.strangerB', {initialValue: this.formData.algorithm.strangerB, rules: [{required: true, message: '请输入B！'}]}]"/>
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
  import {mapState} from 'vuex';
  export default {
    mixins:[mixin],
    data () {
      return {
        goodsGroups:[],
        labelCo1: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCo1: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 10 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
        visible: false,
        confirmLoading: false,
        formData: {
          algorithm:{
            captureLevel:2,
            checkAlive:true,
            checkSexualAge:true,
            graphicCardIndexNum:0,
            id:"",
            cloneId:'',
            minFaceCheckSize:50,
            recNum:10,
            recThreshold:50,
            roiX1:0,
            roiX2:1,
            roiY1:0,
            roiY2:1,
            showLevel:63,
            strangerB:0,
            strangerG:0,
            strangerR:255,
            strangerTimeoutWarnSeconds:3,
            videoFlip:0,
            videoOutputSize:1280,
            videoRotate:0,
          }
        },
        deviceFactoryList:[],
        title: '',
      }
    },
    computed: {
      ...mapState(['constants']),
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    methods: {
      add (item) {
        let that = this;
        this.visible = true
        this.form.resetFields()
        this.formData ={
          algorithm:{
            captureLevel:2,
            checkAlive:true,
            checkSexualAge:true,
            graphicCardIndexNum:0,
            id:"",
            cloneId:'',
            minFaceCheckSize:50,
            recNum:10,
            recThreshold:50,
            roiX1:0,
            roiX2:1,
            roiY1:0,
            roiY2:1,
            showLevel:63,
            strangerB:0,
            strangerG:0,
            strangerR:255,
            strangerTimeoutWarnSeconds:3,
            videoFlip:0,
            videoOutputSize:1280,
            videoRotate:0,
          }
        }

        if(item){
          this.title = '修改'
          this.$api.algorithmUsuallyRule.getById({id: item.id})
            .then(res => {
              this.formData = res
            })
        }else{
          this.title = '新增'
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
            if(this.formData.algorithm.id){
              values.algorithm.id = this.formData.algorithm.id;
            }
            this.$api.algorithmUsuallyRule.saveOrUpdate(values)
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