<!--
 * @name EditForm.vue
 * @author 王刚
 * @date 2019.11.20
 * @desc 设备位置选择
-->
<template>
  <a-modal title="选择设备位置" :width="1200" :visible="visibleSelect" :confirmLoading="confirmLoadingSelect"
           @ok="handleSubmitSelect"
           @cancel="handleCancelSelect">
    <a-spin :spinning="confirmLoadingSelect">
      <location-list @selectedLocation='selectedLocation' :selectLocationStatus='selectLocationStatus'></location-list>
    </a-spin>
  </a-modal>
</template>

<script>
  import locationList from '@/views/dataCon/location/List.vue'
  export default {
    data() {
      return {
        visibleSelect: false,
        confirmLoadingSelect: false,
        locationList: [],
        selectLocationStatus: true,
        name:'',
        key:''
      }
    },
    components: {
      locationList
    },
    methods: {
      add(name,key) {
        this.visibleSelect = true
        this.selectLocationStatus = true
        this.locationList = []
        if(name){
          this.name = name
        }
        if(key){
          this.key = key
        }
      },

      selectedLocation(locationList) {
        this.locationList = locationList;
      },

      handleSubmitSelect() {
        if (this.locationList.length > 1 || this.locationList.length === 0) {
          this.$notification.error({
            message: '失败',
            description: '请选择一条设备位置！'
          })
        } else {
          this.visibleSelect = false
          this.confirmLoadingSelect = false
          this.$emit('selectSuccess', {
            locationItem:this.locationList[0],
            name:this.name,
            key:this.key
          })
          this.selectLocationStatus = false
        }
      },

      handleCancelSelect() {
        this.visibleSelect = false
      }
    }
  }
</script>
