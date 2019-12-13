<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.10.21
 * @desc 选择地区（公用）
-->
<template>
  <a-cascader :options="options" @change="onChangeAddress" :loadData="loadData" :value='initCascader'  placeholder="选择地区"/>
</template>

<script>

  export default {
    props:{
      initArea:{
        type:Array,
        default:[]
      },
      isSelectArea:{
        type:Boolean,
        default: false
      }
    },
    data() {
      return {
        initCascader:[],
        initCascaderName:[],
        options: [],
        num:0,
        arr:[]
      }
    },
    watch:{
      initArea(newVal){
        this.initCascader = newVal
      },
      num(newVal){
        if(newVal == this.initCascader.length){
          this.handleAreaArr()
        }
      }
    },
    created(){
      this.initAllArea();
    },
    methods: {
      initAllArea(){
        let that = this
        that.initCascader = []
        this.num = 0;
        this.arr = [];
        that.initCascaderName = []
        that.$api.area.getAllParent({})
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name,
                level: res[i].level,
                isLeaf: false
              })
            }
            that.options = l;
            if(that.initArea.length >0){
              that.initCascader =that.initArea
              that.getChildArea()
            }
          })
      },

      handleAreaArr(){
        this.arr.unshift(this.options)
        let cacheData = [...this.arr]
        for (let i = this.initCascader.length-1; i >=0; i--) {
          for(let j = this.arr[i].length-1; j >= 0; j--){
            if(this.initCascader[i] === this.arr[i][j].value){
              cacheData[i][j].children = this.arr[i+1]
            }
          }
        }
        this.options = cacheData[0]
        this.initCascader = [...this.initCascader]
        this.arr = [];
      },

      getChildArea(){
        let that = this;
        for (let i = 0; i < that.initCascader.length; i++) {
          this.$api.area.getAll({
            parentId: that.initCascader[i]
          })
            .then(res => {
              const l = []
              if(res.length){
                if(!res[0].hasChildren){
                  for (let i = 0, j = res.length; i < j; i++) {
                    l.push({
                      value: res[i].id,
                      id: res[i].id,
                      label: res[i].name,
                      level: res[i].level,
                      isLeaf: true
                    })
                  }
                }else{
                  for (let i = 0, j = res.length; i < j; i++) {
                    l.push({
                      value: res[i].id,
                      id: res[i].id,
                      label: res[i].name,
                      level: res[i].level,
                      isLeaf: false
                    })
                  }
                }
              }
              that.arr[i] = l
              that.num++
            })
        }
      },


      loadData(selectedOptions) {
        let that = this;
        this.popupVisible =true;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        this.$api.area.getAll({
          parentId:targetOption.value
        })
          .then(res => {
            targetOption.loading = false;
            const l = []
            if(res.length>0){
              if(!res[0].hasChildren){
                for (let i = 0; i < res.length; i++) {

                  l.push({
                    value: res[i].id,
                    label: res[i].name,
                    level: res[i].level,
                    isLeaf: true
                  })
                }
              }else{
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
      onChangeAddress(value, selectedOptions){
        let areaNameArr = [],levelItem = [];
        this.initCascader = value;
        if(value.length){
          selectedOptions.map((item)=>{
            areaNameArr.push(item.label)
            levelItem.push(item.level)
          })
          this.initCascaderName = areaNameArr
        }else{
          this.initCascaderName = ''
        }
        this.$emit('selectedArea',{
          value:this.initCascader,
          name:this.initCascaderName,
          level:levelItem
        })
      },
    }
  }
</script>