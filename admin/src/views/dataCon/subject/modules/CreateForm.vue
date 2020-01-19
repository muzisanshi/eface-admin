<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.11
 * @desc 编辑
-->
<template>
  <a-modal
    title="新增"
    :width="940"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false" :keyboard="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="地产"
              :labelCol="labelCo1"
              :wrapperCol="wrapperCo1"
            >
              <a-input @click="selectDataCon(1)" :read-only="true" v-decorator="['estateName', {initialValue: this.formData.estateName,rules: [{required: true, message: '请选择地产！'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <template v-for="(k, index) in form.getFieldValue('keys')">
          <div class="keys">
            <a-row :gutter="24">

              <a-col :span="7">
                <a-form-item :key="k.build" v-bind="formLayout" label="楼栋" :required="false">
                  <a-input :maxLength="64" v-decorator="[
                        `buildVal[${k.build}]`,
                        {
                          rules: [{
                            required: true,
                            whitespace: true,
                            message: '楼栋不能为空',
                          }],
                        }
                      ]" placeholder="请输入楼栋" style="margin-right: 8px" >
                    <a-icon v-if="form.getFieldValue('keys').length > 1"  slot="addonAfter" class="dynamic-delete-button" type="minus-circle-o" :disabled="form.getFieldValue('keys').length === 1" @click="() => remove(k)" />
                  </a-input>
                </a-form-item>
              </a-col>


              <a-col :span="15"  :offset="2">
                <a-row :gutter="24">
                  <a-col :span="7" v-if="attrOpt.length>0" v-for="(item,index1) in attrOpt[index]">
                    <a-form-item v-bind="formItemLayout" :required="false">
                      <a-input :maxLength="64" v-decorator="[
                          `unitVal[${item.unit+''+index+'-'+index1+''}]`,
                          {
                            rules: [{
                              required: true,
                              whitespace: true,
                              message: '单元不能为空',
                            }],
                          }
                        ]" placeholder="请输入单元" style="margin-right: 8px" >

                        <a-icon class="dynamic-delete-button" slot="addonAfter" type="minus-circle-o" @click="removeAttrOpt(index,index1)" />
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="3">
                    <a-form-item v-bind="formItemLayoutWithOutLabel" style="">
                      <a-button type="dashed" @click="addUnitOpt(index)">
                        <a-icon type="plus" />
                      </a-button>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </div>
        </template>
        <a-form-item v-bind="formItemLayoutWithOutLabel" style="margin-top: 10px;">
          <a-button type="dashed" style="width: 100%" @click="addBuildingAttr">
            <a-icon type="plus" /> 增加楼栋
          </a-button>
        </a-form-item>

      </a-form>
    </a-spin>
    <select-data-Con ref="selectSuccess" @selectSuccess="selectSuccess"></select-data-Con>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  import selectDataCon from '@/components/Common/SelectDataCon'
  let buildNum = 0;
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
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 },
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
        attrOpt:[[{
          unit:0
        }]],
        cloneAttrOpt:[[{name:''}]],
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
      this.form.getFieldDecorator('keys', {
        initialValue: [],
        preserve: true
      });

    },
    methods: {
      add (item) {
        this.visible = true
        this.form.resetFields()
        this.attrOpt = [[{
          unit:0
        }]];
        this.formData = {}
        if(this.form.getFieldValue('keys').length === 0){
            this.addBuildingAttr()
        }
      },

      selectSuccess(value){
        this.formData.estateName = value.name
        this.formData.estateId = value.value
        this.form.setFieldsValue({ estateName: value.name});
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
            parmas.buildings = this.goodsAttrAndOptParams;
            parmas.estateId = this.formData.estateId;
            parmas.remark = values.remark;
            console.log(parmas)

            this.$api.subject.saveOrUpdate(parmas)
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
        data.buildVal = this.trimSpace(data.buildVal);
        this.goodsAttrAndOptParams = [];
        let arrOpt = [];
        for(let i=0;i<data.buildVal.length;i++){
          let obj ={
            units:[]
          };
          if(data.buildVal[i]){
            obj.buildName = data.buildVal[i];
            this.goodsAttrAndOptParams.push(obj)
            arrOpt[i] = [];
            for (let key in data.unitVal){
              var objOpts = {}
              let curBuilding = key.split('-')[0]
              if(curBuilding == i){
                objOpts.name = data.unitVal[key]
                arrOpt[i].push(objOpts)
              }
            }
          }
          this.goodsAttrAndOptParams[i].units = arrOpt[i]
        }
      },

      addBuildingAttr(){
        const attrOptArr = []
        this.attrOpt.push(attrOptArr)
        const { form } = this;
        const keys = form.getFieldValue('keys');
        var arr = [{
          build: 0
        }]
        arr[0].build = ++buildNum
        const nextKeys = keys.concat(arr);
        form.setFieldsValue({
          keys: nextKeys,
        });
      },

      addUnitOpt(index){
        const obj =
          {
            unit:''
          }
        this.attrOpt[index].push(obj)
      },

      remove(k,nowIndex,index,id) {
        const { form } = this;
        const keys = form.getFieldValue('keys');
        if (keys.length === 0) {
          return;
        }

        form.setFieldsValue({
          keys: keys.filter(key => key.build !== k.build),
        });
      },

      removeAttrOpt(index,index1,id) {
        this.attrOpt[index].splice(index1, 1)
      },
    }
  }
</script>