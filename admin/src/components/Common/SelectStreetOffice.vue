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
    :maskClosable="false"
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
          label="街道办"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            showSearch
            placeholder="选择街道办"
            optionFilterProp="children"
            @change="streetChange"
            :filterOption="filterCommonOption"
            :options="streetList"
            v-decorator="['streetOfficeId', {initialValue: this.formData.streetOfficeId?this.formData.streetOfficeId:'',rules: [{required: true, message: '请选择街道办！'}]}]"
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
      initArea:{
        type:Array,
        default:[]
      }
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
        streetList:[],
        confirmLoading:false,
        visible:false,
        currentData:'',
        currentDataName:'',
        areaId:'',
        name:''
      }
    },
    created(){

    },
    methods: {

      selectStreetOffice(){
        this.visible = true;
        this.form.resetFields()
        this.formData = {}
        this.init();
      },

      init(){
        this.initCascader = [];
        this.currentData = '';
        this.currentDataName = '';
        this.streetList = [];
        this.areaId = ''
        this.name = ''
        console.log(this.initArea)
        if(this.initArea.length){
          this.initCascader = this.initArea
          this.areaId = this.initCascader[this.initCascader.length-1]
          this.getStreetList()
        }
      },
      selectedArea(area) {
        this.initCascader = area.value;
        this.areaId = area.value[area.value.length-1]
        this.getStreetList()
      },

      searchName(name){
        this.name = name?name.srcElement.value:'';
        this.getStreetList()

      },
      getStreetList(){
        let that = this;
        if(!that.areaId && !that.name){

        }else{
          this.$api.streetOffice.getAll({
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
              this.streetList = l
            })
        }

      },

      streetChange(value,option){
        this.currentData = value
        this.currentDataName = option.componentOptions.children[0].text
      },

      handleSubmit(){
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            this.$emit('selectSuccess', {
              value:this.currentData,
              name:this.currentDataName
            })
            this.visible = false
            this.form.resetFields();
            this.initCascader = [];
          }
        })
      },
    }
  }
</script>