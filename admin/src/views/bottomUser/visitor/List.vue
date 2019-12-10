<!--
 * @name List.vue
 * @author lw
 * @date 2019.11.27
 * @desc 业主
-->
<template>
  <div>
    <user-List :userType="userType"></user-List>
  </div>
</template>

<script>
import userList from '../owner/List'
import {mixin} from '@/mixins/mixin'
import {mapState} from 'vuex';
export default {
  mixins:[mixin],
  components: {
    userList

  },
  computed: {
    ...mapState(['constants']),
  },
  data () {
    return {
      userType:'VISITOR'
    }
  },
  methods: {

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
