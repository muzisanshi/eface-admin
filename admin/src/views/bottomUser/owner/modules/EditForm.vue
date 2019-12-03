<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.27
 * @desc 编辑
-->
<template>
  <a-modal
    :title="title"
    :width="1070"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">

      <a-tabs @change="callback" :activeKey='activeKey'  type="editable-card" @edit="onEdit">
        <a-tab-pane tab="基本信息" ref="key1" key="1" class="select-init" :closable="false">
          <a-form :form="form">
            <a-card class="init-sty">
              <a-row :gutter="24">
                <a-col :span="12" class="upload-title">
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
                      :data="data"
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

            <div style="display: flex;justify-content:space-between;margin-bottom: 10px"><span>注册人脸</span> <a-button type="primary" @click="saveBasicMess">保存用户信息</a-button></div>
            <a-card style="margin-bottom: 20px">
              <a-button type="primary" icon="plus" @click="uploadFace">上传照片</a-button>

              <a-upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                :defaultFileList="fileList"
                :remove="delUploadImg"
                class="upload-list-inline"
              >
              </a-upload>

            </a-card>
          </a-form>

        </a-tab-pane>

        <a-tab-pane v-for="(pane,index) in panes" :tab="pane.title" :key="pane.key" :closable="pane.closable" class="init-sty">
          <a-form :form="pane.form">
            <a-card class="init-sty">

              <a-row :gutter="24">
                <a-col :span="8">
                  <a-form-item
                    label="地产"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input @click="selectDataCon(1,index)" :read-only="true" v-decorator="['estateName', {initialValue: pane.content.estateName,rules: [{required: true, message: '请选择地产！'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
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
                      v-decorator="['relationship', {initialValue: pane.relationship, rules: [{required: true, message: '请选择关系！'}]}]"
                    >
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item
                    label="是否解绑"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-switch :checked="pane.content.relieve" @change="changeRelieve($event,index)" v-decorator="['pane.content.relieve']"/>
                  </a-form-item>
                </a-col>
            </a-row>
            </a-card>
            <a-card class="init-sty">

              <a-row :gutter="24">
                <template v-for="(k,index1) in pane.form.getFieldValue('keys')">
                  <div class="keys">
                    <a-row :gutter="24">

                      <a-col :span="9">
                        <a-form-item :key="k.roomName" v-bind="formLayout" label="受房区域" :required="true">
                          <a-input @click="selectRoom(index1)" :read-only="true" v-decorator="[
                        `roomNameVal[${k.roomName}]`,
                        {
                          initialValue: pane.content.gateBrakeLimit[index1].roomName,
                          rules: [{
                            required: true,
                            whitespace: true,
                            message: '受房区域不能为空',
                          }],
                        }
                      ]" placeholder="请选择受房区域" style="margin-right: 8px" >

                          </a-input>
                        </a-form-item>
                      </a-col>

                      <a-col :span="9">
                        <a-form-item :key="k.remark" v-bind="formLayout" label="备注" :required="false">
                          <a-input v-decorator="[
                        `remarkVal[${k.remark}]`
                      ]" placeholder="请输入备注" style="margin-right: 8px" >

                          </a-input>
                        </a-form-item>
                      </a-col>


                      <a-col :span="6">
                        <a-form-item v-bind="formLayout" label="是否启用" :required="false">
                          <a-switch :checked="pane.content.gateBrakeLimit[index1].enable" @change="changeGkEnable($event,index,index1)" v-decorator="['pane.content.gateBrakeLimit[index1].enable']"/>

                        </a-form-item>
                      </a-col>

                    </a-row>

                    <a-row :gutter="24">

                      <a-col :span="9">

                        <a-form-item v-bind="formLayout" label="开始时间" :required="true">
                          <a-date-picker @change="value => beginDateChange(value, index, index1)" v-if="pane.content.gateBrakeLimit[index1].beginDatetime" :value="moment(pane.content.gateBrakeLimit[index1].beginDatetime,'YYYY-MM-DD HH:mm:ss')" format="YYYY-MM-DD HH:mm:ss" showTime/>
                          <a-date-picker @change="value => beginDateChange(value, index, index1)" v-if="!pane.content.gateBrakeLimit[index1].beginDatetime" format="YYYY-MM-DD HH:mm:ss" showTime/>
                        </a-form-item>
                      </a-col>

                      <a-col :span="9">
                        <a-form-item v-bind="formLayout" label="结束时间" :required="false">
                          <a-date-picker @change="value => endDateChange(value, index, index1)" v-if="pane.content.gateBrakeLimit[index1].endDatetime" :value="moment(pane.content.gateBrakeLimit[index1].endDatetime,'YYYY-MM-DD HH:mm:ss')" format="YYYY-MM-DD HH:mm:ss" showTime/>
                          <a-date-picker @change="value => endDateChange(value, index, index1)" v-if="!pane.content.gateBrakeLimit[index1].endDatetime" format="YYYY-MM-DD HH:mm:ss" showTime/>
                        </a-form-item>
                      </a-col>


                      <a-col :span="4" :offset="2">
                        <a-icon class="dynamic-delete-button" type="minus-circle-o" :disabled="pane.form.getFieldValue('keys').length === 1" @click="() => removeAttr(k,index,index1)" />
                      </a-col>

                    </a-row>

                  </div>
                </template>
                <a-form-item v-bind="formItemLayoutWithOutLabel" style="margin-top: 10px;">
                  <a-button type="dashed" style="width: 100%" @click="addAttr(index)">
                    <a-icon type="plus" /> 增加受房区域
                  </a-button>
                </a-form-item>
              </a-row>
          </a-card>
          </a-form>
        </a-tab-pane>

      </a-tabs>

    </a-spin>
    <template v-if="activeKey !== '2'" slot="footer">
      <a-button key="submit" v-if="activeKey === '1'" type="primary" :confirmLoading="confirmLoading" @click="next('2')">
        下一步
      </a-button>

    </template>
    <template  v-if="activeKey === '2'" slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :confirmLoading="confirmLoading" @click="handleSubmit">
        确认
      </a-button>
    </template>
    <select-data-Con ref="selectSuccess" @selectSuccess="selectSuccess"></select-data-Con>
    <select-room ref="selectRoom" :estateId="panes[curPaneIndex].content.estateId" @selectRoom="selectRoomSuccess"></select-room>
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
  let remarkNum = 0,roomNameNum = 0;
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
        formLayout:{
          labelCol: {
            xs: { span: 24 },
            sm: { span: 9 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 15 },
          },
        },
        formItemLayoutWithOutLabel: {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 10, offset: 7 },
          },
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
        userType:'',
        activeKey: '2',
        newTabIndex: 3,
        curPaneIndex:0,
        itemIndex:0,
        data:{
          attOrigin:'ADMIN',
          attType:'NORMAL'
        },
        fileList:[
          {
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            thumbUrl:
              'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          },
          {
            uid: '-2',
            name: 'yyy.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            thumbUrl:
              'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          },
        ],
        panes:[
          { title: '受房区域',form:this.$form.createForm(this), content: {
              code:this.userType,
              estateId:"",
              relieve:false,
              relationship:'',
              userId:'',
              gateBrakeLimit:[
                {
                  estateId:'',
                  buildingId:"",
                  unitId:'',
                  storeyId:'',
                  roomId:"",
                  beginDatetime:'',
                  endDatetime:'',
                  remark:'',
                  roomName:'',
                  enable:true,
                },
              ]
            }, key: '2',remark:'',closable: false },
        ],
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
        if(this.formData.id){
          this.$refs.uploadFace.add()
        }else{
          this.$notification.error({
            message: '提示',
            description: `请先保存用户信息`
          })
        }

      },

      uploadFaceSuccess(){

      },

      addEdit(item,userType) {
        let that = this;
        this.visible = true
        this.form.resetFields()
        this.formData ={
          userEstate:{
            id:''
          },
          gateBrakeLimit:{},
        }
        this.panes = [
          { title: '受房区域',form:this.$form.createForm(this), content: {
              code:that.userType,
              estateId:"",
              relieve:false,
              relationship:'',
              userId:'',
              gateBrakeLimit:[
                {
                  estateId:'',
                  buildingId:"",
                  unitId:'',
                  storeyId:'',
                  roomId:"",
                  beginDatetime:'',
                  endDatetime:'',
                  remark:'',
                  roomName:'',
                  enable:true,
                },
              ]
            }, key: '2',remark:'',closable: false },
        ];
        this.panes[0].form.getFieldDecorator('keys', {
          initialValue: [],
          preserve: true
        });
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
              // this.formData.nationalAreaCodeId=this.nationalAreaCodeList[0].value
            }
          })
      },

      onUploadSuccess(id) {
        this.uploadFileId = id
      },

      selectRoom(itemIndex){
        this.itemIndex = itemIndex
        if(this.panes[this.curPaneIndex].content.estateId){
          this.$refs.selectRoom.add(null)
        }else{
            this.$notification.error({
              message: '提示',
              description: `请先选择地产`
            })
        }

      },

      selectRoomSuccess(value){
        this.panes[this.curPaneIndex].content.gateBrakeLimit[this.itemIndex] = Object.assign(this.panes[this.curPaneIndex].content.gateBrakeLimit[this.itemIndex],value)
        console.log(this.panes[this.curPaneIndex].content.gateBrakeLimit[this.itemIndex], this.itemIndex)
        this.panes[this.curPaneIndex].form.setFieldsValue({ roomNameVal: value.roomName});
      },

      delUploadImg(file){
        console.log(file)
        return false
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

      beforeUpload() {
        return true
      },

      beginDateChange(date,index,index1) {
        this.panes[index].content.gateBrakeLimit[index1].beginDatetime = this.formateTimeStamp(date._d);
      },

     formateTimeStamp(time){
        let date = new Date();
        date.setTime(time.getTime());
        let year = date.getFullYear();
        let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let hour = date.getHours()< 10 ? "0" + date.getHours() : date.getHours();
        let minute = date.getMinutes()< 10 ? "0" + date.getMinutes() : date.getMinutes();
        let second = date.getSeconds()< 10 ? "0" + date.getSeconds() : date.getSeconds();
        return year + "-" + month + "-" + day+" "+hour+":"+minute+":"+second;
      },

      endDateChange(date,index,index1) {
        this.panes[index].content.gateBrakeLimit[index1].endDatetime = this.formateTimeStamp(date._d);
      },

      selectSuccess(value){
        this.panes[this.curPaneIndex].content.estateId = value.value
        this.panes[this.curPaneIndex].content.estateName = value.name
        this.panes[this.curPaneIndex].form.setFieldsValue({ estateName: value.name});
      },

      callback(key) {
        let that= this;
        if (key === '1') {
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
            if(key === '2'){
              that.activeKey = key+'';
              this.formData = Object.assign(this.formData,values)
            }else{
              that.activeKey = key+'';
              this.formData = Object.assign(this.formData,values)
            }
          }
        })
      },

      saveBasicMess(){
        let that = this;
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            that.$api.user.saveOrUpdate(this.formData)
              .then(res => {

              }).finally(() => {
            })
          }
        })

      },

      changeRelieve(value,index){
        this.panes[index].content.relieve = value
      },

      changeGkEnable(value,index,index1){
        this.panes[index].content.gateBrakeLimit[index1].enable = value
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
              title: `受房区域 ${activeKey-2}`,
              form:this.$form.createForm(this),
              content: {
                code:that.userType,
                estateId:"",
                relieve:false,
                relationship:'',
                userId:'',
                gateBrakeLimit: {
                  estateId: '',
                  buildingId: "",
                  storeyId: '',
                  unitId: '',
                  roomId: "",
                  beginDatetime: '',
                  endDatetime: '',
                  remark: '',
                  roomName:'',
                  enable: true,
                }
              },
              key: activeKey,
              remark:''
            });
            that.panes = panes;
            that.activeKey = activeKey;
            that.panes[activeKey].form.getFieldDecorator('keys', {
              initialValue: [{
                remark:0
              }],
              preserve: true
            });
          }
        })

      },

      remove(targetKey) {
        const that = this
        let activeKey = that.activeKey;
        let lastIndex;
        that.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const panes = that.panes.filter(pane => pane.key !== targetKey);
        const curPanes = that.panes.filter(pane => pane.key === targetKey);
        if (panes.length && activeKey === targetKey) {
          console.log(curPanes[0].content.id)
          if(curPanes[0].content.id){
            that.$confirm({
              title: '删除',
              content: '确定删除当前点击的受房区域？',
              onOk () {
                // that.$api.device.cameraDel({ id: curPanes[0].content.id})
                //   .then(res => {
                //     that.$notification.success({
                //       message: '成功',
                //       description: `删除成功！`
                //     })
                //     if (lastIndex >= 0) {
                //       activeKey = panes[lastIndex].key;
                //     } else {
                //       activeKey = panes[0].key;
                //     }
                //     that.panes = panes;
                //     that.activeKey = activeKey;
                //   })
              },
              onCancel () {
              }
            })
          }else{
            if (lastIndex >= 0) {
              activeKey = panes[lastIndex].key;
            } else {
              activeKey = panes[0].key;
            }
            that.panes = panes;
            that.activeKey = activeKey;
          }
        }

      },


      removeAttr(k,index) {
        const keys = this.panes[index].form.getFieldValue('keys');
        if (keys.length === 0) {
          return;
        }
        this.panes[index].form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
      },

      addAttr(index){
        const keys = this.panes[index].form.getFieldValue('keys');
        this.panes[index].content.gateBrakeLimit.push({
          estateId:'',
          buildingId:"",
          unitId:'',
          storeyId:'',
          roomId:"",
          beginDatetime:'',
          endDatetime:'',
          remark:'',
          roomName:'',
          enable:true
        })
        let arr = [{
          remark: 0,
          roomName: 0,
        }]
        arr[0].remark = ++remarkNum
        arr[0].roomName = ++roomNameNum
        const nextKeys = keys.concat(arr);
        this.panes[index].form.setFieldsValue({
          keys: nextKeys,
        });

      },

      trimSpace(array){
        for(var i = 0 ;i<array.length;i++)
        {
          if(array[i] == " " || array[i] == null || typeof(array[i]) == "undefined")
          {
            array.splice(i,1);
            i= i-1;
          }
        }
        return array;
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            if(this.formData.id){
              values.id = this.formData.id
            }

            let camerasData = []
            for(let i=0;i<this.panes.length;i++){
              camerasData.push(this.panes[i].content)
              console.log(this.panes[i].content)
              this.panes[i].form.validateFields((errors, valuesItem) => {
                if (!errors) {
                  valuesItem.roomNameVal = this.trimSpace(valuesItem.roomNameVal);
                  valuesItem.remarkVal = this.trimSpace(valuesItem.remarkVal);
                  console.log(valuesItem)
                  for(j=0;j<valuesItem.remarkVal.length;j++){
                    this.panes[i].content.gateBrakeLimit[j] = valuesItem.remarkVal[j]
                  }
                  console.log(this.panes[i].content)
                  // if(!values.gateBrake){
                  //   camerasData[i] = this.panes[i].content
                  // }else{
                  //   camerasData[i] = values;
                  // }
                }
              })
            }

            if(!this.formData.gateBrakeLimit.beginDatetime){
              this.$notification.error({
                message: '提示',
                description: '请选择开始时间'
              })
              return
            }
            values.userEstate.code=this.userType

            // this.$api.user.saveOrUpdate(values)
            //   .then(res => {
            //     this.$notification.success({
            //       message: '成功',
            //       description: this.title + '成功！'
            //     })
            //     this.visible = false
            //     this.confirmLoading = false
            //     this.form.resetFields()
            //     this.$emit('ok', values)
            //   }).finally(() => {
            //     this.confirmLoading = false
            //   })
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

  .select-init form .ant-input-group .ant-select, form .ant-input-group .ant-cascader-picker{
    width: 80px;
  }

  .upload-title .ant-col-sm-6{
    padding: 10px 2px 0 0;
  }

  .upload-list-inline .ant-upload-list-item {
    float: left;
    width: 200px;
    margin-right: 8px;
  }
  .upload-list-inline .ant-upload-animate-enter {
    animation-name: uploadAnimateInlineIn;
  }
  .upload-list-inline .ant-upload-animate-leave {
    animation-name: uploadAnimateInlineOut;
  }

</style>