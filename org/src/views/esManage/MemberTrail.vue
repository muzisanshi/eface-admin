<!-- 人员轨迹 -->
<template>
  <div class="member-trail">

    <!-- 人员信息 -->
    <div class="member-info">

       <div class="header">

         <img class="bg-img" src="../../assets/es/img_titlebg@2x.png"/>

         <div class="left">
           <img @click="back" class="back" src="../../assets/es/btn_back.png"/>
           <span class="title">东方天呈点位体温实时状态</span>
           <!-- <span class="late">（近14天）</span> -->
         </div>

         <div class="right">
           <span class="time">{{curDate}}</span>
           <img @click="togglefullScreen" class="full-screen" src="../../assets/es/btn_fullscreen@2x.png"/>
         </div>

       </div>

       <div class="body">

        <div class="excep-member">

           <!-- 三角形 -->
           <img class="angle" src="../../assets/es/img_angle.png"/>

           <div style="padding: 25px;">
             <div class="status" :style="{color: memberData.temperature > 37.3 ? '#FA4F65':'#7CCB27'}">
              {{memberData.temperature > 37.3 ? '异常人员' : '正常人员'}}
             </div>
             <div class="pic">
               <img :src="memberData.headImageRemoteUrl"/>
             </div>
             <div class="member-temp">
               <span class="name">{{memberData.userRealName || '陌生人'}}</span>
               <span class="temp" :style="{color: memberData.temperature > 37.3 ? '#FA4F65':'#7CCB27'}">
               {{(memberData.temperature ? memberData.temperature : 0).toFixed(1)}}℃</span>
             </div>
           </div>

           <div class="member-detail">
             <div class="title">识别记录</div>
             <div style="padding: 25px;">
               <div class="detail-item">
                 <span class="n">名称：</span>
                 <span class="v">{{memberData.estateName}}</span>
               </div>
               <div class="detail-item">
                 <span class="n">时间：</span>
                 <span class="v">{{memberData.recDatetime}}</span>
               </div>
               <div class="detail-item">
                 <span class="n">位置：</span>
                 <span class="v">{{memberData.fullAddress}}</span>
               </div>
             </div>

           </div>
        </div>

        <!-- 地图 -->
        <div class="map">
          <div id="allmap" class="Map"/>
        </div>

        <div class="trail">
          <div class="wrapper">

            <img class="angle" src="../../assets/es/img_angle.png"/>

            <div class="title">TA的行为轨迹</div>

            <div class="blocks">

              <div class="block" v-for="(it,id) in trailData" :key="id">

                <div class="t">
                  <div class="l">
                    <img class="pos" src="../../assets/es/icon_map@2x.png"/>
                    <span>{{it.name}}</span>
                  </div>
                  <div class="r">
                    <span>在此出现过的人：</span>
                    <span>{{it.temperatureAbnormalNum}}人正常</span>
                    <span>{{it.temperatureNormalNum}}人异常</span>
                  </div>
                </div>

                <div class="main">
                    <div class="list">
                      <div class="before" @click="before(it,id)">
                        <img class="b" src="../../assets/es/btn_enter@2x.png"/>
                      </div>
                      <div class="list-main" :id="'listmain'+id">

                        <!-- <div class="page" v-for="(t,i) in it.pages" :key="i"> -->
                        <div class="page">

                          <!-- <div class="item" v-for="(tt,ii) in it.pages[i]" :key="ii"> -->
                          <div class="item" v-for="(tt,ii) in it.recRecordPageData.records" :key="ii">
                            <div class="member" :class="tt.isHot ? 'excep' : 'ok'">
                              <div class="top">
                                <img class="av" :src="tt.headImageRemoteUrl"/>
                                <span class="temp">{{tt.temperature.toFixed(1)}}°C</span>
                              </div>
                              <div class="name">
                                {{tt.userRealName || '陌生人'}}
                              </div>
                              <div class="date">
                                {{tt.recDatetime}}
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
        timerId:'',
        curDate:'',
        memberData:{
          id:'',
          userRealName:'',
          temperature:'',
          recDatetime:'',
          lastRecDatetime:'',
          fullAddress:'',
          headImageRemoteUrl:'',
          estateId:'',
          estateName:''
        },
        districtLoading:0,
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
        map:null,

        mapData:[],
        trailData:[],

        isFullScreen:false,
      }
    },
    computed:{

    },
    methods:{

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

      getDateStr(){
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0'+m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0'+d) : d;

        let h = date.getHours();
        h = h < 10 ? ('0'+h) : h;
        let f = date.getMinutes();
        f = f < 10 ? ('0'+f) : f;
        let s = date.getSeconds();
        s = s < 10 ? ('0'+s) : s;

        return y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s;
      },

      refresh(){
        this.timerId2 = setInterval(() => {

          this.getEstates({
            recDatetime:this.memberData.recDatetime,
            recRecordId:this.memberData.id,
          });

          this.getBehaviorTracks({
            page:{
              pageNumber:1,
              pageSize:8,
            },
            recDatetime:this.memberData.recDatetime,
            recRecordId:this.memberData.id,
          });

        },1000);
      },

      // 定时器
      startTimer(){
        this.curDate = this.getDateStr();
        this.timerId = setInterval(() => {
          this.curDate = this.getDateStr();
        },1000);
      },
      closeTimer(){
        clearInterval(this.timerId);
        clearInterval(this.timerId2);
      },

      back(){
        this.$router.go(-1);
      },

      // 加载小区数据
      getEstates(data){
        this.$api.trail.getEstates(data)
        .then((r) => {
          if(r && r.length > 0){
            // 在地图上渲染数据
            let md = [];
            r.map((it) => {
              md.push({
                x:it.lng,
                y:it.lat,
                name:it.name,
                isHot:it.temperatureAbnormalNum > 0,
                num:it.temperatureAbnormalNum,
                date:it.recDatetime,
              })
            })
            this.mapData = md;

            this.addPoint(this.mapData,this.map);

          }
        });
      },

      // 加载行为轨迹
      getBehaviorTracks(data){
        this.$api.trail.getBehaviorTracks(data)
        .then(r => {

          if(r && r.trackItems.length > 0){
            // 处理数据
            r.trackItems.map((it,id) => {

              // it.curPage = 1;

              it.recRecordPageData.records.map((tt,ii) => {
                  if(tt.temperature > 37.3){
                    tt.isHot = true;
                  }
              })

              // it.totalWidth = 0;

              // let d = [Math.ceil(it.recRecords.length / 8.0)];
              // for(let i = 0;i < d.length;i++){
              //   d[i] = [];
              // }

              // it.recRecords.map((tt,ii) => {

              //   if(tt.temperature > 37.3){
              //     tt.isHot = true;
              //   }

              //   let index = ii / 8;
              //   d[index].push(tt);

              // })

              // it.pages = d;

            })

            this.trailData = r.trackItems;

          }
        })
      },
      // 加载小区分页数据
      getRecRecordPage(data,id){
        this.$api.trail.getRecRecordPage(data)
        .then(r => {
          if(r){
            this.trailData[id].recRecordPageData = r;
          }
        })
      },
      before(block,id){
        // if(block.curPage > 1){

        if(block.recRecordPageData.hasPrevious){

          // 加载对应小区的分页数据
          this.getRecRecordPage({
            areaId:'510100',
            estateId:this.memberData.estateId,
            page:{
              pageSize:8,
              pageNumber:(block.recRecordPageData.pageNumber - 1),
            },
            recDatetime:this.memberData.recDatetime,
          },id);

          // block.curPage --;
          // $('#listmain'+id).animate({
          //   scrollLeft:((block.curPage - 1) * this.pageWidth) + 'px'
          // },300);

        }
      },
      next(block,id){
        // if(block.curPage < block.pages.length){

        if(block.recRecordPageData.hasNext){

          this.getRecRecordPage({
            areaId:'510100',
            estateId:this.memberData.estateId,
            page:{
              pageSize:8,
              pageNumber:(block.recRecordPageData.pageNumber + 1),
            },
            recDatetime:this.memberData.recDatetime,
          },id);

          // $('#listmain'+id).animate({
          //   scrollLeft:(block.curPage * this.pageWidth) + 'px'
          // },300);
          // block.curPage ++;

        }
      },

      createMap(){
        let that = this;
        that.map = null;
        that.map = new BMap.Map("allmap");   //初始化map, 绑定id=allmap
        var point = new BMap.Point(104.321768, 30.88748);   // 初始化point, 给定一个默认x,y值
        that.map.centerAndZoom(point, 10);        // 将point点放入map中，展示在页面中心展示，10=缩放程度
        that.map.enableScrollWheelZoom();         // 开启滚动鼠标滑轮

        var mapStyle ={
          features: ["road","building","water","land"],//隐藏地图上的"poi",
          style : 'dark',
        };

        that.map.setMapStyle(mapStyle);

        that.addDistrict(that.map);
      },

      addPoint(data,map){
        let that = this;
        // 如有多个point去展示，可根据后端接口传入为主
        data.forEach((e, i) => {
          // 创建point, 将x,y值传入
          let pointNumber = new BMap.Point(e.x, e.y)
          let icon = null;
          if(e.isHot){
            icon = new BMap.Icon(require("@/assets/es/img_mapred.png"),new BMap.Size(73,73));
          }else{
            icon = new BMap.Icon(require("@/assets/es/img_mapgreen.png"),new BMap.Size(73,73));
          }

          // var content = "<table>";
          // content = content + "<tr><td> 编号：001</td></tr>";
          // content = content + "<tr><td> 地点："+e.name+"</td></tr>";
          // content = content + "<tr><td> 时间：2018-1-3</td></tr>";
          // content += "</table>";

          // 创建信息窗口对象
          // let infoWindow = new BMap.InfoWindow(content);

          // 将data中的name加入地图中
          let number = '<span style="position:absolute;color:white;left:-55px;top:12px;display:inline-block;width:73px;text-align:center;">'+
                          (e.num)
                      +'</span>';
          let angle = '<img style="width:12px;position:absolute;top:0px;right:0px;z-index:999;" src="' + require('../../assets/es/img_angle.png') + '"/>';
          var label = new BMap.Label(e.name + number + '<br>' + e.date, {
            offset: new BMap.Size(54,14)
          });

          label.setStyle({
            padding:'5px 8px',
            backgroundColor:'rgba(216,216,216,0.2)',
            border:'1px solid rgba(45,127,206,1)',
            color:'rgba(236,236,244,1)',
            lineHeight:'20px',
          });

          that.markerFun(pointNumber, null, label, icon, map);

        })

        // 获取当前地理位置
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            // map.addOverlay(mk);
            map.panTo(r.point);
          }
        });
      },

      markerFun(points, infoWindows, label,icon,map){
        let markers = new BMap.Marker(points,{icon:icon});
        map.clearOverlays();
        map.addOverlay(markers);  // 将标注添加到地图中
        markers.setLabel(label);  // 将data中的name添加到地图中
        // 标注的点击事件
        markers.addEventListener("click", function (event) {
          if(infoWindows){
            map.openInfoWindow(infoWindows, points);//参数：窗口、点  根据点击的点出现对应的窗口
          }
        });
      },

      addDistrict(map){
        let that = this;
        var bdary = new BMap.Boundary();
        bdary.get("成都市", function(rs){       //获取行政区域
          map.clearOverlays();        //清除地图覆盖物
          var count = rs.boundaries.length; //行政区域的点有多少个`
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
            //全加载完成后加载数据渲染
            // that.addPoint(mapData,map)

            // 加载数据
            that.getEstates({
              recDatetime:that.memberData.recDatetime,
              recRecordId:that.memberData.id,
            });

          }
          that.districtLoading++;
          map.setViewport(pointArray);    //调整视野

        });
      },

      calcMap(){
        // 计算地图高度
        let conHeight = $('.member-trail').height();
        let headHeight = $('.header').outerHeight(true);
        let mapHeight = conHeight - headHeight - 30;
        $('.map').height(mapHeight);
      },

    },
    mounted(){

      // 处理params参数
      let localData = localStorage.getItem('memberData');
      localData = localData ? JSON.parse(localData) : {};

      this.memberData = this.$route.params.id ? this.$route.params : localData;

      // 备份数据到本地
      localStorage.setItem('memberData',JSON.stringify(this.memberData));

      window.onresize = () => {
        this.calcMap();
      }

      if($){
        let pw = $('.list-main').width();
        if(pw){
          this.pageWidth = pw;
        }
        this.createMap();
        setTimeout(() => {
          this.calcMap();
        },500)
      }

      // 启动定时器
      this.startTimer();

      // 加载轨迹数据
      this.getBehaviorTracks({
        page:{
          pageNumber:1,
          pageSize:8,
        },
        recDatetime:this.memberData.recDatetime,
        recRecordId:this.memberData.id,
      });

      // 定时刷新数据
      this.refresh();

    },
    beforeDestroy(){
      this.closeTimer();
    }
  }
</script>

<style lang="less" scoped>
  .member-trail{
    background-color: #071832;
    height: 100%;
    min-width: 1200px;
    min-height: 900px;

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
          z-index: 1;
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
              background-color: transparent;
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

        .map{
          height: 100%;
          width: calc(100% - 460px);
          position: absolute;
          z-index: 0;
          top:0px;

          .Map{
            width: 100%;
            height: 100%;
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

          .blocks::-webkit-scrollbar { width: 0px !important;}
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

                    scrollbar-color: transparent transparent;
                    scrollbar-track-color: transparent;

                    -ms-overflow-style:none;
                    -ms-scrollbar-track-color: transparent;

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
