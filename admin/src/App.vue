<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import {AppDeviceEnquire} from '@/utils/mixin'
  import {mapActions} from 'vuex';

  export default {
    mixins: [AppDeviceEnquire],
    data() {
      return {
        locale: zhCN
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      ...mapActions(['loadConstants', 'loadSystemSetting']),
      init() {
        this.loadConstants(); //获取枚举
        this.loadSystemSetting(); //获取上传地址接口
      }
    }
  }
</script>
<style>
  #app {
    height: 100%;
  }
</style>
