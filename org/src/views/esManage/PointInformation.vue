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
            <span style="padding-left: 5px">{{pointItem.name}}点位体温实时状态</span>
          </div>
          <div class="time">
            <span style="padding-right: 20px">{{curDate}}</span>
            <span @click="togglefullScreen"><img style="width: 50px;" src="@/assets/es/btn_fullscreen@2x.png" alt=""></span>
          </div>
        </div>
      </div>
    </header>
    <section>
      <div class="content-box clearfix">
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
                    <p class="name">{{item.userRealName?item.userRealName:'陌生人'}}</p>
                    <p class="time">{{item.recDatetime}}</p>
                    <p class="address">{{item.fullAddress}}</p>
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

          <div class="count-test-num">
            <div class="data-left">
              <div class="test-data-left">
                <div class="statistics-list" style="margin-bottom: 44px">
                  <div class="normal-color">
                    <div class="title">累计检测人次</div>
                    <div class="people-num">{{toFourth(statistics.temperatureCheckTotal)}}</div>
                  </div>

                  <div class="normal-color">
                    <div class="title">累计高热总人数</div>
                    <div class="people-num">{{toFourth(statistics.temperatureHeatTotal)}}</div>
                  </div>

                </div>

                <div class="statistics-list">

                  <div class="normal-color">
                    <div class="title">今日检测人次</div>
                    <div class="people-num">{{toFourth(statistics.temperatureCheckTodayTotal)}}</div>
                  </div>

                  <div class="normal-color">
                    <div class="title">今日高热人数</div>
                    <div class="people-num">{{toFourth(statistics.temperatureHeatTodayTotal)}}</div>
                  </div>

                </div>

              </div>
              <div class="data-right" style="display: none">
                <div class="content">
                  <p class="content-title">本月安全指数</p>
                  <p class="content-num"><span>56.6</span>%</p>
                </div>

                <div class="content" style="margin-top: 40px">
                  <p class="content-title">今日安全指数</p>
                  <p class="content-num"><span style="color: #84D52B">50.2</span>%</p>
                </div>

              </div>
            </div>
            <div class="data-right">
              <div class="title" style="padding-bottom: 0">
                <h2><img src="@/assets/es/icon_grqst@2x (1).png" alt="">体温高热趋势图</h2>
                <p>体温异常人数</p>
              </div>

              <div class="ecahrt-line">
                <div id="hotLine" />
              </div>
            </div>
          </div>

          <div class="tem-hot-box">
            <div class="hot-title">
              <h2>体温异常人员</h2>
              <div class="change-data-btn">
                <a href="javascript:void(0);" @click="preUserHeat"><img src="@/assets/es/btn_next_1@2x.png" alt=""></a>
                <a href="javascript:void(0);" @click="nextUserHeat"><img src="@/assets/es/btn_next_2@2x.png" alt=""></a>
              </div>
            </div>
            <div class="hot-list">
              <div @click="toTrail(item)" class="hot-mess" v-for="(item,index) in temHotList" :class="{'red-back':item.temperature >37.2}">
                <div class="user-mess">
                  <div class="top-img"><img :src="item.headImageRemoteUrl" alt=""></div>
                  <p class="hot-name">{{item.userRealName?item.userRealName:'陌生人'}}</p>
                  <p class="hot-date">{{item.lastRecDatetime}}</p>
                </div>
                <div class="tem-num-box">
                  <p class="tem-num">{{item.temperature}}℃</p>
                  <img src="@/assets/es/btn_next@2x.png" alt="">
                </div>
              </div>
            </div>
          </div>

          <div class="three-box"></div>

        </div>
      </div>
    </section>

  </div>
