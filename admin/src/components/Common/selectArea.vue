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
        initCascaderName:['','',''],
        options: [],
      }
    },
    watch:{
      initArea(newVal){
        this.initCascader = newVal
      }
    },
    created(){
      this.initAllArea();
    },
    methods: {
      initAllArea(){
        let that = this
        that.initCascader = []
        that.initCascaderName = ['','','']
        that.$api.area.getAllParent({})
          .then(res => {
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].shortName,
                level: res[i].level,
                isLeaf: false
              })
            }
            that.options = l;
            if(that.initArea.length >0){
              that.initCascader =that.initArea
              this.$api.area.getAll({
                parentId:that.initArea[0]
              })
                .then(resProvince => {
                  const city = []
                  if(resProvince.length>0){
                    for(let k = 0; k < that.options.length; k++){
                      if(that.options[k].value == that.initArea[0]){
                        for (let i = 0; i < resProvince.length; i++){
                          city.push({
                            value: resProvince[i].id,
                            label: resProvince[i].shortName,
                            level: resProvince[i].level,
                            isLeaf: false
                          })
                        }
                        that.options[k].children = city
                        that.options = [...that.options];
                        if(that.initArea[1]){
                          this.$api.area.getAll({
                            parentId:that.initArea[1]
                          })
                            .then(resCity => {
                              const areas = []
                              if(resCity.length>0){
                                for(let j = 0; j < city.length; j++){
                                  if(city[j].value == that.initArea[1]){
                                    for (let i = 0; i < resCity.length; i++){
                                      areas.push({
                                        value: resCity[i].id,
                                        label: resCity[i].shortName,
                                        level: resCity[i].level,
                                        isLeaf: true
                                      })
                                    }
                                    that.options[k].children[j].children = areas
                                    that.options = [...that.options]
                                  }
                                }

                              }

                            })
                        }



                      }
                    }

                  }

                })
            }
          })
      },
      loadData(selectedOptions) {
        let thiz = this;
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
              if(!res[0].hasLeaf){
                for (let i = 0; i < res.length; i++) {

                  l.push({
                    value: res[i].id,
                    label: res[i].shortName,
                    level: res[i].level,
                    isLeaf: true
                  })
                }
              }else{
                for (let i = 0; i < res.length; i++) {
                  l.push({
                    value: res[i].id,
                    label: res[i].shortName,
                    level: res[i].level,
                    isLeaf: false
                  })
                }
              }
              targetOption.children = l
              thiz.options = [...thiz.options]

            }

          })
      },
      onChangeAddress(value, selectedOptions){
        let areaNameArr = [];
        this.initCascader = value;
        selectedOptions.map((item)=>{
          areaNameArr.push(item.label)
        })
        this.initCascaderName = areaNameArr
        this.$emit('selectedArea',{
          value:this.initCascader,
          name:this.initCascaderName
        })
      },
    }
  }
</script>