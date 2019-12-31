<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.12.5
 * @desc 底库用户选择lie
-->
<template>
  <a-modal title="选择用户" :width="1200" :visible="visibleSelect" :confirmLoading="confirmLoadingSelect"
           @ok="handleSubmitSelect"
           @cancel="handleCancelSelect">
    <a-spin :spinning="confirmLoadingSelect">
      <user-list @selectedUser='selectedUser' :selectUserStatus='selectUserStatus'></user-list>
    </a-spin>
  </a-modal>
</template>

<script>

  import userList from './UserList'
  export default {
    data() {
      return {
        visibleSelect: false,
        confirmLoadingSelect: false,
        userList: [],
        selectUserStatus: true,
        isShow:false
      }
    },
    components: {
      userList
    },
    methods: {
      add() {
        this.visibleSelect = true
        this.selectUserStatus = true
        this.userList = []
      },

      selectedUser(userList) {
        this.userList = userList;
      },

      handleSubmitSelect() {
        if (this.userList.length > 1 || this.userList.length === 0) {
          this.$notification.error({
            message: '失败',
            description: '请选择一条用户信息！'
          })
        } else {
          this.visibleSelect = false
          this.confirmLoadingSelect = false
          this.$emit('selectUserSuccess', {
            userItem:this.userList[0],
          })
          this.selectUserStatus = false
        }
      },

      handleCancelSelect() {
        this.visibleSelect = false
      }
    }
  }
</script>
