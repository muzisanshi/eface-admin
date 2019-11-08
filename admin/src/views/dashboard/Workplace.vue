<template>
  <page-view :avatar="avatar" :title="false">
    <div slot="headerContent">
      <div class="title">{{ timeFix }}，{{ user.username }}</div>
    </div>
  </page-view>
</template>

<script>
import Vue from 'vue'
import { timeFix } from '@/utils/util'
import { mapGetters,mapMutations } from 'vuex';
import { PageView } from '@/layouts'
import HeadInfo from '@/components/tools/HeadInfo'
export default {
  name: 'Workplace',
  components: {
    PageView,
    HeadInfo
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},
    }
  },
  computed: {
    ...mapMutations(['SET_INFO']),
    userInfo () {
      if(JSON.stringify(this.$store.getters.userInfo) == '{}'){
        if(Vue.ls.get('MANAGER').username){
          return Vue.ls.get('MANAGER')
        }
      }else{
        return this.$store.getters.userInfo
      }

    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  methods: {
    ...mapGetters(['nickname']),
  },
}
</script>
