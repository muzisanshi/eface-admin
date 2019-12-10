<template>
  <div class="logo" style="text-align: center;padding-left: 0">
    <router-link :to="{name:'dashboard'}">
      <img v-if="constants.logoData.showLogoImageToIndexPage" :src="constants.logoData.logoImage.resourceFullAddress" alt="logo" style="height: 50px;">
    </router-link>
  </div>
</template>

<script>
import {mapState} from 'vuex';
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
