<!--
 * @name BodyTemperature.vue
 * @author lw
 * @date 2020.2.17
 * @desc 成都市公共区域体温实时状态
-->
<template>
  <div class="es-main">
    <header>
      <div class="header">
        <div class="header-box">
          <div class="title">
            <span @click="back" style="display: inline-block;width: 41px;height: 40px;"><img style="width: 100%;height: 100%;margin-top: -8px" src="@/assets/es/btn_back_top.png" alt=""></span>
            <span style="padding-left: 5px">成都市公共区域体温实时状态</span>
            <span style="font-size:24px;color:rgba(112,123,145,1);line-height:33px;padding-top: 48px;display: block;float: right;">（近14天）</span>
          </div>
          <div class="time">
            <span style="padding-right: 20px">{{ curDate }}</span>
            <span @click="togglefullScreen"><img style="width: 50px;" src="@/assets/es/btn_fullscreen@2x.png" alt=""></span>
          </div>
        </div>
      </div>
    </header>
    <section>
      <div class="content-box clearfix" :style="{'margin-top':isFullScreen?'calc(50% - 870px)':'0'}">
        <div class="map-box">
          <div id="allmap" class="Map" />
          <div class="testing-statistics">
            <!--<div class="tabs">-->
            <!--<div class="active">实时检测<div class="three-box"></div></div>-->
            <!--<div>高热人群</div>-->
            <!--</div>-->
            <div class="tabs-content">
              <div class="content-list">
                <div class="tem-mess" v-for="(item,index) in testList" @click="toTrail(item)" :class="{'red-back':item.temperature >37.2}">
                  <div class="top-img"><img :src="item.headImageRemoteUrl" alt=""></div>
                  <div class="peo-mess">
                    <p class="name">{{ item.userRealName?item.userRealName:'陌生人' }}</p>
                    <p class="time">{{ item.recDatetime }}</p>
                    <p class="address">{{ item.fullAddress }}</p>
                  </div>
                  <div class="temperature" :class="{'white-color':item.temperature >37.2}">{{ item.temperature }}℃</div>
                  <div class="icon"><img v-if="item.temperature >37.2" src="@/assets/es/btn_enter@2x.png" alt=""></div>
                  <div class="three-box" v-if="item.temperature <= 37.2"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="select-city-box">
            <div class="select-city" @click="selectCity">
              <div class="before-icon"><img style="width: 24px;height: 24px" src="@/assets/es/icon_map.png" alt=""></div>
              <div class="select-value">{{ areaVal }}</div>
              <div class="after-icon"><img style="width: 21px;height: 13px" src="@/assets/es/btn_pull_down.png" alt=""></div>
            </div>
            <div class="data-list" v-if="hasAreaList">
              <div class="option" v-for="(item,index) in areaList" :class="{'active': index === nowIndex }" @click="changeCity(item,index)">{{ item.label }}</div>
            </div>
          </div>
        </div>
        <div class="data-box">
          <div class="title" style="padding-bottom: 0">
            <h2><img src="@/assets/es/icon_grqst@2x (1).png" alt="">体温高热趋势图</h2>
            <p>体温异常人数</p>
          </div>

          <div class="ecahrt-line">
            <div id="hotLine" />
          </div>

          <div class="peo-distribution">
            <div class="title">
              <h2><img src="@/assets/es/icon_grrsfb@2x.png" alt="">体温高热人数分布</h2>
              <p>全市体温异常者</p>
            </div>
            <div class="content-are-box">
              <div class="area-list">
                <div class="area-num-mess" v-for="(item,index) in areaNumList">
                  <p><span>{{ item.areaName }} </span><span>{{ item.temperatureHeatTotal }}</span></p>
                </div>
              </div>
              <div class="change-area-data" @click="changeAreaData">
                <img src="@/assets/es/btn_next@2x.png" alt="">
              </div>
            </div>
          </div>

          <div class="peo-distribution">
            <div class="title" style="margin: 5px 0">
              <h2><img src="@/assets/es/icon_hyyq@2x.png" alt="">行业疫情</h2>
            </div>
            <div class="content-work-es">
              <div class="unit-list">
                <div class="unit-mess" v-for="(item,index) in unitList">
                  <span>{{ item.areaName }}</span>
                  <span style="padding-left: 15px"><span class="num">{{ item.temNum }}</span>例</span>
                  <div class="three-box"></div>
                </div>
              </div>
              <div class="dividing-line"><img src="@/assets/es/img_line@2x.png" alt=""></div>
              <div class="peo-num-list">
                <div class="peo-num" v-for="(item,index) in peoNumList">
                  <span>{{ item.areaName }}</span>
                  <span><span class="num">{{ item.temNum }}</span>人</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>
