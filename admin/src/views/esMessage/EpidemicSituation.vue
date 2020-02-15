<!--
 * @name Login.vue
 * @author lw
 * @date 2019.11.5
 * @desc 登录
-->
<template>
  <div class="main">
    <!--<div id="sichuan" style="width: 1000px;height: 600px;"></div>-->
    <div id="chengdu" style="width: 1000px;height: 600px;"></div>
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
          backgroundColor: "rgb(230, 238, 243)",
          title: {
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
            top: 'bottom',
            text: ['高', '低'],
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
              color: '#000'
            }
          },
          toolbox: {
            show: true,
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
            top: 120,
            bottom: 80,
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
      showCity(id){
        let that = this;
        var name = 'chengdu';

        this.charts2 = this.$echarts.init(document.getElementById(id))

        let geoJson = require('@/utils/json/chengdu.json');

        this.$echarts.registerMap(name, geoJson);

        this.charts2.setOption({
          backgroundColor: "rgb(230, 238, 243)",
          title: {
            text: '2月15日成都市新型肺炎分布',
            left: 'center', //标题位置
            textStyle: {
              fontSize: 32,
              fontWeight: 'bolder',
              color: 'black' // 主标题文字颜色
            }
          },
          color: ['white'],
          legend: {
            left: 'left',
            data: ['强', '中', '弱'],
            textStyle: {
              color: '#ccc'
            }
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.8)',
            extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.6);',
            textStyle:{
              align:'left'
            },
            // formatter:function (params) {
            //     console.log(params)
            // }
          },
          geo: {
            map: 'chengdu',
            show: true,
            roam: false,
            label: {
              emphasis: {
                show: true   //鼠标经过区域显示区域名字
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#fff',
                borderColor: '#fff',
                shadowColor: '#fff',
                shadowBlur: 0
              }
            }
          },
          series: [
            {
              name: '城市',
              type: 'scatter',
              coordinateSystem: 'geo',
              data: that.mapData,
              symbolSize: function (val) {
                return 10;
              },
              rippleEffect: {
                brushType: 'stroke'
              },
              hoverAnimation: true,
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  color: '#f4e925',
                  shadowBlur: 10,
                  shadowColor: '#333'
                }
              },
            },
          ]
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
        //
        // this.charts.on('click', function (params) {
        //     console.log(params);
        // });

        this.showCity('chengdu')

      })
      // this.timer()
    },
    destroyed() {
      // clearInterval(this.timer)
    }

  }
</script>

<style lang="less" scoped>
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
</style>
