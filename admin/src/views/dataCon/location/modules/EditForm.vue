<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.11
 * @desc 编辑
-->
<template>
  <a-modal
    :title="title"
    :width="840"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="地产"
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
            optionFilterProp="children"
            :filterOption="filterCommonOption"
            :options="roomList"
            v-decorator="['roomId', {initialValue: this.formData.roomId?this.formData.roomId:''}]"
          >
          </a-select>
        </a-form-item>

        <a-form-item label="编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['code', {initialValue: this.formData.code, rules: [{required: true, message: '请输入编码！'}]}]"/>
        </a-form-item>

        <a-form-item label="位置名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入位置名称！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="备注"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['remark',{initialValue: this.formData.remark}]" />
        </a-form-item>

      </a-form>
    </a-spin>
    <select-data-Con ref="selectSuccess" @selectSuccess="selectSuccess"></select-data-Con>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  import selectDataCon from '@/components/Common/selectDataCon'
  let nameNum = 0,
    noNum = 0;

  export default {
    mixins:[mixin],
    components: {
      selectDataCon
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
      add (item) {
        let that = this;
        this.visible = true
        this.form.resetFields()
        this.formData ={}
        if(item){
          this.title = '修改'
          this.$api.location.getById({id: item.id})
            .then(res => {
              this.formData = res
              if(res.estateId){
                that.getBuildList(res.estateId)
              }
              if(res.buildingId){
                that.getUnitList(res.buildingId)
              }
              if(res.unitId){
                that.getStoreyList(res.unitId)
              }
              if(res.storeyId){
                that.getRoomList(res.storeyId)
              }
            })
        }else{
          this.title = '新增'
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

      getUnitList(value){
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
      },

      getStoreyList(value){
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
          })
      },

      getRoomList(value){
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
          })
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {

          if (!errors) {
            if(this.formData.id){
              values.id = this.formData.id
            }
            values.estateId = this.formData.estateId
            this.$api.location.saveOrUpdate(values)
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