<script>
import { mixin } from '@/mixins/mixin'
import Vue from 'vue'
import { POINT_ITEM } from '@/store/mutation-types'
export default {
  mixins: [mixin],
  data() {
    return {
      charts: '',
      charts2: '',
      curDate: '',
      timerId: '',
      thirdTimerId: '',
      districtLoading: 0,
      nowIndex: 0,
      hasAreaList: false,
      areaVal: '成都市',
      areaId: '510100',
      data: [
        {
          name: '成都市',
          value: 139
        }, {
          name: '绵阳市',
          value: 22
        }, {
          name: '自贡市',
          value: 9
        }, {
          name: '攀枝花市',
          value: 13
        }, {
          name: '泸州市',
          value: 19
        }, {
          name: '德阳市',
          value: 17
        }, {
          name: '广元市',
          value: 6
        }, {
          name: '遂宁市',
          value: 10
        }, {
          name: '内江市',
          value: 22
        }, {
          name: '乐山市',
          value: 3
        }, {
          name: '资阳市',
          value: 3
        }, {
          name: '宜宾市',
          value: 11
        }, {
          name: '南充市',
          value: 35
        }, {
          name: '达州市',
          value: 36
        }, {
          name: '雅安市',
          value: 7
        }, {
          name: '阿坝藏族羌族自治州',
          value: 1
        }, {
          name: '甘孜藏族自治州',
          value: 44
        }, {
          name: '凉山彝族自治州',
          value: 11
        }, {
          name: '广安市',
          value: 30
        }, {
          name: '巴中市',
          value: 24
        }, {
          name: '眉山市',
          value: 8
        }

      ],
      areaList: [
        {
          label: '成都市',
          value: '1'
        },
        {
          label: '绵阳市',
          value: '2'
        }
      ],
      testList: [],
      areaPointList: [],
      AxData: [],
      serData: [],
      areaNumAllList: [],
      areaNumList: [],
      unitList: [
        {
          areaName: '社区',
          temNum: 0
        },
        {
          areaName: '餐饮',
          temNum: 0
        },
        {
          areaName: '楼宇',
          temNum: 0
        },
        {
          areaName: '学校',
          temNum: 0
        }
      ],
      peoNumList: [
        {
          areaName: '低温人数',
          temNum: 0
        },
        {
          areaName: '内容常温人数',
          temNum: 0
        },
        {
          areaName: '低热人数',
          temNum: 0
        },
        {
          areaName: '高温人数',
          temNum: 0
        }
      ],
      isFullScreen: false
    }
  },
  created() {
    if (this.$route.params.data) {
      this.areaId = this.$route.params.data.areaId
    }
    this.getData()
    this.getAreaHeatData()
  },
  methods: {

    toTrail(item) {
      localStorage.setItem('memberData', JSON.stringify(item))

      const routes = this.$router.resolve({ name: 'memberTrail' })

      window.open(routes.href, '_blank')

      // this.$router.push({
      //   name:'memberTrail',
      //   params:item
      // })
    },

    back() {
      this.$router.go(-1)
    },

    getgetRecRecord() {
      const that = this
      that.$api.cityCheck.getRecRecordPage(
        {
          areaId: that.areaId,
          page: {
            pageNumber: 1,
            pageSize: 7
          }
        })
        .then(res => {
          that.testList = res.data
        })
    },

    getData() {
      const that = this

      that.$api.cityCheck.industryEpidemicStatistics(
        {
          areaId: that.areaId
        })
        .then(res => {
          that.unitList[0].temNum = res.communitiesNum
          that.peoNumList[0].temNum = res.lowTemperatureNum
          that.peoNumList[1].temNum = res.normalTemperatureNum
          that.peoNumList[2].temNum = res.lowFeverTemperatureNum
          that.peoNumList[3].temNum = res.highFeverTemperatureNum
        })
    },

    getAreaHeatData() {
      const that = this
      that.$api.cityCheck.heatDistributeStatistics(
        {
          areaId: that.areaId
        })
        .then(res => {
          that.areaNumAllList = res
          if (that.nowIndex === 0) {
            that.getAreaLookList(0)
          }
        })

      that.$api.cityCheck.heatTrendStatistics(
        {
          areaId: that.areaId
        })
        .then(res => {
          if (res.length) {
            that.AxData = []
            that.serData = []
            res.forEach((item) => {
              const dateStr = item.date.substring(item.date.length - 4).replace('-', '/')
              that.AxData.push(dateStr)
              that.serData.push(item.temperatureHeatTotal)
            })

            that.showLine()
          }
        })

      that.$api.cityCheck.getEstates(
        {
          areaId: that.areaId
        })
        .then(res => {
          that.areaPointList = res
        })
    },

    getAreaLookList(idx) {
      const that = this
      that.areaNumList = []
      if (idx === 0) {
        this.areaNumAllList.forEach((item, index) => {
          if (index < 9) {
            that.areaNumList.push(item)
          }
        })
      } else if (idx === 1) {
        this.areaNumAllList.forEach((item, index) => {
          if (index >= 9 && index < 18) {
            that.areaNumList.push(item)
          }
        })
      } else {
        this.areaNumAllList.forEach((item, index) => {
          if (index >= 18) {
            that.areaNumList.push(item)
          }
        })
      }
    },

    changeAreaData() {
      if (this.areaNumList.length < 9) {
        this.nowIndex = 0
      } else {
        this.nowIndex++
      }
      this.getAreaLookList(this.nowIndex)
    },

    selectCity() {
      this.hasAreaList = !this.hasAreaList
    },
    changeCity(item, index) {
    },

    showLine() {
      const hotLineChart = this.$echarts.init(document.getElementById('hotLine'))
      // 绘制图表
      hotLineChart.setOption({
        title: {
          show: false
        },
        grid: {
          left: '10%',
          top: '10%',
          bottom: '14%',
          right: '5%'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            inside: false,
            textStyle: {
              fontWeight: 'normal',
              fontSize: '14',
              lineHeight: 22
            }
          },
          data: this.AxData
        },
        yAxis: {
          type: 'value',
          position: 'left',
          minInterval: 1,
          lineStyle: {
            color: '#fff'
          },
          nameTextStyle: {
            color: '#fff'
          },
          splitLine: {
            lineStyle: {
              type: 'solid',
              color: '#56565D'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#fff',
            formatter: '{value}',
            fontSize: 14
          }
        },
        series: [{
          symbolSize: 10,
          name: '新增确诊',
          type: 'line',
          yAxisIndex: 0,
          data: this.serData,
          itemStyle: {
            normal: {
              borderWidth: 10
            }
          }
        }]
      })
    },
    // timer() {
    //     return setInterval(()=>{
    //         this.showCity('chengdu')
    //     },5000)
    // }

    createMap() {
      const that = this
      var map = new BMap.Map('allmap') // 初始化map, 绑定id=allmap
      var point = new BMap.Point(104.321768, 30.88748) // 初始化point, 给定一个默认x,y值
      map.centerAndZoom(point, 18) // 将point点放入map中，展示在页面中心展示，10=缩放程度
      map.enableScrollWheelZoom() // 开启滚动鼠标滑轮

      var mapStyle = {
        features: ['road', 'building', 'water', 'land'], // 隐藏地图上的"poi",
        style: 'dark'
      }

      map.setMapStyle(mapStyle)

      that.addDistrict(map)
    },

    addPoint(map) {
      const that = this
      // 如有多个point去展示，可根据后端接口传入为主
      const data = that.areaPointList

      data.forEach((e, i) => {
        // 创建point, 将x,y值传入
        const pointNumber = new BMap.Point(e.lng, e.lat)
        let icon = null
        if (e.temperatureAbnormalNum > 0) {
          icon = new BMap.Icon(require('@/assets/es/img_mapred.png'), new BMap.Size(73, 73))
        } else {
          icon = new BMap.Icon(require('@/assets/es/img_mapgreen.png'), new BMap.Size(73, 73))
        }

        // 将data中的name加入地图中
        var label = new BMap.Label(e.name, {
          offset: new BMap.Size(20, -2)
        })

        label.setStyle({
          padding: '2px 5px',
          backgroundColor: 'rgba(216,216,216,0.2)',
          border: '1px solid rgba(45,127,206,1)',
          color: 'rgba(236,236,244,1)'
        })

        that.markerFun(pointNumber, label, icon, map, e)
      })

      // 获取当前地理位置
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          var mk = new BMap.Marker(r.point)
          // map.addOverlay(mk);
          map.panTo(r.point)
          // alert('您的位置：' + r.point.lng + ',' + r.point.lat);
        } else {
          // alert('failed' + this.getStatus());
        }
      })
    },

    markerFun(points, label, icon, map, item) {
      const that = this
      const markers = new BMap.Marker(points, { icon: icon })
      map.addOverlay(markers) // 将标注添加到地图中
      markers.setLabel(label) // 将data中的name添加到地图中
      // 标注的点击事件
      markers.addEventListener('click', function (event) {
        console.log(item)

        Vue.ls.set(POINT_ITEM, item)

        const routes = that.$router.resolve({ name: 'pointInformation' })

        window.open(routes.href, '_blank')

        // that.$router.push({
        //   name:'pointInformation',
        //   params:item
        // })
      })
    },

    addDistrict(map) {
      const that = this
      var bdary = new BMap.Boundary()
      bdary.get('成都市', function(rs) { // 获取行政区域
        map.clearOverlays() // 清除地图覆盖物
        var count = rs.boundaries.length // 行政区域的点有多少个
        if (count === 0) {
          alert('未能获取当前输入行政区域')
          return
        }
        var pointArray = []
        for (var i = 0; i < count; i++) {
          var ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeColor: 'rgba(3,20,47,1)', fillColor: 'rgba(3,20,47,1)' }) // 建立多边形覆盖物
          map.addOverlay(ply) // 添加覆盖物
          pointArray = pointArray.concat(ply.getPath())
        }
        if (that.districtLoading == 0) {
          // 全加载完成后画端点
          that.addPoint(map)
        }
        that.districtLoading++
        map.setViewport(pointArray) // 调整视野
      })
    },

    // 3s定时器
    startThirdTimer() {
      this.thirdTimerId = setInterval(() => {
        this.getAreaHeatData()
      }, 3000)
    },
    closeThirdTimer() {
      clearInterval(this.thirdTimerId)
    },

    // 时间定时器
    startTimer() {
      this.curDate = this.getDateStr()
      this.timerId = setInterval(() => {
        this.curDate = this.getDateStr()
        this.getgetRecRecord()
      }, 1000)
    },
    closeTimer() {
      clearInterval(this.timerId)
    },

    togglefullScreen() {
      const e = document.documentElement

      if (!this.isFullScreen) {
        if (e.requestFullscreen) {
          e.requestFullscreen()
        } else if (e.mozRequestFullScreen) {	// 兼容火狐
          e.mozRequestFullScreen()
        } else if (e.webkitRequestFullscreen) {	// 兼容谷歌
          e.webkitRequestFullscreen()
        } else if (e.msRequestFullscreen) {	// 兼容IE
          e.msRequestFullscreen()
        }
        this.isFullScreen = true
      } else {
        //	退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        this.isFullScreen = false
      }
    }

  },
  mounted() {
    // 启动定时器
    this.startTimer()
    this.createMap()
    this.startThirdTimer()
    // this.timer()
  },
  beforeDestroy() {
    this.closeTimer()
    this.closeThirdTimer()
  }

}
</script>

