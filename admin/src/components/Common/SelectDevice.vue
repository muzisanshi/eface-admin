<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.20
 * @desc 设备位置选择
-->
<template>
  <a-modal title="选择设备位置" :width="1300" :visible="visibleSelect" :confirmLoading="confirmLoadingSelect"
           @ok="handleSubmitSelect"
           @cancel="handleCancelSelect">
    <a-spin :spinning="confirmLoadingSelect">
      <device-list @selectedDevice='selectedDevice' :selectDeviceStatus='selectDeviceStatus'></device-list>
    </a-spin>
  </a-modal>
</template>

<script>
  import deviceList from '@/views/device/device/List.vue'
  export default {
    data() {
      return {
        visibleSelect: false,
        confirmLoadingSelect: false,
        deviceList: [],
        selectDeviceStatus: true,
        name:'',
        _index:''
      }
    },
    components: {
      deviceList
    },
    methods: {
      add(index) {
        this.visibleSelect = true
        this.selectDeviceStatus = true
        this.deviceList = []
        this._index = index
        console.log(this._index)
      },

      selectedDevice(deviceList) {
        this.deviceList = deviceList;
      },

      handleSubmitSelect() {
        if (this.deviceList.length === 0) {
          this.$notification.error({
            message: '失败',
            description: '至少选择一条设备位置！'
          })
        } else {
          this.visibleSelect = false
          this.confirmLoadingSelect = false
          this.$emit('selectDeviceSuccess', {
            deviceItem:this.deviceList,
            key:this._index
          })
          this.selectDeviceStatus = false
        }
      },

      handleCancelSelect() {
        this.visibleSelect = false
        this.selectAdStatus = false
      }
    }
  }
</script>
