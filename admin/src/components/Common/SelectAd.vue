<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.12.6
 * @desc 广告列表选择
-->
<template>
  <a-modal
    title="选择广告"
    :width="1300"
    :visible="visibleSelect"
    :confirmLoading="confirmLoadingSelect"
    @ok="handleSubmitSelect"
    @cancel="handleCancelSelect">
    <a-spin :spinning="confirmLoadingSelect">
      <ad-list @selectedAd="selectedAd" :playType="playType" :selectAdStatus="selectAdStatus"></ad-list>
    </a-spin>
  </a-modal>
</template>

<script>
import adList from '@/views/advert/advertList/List'
export default {
  data() {
    return {
      visibleSelect: false,
      confirmLoadingSelect: false,
      adList: [],
      selectAdStatus: true,
      name: '',
      _index: '',
      playType: ''
    }
  },
  components: {
    adList
  },
  methods: {
    add(playType, index) {
      this.visibleSelect = true
      this.selectAdStatus = true
      this.adList = []
      this.playType = playType
      this._index = index
    },

    selectedAd(adList) {
      this.adList = adList
    },

    handleSubmitSelect() {
      if (this.adList.length === 0) {
        this.$notification.error({
          message: '失败',
          description: '至少选择一条设备位置！'
        })
      } else {
        this.visibleSelect = false
        this.confirmLoadingSelect = false
        this.$emit('selectAdSuccess', {
          adItem: this.adList,
          key: this._index
        })
        this.selectAdStatus = false
      }
    },

    handleCancelSelect() {
      this.visibleSelect = false
      this.selectAdStatus = false
    }
  }
}
</script>
