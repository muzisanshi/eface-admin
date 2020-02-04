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
    :maskClosable="false" :keyboard="false"
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
                      :headers="clientHeader"
                      :data="data"
                      :beforeUpload="beforeUpload"
                      @change="handleChange"
                    >
                      <a-button>
                        <a-icon type="upload"/>浏览添加
                      </a-button>
                      <a-button type="primary" v-if="topImg" style="margin-left: 10px" @click.stop="delImage">删除</a-button>
                    </a-upload>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="24">

                <a-col :span="12"  v-if="userType === 'OWNER'">
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
                      v-decorator="['relationship', {initialValue: this.formData.relationship, rules: [{required: true, message: '请选择关系！'}]}]"
                    >
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item label="电话号码" :labelCol="labelCol" :wrapperCol="wrapperCol" class="national-code">
                    <a-input :maxLength="32" v-decorator="['phoneNo', {initialValue: this.formData.phoneNo, rules: [{required: true, message: '请输入电话号码！'}]}]">
                      <a-select
                        showSearch
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
                    <a-input :maxLength="64"
                      v-decorator="['realName', {initialValue: this.formData.realName, rules: [{required: true, message: '请输入姓名！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <a-form-item
                    label="性別"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                  >
                    <a-select showSearch allowClear placeholder="选择性別" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.sexual" v-decorator="['sexual', {initialValue: this.formData.sexual,rules: [{required: true, message: '请选择性別！'}]}]">
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :span="12" v-if="userType === 'VISITOR'">
                  <a-input
                    v-decorator="['visitorExtendInfo.id',{initialValue: this.formData.visitorExtendInfo?this.formData.visitorExtendInfo.id:''}]" v-show="false"/>
                  <a-input
                    v-decorator="['visitorExtendInfo.interviewerId',{initialValue: this.formData.visitorExtendInfo?this.formData.visitorExtendInfo.interviewerId:''}]" v-show="false"/>
                  <a-form-item
                    label="受访用户"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :required="true"
                  >

                    <a-input @click="selectUser()" :read-only="true" v-decorator="['visitorExtendInfo.interviewerRealName', {initialValue: this.formData.visitorExtendInfo?this.formData.visitorExtendInfo.interviewerRealName:'', rules: [{required: true, message: '请选择受访用户！'}]}]"/>
                  </a-form-item>
                </a-col>

                <a-col :span="12" v-if="userType === 'VISITOR'">
                  <a-form-item label="访问事由" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input :maxLength="128"
                      v-decorator="['visitorExtendInfo.reason', {initialValue: this.formData.visitorExtendInfo?this.formData.visitorExtendInfo.reason:'', rules: [{required: true, message: '请输入访问事由！'}]}]"/>
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
                :fileList="fileList"
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
                    <a-input @click="selectDataCon(1,index)" :disabled="!pane.isEditEstate" :read-only="true" v-decorator="['estateName', {initialValue: pane.content.estateName,rules: [{required: true, message: '请选择地产！'}]}]"/>
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
              <a-form-item :key="k.roomName" v-bind="formLayout" label="受访区域">
                <a-input @click="selectRoom(index1)" :read-only="true" v-decorator="[
                `roomNameVal[${k.roomName}]`,
                {
                initialValue: pane.content.gateBrakeLimits[index1].roomName
                }
                ]" placeholder="请选择受访区域" style="margin-right: 8px" >

                </a-input>
              </a-form-item>
              </a-col>

              <a-col :span="9">
              <a-form-item :key="k.remark" v-bind="formLayout" label="备注" :required="false">
              <a-input :maxLength="255" v-decorator="[
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

              <a-row :gutter="24" class="init-ant-form-item">

                <a-col :span="9">

                <a-form-item v-bind="formLayout" label="开始时间" :required="true">
                <a-date-picker @change="(value, dateString) => beginDateChange(value,dateString, index, index1)" v-if="pane.content.gateBrakeLimits[index1].beginDatetime" :value="moment(pane.content.gateBrakeLimits[index1].beginDatetime,'YYYY-MM-DD HH:mm:ss')" format="YYYY-MM-DD HH:mm:ss" showTime/>
                <a-date-picker @change="(value, dateString) => beginDateChange(value,dateString, index, index1)" v-if="!pane.content.gateBrakeLimits[index1].beginDatetime" format="YYYY-MM-DD HH:mm:ss" showTime/>
                </a-form-item>
                </a-col>

                <a-col :span="9">
                  <a-form-item v-bind="formLayout" label="结束时间" :required="false">
                    <a-date-picker @change="(value, dateString) => endDateChange(value,dateString, index, index1)" v-if="pane.content.gateBrakeLimits[index1].endDatetime" :value="moment(pane.content.gateBrakeLimits[index1].endDatetime,'YYYY-MM-DD HH:mm:ss')" format="YYYY-MM-DD HH:mm:ss" showTime/>
                    <a-date-picker @change="(value, dateString) => endDateChange(value,dateString, index, index1)" v-if="!pane.content.gateBrakeLimits[index1].endDatetime" format="YYYY-MM-DD HH:mm:ss" showTime/>
                  </a-form-item>
                  <div style="margin-bottom: 12px;color: #9a9a9a;font-size: 12px;text-align: right;"><span>如果不选择结束时间，则按照门禁闸机常用规则进行限制</span></div>
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
  import selectDataCon from '@/components/Common/SelectDataCon'
  import selectRoom from '@/components/Common/SelectRoom'
  import selectUser from './SelectUser'
  import uploadFace from './UploadImg'
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
          faceDeletedIds:[],
          faces:[],
          faceImageBase64s:[],
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
        curPaneIndex:0,
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
              gateBrakeLimits:[]
            }, key: '2',remark:'',closable: false,isEditEstate:true },
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
    watch:{
      activeKey(newVal){
        if(parseInt(newVal)-2<0){
          this.curPaneIndex = 0
        }else{
          this.panes.map((item,index) =>{
            if(item.key === newVal){
              this.curPaneIndex = index
            }
          })
        }
      }
    },
    computed: {
      ...mapState(['constants', 'system']),
    },
    methods: {
      moment,

      addEdit(item,userType) {
        let that = this;
        that.visible = true
        that.form.resetFields()
        that.userType = userType
        that.formData ={
          userEstates:[],
          faceDeletedIds:[],
          faces:[],
          faceImageBase64s:[],
          visitorExtendInfo:{}
        }

        that.panes = [
          { title: '受访区域',form:this.$form.createForm(this), content: {
              estateId:"",
              relieve:false,
              gateBrakeLimits:[]
            }, key: '2',remark:'',closable: false,isEditEstate:true },
        ];
        that.panes[0].form.getFieldDecorator('keys', {
          initialValue: [],
          preserve: true
        });
        that.userType = userType
        that.activeKey = '1'
        that.fileList = [];
        that.headImageAttId = null;
        that.topImg = null;
        that.$api.dictValue.getRelationship()
          .then(res => {
            const l = []
            for (let i = 0;i<res.length; i++) {
              l.push({
                value: res[i].value,
                label: res[i].name
              })
            }
            that.dictValueList = l
            if(!item){
              that.formData.relationship=that.dictValueList[0].value
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
            that.nationalAreaCodeList = l
            if(item){
              that.title = '修改'
              that.$api.user.getById({
                id: item.id,
                code:userType
              })
                .then(res => {
                  console.log('---res---',res)
                  that.formData = res
                  that.formData.faceDeletedIds = []
                  that.topImg = res.resourceFullAddress;
                  that.panes = []
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
                      closable: false,
                      isEditEstate:true
                    }

                    let initialVal = []
                    item.gateBrakeLimits.map((val,inx)=>{
                      initialVal.push({
                        remark: inx,
                        roomName: inx,
                      })
                      if(val.estateId){
                        obj.isEditEstate = false
                      }
                    })

                    obj.form.getFieldDecorator('keys', {
                      initialValue: initialVal,
                      preserve: true
                    });

                    that.panes.push(obj)

                  })
                })
            }else{
              that.title = '新增'
              that.formData.nationalAreaCodeId=this.nationalAreaCodeList[0].value
              that.formData.sexual=this.constants.list.sexual[0].value

            }
          })
      },

      selectUser(){
        this.$refs.selectUser.add()
      },

      selectUserSuccess(value){
        if(value.userItem){
          this.formData.visitorExtendInfo = {
            interviewerRealName:'',
            interviewerId:''
          }
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
            if(that.userType === 'VISITOR'){
              if(this.formData.visitorExtendInfo){
                values.visitorExtendInfo.interviewerId = this.formData.visitorExtendInfo.interviewerId
              }
            }

            values.code = that.userType
            values.faceDeletedIds = that.formData.faceDeletedIds
            if(this.fileList.length === 0){
              this.$notification.error({
                message: '提示',
                description: `请上传人脸照片`
              })
              return false
            }else{
              if(key === '2'){
                that.activeKey = key+'';
                this.formData = Object.assign(this.formData,values)
                if(this.panes[0].content.gateBrakeLimits.length === 0){
                  that.addAttr(0)
                }
              }else{
                that.activeKey = key+'';
                this.formData = Object.assign(this.formData,values)
              }
            }
            console.log('--------',this.formData)
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
              that.confirmLoading = false
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
        if(imgData.faceImageBase64s){
          this.formData.faceImageBase64s = this.formData.faceImageBase64s?this.formData.faceImageBase64s:[]
          this.formData.faceImageBase64s.push(imgData.faceImageBase64s)
          this.fileList.push({
            uid: imgData.uid,
            name: imgData.origFilename,
            status: 'done',
            url: imgData.resourceFullAddress,
            thumbUrl:imgData.resourceFullAddress,
            base64:imgData.faceImageBase64s
          })
          console.log(this.formData)
        }
      },

      onUploadSuccess(id) {
        this.uploadFileId = id
      },

      //删除人脸照片
      delUploadImg(file){
        let that = this;
        if(this.fileList.length<2){
          that.$notification.error({
            message: '提示',
            description: `至少保留一张人脸照片！`
          })
          return false
        }else{
          if(file.id){
            that.$confirm({
              title: '删除',
              content: '确定删除当前人脸图片？',
              onOk () {
                that.formData.faceDeletedIds.push(file.id)
                that.fileList = that.fileList.filter(pane => pane.uid !== file.uid)
                that.formData.faces = that.formData.faces.filter(pane => pane.id !== file.id)
              },
              onCancel () {
                return false
              }
            })

          }else{
            this.fileList = this.fileList.filter(pane => pane.uid !== file.uid)
            this.formData.faceImageBase64s = this.formData.faceImageBase64s.filter(pane => pane !== file.base64)
          }
          console.log(this.formData.faces)
        }
      },

      //选择受访区域
      selectRoom(itemIndex){
        this.itemIndex = itemIndex
        console.log(this.panes[this.curPaneIndex].content.gateBrakeLimits[itemIndex])
        if(this.panes[this.curPaneIndex].content.estateId){
          this.$refs.selectRoom.add(null,this.panes[this.curPaneIndex].content.gateBrakeLimits[itemIndex])
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
      beginDateChange(date,dateString,index,index1) {
        if(dateString){
          this.panes[index].content.gateBrakeLimits[index1].beginDatetime = dateString;
        }else{
          this.panes[index].content.gateBrakeLimits[index1].beginDatetime = '';
        }

      },

      //选择结束时间
      endDateChange(date,dateString,index,index1) {
        if(dateString){
          this.panes[index].content.gateBrakeLimits[index1].endDatetime = dateString;
        }else{
          this.panes[index].content.gateBrakeLimits[index1].endDatetime = '';
        }
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
                gateBrakeLimits: []
              },
              key: activeKey,
              remark:'',
              isEditEstate:true
            });
            that.panes = panes;
            that.activeKey = activeKey;
            that.panes[that.panes.length-1].form.getFieldDecorator('keys', {
              initialValue: [],
              preserve: true
            });
            that.addAttr(that.panes.length-1)
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
        if (panes.length) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key;
          } else {
            activeKey = panes[0].key;
          }
          that.panes = panes;
          that.activeKey = activeKey;
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

      delImage(){
        this.topImg = ''
        this.headImageAttId = ''
        this.formData.headImageAttId = null
      },

      //提交
      handleSubmit () {
        const { form: { validateFields } } = this
        let camerasData = [],isSubmit = true;
        for(let i=0;i<this.panes.length;i++){
          this.panes[i].content.code = this.userType
          camerasData.push(this.panes[i].content)
          this.panes[i].form.validateFields((errors, valuesItem) => {
            if (!errors) {
              let remarkData = [];
              if(valuesItem.remarkVal && valuesItem.remarkVal.length){
                valuesItem.remarkVal.forEach((item,index) =>{
                  remarkData.push(item)
                })
              }

              for(let j=0;j<remarkData.length;j++){
                this.panes[i].content.gateBrakeLimits[j].remark = remarkData[j]
                if(!this.panes[i].content.gateBrakeLimits[j].beginDatetime){
                  this.$notification.error({
                    message: '提示',
                    description: `请选择受访区域${i}的开始时间`
                  })
                  isSubmit =false
                  return false
                }
              }
              camerasData[i] = this.panes[i].content
            }else{
              isSubmit =false
              return false
            }
          })
        }

        if(isSubmit){
          this.formData.userEstates = camerasData
          console.log(this.formData)
          this.confirmLoading = true
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
            this.confirmLoading = false
          })
        }
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
.init-ant-form-item .ant-form-item{
  margin-bottom: 2px!important;
}
</style>