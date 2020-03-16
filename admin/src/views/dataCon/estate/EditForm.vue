<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.11
 * @desc 新增修改（地产）
-->
<template>
  <a-modal
    :title="title"
    :width="1040"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :zIndex="zIndex"
    :maskClosable="false"
    :keyboard="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                :maxLength="32"
                v-decorator="['code', {initialValue: this.formData.code, rules: [{required: true, message: '请输入编码！'}]}]"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                :maxLength="64"
                v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入组织名称！'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="组织" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                showSearch
                placeholder="选择组织"
                optionFilterProp="children"
                :filterOption="filterCommonOption"
                :options="orgList"
                v-decorator="['orgId', {initialValue: this.formData.orgId?this.formData.orgId:'',rules: [{required: true, message: '请选择组织！'}]}]"
              ></a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="选择地区" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
              <select-area ref="selectArea" :initArea="initCascader" @selectedArea="selectedArea"></select-area>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <!-- <a-form-item label="街道办" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input @click="selectStreetOffice" :read-only="true" v-decorator="['streetOfficeName', {initialValue: this.formData.streetOfficeName}]">
                <a-icon slot="suffix" @click="clearStreetOffice" type="close" style="color: rgba(0, 0, 0, 0.25);"/>
                <a-icon slot="addonAfter" @click="addStreetOffice" type="plus"/>
              </a-input>
            </a-form-item>-->

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
          </a-col>

          <a-col :span="12">
            <a-form-item label="详细地址" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
              <a-input
                :maxLength="255"
                id="detailAddress"
                class="ant-input"
                style="position: relative;"
                v-model="inputChange"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="经度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :disabled="true" v-model="longitude" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="纬度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :disabled="true" v-model="latitude" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :maxLength="255" v-decorator="['remark',{initialValue: this.formData.remark}]" />
            </a-form-item>
          </a-col>
        </a-row>

        <select-street-office ref="selectStreetOffice" :initArea="initCascader" @selectSuccess="selectSuccess"></select-street-office>

        <add-street-office ref="addStreetOffice" :initArea="initCascader" @addSuccess="selectSuccess"></add-street-office>

        <div id="allmap" style="width:100%;height:300px;"></div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { mixin } from '@/mixins/mixin'
