<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.12.10
 * @desc 绑定地产
-->
<template>
  <a-modal title="绑定地产" :width="1240" :visible="visible" :confirmLoading="confirmLoading" :maskClosable="false" @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
        <a-collapse @change="changeActiveKey">
          <template v-for="(item,index) in orgList">
            <a-collapse-panel :header="item.label+'（'+item.selectedNum+'）'" :key="index" :showArrow="false" style="position: relative">
              <div style="position: absolute;right: 10px;top: 10px;">
                <a-checkbox :indeterminate="item.indeterminate" @change="onCheckAllChange($event,index)" :checked="item.checkAll">
                  全选
                </a-checkbox>
              </div>
              <a-checkbox-group :options="item.estates" :value="item.checked" @change="onCheckoutChange($event,index)" />
            </a-collapse-panel>
          </template>
        </a-collapse>
    </a-spin>
  </a-modal>
</template>
<script>
  import {mapState} from 'vuex';
  import {mixin} from '@/mixins/mixin'

  export default {
    components: {},
    mixins: [mixin],
    data() {
      return {
        labelCol: {
          xs: {span: 24},
          sm: {span: 7}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 13}
        },

        labelCo1: {
          xs: {span: 24},
          sm: {span: 4}
        },
        wrapperCo1: {
          xs: {span: 24},
          sm: {span: 16}
        },
        visible: false,
        confirmLoading: false,

        uploadFileId: '',
        formData: {},
        title: '',
        form: this.$form.createForm(this),
        text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
        orgList:[],
        itemList:[],

      }
    },
    computed: {
      ...mapState(['constants'])
    },
    methods: {
      onUploadSuccess(id) {
        this.uploadFileId = id
      },
      add(item) {
        this.visible = true
        this.form.resetFields()
        this.formData = {};
        this.orgList = []
        this.$api.org.getAll({
          managerId: item.id
        })
          .then(res => {
              const l = []
              for (let i = 0; i < res.length; i++) {
                l.push({
                  value: res[i].id,
                  label: res[i].name,
                  indeterminate: true,
                  checkAll: false,
                  estates:[],
                  selected:[],
                  selectedNum:res[i].selectedNum
                })
              }
              this.orgList = l
              this.$api.org.getEstates({
                managerId: item.id
              })
                .then(resItem => {
                  for (let k = 0; k < this.orgList.length; k++) {
                    for (let j = 0; j< resItem.length; j++) {
                      if(this.orgList[k].id === resItem[j].orgId){
                        this.orgList[k].selected = resItem[j].estateIds
                      }
                    }
                  }
                })
          })
      },

      onCheckoutChange(checkedList,index){
        this.orgList[index].checked = checkedList
        this.orgList[index].selectedNum = checkedList.length
        this.orgList[index].indeterminate = !!checkedList.length && checkedList.length < this.orgList[index].estates.length;
        this.orgList[index].checkAll = checkedList.length === this.orgList[index].estates.length;
      },

      onCheckAllChange(e,index) {
        this.orgList[index].indeterminate = false;
        this.orgList[index].checkAll = e.target.checked;
        this.orgList[index].selectedNum = e.target.checked?this.orgList[index].estates.length:0
        this.orgList[index].checked = e.target.checked ? this.handleSelectedCheck(this.orgList[index].estates) : []
        console.log(this.orgList[index].checked)
      },

      handleSelectedCheck(data){
        let handleData = []
        data.map((item)=>{
          handleData.push(item.value)
        })
        return handleData
      },

      changeActiveKey(key) {
        let that = this;
        if(this.itemList.length<key.length){
          let currentItem = key.filter(item=>this.itemList.indexOf(item)==-1)[0]
          if(that.orgList[currentItem].estates.length === 0){
            this.$api.estate.getAll({
              areaId:'',
              name: '',
              orgId:that.orgList[currentItem].value
            })
              .then(res => {
                const l = []
                for (let i = 0, j = res.length; i < j; i++) {
                  l.push({
                    value: res[i].id,
                    label: res[i].name,
                  })
                }
                that.orgList[currentItem].estates = l
                console.log(that.orgList[currentItem].checked)
              })
          }
        }
        this.itemList  = key
      },

      handleSubmit() {
        const {form: {validateFields}} = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if (this.formData.id) {
              values.manager.id = this.formData.id;
            }
            this.$api.manager.saveOrUpdate(values)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description: this.title + '成功'
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