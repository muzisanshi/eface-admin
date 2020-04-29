<!--
 * @name CreateForm.vue
 * @author lw
 * @date 2019.11.6
 * @desc 新增（主控单位）
-->
<template>
  <a-modal
    :title="title"
    :width="1040"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :zIndex="zIndex"
    :maskClosable="false"
    :keyboard="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!-- <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="头像"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <div style="width: 60px;height: 60px;border: 1px solid #cccccc;overflow: hidden;display: inline-block;border-radius: 50%">
                <img :src="topImg" alt="" style="width: 100%;">
              </div>
              <a-upload
                :action="system.uploadMainUrl"
                listType="picture"
                style="margin-left: 10px;display: inline-block;float: right;margin-top: 10px;"
                :showUploadList="false"
                accept="image/*"
                :headers="clientHeader"
                :data="imgData"
                :beforeUpload="beforeUpload"
                @change="handleChange"
              >
                <a-button>
                  <a-icon type="upload"/>浏览添加
                </a-button>
                <a-button type="primary" v-if="topImg" style="margin-left: 10px" @click.stop="delImage">删除</a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>-->
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="单位简称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                :maxLength="255"
                v-decorator="['shortName',{initialValue: this.formData.shortName, rules: [{required: true, message: '请选择单位简称！'}]}]"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="单位全称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                :maxLength="255"
                v-decorator="['name',{initialValue: this.formData.name, rules: [{required: true, message: '请选择单位全称！'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="选择地区"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :required="true"
            >
              <select-area ref="selectArea" :initArea="initCascader" @selectedArea="selectedArea"></select-area>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-item label="街道" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                showSearch
                placeholder="选择街道"
                optionFilterProp="children"
                :filterOption="filterCommonOption"
                :options="streetList"
                @change="streetChange"
                v-decorator="['streetName', {initialValue: this.formData.streetName, rules: [{required: true, message: '请选择街道！'}]}]"
              ></a-select>
            </a-form-item>
          </a-col>-->
          <a-col :span="12">
            <a-form-item
              label="单位地址"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :required="true"
            >
              <a-input :maxLength="255" id="detailAddress" class="ant-input" v-model="inputChange" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="经度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input id="longitude" :disabled="true" v-model="longitude" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="纬度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input id="latitude" :disabled="true" v-model="latitude" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="行政等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                showSearch
                allowClear
                placeholder="选择行政等级"
                optionFilterProp="children"
                :filterOption="filterCommonOption"
                :options="constants.list.orgLevel"
                v-decorator="['level', {initialValue: this.formData.level,rules: [{required: true, message: '请选择行政等级！'}]}]"
              ></a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch :checked="enable" @change="changeEnable" v-decorator="['enable']" />
            </a-form-item>
          </a-col>
        </a-row>

        <div id="allmap" style="width:100%;height:350px;margin-bottom: 15px"></div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex'
import { ImageUpload } from '@/components'
import { mixin } from '@/mixins/mixin'
import selectArea from '@/components/Common/SelectArea'

