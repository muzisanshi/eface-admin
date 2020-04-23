<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="650"
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">

    <a-form>
      <a-form-item label="所拥有的权限">
        <a-tree
          checkable
          @check="onCheck"
          :checkedKeys="checkedKeys"
          :treeData="treeData"
          @expand="onExpand"
          @select="onTreeNodeSelect"
          :selectedKeys="selectedKeys"
          :expandedKeys="expandedKeysss"
          :checkStrictly="checkStrictly">
          <span slot="hasDatarule" slot-scope="{slotTitle,ruleFlag}">
            {{ slotTitle }}<a-icon v-if="ruleFlag" type="align-left" style="margin-left:5px;color: red;"></a-icon>
          </span>
        </a-tree>
      </a-form-item>
    </a-form>

    <div class="drawer-bootom-button">
      <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>
          <a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item>
          <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
          <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
          <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
          <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
        </a-menu>
        <a-button>
          树操作
          <a-icon type="up"/>
        </a-button>
      </a-dropdown>
      <a-popconfirm title="确定放弃编辑？" @confirm="close" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>

    <role-datarule-modal ref="datarule"></role-datarule-modal>

  </a-drawer>

</template>
<script>
import RoleDataruleModal from './RoleDataruleModal.vue'

export default {
  name: 'RoleModal',
  components: {
    RoleDataruleModal
  },
  props: {
    initChecked: {
      type: Array,
      default: []
    },
    selectType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleId: '',
      treeData: [],
      defaultCheckedKeys: [],
      checkedKeys: [],
      expandedKeysss: [],
      allTreeKeys: [],
      autoExpandParent: true,
      checkStrictly: true,
      title: '角色权限配置',
      visible: false,
      loading: false,
      selectedKeys: []
    }
  },
  methods: {
    onTreeNodeSelect(id) {
      if (id && id.length > 0) {
        this.selectedKeys = id
      }
      this.$refs.datarule.show(this.selectedKeys[0], this.roleId)
    },
    onCheck(o) {
      if (this.checkStrictly) {
        this.checkedKeys = o.checked
      } else {
        this.checkedKeys = o
      }
    },
    show(roleId) {
      if (roleId) {
        this.roleId = roleId
      }
      this.visible = true
    },
    close() {
      this.reset()
      this.$emit('close')
      this.visible = false
    },
    onExpand(expandedKeys) {
      this.expandedKeysss = expandedKeys
      this.autoExpandParent = false
    },
    reset() {
      this.expandedKeysss = []
      this.checkedKeys = []
      this.defaultCheckedKeys = []
      this.loading = false
    },
    expandAll() {
      this.expandedKeysss = this.allTreeKeys
    },
    closeAll() {
      this.expandedKeysss = []
    },
    checkALL() {
      this.checkedKeys = this.allTreeKeys
    },
    cancelCheckALL() {
      // this.checkedKeys = this.defaultCheckedKeys
      this.checkedKeys = []
    },
    switchCheckStrictly(v) {
      if (v == 1) {
        this.checkStrictly = false
      } else if (v == 2) {
        this.checkStrictly = true
      }
    },
    handleCancel() {
      this.close()
    },
    handleSubmit() {
      const that = this
      that.$emit('checkedMenu', this.checkedKeys)
      this.visible = false
    },
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        node.title = node.name
        this.allTreeKeys.push(node.id)
        if (node.children.length > 0) {
          this.generateList(node.children)
        }
      }
      return data
    },

    getAllIds(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        this.allTreeKeys.push(node.id)
        if (node.children.length > 0) {
          this.getAllIds(node.children)
        }
      }
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.allTreeKeys = []
        if (this.selectType == 'MENU_BUTTON') {
          this.$api.permission.getPermissionTree()
            .then(res => {
              this.treeData = this.generateList(res)
              this.checkedKeys = this.initChecked
            })
        } else if (this.selectType == 'MENU') {
          this.$api.menu.getMenuTree()
            .then(res => {
              this.treeData = res
              this.getAllIds(res)
              this.checkedKeys = this.initChecked
            })
        }
      }
    }
  }
}

</script>
<style>

</style>
