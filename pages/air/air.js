
var wxcharts = require('../../libs/wxcharts')
var app = getApp()
var lineDate = ''
var dateArray = ''
var jsonObject = ''
var array = ''
var temp = ''
var pm25 = ''
var pm10 = ''
var no2 = ''
var so2 = ''
var co = ''
var o3 = ''
Page({
  data: {
    currtab: 0,
    lineDate: '',
    dateArray: '',
    array :'',
    temp :'',
    pm25: '',
    pm10: '',
    no2: '',
    so2: '',
    co: '',
    o3: ''
  
   
    
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('onLoad')
    var that = this
    that.getLocation();
    
  },
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
   
  },
  //获取经纬度方法
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log("lat:" + latitude + " lon:" + longitude);

        that.getCity(latitude, longitude);
      }
    })
  },
  //获取城市信息
  getCity: function (latitude, longitude) {
    var that = this
    var url = "https://api.map.baidu.com/geocoder/v2/";
    var params = {
      ak: "H5xBXvZaHSTrbTEo0oWtmugUG8oFeKtZ",
      output: "json",
      location: latitude + "," + longitude
    }
    wx.request({
      url: url,
      data: params,
      success: function (res) {
        app.globalData.defaultCity = app.globalData.defaultCity ? app.globalData.defaultCity : res.data.result.addressComponent.city;
        app.globalData.defaultCounty = app.globalData.defaultCounty ? app.globalData.defaultCounty : res.data.result.addressComponent.district;
        var city = res.data.result.addressComponent.city;
        var district = res.data.result.addressComponent.district;
        var street = res.data.result.addressComponent.street;

        that.setData({
          city: city,
          district: district,
          street: street,
        })

        var descCity = city.substring(0, city.length - 1);
       
        that.pieShow(app.globalData.defaultCity)
     
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
 
  /**
   * @Explain：获取设备信息
   */
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },

 
 

 

  

 
  pieShow: function (city) {
    var that = this,
      array = new Array(),
      jsonObject = new Array(),
      air_sta = new Array(),
      pm25Array = new Array(),
     
      params = {
        location: city,
        key: app.globalData.heWeatherKeyMe,
        rnd: new Date().getTime()
      }
    wx.request({
      url: app.globalData.heWeatherBase + "/s6/air",
      data: params,
      method: 'GET',
      success: function (res) {
     
        jsonObject = res.data.HeWeather6[0].air_now_station;
         pm25 = res.data.HeWeather6[0].air_now_city.pm25;
         pm10 = res.data.HeWeather6[0].air_now_city.pm10;
         no2 = res.data.HeWeather6[0].air_now_city.no2;
         so2 = res.data.HeWeather6[0].air_now_city.so2;
         co = res.data.HeWeather6[0].air_now_city.co;
         o3 = res.data.HeWeather6[0].air_now_city.o3;  
        for (var i = 0; i < jsonObject.length; i++) {
          air_sta[i] = jsonObject[i].air_sta;
          pm25Array[i] = jsonObject[i].pm25;
        };
        
         console.log(pm25 + 'pm25'),
         console.log(pm10 + 'pm10'),
          console.log(no2 + 'no2'),
          console.log(so2 + 'so2'),
          console.log(co + 'co'),
           console.log(o3 + 'o3'),  
           console.log(city + 'CITY'),      
            that.setData({
              
           pm25: pm25,
           pm10: pm10,
           no2: no2,
           so2: so2,
           co: co,
           o3: o3,
         
             });
       
        new wxcharts({
          canvasId: 'barGraph',
          type: 'column',

          categories: [air_sta[0] + '', air_sta[1] + '', air_sta[2] + '', air_sta[3] + '', air_sta[4] + '',],
          series: [{      
            data: [pm25Array[0], pm25Array[1], pm25Array[2], pm25Array[3], pm25Array[4],]
          }],
          yAxis: { 
            min:0
          },
          width: 380,
          height: 200,
          legend: false,
          dataLabel: true, // 是否在图表中显示数据内容值
          extra:{
            column:{
              width:20,          
            },
            radar:{
              labelColor: '#666666',
            }

          }
        });

        new wxcharts({
          canvasId: 'pieGraph',
          type: 'pie',
          series: [{ name: 'PM25', data: parseInt(pm25) }, { name: 'PM10', data: parseInt(pm10) }, { name: 'NO2', data: parseInt(no2) }, { name: 'SO2', data: parseInt(so2) }, { name: 'CO', data: parseInt(co) }, { name: 'O3', data: parseInt(o3) }],
          width: 380,
          height: 300,
          dataLabel: true,
        });
        
         
      },
 
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      },

    });
 
   
  },
  

})