import selectArea from '@/components/Common/SelectArea.vue'
import selectStreetOffice from '@/components/Common/SelectStreetOffice.vue'
// import addStreetOffice from '@/views/system/streetOffice/modules/EditForm.vue'
import addStreetOffice from '@/views/system/street/modules/EditForm.vue'
export default {
  mixins: [mixin],
  components: {
    selectArea,
    selectStreetOffice,
    addStreetOffice
  },
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
      confirmLoading: false,

      uploadFileId: '',
      formData: {
        areaId: []
      },
      title: '',
      enable: true,
      form: this.$form.createForm(this),
      countries: [],
      initCascader: [],
      options: [],
      data: {},
      provinceList: '',
      map: null,
      currentAddress: null,
      inputChange: '',
      longitude: '',
      latitude: '',
      isChangeClone: true,
      orgList: [],
      visible: true,
      zIndex: 1,
      isClickMap: false,
      streetList: [],
      areaId: '',
      name: ''
    }
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

    selectSuccess(value) {
      console.log(value)
      this.formData.streetName = value.name
      this.formData.streetId = value.id
      this.form.setFieldsValue({ streetName: value.name })
    },

    selectStreetOffice() {
      this.$refs.selectStreetOffice.selectStreetOffice()
    },

    addStreetOffice() {
      this.$refs.addStreetOffice.add()
    },

    add(item) {
      this.zIndex = 10
      let that = this
      this.visible = true
      this.streetList = []
      this.areaId = ''
      this.name = ''
      this.form.resetFields()
      this.formData = {
        areaId: []
      }
      this.initCascader = []
      this.options = []
      this.latitude = ''
      this.longitude = ''
      this.inputChange = ''
      this.$api.org.getAll({}).then(res => {
        const l = []
        for (let i = 0, j = res.length; i < j; i++) {
          l.push({
            value: res[i].id,
            label: res[i].name
          })
        }
        this.orgList = l
      })

      if (item) {
        this.title = '修改'
        this.$api.estate.getById({ id: item.id }).then(res => {
          this.formData = res
          that.isChangeClone = false
          that.inputChange = res.fullAddress
          that.latitude = res.lat
          that.longitude = res.lng

          that.longitude = res.lng
          if (res.areas.length) {
            for (let i = res.areas.length - 1; i >= 0; i--) {
              that.initCascader.push(res.areas[i].id)
            }
            that.$refs.selectArea.initAllArea()
          }
          this.areaId = res.areas[0].id
          that.getStreetList()
        })
      } else {
        this.enable = true
        this.title = '新增'
        that.$refs.selectArea.initAllArea()
      }
    },

    selectedArea(area) {
      if (area.value.length) {
        this.initCascader = area.value
        this.inputChange = area.name.join('')
        this.areaId = this.initCascader[this.initCascader.length - 1]
        this.getStreetList()
      } else {
        this.initCascader = []
        this.inputChange = ''
        this.latitude = ''
        this.longitude = ''
      }
    },

    clearStreetOffice() {
      this.formData.streetName = ''
      this.formData.streetId = ''
      this.form.resetFields(['streetName'])
    },

    addressChange(val) {
      let that = this
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
        var ac = new BMap.Autocomplete({ //建立一个自动完成的对象
          input: 'detailAddress',
          location: map
        })
        var myValue
        ac.addEventListener('onconfirm', function(e) {
          //鼠标点击下拉列表后的事件
          var _value = e.item.value
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business

          that.setPlace(myValue)
        })
      }
    },
    setPlace(myValue) {
      let that = this
      var map = this.map
      map.clearOverlays() //清除地图上所有覆盖物
      function myFun(e) {
        var pp = local.getResults().getPoi(0).point //获取第一个智能搜索的结果

        that.longitude = pp.lng
        that.latitude = pp.lat
        console.log(that.longitude, that.latitude)
        map.centerAndZoom(pp, 18)
        map.addOverlay(new BMap.Marker(pp)) //添加标注
      }

      var local = new BMap.LocalSearch(map, {
        //智能搜索
        onSearchComplete: myFun
      })
      local.search(myValue)
      that.inputChange = ''
      that.inputChange = myValue
    },

    createMap() {
      let that = this

      this.map = new BMap.Map('allmap') // 创建Map实例
      this.map.centerAndZoom('成都', 12) // 初始化地图,用城市名设置地图中心点
      this.map.enableScrollWheelZoom(true) //开启鼠标滚轮缩放
      //mp.enableScrollWheelZoom();
      this.map.enableInertialDragging()
      this.map.enableContinuousZoom()

      //添加城市切换
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
      this.map.addControl(navigationControl)

      // 添加定位控件
      var geolocationControl = new BMap.GeolocationControl()
      this.map.addControl(geolocationControl)

      var geoc = new BMap.Geocoder()
      //填加鼠标点击事件
      this.map.addEventListener('click', e => {
        that.longitude = e.point.lng
        that.latitude = e.point.lat

        this.map.clearOverlays()
        var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)) // 创建点
        this.map.addOverlay(marker) //增加点

        geoc.getLocation(e.point, function(rs) {
          let addComp = rs.addressComponents
          that.inputChange = ''
          that.inputChange =
            addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber + ''
          that.isClickMap = true
        })
      })
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

          values.fullAddress = this.inputChange
          if (!values.fullAddress) {
            this.$notification.error({
              message: '提示',
              description: '请填写详细地址！'
            })
            this.confirmLoading = false
            return false
          }

          if (this.formData.streetId) {
            values.streetId = this.formData.streetId
          }

          if (this.formData.streetName) {
            values.streetName = this.formData.streetName
          }
          this.$api.estate
            .saveOrUpdate(values)
            .then(res => {
              this.$notification.success({
                message: '成功',
                description: this.title + '成功'
              })
              this.visible = false
              this.confirmLoading = false
              this.form.resetFields()
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
      console.log(value)
      console.log(option)
      this.formData.streetId = value
      this.formData.streetName = option.componentOptions.children[0].text
    },
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