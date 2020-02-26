<!--
 * @name EditForm.vue
 * @author lw
 * @date 2019.11.8
 * @desc 地区管理add、edit
-->
<template>
  <a-modal
    title="地图"
    :width="550"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    :maskClosable="false" :keyboard="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div id='allmap' style="width:100%;height:350px;margin-bottom: 15px"></div>
    </a-spin>
  </a-modal>
</template>

<script>
  import {mixin} from '@/mixins/mixin'

  export default {
    mixins: [mixin],
    data() {
      return {
        confirmLoading: false,
        longitude:'',
        latitude:'',
        visible:false
      }
    },
    watch:{
      num(newVal){
        if(newVal == this.initCascader.length){
            this.handleAreaArr()
        }
      }
    },
    methods: {
      add(item) {
        // this.createMap();
        let that = this;
        that.visible = true

        this.$nextTick(() => {
          this.createMap(item);
        })


      },

      close(){
        this.visible = false
      },

      createMap(item) {
        let that = this;

        this.map = new BMap.Map("allmap"); // 创建Map实例
        this.map.centerAndZoom(item?item:'成都', 12); // 初始化地图,用城市名设置地图中心点
        this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
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

        // 添加定位控件
        var geolocationControl = new BMap.GeolocationControl();

        this.map.addControl(navigationControl);
        this.map.addControl(geolocationControl);

        var geoc = new BMap.Geocoder();

        //填加鼠标点击事件
        this.map.addEventListener("click", e => {
          //alert(e.point.lng + "," + e.point.lat);
          that.longitude = e.point.lng
          that.latitude = e.point.lat

          this.map.clearOverlays();

          var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建点

          this.map.addOverlay(marker); //增加点

          geoc.getLocation(e.point, function (rs) {
            let addComp = rs.addressComponents;
          });
        });
      },

      handleSubmit() {
        if(!this.longitude || !this.latitude){
          this.$notification.error({
            message: '提示',
            description: '请选择经纬度！'
          })
        }else{
          this.$emit('ok', {
            lng:this.longitude,
            lat:this.latitude
          })
          this.visible = false
        }
      },
    },
    mounted(){
      // this.createMap();
    }
  }
</script>