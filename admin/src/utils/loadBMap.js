
let initMap = null

export default {
  createMap (mapId) {
    const that = this
    initMap = new BMap.Map(mapId) // 创建Map实例
    initMap.centerAndZoom('成都', 12) // 初始化地图,用城市名设置地图中心点
    initMap.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    // mp.enableScrollWheelZoom();
    initMap.enableInertialDragging()
    initMap.enableContinuousZoom()

    // 添加城市切换
    var size = new BMap.Size(10, 20)
    initMap.addControl(new BMap.CityListControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      offset: size
    }))

    // 添加带有定位的导航控件
    var navigationControl = new BMap.NavigationControl({
      // 靠左上角位置
      anchor: BMAP_ANCHOR_TOP_RIGHT,
      // LARGE类型
      type: BMAP_NAVIGATION_CONTROL_LARGE,
      // 启用显示定位
      enableGeolocation: true
    })
    initMap.addControl(navigationControl)

    // 添加定位控件
    var geolocationControl = new BMap.GeolocationControl()
    initMap.addControl(geolocationControl)

    var geoc = new BMap.Geocoder()
    // 填加鼠标点击事件
    initMap.addEventListener('click', e => {
      // alert(e.point.lng + "," + e.point.lat);
      console.log(e.point.lng, e.point.lat)
      // that.$set(that.applicantForm, 'lgtVal', String(e.point.lng));
      // that.$set(that.applicantForm, 'lttVal', String(e.point.lat));

      initMap.clearOverlays()
      var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)) // 创建点
      initMap.addOverlay(marker) // 增加点

      geoc.getLocation(e.point, function(rs) {
        const addComp = rs.addressComponents
        // that.$set(that.applicantForm, 'adr', addComp.province+addComp.city+addComp.district+addComp.street+ addComp.streetNumber);
        that.currentAddress = addComp.province + ', ' + addComp.city + ', ' + addComp.district + ', ' + addComp.street + ', ' + addComp.streetNumber
      })
    })
  },

  addressChange (val) {
    const that = this
    if (val) {
      var ac = new BMap.Autocomplete( // 建立一个自动完成的对象
        {
          'input': 'detailAddress',
          'location': initMap
        })
      ac.addEventListener('onhighlight', function (e) { // 鼠标放在下拉列表上的事件
        var str = ''
        var _value = e.fromitem.value
        var value = ''
        if (e.fromitem.index > -1) {
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

        value = ''
        if (e.toitem.index > -1) {
          _value = e.toitem.value
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
        //  G("searchResultPanel").innerHTML = str;
      })
      var myValue
      ac.addEventListener('onconfirm', function (e) { // 鼠标点击下拉列表后的事件
        var _value = e.item.value
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business
        // G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

        setPlace(myValue)
      })
    }
  }

}

function setPlace(myValue) {
  initMap.clearOverlays() // 清除地图上所有覆盖物
  function myFun(e) {
    var pp = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
    console.log(pp.lng, pp.lat)
    initMap.centerAndZoom(pp, 18)
    initMap.addOverlay(new BMap.Marker(pp)) // 添加标注
  }

  var local = new BMap.LocalSearch(initMap, { // 智能搜索
    onSearchComplete: myFun
  })
  local.search(myValue)
}
