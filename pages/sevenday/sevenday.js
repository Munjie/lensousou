
var wxcharts = require('../../libs/wxcharts')
var app = getApp()
var lineDate = ''
var dateArray = ''
var jsonObject = ''
var array = ''
var temp = ''


Page({
  data: {
    currtab: 0,
    lineDate: '',
    dateArray: '',
    array :'',
    temp :'',
    
    
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
        app.globalData.defaultCity = app.globalData.defaultCity ? app.globalData.defaultCity : t.data.result.addressComponent.city,
          app.globalData.defaultCounty = app.globalData.defaultCounty ? app.globalData.defaultCounty : t.data.result.addressComponent.district;
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
      dateTime = new Array(),
      jsonObject = new Array(),
      maxTmp = new Array(),
      minTmp = new Array(),
    
   
      params = {
        location: city,
        key: app.globalData.heWeatherKeyMe,
        rnd: new Date().getTime()
      }
    wx.request({
      url: app.globalData.heWeatherBase + "/s6/weather",
      data: params,
      method: 'GET',
      success: function (res) {
        //正则模糊匹配
        var sun = new RegExp('晴');
        var clody = new RegExp('云');
        var overcast = new RegExp('阴');
        var rain = new RegExp('雨');
        var snow = new RegExp('雪');
       //白天总数
        var dsunSum = 0;   
        var dclodySum= 0;  
        var dovercastSum = 0;
        var drainSum = 0;
        var dsnowSum = 0;
        //夜间总数
        var nsunSum = 0;   
        var nclodySum = 0;
        var novercastSum = 0;
        var nrainSum = 0;
        var nsnowSum = 0;
        
        jsonObject = res.data.HeWeather6[0].daily_forecast;
        var now = res.data.HeWeather6[0].now.pcpn;
        for (var i = 0; i < jsonObject.length; i++) {
          dateTime[i] = jsonObject[i].date.substring(jsonObject[i].date.length - 5, jsonObject[i].date.length);
          maxTmp[i] = jsonObject[i].tmp_max;
          minTmp[i] = jsonObject[i].tmp_min;
          if (sun.test(jsonObject[i].cond_txt_d)){        
            dsunSum ++;
          }; 
          if (clody.test(jsonObject[i].cond_txt_d)){
            dclodySum++;  
          };
           if (overcast.test(jsonObject[i].cond_txt_d)) {            
            dovercastSum++;      
          }; 
           if (rain.test(jsonObject[i].cond_txt_d)) {
            drainSum++;        

          }; 
          if (snow.test(jsonObject[i].cond_txt_d)) {
            dsnowSum++;

          }; 
           if (sun.test(jsonObject[i].cond_txt_n)) {
            nsunSum++;

          } ;
           if (clody.test(jsonObject[i].cond_txt_n)) {
            nclodySum++;  

          } ;
           if (overcast.test(jsonObject[i].cond_txt_n)) {
            novercastSum++;       

          } ;
          if (rain.test(jsonObject[i].cond_txt_n)) {
            nrainSum ++;

          } ;    
          if (snow.test(jsonObject[i].cond_txt_n)) {
            nsnowSum++;

          };
         
        };
        console.log(dsunSum);
        console.log(dclodySum);
        console.log(dovercastSum);
        console.log(drainSum);
        console.log(jsonObject);
            that.setData({
              
              array: array,
              temp: temp,
         
             });
       
        new wxcharts({
          canvasId: 'barGraph',
          type: 'line',

          categories: [dateTime[0], dateTime[1], dateTime[2], dateTime[3], dateTime[4], dateTime[5], dateTime[6]],
          series: [{   
            name : '最高气温',   
            color: '#8B7500',
            data: [maxTmp[0], maxTmp[1], maxTmp[2], maxTmp[3], maxTmp[4], maxTmp[5], maxTmp[6]],
            format: function (val) {
              return val + '°';
            }
          },
            {
              name: '最低气温',
              data: [minTmp[0], minTmp[1], minTmp[2], minTmp[3], minTmp[4], minTmp[5], minTmp[6]],
              color: '#00868B',
              format: function (val) {
                return val + '°';
              }
            }
            ],
          yAxis: { 
            min:0,
            fontColor: '#C1CDCD',
          },
          xAxis: {
          
            fontColor: '#C1CDCD',
          },
          width: 385,
          height: 200,
          color: '#8B7500',
          dataLabel: true, // 是否在图表中显示数据内容值
          extra:{
            column:{
              width:20,          
            },
            radar:{
              labelColor: '#8B7500',
            }

          }
        });
        new wxcharts({
          canvasId: 'radaGraph',
          type: 'radar',
          categories: ['晴天', '雨天', '阴天', '云天','雪天'],
          series: [{     
            name: '白天',
            data: [dsunSum, drainSum, dovercastSum, dclodySum, dsnowSum],
           
          },
            {
              name: '夜间',
              data: [nsunSum, nrainSum, novercastSum, nclodySum, nsnowSum],

            }
          
          ],
        
          width: 400,
          height: 250,
          dataLabel: true, // 是否在图表中显示数据内容值
          extra: {
         
            radar: {
              labelColor: '#ffffff',
              
            }

          }
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