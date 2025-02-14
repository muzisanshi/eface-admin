<!--
 * @name Login.vue
 * @author lw
 * @date 2019.11.5
 * @desc 登录
-->
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
          :maxLength="64"
          size="large"
          type="text"
          placeholder=""
          v-decorator="['username',{initialValue: this.formData.username,rules: [{ required: true, message: '请输入用户名' }], validateTrigger: 'change'}]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          :maxLength="64"
          size="large"
          type="password"
          autocomplete="false"
          placeholder=""
          v-decorator="['password',{initialValue: this.formData.password,rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-row :gutter="0">
        <a-col :span="14">
          <a-form-item>
            <a-input
              :maxLength="9"
              v-decorator="['verifyCode',{rules: [{ required: true, message: '请输入密码' }]}]"
              size="large"
              type="text"
              @change="inputCodeChange"
              placeholder="请输入验证码">
              <a-icon
                slot="prefix"
                v-if="inputCodeContent==verifiedCode "
                type="smile"
                :style="{ color: 'rgba(0,0,0,.25)' }"/>
              <a-icon slot="prefix" v-else type="frown" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8" :offset="2">
          <div class="gc-canvas" style="height: 38px" @click="getCodeImg">
            <img :src="codeImgUrl" style="height: 100%;width: auto" alt="验证码">
          </div>
        </a-col>
      </a-row>

      <a-row :gutter="0">
        <a-col :span="14">
          <a-form-item>
            <a-checkbox @change="onChange" :defaultChecked="passWordChecked">记住密码</a-checkbox>
          </a-form-item>
        </a-col>
      </a-row>

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
import Vue from 'vue'
import md5 from 'md5'
import { mapActions } from 'vuex'
import { SAVE_PASSWORD } from '@/store/mutation-types'
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      state: {
        loginBtn: false
      },
      inputCodeContent: '',
      verifiedCode: '',
      inputCodeNull: true,
      codeImgUrl: '',
      passWordChecked: false,
      formData: {}
    }
  },
  created() {
    this.getCodeImg()
    if (Vue.ls.get(SAVE_PASSWORD)) {
      if (Vue.ls.get(SAVE_PASSWORD).checked) {
        this.passWordChecked = Vue.ls.get(SAVE_PASSWORD).checked
        this.formData = {
          username: Vue.ls.get(SAVE_PASSWORD).name,
          password: Vue.ls.get(SAVE_PASSWORD).password
        }
      } else {
        this.passWordChecked = false
        this.formData = {
          username: '',
          password: ''
        }
      }
    }
  },
  methods: {
    ...mapActions(['Login']),
    getCodeImg() {
      this.$api.user.genVerifyCode()
        .then(res => {
          this.codeImgUrl = res.bufferedImage
          this.form.uniqueId = res.uniqueId
        }).finally(() => {
        })
    },

    onChange(e) {
      this.passWordChecked = e.target.checked
    },

    inputCodeChange(e) {
      this.inputCodeContent = e.target.value
      if (!e.target.value || e.target.value == 0) {
        this.inputCodeNull = true
      } else {
        this.inputCodeContent = this.inputCodeContent.toLowerCase()
        this.inputCodeNull = false
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['username', 'password', 'verifyCode']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          loginParams.password = values.password
          loginParams.uniqueId = this.form.uniqueId
          Login(loginParams)
            .then((res) => this.loginSuccess(res, values))
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
    loginSuccess(res, values) {
      const that = this
      this.$router.push({ name: 'dashboard' })
      if (this.passWordChecked) {
        Vue.ls.set(SAVE_PASSWORD, {
          checked: that.passWordChecked,
          name: values.username,
          password: values.password
        })
      }
    },
    loginFailed(err) {
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
