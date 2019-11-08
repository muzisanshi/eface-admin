<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.8
 * @desc 地区管理add、edit
-->
<template>
  <a-modal
    :title="title+'地区'"
    :width="740"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['name', {initialValue: this.formData.name,rules: [{required: true, message: '请输入名称！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="级别"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <!-- <a-input v-decorator="['level', {initialValue: this.formData.level,rules: [{required: true, message: '请输入级别！'}]}]" /> -->

          <a-select
            showSearch
            placeholder="选择级别"
            optionFilterProp="children"
            :filterOption="filterCountryOption"
            v-decorator="['level', {initialValue: this.formData.level?this.formData.level:'',rules: [{required: true, message: '请选择级别！'}]}]"
          >
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="父级区域"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <!-- <a-input v-decorator="['parentArea',{initialValue: this.formData.parentArea}]" /> -->
          <a-cascader :options="options" @change="onChangeAddress" :loadData="loadData" :disabled="disabledSelectParent"
                      :value='initCascader' placeholder="选择父级区域" changeOnSelect/>
          <!-- <a-cascader :options="options1" @change="onChangeAddress" :loadData="loadData" placeholder="Please select" changeOnSelect/> -->
        </a-form-item>

        <a-form-item
          label="邮政编码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['postCode', {initialValue: this.formData.postCode,rules: [{required: true, message: '请输入邮政编码！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="简写名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['shortName', {initialValue: this.formData.shortName,rules: [{required: true, message: '请输入简写名称！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="拼英名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['pinyinName',{initialValue: this.formData.pinyinName}]"/>
        </a-form-item>

        <a-form-item
          label="拼英简写"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['pinyinShortName',{initialValue: this.formData.pinyinShortName}]"/>
        </a-form-item>

        <a-form-item
          label="是否启用"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="enable" @change="changeEnable" v-decorator="['enable']"/>
        </a-form-item>

        <a-form-item
          label="是否删除"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch :checked="deleted" @change="changeDeleted" v-decorator="['deleted']"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'

  export default {
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
        confirmLoading: false,
        title: '',
        parentId: null,
        formData: {},
        form: this.$form.createForm(this),
        addChild: false,
        disabledSelectParent: false,
        initCascader: [],
        options: [],
        levelList: [
          {}
        ]
      }
    },
    methods: {
      add(item, addChild) {
        let thiz = this;
        thiz.visible = true
        thiz.addChild = false;
        thiz.disabledSelectParent = false;
        thiz.form.resetFields()
        thiz.initCascader = [];
        thiz.options = [];
        thiz.formData = {};
        thiz.$api.area.getAllParent({})
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].shortName,
                level: res[i].level,
                isLeaf: false
              })
            }
            thiz.options = l
            if (item) {

              thiz.$api.area.getById({id: item.id})
                .then(res => {

                  if (addChild != 'addChild') {
                    thiz.title = '修改'
                    thiz.formData = res
                    // thiz.parentId = thiz.formData.parentArea?thiz.formData.parentArea.id:null
                    thiz.enable = thiz.formData.enable;
                    thiz.deleted = thiz.formData.deleted;
                  } else {
                    thiz.title = '新增下级'
                    thiz.addChild = true;
                    thiz.enable = true
                    thiz.deleted = false
                    thiz.disabledSelectParent = true;
                  }
                  if (item.parentAreaId) {
                    if (res.parentArea.parentArea) {
                      this.initCascader.push(res.parentArea.parentArea.id)
                      const cityParent = res
                      this.$api.area.getAllParentId({
                        parentAreaId: res.parentArea.parentArea.id
                      })
                        .then(res => {
                          const city = []
                          if (res.length > 0) {
                            for (let k = 0; k < thiz.options.length; k++) {
                              if (thiz.options[k].value == cityParent.parentArea.parentArea.id) {
                                for (let i = 0; i < res.length; i++) {
                                  if (thiz.options[k].level == 1) {
                                    city.push({
                                      value: res[i].id,
                                      label: res[i].shortName,
                                      level: res[i].level
                                    })
                                  } else {
                                    city.push({
                                      value: res[i].id,
                                      label: res[i].shortName,
                                      level: res[i].level
                                    })
                                  }
                                }
                                thiz.options[k].children = city
                                thiz.initCascader.push(cityParent.parentArea.id)
                                thiz.options = [...thiz.options]
                              }
                            }
                          }
                        })
                      return
                    }
                    if (res.parentArea) {
                      thiz.initCascader.push(res.parentArea.id)
                    } else {
                      thiz.initCascader = [];
                    }
                  }

                })
            } else {
              thiz.enable = true
              thiz.deleted = false
              thiz.title = '新增'
            }
          })
      },

      onChangeAddress(value) {
        this.initCascader = value;
      },

      loadData(selectedOptions) {
        let thiz = this;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        if (targetOption.level < 2) {
          targetOption.loading = true;
          this.$api.area.getAllParentId({
            parentAreaId: targetOption.value
          })
            .then(res => {
              targetOption.loading = false;
              const l = []
              if (res.length > 0) {
                for (let i = 0; i < res.length; i++) {
                  if (targetOption.level == 1) {
                    l.push({
                      value: res[i].id,
                      label: res[i].shortName,
                      level: res[i].level
                    })
                  } else {
                    l.push({
                      value: res[i].id,
                      label: res[i].shortName,
                      level: res[i].level,
                    })
                  }
                }
                targetOption.children = l
                thiz.options = [...thiz.options]
              }
            })
        }
      },
      filterCountryOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },

      handleSubmit() {
        const {form: {validateFields}} = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if (this.formData.id) {
              values.id = this.formData.id;
            }
            if (this.initCascader) {
              values.parentArea = {id: this.initCascader[this.initCascader.length - 1]}
            }
            if (!values.enable) {
              values.enable = this.enable
            }
            if (!values.deleted) {
              values.deleted = this.deleted
            }
            this.$api.area.saveOrUpdate(values)
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