export default {
  components: {
    ImageUpload,
    selectArea
  },
  mixins: [mixin],
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: true,
      confirmLoading: false,

      uploadFileId: '',
      formData: {},
      title: '',
      form: this.$form.createForm(this),
      initCascader: [],
      options: [],
      data: {},
      map: null,
      currentAddress: null,
      inputChange: '',
      longitude: '',
      latitude: '',
      isChangeClone: true,
      topImg: '',
      headImageAttId: null,
      zIndex: 1,
      imgData: {
        jsonParam: JSON.stringify({
          attOrigin: 'ADMIN',
          attType: 'HEAD_IMAGE'
        })
      },
      isClickMap: false,

      code: '', // 编码
      enable: true,
      areaId: '',
      streetList: [],
      streetName: '',
      streetId: ''
    }
  },
  computed: {
    ...mapState(['constants', 'system'])
  },
  watch: {
    inputChange(newVal) {
      if (!this.isClickMap) {
        this.addressChange(newVal)
      } else {
        this.isClickMap = false
      }
    }
  },
  methods: {
    onUploadSuccess(id) {
      this.uploadFileId = id
    },

    onChangeAddress(value) {
      this.initCascader = value
    },

    selectedArea(area) {
      if (area.value.length) {
        this.initCascader = area.value
        this.inputChange = area.name.join('')
        this.areaId = this.initCascader[this.initCascader.length - 1]
        // this.getStreetList()
      } else {
        this.initCascader = []
        this.inputChange = ''
        this.latitude = ''
        this.longitude = ''
      }
    },

    delImage() {
      this.topImg = ''
      this.headImageAttId = ''
    },

    handleChange(info) {
      const that = this
      switch (info.file.status) {
        case 'uploading':
          this.loading = true
          break
        case 'done':
          if (info.file.response.success) {
            that.topImg = info.file.response.data.resourceFullAddress
            that.headImageAttId = info.file.response.data.id
            that.confirmLoading = false
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

    add(item) {
      this.zIndex = 10
      const that = this
      this.visible = true
      this.form.resetFields()
      this.formData = {}
      this.initCascader = []
      this.options = []
      this.latitude = ''
      this.longitude = ''
      this.inputChange = ''
      this.headImageAttId = null
      this.topImg = null

      this.streetList = []

      if (item) {
        const that = this
        this.title = '编辑'
        this.$api.org.getById({ id: item.id }).then(res => {
          this.formData = res
          that.isChangeClone = false
          that.inputChange = res.address
          that.latitude = res.lat
          that.longitude = res.lng
          that.topImg = res.resourceFullAddress
          that.headImageAttId = res.attId

          this.code = res.code
          this.enable = this.formData.enable
          this.streetId = this.formData.streetId
          this.streetName = this.formData.streetName
          if (res.areas.length) {
            for (let i = res.areas.length - 1; i >= 0; i--) {
              that.initCascader.push(res.areas[i].id)
            }
            that.$refs.selectArea.initAllArea()
          }
        })
      } else {
        this.title = '新增'
        this.$refs.selectArea.initAllArea()

        this.enable = true
      }
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.formData.id) {
            values.id = this.formData.id
          }

          if (!values.enable) {
            values.enable = this.enable
          }
          values.lat = this.latitude
          values.lng = this.longitude

          if (this.initCascader.length > 0) {
            values.areaId = this.initCascader[this.initCascader.length - 1]
          } else {
            this.$notification.error({
              message: '提示',
              description: '请选择地区！'
            })
            this.confirmLoading = false
            return false
          }
          values.address = this.inputChange
          if (!values.address) {
            this.$notification.error({
              message: '提示',
              description: '请填写单位地址！'
            })
            this.confirmLoading = false
            return false
          }
          // values.headImageAttId = this.headImageAttId

          // values.streetId = this.streetId
          // values.streetName = this.streetName

          this.$api.org
            .saveOrUpdate(values)
            .then(res => {
              this.$notification.success({
                message: '成功',
                description: this.title + '成功'
              })
              this.visible = false
              this.confirmLoading = false
              // this.form.resetFields()
              this.$emit('ok', values)
            })
            .finally(() => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
    },

    addressChange(val) {
      const that = this
      that.isClickMap = false
      if (val) {
        // if(that.isChangeClone){
        //   that.latitude = '';
        //   that.longitude = '';
        // }
        that.isChangeClone = true

        var myGeo = new BMap.Geocoder()
        var map = this.map

        myGeo.getPoint(val, function(point) {
          if (point) {
            map.clearOverlays()
            map.centerAndZoom(point, 12)
            map.addOverlay(new BMap.Marker(point))
          }
        })

        // 建立一个自动完成的对象
        var ac = new BMap.Autocomplete({
          input: 'detailAddress',
          location: map
        })
        ac.addEventListener('onhighlight', function(e) {
          // 鼠标放在下拉列表上的事件
        })

        ac.addEventListener('onconfirm', function(e) {
          // 鼠标点击下拉列表后的事件
          var _value = e.item.value
          that.setPlace(_value.province + _value.city + _value.district + _value.street + _value.business)
        })
      }
    },

    setPlace(myValue) {
      const that = this
      var map = this.map
      map.clearOverlays() // 清除地图上所有覆盖物
      function myFun(e) {
        var pp = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果

        that.longitude = pp.lng
        that.latitude = pp.lat

        map.centerAndZoom(pp, 18)
        map.addOverlay(new BMap.Marker(pp)) // 添加标注
      }

      var local = new BMap.LocalSearch(map, {
        // 智能搜索
        onSearchComplete: myFun
      })
      local.search(myValue)
      that.inputChange = myValue
    },

    createMap() {
      const that = this

      this.map = new BMap.Map('allmap') // 创建Map实例
      this.map.centerAndZoom('成都', 12) // 初始化地图,用城市名设置地图中心点
      this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
      this.map.enableInertialDragging()
      this.map.enableContinuousZoom()

      // 添加城市切换
      var size = new BMap.Size(10, 20)

      this.map.addControl(
        new BMap.CityListControl({
          anchor: BMAP_ANCHOR_TOP_LEFT,
          offset: size
        })
      )

      // 添加带有定位的导航控件
      var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
      })

      // 添加定位控件
      var geolocationControl = new BMap.GeolocationControl()

      this.map.addControl(navigationControl)
      this.map.addControl(geolocationControl)

      var geoc = new BMap.Geocoder()

      // 填加鼠标点击事件
      this.map.addEventListener('click', e => {
        // alert(e.point.lng + "," + e.point.lat);
        // debugger
        that.longitude = e.point.lng
        that.latitude = e.point.lat

        this.map.clearOverlays()

        var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)) // 创建点

        this.map.addOverlay(marker) // 增加点

        geoc.getLocation(e.point, function(rs) {
          const addComp = rs.addressComponents
          that.inputChange =
            addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber + ''
          that.isClickMap = true
        })
      })
    },

    // 获取编码
    getCode() {
      this.$api.org.getMaxCode().then(res => {
        this.code = res
      })
    },

    getStreetList() {
      const that = this
      if (!that.areaId && !that.name) {
      } else {
        this.$api.street
          .getAll({
            name: that.name,
            areaId: that.areaId
          })
          .then(res => {
            console.log(res)
            const l = []
            for (let i = 0, j = res.length; i < j; i++) {
              l.push({
                value: res[i].id,
                label: res[i].name
              })
            }
            this.streetList = l
          })
      }
    },

    streetChange(value, option) {
      // this.formData.streetId = value
      // this.formData.streetName = option.componentOptions.children[0].text
      this.streetId = value
      this.streetName = option.componentOptions.children[0].text
    }
  },
  mounted() {
    this.zIndex = -10
    this.createMap()
    this.visible = false
  }
}
</script>
<style>
.tangram-suggestion-main {
  z-index: 1000 !important;
}

#detailAddress {
  touch-action: manipulation;
  -webkit-appearance: none;
}
</style>
