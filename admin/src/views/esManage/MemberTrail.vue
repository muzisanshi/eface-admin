<!-- 人员轨迹 -->
<template>
  <div class="member-trail">
    
    <!-- 地图 -->
    <div class="map">
      
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
      }
    },
    mounted(){
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
