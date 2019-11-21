<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.18
 * @desc 编辑
-->
<template>
  <a-modal
    :title="title"
    :width="1240"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-tabs @change="callback"  :activeKey='activeKey' type="editable-card" @edit="onEdit">
        <a-tab-pane tab="基本信息" ref="key1" key="1" :closable="false">
          <a-form :form="form">

            <a-row :gutter="24">
              <a-col :span="12">
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
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="设备位置"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-input @click="selectLocation" :read-only="true" v-decorator="['locationName', {initialValue: this.formData.locationName,rules: [{required: true, message: '请选择设备位置！'}]}]"/>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="24">
              <a-col :span="12">
                <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input
                    v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入名称！'}]}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input
                    v-decorator="['sn', {initialValue: this.formData.sn, rules: [{required: true,pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: '请输入为数字的序号！'}]}]"/>
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
                  <a-input v-decorator="['remark',{initialValue: this.formData.remark}]" />
                </a-form-item>
              </a-col>
              <a-col :span="12">

              </a-col>
            </a-row>

          </a-form>
        </a-tab-pane>

        <a-tab-pane tab="主机识别" ref="key2" key="2" :closable="false" class="init-sty">
          <a-form :form="form1">

            <a-card>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item label="人脸显示数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['mainEngine.id',{initialValue: this.formData.mainEngine.id}]" v-show="false"/>
                    <a-input
                      v-decorator="['mainEngine.faceShowNum', {initialValue: this.formData.mainEngine.faceShowNum, rules: [{required: true,pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: '请输入为数字的数量！'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="人脸显示时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['mainEngine.faceShowSeconds', {initialValue: this.formData.mainEngine.faceShowSeconds, rules: [{required: true,pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: '请输入为数字的时间！'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="认证对比" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select
                      size="default"
                      placeholder="请选择"
                      optionFilterProp="children"
                      v-decorator="['mainEngine.witnessComparison', {initialValue: this.formData.mainEngine.witnessComparison?'true':'false', rules: [{required: true, message: '请选择认证对比！'}]}]"
                    >
                      <a-select-option value="true">是</a-select-option>
                      <a-select-option value="false">否</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">

                <a-col :span="8">
                  <a-form-item label="访客注册" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select
                      size="default"
                      placeholder="请选择"
                      optionFilterProp="children"
                      v-decorator="['mainEngine.visitorRegister', {initialValue: this.formData.mainEngine.visitorRegister?'true':'false', rules: [{required: true, message: '请选择访客注册！'}]}]"
                    >
                      <a-select-option value="true">是</a-select-option>
                      <a-select-option value="false">否</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item label="有效分钟数" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['mainEngine.validMinutes', {initialValue: this.formData.mainEngine.validMinutes, rules: [{required: true, message: '请输入有效分钟数！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item
                    label="备注"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input v-decorator="['mainEngine.remark',{initialValue: this.formData.mainEngine.remark}]" />
                  </a-form-item>
                </a-col>

              </a-row>

              <a-row :gutter="24">

                <a-col :span="4" style="margin-bottom: 20px">
                  <a-button type="primary" @click="customAlgorithm">更多设置</a-button>
                </a-col>

              </a-row>
            </a-card>

            <!--门禁闸机-->
            <a-card>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item
                    label="网络开关类型"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input
                      v-decorator="['mainEngine.gateBrake.id',{initialValue: this.formData.mainEngine.gateBrake.id}]" v-show="false"/>
                    <a-select
                      showSearch
                      allowClear
                      placeholder="选择网络开关类型"
                      optionFilterProp="children"
                      :filterOption="filterCommonOption"
                      :options="constants.list.networkSwitchType"
                      v-decorator="['mainEngine.gateBrake.networkSwitchType', {initialValue: this.formData.mainEngine.gateBrake.networkSwitchType,rules: [{required: true, message: '请选择网络开关类型！'}]}]">
                    </a-select>
                  </a-form-item>

                </a-col>
                <a-col :span="8">
                  <a-form-item label="方向" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select
                      showSearch
                      allowClear
                      placeholder="选择方向"
                      optionFilterProp="children"
                      :filterOption="filterCommonOption"
                      :options="constants.list.direction"
                      v-decorator="['mainEngine.gateBrake.direction', {initialValue: this.formData.mainEngine.gateBrake.direction,rules: [{required: true, message: '请选择方向！'}]}]">
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="备注"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input v-decorator="['mainEngine.gateBrake.remark',{initialValue: this.formData.mainEngine.gateBrake.remark}]" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!--网络配置-->
            <a-card>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item
                    label="Ip地址"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input
                      v-decorator="['mainEngine.gateBrake.network.id',{initialValue: this.formData.mainEngine.gateBrake.network.id}]" v-show="false"/>
                    <a-input v-decorator="['mainEngine.gateBrake.network.ip',{initialValue: this.formData.mainEngine.gateBrake.network.ip,rules: [{required: true, message: '请选择Ip地址！'}]}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="子网掩码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['mainEngine.gateBrake.network.subnetMask', {initialValue: this.formData.mainEngine.gateBrake.network.subnetMask, rules: [{required: true, message: '请输入子网掩码！'}]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item
                    label="默认网关"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input v-decorator="['mainEngine.gateBrake.network.defaultGateway',{initialValue: this.formData.mainEngine.gateBrake.network.defaultGateway, rules: [{required: true, message: '请输入默认网关！'}]}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="MAC地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['mainEngine.gateBrake.network.macAddress', {initialValue: this.formData.mainEngine.gateBrake.network.macAddress, rules: [{required: true, message: '请输入MAC地址！'}]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
          </a-form>
        </a-tab-pane>

        <a-tab-pane v-for="pane in panes" :tab="pane.title" :key="pane.key" :closable="pane.closable">
          <a-form :form="form">

            <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['name1', {initialValue: pane.name1,rules: [{required: true, message: '请输入名称！'}]}]"/>
            </a-form-item>

            <a-form-item label="序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['sn1', {initialValue: pane.sn1,rules: [{required: true,pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: '请输入为数字的序号！'}]}]"/>
            </a-form-item>

            <a-form-item
              label="备注"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['remark',{initialValue: pane.remark}]" />
            </a-form-item>

          </a-form>
        </a-tab-pane>

      </a-tabs>

    </a-spin>
    <template v-if="activeKey == 1" slot="footer">
      <a-button key="submit" type="primary" :confirmLoading="confirmLoading" @click="next('2')">
        下一步
      </a-button>
    </template>
    <template  v-if="activeKey != 1" slot="footer">
      <a-button key="back" @cancel="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :confirmLoading="confirmLoading" @click="handleSubmit">
        确认
      </a-button>
    </template>
    <select-location ref="selectLocation" @selectSuccess="selectSuccess"></select-location>
    <custom-algorithm ref="customAlgorithm" @customSuccess="customSuccess"></custom-algorithm>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  import {mapState} from 'vuex';
  import SelectLocation from '@/components/Common/SelectLocation'
  import customAlgorithm from './customAlgorithm'
  export default {
    mixins:[mixin],
    components: {
      SelectLocation,
      customAlgorithm
    },
    data () {
      return {
        goodsGroups:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        visible: false,
        confirmLoading: false,
        formData: {
          cameras:[],
          mainEngine:{
            gateBrake:{
              network:{}
            }
          }
        },
        deviceModelList:[],
        locationList: [],
        title: '',
        panes:[
          { title: '相机', content: 'Content of Tab 1', key: '3',remark:'1111',closable: false },
        ],
        activeKey: '1',
        newTabIndex: 4,
      }
    },
    computed: {
      ...mapState(['constants']),
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
      this.form1 = this.$form.createForm(this);
    },
    methods: {
      addEdit (item) {
        let that = this;
        this.visible = true
        this.activeKey = '1';
        this.form.resetFields()
        this.form1.resetFields()
        this.formData ={
          cameras:[],
          mainEngine:{
            gateBrake:{
              network:{}
            }
          }
        }
        this.deviceModelList = []
        this.locationList = []
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
          this.$api.device.getById({id: item.id})
            .then(res => {
              this.formData = res
            })
        }else{
          this.title = '新增'
        }
      },

      callback(key) {
        if (key == 1) {
          this.activeKey = '1';
        } else {
          this.next(key);
        }
      },
      next(key) {
        var that = this;
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            that.activeKey = key+'';
            this.formData = Object.assign(this.formData,values)
            console.log(this.formData)
          }
        })
      },

      selectLocation() {
        this.$refs.selectLocation.add()
      },

      customAlgorithm(){
        this.$refs.customAlgorithm.add(this.formData.mainEngine)
      },

      handleSubmit () {
        console.log(this.formData)
        const { form1: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {

          if (!errors) {
            values.mainEngine.algorithm = this.formData.mainEngine.algorithm
            values.mainEngine.gateBrake.networkSwitchType = values.mainEngine.gateBrake.networkSwitchType+''
            if(values.mainEngine.witnessComparison == 'true'){
              values.mainEngine.witnessComparison = true
            }else{
              values.mainEngine.witnessComparison = false
            }

            if(values.mainEngine.visitorRegister == 'true'){
              values.mainEngine.visitorRegister = true
            }else{
              values.mainEngine.visitorRegister = false
            }
            console.log(this.formData,values)
            let params = Object.assign(this.formData,values)

            console.log('---params---',params)
            this.$api.device.saveOrUpdate(params)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description: this.title + '成功！'
                })
                this.visible = false
                this.confirmLoading = false
                this.form.resetFields()
                this.form1.resetFields()
                this.$emit('ok', params)
              }).finally(() => {
              this.confirmLoading = false
            })
          } else {
            this.confirmLoading = false
          }
        })
      },
      onEdit(targetKey, action) {
        this[action](targetKey);
      },

      add() {
        const panes = this.panes;
        const activeKey = `${this.newTabIndex++}`;
        panes.push({
          title: `相机 ${activeKey-3}`,
          content: `Content of new Tab ${activeKey}`,
          remark:'1111',
          key: activeKey,
        });
        this.panes = panes;
        this.activeKey = activeKey;
      },

      selectSuccess(value){
        let name = value[0].estateName+'-'+value[0].buildingName+'-'+value[0].unitName+'-'+value[0].storeyName+'-'+value[0].roomName+'-'+value[0].name
        this.formData.locationName = name
        this.formData.locationId = value[0].id
        this.form.setFieldsValue({ locationName: name});
      },

      customSuccess(value){
        if(value.algorithm.checkAlive == 'true'){
          value.algorithm.checkAlive = true
        }else{
          value.algorithm.checkAlive = false
        }

        if(value.algorithm.checkSexual == 'true'){
          value.algorithm.checkSexual = true
        }else{
          value.algorithm.checkSexual = false
        }
        this.formData.mainEngine.algorithm = value.algorithm
        console.log('--customSuccess--',this.formData)
      },

      remove(targetKey) {
        let activeKey = this.activeKey;
        let lastIndex;
        this.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const panes = this.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key;
          } else {
            activeKey = panes[0].key;
          }
        }
        this.panes = panes;
        this.activeKey = activeKey;
      },
    }
  }
</script>
<style >

  .init-sty .ant-card-wider-padding .ant-card-body{
      padding: 24px 32px 0;
    }
  .init-sty .ant-card.ant-card-bordered{
    margin-bottom: 20px;
  }

</style>