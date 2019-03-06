//index.js
//获取应用实例
var time = require('../../utils/util.js');
var _wxcharts = require('../../libs/wxcharts.js')
var fundebug = require('../../libs/fundebug.0.6.1.min.js')
var app = getApp()
var lineDate = ''
var dateArray = ''
var jsonObject = ''
var array = ''
var temp = ''
var descCity = ''
var nickName = ''
var avatarUrl = ''
var realPath = ''
var downPath = ''
var warmInfo = ''

Page({
  data: {

    currtab: 0,
    lineDate: '',
    dateArray: '',
    array: '',
    temp: '',
    descCity: descCity, //用户个人信息
    nickName: nickName,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl: avatarUrl,
    downPath: downPath,
    warmInfo: warmInfo



  },

  onLoad: function () {
    var that = this;
    that.getLocation();
    wx.getSystemInfo({
      success: function (res) {
        var version = res.SDKVersion;
        console.log('基础库版本' + version);
        version = version.replace(/\./g, "")
        console.log(version)
        if (parseInt(version) < 220) { // 小于2.1.0的版本
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，有些功能可能无法使用，建议请先升级到最新微信版本后重试',
          })
        }
      },
    });

    //  查看是否授权
    const logger = wx.getLogManager();
    logger.info({
      str: '7887878'
    });
    wx.getSetting({
      success: function (res) {

        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo.avatarUrl)
              that.setData({

                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,

              })

            }
          })

        }
      }
    });
    //判断是否获得了用户地理位置授权
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation'])
          that.openConfirm()
      }
    });
    console.log('onLoad');
    fundebug.notify('debug', 'load');



  },


  onShow: function () {


    fundebug.notify('debug', 'load');
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
        var city = res.data.result.addressComponent.city;
        var district = res.data.result.addressComponent.district;
        var street = res.data.result.addressComponent.street;
        descCity = city.substring(0, city.length - 1);
        console.log('location' + res.data.result);
        console.log('detaillocation' + descCity);
        that.setData({
          city: city,
          district: district,
          street: street,
          descCity: descCity,
        })


        that.getWeahter(descCity);
        that.getAir(descCity);
        that.lineShow(descCity);
      },
      fail: function (res) {
        console(res);
      },
      complete: function (res) {
        console.log(res);
      },
    })
  },

  //获取天气集合信息
  getWeahter: function (city) {
    var that = this,
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
        var tmp = res.data.HeWeather6[0].now.tmp;
        var txt = res.data.HeWeather6[0].now.cond_txt;
        var code = res.data.HeWeather6[0].now.cond_code;
        var dir = res.data.HeWeather6[0].now.wind_dir;
        var sc = res.data.HeWeather6[0].now.wind_sc;
        var hum = res.data.HeWeather6[0].now.hum;
        var fl = res.data.HeWeather6[0].now.fl;
        var cloud = res.data.HeWeather6[0].now.cloud;
        var update = res.data.HeWeather6[0].update.loc;
        var timee = update.substring(update.length - 5, update.length);
        var pres = res.data.HeWeather6[0].now.pres;
        var tmp_max = res.data.HeWeather6[0].daily_forecast[0].tmp_max;
        var tmp_min = res.data.HeWeather6[0].daily_forecast[0].tmp_min;

        that.setData({
          tmp: tmp,
          txt: txt,
          code: code,
          dir: dir,
          sc: sc,
          hum: hum,
          fl: fl,
          cloud: cloud,
          update: timee,
          pres: pres,
          tmp_max: tmp_max,
          tmp_min: tmp_min

        })
      },
      fail: function (res) { },
      complete: function (res) { },
    });
    fundebug.notify('debug', city);
  },
  //获取天气集合信息
  getAir: function (city) {
    var that = this,
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

        var qlty = res.data.HeWeather6[0].air_now_city.qlty;
        var aqi = res.data.HeWeather6[0].air_now_city.aqi;
        var main = res.data.HeWeather6[0].air_now_city.main;


        that.setData({
          qlty: qlty,
          aqi: aqi,
          main: main

        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },


  lineShow: function (city) {
    var that = this,
      jsonObject = new Array(),
      lifestyle = new Array(),
      array = new Array(),
      temp = new Array(),
      cond_txt = new Array(),
      typelife = new Array(),
      brflife = new Array(),
      txtlife = new Array(),
      lineweather = new Array(),

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
        //正则匹配雨
        var rain = new RegExp('雨');
        jsonObject = res.data.HeWeather6[0].hourly;
        lifestyle = res.data.HeWeather6[0].lifestyle;
        var nowTmp = res.data.HeWeather6[0].now.tmp;
        for (var i = 0; i < jsonObject.length; i++) {
          array[i] = jsonObject[i].time.substring(jsonObject[i].time.length - 5, jsonObject[i].time.length);
          temp[i] = jsonObject[i].tmp;
          lineweather[i] = jsonObject[i].cond_code;
          cond_txt[i] = jsonObject[i].cond_txt;
          if (rain.test(jsonObject[1].cond_txt)) {
            warmInfo = '未来两小时有雨，出门请带好雨伞'
          }

        };

        for (var i = 0; i < lifestyle.length; i++) {
          typelife[i] = lifestyle[i].type,
            brflife[i] = lifestyle[i].brf,
            txtlife[i] = lifestyle[i].txt

        };


        console.log(temp[0] + 'temp'),
          console.log(array[0] + 'resdddd'),
          that.setData({

            array: array,
            temp: temp,
            jsonObject: jsonObject,

          });
        that.setData({
          msgList: [warmInfo, txtlife[0], txtlife[1], txtlife[2], txtlife[3], txtlife[4], txtlife[5], txtlife[6], txtlife[7]]
        });
        new _wxcharts({
          canvasId: 'lineGraph',
          type: 'line',
          categories: ['现在', array[0] + cond_txt[0], array[1] + cond_txt[1], array[2] + cond_txt[2], array[3] + cond_txt[3], array[4] + cond_txt[4], array[5] + cond_txt[5], array[6] + cond_txt[6], array[7] + cond_txt[7]],
          series: [{

            data: [nowTmp, temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], temp[6], temp[7]],
            format: function (val) {

              return val + '°';
            }

          }],

          yAxis: {
            gridColor: '#C1CDCD',
            min: 0,
            fontColor: '#C1CDCD',
            titleFontColor: '#2E8B57',

          },
          xAxis: {
            gridColor: '#C1CDCD',
            fontColor: '#C1CDCD',
            disableGrid: true,
            titleFontColor: '#2E8B57',
          },
          dataItem: {

            color: '#2E8B57',
          },
          legend: false,
          width: 388,
          height: 180

        });
        new _wxcharts({
          canvasId: 'codeGraph',
          type: 'line',
          categories: [cond_txt[0], cond_txt[1], cond_txt[2], cond_txt[3], cond_txt[4], cond_txt[5], cond_txt[6], cond_txt[7]],
          series: [{

            data: [temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], temp[6], temp[7]],

          }],

          yAxis: {
            gridColor: '#C1CDCD',
            min: 0,
            fontColor: '#C1CDCD',
            titleFontColor: '#2E8B57',

          },
          xAxis: {
            gridColor: '#C1CDCD',
            fontColor: '#C1CDCD',
            disableGrid: true,
            titleFontColor: '#2E8B57',
          },
          dataItem: {

            color: '#2E8B57',
          },
          legend: false,
          width: 388,
          height: 180

        })

      },

      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      },

    });



  },

  //点击天气跳转到空气详情
  airShow: function (e) {

    wx.navigateTo({
      url: '../air/air',
    });
    fundebug.notify('airShow', e);

  },
  //点击跳转七天详情
  rinShow: function (e) {

    wx.navigateTo({
      url: '../sevenday/sevenday',
    });
    fundebug.notify('rinShow', e);

  },



  //先制作一个canvas标签，再保存成图片
  onSaveImg: function () {
    wx.downloadFile({
      url: avatarUrl,
      success: function (res) {


        console.log(res.tempFilePath + 'download')
        that.setData({

          downPath: res.tempFilePath
        })
      }
    });
    wx.showLoading({
      title: '卡片生成中...',
    })
    const logger = wx.getLogManager();
    logger.log({
      str: this.data.nickName
    }, 'basic log', 100, [1, 2, 3]);
    const ctx = wx.createCanvasContext('myCanvas'); //看回wxml里的canvas标签，这个的myCanvas要和标签里的canvas-id一致
    //ctx.clearRect(0, 0, 644, 966);
    ctx.drawImage("../../images/beach.jpg", 0, 0, 646, 966);
    // ctx.drawImage("../../images/timg.jpg", 0, -60, 646, 966);
    //  ctx.drawImage(this.data.imgUrl, 79, 291 - 60, 492, 244);
    ctx.drawImage(this.data.avatarUrl, 90, 10, 100, 100);
    ctx.setFillStyle("#02446e");
    ctx.setFontSize(26);
    //  ctx.fillText("我是" + this.data.nickName + '我在' + this.data.descCity, 100, 500 - 60);
    ctx.setTextAlign("center");
    ctx.fillText("夕阳无限好", 435, 790 - 60);
    ctx.setTextAlign("left");
    ctx.setFillStyle("black");
    ctx.setFontSize(18);
    ctx.fillText("只是近黄昏", 330, 825 - 60);
    ctx.setFontSize(22);
    console.log(this.data.avatarUrl + 'avatarUrl');
    // ctx.drawImage(this.data.imgUrl, 0, 936 - 60, 646, 30);
    var self = this;

    ctx.draw(true, setTimeout(function () { //为什么要延迟100毫秒？大家测试一下
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 646,
        height: 966,
        destWidth: 646,
        destHeight: 966,
        canvasId: 'myCanvas',

        success: function (res) {
          self.data.savedImgUrl = res.tempFilePath;
          self.saveImageToPhoto();
          self.setData({
            saveImgUrl: res.tempFilePath,

          });
          wx.hideLoading();
        }
      })
    }, 1000));


  },
  //保存图片到相册
  saveImageToPhoto: function () {
    if (this.data.savedImgUrl != "") {
      wx.saveImageToPhotosAlbum({
        filePath: this.data.savedImgUrl,
        success: function () {
          wx.showModal({
            title: '保存图片成功',
            content: '已经保存到相册，您可以手动分享到朋友圈！',
            showCancel: false
          });
        },
        fail: function (res) {
          console.log(res);
          if (res.errMsg == "saveImageToPhotosAlbum:fail cancel") {
            wx.showModal({
              title: '保存图片失败',
              content: '您已取消保存图片到相册！',
              showCancel: false
            });
          } else {
            wx.showModal({
              title: '提示',
              content: '保存图片失败，您可以点击确定设置获取相册权限后再尝试保存！',
              complete: function (res) {
                console.log(res);
                if (res.confirm) {
                  wx.openSetting({}) //打开小程序设置页面，可以设置权限
                } else {
                  wx.showModal({
                    title: '保存图片失败',
                    content: '您已取消保存图片到相册！',
                    showCancel: false
                  });
                }
              }
            });
          }
        }
      })
    }
  },

  onGotUserInfo: function (e) {
    var that = this;
    console.log(e)
  },
  //设置地图
  openConfirm: function () {
    wx.showModal({
      content: '检测到您没打开位置权限，会影响小程序功能使用',
      confirmText: "确认",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },
  onPullDownRefresh: function (e) {

    console.log("下拉刷新")

    wx.stopPullDownRefresh()

  },
})