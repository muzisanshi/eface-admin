<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.11
 * @desc 选择地产到房间（get所以id）
-->
<template>
  <a-modal
    title="选择"
    :width="840"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false" :keyboard="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="地产"
          v-if="!estateId"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input @click="selectDataCon(1)" :read-only="true" v-decorator="['estateName', {initialValue: this.formData.estateName,rules: [{required: true, message: '请选择地产！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="楼栋"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择楼栋"
            @change="getUnitList"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="buildList"
            v-decorator="['buildingId', {initialValue: this.formData.buildingId?this.formData.buildingId:''}]"
          >
          </a-select>
        </a-form-item>


        <a-form-item
          label="楼栋单元"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择单元"
            @change="getStoreyList"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="unitList"
            v-decorator="['unitId', {initialValue: this.formData.unitId?this.formData.unitId:''}]"
          >
          </a-select>
        </a-form-item>

        <a-form-item
          label="楼层"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择楼层"
            @change="getRoomList"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="storeyList"
            v-decorator="['storeyId', {initialValue: this.formData.storeyId?this.formData.storeyId:''}]"
          >
          </a-select>
        </a-form-item>

        <a-form-item
          label="房间"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择房间"
            @change="changeRoom"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="roomList"
            v-decorator="['roomId', {initialValue: this.formData.roomId?this.formData.roomId:''}]"
          >
          </a-select>
        </a-form-item>

      </a-form>
    </a-spin>
    <select-data-Con ref="selectSuccess" @selectSuccess="selectSuccess"></select-data-Con>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  import selectDataCon from '@/components/Common/SelectDataCon'

  export default {
    mixins:[mixin],
    components: {
      selectDataCon
    },
    props:{
      estateId:{
        type:String,
        default:''
      }
    },
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
        formLayout:{
          labelCol: {
            xs: { span: 24 },
            sm: { span: 7 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 17 },
          },
        },
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 0 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
          },
        },
        formItemLayoutWithOutLabel: {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
          },
        },
        visible: false,
        confirmLoading: false,
        formData: {},
        parentGoodsGroupId: '',
        goodsAttrAndOptParams:[],
        goodsId:'',
        attrOpt:[[]],
        cloneAttrOpt:[[{name:''}]],
        buildList:[],
        unitList:[],
        storeyList:[],
        roomList:[],
        title: '',
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    methods: {
      add (item,value) {
        let that = this;
        this.visible = true
        this.form.resetFields()
        this.formData ={}
        if(this.estateId){
          this.formData.estateId = this.estateId
          this.getBuildList(this.estateId)
        }
        if(value){
          this.formData.roomName = value.roomName
          if(value.buildingId){
            this.getUnitList(value.buildingId,null,true)
          }
          if(value.unitId){
            this.getStoreyList(value.unitId,null,true)
          }
          if(value.storeyId){
            this.getRoomList(value.storeyId,null,true)
          }
        }
      },

      selectSuccess(value){
        this.formData.estateName = value.name
        this.formData.estateId = value.value
        this.getBuildList(value.value)
        this.form.setFieldsValue({ storeyName: value.name});
      },

      getBuildList(value){
        this.$api.subject.getBuildAll({
          estateId: value
        })
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name
              })
            }
            this.buildList = l
          })
      },

      getUnitList(value,option,status){
        if(option){
          this.formData.roomName=option.componentOptions.children[0].text
        }
        this.$api.subject.getUnitAll({
          buildingId: value
        })
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name
              })
            }
            this.unitList = l
            if(status){
              this.form.setFieldsValue({ buildingId: value});
            }
          })
      },

      getStoreyList(value,option,status){
        if(option){
          this.formData.roomName=option.componentOptions.children[0].text
        }
        this.$api.storey.getAll({
          unitId: value
        })
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name
              })
            }
            this.storeyList = l
            if(status){
              this.form.setFieldsValue({ unitId: value});
            }
          })
      },

      getRoomList(value,option,status){
        if(option){
          this.formData.roomName=option.componentOptions.children[0].text
        }
        this.$api.room.getAll({
          storeyId: value
        })
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name
              })
            }
            this.roomList = l
            if(status){
              this.form.setFieldsValue({ storeyId: value});
            }
          })
      },

      changeRoom(value,option){
        this.formData.roomName=option.componentOptions.children[0].text
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {

          if (!errors) {
            if(this.formData.roomName){
              values.roomName = this.formData.roomName
            }
            if(!values.buildingId){
              values.roomName = this.formData.estateName
            }

            values.estateId = this.formData.estateId
            this.$emit('selectRoom',values)
            this.visible = false
            this.form.resetFields()
          }
        })
      },
    }
  }
</script>