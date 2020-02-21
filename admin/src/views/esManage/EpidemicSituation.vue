<!--
 * @name EpidemicSituation.vue
 * @author lw
 * @date 2020.2.17
 * @desc 四川省发热检测分布图
-->
<template>
  <div class="es-main">
    <header>
      <div class="header-box">

        <img class="bg-img" src="@/assets/es/img_titlebg@2x.png"/>

        <div class="left">
          <span class="title">四川省发热检测分布图</span>
          <!-- <span class="late">（近14天）</span> -->
        </div>

        <div class="right">
          <span class="time">{{curDate}}</span>
          <img @click="togglefullScreen"  class="full-screen" src="@/assets/es/btn_fullscreen@2x.png"/>
        </div>

      </div>
    </header>
    <section>
      <div class="content-box">
        <div class="map-box">
          <div id="sichuan"></div>
          <div class="testing-statistics">
            <div class="normal-color">
              <div class="title">累计检测人次 <span><img style="margin-top: -4px" src="@/assets/es/img_upb.png" alt=""></span><span>{{toThousands(statistics.temperatureCheckTodayTotal)}}</span></div>
              <div class="people-num">{{toFourth(statistics.temperatureCheckTotal)}}</div>
            </div>

            <div class="normal-color red-color" style="margin: 60px 0">
              <div class="title">累计检测人次 <span><img style="margin-top: -4px" src="@/assets/es/img_upb.png" alt=""></span><span>{{toThousands(statistics.temperatureHeatTodayTotal)}}</span></div>
              <div class="people-num">{{toFourth(statistics.temperatureHeatTotal)}}</div>
            </div>

            <div class="normal-color green-color">
              <div class="title">累计检测人次 <span><img style="margin-top: -4px" src="@/assets/es/img_upg.png" alt=""></span><span>{{toThousands(statistics.temperatureNormalTodayTotal)}}</span></div>
              <div class="people-num ">{{toFourth(statistics.temperatureNormalTotal)}}</div>
            </div>
          </div>

          <div class="select-city-box">
            <div class="select-city" @click="selectCity">
              <div class="before-icon"><img style="width: 24px;height: 24px" src="@/assets/es/icon_map.png" alt=""></div>
              <div class="select-value">{{areaVal}}</div>
              <div class="after-icon"><img style="width: 21px;height: 13px" src="@/assets/es/btn_pull_down.png" alt=""></div>
            </div>
            <div class="data-list tr-list" v-if="hasAreaList">
              <div class="option" v-for="(item,index) in areaList" :class="{'active': index === nowIndex }"  @click="changeCity(item,index)">{{item.name}}</div>
            </div>
          </div>

          <div class="marshalling">
            <img style="height: 60px;" src="@/assets/es/marshalling@2x.png" alt="">
          </div>
        </div>
        <div class="data-box">
          <div class="title">
            <h2>高热人群走势</h2>
            <p>体温异常人群</p>
          </div>
          <div class="today-box">
            <div class="statistics">
              <div class="status-img"><img src="@/assets/es/icon_grqst_red@2x.png" alt=""></div>
              <div class="content">
                <p class="content-title">今日高热人数</p>
                <p class="content-num">{{temperatureCheckData.temperatureHeatTodayTotal}}</p>
              </div>
            </div>

            <div class="statistics">
              <div class="status-img"><img src="@/assets/es/icon_grqst_blue@2x.png" alt=""></div>
              <div class="content">
                <p class="content-title">今日新增检测</p>
                <p class="content-num">{{temperatureCheckData.temperatureCheckTodayTotal}}</p>
              </div>
            </div>

            <div class="statistics">
              <div class="status-img"><img src="@/assets/es/icon_grqst_green@2x.png" alt=""></div>
              <div class="content">
                <p class="content-title">今日体温正常</p>
                <p class="content-num">{{temperatureCheckData.temperatureNormalTodayTotal}}</p>
              </div>
            </div>

          </div>

          <div class="ecahrt-line">
            <div id="hotLine"></div>
          </div>

          <div class="peo-distribution">
            <div class="title">
              <h2>四川省高热人群分布</h2>
              <p>全省体温异常者</p>
            </div>
            <div class="content-table">
              <div class="table-box">
                <div class="table-th">
                  <div class="city">城市</div>
                  <div class="total-hot">累计发热</div>
                  <div class="today-num">今日新增</div>
                </div>
                <div class="tr-list">
                  <div class="table-td" v-for="(item,index) in dataList">
                    <div class="city">{{item.areaName}}</div>
                    <div class="total-hot">{{item.temperatureHeatTotal}}</div>
                    <div class="today-num" :class="{'red-color':item.temperatureHeatTodayAddTotal != 0}">{{item.temperatureHeatTodayAddTotal}}</div>
                  </div>
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
  import {mixin} from '@/mixins/mixin'
  export default {
    mixins:[mixin],
    data() {
      return {
        charts: '',
        charts2: '',
        timerId:'',
        getStatisticsTime:'',
        getDataFirTime:'',
        curDate:'',
        data:[],
        dataList:[],
        nowIndex:-1,
        hasAreaList:false,
        areaVal:'四川省',
        areaList:[],
        temperatureCheckData:{

        },
        AxData:[],
        serData:[],
        statistics:{},
        isFullScreen:false,
      }
    },
    created(){
      this.getHeatDistributeStatistics();
      this.getStatistics();
    },
    methods: {

      getHeatDistributeStatistics(){
        let that = this;

        that.$api.provinceCheck.mapStatistics({areaId: '510000'})
          .then(res => {
            that.dataList = res
            if(res.length){
              that.data = []
              that.areaList = []
              res.forEach((item)=>{
                let obj = {
                  name:item.areaName,
                  value:item.temperatureHeatTotal,
                  areaId:item.areaId
                };
                that.data.push(obj)

                let objArea = {
                  name:item.areaName,
                  value:item.areaId,
                  areaId:item.areaId
                };

                that.areaList.push(objArea)
              })

              that.showProvince('sichuan')

              that.$nextTick(function() {

                that.charts.on('click', function (params) {
                  if(params.data.areaId === '510100'){
                    that.nextPage(params)
                  }

                });

              })

            }
          })

        that.$api.provinceCheck.heatDistributeStatistics({areaId: '510000'})
          .then(res => {
              that.dataList = res
          })

      },

      getStatistics(){
        let that = this
        that.$api.provinceCheck.statistics({areaId: '510000'})
          .then(res => {
            that.statistics = res
          })

        that.$api.provinceCheck.heatTrendStatistics({areaId: '510000'})
          .then(res => {
            that.temperatureCheckData = res
            if(res.dateStatistics.length){
              that.AxData = [];
              that.serData = [];
              res.dateStatistics.forEach((item)=>{
                let dateStr = item.date.substring(item.date.length-4).replace("-", "/");
                that.AxData.push(dateStr)
                that.serData.push(item.temperatureHeatTotal)
              })

              that.showLine();
            }
          })
      },

      // 3秒定时器
      startGetStatisticsTimer(){
        this.getStatisticsTime = setInterval(() => {
          this.getStatistics();
        },3000);
      },

      closeGetStatisticsTimer(){
        clearInterval(this.getStatisticsTime);
      },

      // 3秒定时器
      startGetDataFirTimer(){
        this.getDataFirTime = setInterval(() => {
          this.getHeatDistributeStatistics();
        },5000);
      },

      closeGetDataFirTimer(){
        clearInterval(this.getDataFirTime);
      },


      // 时间定时器
      startTimer(){
        this.curDate = this.getDateStr();
        this.timerId = setInterval(() => {
          this.curDate = this.getDateStr();
        },1000);
      },
      closeTimer(){
        clearInterval(this.timerId);
      },

      selectCity(){
        this.hasAreaList = !this.hasAreaList;
      },

      changeCity(item,index){
        // this.nowIndex = index;
        // this.areaVal = item.name
      },

      nextPage(item){

        let routes = this.$router.resolve({ name: 'bodyTemperature'});

        window.open(routes.href, '_blank');


        // this.$router.push({
        //   name: 'bodyTemperature',
        //   params: item
        // })
      },

      showProvince(id){
        let that = this;
        var name = 'sichuan';

        this.charts = this.$echarts.init(document.getElementById(id))

        let geoJson = require('@/utils/json/sichuan.json');

        this.$echarts.registerMap(name, geoJson);

        this.charts.setOption({
          backgroundColor: "rgba(3,20,47,1)",
          title: {
            show:false,
            text: '2月15日四川省新型肺炎疫情地图',
            left: 'center', //标题位置
            textStyle: {
              fontSize: 32,
              fontWeight: 'bolder',
              color: 'black' // 主标题文字颜色
            }
          },
          color: ['white'],

          legend: {
            show:false,
            orient: 'vertical',
            left: 'left',

            textStyle: {
              fontSize: 20,
              color: 'black' // 图例文字颜色
            },
            //data: ['地市']
            // 图例位置
          },
          tooltip: {

            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.8)',
            extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.6);',
            textStyle:{
              align:'left'
            }
          },
          visualMap: {
            min: 0,
            max: 10000,
            left: 'left',
            icon: "diamond",
            bottom:'2%',
            // 文本，默认为数值文本
            //calculable: true,
            //color: ['blue', 'blue']
            //图例颜色
            pieces: [{
              min: 100,
              max: 500,
              label: "100-500人",
              color: "#A50002"
            }, {
              min: 11,
              max: 99,
              label: "11-99人",
              color: "#dc6c5c"
            }, {
              min: 1,
              max: 10,
              label: "1-10人",
              color: "#f2ad8b"
            }, {
              min: 0,
              max: 0,
              label: "0人",
              color: "#ffffff"

            }],
            orient: 'vertical',
            itemWidth: 25,
            itemHeight: 15,
            showLabel: true,
            seriesIndex: [0],
            textStyle: {
              color: '#fff'
            }
          },
          toolbox: {
            show: false,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              dataView: {
                readOnly: false
              },
              restore: {},
              saveAsImage: {}
            }
          },
          series: [{
            name: '感染人数统计',
            type: 'map',
            mapType: name,
            left:'35%',
            top: 80,
            bottom: 120,
            label: {
              normal: {
                show: true,
              },
              emphasis: {
                textStyle: {
                  color: 'rgba(0, 0, 0, 1)'
                }
              }
            },
            data: that.data
          }]
        });
      },

      showLine(){

        let hotLineChart = this.$echarts.init(document.getElementById('hotLine'))
        // 绘制图表
        hotLineChart.setOption({
          title: {
            show:false
          },
          grid: {
            left: '10%',
            top: '10%',
            bottom: '12%',
            right: '5%',
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
                color: '#fff',
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
            data: this.AxData,
          },
          yAxis: {
            type: 'value',
            position: 'left',
            minInterval: 1,
            lineStyle: {
              color: '#fff',
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
            type: "line",
            yAxisIndex: 0,
            data: this.serData,
            itemStyle: {
              normal: {
                borderWidth: 10,
              }
            }
          },]
        });
      },

      togglefullScreen(){

        let e = document.documentElement;

        if(!this.isFullScreen){
          if(e.requestFullscreen) {
            e.requestFullscreen();
          } else if (e.mozRequestFullScreen){	// 兼容火狐
            e.mozRequestFullScreen();
          } else if(e.webkitRequestFullscreen) {	// 兼容谷歌
            e.webkitRequestFullscreen();
          } else if (e.msRequestFullscreen) {	// 兼容IE
            e.msRequestFullscreen();
          }
          this.isFullScreen = true;
        }else{
          //	退出全屏
          if(document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
          this.isFullScreen = false;
        }

      },

    },
    mounted(){
      // 启动定时器
      this.startTimer();
      this.startGetDataFirTimer();
      this.startGetStatisticsTimer();
    },
    beforeDestroy(){
      this.closeTimer();
      this.closeGetStatisticsTimer();
      this.closeGetDataFirTimer();
    }

  }
