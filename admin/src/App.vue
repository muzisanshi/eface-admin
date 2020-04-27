<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view v-if="isRouterAlive"/>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
import { mapActions } from 'vuex'

export default {
  mixins: [AppDeviceEnquire],
  provide () {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      locale: zhCN,
      isRouterAlive: true
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    ...mapActions(['loadConstants', 'loadLogoData']),
    init() {
      this.loadConstants() // 获取枚举
      this.loadLogoData()
    },

    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }

  }
}
</script>
<style>
  .anchorBL{
    display: none!important;
  }
  #app {
    height: 100%;
  }
  .ant-form-item{
    margin-bottom: 15px!important;
  }
</style>
