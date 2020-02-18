<!--
 * @name EpidemicSituation.vue
 * @author lw
 * @date 2020.2.17
 * @desc 四川省发热检测分布图
-->
<template>
  <div class="es-main">
    <header>
      <div class="header">
        <div class="header-box">
          <div class="title">四川省发热检测分布图</div>
          <div class="time">
            <span style="padding-right: 20px">2020-02-15 16:58:59</span>
            <span><img style="width: 50px;" src="@/assets/es/btn_fullscreen@2x.png" alt=""></span>
          </div>
        </div>
      </div>
    </header>
    <section>
      <div class="content-box">
        <div class="map-box">
          <div id="sichuan"></div>
          <div class="testing-statistics">
            <div class="normal-color">
              <div class="title">累计检测人次 <span>2095</span></div>
              <div class="people-num">68,9680</div>
            </div>

            <div class="normal-color red-color" style="margin: 60px 0">
              <div class="title">累计检测人次 <span>2095</span></div>
              <div class="people-num">68,9680</div>
            </div>

            <div class="normal-color green-color">
              <div class="title">累计检测人次 <span>2095</span></div>
              <div class="people-num ">68,9680</div>
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
                <p class="content-num">582</p>
              </div>
            </div>

            <div class="statistics">
              <div class="status-img"><img src="@/assets/es/icon_grqst_blue@2x.png" alt=""></div>
              <div class="content">
                <p class="content-title">今日新增检测</p>
                <p class="content-num">582</p>
              </div>
            </div>

            <div class="statistics">
              <div class="status-img"><img src="@/assets/es/icon_grqst_green@2x.png" alt=""></div>
              <div class="content">
                <p class="content-title">今日体温正常</p>
                <p class="content-num">582</p>
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
                    <div class="city">{{item.cityName}}</div>
                    <div class="total-hot">{{item.totalHot}}</div>
                    <div class="today-num" :class="{'red-color':item.newAddNum != 0}">{{item.newAddNum}}</div>
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
  export default {
    data() {
      return {
        charts: '',
        charts2: '',
        data:[
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
        mapData:[

          {
            'name':'标点1',
            'value':[103.964268, 30.727162, 37.5]
          },

          {
            'name':'标点2',
            'value':[104.04993, 30.738585, 37.5]
          },

          {
            'name':'标点3',
            'value':[104.08385, 30.71077, 37.5]
          },

          {
            'name':'标点4',
            'value':[104.122944, 30.659308, 37.5]
          },

          {
            'name':'标点5',
            'value':[104.08155, 30.610586, 37.5]
          },
        ],
        dataList:[
          {
            cityName:'成都市',
            totalHot:2598,
            newAddNum:28
          },
          {
            cityName:'绵阳市',
            totalHot:598,
            newAddNum:8
          },
          {
            cityName:'攀枝花市',
            totalHot:98,
            newAddNum:5
          },
          {
            cityName:'凉山彝族自治州',
            totalHot:29,
            newAddNum:0
          },
          {
            cityName:'甘孜藏族自治州',
            totalHot:25,
            newAddNum:1
          },
          {
            cityName:'阿坝藏族羌族自治州',
            totalHot:20,
            newAddNum:0
          }
        ]
      }
    },
    methods: {
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
            data: ['02.01', '02.03', '02.05', '02.07', '02.09', '02.11', '02.13'],
          },
          yAxis: {
            type: 'value',
            position: 'left',
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
            data: [11, 20, 18, 11, 14, 8, 16],
            itemStyle: {
              normal: {
                borderWidth: 10,
              }
            }
          },]
        });
      },
      // timer() {
      //     return setInterval(()=>{
      //         this.showCity('chengdu')
      //     },5000)
      // }
    },
    mounted(){
      this.$nextTick(function() {
        this.showProvince('sichuan')
        this.showLine();
        this.charts.on('click', function (params) {
            console.log(params);
        });

      })
      // this.timer()
    },
    destroyed() {
      // clearInterval(this.timer)
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
    height: 100%;
    padding: 18px 50px;
    background:rgba(3,20,47,1);
    .header-box{
      width: 100%;
      height: 133px;
      background: url("~@/assets/es/img_titlebg@2x.png") no-repeat;
      background-size: 100%;
      display: flex;
      justify-content:space-between;
      .title{
        width:500px;
        font-size:46px;
        font-family:AlibabaPuHuiTiM;
        color:#395CA8;
        line-height:63px;
        padding: 48px 0 0 20px;
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
          width: calc(100% - 560px);
          min-height: 400px;
          position: relative;
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
                font-size:20px;
                color:rgba(220,220,245,1);
                line-height:27px;
                padding-left: 5px;
                span{
                  font-size:14px;
                  color:rgba(159,159,226,1);
                  line-height:20px;
                  padding-left: 5px;
                }
              }
              .people-num{
                font-size:40px;
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
          .marshalling{
            position: absolute;
            right: 40px;
            bottom: 14px;
          }
        }
        .data-box{
          .title{
            padding: 12px 0 25px;
            h2{
              font-size:27px;
              color:rgba(255,255,255,1);
              line-height:37px;
            }
            p{
              font-size:16px;
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
                  font-size:16px;
                  color:rgba(255,255,255,1);
                  line-height:22px;
                }
                .content-num{
                  font-size:30px;
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
            .content-table{
              .table-box{
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
                  height: 260px;
                  overflow: auto;
                  .table-td{
                    display: flex;
                    justify-content:space-between;
                    border-bottom: 1px solid #2D7FCE;
                    padding: 15px 0;
                    div{
                      line-height:22px;
                      padding-left: 5px;
                      font-size: 20px;
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
              }
            }
          }
        }
      }
    }
  }
</style>
