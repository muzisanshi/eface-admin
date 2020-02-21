<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.18
 * @desc 设备型号
-->
<template>
  <a-card :bordered="false" class="content">

    <div class="table-operator">

      <a-button type="primary" @click="allScreen">全屏展示</a-button>

    </div>

    <epidemic-situation></epidemic-situation>

  </a-card>
</template>

<script>
import {mixin} from '@/mixins/mixin'
import EpidemicSituation from './EpidemicSituation'
export default {
  mixins:[mixin],
  data () {
    return {

    }
  },
  components: {
    EpidemicSituation
  },
  methods: {

    allScreen(){
      this.$router.push({
        name:'epidemicSituation'
      })
    },

  }
}
</script>
<style scoped>
.hasBack{
  background-color:#b75757;
}
.hasBack td {
  color:#fff;
}
  .table-page-search-wrapper .ant-col-sm-24{
    padding: 0 10px!important;
  }
</style>
