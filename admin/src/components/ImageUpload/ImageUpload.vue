<template>
  <div>
    <a-upload
      name="file"
      listType="picture-card"
      :showUploadList="false"
      :action="system.uploadMainUrl"
      :beforeUpload="beforeUpload"
      @change="handleChange"
      :headers="header"
      :data="data"
      accept="image/*"
    >
      <img v-if="curImageUrl" :src="curImageUrl" alt="" />
      <div v-if="!curImageUrl">
        <a-icon :type="loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">上传图片</div>
      </div>

      <div class="advice">{{ advice }}</div>
    </a-upload>
    <a-checkbox @change="onChange" :checked="config.imageCompressionParams.enable">启用压缩</a-checkbox>
    <a-slider @change="onSliderChange" :defaultValue="config.imageCompressionParams.outputQuality" :tooltipVisible="tooltipVisible&&config.imageCompressionParams.enable" :disabled="!config.imageCompressionParams.enable" :tipFormatter="tipFormatter" />
  </div>
</template>

<script>
import md5 from 'md5'
import { mapState } from 'vuex'

const SIGN = {
  clientId: 'admin',
  key: 'da74588912504563e464ffe8956de784'
}
export default {
  name: 'ImageUpload',
  props: {
    advice: {
      type: String,
      required: false
    },
    imageUrl: {
      type: String,
      default: ''
    },
    tooltipVisible: {
      type: [String, Boolean],
      default: false,
      required: false
    }
  },
  computed: {
    ...mapState(['system'])
  },
  watch: {
    imageUrl(newVal) {
      this.curImageUrl = newVal
    }
  },
  data () {
    return {
      header: {
        'X-clientId': SIGN.clientId
      },
      data: {
        jsonParam: JSON.stringify({
          attOrigin: 'ADMIN',
          attType: 'NORMAL'
        })
      },
      config: {
        imageCompressionParams: {
          enable: true,
          scale: 1,
          outputQuality: 90
        }
      },
      uploadMainUrl: null,
      loading: false,
      checked: true,
      curImageUrl: ''
    }
  },
  methods: {
    add () {
      this.visible = true
    },
    handleChange (info) {
      switch (info.file.status) {
        case 'uploading':
          this.loading = true
          break
        case 'done':
          if (info.file.response.respCode === '00') {
            this.curImageUrl = info.file.response.data.resourceFullAddress
            this.$emit('uploadSuccess', info.file.response.data)
          } else {
            this.$message.error(info.file.response.errCode + ':' + info.file.response.errDesc)
          }
          this.loading = false
          break
        case 'error':
          this.$message.error(info.file.response.status + ':' + info.file.response.error)
          this.loading = false
          break
      }
    },
    onChange (e) {
      this.config.imageCompressionParams.enable = e.target.checked
    },
    onSliderChange(value) {
      this.config.imageCompressionParams.outputQuality = value
    },
    tipFormatter(value) {
      return `图片质量：${value}%`
    },
    beforeUpload (file) {
      this.data.title = file.name
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('图片最大为1MB!')
      }
      const timestamp = new Date().getTime() + ''
      const signature = SIGN.clientId + timestamp + SIGN.key
      this.header['X-timestamp'] = timestamp
      this.header['X-signature'] = md5(signature)
      this.data['imageCompressionParams.enable'] = this.config.imageCompressionParams.enable
      this.data['imageCompressionParams.scale'] = this.config.imageCompressionParams.scale
      this.data['imageCompressionParams.outputQuality'] = this.config.imageCompressionParams.enable ? (this.config.imageCompressionParams.outputQuality / 100).toFixed(2) : 1

      return isLt1M
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.ant-upload-select-picture-card {
  i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  img {
    width: 100px;
    height: 100px
  }
  .advice{
    position: absolute;
    left: 120px;
    top: 10px;
    width: 192px
  }
}
</style>
