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
            <span style="display: inline-block;width: 35px;height: 35px;background-color: blue"></span>
            <span style="padding-left: 5px">成都市公共区域体温实时状态</span>
            <span style="font-size:24px;color:rgba(112,123,145,1);line-height:33px;padding-top: 48px;display: block;float: right;">（近14天）</span>
          </div>
          <div class="time">
            <span style="padding-right: 20px">2020-02-15 16:58:59</span>
            <span><img style="width: 50px;" src="@/assets/es/btn_fullscreen@2x.png" alt=""></span>
          </div>
        </div>
      </div>
    </header>
    <section>
      <div class="content-box clearfix">
        <div class="map-box">
          <div id="sichuan"></div>
          <div class="testing-statistics">
            <div class="tabs">
              <div class="active">实时检测<div class="three-box"></div></div>
              <div>高热人群</div>
            </div>
            <div class="tabs-content">
              <div class="content-list">
                <div class="tem-mess" v-for="(item,index) in testList" :class="{'red-back':item.temperature >37.2}">
                  <div class="top-img"><img :src="item.imgUrl" alt=""></div>
                  <div class="peo-mess">
                    <p class="name">{{item.name}}</p>
                    <p class="time">{{item.date}}</p>
                    <p class="address">{{item.address}}</p>
                  </div>
                  <div class="temperature" :class="{'white-color':item.temperature >37.2}">{{item.temperature}}℃</div>
                  <div class="icon"><img v-if="item.temperature >37.2" src="@/assets/es/btn_enter@2x.png" alt=""></div>
                  <div class="three-box" v-if="item.temperature <= 37.2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="data-box">
          <div class="title" style="padding-bottom: 0">
            <h2><img src="@/assets/es/icon_grqst@2x (1).png" alt="">体温高热趋势图</h2>
            <p>体温异常人数</p>
          </div>

          <div class="ecahrt-line">
            <div id="hotLine"></div>
          </div>

          <div class="peo-distribution">
            <div class="title">
              <h2><img src="@/assets/es/icon_grrsfb@2x.png" alt="">体温高热人数分布</h2>
              <p>全市体温异常者</p>
            </div>
            <div class="content-are-box">
              <div class="area-list">
                <div class="area-num-mess" v-for="(item,index) in areaNumList">
                  <p><span>{{item.areaName}} </span><span>{{item.temHotNum}}</span></p>
                </div>
              </div>
              <div class="change-area-data">
                <img src="@/assets/es/btn_next@2x.png" alt="">
              </div>
            </div>
          </div>

          <div class="peo-distribution">
            <div class="title">
              <h2><img src="@/assets/es/icon_hyyq@2x.png" alt="">行业疫情</h2>
            </div>
            <div class="content-work-es">
              <div class="unit-list">
                <div class="unit-mess" v-for="(item,index) in unitList">
                  <span>{{item.areaName}}</span>
                  <span style="padding-left: 15px"><span class="num">{{item.temNum}}</span>例</span>
                  <div class="three-box"></div>
                </div>
              </div>
              <div class="dividing-line"><img src="@/assets/es/img_line@2x.png" alt=""></div>
              <div class="peo-num-list">
                <div class="peo-num" v-for="(item,index) in peoNumList">
                  <span>{{item.areaName}}</span>
                  <span><span class="num">{{item.temNum}}</span>人</span>
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
        testList:[
          {
            imgUrl:'',
            name:'广晨辉',
            date:'2020.2.13 14:58:57',
            address:'四川省成都市天津路58号',
            temperature:36.9
          },
          {
            imgUrl:'',
            name:'陌生人',
            date:'2020.2.13 14:58:57',
            address:'四川省成都市北京大道826号',
            temperature:37.1
          },
          {
            imgUrl:'',
            name:'陌生人',
            date:'2020.2.13 14:58:57',
            address:'四川省成都市双流区双楠国际小区',
            temperature:38.1
          },
          {
            imgUrl:'',
            name:'宿成飞',
            date:'2020.2.13 14:58:57',
            address:'四川省成都市高新区软件园E区',
            temperature:38.3
          },
          {
            imgUrl:'',
            name:'陌生人',
            date:'2020.2.13 14:58:57',
            address:'四川省成都市双流机场小区',
            temperature:37.2
          },
          {
            imgUrl:'',
            name:'陌生人',
            date:'2020.2.13 14:58:57',
            address:'四川省成都市双流区双楠国际小区',
            temperature:37.9
          },
          {
            imgUrl:'',
            name:'洪翰',
            date:'2020.2.13 14:58:57',
            address:'四川省成都市双流区双楠国际小区',
            temperature:35.9
          },
          // {
          //   imgUrl:'',
          //   name:'宿成飞',
          //   date:'2020.2.13 14:58:57',
          //   address:'四川省成都市高新区软件园E区',
          //   temperature:38.1
          // },
        ],
        areaNumList:[
          {
            areaName:'高新区',
            temHotNum:19
          },
          {
            areaName:'成华区',
            temHotNum:15
          },
          {
            areaName:'武侯区',
            temHotNum:14
          },
          {
            areaName:'金牛区',
            temHotNum:11
          },
          {
            areaName:'天府新区',
            temHotNum:10
          },
          {
            areaName:'锦江区',
            temHotNum:10
          },
          {
            areaName:'金堂县',
            temHotNum:8
          },
          {
            areaName:'大邑县',
            temHotNum:7
          },
          {
            areaName:'郫都区',
            temHotNum:7
          }
        ],
        unitList:[
          {
            areaName:'社区',
            temNum:32
          },
          {
            areaName:'餐饮',
            temNum:39
          },
          {
            areaName:'楼宇',
            temNum:8
          },
          {
            areaName:'学校',
            temNum:5
          }
        ],
        peoNumList:[
          {
            areaName:'低温人数',
            temNum:32
          },
          {
            areaName:'内容常温人数',
            temNum:39
          },
          {
            areaName:'低热人数',
            temNum:8
          },
          {
            areaName:'高温人数',
            temNum:5
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
        // this.showProvince('sichuan')
        this.showLine();
        // this.charts.on('click', function (params) {
        //     console.log(params);
        // });

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
        font-size:46px;
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
          #sichuan{
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
                  padding: 8px 12px;
                  position: relative;
                  margin-bottom: 10px;
                  .top-img{
                    width: 70px;
                    height: 70px;
                    background-color: blue;
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
          .marshalling{
            position: absolute;
            right: 40px;
            bottom: 14px;
          }
        }
        .data-box{
          width: 430px;
          .title{
            padding: 8px 0 12px;
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
              height: 190px;
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
                  height: 50px;
                  background:rgba(32,45,70,1);
                  border:1px solid rgba(64,71,94,1);
                  position: relative;
                  padding-left: 15px;
                  span{
                    font-size:18px;
                    color:rgba(204,235,246,1);
                    line-height:46px;
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
                  margin-top: 12px;
                }
              }
              .dividing-line{
                width: 66px;
                padding: 0 20px;
                img{
                  width: 26px;
                }
              }
              .peo-num-list{
                width: 196px;
                .peo-num{
                  width: 100%;
                  height: 60px;
                  padding: 0 20px 0 24px;
                  background: url("~@/assets/es/bg_wdrs@2x.png") no-repeat;
                  background-size: 100%;
                  display: flex;
                  justify-content:space-between;
                  span{
                    font-size:14px;
                    color:rgba(204,235,246,1);
                    line-height: 60px;
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
              height:160px;
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
