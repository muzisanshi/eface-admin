<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.12.11
 * @desc 编辑
-->
<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="地区"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <select-area ref="selectArea" :initArea="initCascader"
                       @selectedArea="selectedArea"></select-area>
        </a-form-item>

        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入名称！'}]}]"/>
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
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  import {mapState} from 'vuex';
  import selectArea from '@/components/Common/SelectArea'
  export default {
    mixins:[mixin],
    props:{
      initArea:{
        type:Array,
        default:[]
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
        visible: false,
        confirmLoading: false,
        formData: {},
        title: '',
        initCascader: this.initArea,
      }
    },
    components: {
      selectArea
    },
    computed: {
      ...mapState(['constants']),
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    methods: {
      add (item) {
        let that = this;
        that.initCascader = []
       if(this.initArea.length){
         this.initCascader = this.initArea
       }
        this.visible = true
        this.form.resetFields()
        this.formData ={}

        if(item){
          this.title = '修改'
          this.$api.streetOffice.getById({id: item.id})
            .then(res => {
              this.formData = res
              if (res.areas.length) {
                for (let i = res.areas.length - 1; i >= 0; i--) {
                  that.initCascader.push(res.areas[i].id)
                }
                that.$refs.selectArea.initAllArea()
              }
            })
        }else{
          this.title = '新增'
        }
      },

      selectedArea(area) {
        this.initCascader = area.value;
        // this.inputChange = area.name.join('')
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        this.confirmLoading = true
        validateFields((errors, values) => {

          if (!errors) {
            if(this.formData.id){
              values.id = this.formData.id
            }
            if(this.initCascader.length>0){
              values.areaId = this.initCascader[this.initCascader.length-1]
            }
            this.$api.streetOffice.saveOrUpdate(values)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description: this.title + '成功！'
                })
                this.visible = false
                this.confirmLoading = false
                this.form.resetFields()
                this.form.resetFields(['name', 'remark']);
                this.$emit('addSuccess', res)
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