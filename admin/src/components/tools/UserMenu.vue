<template>
  <div class="user-wrapper">
    <div class="content-box">
      <notice-icon class="action"/>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar()"/>
          <span>{{ user?user.username:'' }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0" @click="editUserInfo">
            <a-icon type="user"/>
            <span>账户设置</span>
          </a-menu-item>
          <a-menu-item key="1" @click="editPassward">
            <a-icon type="user"/>
            <span>修改密码</span>
          </a-menu-item>
          <a-menu-item key="2">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <edit-form ref="editModal" @ok="handleOk"/>
    <edit-password ref="editPasswordModal" @ok="handleOk"/>
  </div>
</template>

<script>
import Vue from 'vue'
import { MANAGER } from '@/store/mutation-types'
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import EditForm from './EditForm'
import EditPassword from './EditPassword'
export default {
  name: 'UserMenu',
  components: {
    NoticeIcon,
    EditForm,
    EditPassword
  },
  data () {
    return {
      user: {}
    }
  },
  created () {
    if (this.$store.getters.userInfo.username) {
      this.user = this.$store.getters.userInfo
    } else {
      this.user = Vue.ls.get(MANAGER)
    }
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar']),
    handleLogout () {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          return that.Logout({}).then(() => {
            window.location.reload()
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    },
    handleOk() {
      if (this.$store.getters.userInfo.username) {
        this.user = this.$store.getters.userInfo
      } else {
        this.user = Vue.ls.get(MANAGER)
      }
    },
    editUserInfo() {
      this.$refs.editModal.add()
    },

    editPassward() {
      this.$refs.editPasswordModal.add()
    }
  }
}
</script>
