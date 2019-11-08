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

      <a-row :gutter="0">
        <a-col :span="14">
          <a-form-item>
            <a-input
              v-decorator="['verifyCode',{rules: [{ required: true, message: '请输入密码' }]}]"
              size="large"
              type="text"
              @change="inputCodeChange"
              placeholder="请输入验证码">
              <a-icon slot="prefix" v-if="inputCodeContent==verifiedCode " type="smile"
                      :style="{ color: 'rgba(0,0,0,.25)' }"/>
              <a-icon slot="prefix" v-else type="frown" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8" :offset="2">
          <div class="gc-canvas" style="height: 38px" @click="getCodeImg">
            <img :src="codeImgUrl" style="height: 100%;width: auto" alt="">
          </div>
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
  import md5 from 'md5'
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        form: this.$form.createForm(this),
        state: {
          loginBtn: false
        },
        inputCodeContent: "",
        verifiedCode: "",
        inputCodeNull: true,
        codeImgUrl: ''
      }
    },
    created() {
      this.getCodeImg();
    },
    methods: {
      ...mapActions(['Login']),
      getCodeImg() {
        this.$api.user.genVerifyCode()
          .then(res => {
            this.codeImgUrl = res.bufferedImage
            this.form.uniqueId = res.uniqueId;
          }).finally(() => {
        })
      },
      inputCodeChange(e) {
        this.inputCodeContent = e.target.value
        if (!e.target.value || 0 == e.target.value) {
          this.inputCodeNull = true
        } else {
          this.inputCodeContent = this.inputCodeContent.toLowerCase()
          this.inputCodeNull = false
        }
      },
      handleSubmit(e) {
        e.preventDefault()
        const {
          form: {validateFields},
          state,
          Login,
        } = this

        state.loginBtn = true

        const validateFieldsKey = ['username', 'password', 'verifyCode']

        validateFields(validateFieldsKey, {force: true}, (err, values) => {
          if (!err) {
            const loginParams = {...values}
            loginParams.password = values.password
            loginParams.uniqueId = this.form.uniqueId;
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
      loginSuccess(res) {
        this.$router.push({name: 'dashboard'})
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