</template>
<script>
  import Vue from 'vue'
  import {POINT_ITEM} from '@/store/mutation-types'
  import {mixin} from '@/mixins/mixin'
  export default {
    mixins:[mixin],
    data() {
      return {
        charts: '',
        charts2: '',
        curDate:'',
        timerId:'',
        thirdTimerId:'',
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
        testList:[],
        temHotList:[
          {
            imgUrl:'',
            hotName:'广晨辉',
            time:'2020.2.13 14:58:57',
            num:37.8
          },
          {
            imgUrl:'',
            hotName:'广晨辉',
            time:'2020.2.13 14:58:57',
            num:37.8
          },
          {
            imgUrl:'',
            hotName:'广晨辉',
            time:'2020.2.13 14:58:57',
            num:37.8
          },
          {
            imgUrl:'',
            hotName:'广晨辉',
            time:'2020.2.13 14:58:57',
            num:37.8
          },
          {
            imgUrl:'',
            hotName:'广晨辉',
            time:'2020.2.13 14:58:57',
            num:37.8
          },
          {
            imgUrl:'',
            hotName:'广晨辉',
            time:'2020.2.13 14:58:57',
            num:37.8
          },
        ],
        pointItem:{},
        AxData:[],
        serData:[],
        statistics:{},
        pageNumber:1,
        pageSize:6,
        hasNext:true,
        isFullScreen:false,
      }
    },
    created(){
      this.pointItem = Vue.ls.get(POINT_ITEM)
      this.getData();
      this.getAreaHeatData()
    },
    methods: {

      toTrail(item){

        localStorage.setItem('memberData',JSON.stringify(item));

        let routes = this.$router.resolve({ name: 'memberTrail'});

        window.open(routes.href, '_blank');
      },

      preUserHeat(){
        if(this.pageNumber>0){
          this.pageNumber--
          this.getUserHeatData()
        }
      },

      back(){
        this.$router.go(-1);
      },

      nextUserHeat(){
        if(this.hasNext){
          this.pageNumber++
          this.getUserHeatData()
        }
      },

      getData(){
        let that = this;

        that.getUserHeatData()

      },
      getStatistics(){
        let that = this;
        that.$api.localtionCheck.getRecRecordPage(
          {
            areaId: '510100',
            estateId:that.pointItem.id,
            page:{
              pageNumber: 1,
              pageSize: 8
            }
          })
          .then(res => {
            that.testList= res.data
          })
      },

      getAreaHeatData(){
        let that = this;
        that.getStatistics();
        that.$api.localtionCheck.statistics(
          {
            estateId:that.pointItem.id
          })
          .then(res => {
            that.statistics = res
          })

        that.$api.localtionCheck.heatTrendStatistics(
          {
            estateId:that.pointItem.id
          })
          .then(res => {
            if(res.length){
              that.AxData = [];
              that.serData = [];
              res.forEach((item)=>{
                let dateStr = item.date.substring(item.date.length-4).replace("-", "/");
                that.AxData.push(dateStr)
                that.serData.push(item.temperatureHeatTotal)
              })

              that.showLine();
            }
          })
      },

      getUserHeatData(){
        let that = this;
        that.$api.localtionCheck.getHeatUserPage(
          {
            areaId: '510100',
            estateId:that.pointItem.id,
            page:{
              pageNumber: that.pageNumber,
              pageSize: that.pageSize
            }
          })
          .then(res => {
            that.hasNext = res.hasNext
            that.temHotList= res.data
          })
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
            bottom: '14%',
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

      // 3s定时器
      startThirdTimer(){
        this.thirdTimerId = setInterval(() => {
          this.getAreaHeatData()
        },3000);
      },
      closeThirdTimer(){
        clearInterval(this.thirdTimerId);
      },

      // 时间定时器
      startTimer(){
        this.curDate = this.getDateStr();
        this.timerId = setInterval(() => {
          this.curDate = this.getDateStr();
          this.getUserHeatData();
        },1000);
      },
      closeTimer(){
        clearInterval(this.timerId);
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

      // timer() {
      //     return setInterval(()=>{
      //         this.showCity('chengdu')
      //     },5000)
      // }
    },
    mounted(){
      // 启动定时器
      this.startTimer();
      this.startThirdTimer();
      // this.timer()
    },
    beforeDestroy(){
      this.closeTimer();
      this.closeThirdTimer();
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
        position: relative;
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
            top: 10px;
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
                      font-size:24px;
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
          width: 1340px;
          position: absolute;
          top: 50px;
          left: 466px;
          background:rgba(1,20,58,1);
          opacity:0.9;
          border:1px solid rgba(45,127,206,1);
          padding: 30px 40px;
          .count-test-num{
            display: flex;
            justify-content:space-between;
            .data-left{
              width: 800px;
              height: 290px;
              background:rgba(7,24,51,1);
              border:1px solid rgba(79,88,108,1);
              padding: 30px 37px;
              display: flex;
              justify-content:space-between;
              .test-data-left{
                width: 508px;
                .statistics-list{
                  display: flex;
                  justify-content:space-between;
                  .normal-color{
                    .title{
                      width:230px;
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
                }
              }
              .data-right{
                width:156px;
                height:230px;
                background:rgba(11,32,64,1);
                border:1px solid;
                border-image:linear-gradient(135deg, rgba(0,111,171,1), rgba(11,32,64,1), rgba(11,32,64,1), rgba(0,109,169,1)) 1 1;
                padding: 14px 10px 14px 23px;
                .content{
                  font-size:14px;
                  .content-title{
                    color:rgba(159,159,226,1);
                    padding-bottom: 8px;
                  }
                  .content-num{
                    color:rgba(255,255,255,1);
                    line-height:42px;
                    span{
                      font-size:40px;
                    }
                  }
                }
              }

            }
            .data-right{
              width: 440px;
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
            }
          }
          .tem-hot-box{
            margin-top: 30px;
            .hot-title{
              display: flex;
              justify-content:space-between;
              border-bottom:1px solid rgba(69,79,99,1);
              padding-bottom: 16px;
              h2{
                font-size:30px;
                color:rgba(250,79,101,1);
                line-height:42px
              }
              .change-data-btn{
                display: flex;
                justify-content:space-between;
                padding-top: 6px;
                a{
                  width: 32px;
                  height: 32px;
                  img{
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
            .hot-list{
              height:282px;
              margin-top: 20px;
              display: flex;
              justify-content:space-between;
              .hot-mess{
                width:176px;
                height:282px;
                background:rgba(7,24,50,1);
                opacity:0.9;
                border:1px solid rgba(45,127,206,1);
                .user-mess{
                  height: 240px;
                  padding: 16px;
                  color:rgba(242,242,242,1);
                  .top-img{
                    width:144px;
                    height:144px;
                    img{
                      width: 100%;
                      height: 100%;
                    }
                  }
                  .hot-name{
                    font-size:20px;
                    line-height:27px;
                    padding: 10px 0 5px;
                  }
                  .hot-date{
                    font-size:14px;
                    line-height:20px;
                  }
                }
                .tem-num-box{
                  width: 100%;
                  height: 42px;
                  line-height: 42px;
                  padding: 0 16px;
                  display: flex;
                  justify-content:space-between;
                  background:rgba(12,33,65,1);
                  opacity:0.9;
                  p{
                    font-size:20px;
                    color:rgba(231,55,77,1);
                  }
                  img{
                    width:21px;
                    height:21px;
                    margin-top: 10px;
                  }
                }
              }
            }
          }
          .three-box{
            position: absolute;
            right: 0;
            top: 0;
            width: 0;
            height: 0;
            border-color: transparent #2D7FCE;
            border-width: 0 40px 26px 0;
            border-style: solid;
          }
        }
      }
    }
  }
</style>
