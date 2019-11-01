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
        <a-button v-if="menuPermisssion" @click="menuPermisssionSelect" type="primary">菜单授权</a-button>
        <a-form :form="form">

          <a-form-item label="权限类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select showSearch placeholder="选择权限类型" @change="changePermissionType" :disabled="isEdit" optionFilterProp="children" :filterOption="filterCommonOption" :options="constants.list.permissionType" v-decorator="['permissionType', {initialValue: this.formData.permissionType?this.formData.permissionType:'',rules: [{required: true, message: '请选择权限类型！'}]}]">
            </a-select>
          </a-form-item>

          <a-form-item
            label="上级菜单"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :validate-status="validateStatus"
            :hasFeedback="true"
            :required="isButton">
            <span slot="help">{{ validateStatus=='error'?'请选择上级权限':'&nbsp;&nbsp;' }}</span>
            <a-tree-select
              showSearch
              v-decorator="['parentPermissionId', {initialValue: this.formData.parentPermissionId?this.formData.parentPermissionId+'':''}]"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" placeholder='选择上级权限'
              allowClear treeDefaultExpandAll
              @change="handleParentIdChange"

            >
              <a-tree-select-node v-for="g in treeData" :value="''+g.id" :title="g.name" :key="g.id">
                <a-tree-select-node v-if="g.children&&g.children.length>0" v-for="g1 in g.children" :value="''+g1.id" :title="g1.name" :key="g1.id">
                  <a-tree-select-node v-if="g1.children&&g1.children.length>0" v-for="g2 in g1.children" :value="''+g2.id" :title="g2.name" :key="g2.id">
                    <a-tree-select-node v-if="g2.children&&g2.children.length>0" v-for="g3 in g2.children" :value="''+g3.id" :title="g3.name" :key="g3.id">
                    </a-tree-select-node>
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select-node>
            </a-tree-select>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="编码"
            hasFeedback >
            <a-input placeholder="请输入编码" v-decorator="[ 'code', {initialValue: this.formData.code,rules: [{required: true, message: '请输入编码！'}]}]" :readOnly="disableSubmit"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="权限名称"
            hasFeedback >
            <a-input placeholder="请输入权限名称" v-decorator="[ 'name', {initialValue: this.formData.name,rules: [{required: true, message: '请输入权限名称！'}]}]" :readOnly="disableSubmit"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="授权标识">
            <a-input placeholder="如: user:list" v-decorator="[ 'sn',{initialValue: this.formData.sn}]" :readOnly="disableSubmit"/>
          </a-form-item>

          <a-form-item
            v-show="show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="资源地址">
            <a-input placeholder="请输入资源地址" v-decorator="[ 'url',{initialValue: this.formData.url}]"  :disabled="isDisabledAuth('permission:form:url')" :readOnly="disableSubmit"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="备注">
            <a-input placeholder="" v-decorator="[ 'remark',{initialValue: this.formData.remark}]" :readOnly="disableSubmit"/>
          </a-form-item>
        </a-form>
      </a-spin>
      <a-row :style="{textAlign:'right'}">
        <a-button :style="{marginRight: '8px'}" @click="handleCancel">
          关闭
        </a-button>
        <a-button :disabled="disableSubmit" @click="handleOk" type="primary">确定</a-button>
      </a-row>
    </div>
    <user-role-modal ref="modalUserRole" @checkedMenu = 'checkedMenu' :selectType="selectMenu" :initChecked="initCheckedKeys"></user-role-modal>
  </a-drawer>
</template>

