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
                <a-col :span="8">
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
                <a-col :span="8">
                  <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['realName', {initialValue: this.formData.realName, rules: [{required: true, message: '请输入姓名！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="8">
                  <a-form-item
                    label="性別"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-select showSearch allowClear placeholder="选择性別" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.sexual" v-decorator="['sexual', {initialValue: this.formData.sexual,rules: [{required: true, message: '请选择性別！'}]}]">
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">

                <a-col :span="8" v-if="userType === 'VISITOR'">
                  <a-form-item
                    label="用户"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-input
                      v-decorator="['visitorExtendInfo.id',{initialValue: this.formData.visitorExtendInfo.id}]" v-show="false"/>
                    <a-input
                      v-decorator="['visitorExtendInfo.interviewerId',{initialValue: this.formData.visitorExtendInfo.interviewerId}]" v-show="false"/>
                    <a-input @click="selectUser()" :read-only="true" v-decorator="['visitorExtendInfo.interviewerRealName', {initialValue: this.formData.visitorExtendInfo.interviewerRealName}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="8" v-if="userType === 'VISITOR'">
                  <a-form-item label="受访原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      v-decorator="['visitorExtendInfo.reason', {initialValue: this.formData.visitorExtendInfo.reason}]"/>
                  </a-form-item>
                </a-col>

              </a-row>

            </a-card>

            <div style="display: flex;justify-content:space-between;margin-bottom: 10px">
              <span>注册人脸</span>
              <!--<a-button type="primary" @click="saveBasicMess">保存用户信息</a-button>-->
            </div>
            <a-card style="margin-bottom: 20px">
              <a-button type="primary" icon="plus" @click="uploadFace">上传照片</a-button>

              <a-upload
                v-if="fileList.length>0"
                :action="system.uploadMainUrl"
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
                      v-decorator="['relationship', {initialValue: pane.content.relationship, rules: [{required: true, message: '请选择关系！'}]}]"
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
              <a-form-item :key="k.roomName" v-bind="formLayout" label="受访区域" :required="true">
                <a-input @click="selectRoom(index1)" :read-only="true" v-decorator="[
                `roomNameVal[${k.roomName}]`,
                {
                initialValue: pane.content.gateBrakeLimits[index1].roomName,
                rules: [{
                required: true,
                whitespace: true,
                message: '受访区域不能为空',
                }],
                }
                ]" placeholder="请选择受访区域" style="margin-right: 8px" >

                </a-input>
              </a-form-item>
              </a-col>

              <a-col :span="9">
              <a-form-item :key="k.remark" v-bind="formLayout" label="备注" :required="false">
              <a-input v-decorator="[
              `remarkVal[${k.remark}]`,
              {
                initialValue: pane.content.gateBrakeLimits[index1].remark
              }
              ]" placeholder="请输入备注" style="margin-right: 8px" >

              </a-input>
              </a-form-item>
              </a-col>


              <a-col :span="6">
              <a-form-item v-bind="formLayout" label="是否启用" :required="false">
              <a-switch :checked="pane.content.gateBrakeLimits[index1].enable" @change="changeGkEnable($event,index,index1)" v-decorator="['pane.content.gateBrakeLimits[index1].enable']"/>

              </a-form-item>
              </a-col>

              </a-row>

              <a-row :gutter="24">

                <a-col :span="9">

                <a-form-item v-bind="formLayout" label="开始时间" :required="true">
                <a-date-picker @change="value => beginDateChange(value, index, index1)" v-if="pane.content.gateBrakeLimits[index1].beginDatetime" :value="moment(pane.content.gateBrakeLimits[index1].beginDatetime,'YYYY-MM-DD HH:mm:ss')" format="YYYY-MM-DD HH:mm:ss" showTime/>
                <a-date-picker @change="value => beginDateChange(value, index, index1)" v-if="!pane.content.gateBrakeLimits[index1].beginDatetime" format="YYYY-MM-DD HH:mm:ss" showTime/>
                </a-form-item>
                </a-col>

                <a-col :span="9">
                  <a-form-item v-bind="formLayout" label="结束时间" :required="false">
                    <a-date-picker @change="value => endDateChange(value, index, index1)" v-if="pane.content.gateBrakeLimits[index1].endDatetime" :value="moment(pane.content.gateBrakeLimits[index1].endDatetime,'YYYY-MM-DD HH:mm:ss')" format="YYYY-MM-DD HH:mm:ss" showTime/>
                    <a-date-picker @change="value => endDateChange(value, index, index1)" v-if="!pane.content.gateBrakeLimits[index1].endDatetime" format="YYYY-MM-DD HH:mm:ss" showTime/>
                  </a-form-item>
                </a-col>


                <a-col :span="4" :offset="2" v-if="!pane.content.gateBrakeLimits[index1].id">
                  <a-icon class="dynamic-delete-button" type="minus-circle-o" @click="() => removeAttr(k,index,index1)" />
                </a-col>

              </a-row>

              </div>
              </template>
              <a-form-item v-bind="formItemLayoutWithOutLabel" style="margin-top: 10px;">
              <a-button type="dashed" style="width: 100%" @click="addAttr(index)">
              <a-icon type="plus" /> 增加受访区域
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
    <select-user ref="selectUser" @selectUserSuccess="selectUserSuccess"></select-user>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  import {mapState} from 'vuex';
  import {ImageUpload} from '@/components'
  import selectDataCon from '@/components/Common/selectDataCon'
  import selectRoom from '@/components/Common/selectRoom'
  import selectUser from './SelectUser'
  import uploadFace from './uploadImg'
  import moment from 'moment';
  import api from '@/api/index'
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
          userEstates:[],
          faces:[],
          visitorExtendInfo:{}
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
        activeKey: '1',
        newTabIndex: 3,
        itemIndex:0,
        data:{
          attOrigin:'ADMIN',
          attType:'NORMAL'
        },
        fileList:[
        ],
        panes:[
          { title: '受访区域',form:this.$form.createForm(this), content: {
              estateId:"",
              relieve:false,
              relationship:'',
              gateBrakeLimits:[
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
                  enable:false,
                },
              ]
            }, key: '2',remark:'',closable: false },
        ],
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);

    },
    created(){

    },
    components: {
      ImageUpload,selectDataCon,selectRoom,uploadFace,selectUser
    },
    computed: {
      ...mapState(['constants', 'system']),
      curPaneIndex:{
        get(){
          if(parseInt(this.activeKey)-2<0){
            return 0
          }else{
            return parseInt(this.activeKey)-2
          }
        },
        set(val){}
      }
    },
    methods: {
      moment,

      addEdit(item,userType) {
        let that = this;
        this.visible = true
        this.form.resetFields()
        that.userType = userType
        this.formData ={
          userEstates:[],
          faces:[],
          visitorExtendInfo:{}
        }

        this.panes = [
          { title: '受访区域',form:this.$form.createForm(this), content: {
              estateId:"",
              relieve:false,
              relationship:'',
              gateBrakeLimits:[
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
                  enable:false,
                },
              ]
            }, key: '2',remark:'',closable: false },
        ];
        this.panes[0].form.getFieldDecorator('keys', {
          initialValue: [],
          preserve: true
        });
        this.userType = userType
        this.activeKey = '1'
        that.fileList = []
        this.headImageAttId = null;
        this.topImg = null;
        this.$api.dictType.getAll({})
          .then(res => {
            for (let i = 0, j = res.length; i < j; i++) {
              if(res[i].name==='关系'){
                const l = []
                for (let j = 0;j<res[i].dictValues.length; j++) {
                  l.push({
                    value: res[i].dictValues[j].value,
                    label: res[i].dictValues[j].name
                  })
                }
                that.dictValueList = l
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
                  that.topImg = res.resourceFullAddress;
                  this.panes = []
                  if(res.faces){
                    res.faces.map((item) => {
                      that.fileList.push({
                        uid: item.id,
                        id: item.id,
                        name: item.faceId,
                        status: 'done',
                        url: item.resourceFullAddress,
                        thumbUrl:item.resourceFullAddress
                      })
                    })
                  }

                  res.userEstates.map((item,index) => {
                    let obj = {
                      title: '受访区域'+(index>0?index:''),
                      form:this.$form.createForm(this),
                      content: item,
                      key: (index+2)+'',
                      closable: false }

                    this.panes.push(obj)

                    let initialVal = []
                    item.gateBrakeLimits.map((val,inx)=>{
                      initialVal.push({
                        remark: inx,
                        roomName: inx,
                      })
                    })
                    obj.form.getFieldDecorator('keys', {
                      initialValue: initialVal,
                      preserve: true
                    });
                  })
                })
            }else{
              this.title = '新增'
              this.formData.nationalAreaCodeId=this.nationalAreaCodeList[0].value
            }
          })
      },

      selectUser(){
        this.$refs.selectUser.add()
      },

      selectUserSuccess(value){
        console.log(value)
        if(value.userItem){
          this.formData.visitorExtendInfo.interviewerRealName = value.userItem.realName
          this.formData.visitorExtendInfo.interviewerId = value.userItem.id
          this.form.setFieldsValue({ visitorExtendInfo: {
              interviewerRealName: value.userItem.realName
            }})
        }
      },

      //tab切換
      callback(key) {
        let that= this;
        if (key === '1') {
          this.activeKey = '1';
        } else {
          this.next(key);
        }
      },

      //下一步
      next(key) {
        let that = this;
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            if(that.headImageAttId){
              values.headImageAttId = that.headImageAttId
            }
            if(this.formData.id){
              values.id = this.formData.id
            }
            values.code = that.userType
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

      //头像上传回调
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

      //头像上传
      beforeUpload() {
        return true
      },

      //保存基本信息
      saveBasicMess(){
        let that = this;
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            if(that.headImageAttId){
              values.headImageAttId = that.headImageAttId
            }
            if(this.formData.id){
              values.id = this.formData.id
            }
            values.code = that.userType
            that.$api.user.saveOrUpdate(values)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description: `保存成功`
                })
                that.formData.id = res
              }).finally(() => {
            })
          }
        })

      },

      //上传人脸
      uploadFace(){
        this.$refs.uploadFace.add()
      },

      //上传人脸成功回调
      uploadFaceSuccess(imgData){
        if(imgData.id){
          this.formData.faces = this.formData.faces?this.formData.faces:[]
          this.formData.faces.push({
            faceAttId:imgData.id
          })
          this.fileList.push({
            uid: imgData.id,
            name: imgData.origFilename,
            status: 'done',
            url: imgData.resourceFullAddress,
            thumbUrl:imgData.resourceFullAddress
          })
        }
      },

      onUploadSuccess(id) {
        this.uploadFileId = id
      },

      //删除人脸照片
      delUploadImg(file){
        let that = this;
        if(file.id){
          return new Promise((resolve, reject) => {
            that.$confirm({
              title: '删除',
              content: '确定删除当前人脸图片？',
              onOk () {
                api.face.del({ id: file.id}).then(response => {
                  that.$notification.success({
                    message: '成功',
                    description: `删除成功！`
                  })
                  resolve(true)
                }).catch(error => {
                  reject(false)
                })
              },
              onCancel () {
                reject(false)
              }
            })
          })

        }
      },

      //选择受访区域
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

      //选择受访区域回调
      selectRoomSuccess(value){
        this.panes[this.curPaneIndex].content.gateBrakeLimits[this.itemIndex] = Object.assign(this.panes[this.curPaneIndex].content.gateBrakeLimits[this.itemIndex],value)
        this.panes[this.curPaneIndex].form.setFieldsValue({ roomNameVal: value.roomName});
      },

      //选择开始时间
      beginDateChange(date,index,index1) {
        this.panes[index].content.gateBrakeLimits[index1].beginDatetime = this.formateTimeStamp(date._d);
      },

      //日期处理
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

      //选择结束时间
      endDateChange(date,index,index1) {
        this.panes[index].content.gateBrakeLimits[index1].endDatetime = this.formateTimeStamp(date._d);
      },

      //选择地产回调
      selectSuccess(value){
        this.panes[this.curPaneIndex].content.estateId = value.value
        this.panes[this.curPaneIndex].content.estateName = value.name
        this.panes[this.curPaneIndex].form.setFieldsValue({ estateName: value.name});
      },

      //解绑change
      changeRelieve(value,index){
        this.panes[index].content.relieve = value
        if(value){
          for(let i=0;i<this.panes[index].content.gateBrakeLimits.length;i++){
            this.panes[index].content.gateBrakeLimits[i].enable = false
          }
        }

      },

      //是否启用change
      changeGkEnable(value,index,index1){
        this.panes[index].content.gateBrakeLimits[index1].enable = value
      },

      //tab添加
      onEdit(targetKey, action) {
        this[action](targetKey);
      },

      //tab添加
      add() {
        let that = this;
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            const panes = this.panes;
            const activeKey = `${this.newTabIndex++}`;
            panes.push({
              title: `受访区域 ${activeKey-2}`,
              form:this.$form.createForm(this),
              content: {
                estateId:"",
                relieve:false,
                id:'',
                relationship:'',
                gateBrakeLimits: []
              },
              key: activeKey,
              remark:''
            });
            that.panes = panes;
            that.activeKey = activeKey;
            that.panes[activeKey-2].form.getFieldDecorator('keys', {
              initialValue: [],
              preserve: true
            });
          }
        })
      },

      //tab删除
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
          if(curPanes[0].content.id){
            that.$confirm({
              title: '删除',
              content: '确定删除当前点击的受访区域？',
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

      //受访区域item删除
      removeAttr(k,index,index1) {
        const keys = this.panes[index].form.getFieldValue('keys');
        if (keys.length === 0) {
          return;
        }
        this.panes[index].content.gateBrakeLimits = this.panes[index].content.gateBrakeLimits.filter((key, inx) =>inx !== index1)
        this.panes[index].form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
      },

      //受访区域添加
      addAttr(index){
        const keys = this.panes[index].form.getFieldValue('keys');
        this.panes[index].content.gateBrakeLimits.push({
          estateId:'',
          buildingId:"",
          unitId:'',
          storeyId:'',
          roomId:"",
          id:'',
          beginDatetime:'',
          endDatetime:'',
          remark:'',
          roomName:'',
          enable:false
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

      //提交
      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        let camerasData = []
        for(let i=0;i<this.panes.length;i++){
          this.panes[i].content.code = this.userType
          camerasData.push(this.panes[i].content)
          this.panes[i].form.validateFields((errors, valuesItem) => {
            if (!errors) {
              this.panes[i].content.relationship = valuesItem.relationship;
              let roomNameData = [...valuesItem.roomNameVal],remarkData = [...valuesItem.remarkVal];
              let prevLeng = roomNameData.length;
              roomNameData = this.trimSpace(roomNameData);
              let nextLeng = roomNameData.length
              remarkData = remarkData.splice(prevLeng-nextLeng,remarkData.length)
              for(let j=0;j<remarkData.length;j++){
                this.panes[i].content.gateBrakeLimits[j].remark = remarkData[j]
              }
              camerasData[i] = this.panes[i].content
              camerasData[i].gateBrakeLimits = camerasData[i].gateBrakeLimits.slice(0,roomNameData.length)
            }
          })


        }
        this.formData.userEstates = camerasData
        console.log('--formData--',this.formData)

        this.$api.user.saveOrUpdate(this.formData)
          .then(res => {
            this.$notification.success({
              message: '成功',
              description: `保存成功`
            })
            this.visible = false
            this.confirmLoading = false
            this.form.resetFields()
            this.$emit('ok', this.formData)
          }).finally(() => {
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