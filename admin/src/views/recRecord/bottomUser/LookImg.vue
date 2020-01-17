<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.12.11
 * @desc 查看截图
-->
<template>
  <a-modal
    title="查看图片"
    :width="340"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div style="text-align: center">
        <img :src="imgUrl" style="width: 100%" alt="">
      </div>

    </a-spin>
    <template slot="footer">
      <a-button key="submit" type="primary" :confirmLoading="confirmLoading" @click="handleCancel">
        关闭
      </a-button>
    </template>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'
  export default {
    mixins:[mixin],
    data() {
      return {
        visible: false,
        confirmLoading: false,
        imgUrl:''
      }
    },
    methods: {
      add(item) {
        let that = this
        that.imgUrl = ''
        that.$api.recRecord.getRecImage({
          id: item.id,
          recDatetime:item.recDatetime,
        })
          .then(res => {
            if(!res.recImageResourceFullAddress && !res.recImageBase64){
              that.$notification.error({
                message: '提示',
                description:'暂无截图'
              })
            }else{
              that.visible = true
              if(res.recImageResourceFullAddress){
                that.imgUrl = res.recImageResourceFullAddress
              }
              if(res.recImageBase64){
                that.imgUrl = res.recImageBase64
              }
            }
          })
      },
    }
  }
</script>