<style lang="scss" type="text/scss" scoped>

  *{
    margin: 0;
    padding: 0;
  }
  p,h2{
    margin: 0;
  }

  .user-layout-login {
    label {
      font-size: 14px;
    }
    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }
  }

  .es-main{
    width: 100%;
    min-height: 100%;
    padding: 18px 25px;
    background:rgba(3,20,47,1);
    .header-box{
      width: 100%;
      height: 133px;
      background: url("~@/assets/es/img_titlebg@2x.png") no-repeat;
      background-size: 100%;
      display: flex;
      justify-content:space-between;
      .title{
        width:782px;
        font-size:2rem;
        color:#395CA8;
        line-height:63px;
        padding: 45px 0 0 17px;
      }
      .time{
        padding: 55px 20px 0 0;
        font-size:24px;
        color:rgba(45,127,206,1);
        line-height:33px;
      }
    }
    section{
      width: 100%;
      height: calc(100% - 131px);
      .content-box{
        height: 100%;
        display: flex;
        justify-content:space-between;
        .map-box{
          width: calc(100% - 440px);
          min-height: 400px;
          position: relative;
          #allmap{
            width: 100%;
            height: 100%;
          }
          .testing-statistics{
            width: 425px;
            height: 460px;
            position: absolute;
            left: 10px;
            top: 20px;
            z-index: 10;
            .tabs{
              display: flex;
              justify-content:flex-start;
              div{
                width:100px;
                height:40px;
                background:rgba(7,33,78,1);
                border:1px solid;
                border-color: rgba(7,33,78,1);
                font-size:14px;
                text-align: center;
                color:rgba(112,123,145,1);
                line-height:40px;
              }
              div.active{
                background:rgba(1,20,58,1);
                color:rgba(45,127,206,1);
                border-color: rgba(45,127,206,1);
              }
            }
            .tabs-content{
              .content-list{
                .tem-mess{
                  width: 100%;
                  height: 90px;
                  display: flex;
                  justify-content:space-between;
                  border:1px solid rgba(45,127,206,1);
                  background:rgba(3,20,47,1);
                  padding: 8px 12px;
                  position: relative;
                  margin-bottom: 10px;
                  .top-img{
                    width: 70px;
                    height: 70px;
                    img{
                      width: 100%;
                      height: 100%;
                    }
                  }
                  .peo-mess{
                    width: 210px;
                    padding-left: 8px;
                    .name{
                      font-size:27px;
                      color:rgba(248,248,248,1);
                      line-height:36px;
                    }
                    .time,.address{
                      font-size:12px;
                      color:#f2f2f2;
                      line-height:18px;
                    }
                  }
                  .temperature{
                    font-size:27px;
                    line-height: 70px;
                    color:rgba(132,213,43,1);
                  }
                  .temperature.white-color{
                    color:rgba(255,255,255,1);
                  }
                  .three-box{
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 0;
                    height: 0;
                    border-color: transparent #2D7FCE;
                    border-width: 0 40px 20px 0;
                    border-style: solid;
                  }
                  .icon{
                    width: 26px;
                    height: 26px;
                    margin-top: 24px;
                    img{
                      width: 100%;
                      height: 100%;
                    }
                  }
                }
                .tem-mess.red-back{
                  border:1px solid #E7374D;
                  background-color: #E7374D;
                }
              }
            }
          }
          .select-city-box{
            position: absolute;
            right: 40px;
            top: 14px;
            width:140px;
            border-radius:3px;
            border:2px solid rgba(64,71,94,1);
            .select-city{
              background:rgba(32,45,70,1);
              border-radius:3px;
              height:40px;
              display: flex;
              justify-content:space-between;
              padding: 5px 10px 5px 5px;
              cursor: pointer;
              .before-icon{
                width: 24px;
                height: 24px;
              }
              .after-icon{
                width: 21px;
                height: 13px;
              }
              .select-value{
                width: 100px;
                padding-left: 5px;
                color:rgba(242,242,242,1);
                line-height: 26px;
              }
              .ant-select{
                width: 100%;
                height: 100%;
              }

            }
            .data-list{
              background:rgba(1,20,58,1);
              .option{
                height: 36px;
                line-height: 36px;
                color:rgba(112,123,145,1);
                padding-left: 10px;
                cursor: pointer;
              }
              .option.active{
                background:rgba(5,34,92,1);
                border-bottom:2px solid rgba(64,71,94,1);
                color:rgba(45,127,206,1);
              }
              .option:hover{
                background:rgba(5,34,92,1);
                border-bottom:2px solid rgba(64,71,94,1);
                color:rgba(45,127,206,1);
              }
            }
          }

        }
        .data-box{
          width: 430px;
          .title{
            padding: 8px 0 14px;
            h2{
              font-size:27px;
              color:rgba(255,255,255,1);
              line-height:37px;
              img{
                height: 25px;
                margin:7px 5px 0 0;
                float: left;
              }
            }
            p{
              font-size:16px;
              color:rgba(201,201,203,1);
              line-height:22px;
            }
          }
          .ecahrt-line{
            padding: 5px 0 15px;
            #hotLine{
              width: 100%;
              height: 180px;
            }
          }
          .peo-distribution{
            color: #fff;
            .content-work-es{
              display: flex;
              justify-content:space-between;
              .unit-list{
                width: 150px;
                .unit-mess{
                  width: 100%;
                  height: 46px;
                  background:rgba(32,45,70,1);
                  border:1px solid rgba(64,71,94,1);
                  position: relative;
                  padding-left: 15px;
                  span{
                    font-size:18px;
                    color:rgba(204,235,246,1);
                    line-height:42px;
                    .num{
                      font-size:24px;
                    }
                  }
                  .three-box{
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 0;
                    height: 0;
                    border-color: transparent rgba(125,125,143,1);
                    border-width: 0 24px 16px 0;
                    border-style: solid;
                  }
                }
                .unit-mess+.unit-mess{
                  margin-top: 11px;
                }
              }
              .dividing-line{
                width: 66px;
                height: 220px;
                padding: 0 20px;
                img{
                  width: 26px;
                  height: 100%;
                }
              }
              .peo-num-list{
                width: 196px;
                .peo-num{
                  width: 100%;
                  height: 55px;
                  padding: 0 20px 0 24px;
                  background: url("~@/assets/es/bg_wdrs@2x.png") no-repeat;
                  background-size: 100%;
                  display: flex;
                  justify-content:space-between;
                  span{
                    font-size:14px;
                    color:rgba(204,235,246,1);
                    line-height: 55px;
                    .num{
                      font-size:20px;
                    }
                  }
                }
              }
            }
          }
          .content-are-box{
            display: flex;
            justify-content:space-between;
            .area-list{
              display: flex;
              flex-wrap: wrap;
              width: 390px;
              .area-num-mess{
                width:106px;
                height: 45px;
                border-bottom:3px solid rgba(245,154,35,1);
                margin: 0 12px;
                p{
                  padding: 5px 0 14px;
                  font-size:18px;
                  color:rgba(255,255,255,1);
                  line-height:27px;
                }
              }
            }
            .change-area-data{
              width:32px;
              height:150px;
              background:rgba(12,33,65,1);
              cursor: pointer;
              img{
                width: 32px;
                height: 32px;
                margin-top: 70px;
              }
            }
          }
        }
      }
    }
  }
</style>
