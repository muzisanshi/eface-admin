<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.12
 * @desc 选择地产、楼层、单元、房间（公用）
-->
<template>
  <a-modal
    title="选择"
    :width="840"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="选择地区"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <select-area ref="selectAreaAll" :initArea="initCascader"
                       @selectedArea="selectedArea"></select-area>
        </a-form-item>

        <a-form-item
          label="名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['name']" @blur="searchName($event)" placeholder="请输入地产名称搜索"/>
        </a-form-item>

        <a-form-item
          label="地产"
          v-if="curItem>0"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择地产"
            optionFilterProp="children"
            @change="estateChange"
            :filterOption="filterCommonOption"
            :options="estateList"
            v-decorator="['estateId', {initialValue: this.formData.estateId?this.formData.estateId:'',rules: [{required: true, message: '请选择地产！'}]}]"
          >
          </a-select>
        </a-form-item>

        <a-form-item
          label="楼栋"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="curItem>1"
        >
          <a-select
            showSearch
            placeholder="选择楼栋"
            @change="buildChange"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="buildList"
            v-decorator="['buildId', {initialValue: this.formData.buildId?this.formData.buildId:'',rules: [{required: true, message: '请选择楼栋！'}]}]"
          >
          </a-select>
        </a-form-item>


        <a-form-item
          label="楼栋单元"
          :labelCol="labelCol"
          v-if="curItem>1"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择单元"
            @change="unitChange"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="unitList"
            v-decorator="['unitId', {initialValue: this.formData.unitId?this.formData.unitId:'',rules: [{required: true, message: '请选择单元！'}]}]"
          >
          </a-select>
        </a-form-item>

        <a-form-item
          label="楼层"
          :labelCol="labelCol"
          v-if="curItem>2"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择楼层"
            @change="storeyChange"
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="storeyList"
            v-decorator="['storeyId', {initialValue: this.formData.storeyId?this.formData.storeyId:'',rules: [{required: true, message: '请选择楼层！'}]}]"
          >
          </a-select>
        </a-form-item>

  </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import selectArea from './SelectArea'
  import {mixin} from '@/mixins/mixin'
  export default {
    props:{
    },
    components: {
      selectArea
    },
    mixins:[mixin],
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 },
        },
        form: this.$form.createForm(this),
        formData: {},
        initCascader:[],
        estateList:[],
        buildList:[],
        unitList:[],
        storeyList:[],
        confirmLoading:false,
        visible:false,
        curItem:'',
        currentData:'',
        currentDataName:'',
        areaId:'',
        name:'',
        currentItem:{},
        roomNum:0
      }
    },
    created(){

    },
    methods: {

      selectData(item){
        this.visible = true;
        this.curItem = item;
        this.form.resetFields()
        this.formData = {}
        this.init();
      },

      init(){
        this.initCascader = [];
        this.currentData = '';
        this.currentDataName = '';
        this.estateList = [];
        this.buildList = [];
        this.unitList = [];
        this.storeyList = [];
        this.areaId = ''
        this.name = ''
        this.roomNum = 0
      },
      selectedArea(area) {
        this.initCascader = area.value;
        this.areaId = area.value[area.value.length-1]
        this.getEstateList()
      },

      searchName(name){
        this.name = name?name.srcElement.value:'';
        this.getEstateList()

      },
      getEstateList(){
        let that = this;
        if(!that.areaId && !that.name){

        }else{
          this.estateList = [];
          this.buildList = [];
          this.unitList = [];
          this.storeyList = [];
          this.roomNum = 0
          this.form.resetFields(['estateId','buildId','unitId','storeyList']);
          this.$api.estate.getLimitPage({
            name:that.name,
            areaId:that.areaId
          })
            .then(res => {
              const l = []
              for (let i = 0, j = res.length; i < j; i++) {
                l.push({
                  value: res[i].id,
                  label: res[i].name
                })
              }
              this.estateList = l
            })
        }

      },

      estateChange(value,option){
        this.currentData = value
        this.currentDataName = option.componentOptions.children[0].text
        this.buildList = [];
        this.unitList = [];
        this.storeyList = [];
        this.roomNum = 0
        this.form.resetFields(['buildId','unitId','storeyList']);
        if(this.curItem>1){
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
        }

      },

      buildChange(value){
        this.unitList = [];
        this.storeyList = [];
        this.roomNum = 0
        this.form.resetFields(['unitId','storeyList']);
        if(this.curItem>1){
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
            })
        }
      },

      unitChange(value,option){
        this.currentData = value
        this.currentDataName = option.componentOptions.children[0].text
        this.storeyList = [];
        this.roomNum = 0
        this.form.resetFields(['storeyList']);
        if(this.curItem>2){
          this.$api.storey.getAll({
            unitId: value
          })
            .then(res => {
              const l = []
              for (let i = 0, j = res.length; i < j; i++) {
                l.push({
                  value: res[i].id,
                  label: res[i].name,
                  roomNum:res[i].roomNum,
                })
              }
              this.storeyList = l
            })
        }

      },

      storeyChange(value,option){
        this.currentData = value
        this.roomNum = 0
        this.getUnAddRoomList(value)
        this.currentDataName = option.componentOptions.children[0].text
      },

      getUnAddRoomList(id){
        this.$api.storey.getMaxRoomNum({
          storyId: id
        })
          .then(res => {
            this.roomNum = res.maxRoomNum
          })
      },

      handleSubmit(){
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            this.$emit('selectSuccess', {
              value:this.currentData,
              name:this.currentDataName,
              roomNum:this.roomNum
            })
            this.visible = false
            this.form.resetFields();
            this.initCascader = [];
          }
        })
      },
      onChangeAddress(value){
        this.initCascader = value;
        this.$emit('selectedArea',this.initCascader)
      },
    }
  }
</script>