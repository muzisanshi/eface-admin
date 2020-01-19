<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.27
 * @desc 编辑
-->
<template>
  <a-modal
    title="上传人脸"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="finish('blob')"
    :maskClosable="false" :keyboard="false"
    @cancel="handleCancelImg"
  >
    <a-spin :spinning="confirmLoading">
      <div>
        <div class="info-item">
          <label class="btn btn-orange" for="uploads" style="display:inline-block;padding: 4px 10px;text-align: center;background-color: #1890ff;color: #fff;border: 1px solid transparent;border-radius: 4px;cursor: pointer">选择图片</label>
          <input type="file" id="uploads" :value="imgFile" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)"/>
          <input type="button" class="oper" style="height:32px;width:35px;font-size:18px;margin:0 5px 0 10px;background-color: #1890ff;color: #fff;border-radius: 4px;line-height: 26px;cursor: pointer;outline-offset: -4px;" value="+" title="放大" @click="changeScale(1)"/>
          <input type="button" class="oper" style="height:32px;width:35px;font-size:18px;margin:3px 5px;background-color: #1890ff;color: #fff;border-radius: 4px;line-height: 26px;cursor: pointer;outline-offset: -4px;" value="-" title="缩小" @click="changeScale(-1)"/>
          <input type="button" class="oper" style="height:32px;width:35px;font-size:18px;margin:3px 5px;background-color: #1890ff;color: #fff;border-radius: 4px;line-height: 26px;cursor: pointer;outline-offset: -4px;" value="↺" title="左旋转" @click="rotateLeft"/>
          <input type="button" class="oper" style="height:32px;width:35px;font-size:18px;margin:3px 5px;background-color: #1890ff;color: #fff;border-radius: 4px;line-height: 26px;cursor: pointer;outline-offset: -4px;" value="↻" title="右旋转" @click="rotateRight"/>
          <input type="button" class="oper" style="height:32px;width:35px;font-size:18px;margin:3px 5px;background-color: #1890ff;color: #fff;border-radius: 4px;line-height: 26px;cursor: pointer;outline-offset: -4px;" value="↓" title="下载" @click="down('blob')"/>
          <div class="line" style="margin-top: 85px;text-align: left">
            <div class="cropper-content" style="margin-top:-60px;">
              <div class="cropper">
                <vueCropper
                  v-if="isCropper"
                  ref="cropper"
                  :img="option.img"
                  :outputSize="option.size"
                  :outputType="option.outputType"
                  :info="true"
                  :full="option.full"
                  :canMove="option.canMove"
                  :canMoveBox="option.canMoveBox"
                  :original="option.original"
                  :autoCrop="option.autoCrop"
                  :autoCropWidth="option.autoCropWidth"
                  :autoCropHeight="option.autoCropHeight"
                  :fixedBox="option.fixedBox"
                  @realTime="realTime"
                  @imgLoad="imgLoad"
                ></vueCropper>
              </div>
              <div style="margin-left:20px;">
                <div class="show-preview" :style="{'width': '150px', 'height':'155px',  'overflow': 'hidden', 'margin': '5px'}">
                  <div :style="previews.div" class="preview">
                    <img :src="previews.url" :style="previews.img">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
  import { mixin } from '@/mixins/mixin'
  import { mapState } from 'vuex'
  import { ImageUpload } from '@/components'
  import { VueCropper } from 'vue-cropper'

  export default {
    mixins: [mixin],
    data () {
      return {
        confirmLoading: false,
        visible: false,
        headImg: '',
        crap: false,
        previews: {},
        option: {
          img: '',
          outputSize: 1, //剪切后的图片质量（0.1-1）
          full: false,//输出原图比例截图 props名full
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 200,
          autoCropHeight: 200,
          fixedBox: true
        },
        fileName: '',  //本机文件地址
        downImg: '#',
        imgFile: '',
        uploadImgRelaPath: '', //上传后的图片的地址（不带服务器域名）
        isCropper: false
      }
    },
    components: {
      VueCropper
    },
    computed: {
      ...mapState(['constants', 'system'])
    },
    methods: {
      add () {
        this.visible = true
        this.isCropper = true
        this.init()
      },
      init () {
        this.headImg = ''
        this.crap = false
        this.previews = {}
        this.option = {
          img: '',
          outputSize: 1,
          full: false,
          outputType: 'png',
          canMove: false,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 150,
          autoCropHeight: 150,
          fixedBox: true
        }
        this.uploadImgRelaPath = ''
        this.imgFile = ''
        this.fileName = ''
      },

      //放大/缩小
      changeScale (num) {
        num = num || 1
        this.$refs.cropper.changeScale(num)
      },

      //坐旋转
      rotateLeft () {
        this.$refs.cropper.rotateLeft()
      },

      //右旋转
      rotateRight () {
        this.$refs.cropper.rotateRight()
      },

      //上传图片（点击上传按钮）
      finish (type) {
        let that = this
        let base64 = ''
        let formData = new FormData()
        // 输出
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            let img = window.URL.createObjectURL(data)
            this.model = true
            this.headImg = img
            var reader = new FileReader()
            reader.readAsDataURL(data)
            that.confirmLoading = true
            reader.onload = function (e) {
              base64 = e.target.result
              that.$api.face.canRegister({
                imageBase64: base64
              })
                .then(resRes => {
                  formData.append('file', data, that.fileName)
                  formData.append('attOrigin', 'ADMIN')
                  formData.append('attType', 'FACE')
                  that.$api.face.upload(that.system.uploadMainUrl, formData)
                    .then(resUpl => {
                      that.$notification.success({
                        message: '成功',
                        description: `上传成功`
                      })
                      that.visible = false
                      that.$emit('uploadFace', resUpl)
                      that.isCropper = false
                      that.confirmLoading = false
                    })
                }).catch(resRes => {
                that.confirmLoading = false
              })
            }
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.model = true
            this.modelSrc = data
          })
        }
      },

      // 实时预览函数
      realTime (data) {
        this.previews = data
      },

      //下载图片
      down (type) {
        var aLink = document.createElement('a')
        aLink.download = 'author-img'
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            this.downImg = window.URL.createObjectURL(data)
            aLink.href = window.URL.createObjectURL(data)
            aLink.click()
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.downImg = data
            aLink.href = data
            aLink.click()
          })
        }
      },

      //选择本地图片
      uploadImg (e, num) {

        var _this = this
        //上传图片
        var file = e.target.files[0]

        _this.fileName = file.name.split('.')[0] + '.png'

        if (!(file.size / 1024 / 1024 < 1)) {
          this.$message.error('图片最大为1MB!')
          _this.confirmLoading = false
          return false
        }

        if (!/\.(jpg|jpeg|png|JPEG|JPG|PNG)$/.test(e.target.value)) {
          this.$message.error('图片类型必须是.jpg,jpeg,png中的一种')
          return false
        }

        var reader = new FileReader()

        reader.onload = (e) => {

          let data

          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          }
          else {
            data = e.target.result
          }
          if (num === 1) {
            _this.option.img = data
          } else if (num === 2) {
            _this.example2.img = data
          }
        }
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file)
      },

      imgLoad (msg) {
        // console.log(msg)
      },

      handleCancelImg () {
        this.visible = false
        this.isCropper = false
      },

      handleSubmit () {
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          if (!errors) {
            this.visible = false
          } else {
            this.confirmLoading = false
          }
        })
      },
    }
  }
</script>
<style lang="less">
  .cropper-content {
    display: flex;
    margin-left: 20px;
    display: -webkit-flex;
    .cropper {
      width: 250px;
      height: 250px;
    }
    .show-preview {
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      -webkit-justify-content: center;
      .preview {
        overflow: hidden;
        border: 1px solid #cccccc;
        background: #cccccc;
        margin-left: 40px;
      }
    }
  }

  .cropper-content .show-preview .preview {
    margin-left: 0;
  }

  .ant-upload-list-picture .ant-upload-list-item-name, .ant-upload-list-picture-card .ant-upload-list-item-name{
    line-height: 20px;
    margin-top: 25px;
  }
</style>
