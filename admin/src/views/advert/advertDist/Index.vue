<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.28
 * @desc 首页设置
-->
<template>
  <a-card :bordered="false" class="content">
    <a-tabs :defaultActiveKey="activeKey" @change="tabsChange">
      <a-tab-pane tab="10吋以下（含10吋）" key="1">
        <template v-for="(item,index) in windows">
          <a-form :form="item.form">
            <a-card :title="item.title" :bordered="false">
              <a-row :gutter="24">
                <a-col :span="10">
                  <a-form-item label="播放方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-radio-group name="radioGroup" :defaultValue="item.playMode">
                      <a-radio
                        :value="item.value"
                        v-for="item in constants.list.adPlayMode"
                      >{{ item.label }}</a-radio>
                    </a-radio-group>
                  </a-form-item>

                  <a-form-item label="播放内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-radio-group
                      name="radioGroup"
                      @change="onPlayTypeChange($event,index)"
                      :defaultValue="item.playType"
                    >
                      <a-radio
                        :value="item.value"
                        v-for="item in constants.list.adPlayType"
                      >{{ item.label }}</a-radio>
                    </a-radio-group>
                  </a-form-item>

                  <a-form-item label="播放时间（图片）" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-select
                      showSearch
                      allowClear
                      placeholder="选择播放时间"
                      optionFilterProp="children"
                      :filterOption="filterCommonOption"
                      :options="playTime"
                      v-decorator="['imageShowSeconds', {initialValue: item.imageShowSeconds,rules: [{required: true, message: '请选择播放时间！'}]}]"
                    ></a-select>
                  </a-form-item>

                  <a-form-item label="区域绑定" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <select-area
                      ref="selectAreaAll"
                      :initArea="initCascader"
                      @selectedArea="selectedArea($event,index)"
                      :selectAll="true"
                    ></select-area>
                  </a-form-item>

                  <a-form-item label="设备绑定" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      :read-only="true"
                      v-decorator="['deviceNames', {initialValue: '默认选择全部设备'}]"
                    />
                  </a-form-item>

                  <a-form-item label="广告列表" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input
                      @click="selectAd(item.playType, index)"
                      :read-only="true"
                      v-decorator="['adNames', {initialValue: item.adNames,rules: [{required: true, message: '请选择广告列表！'}]}]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8" style="width: 260px">
                  <div style="width: 260px;height: 300px;">
                    <div style="width: 100%;height: 100%;border: 1px solid #ccc;overflow: hidden">
                      <a-carousel
                        autoplay
                        v-if="item.adList.length>0"
                        :autoplaySpeed="autoplaySpeed"
                        :beforeChange="beforeCarChange"
                        :afterChange="afterCarChange"
                        :speed="speed"
                      >
                        <div v-for="(pro, index1) in item.adList">
                          <div style>
                            <img
                              v-if="pro.fileType === 'IMAGE' || pro.fileType === 'GIF'"
                              :src="pro.resourceFullAddress"
                              alt
                              style="width: 100%;"
                            />
                            <video
                              v-if="pro.fileType === 'VIDEO' && item.isPlay"
                              width="200"
                              height="300"
                              ref="videosOne"
                              @ended="endVideo"
                              controls
                              autoplay
                            >
                              <source :src="pro.resourceFullAddress" type="video/mp4" />
                            </video>
                          </div>
                        </div>
                        <div v-if="item.adList.length===0 || !item.adList"></div>
                      </a-carousel>
                    </div>
                  </div>

                  <div style="text-align: center;padding: 10px 0;">
                    <a-checkbox @change="onMinLookChange" :checked="checkLook">实时预览</a-checkbox>
                  </div>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="10">
                  <div style="text-align: center">
                    <a-button type="primary" @click="handleSubmit(index)">保存</a-button>
                  </div>
                </a-col>
              </a-row>
            </a-card>
          </a-form>
        </template>
      </a-tab-pane>
      <a-tab-pane tab="10吋以上" key="2">
        <a-row :gutter="24">
          <a-col :span="10">
            <template v-for="(item,index) in windows">
              <a-form :form="item.form">
                <a-card :title="item.title" :bordered="false">
                  <a-row :gutter="24">
                    <a-col :span="24">
                      <a-form-item label="播放方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-radio-group name="radioGroup" :defaultValue="item.playMode">
                          <a-radio
                            :value="item.value"
                            v-for="item in constants.list.adPlayMode"
                          >{{ item.label }}</a-radio>
                        </a-radio-group>
                      </a-form-item>

                      <a-form-item label="播放内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-radio-group
                          name="radioGroup"
                          @change="onPlayTypeChange($event,index)"
                          :defaultValue="item.playType"
                        >
                          <a-radio
                            :value="item.value"
                            v-for="item in constants.list.adPlayType"
                          >{{ item.label }}</a-radio>
                        </a-radio-group>
                      </a-form-item>

                      <a-form-item label="播放时间（图片）" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-select
                          showSearch
                          allowClear
                          placeholder="选择播放时间"
                          optionFilterProp="children"
                          :filterOption="filterCommonOption"
                          :options="playTime"
                          v-decorator="['imageShowSeconds', {initialValue: item.imageShowSeconds,rules: [{required: true, message: '请选择播放时间！'}]}]"
                        ></a-select>
                      </a-form-item>

                      <a-form-item label="区域绑定" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <select-area
                          ref="selectAreaAll"
                          :initArea="initCascader"
                          @selectedArea="selectedArea($event,index)"
                          :selectAll="true"
                        ></select-area>
                      </a-form-item>

                      <a-form-item label="设备绑定" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input
                          :read-only="true"
                          v-decorator="['deviceNames', {initialValue: '默认选择全部设备'}]"
                        />
                      </a-form-item>

                      <a-form-item label="广告列表" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <a-input
                          @click="selectAd(item.playType, index)"
                          :read-only="true"
                          v-decorator="['adNames', {initialValue: item.adNames,rules: [{required: true, message: '请选择广告列表！'}]}]"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :span="10">
                      <div style="margin-top: 10px;text-align: center">
                        <a-button type="primary" @click="handleSubmit(index)">保存</a-button>
                      </div>
                    </a-col>
                  </a-row>
                </a-card>
              </a-form>
            </template>
          </a-col>
          <a-col :span="8" style="width: 300px" :offset="2" v-if="windows.length>2">
            <div style="width: 300px;height: 700px;">
              <div style="width: 100%;height: 300px;border: 1px solid #ccc;overflow: hidden">
                <a-carousel
                  autoplay
                  v-if="windows[0].adList.length>0"
                  :autoplaySpeed="autoplaySpeed"
                  :beforeChange="beforeCarChange"
                  :afterChange="afterCarChange"
                  ref="carousel"
                  :speed="speed"
                >
                  <div v-for="(pro, index1) in windows[0].adList">
                    <div style>
                      <img
                        v-if="pro.fileType === 'IMAGE' || pro.fileType === 'GIF'"
                        :src="pro.resourceFullAddress"
                        alt
                        style="width: 100%;"
                      />
                      <video
                        v-if="pro.fileType === 'VIDEO' && windows[0].isPlay"
                        width="250"
                        height="300"
                        ref="videos"
                        controls
                        autoplay
                      >
                        <source :src="pro.resourceFullAddress" type="video/mp4" />
                      </video>
                    </div>
                  </div>
                </a-carousel>
              </div>
              <div style="display: flex;">
                <div style="width: 175px;height: 100px;border: 1px solid #ccc;overflow: hidden">
                  <a-carousel
                    autoplay
                    v-if="windows[1].adList.length>0"
                    :autoplaySpeed="autoplaySpeed"
                    :beforeChange="beforeCar2Change"
                    :afterChange="afterCar2Change"
                    :speed="speed"
                  >
                    <div v-for="(pro, index1) in windows[1].adList">
                      <div style>
                        <img
                          v-if="pro.fileType === 'IMAGE' || pro.fileType === 'GIF'"
                          :src="pro.resourceFullAddress"
                          alt
                          style="width: 100%;"
                        />
                        <video
                          v-if="pro.fileType === 'VIDEO' && windows[1].isPlay"
                          width="175"
                          height="100"
                          ref="videos"
                          controls
                          autoplay
                        >
                          <source :src="pro.resourceFullAddress" type="video/mp4" />
                        </video>
                      </div>
                    </div>
                  </a-carousel>
                </div>
                <div style="width: 125px;height: 100px;border: 1px solid #ccc;"></div>
              </div>
              <div
                style="width: 100%;height: 300px;border: 1px solid #ccc;margin-top: 10px;overflow: hidden"
              >
                <a-carousel
                  autoplay
                  v-if="windows[2].adList.length>0"
                  :autoplaySpeed="autoplaySpeed"
                  :beforeChange="beforeCar3Change"
                  :afterChange="afterCar3Change"
                  :speed="speed"
                >
                  <div v-for="(pro, index1) in windows[2].adList">
                    <div style>
                      <img
                        v-if="pro.fileType === 'IMAGE' || pro.fileType === 'GIF'"
                        :src="pro.resourceFullAddress"
                        alt
                        style="width: 100%;"
                      />
                      <video
                        v-if="pro.fileType === 'VIDEO' && windows[2].isPlay"
                        width="300"
                        height="300"
                        ref="videos"
                        controls
                        autoplay
                      >
                        <source :src="pro.resourceFullAddress" type="video/mp4" />
                      </video>
                    </div>
                  </div>
                </a-carousel>
              </div>
              <div style="text-align: center;padding: 10px 0;">
                <a-checkbox @change="onMinLookChange" :checked="checkSecLook">实时预览</a-checkbox>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
    <select-ad ref="selectAd" @selectAdSuccess="selectAdSuccess"></select-ad>
  </a-card>