</script>

<style lang="scss" type="text/scss" scoped>
  *{
    margin: 0;
    padding: 0;
  }
  p{
    margin: 0;
  }
  .user-layout-login {
    label {
      font-size: 0.875rem;
    }
    button.login-button {
      padding: 0 15px;
      font-size: 1rem;
      height: 40px;
      width: 100%;
    }
  }

  .es-main{
    padding: 18px 50px;
    background:rgba(3,20,47,1);
    min-width: 1200px;
    height: 100%;
    .tr-list::-webkit-scrollbar{
      width:9px;
      height:10px;
      /**/
    }
    .tr-list::-webkit-scrollbar-track{
      background: rgba(46,62,87,1);
      border-radius:2px;
    }
    .tr-list::-webkit-scrollbar-thumb{
      background: #bfbfbf;
      border-radius:10px;
    }
    .tr-list::-webkit-scrollbar-thumb:hover{
      background: #333;
    }
    .tr-list::-webkit-scrollbar-corner{
      background: #179a16;
    }
    .header-box{
      position: relative;
      .bg-img{
        position: relative;
        width: 100%;
      }
      .left{
        position: absolute;
        width: 50%;
        color: #2D7FCE;
        font-size: 2rem;
        height: 26px;
        top:calc(50% - 13px);
        .back{
          width: 26px;
          height: 26px;
          position: absolute;
          left: 5px;
          cursor: pointer;
        }
        .title{
          position: absolute;
          height: 26px;
          line-height: 26px;
          left: 25px;
        }
      }
      .right{
        position: absolute;
        width: 50%;
        height: 18px;
        color: #2D7FCE;
        text-align: right;
        font-size: 1.2rem;
        right: 18px;
        line-height: 18px;
        top:calc(50% - 9px);
        .time{
          position: relative;
          top: -11px;
          margin-right: 20px;
        }
        .full-screen{
          position: relative;
          width: 40px;
          height: 40px;
          top:-11px;
          cursor: pointer;
        }
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
          width: calc(100% - 500px);
          min-height: 400px;
          position: relative;
          overflow: hidden;
          #sichuan{
            width: 100%;
            height: 100%;
          }
          .testing-statistics{
            width: 300px;
            height: 460px;
            padding: 30px 25px;
            background:rgba(7,24,51,1);
            opacity:0.9;
            border:1px solid rgba(79,88,108,1);
            position: absolute;
            left: 10px;
            top: 56px;
            z-index: 10;
            .normal-color{
              .title{
                width:250px;
                height:32px;
                background:rgba(11,32,64,1);
                border:1px solid;
                border-image:linear-gradient(135deg, rgba(0,111,171,1), rgba(11,32,64,1), rgba(11,32,64,1), rgba(0,109,169,1)) 1 1;
                font-size:1.25rem;
                color:rgba(220,220,245,1);
                line-height:27px;
                padding-left: 5px;
                span{
                  font-size:0.875rem;
                  color:rgba(159,159,226,1);
                  line-height:20px;
                  padding-left: 5px;
                }
              }
              .people-num{
                font-size:2.5rem;
                color:rgba(194,203,222,1);
                line-height:55px;
              }
            }
            .red-color{
              .title{
                span{
                  color:rgba(231,55,77,1);
                }
              }
              .people-num{
                color:rgba(231,55,77,1);
              }
            }
            .green-color{
              .title{
                span{
                  color:rgba(132,213,43,1);
                }
              }
              .people-num{
                color:rgba(132,213,43,1);
              }
            }
          }
          .select-city-box{
            position: absolute;
            right: 20px;
            top: 60px;
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
              height: 200px;
              overflow-y: auto;
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
          .marshalling{
            position: absolute;
            right: 40px;
            bottom: 14px;
          }
        }
        .data-box{
          width: 460px;
          .title{
            padding: 12px 0 25px;
            h2{
              font-size:1.6875rem;
              color:rgba(255,255,255,1);
              line-height:37px;
            }
            p{
              font-size:1rem;
              color:rgba(201,201,203,1);
              line-height:22px;
            }
          }
          .today-box{
            display: flex;
            justify-content: space-between;
            .statistics{
              display: flex;
              justify-content:space-between;
              .status-img{
                padding-top: 2px;
                width: 48px;
                height: 50px;
                img{
                  width: 100%;
                  height: 100%;
                }
              }
              .content{
                .content-title{
                  font-size:1rem;
                  color:rgba(255,255,255,1);
                  line-height:22px;
                }
                .content-num{
                  font-size:1.875rem;
                  color:rgba(255,255,255,1);
                  line-height:42px;
                }
              }
            }
          }
          .ecahrt-line{
            padding: 5px 0 15px;
            #hotLine{
              width: 100%;
              height: 230px;
            }
          }
          .peo-distribution{
            color: #fff;
            height: calc(100% - 410px);
            .content-table{
              height: calc(100% - 96px);
              .table-box{
                height: 100%;
                .table-th{
                  display: flex;
                  justify-content:space-between;
                  border-bottom: 1px solid #2D7FCE;
                  padding-bottom: 15px;
                  div{
                    line-height:22px;
                    padding-left: 5px;
                  }
                  .city{
                    width: 200px;
                  }
                  .total-hot{
                    width: 150px;
                  }
                  .today-num{
                    width: 100px;
                  }
                }
                .tr-list{
                  height: calc(100% - 38px);
                  max-height: 260px;
                  min-height: 100px;
                  overflow: auto;
                  .table-td{
                    display: flex;
                    justify-content:space-between;
                    border-bottom: 1px solid #2D7FCE;
                    padding: 15px 0;
                    div{
                      line-height:22px;
                      padding-left: 5px;
                      font-size: 1.25rem;
                    }
                    .city{
                      width: 200px;
                    }
                    .total-hot{
                      width: 150px;
                    }
                    .today-num{
                      width: 90px;
                    }
                    .red-color{
                      color: #E7374D;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
