<template>
  <div id="container">
    <h4 id="status"></h4>
    <hr />
    <p id="result"></p>
    <hr />
  </div>
</template>

<script>
export default {
  mounted() {
    window.onLoad = function() {
      var map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 21
      });
      AMap.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：5s
          buttonPosition: "RB", //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true //定位成功后是否自动调整地图视野到定位点
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status, result) {
          if (status == "complete") {
            onComplete(result);
          } else {
            onError(result);
          }
        });
      });
      //解析定位结果
      function onComplete(data) {
        document.getElementById("status").innerHTML = "定位成功";
        var str = [];
        str.push("定位结果：" + data.position);
        str.push("定位类别：" + data.location_type);
        if (data.accuracy) {
          str.push("精度：" + data.accuracy + " 米");
        } //如为IP精确定位结果则没有精度信息
        str.push("是否经过偏移：" + (data.isConverted ? "是" : "否"));
        document.getElementById("result").innerHTML = str.join("<br>");
      }
      //解析定位错误信息
      function onError(data) {
        document.getElementById("status").innerHTML = "定位失败";
        document.getElementById("result").innerHTML =
          "失败原因排查信息:" + data.message;
      }
    };
    const key = "feebdc3cbcd4f4f6dcab6ad5f2428b3e";
    var url = `https://webapi.amap.com/maps?v=1.4.15&key=${key}&callback=onLoad`;
    var jsapi = document.createElement("script");
    jsapi.charset = "utf-8";
    jsapi.src = url;
    document.head.appendChild(jsapi);
  }
};
</script>

<style lang="less" scoped>
#container {
  margin: 0 auto;
  width: 500px;
  height: 500px;
}
</style>