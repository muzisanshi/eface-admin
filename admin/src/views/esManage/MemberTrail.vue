<!-- 人员轨迹 -->
<template>
  <div class="member-trail">

    <!-- 地图 -->
    <div class="map" style="height: 100%;position: absolute;z-index: 0;width: 100%">
      <div id="allmap" class="Map" style="width: 100%;height: 100%"/>
    </div>

    <!-- 人员信息 -->
    <div class="member-info">

       <div class="header">

         <img class="bg-img" src="../../assets/es/img_titlebg@2x.png"/>

         <div class="left">
           <img class="back" src="../../assets/es/btn_back.png"/>
           <span class="title">东方天呈点位体温实时状态</span>
           <!-- <span class="late">（近14天）</span> -->
         </div>

         <div class="right">
           <span class="time">2020-02-15 16:58:59</span>
           <img class="full-screen" src="../../assets/es/btn_fullscreen@2x.png"/>
         </div>

       </div>

       <div class="body">

        <div class="excep-member">

           <!-- 三角形 -->
           <img class="angle" src="../../assets/es/img_angle.png"/>

           <div style="padding: 25px;">
             <div class="status">异常人员</div>
             <div class="pic">
               <img />
             </div>
             <div class="member-temp">
               <span class="name">广晨辉</span>
               <span class="temp">37.8℃</span>
             </div>
           </div>

           <div class="member-detail">
             <div class="title">识别记录</div>
             <div style="padding: 25px;">
               <div class="detail-item">
                 <span class="n">名称：</span>
                 <span class="v">双楠国际小区</span>
               </div>
               <div class="detail-item">
                 <span class="n">时间：</span>
                 <span class="v">2020.2.13 14:58:57</span>
               </div>
               <div class="detail-item">
                 <span class="n">位置：</span>
                 <span class="v">成都市双流区双楠国际小区南门门禁</span>
               </div>
             </div>

           </div>
        </div>

        <div class="trail">
          <div class="wrapper">

            <img class="angle" src="../../assets/es/img_angle.png"/>

            <div class="title">TA的行为轨迹</div>

            <div class="blocks">

              <div class="block" v-for="(it,id) in blocks" :key="id">

                <div class="t">
                  <div class="l">
                    <img class="pos" src="../../assets/es/icon_map@2x.png"/>
                    <span>双楠国际小区</span>
                  </div>
                  <div class="r">
                    <span>在此出现过的人：</span>
                    <span>81人正常</span>
                    <span>3人异常</span>
                  </div>
                </div>

                <div class="main">
                    <div class="list">
                      <div class="before" @click="before(it,id)">
                        <img class="b" src="../../assets/es/btn_enter@2x.png"/>
                      </div>
                      <div class="list-main" :id="'listmain'+id">
                        <div class="page" v-for="(t,i) in it.pages" :key="i">

                          <div class="item" v-for="(tt,ii) in t.items" :key="ii">
                            <div class="member" :class="ii===0?'excep':'ok'">
                              <div class="top">
                                <img class="av"/>
                                <span class="temp">38.5°C</span>
                              </div>
                              <div class="name">
                                檀欢秋
                              </div>
                              <div class="date">
                                2020-02-22 20:28
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                      <div class="next" @click="next(it,id)">
                        <img class="n" src="../../assets/es/btn_enter@2x.png"/>
                      </div>
                    </div>

                </div>

              </div>

            </div>

          </div>
        </div>

       </div>

    </div>

  </div>
</template>