<script>
  import { mapState } from 'vuex';
  import UserRoleModal from '@/views/manager/role/modules/UserRoleModal'
  import { disabledAuthFilter } from "@/utils/authFilter"
  export default {
    name: "PermissionModal",
    components: {
      UserRoleModal,
    },
    data () {
      return {
        drawerWidth:700,
        treeData:[],
        treeValue: '0-0-4',
        title:"操作",
        visible: false,
        disableSubmit:false,
        model: {
          parentId:null
        },
        localMenuType:0,
        routeSwitch:true, //是否路由菜单
        /*update_begin author:wuxianquan date:20190908 for:定义变量，初始值代表内部打开*/
        internalOrExternal:false,//菜单打开方式
        /*update_end author:wuxianquan date:20190908 for:定义变量，初始值代表内部打开*/
        keepAlive:true, //是否缓存路由
        enable:true,
        show:true,//根据菜单类型，动态显示隐藏表单元素
        menuLabel:'菜单名称',
        isButton:false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        formData:{},
        iconChooseVisible: false,
        validateStatus:"",
        parentIds:[],
        initCheckedKeys:[],
        parentPermissionId:'',
        isEdit:false,
        menuPermisssion:false,
        selectMenu:'MENU'
      }
    },
    computed:{
      ...mapState(['constants']),
    },
    created () {
      this.initDictConfig();
    },
    methods: {
      isDisabledAuth(code){
        return disabledAuthFilter(code);
      },
      loadTree(){
        let that = this;
        this.$api.permission.getPermissionTree()
          .then(res => {
            that.treeData = [];
            let treeList = res
            for(let a=0;a<treeList.length;a++){
              let temp = treeList[a];
              temp.isLeaf = temp.enable;
              that.treeData.push(temp);
            }
          })
      },
      filterCommonOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      changePermissionType(value){
        if(value == 'BUTTON'){
          this.isButton = true
        }else{
          this.isButton = false
          this.$refs.modalUserRole.show();
          this.menuPermisssion = true
        }
      },
      changeKeepAlive(checked) {
        this.keepAlive = checked
      },
      changeEnable(checked) {
        this.enable = checked
      },
      checkedMenu(menuList){
        this.parentIds = menuList;
        this.initCheckedKeys = menuList
      },
      add (record) {
        // 默认值
        this.edit(record);
        if(record && record.id){
          this.title = '修改'
          this.isEdit = true
        }else{
          this.title = '添加'
          this.isEdit = false
        }
      },
      edit (record,parentId) {
        this.form.resetFields();
        this.parentIds = [];
        this.isEdit = false
        this.initCheckedKeys = [];
        this.formData = {};
        this.menuPermisssion = false
        let that = this;
        if(record && record.id){
          this.$api.permission.getById({
            id:record.id
          })
            .then(res => {
              that.initCheckedKeys =res.menusIds
              that.formData = res.permission
              if(that.formData.permissionType == 'MENU'){
                that.menuPermisssion = true
              }
            })
        }else{
          if(parentId){
            that.formData.parentPermissionId =parentId;
          }
        }
        this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
        this.visible = true;
        this.loadTree();
      },
      close () {
        this.$emit('close');
        this.disableSubmit = false;
        this.visible = false;
      },
      menuPermisssionSelect(){
        this.$refs.modalUserRole.show();
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            if (this.formData.id) {
              values.id = this.formData.id;
            }
            let params  = {
              menuIds:this.parentIds,
              permission:values
            };
            that.confirmLoading = true;
            that.$api.permission.saveOrUpdate(params)
              .then(res => {
                that.$notification.success({
                  message: '成功',
                  description: that.title+'成功'
                })
                that.visible = false
                that.confirmLoading = false
                this.form.resetFields()
                this.$emit('ok', values)
              }).finally(() => {
              that.confirmLoading = false
            })

          }
        })
      },
      handleCancel () {
        this.close()
      },
      validateNumber(rule, value, callback){
        if(!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)){
          callback();
        }else{
          callback("请输入正整数!");
        }
      },
      selectIcons(){
        this.iconChooseVisible = true
      },
      handleIconCancel () {
        this.iconChooseVisible = false
      },
      handleIconChoose (value) {
        this.formData.icon = value
        this.form.icon = value
        this.iconChooseVisible = false
      },
      // 根据屏幕变化,设置抽屉尺寸
      resetScreenSize(){
        let screenWidth = document.body.clientWidth;
        if(screenWidth < 500){
          this.drawerWidth = screenWidth;
        }else{
          this.drawerWidth = 700;
        }
      },
      initDictConfig() {
      },

      handleParentIdChange(value) {
        if(!value){
          this.validateStatus="error"
        }else{
          this.validateStatus="success"
        }
      },
    }
  }
</script>

<style scoped>

</style>