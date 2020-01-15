<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.11
 * @desc 编辑
-->
<template>
  <a-modal
    title="新增"
    :width="1040"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="楼栋单元"
              :labelCol="labelCo1"
              :wrapperCol="wrapperCo1"
            >
              <a-input @click="selectDataCon(2)" :read-only="true" v-decorator="['unitName', {initialValue: this.formData.unitName,rules: [{required: true, message: '请选择楼栋单元！'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <template v-for="(k, index) in form.getFieldValue('keys')">
          <div class="keys">
            <a-row :gutter="24">

              <a-col :span="7">
                <a-form-item :key="k.name" v-bind="formLayout" label="楼层">
                  <a-input :maxLength="64" v-decorator="[
                        `nameVal[${k.name}]`,
                        {
                          rules: [{
                            required: true,
                            whitespace: true,
                            message: '楼层不能为空',
                          }],
                        }
                      ]" placeholder="请输入楼层" style="margin-right: 8px" >

                  </a-input>
                </a-form-item>

              </a-col>

              <a-col :span="7" >
                <a-form-item :key="k.roomNum" v-bind="formLayout" label="房间数量">
                  <a-input :maxLength="11" v-decorator="[
                          `roomNumVal[${k.roomNum}]`,
                          {
                            rules: [{
                              required: true,
                              whitespace: true,
                              message: '房间数量不能为空',
                            }],
                          }
                        ]" placeholder="请输入房间数量" style="margin-right: 8px" >
                  </a-input>
                </a-form-item>
              </a-col>

              <a-col :span="7" >
                <a-form-item :key="k.remark" v-bind="formLayout" label="备注" :required="false">
                  <a-input :maxLength="255" v-decorator="[
                          `remarkVal[${k.remark}]`]" placeholder="请输入备注" style="margin-right: 8px" >
                  </a-input>
                </a-form-item>
              </a-col>

              <a-col :span="3" style="padding-top: 10px">
                <a-icon v-if="form.getFieldValue('keys').length > 1" class="dynamic-delete-button" type="minus-circle-o" :disabled="form.getFieldValue('keys').length === 1" @click="() => remove(k)" />
              </a-col>

            </a-row>

          </div>
        </template>
        <a-form-item v-bind="formItemLayoutWithOutLabel" style="margin-top: 10px;">
          <a-button type="dashed" style="width: 100%" @click="addBuildingAttr">
            <a-icon type="plus" /> 增加楼层
          </a-button>
        </a-form-item>

      </a-form>
    </a-spin>
    <select-data-Con ref="selectSuccess" @selectSuccess="selectSuccess"></select-data-Con>
  </a-modal>
</template>

<script>
  import selectDataCon from '@/components/Common/SelectDataCon'
  import {mixin} from '@/mixins/mixin'
  let nameNum = 0,
    roomNum = 0,
  remarkNum =0;

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
        labelCo1: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCo1: {
          xs: { span: 24 },
          sm: { span: 17 },
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
            sm: { span: 10, offset: 7 },
          },
        },
        visible: false,
        confirmLoading: false,
        formData: {},
        parentGoodsGroupId: '',
        goodsAttrAndOptParams:[],
        goodsId:'',
        attrOpt:[[{roomNum:0}]],
        cloneAttrOpt:[[{name:''}]],
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
      this.form.getFieldDecorator('keys', {
        initialValue: [{
          name:0,
          roomNum:0,
          remark:0
        }],
        preserve: true
      });
    },
    methods: {
      add (item) {
        this.visible = true
        this.form.resetFields()
        this.formData ={}
      },

      selectSuccess(value){
        this.formData.unitName = value.name
        this.formData.unitId = value.value
        this.form.setFieldsValue({ unitName: value.name});
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {

          if (!errors) {
            if(values.keys.length>0){
              this.handleAddData(values)
            }
            let parmas = {};
            parmas.storeys = this.goodsAttrAndOptParams;
            parmas.unitId = this.formData.unitId;
            console.log(parmas)

            this.$api.storey.saveOrUpdate(parmas)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description: '增加成功！'
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
      handleAddData(data){
        data.nameVal = this.trimSpace(data.nameVal);
        data.roomNumVal = this.trimSpace(data.roomNumVal);
        this.goodsAttrAndOptParams = [];
        for(let i=0;i<data.nameVal.length;i++){
          let obj ={};
          if(data.nameVal[i]){
            obj.name = data.nameVal[i];
            obj.roomNum = data.roomNumVal[i];
            obj.remark = data.remarkVal[i];
            this.goodsAttrAndOptParams.push(obj)
          }
        }
      },

      handleCancel () {
        this.visible = false
      },

      addBuildingAttr(){

        const attrOptArr = []

        this.attrOpt.push(attrOptArr)

        const { form } = this;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        var arr = [{
          name: 0,
          roomNum : 0,
          remark:0
        }]
        arr[0].name = ++nameNum
        arr[0].roomNum = ++roomNum
        arr[0].remark = ++remarkNum
        const nextKeys = keys.concat(arr);
        form.setFieldsValue({
          keys: nextKeys,
        });
      },

      remove(k,nowIndex,index,id) {
        const { form } = this;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 0) {
          return;
        }

        // can use data-binding to set
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });

      },

    }
  }
</script>