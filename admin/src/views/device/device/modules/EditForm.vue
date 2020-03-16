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
    :maskClosable="false" :keyboard="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div style="position: absolute;right: 0; top: 0;z-index: 10">
        <a-button @click="add">添加相机</a-button>

        <a-button @click="addTemCheck" style="margin-left: 10px" v-if="!isTemCheck">添加体温检测</a-button>

      </div>

      </div>

      <a-tabs hideAdd @change="callback" :activeKey='activeKey' type="editable-card" @edit="onEdit">
        <a-tab-pane tab="基本信息" ref="key1" key="1" :closable="false">
          <a-form :form="form">

            <a-row :gutter="24">
              <a-col :span="8">
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
              <a-col :span="8">
                <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :maxLength="32"
                    v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入名称！'}]}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="SN" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input :maxLength="64"
                    v-decorator="['sn', {initialValue: this.formData.sn, rules: [{required: true, message: '请输入SN！'}]}]"/>
                </a-form-item>
              </a-col>

            </a-row>

            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item
                  label="设备位置"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-input @click="selectLocation('','')" :read-only="true" v-decorator="['locationName', {initialValue: this.formData.locationName,rules: [{required: true, message: '请选择设备位置！'}]}]"/>
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item
                  label="备注"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-input :maxLength="255" v-decorator="['remark',{initialValue: this.formData.remark}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  label="是否启用"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                >
                  <a-switch :checked="enable" @change="changeEnable" v-decorator="['enable']"/>
                </a-form-item>
              </a-col>
            </a-row>

          </a-form>
        </a-tab-pane>

        <a-tab-pane tab="识别主机" ref="key2" key="2" :closable="false" class="init-sty">
          <a-form :form="form1">
            <a-input
              v-decorator="['mainEngine.id',{initialValue: this.formData.mainEngine.id}]" v-show="false"/>
            <a-card>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item label="人脸显示数量" :labelCol="labelCol" :wrapperCol="wrapperCol">

                    <a-input :maxLength="9"
                      v-decorator="['mainEngine.faceShowNum', {initialValue: this.formData.mainEngine.faceShowNum, rules: [{required: true,pattern: new RegExp(this.REG_EXPS.PLUS_INTEGER, 'g'), message: '请输入有效的数量！'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="人脸显示时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="9"
                      v-decorator="['mainEngine.faceShowSeconds', {initialValue: this.formData.mainEngine.faceShowSeconds, rules: [{required: true,pattern: new RegExp(this.REG_EXPS.PLUS_INTEGER, 'g'), message: '请输入有效的时间！'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="人证对比" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select
                      size="default"
                      placeholder="请选择"
                      optionFilterProp="children"
                      v-decorator="['mainEngine.witnessComparison', {initialValue: this.formData.mainEngine.witnessComparison?'true':'false', rules: [{required: true, message: '请选择人证对比！'}]}]"
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
                    <a-input :maxLength="9"
                      v-decorator="['mainEngine.validMinutes', {initialValue: this.formData.mainEngine.validMinutes, rules: [{required: true,pattern: new RegExp(this.REG_EXPS.JUST_NUMBER, 'g'), message: '请输入有效的分钟数！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item
                    label="备注"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input :maxLength="255" v-decorator="['mainEngine.remark',{initialValue: this.formData.mainEngine.remark}]" />
                  </a-form-item>
                </a-col>

              </a-row>

              <a-row :gutter="24">
                <a-col :span="8">
                  <a-input
                    v-decorator="['mainEngine.network.id',{initialValue: this.formData.mainEngine.network?this.formData.mainEngine.network.id:''}]" v-show="false"/>
                  <a-form-item
                    label="IP地址"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input :maxLength="32" v-decorator="['mainEngine.network.ip',{initialValue: this.formData.mainEngine.network?this.formData.mainEngine.network.ip:'', rules: [{pattern: new RegExp(this.REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的IP地址！'}]}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="子网掩码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="32"
                      v-decorator="['mainEngine.network.subnetMask', {initialValue: this.formData.mainEngine.network?this.formData.mainEngine.network.subnetMask:'', rules: [{pattern: new RegExp(this.REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的子网掩码！'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="默认网关"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input :maxLength="32" v-decorator="['mainEngine.network.defaultGateway',{initialValue: this.formData.mainEngine.network?this.formData.mainEngine.network.defaultGateway:'', rules: [{pattern: new RegExp(this.REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的默认网关！'}]}]" />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item label="MAC地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="32"
                      v-decorator="['mainEngine.network.macAddress', {initialValue: this.formData.mainEngine.network?this.formData.mainEngine.network.macAddress:'', rules: [{pattern: new RegExp(this.REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的MAC地址！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item label="端口" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="9"
                      v-decorator="['mainEngine.network.port', {initialValue: this.formData.mainEngine.network?this.formData.mainEngine.network.port:'',rules: [{pattern: new RegExp(this.REG_EXPS.PLUS_INTEGER, 'g'), message: '请输入有效的端口！'}]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
          </a-form>
        </a-tab-pane>

        <a-tab-pane v-for="(pane,index) in panes" :tab="pane.title" :key="pane.key" class="init-sty">
          <a-form :form="pane.form">

            <a-card>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item
                    label="相机类型"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input
                      v-decorator="['id',{initialValue: pane.content.id?pane.content.id:''}]" v-show="false"/>
                    <a-select
                      showSearch
                      allowClear
                      placeholder="选择相机类型"
                      optionFilterProp="children"
                      :filterOption="filterCommonOption"
                      :options="constants.list.cameraType"
                      v-decorator="['cameraType', {initialValue: pane.content.cameraType,rules: [{required: true, message: '请选择相机类型！'}]}]">
                    </a-select>
                  </a-form-item>

                </a-col>
                <a-col :span="8">
                  <a-input
                    v-decorator="['locationId',{initialValue: pane.content.locationId}]" v-show="false"/>
                  <a-form-item
                    label="设备位置"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >

                    <a-input @click="selectLocation('camera',pane.key)" :read-only="true" v-decorator="['locationName', {initialValue: pane.content.locationName}]">
                      <a-icon slot="suffix" @click="clearLocation(pane.key)" type="close" style="color: rgba(0, 0, 0, 0.25);"/>
                    </a-input>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <p style="padding-top: 10px">如果不选，默认为设备的位置</p>
                </a-col>

              </a-row>

              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item
                    label="流媒体地址"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input :maxLength="255" v-decorator="['streamAddress',{initialValue: pane.content.streamAddress}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="解码类型"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-select
                      showSearch
                      allowClear
                      placeholder="选择解码类型"
                      optionFilterProp="children"
                      :filterOption="filterCommonOption"
                      :options="constants.list.streamDecodeType"
                      v-decorator="['streamDecodeType', {initialValue: pane.content.streamDecodeType}]">
                    </a-select>
                  </a-form-item>

                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="备注"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input :maxLength="255" v-decorator="['remark',{initialValue: pane.content.remark}]" />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">
                <a-col :span="8">
                  <a-input
                    v-decorator="['network.id',{initialValue: pane.content.network.id}]" v-show="false"/>
                  <a-form-item
                    label="IP地址"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input :maxLength="32" v-decorator="['network.ip',{initialValue: pane.content.network.ip, rules: [{pattern: new RegExp(REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的IP地址！'}]}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="子网掩码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="32"
                      v-decorator="['network.subnetMask', {initialValue: pane.content.network.subnetMask, rules: [{pattern: new RegExp(REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的子网掩码！'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="默认网关"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input :maxLength="32" v-decorator="['network.defaultGateway',{initialValue: pane.content.network.defaultGateway, rules: [{pattern: new RegExp(REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的默认网关！'}]}]" />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item label="MAC地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="32"
                      v-decorator="['network.macAddress', {initialValue: pane.content.network.macAddress, rules: [{pattern: new RegExp(REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的MAC地址！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item label="视频输入宽度" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="9"
                      v-decorator="['videoInputWidth', {initialValue: pane.content.videoInputWidth}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item label="视频输入高度" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="9"
                      v-decorator="['videoInputHeight', {initialValue: pane.content.videoInputHeight}]"/>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item label="端口" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="9"
                      v-decorator="['network.port', {initialValue: pane.content.network.port,rules: [{pattern: new RegExp(REG_EXPS.PLUS_INTEGER, 'g'), message: '请输入有效的端口！'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item
                    label="是否启用"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-switch :checked="pane.content.enable" @change="changeNetworkEnable($event,index)" v-decorator="['enable']"/>
                  </a-form-item>
                </a-col>

                <a-col :span="6">
                  <a-form-item
                    label="是否保存未识别记录"
                    :labelCol="labelCo1"
                    :wrapperCol="wrapperCo1"
                  >
                    <a-switch :checked="pane.content.saveNotRecRecord" @change="changeNetworksNR($event,index)" v-decorator="['saveNotRecRecord']"/>
                  </a-form-item>
                </a-col>

                <a-col :span="4" style="margin-bottom: 20px;text-align: right;padding-top: 10px">
                  <a-button type="primary" @click="customAlgorithm(index)">更多设置</a-button>
                </a-col>

              </a-row>

            </a-card>

            <p>闸机配置</p>
            <a-card>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item
                    label="网络开关类型"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input
                      v-decorator="['gateBrake.id',{initialValue: pane.content.gateBrake.id}]" v-show="false"/>
                    <a-select
                      showSearch
                      allowClear
                      placeholder="选择网络开关类型"
                      optionFilterProp="children"
                      :filterOption="filterCommonOption"
                      :options="constants.list.networkSwitchType"
                      v-decorator="['gateBrake.networkSwitchType', {initialValue: pane.content.gateBrake.networkSwitchType}]">
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
                      v-decorator="['gateBrake.direction', {initialValue: pane.content.gateBrake.direction}]">
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="备注"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input :maxLength="255" v-decorator="['gateBrake.remark',{initialValue: pane.content.gateBrake.remark}]" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-input
                    v-decorator="['gateBrake.network.id',{initialValue: pane.content.gateBrake.network.id}]" v-show="false"/>
                  <a-form-item
                    label="IP地址"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >

                    <a-input :maxLength="32" v-decorator="['gateBrake.network.ip',{initialValue: pane.content.gateBrake.network.ip, rules: [{pattern: new RegExp(REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的IP地址！'}]}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="子网掩码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="32"
                      v-decorator="['gateBrake.network.subnetMask', {initialValue: pane.content.gateBrake.network.subnetMask, rules: [{pattern: new RegExp(REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的子网掩码！'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="默认网关"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input :maxLength="32" v-decorator="['gateBrake.network.defaultGateway',{initialValue: pane.content.gateBrake.network.defaultGateway, rules: [{pattern: new RegExp(REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的默认网关！'}]}]" />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">

                <a-col :span="8">
                  <a-form-item label="MAC地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="32"
                      v-decorator="['gateBrake.network.macAddress', {initialValue: pane.content.gateBrake.network.macAddress, rules: [{pattern: new RegExp(REG_EXPS.HAS_ENG_NUMBER, 'g'), message: '请输入有效的MAC地址！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item label="端口" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="9"
                      v-decorator="['gateBrake.network.port', {initialValue: pane.content.gateBrake.network.port,rules: [{pattern: new RegExp(REG_EXPS.PLUS_INTEGER, 'g'), message: '请输入有效的端口！'}]}]"/>
                  </a-form-item>
                </a-col>


              </a-row>
            </a-card>

          </a-form>
        </a-tab-pane>

        <a-tab-pane tab="体温检测" v-if="isTemCheck" ref="key3" :closable="this.thermograph.id ? false : true" :key="(panes.length+3) + ''" class="init-sty">
          <a-form :form="formTem">
            <a-input
              v-decorator="['mainEngine.id',{initialValue: this.formData.mainEngine.id}]" v-show="false"/>
            <a-card>
              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item label="开门触发蓝牙锁" :labelCol="labelCo1" :wrapperCol="wrapperCo1">
                    <a-select
                      size="default"
                      placeholder="请选择"
                      :disabled="true"
                      optionFilterProp="children"
                      v-decorator="['thermograph.triggerBtLockMode', {initialValue: this.thermograph.triggerBtLockMode, rules: [{required: true, message: '请选择访客注册！'}]}]"
                    >
                      <a-select-option value="OPEN">开启</a-select-option>
                      <a-select-option value="CLOSE">关闭</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="体温校验模式" :labelCol="labelCo1" :wrapperCol="wrapperCo1">
                    <a-select
                      size="default"
                      placeholder="请选择"
                      :disabled="true"
                      optionFilterProp="children"
                      v-decorator="['thermograph.temperatureCheckMode', {initialValue: this.thermograph.temperatureCheckMode, rules: [{required: true, message: '请选择访客注册！'}]}]"
                    >
                      <a-select-option value="OPEN">开启</a-select-option>
                      <a-select-option value="CLOSE">关闭</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    label="低温阈值"
                    :labelCol="labelCo1"
                    :wrapperCol="wrapperCo1"
                  >
                    <a-input :maxLength="255" :disabled="true" v-decorator="['thermograph.lowTemperatureThreshold',{initialValue: this.thermograph.lowTemperatureThreshold}]" />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">

                <a-col :span="8">
                  <a-form-item
                    label="高温阈值"
                    :labelCol="labelCo1"
                    :wrapperCol="wrapperCo1"
                  >
                    <a-input :maxLength="255" :disabled="true" v-decorator="['thermograph.highTemperatureThreshold',{initialValue: this.thermograph.highTemperatureThreshold}]" />
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item label="热成像模块辐射率" :labelCol="labelCo1" :wrapperCol="wrapperCo1">
                    <a-input :maxLength="9"
                             v-decorator="['thermograph.thermalImagingEmissivity', {initialValue: this.thermograph.thermalImagingEmissivity, rules: [{required: true, message: '请输热成像模块辐射率！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item
                    label="热成像模块补偿率"
                    :labelCol="labelCo1"
                    :wrapperCol="wrapperCo1"
                  >
                    <a-input :maxLength="255" :disabled="true" v-decorator="['thermograph.thermalImagingCompRate',{initialValue: this.thermograph.thermalImagingCompRate}]" />
                  </a-form-item>
                </a-col>

              </a-row>

              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item label="热敏温度映射模式" :labelCol="labelCo1" :wrapperCol="wrapperCo1">
                    <a-select
                      size="default"
                      placeholder="请选择"
                      :disabled="true"
                      optionFilterProp="children"
                      v-decorator="['thermograph.temperatureMappingMode', {initialValue: this.thermograph.temperatureMappingMode, rules: [{required: true, message: '请选择热敏温度映射模式！'}]}]"
                    >
                      <a-select-option value="NONE">无映射</a-select-option>
                      <a-select-option value="false">关闭</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="请靠近语音开关" :labelCol="labelCo1" :wrapperCol="wrapperCo1">
                    <a-select
                      size="default"
                      placeholder="请选择"
                      optionFilterProp="children"
                      v-decorator="['thermograph.closeToVoiceMode', {initialValue: this.thermograph.closeToVoiceMode, rules: [{required: true, message: '请选择请靠近语音开关！'}]}]"
                    >
                      <a-select-option value="OPEN">开启</a-select-option>
                      <a-select-option value="CLOSE">关闭</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="播报温度数字开关" :labelCol="labelCo1" :wrapperCol="wrapperCo1">
                    <a-select
                      size="default"
                      placeholder="请选择"
                      optionFilterProp="children"
                      v-decorator="['thermograph.bcstTemperatureNumMode', {initialValue: this.thermograph.bcstTemperatureNumMode, rules: [{required: true, message: '请选择播报温度数字开关！'}]}]"
                    >
                      <a-select-option value="OPEN">开启</a-select-option>
                      <a-select-option value="CLOSE">关闭</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item
                    label="语音提示阈值"
                    :labelCol="labelCo1"
                    :wrapperCol="wrapperCo1"
                  >
                    <a-input :maxLength="255" v-decorator="['thermograph.voicePromptThreshold',{initialValue: this.thermograph.voicePromptThreshold}]" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="是否启用" :labelCol="labelCo1" :wrapperCol="wrapperCo1">
                    <a-select
                      size="default"
                      placeholder="请选择"
                      optionFilterProp="children"
                      v-decorator="['thermograph.enable', {initialValue: this.thermograph.enable+'', rules: [{required: true, message: '请选择启用！'}]}]"
                    >
                      <a-select-option value="true">是</a-select-option>
                      <a-select-option value="false">否</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
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
      <a-button key="back" @click="handleCancel">取消</a-button>
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
  import customAlgorithm from './CustomAlgorithm'
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
          sm: { span: 17 },
        },

        labelCo1: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
        wrapperCo1: {
          xs: { span: 24 },
          sm: { span: 10 },
        },
        visible: false,
        confirmLoading: false,
        formData: {
          cameras:[

          ],
          mainEngine:{
            faceShowNum:1,
            faceShowSeconds:5,
            remark:'',
            validMinutes:0,
            visitorRegister:false,
            witnessComparison:false,
            network:{
              defaultGateway:'192.168.0.1',
              ip:'',
              id: '',
              macAddress:'',
              subnetMask:'255.255.255.0'
            }
          }
        },
        deviceModelList:[],
        locationList: [],
        title: '',
        panes:[
        ],
        activeKey: '1',
        newTabIndex: 3,
        isTemCheck:false,
        thermograph:{
          bcstTemperatureNumMode:"OPEN",
          closeToVoiceMode:"OPEN",
          enable:true,
          highTemperatureThreshold:37.30,
          lowTemperatureThreshold:35.50,
          temperatureCheckMode:"CLOSE",
          temperatureMappingMode:"NONE",
          thermalImagingCompRate:1000,
          thermalImagingEmissivity:950,
          triggerBtLockMode:"CLOSE",
          id:'',
          voicePromptThreshold: 150
        }
      }
    },
    computed: {
      ...mapState(['constants']),
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
      this.form1 = this.$form.createForm(this);
      this.formTem = this.$form.createForm(this);
    },
    methods: {

      addTemCheck(){
        this.isTemCheck = !this.isTemCheck;
        this.callback((this.panes.length+3) + '')
      },
      addEdit (item) {
        let that = this;
        this.visible = true
        this.isTemCheck = false
        this.activeKey = '1';
        this.form.resetFields()
        this.form1.resetFields()
        this.formData ={
          cameras:[

          ],
          mainEngine:{
            faceShowNum:1,
            faceShowSeconds:5,
            remark:'',
            validMinutes:0,
            visitorRegister:false,
            witnessComparison:false,
            network:{
              defaultGateway:'',
              ip:'',
              id: '',
              port:'80',
              macAddress:'',
              subnetMask:'255.255.255.0'
            }
          }
        }
        this.panes = []
        this.newTabIndex = 3;
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
          let that = this;
          this.title = '修改'
          this.$api.device.getById({id: item.id})
            .then(res => {
              this.formData = res
              this.enable = res.enable
              if(res.cameras && res.cameras.length>0){
                res.cameras.map((item,index) =>{
                  const panes = that.panes;
                  const activeKey = `${that.newTabIndex++}`;
                  panes.push({
                    title: `相机 ${activeKey-3>0?activeKey-3:''}`,
                    form:this.$form.createForm(this),
                    content: item,
                    key: activeKey,
                    remark:'',
                  });
                  that.panes = panes;
                })
              }
              if(res.thermograph && res.thermograph.id){
                that.isTemCheck = true
                that.thermograph = res.thermograph
              }else{
                that.isTemCheck = false
                that.thermograph = {
                  bcstTemperatureNumMode:"OPEN",
                  closeToVoiceMode:"OPEN",
                  enable:true,
                  highTemperatureThreshold:37.30,
                  lowTemperatureThreshold:35.50,
                  temperatureCheckMode:"CLOSE",
                  temperatureMappingMode:"NONE",
                  thermalImagingCompRate:1000,
                  thermalImagingEmissivity:950,
                  triggerBtLockMode:"CLOSE",
                  id:'',
                  voicePromptThreshold: 150
                }
              }
            })
        }else{
          this.title = '新增'
          this.enable = true
        }
      },

      callback(key) {
        if (key == 1) {
          this.activeKey = '1';
        } else {
          this.next(key);
        }
      },

      changeNetworkEnable(value,index){
        this.panes[index].content.enable = value
      },
      changeNetworksNR(value,index) {
        this.panes[index].content.saveNotRecRecord = value
      },

      next(key) {
        var that = this;
        const { form: { validateFields } } = this;
        validateFields((errors, values) => {
          if (!errors) {
            that.activeKey = key+'';
            this.formData = Object.assign(this.formData,values)
          }
        })
      },

      selectLocation(name,key) {
        this.$refs.selectLocation.add(name,key)
      },

      customAlgorithm(index){
        this.$refs.customAlgorithm.add(this.panes[index].content.id?this.panes[index].content:'',index)
      },

      handleSubmit () {
        const { form1: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            if(!values.mainEngine){
              values = {
                mainEngine:this.formData.mainEngine
              }
            }
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

            if (!values.enable) {
              values.enable = this.enable
            }

            let params = Object.assign(this.formData,values)

            let camerasData = [],isSubmit = true;
            for(let i=0;i<this.panes.length;i++){
              camerasData.push(this.panes[i].content)
              this.panes[i].form.validateFields((errors, values) => {
                if (!errors) {
                  if(!values.gateBrake){
                    camerasData[i] = this.panes[i].content
                  }else{
                    values.enable = this.panes[i].content.enable
                    values.saveNotRecRecord = this.panes[i].content.saveNotRecRecord
                    camerasData[i] = values;
                    camerasData[i].algorithm = this.panes[i].content.algorithm
                  }
                }else{
                  isSubmit = false
                  return false
                }
              })
            }
            if(isSubmit){

              if(this.isTemCheck){
                let that = this;
                const { formTem: { validateFields } } = this
                validateFields((errors, valuesTem) => {
                  if (!errors) {
                    params.thermograph = valuesTem.thermograph
                    if(that.thermograph.id){
                      params.thermograph.id = that.thermograph.id;
                    }
                  }
                })
              }else{
                delete params.thermograph
              }

              // this.confirmLoading = true
              params.cameras = camerasData
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
            }
          } else {
            this.confirmLoading = false
          }
        })
      },
      onEdit(targetKey, action) {
        this[action](targetKey);
      },

      add() {
        var that = this;
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            const panes = this.panes;
            const activeKey = `${this.newTabIndex++}`;
            panes.push({
              title: `相机 ${activeKey-3>0?activeKey-3:''}`,
              form:this.$form.createForm(this),
              content: {
                algorithm:{},
                cameraType:"NETWORK",
                enable:true,
                saveNotRecRecord:true,
                remark:'',
                locationId:'',
                streamAddress:'',
                streamDecodeType:"SOFT",
                videoInputWidth:'1280',
                videoInputHeight:'720',
                gateBrake:{
                  direction:'IN',
                  networkSwitchType:"NETWORK",
                  remark:'',
                  network:{
                    defaultGateway:'192.168.0.1',
                    ip:'',
                    port:'80',
                    macAddress:'',
                    subnetMask:'255.255.255.0'
                  }
                },
                network:{
                  defaultGateway:'192.168.0.1',
                  ip:'',
                  port:'80',
                  macAddress:'',
                  subnetMask:'255.255.255.0'
                }
              },
              key: activeKey,
              remark:'',
            });
            that.panes = panes;
            that.activeKey = activeKey;
          }
        })

      },

      selectSuccess(value){
        let locationName = value.locationItem.estateName+(value.locationItem.buildingName?'-'+value.locationItem.buildingName:'')+(value.locationItem.unitName?'-'+value.locationItem.unitName:'')+(value.locationItem.storeyName?'-'+value.locationItem.storeyName:'')+(value.locationItem.roomName?'-'+value.locationItem.roomName:'')+'-'+value.locationItem.name
        if(value.name || value.key){
          let key = parseInt(value.key)-3
          this.panes[key].content.locationName = locationName;
          this.panes[key].content.locationId = value.locationItem.id
          this.panes[key].form.setFieldsValue({ locationName: locationName,locationId:value.locationItem.id});
        }else{
          this.formData.locationName = locationName
          this.formData.locationId = value.locationItem.id
          this.form.setFieldsValue({ locationName: locationName});
        }

      },

      clearLocation(index){
        let key = parseInt(index)-3
        this.panes[key].content.locationName = '';
        this.panes[key].content.locationId = ''
        this.panes[key].form.setFieldsValue({ locationName: '',locationId:''})
      },

      customSuccess(value){
        if(value.algorithm.checkAlive === 'true'){
          value.algorithm.checkAlive = true
        }else{
          value.algorithm.checkAlive = false
        }
        if(value.algorithm.checkSexual === 'true'){
          value.algorithm.checkSexual = true
        }else{
          value.algorithm.checkSexual = false
        }
        this.panes[value.itemIndex].content.algorithm = value.algorithm

      },

      remove(targetKey) {
        const that = this
        let allTabsNum = that.panes.length+3
        if(parseInt(targetKey) === allTabsNum){
          this.isTemCheck = false
          if(parseInt(that.activeKey) === allTabsNum){
            that.activeKey = (parseInt(targetKey)-1)+'';
          }
        }else{
          let activeKey = that.activeKey;
          let lastIndex;
          that.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
              lastIndex = i - 1;
            }
          });
          const currentPanes = that.panes.filter(pane => pane.key === targetKey);
          const panes = that.panes.filter(pane => pane.key !== targetKey);
          console.log(currentPanes)
          if(currentPanes[0].content.id){
            that.$confirm({
              title: '删除',
              content: '确定删除点击的相机？',
              onOk () {
                that.$api.device.cameraDel({ ids: [currentPanes[0].content.id]})
                  .then(res => {
                    that.$notification.success({
                      message: '成功',
                      description: `删除成功！`
                    })
                    if (panes.length) {
                      if (lastIndex >= 0) {
                        activeKey = panes[lastIndex].key;
                      } else {
                        activeKey = panes[0].key;
                      }
                      that.panes = panes;
                      that.activeKey = activeKey;
                    }else{
                      that.panes = [];
                      that.activeKey = '2';
                    }
                  })
              },
              onCancel () {
              }
            })
          }else{
            if (panes.length) {
              if (lastIndex >= 0) {
                activeKey = panes[lastIndex].key;
              } else {
                activeKey = panes[0].key;
              }
              that.panes = panes;
              that.activeKey = activeKey;
            }else{
              that.panes = [];
              that.activeKey = '2';
            }
          }
        }


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