<script>
  export default {
    data(){
      return {
        pageWidth:0,
        blocks:[
          {
            curPage:1,
            totalWidth:0,
            pages:[
              {
                items:[1,2,3,4,5,6,7,8]
              },
              {
                items:[1,2,3,4,5,6,7,8]
              }
            ]
          },
          {
            curPage:1,
            totalWidth:0,
            pages:[
              {
                items:[1,2,3,4,5,6,7,8]
              },
              {
                items:[1,2,3,4,5,6,7,8]
              }
            ]
          }
        ],

      }
    },
    computed:{

    },
    methods:{
      before(block,id){
        if(block.curPage > 1){
          block.curPage --;
          $('#listmain'+id).animate({
            scrollLeft:((block.curPage - 1) * this.pageWidth) + 'px'
          },300);
        }
      },
      next(block,id){
        if(block.curPage < block.pages.length){
          $('#listmain'+id).animate({
            scrollLeft:(block.curPage * this.pageWidth) + 'px'
          },300);
          block.curPage ++;
        }
      },

      createMap(){
        let that = this;
        var map = new BMap.Map("allmap");   //初始化map, 绑定id=allmap
        var point = new BMap.Point(104.321768, 30.88748);   // 初始化point, 给定一个默认x,y值
        map.centerAndZoom(point, 10);        // 将point点放入map中，展示在页面中心展示，10=缩放程度
        map.enableScrollWheelZoom();         // 开启滚动鼠标滑轮

        var mapStyle ={
          features: ["road","building","water","land"],//隐藏地图上的"poi",
          style : 'dark',
        };

        map.setMapStyle(mapStyle);

        that.addDistrict(map);
      },

      addPoint(map){
        let that = this;
        // 如有多个point去展示，可根据后端接口传入为主
        let data = [
          { x: 104.297047, y: 30.479542, name: '双楠国际小区',isHot:true },
          { x: 104.221768, y: 30.58748, name: '金都花园小区',isHot:false },
          { x: 104.294243, y: 30.656539, name: '国色天乡小区',isHot:true }
        ]

        data.forEach((e, i) => {
          // 创建point, 将x,y值传入
          let pointNumber = new BMap.Point(e.x, e.y)
          let icon = null;
          if(e.isHot){
            icon = new BMap.Icon(require("@/assets/es/img_mapred.png"),new BMap.Size(73,73));
          }else{
            icon = new BMap.Icon(require("@/assets/es/img_mapgreen.png"),new BMap.Size(73,73));
          }

          var content = "<table>";
          content = content + "<tr><td> 编号：001</td></tr>";
          content = content + "<tr><td> 地点："+e.name+"</td></tr>";
          content = content + "<tr><td> 时间：2018-1-3</td></tr>";
          content += "</table>";

          // 创建信息窗口对象
          let infoWindow = new BMap.InfoWindow(content);

          // 将data中的name加入地图中
          var label = new BMap.Label(e.name, {
            offset: new BMap.Size(0, -22)
          });

          label.setStyle({
            padding:'2px 5px',
            backgroundColor:'rgba(216,216,216,0.2)',
            border:'1px solid rgba(45,127,206,1)',
            color:'rgba(236,236,244,1)'
          });

          that.markerFun(pointNumber, infoWindow, label,icon,map)
        })

        // 获取当前地理位置
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            // alert('您的位置：' + r.point.lng + ',' + r.point.lat);
          } else {
            // alert('failed' + this.getStatus());
          }
        });
      },

      markerFun(points, infoWindows, label,icon,map){
        let markers = new BMap.Marker(points,{icon:icon});
        map.addOverlay(markers);  // 将标注添加到地图中
        markers.setLabel(label);  // 将data中的name添加到地图中
        // 标注的点击事件
        markers.addEventListener("click", function (event) {
          map.openInfoWindow(infoWindows, points);//参数：窗口、点  根据点击的点出现对应的窗口
        });
      },

      addDistrict(map){
        let that = this;
        var bdary = new BMap.Boundary();
        bdary.get("成都市", function(rs){       //获取行政区域
          map.clearOverlays();        //清除地图覆盖物
          var count = rs.boundaries.length; //行政区域的点有多少个
          if (count === 0) {
            alert('未能获取当前输入行政区域');
            return ;
          }
          var pointArray = [];
          for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "rgba(3,20,47,1)",fillColor: 'rgba(3,20,47,1)'}); //建立多边形覆盖物
            map.addOverlay(ply);  //添加覆盖物
            pointArray = pointArray.concat(ply.getPath());
          }
          if (that.districtLoading == 0) {
            //全加载完成后画端点
            that.addPoint(map)
          }
          that.districtLoading++;
          map.setViewport(pointArray);    //调整视野
          that.addlabel(map);
        });
      },

      addlabel(map){
        var pointArray = [
          new BMap.Point(121.716076,23.703799),
          new BMap.Point(112.121885,14.570616),
          new BMap.Point(123.776573,25.695422)];
        var optsArray = [{},{},{}];
        var labelArray = [];
        var contentArray = [
          "台湾是中国的！",
          "南海是中国的！",
          "钓鱼岛是中国的！"];
        for(var i = 0;i < pointArray.length; i++) {
          optsArray[i].position = pointArray[i];
          labelArray[i] = new BMap.Label(contentArray[i],optsArray[i]);
          labelArray[i].setStyle({
            color : "red",
            fontSize : "12px",
            height : "20px",
            lineHeight : "20px",
            fontFamily:"微软雅黑"
          });
          map.addOverlay(labelArray[i]);
        }
      }

    },
    mounted(){
      this.createMap();
      if($){
        let pw = $('.list-main').width();
        if(pw){
          this.pageWidth = pw;
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .member-trail{
    background-color: #071832;
    height: 100%;
    min-width: 1200px;

    .member-info{
      padding: 15px 40px;
      .header{
        position: relative;
        .bg-img{
          position: relative;
          width: 100%;
        }
        .left{
          position: absolute;
          width: 50%;
          color: #2D7FCE;
          font-size: 2.0rem;
          height: 26px;
          top:calc(50% - 13px);
          .back{
             width: 26px;
             height: 26px;
             position: absolute;
             left: 18px;
             cursor: pointer;
          }
          .title{
            position: absolute;
            height: 26px;
            line-height: 26px;
            left: 54px;
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

      .body{
        margin-top: 10px;
        position: relative;
        .excep-member{
          position: relative;
          width: 300px;
          border:1px solid #2359BA;
          color: white;
          background-color: #071832;
          .status{
            color: #FA4F65;
            font-size: 1.4rem;
            padding-bottom: 5px;
            border-bottom: 1px solid #454F63;
          }
          .pic{
            text-align: center;
            margin-top: 15px;
            img{
              width: 240px;
              height: 240px;
              background-color: lightgray;
            }
          }
          .member-temp{
            margin-top: 15px;
            clear: both;
            .name{
              font-size: 1.4rem;
            }
            .temp{
              font-size: 1.4rem;
              color: #FA4F65;
              float: right;
            }
          }
          .member-detail{
            font-size: 1.0rem;
            .title{
              width: 100%;
              padding: 15px 25px;
              background-color: rgb(20,30,64);
            }
            .detail-item{
              color: #707B91;
              margin-bottom: 10px;
              .n{
                display: inline-block;
                width: 50px;
              }
              .v{
                display: inline-block;
                width: calc(100% - 50px);
                vertical-align: top;
                color: white;
              }
            }
          }

          .angle{
            position: absolute;
            width: 24px;
            top:0px;
            right: -1px;
          }
        }


        .trail{
          width: 460px;
          position: absolute;
          top: 0px;
          right: 0px;

          .wrapper{
            position: relative;
            border:1px solid #2359BA;
            color: white;
            background-color: #071832;
            padding: 15px 25px;
          }

          .angle{
            position: absolute;
            width: 24px;
            top:0px;
            right: -1px;
          }

          .title{
            color: white;
            font-size: 1.4rem;
            padding-bottom: 5px;
            border-bottom: 1px solid #454F63;
          }

          .blocks{

            height: 660px;
            overflow-y: scroll;

            .block{
              background-color: rgb(25,45,85);
              margin-top: 10px;
              padding: 10px;

              .t{
                position: relative;
                .l{
                   .pos{
                     width: 18px;
                     height: 18px;
                   }
                   span{
                     font-size: 0.9rem;
                     line-height: 16px;
                     margin-left: 5px;
                   }
                }
                .r{
                  position: absolute;
                  top:0px;
                  right: 0px;
                  span:first-child{
                    color: white;
                    font-size: 0.5rem;
                  }
                  span:nth-child(2){
                    color: #04D167;
                    font-size: 0.5rem;
                  }
                  span:nth-child(3){
                    color: #FF3C3E;
                    font-size: 0.4rem;
                    margin-left: 5px;
                  }
                }
              }

              .main{
                margin-top: 15px;
                overflow-x: hidden;

                .list{
                  height: 340px;
                  .before{
                    position: relative;
                    z-index: 1;
                    cursor: pointer;
                    display: inline-block;
                    width: 30px;
                    height: 100%;
                    background-color: #0C2141;
                    border-radius: 4px;
                    text-align: center;
                    vertical-align: top;
                    .b{
                      position: relative;
                      width: 12px;
                      height: 12px;
                      top:calc(50% - 5px);
                      transform: rotate(180deg);
                    }
                  }

                  .list-main::-webkit-scrollbar { height: 0px !important;}
                  .list-main{
                    position: relative;
                    border-radius: 4px;
                    z-index: 0;
                    display: inline-block;
                    width: calc(100% - 60px);
                    vertical-align: top;
                    overflow-x:sroll;
                    overflow-y: hidden;
                    white-space: nowrap;
                    height: 100%;


                    .page{
                      display: inline-block;
                      white-space: normal;
                      width: 100%;
                      .item{
                        width: 25%;
                        padding: 10px;
                        display: inline-block;

                        .member{
                          font-size: 0.8rem;
                          display: inline-block;
                          .top{
                            .av{
                              width: 100%;
                              height: 60px;
                              background-color: lightgray;
                            }
                            .temp{
                              width: 100%;
                              display: block;
                              text-align: center;
                              padding: 1px 0px;
                            }
                          }
                          .name{
                            width: 100%;
                            text-align: center;
                            color: white;
                            margin-top: 10px;
                          }
                          .date{
                            width: 100%;
                            text-align: center;
                            color: #707B91;
                            margin-top: 0px;
                            font-size: 11px;
                          }
                        }
                        .member.excep{
                          .top{
                             border: 1px solid #FF3C3E;
                          }
                          .temp{
                            background-color: #FF3C3E;
                          }
                        }
                        .member.ok{
                          .top{
                            border: 1px solid #7CCB27;
                          }
                          .temp{
                            background-color: #7CCB27;
                          }
                        }
                      }
                    }

                  }

                  .next{
                    position: relative;
                    z-index: 1;
                    cursor: pointer;
                    display: inline-block;
                    width: 30px;
                    height: 100%;
                    background-color: #0C2141;
                    border-radius: 4px;
                    text-align: center;
                    vertical-align: top;

                    .n{
                      position: relative;
                      width: 12px;
                      height: 12px;
                      top:calc(50% - 5px);
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
