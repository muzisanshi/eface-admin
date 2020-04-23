<template>
  <div class="logo" style="text-align: center;padding-left: 0" v-if="constants.logoData.showLogoImageToIndexPage">
    <router-link :to="{name:'dashboard'}" tag="a" style="display: block">
      <img :src="constants.logoData.logoImage?constants.logoData.logoImage.resourceFullAddress:require('../../../public/logo.png')" alt="logo" style="height: 50px;width: 200px;">
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Logo',
  components: {
  },
  computed: {
    ...mapState(['constants'])
  },
  props: {
    title: {
      type: String,
      default: 'eface后台管理',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