</template>

<script>
import { mixin } from '@/mixins/mixin'
import { mapState } from 'vuex'
import selectArea from '@/components/Common/SelectArea.vue'
import selectAd from '@/components/Common/SelectAd.vue'
export default {
  mixins: [mixin],
  data() {
    return {
      goodsGroups: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      formData: {},
      title: '',
      activeKey: '1',
      windows: [],
      windowsMax: [],
      playTime: [
        {
          label: '1s',
          value: 1
        },
        {
          label: '2s',
          value: 2
        },
        {
          label: '3s',
          value: 3
        },
        {
          label: '4s',
          value: 4
        },
        {
          label: '5s',
          value: 5
        },
        {
          label: '6s',
          value: 6
        },
        {
          label: '7s',
          value: 7
        },
        {
          label: '8s',
          value: 8
        },
        {
          label: '9s',
          value: 9
        },
        {
          label: '10s',
          value: 10
        },
        {
          label: '15s',
          value: 15
        },
        {
          label: '20s',
          value: 20
        },
        {
          label: '30s',
          value: 30
        }
      ],
      initCascader: [],
      autoplaySpeed: 5000,
      speed: 1000,
      checkLook: true,
      checkSecLook: true
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  components: {
    selectArea,
    selectAd
  },
  computed: {
    ...mapState(['constants'])
  },
  created() {
    this.add()
  },
  methods: {
    add() {
      const that = this
      this.visible = true
      this.form.resetFields()
      this.formData = {}
      that.windows = []
      this.initCascader = []
      that.windowsMax = []
      if (this.activeKey === '1') {
        that.windows = [
          {
            form: that.$form.createForm(this),
            title: '窗口1',
            screenWindowIndex: 1,
            imageShowSeconds: that.playTime[4].value,
            adNames: '',
            maxScreenSize: 11,
            minScreenSize: 0,
            playType: that.constants.list.adPlayType[0].value,
            playMode: that.constants.list.adPlayMode[0].value,
            adList: [],
            isPlay: true
          }
        ]
      } else {
        const data = (that.windows = [
          {
            form: that.$form.createForm(this),
            title: '窗口1',
            screenWindowIndex: 0,
            imageShowSeconds: that.playTime[4].value,
            adNames: '',
            maxScreenSize: 300,
            minScreenSize: 11,
            playType: that.constants.list.adPlayType[0].value,
            playMode: that.constants.list.adPlayMode[0].value,
            adList: [],
            isPlay: true
          },
          {
            form: that.$form.createForm(this),
            title: '窗口2',
            screenWindowIndex: 1,
            maxScreenSize: 300,
            minScreenSize: 11,
            imageShowSeconds: that.playTime[4].value,
            adNames: '',
            playType: that.constants.list.adPlayType[0].value,
            playMode: that.constants.list.adPlayMode[0].value,
            adList: [],
            isPlay: true
          },
          {
            form: that.$form.createForm(this),
            title: '窗口3',
            screenWindowIndex: 3,
            maxScreenSize: 300,
            minScreenSize: 11,
            imageShowSeconds: that.playTime[4].value,
            adNames: '',
            playType: that.constants.list.adPlayType[0].value,
            playMode: that.constants.list.adPlayMode[0].value,
            adList: [],
            isPlay: true
          }
        ])
      }
    },

    tabsChange(key) {
      this.activeKey = key + ''
      this.add()
    },

    endVideo() {},

    beforeCarChange(from, to) {
      this.beforeChangeAcar(to, 0)
    },
    beforeCar2Change(from, to) {
      this.beforeChangeAcar(to, 1)
    },
    beforeCar3Change(from, to) {
      this.beforeChangeAcar(to, 2)
    },

    beforeChangeAcar(to, index) {
      // if(this.windows[index].adList.length>0){
      //   if(this.windows[index].adList[to].fileType === 'VIDEO'){
      //     this.windows[index].isPlay = true
      //   }
      // }
    },

    afterCarChange(current) {
      this.afterChangeAcar(current, 0)
    },
    afterCar2Change(current) {
      this.afterChangeAcar(current, 1)
    },
    afterCar3Change(current) {
      this.afterChangeAcar(current, 2)
    },

    afterChangeAcar(to, index) {
      // if(this.windows[index].adList.length>0) {
      //   if(this.windows[index].adList[to].fileType !== 'VIDEO'){
      //     this.windows[index].isPlay = false
      //   }
      // }
    },

    selectedArea(area, index) {
      this.initCascader = area.value
      this.windows[index].areaId = area.value[area.value.length - 1]
    },

    selectAd(playType, index) {
      if (!playType) {
        playType = this.constants.list.adPlayType[0].value
      }
      this.$refs.selectAd.add(playType, index)
    },

    onPlayTypeChange(e, index) {
      this.windows[index].playType = e.target.value
      this.windows[index].adNames = ''
      this.windows[index].adIds = []
      this.windows[index].adList = []
      this.windows[index].form.resetFields(['adNames'])
    },

    selectAdSuccess(value) {
      const that = this
      let adNames = ''
      const adIds = []
      if (value.adItem.length > 0) {
        for (let i = 0; i < value.adItem.length; i++) {
          adIds.push(value.adItem[i].id)
          if (i === value.adItem.length - 1) {
            adNames += value.adItem[i].name
          } else {
            adNames += value.adItem[i].name + ','
          }
        }
        this.windows[value.key].adNames = adNames
        this.windows[value.key].adIds = adIds
        this.windows[value.key].form.setFieldsValue({ adNames: adNames })
        if (this.activeKey === '1') {
          if (that.checkLook) {
            that.getAdDataList(adIds, value.key)
          }
        } else {
          if (that.checkSecLook) {
            that.getAdDataList(adIds, value.key)
          }
        }
      }
    },

    onMinLookChange(e) {
      const that = this
      if (this.activeKey === '1') {
        this.checkLook = e.target.checked
        if (e.target.checked) {
          this.getAdDataList(this.windows[0].adIds, 0)
        } else {
          this.windows[0].adList = []
        }
      } else {
        this.checkSecLook = e.target.checked
        if (e.target.checked) {
          this.windows.map((item, index) => {
            if (item.adIds && item.adIds.length > 0) {
              that.getAdDataList(item.adIds, index)
            }
          })
        } else {
          this.windows.map(item => {
            item.adList = []
          })
        }
      }
    },

    getAdDataList(adIds, key) {
      this.$api.ad
        .getAdItemByIds({
          adIds: adIds,
          playType: this.windows[key].playType ? this.windows[key].playType : 'ALL'
        })
        .then(res => {
          this.windows[key].adList = res
        })
        .finally(() => {})
    },

    handleSubmit(index) {
      const {
        form: { validateFields }
      } = this
      let adDistDataItem = {}
      adDistDataItem = Object.assign({}, this.windows[index])

      adDistDataItem.form.validateFields((errors, valuesItem) => {
        if (!errors) {
          adDistDataItem = Object.assign(adDistDataItem, valuesItem)
          delete adDistDataItem.form
          delete adDistDataItem.adList
          delete adDistDataItem.adNames
          delete adDistDataItem.deviceNames
          delete adDistDataItem.title
          this.$api.adDist
            .saveOrUpdate(adDistDataItem)
            .then(res => {
              this.$notification.success({
                message: '成功',
                description: '保存成功！'
              })
              this.confirmLoading = false
              this.form.resetFields()
            })
            .finally(() => {
              this.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>
<style>
.upload-img .ant-col-sm-16 .ant-form-item-children {
  display: block;
  width: 100%;
}
.upload-img .ant-col-sm-16 .ant-form-item-children > span {
  display: block !important;
  width: 100%;
  float: none !important;
  margin: 0 !important;
}
.upload-img .ant-col-sm-16 .ant-form-item-children > span > .ant-upload {
  width: 100%;
}

.ant-carousel .slick-slide {
  text-align: center;
  width: 200px;
  height: 306px;
  overflow: hidden;
  border: 1px solid #cccccc;
}

.ant-carousel .slick-slide h3 {
  color: #fff;
}
</style>
