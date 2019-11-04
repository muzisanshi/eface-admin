<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="用户: admin"
          v-decorator="['username',{rules: [{ required: true, message: '请输入用户名' }], validateTrigger: 'change'}]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="密码: 111111"
          v-decorator="['password',{rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定
        </a-button>
      </a-form-item>

    </a-form>

  </div>
</template>

<script>
import md5 from 'md5'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      form: this.$form.createForm(this),
      state: {
        loginBtn: false
      }
    }
  },
  methods: {
    ...mapActions(['Login']),
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login,
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['username', 'password']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          loginParams.password = values.password
          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.loginFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess (res) {
      this.$router.push({ name: 'dashboard' })
    },
    loginFailed(err){
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {

  label {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

}
</style>
