<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.8
 * @desc 新增（菜单管理）
-->
<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <div :style="{width: '100%',border: '1px solid #e9e9e9',padding: '10px 16px',background: '#fff',}">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="菜单名称"
            hasFeedback>
            <a-input placeholder="请输入菜单名称"
                     v-decorator="[ 'name', {initialValue: this.formData.name,rules: [{required: true, message: '请输入菜单名称！'}]}]"
                     :readOnly="disableSubmit"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="菜单标题"
            hasFeedback>
            <a-input placeholder="请输入菜单标题"
                     v-decorator="[ 'title', {initialValue: this.formData.title,rules: [{required: true, message: '请输入菜单标题！'}]}]"
                     :readOnly="disableSubmit"/>
          </a-form-item>

          <a-form-item
            label="上级菜单"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :validate-status="validateStatus"
            :hasFeedback="true"
            :required="false">
            <!--<span slot="help">{{ validateStatus=='error'?'请选择上级菜单':'&nbsp;&nbsp;' }}</span>-->


            <a-tree-select
              showSearch
              v-decorator="['parentId', {initialValue: this.formData.parentId?this.formData.parentId+'':''}]"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" placeholder='选择父级菜单'
              allowClear treeDefaultExpandAll
              @change="handleParentIdChange">
              <a-tree-select-node v-for="g in treeData" :value="''+g.id" :title="g.title" :key="g.id">
                <a-tree-select-node v-if="g.children&&g.children.length>0" v-for="g1 in g.children" :value="''+g1.id"
                                    :title="g1.title" :key="g1.id">
                  <a-tree-select-node v-if="g1.children&&g1.children.length>0" v-for="g2 in g1.children"
                                      :value="''+g2.id" :title="g2.title" :key="g2.id">
                    <a-tree-select-node v-if="g2.children&&g2.children.length>0" v-for="g3 in g2.children"
                                        :value="''+g3.id" :title="g3.title" :key="g3.id">
                    </a-tree-select-node>
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select-node>
            </a-tree-select>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="菜单路径">
            <a-input placeholder="请输入菜单路径"
                     v-decorator="[ 'path',{initialValue: this.formData.path,rules: [{required: true, message: '请输入菜单路径！'}]}]"
                     :readOnly="disableSubmit"/>
          </a-form-item>

          <a-form-item
            v-show="show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="前端组件">
            <a-input placeholder="请输入前端组件"
                     v-decorator="[ 'component',{initialValue: this.formData.component,rules: [{required: true, message: '请输入前端组件！'}]}]"
                     :readOnly="disableSubmit"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="默认跳转地址">
            <a-input placeholder="请输入路由参数 redirect" v-decorator="[ 'redirect',{initialValue: this.formData.redirect}]"
                     :readOnly="disableSubmit"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="菜单图标">
            <a-input placeholder="点击右侧按钮选择图标" v-decorator="[ 'icon',{initialValue: this.formData.icon}]"
                     :readOnly="disableSubmit">
              <a-icon slot="addonAfter" type="setting" @click="selectIcons"/>
            </a-input>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="排序">
            <a-input-number placeholder="请输入菜单排序" style="width: 200px"
                            v-decorator="[ 'orderNum',{initialValue: this.formData.orderNum,rules: [{required: true, message: '请输入菜单排序！'}]}]"
                            :readOnly="disableSubmit"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否启用">
            <a-switch :checked="enable" @change="changeEnable" v-decorator="['enable']"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否缓存路由">
            <a-switch :checked="keepAlive" @change="changeKeepAlive" v-decorator="['keepAlive']"/>
          </a-form-item>
        </a-form>

        <!-- 选择图标 -->
        <icons @choose="handleIconChoose" @close="handleIconCancel" :iconChooseVisible="iconChooseVisible"></icons>
      </a-spin>
      <a-row :style="{textAlign:'right'}">
        <a-button :style="{marginRight: '8px'}" @click="handleCancel">
          关闭
        </a-button>
        <a-button :disabled="disableSubmit" @click="handleOk" type="primary">确定</a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
  import Icons from './icon/Icons'

  export default {
    name: "PermissionModal",
    components: {Icons},
    data() {
      return {
        drawerWidth: 700,
        treeData: [],
        treeValue: '0-0-4',
        title: "操作",
        visible: false,
        disableSubmit: false,
        model: {
          parentId: null
        },
        localMenuType: 0,
        routeSwitch: true, //是否路由菜单
        /*update_begin author:wuxianquan date:20190908 for:定义变量，初始值代表内部打开*/
        internalOrExternal: false,//菜单打开方式
        /*update_end author:wuxianquan date:20190908 for:定义变量，初始值代表内部打开*/
        keepAlive: true, //是否缓存路由
        enable: true,
        show: true,//根据菜单类型，动态显示隐藏表单元素
        menuLabel: '菜单名称',
        isRequrie: true,  // 是否需要验证
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        formData: {},
        iconChooseVisible: false,
        validateStatus: ""
      }
    },
    computed: {
      validatorRules: function () {
        return {
          name: {rules: [{required: true, message: '请输入菜单标题!'}]},
          component: {rules: [{required: this.show, message: '请输入前端组件!'}]},
          path: {rules: [{required: this.show, message: '请输入菜单路径!'}]},
          orderNum: {initialValue: 1.0},
        }
      }
    },
    created() {
      this.initDictConfig();
    },
    methods: {
      loadTree() {
        let that = this;
        this.$api.menu.getMenuTree()
          .then(res => {
            that.treeData = [];
            let treeList = res
            for (let a = 0; a < treeList.length; a++) {
              let temp = treeList[a];
              temp.isLeaf = temp.enable;
              that.treeData.push(temp);
            }
          })
      },
      changeKeepAlive(checked) {
        this.keepAlive = checked
      },
      changeEnable(checked) {
        this.enable = checked
      },
      add(record) {
        // 默认值
        this.enable = true;
        this.keepAlive = true;
        this.edit(record);
        if (record && record.id) {
          this.title = '修改'
        } else {
          this.title = '添加'
        }
      },
      edit(record, parentId) {
        this.form.resetFields();
        this.formData = {};


        let that = this;
        if (record && record.id) {
          this.$api.menu.getById({
            id: record.id
          })
            .then(res => {
              that.formData = res
              that.enable = res.enable
              if (!res.parentId) {
                that.formData.parentId = ''
              }
              that.keepAlive = res.meta.keepAlive
              that.formData.icon = res.meta.icon
              that.formData.title = res.meta.title;
            })
        } else {
          if (parentId) {
            that.formData.parentId = parentId;
          }
        }
        this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
        this.visible = true;
        this.loadTree();
      },
      close() {
        this.$emit('close');
        this.disableSubmit = false;
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            if (this.formData.id) {
              values.id = this.formData.id;
            }
            if (!values.enable) {
              values.enable = this.enable
            }
            if (!values.keepAlive) {
              values.keepAlive = this.keepAlive
            }
            that.confirmLoading = true;
            that.$api.menu.saveOrUpdate(values)
              .then(res => {
                that.$notification.success({
                  message: '成功',
                  description: that.title + '成功'
                })
                that.visible = false
                that.confirmLoading = false
                this.form.resetFields()
                this.$emit('ok', values)
              }).finally(() => {
              this.confirmLoading = false
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      validateNumber(rule, value, callback) {
        if (!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)) {
          callback();
        } else {
          callback("请输入正整数!");
        }
      },
      onChangeMenuType(e) {
        this.localMenuType = e.target.value
        if (e.target.value == 2) {
          this.show = false;
          this.menuLabel = '按钮/权限';
        } else {
          this.show = true;
          this.menuLabel = '菜单名称';
        }
        this.$nextTick(() => {
          this.form.validateFields(['url', 'component'], {force: true});
        });
      },
      selectIcons() {
        this.iconChooseVisible = true
      },
      handleIconCancel() {
        this.iconChooseVisible = false
      },
      handleIconChoose(value) {
        this.formData.icon = value
        this.form.icon = value
        this.iconChooseVisible = false
      },
      // 根据屏幕变化,设置抽屉尺寸
      resetScreenSize() {
        let screenWidth = document.body.clientWidth;
        if (screenWidth < 500) {
          this.drawerWidth = screenWidth;
        } else {
          this.drawerWidth = 700;
        }
      },
      initDictConfig() {
      },
      handleParentIdChange(value) {
        if (!value) {
          this.validateStatus = "error"
        } else {
          this.validateStatus = "success"
        }
      }
    }
  }
</script>

<style scoped>

</style>