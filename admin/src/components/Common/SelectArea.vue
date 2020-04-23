<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.10.21
 * @desc 选择地区（公用）
-->
<template>
  <a-cascader
    v-if="cascaderFlag"
    :options="options"
    @change="onChangeAddress"
    :loadData="loadData"
    :changeOnSelect="selectAll"
    :value="initCascader"
    placeholder="选择地区"
  />
</template>

<script>
export default {
  props: {
    initArea: {
      type: Array,
      default: []
    },
    isSelectArea: {
      type: Boolean,
      default: false
    },
    selectAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      initCascader: [],
      initCascaderName: [],
      options: [],
      num: 0,
      arr: [],
      cascaderFlag: false
    }
  },
  watch: {
    initArea(newVal) {
      // if(!newVal.length){
      //   this.initCascader = []
      // }
      // if(this.initCascader.length && this.num === 2){
      //   this.initCascader = newVal
      // }
      this.initCascader = newVal
    },
    num(newVal) {
      if (newVal == this.initCascader.length - 1) {
        this.handleAreaArr()
      }
    }
  },
  created() {
    this.initAllArea()
  },
  methods: {
    initAllArea() {
      this.cascaderFlag = false
      let that = this
      that.initCascader = []
      this.num = 0
      this.arr = []
      that.initCascaderName = []
      that.$api.area.getAllParent({}).then(res => {
        this.cascaderFlag = true
        const l = []
        for (let i = 0, j = res.length; i < j; i++) {
          l.push({
            value: res[i].id,
            label: res[i].name,
            level: res[i].level,
            isLeaf: false
          })
        }
        that.options = l
        if (that.initArea.length > 0) {
          that.initCascader = that.initArea
          that.arr = []
          that.initCascader.map((item, index) => {
            that.arr.push([])
          })
          that.getChildArea(that.initArea.length)
        }
      })
    },

    handleAreaArr() {
      let cacheData = [this.options, ...this.arr]
      if (this.initCascader.length) {
        for (let i = this.initCascader.length - 1; i >= 0; i--) {
          for (let j = cacheData[i].length - 1; j >= 0; j--) {
            if (this.initCascader[i] === cacheData[i][j].value) {
              cacheData[i][j].children = cacheData[i + 1]
            }
          }
        }
      }
      this.options = cacheData[0]
      this.initCascader = [...this.initCascader]
      this.arr = []
    },

    async getChildArea(length) {
      for (let i = 0; i < length - 1; i++) {
        await this.getChildAreaList(this.initCascader[i], i)
      }
      // this.getChildAreaList(this.initCascader[0], 0)
      // this.getChildAreaList(this.initCascader[1], 1)
    },

    getChildAreaList(id, index) {
      let that = this
      this.$api.area
        .getAll({
          parentId: id
        })
        .then(res => {
          const l = []
          if (res.length) {
            if (!res[0].hasChildren) {
              for (let k = 0, j = res.length; k < j; k++) {
                l.push({
                  value: res[k].id,
                  id: res[k].id,
                  label: res[k].name,
                  level: res[k].level,
                  isLeaf: true
                })
              }
            } else {
              for (let k = 0, j = res.length; k < j; k++) {
                l.push({
                  value: res[k].id,
                  id: res[k].id,
                  label: res[k].name,
                  level: res[k].level,
                  isLeaf: false
                })
              }
            }
          }
          that.arr[index] = l
          that.num++
          that.initCascader = [...that.initCascader]
        })
    },

    loadData(selectedOptions) {
      let that = this
      this.popupVisible = true
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true

      this.$api.area
        .getAll({
          parentId: targetOption.value
        })
        .then(res => {
          targetOption.loading = false
          const l = []
          if (res.length > 0) {
            if (!res[0].hasChildren) {
              for (let i = 0; i < res.length; i++) {
                l.push({
                  value: res[i].id,
                  label: res[i].name,
                  level: res[i].level,
                  isLeaf: true
                })
              }
            } else {
              for (let i = 0; i < res.length; i++) {
                l.push({
                  value: res[i].id,
                  label: res[i].name,
                  level: res[i].level,
                  isLeaf: false
                })
              }
            }
            targetOption.children = l
            that.options = [...that.options]
          }
        })
    },
    onChangeAddress(value, selectedOptions) {
      let areaNameArr = [],
        levelItem = []
      this.initCascader = value
      if (value.length) {
        selectedOptions.map(item => {
          areaNameArr.push(item.label)
          levelItem.push(item.level)
        })
        this.initCascaderName = areaNameArr
      } else {
        this.initCascaderName = ''
      }
      this.$emit('selectedArea', {
        value: this.initCascader,
        name: this.initCascaderName,
        level: levelItem
      })
    }
  }
}
</script>

<style>
.ant-cascader-menu:empty {
  display: none;
}
</style>
