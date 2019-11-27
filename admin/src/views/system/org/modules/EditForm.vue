<!--
 * @name CreateForm.vue
 * @author lw
 * @date 2019.11.6
 * @desc 新增（组织管理）
-->
<template>
  <a-modal :title="title" :width="1040" :visible="visible" :confirmLoading="confirmLoading" :zIndex="zIndex" :maskClosable="false" @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="10">
            <a-form-item
              label="头像"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <div style="width: 60px;height: 60px;border: 1px solid #cccccc;overflow: hidden;display: inline-block;border-radius: 50%"><img
                :src="topImg" alt="" style="width: 100%;"></div>
              <a-upload
                :action="system.uploadMainUrl"
                listType="picture"
                style="margin-left: 10px;display: inline-block;float: right;margin-top: 10px;"
                :showUploadList="false"
                accept="image/*"
                :beforeUpload="beforeUpload"
                @change="handleChange"
              >
                <a-button>
                  <a-icon type="upload"/>
                  浏览添加
                </a-button>
              </a-upload>

            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="组织名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入组织名称！'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['code', {initialValue: this.formData.code, rules: [{required: true, message: '请输入编码！'}]}]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="选择地区"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <select-area ref="selectArea" :initArea="initCascader" @selectedArea="selectedArea"></select-area>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="详细地址" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
              <input id="detailAddress" class="ant-input" v-model="inputChange"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="经度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input id="longitude" :disabled="true" v-model="longitude"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="纬度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input id="latitude" :disabled="true" v-model="latitude"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remark',{initialValue: this.formData.remark}]"/>
            </a-form-item>
          </a-col>
        </a-row>

        <div id='allmap' style="width:100%;height:350px;margin-bottom: 15px"></div>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {mapState} from 'vuex';
  import {ImageUpload} from '@/components'
  import {mixin} from '@/mixins/mixin'
  import selectArea from '@/components/Common/selectArea'
  import ARow from "ant-design-vue/es/grid/Row";
  export default {
    components: {
      ARow,
      ImageUpload,selectArea
    },
    mixins: [mixin],
    data() {
      return {
        labelCol: {
          xs: {span: 24},
          sm: {span: 7}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 13}
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
        zIndex:1
      }
    },
    computed: {
      ...mapState(['constants', 'system'])
    },
    watch: {
      inputChange(newVal) {
        this.addressChange(newVal)
      },
    },
    methods: {

      onUploadSuccess(id) {
        this.uploadFileId = id
      },

      onChangeAddress(value) {
        this.initCascader = value;
      },

      selectedArea(area) {
        this.initCascader = area.value;
        this.inputChange = area.name.join('')
      },

      handleChange(info) {
        let that = this;
        switch (info.file.status) {
          case 'uploading':
            this.loading = true
            break
          case 'done':
            if ('00' === info.file.response.respCode) {
              // this.imageUrl = info.file.response.data.resourceFullAddress
              // this.$emit('uploadSuccess', info.file.response.data)
              that.topImg = info.file.response.data.resourceFullAddress
              that.headImageAttId = info.file.response.data.id

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

      beforeUpload(file) {
        this.data.title = file.name
        return true
      },

      add(item) {
        this.zIndex = 10
        let that = this;
        this.visible = true
        this.form.resetFields()
        this.formData = {};
        this.initCascader = []
        this.options = [];
        this.latitude = '';
        this.longitude = '';
        this.inputChange = '';
        this.headImageAttId = null;
        this.topImg = null;

        if (item) {
          let that = this;
          this.title = '修改'
          this.$api.org.getById({id: item.id})
            .then(res => {
              this.formData = res
              that.isChangeClone = false
              that.inputChange = res.address;
              that.latitude = res.lat;
              that.longitude = res.lng;

              that.longitude = res.lng;
              that.topImg = res.resourceFullAddress;
              that.headImageAttId = res.attId;
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
        }
      },
      handleSubmit() {
        const {form: {validateFields}} = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            if (this.formData.id) {
              values.id = this.formData.id;
            }
            values.lat = this.latitude;
            values.lng = this.longitude;
            values.address = this.inputChange;
            values.headImageAttId = this.headImageAttId
            if (this.initCascader.length > 0) {
              values.areaId = this.initCascader[this.initCascader.length - 1]
            }
            this.$api.org.saveOrUpdate(values)
              .then(res => {
                this.$notification.success({
                  message: '成功',
                  description: this.title + '成功'
                })
                this.visible = false
                this.confirmLoading = false
                this.form.resetFields()
                this.$emit('ok', values)
              }).finally(() => {
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
      rulePhone(rule, value, callback) {
        const form = this.form;
        const reg = /^1(3|4|5|7|8)\d{9}$/;
        if (value && !reg.test(value)) {
          callback('请输入正确的电话号码');
        } else {
          callback();
        }
      },

      addressChange(val) {
        let that = this;
        if (val) {
          // if(that.isChangeClone){
          //   that.latitude = '';
          //   that.longitude = '';
          // }
          that.isChangeClone =true
          var myGeo = new BMap.Geocoder();
          var map = this.map
          myGeo.getPoint(val, function (point) {
            if (point) {
              map.clearOverlays()
              map.centerAndZoom(point, 12);
              // map.centerAndZoom("成都", 12);
              map.addOverlay(new BMap.Marker(point));
              // that.$set(that.applicantForm, 'lgtVal', String(point.lng))
              // that.$set(that.applicantForm, 'lttVal', String(point.lat))

            }
          })
          var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {
              "input": "detailAddress"
              , "location": map
            });
          ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
            // var str = "";
            // var _value = e.fromitem.value;
            // var value = "";
            // if (e.fromitem.index > -1) {
            //   value = _value.province + _value.city + _value.district + _value.street + _value.business;
            // }
            // str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
            //
            // value = "";
            // if (e.toitem.index > -1) {
            //   _value = e.toitem.value;
            //   value = _value.province + _value.city + _value.district + _value.street + _value.business;
            // }
            // str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            //  G("searchResultPanel").innerHTML = str;
          });
          var myValue;
          ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            // G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

            that.setPlace(myValue);
          });
          // that.$notification.error({
          //   message: '提示',
          //   description: '获取不到当前地址经纬度，请选择下拉选项来填充经纬度'
          // })
        }
      },

      setPlace(myValue) {
        console.log(myValue)
        let that = this
        var map = this.map
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun(e) {
          var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果

          that.longitude = pp.lng
          that.latitude = pp.lat
          console.log(that.longitude, that.latitude)
          map.centerAndZoom(pp, 18);
          map.addOverlay(new BMap.Marker(pp));    //添加标注
        }

        var local = new BMap.LocalSearch(map, { //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
        that.inputChange = myValue;
      },

      createMap() {
        let that = this;

        this.map = new BMap.Map("allmap");  // 创建Map实例
        this.map.centerAndZoom("成都", 12);      // 初始化地图,用城市名设置地图中心点
        this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        //mp.enableScrollWheelZoom();
        this.map.enableInertialDragging();
        this.map.enableContinuousZoom();

        //添加城市切换
        var size = new BMap.Size(10, 20);
        this.map.addControl(new BMap.CityListControl({
          anchor: BMAP_ANCHOR_TOP_LEFT,
          offset: size,
        }));

        // 添加带有定位的导航控件
        var navigationControl = new BMap.NavigationControl({
          // 靠左上角位置
          anchor: BMAP_ANCHOR_TOP_RIGHT,
          // LARGE类型
          type: BMAP_NAVIGATION_CONTROL_LARGE,
          // 启用显示定位
          enableGeolocation: true
        });
        this.map.addControl(navigationControl);

        // 添加定位控件
        var geolocationControl = new BMap.GeolocationControl();
        this.map.addControl(geolocationControl);

        var geoc = new BMap.Geocoder();
        //填加鼠标点击事件
        this.map.addEventListener("click", e => {
          //alert(e.point.lng + "," + e.point.lat);
          that.longitude = e.point.lng
          that.latitude = e.point.lat
          // that.$set(that.applicantForm, 'lgtVal', String(e.point.lng));
          // that.$set(that.applicantForm, 'lttVal', String(e.point.lat));

          this.map.clearOverlays();
          var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建点
          this.map.addOverlay(marker);            //增加点

          geoc.getLocation(e.point, function (rs) {
            let addComp = rs.addressComponents;
            // that.$set(that.applicantForm, 'adr', addComp.province+addComp.city+addComp.district+addComp.street+ addComp.streetNumber);
            that.inputChange = addComp.province + addComp.city+ addComp.district + addComp.street + addComp.streetNumber+''
          });
        });
      },
    },
    mounted() {
      this.zIndex = -10
      this.createMap();
      this.visible = false;
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