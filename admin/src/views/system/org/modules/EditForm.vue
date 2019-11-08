<!--
 * @name CreateForm.vue
 * @author lw
 * @date 2019.11.6
 * @desc 新增（组织管理）
-->
<template>
  <a-modal :title="title+'组织'" :width="740" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="图片"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >

          <div style="width: 100px;height: 100px;border: 1px solid #cccccc;overflow: hidden;display: inline-block;"><img
            :src="topImg" alt="" style="width: 100%;"></div>
          <div
            style="width: 100px;height: 100px;border-radius: 50%;border: 1px solid #cccccc;overflow: hidden;display: inline-block;margin-left: 20px;">
            <img :src="topImg" style="width: 100%;" alt=""></div>
          <a-upload
            :action="system.uploadMainUrl"
            listType="picture"
            style="margin-left: 20px;display: inline-block;float: right;margin-top: 38px;"
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

        <a-form-item label="组织名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {initialValue: this.formData.name, rules: [{required: true, message: '请输入组织名称！'}]}]"/>
        </a-form-item>

        <a-form-item
          label="选择省市"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <!-- <a-input v-decorator="['parentArea',{initialValue: this.formData.parentArea}]" /> -->
          <a-cascader :options="options" @change="onChangeAddress" :loadData="loadData" :value='initCascader'
                      placeholder="选择省市" changeOnSelect/>
          <!-- <a-cascader :options="options1" @change="onChangeAddress" :loadData="loadData" placeholder="Please select" changeOnSelect/> -->
        </a-form-item>

        <a-form-item label="详细地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <input class="ant-input" id="detailAddress" v-model="inputChange"/>
          <p style="margin: 0;height: 20px;color: red" v-if="(longitude =='' || latitude =='') && inputChange !=''">
            该地址获取不到经纬度</p>
        </a-form-item>

        <a-form-item label="经度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input id="longitude" @blur="locationName" v-model="longitude"/>
        </a-form-item>

        <a-form-item label="纬度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input id="latitude" @blur="locationName" v-model="latitude"/>
        </a-form-item>

        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['remark',{initialValue: this.formData.remark}]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {mapState} from 'vuex';
  import {ImageUpload} from '@/components'
  import {mixin} from '@/mixins/mixin'

  export default {
    components: {
      ImageUpload
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
        visible: false,
        confirmLoading: false,

        uploadFileId: '',
        formData: {},
        title: '',
        form: this.$form.createForm(this),
        countries: [],
        managerTypes: [],
        accountStates: [],
        sexuales: [],
        roleList: [],
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
        topImg: '',
        headImageAttId: null
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

      loadData(selectedOptions) {
        let thiz = this;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        if (targetOption.level < 2) {
          targetOption.loading = true;
          this.$api.area.getAll({
            parentId: targetOption.value
          })
            .then(res => {
              targetOption.loading = false;
              const l = []
              if (res.length > 0) {
                for (let i = 0; i < res.length; i++) {
                  if (targetOption.level == 1) {
                    l.push({
                      value: res[i].id,
                      label: res[i].shortName,
                      level: res[i].level
                    })
                  } else {
                    l.push({
                      value: res[i].id,
                      label: res[i].shortName,
                      level: res[i].level,
                    })
                  }
                }
                targetOption.children = l
                thiz.options = [...thiz.options]

              }

            })
        }
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

        this.$api.area.getAllParent({})
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
            that.options = l
          })

        if (item) {
          let that = this;
          this.title = '修改'
          this.$api.org.getById({id: item.id})
            .then(res => {
              this.formData = res
              that.inputChange = res.address;
              that.latitude = res.lat;
              that.longitude = res.lng;

              that.longitude = res.lng;
              that.topImg = res.resourceFullAddress;
              that.headImageAttId = res.attId;
              if (res.areas.length) {
                if (res.areas.length > 1) {
                  this.$api.area.getAll({
                    parentId: res.areas[res.areas.length - 1].id
                  })
                    .then(resCity => {
                      const city = []
                      if (resCity.length > 0) {
                        for (let k = 0; k < that.options.length; k++) {
                          if (that.options[k].value == res.areas[res.areas.length - 1].id) {
                            for (let i = 0; i < resCity.length; i++) {
                              city.push({
                                value: resCity[i].id,
                                label: resCity[i].shortName,
                                level: resCity[i].level
                              })
                            }
                            that.options[k].children = city
                            that.options = [...that.options]
                            for (let i = res.areas.length - 1; i >= 0; i--) {
                              that.initCascader.push(res.areas[i].id)
                            }
                          }
                        }
                      }

                    })
                } else {
                  for (let i = res.areas.length - 1; i >= 0; i--) {
                    that.initCascader.push(res.areas[i].id)
                  }
                }

              }
            })
        } else {
          this.title = '新增'
        }
      },
      filterDeliverTypeOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      filterCountryOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
          console.log(e.point.lng, e.point.lat)
          // that.$set(that.applicantForm, 'lgtVal', String(e.point.lng));
          // that.$set(that.applicantForm, 'lttVal', String(e.point.lat));

          this.map.clearOverlays();
          var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建点
          this.map.addOverlay(marker);            //增加点

          geoc.getLocation(e.point, function (rs) {
            let addComp = rs.addressComponents;
            // that.$set(that.applicantForm, 'adr', addComp.province+addComp.city+addComp.district+addComp.street+ addComp.streetNumber);
            that.currentAddress = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber
          });
        });
      },

      //获取定位名称
      locationName() {
        var self = this,
          location_name = "";
        //获取定位名称
        var new_point = new BMap.Point(self.longitude, self.latitude);
        var gc = new BMap.Geocoder();  //初始化，Geocoder类
        gc.getLocation(new_point, function (rs) {   //getLocation函数用来解析地址信息，分别返回省市区街等
          var addComp = rs.addressComponents,
            province = addComp.province,//获取省份
            city = addComp.city,//获取城市
            district = addComp.district,//区
            street = addComp.street,//街
            streetNumber = addComp.streetNumber ? addComp.streetNumber : "";
          location_name = province + city + district + street + streetNumber;
          self.inputChange = location_name;

        });
      }
    },
    mounted() {
      this.createMap();
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