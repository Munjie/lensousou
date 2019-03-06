var t = require("../../libs/wxcharts.js"),
  e = require("../../libs/fundebug.0.6.1.min.js"),
  o = require("../../utils/util.js"),
  timee = require("../../utils/timeutil.js"),
  a = getApp(),
  n = null,
  l = null,
  i = "",
  s = [],
  o = [],
  c = [],
  r = 320;

Page({
  data: {
    descCity: l,
    hourly: s,
    now: "",
    questions: ['我为什么要努力', '愿天黑有灯，下雨有伞', '世界上最遥远的距离就是', '今夕何夕，见此良人', '愿有人与你共黄昏', '曾经让我发了疯的想', '挣钱是一种能力', '不爱我，就告诉我', '夏天的瞬间有悲凉的气息', '不管心里有多难过', '走自己的路，让别人打车去吧', '有情人终成家属', '在哪里跌倒，就在哪里躺下', '不做无聊之事，难度有生之涯', '猫步走向社会', '成功者绝不给自己软弱的借口', 'Apply to get into your life', '花ならつぼみの私の人生', '다시 만날 땐, 둘 다 행복한 사람이 되었음 좋겠다'],
    picpath: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7']

  },
  touchHandler: function (t) {
    n.scrollStart(t);
  },
  moveHandler: function (t) {
    n.scroll(t);
  },
  touchEndHandler: function (t) {
    n.scrollEnd(t), n.showToolTip(t, {
      format: function (t, e) {
        return e + " " + t.name + ":" + t.data;
      }
    });
  },
  onLoad: function (t) {
    var o = this;
    o.getLocation(), wx.getSystemInfo({
      success: function (t) {
        var e = t.SDKVersion;
        console.log("基础库版本" + e), e = e.replace(/\./g, ""), console.log(e), parseInt(e) < 220 && wx.showModal({
          title: "提示",
          content: "当前微信版本过低，有些功能可能无法使用，建议请先升级到最新微信版本后重试"
        });
      }
    }),
      // wx.getSetting({
      //   success: function(t) {
      //     t.authSetting["scope.userInfo"] && wx.getUserInfo({
      //       success: function(t) {
      //         console.log(t.userInfo.avatarUrl), o.setData({
      //           nickName: t.userInfo.nickName,
      //           avatarUrl: t.userInfo.avatarUrl
      //         });
      //       }
      //     });
      //   }
      // }),
      wx.getSetting({
        success: function (t) {
          t.authSetting["scope.userLocation"] || o.openConfirm();
        }
      }),


      console.log("onLoad"), e.notify("开始加载页面", "onLoad");
    try {
      var a = wx.getSystemInfoSync();
      r = a.windowWidth;
    } catch (t) {
      console.error("getSystemInfoSync failed!");
    }
  },
  getLocation: function () {
    var t = this;
    wx.getLocation({
      type: "wgs84",
      success: function (e) {
        var o = e.latitude,
          a = e.longitude;
        console.log("lat:" + o + " lon:" + a), t.getCity(o, a);
      },
      fail: function (t) {
        e.notify("用户拒绝授权位置", t.data);
      }
    });
  },
  getCity: function (t, o) {
    var n = this,
      i = {
        ak: "H5xBXvZaHSTrbTEo0oWtmugUG8oFeKtZ",
        output: "json",
        location: t + "," + o
      };
    wx.request({
      url: "https://api.map.baidu.com/geocoder/v2/",
      data: i,
      success: function (t) {
        a.globalData.defaultCity = a.globalData.defaultCity ? a.globalData.defaultCity : t.data.result.addressComponent.city,
          a.globalData.defaultCounty = a.globalData.defaultCounty ? a.globalData.defaultCounty : t.data.result.addressComponent.district;
        var o = t.data.result.addressComponent.city,
          i = t.data.result.addressComponent.district,
          s = t.data.result.addressComponent.street;
        l = a.globalData.defaultCity.substring(0, o.length - 1), console.log(a.globalData.defaultCity + 999),
          console.log(a.globalData.defaultCounty + 888), e.notify("调用位置开始", o + i + s), n.setData({
            descCity: a.globalData.defaultCity,
            district: a.globalData.defaultCounty
          }), n.getHourly(a.globalData.defaultCity), n.getAir(a.globalData.defaultCity);
      },
      fail: function (t) {
        console.error(t);
      },
      complete: function (t) {
        console.log(t);
      }
    });
  },
  getHourly: function (l) {
    e.notify("调用天气开始", l);
    var s = this,
      u = new Array(),
      d = {
        location: l,
        key: a.globalData.heWeatherKeyMe,
        rnd: new Date().getTime()
      };
    wx.request({
      url: a.globalData.heWeatherBase + "/s6/weather",
      data: d,
      method: "GET",
      success: function (e) {
        console.log(e.data);
        for (var a = new RegExp("雨"), l = e.data.HeWeather6[0].hourly, d = e.data.HeWeather6[0].now, g = e.data.HeWeather6[0].lifestyle, f = e.data.HeWeather6[0].update.loc, h = f.substring(f.length - 5, f.length), m = e.data.HeWeather6[0].daily_forecast[0].tmp_max, w = e.data.HeWeather6[0].daily_forecast[0].tmp_min, y = 0; y < l.length; y++) o.push(l[y].time.substring(l[y].time.length - 5, l[y].time.length)),
          c.push(l[y].tmp), a.test(l[1].cond_txt) && (i = "未来两小时有雨，做好防雨准备噢");
        for (y = 0; y < g.length; y++) u[y] = g[y].txt;
        s.setData({
          hourly: l,
          time: o,
          temp: c,
          now: d,
          uptime: h,
          tmp_max: m,
          tmp_min: w,
          msgList: [i, u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7]]
        }), n = new t({
          canvasId: "lineCanvas",
          type: "line",
          categories: o,
          animation: !1,
          series: [{
            name: "温度",
            data: c
          }],
          xAxis: {
            disableGrid: !1
          },
          yAxis: {
            min: 0
          },
          width: r,
          height: 200,
          dataLabel: !0,
          dataPointShape: !0,
          enableScroll: !0,
          extra: {
            lineStyle: "curve"
          }
        });
      },
      fail: function (t) {
        console.error(t);
      },
      complete: function (t) {
        console.log(t);
      }
    });
  },
  getAir: function (t) {
    var e = this,
      o = {
        location: t,
        key: a.globalData.heWeatherKeyMe,
        rnd: new Date().getTime()
      };
    wx.request({
      url: a.globalData.heWeatherBase + "/s6/air",
      data: o,
      method: "GET",
      success: function (t) {
        var o = t.data.HeWeather6[0].air_now_city;
        e.setData({
          air_now_city: o
        });
      },
      fail: function (t) {
        console.log(t);
      },
      complete: function (t) {
        console.log(t);
      }
    });
  },
  onReady: function () {
    e.notify("debug", "onReady");
    wx.reportMonitor('0', 1)
  },
  onShow: function () {
    e.notify("debug", "onShow");
  },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () {
    console.log("下拉刷新"), wx.stopPullDownRefresh();
  },
  onReachBottom: function () { },
  onShareAppMessage: function () { },
  openConfirm: function () {
    wx.showModal({
      content: "检测到您未打开位置权限，会影响小程序天气显示",
      confirmText: "确认",
      success: function (t) {
        console.log(t), t.confirm ? (console.log("用户点击确认"), wx.openSetting({
          success: function (t) { }
        })) : console.log("用户点击取消");
      }
    });
  },
  airShow: function (t) {
    wx.navigateTo({
      url: "../air/air"
    }), e.notify("airShow", t);
  },
  rinShow: function (t) {
    wx.navigateTo({
      url: "../sevenday/sevenday"
    }), e.notify("rinShow", t);
  },
  onSaveImg: function () {

    var questions = this.data.questions;
    var picpath= this.data.picpath;
    var index = Math.floor(Math.random() * (questions.length - 1));
    var pathindex = Math.floor(Math.random() * (picpath.length - 1));
    var today = timee.formatTime(new Date()); 
    var nowHour = timee.formatHour(new Date());
    var gethour = timee.gethour(new Date());
    var warminfo = timee.warminfo(new Date());
    console.log("时间" + gethour);
    e.notify("调用画图开始", "onSaveImg"), wx.showLoading({
      title: "图片生成中..."
    });
    var t = wx.createCanvasContext("myCanvas");
    
      t.drawImage("../../images/newbg.jpg", 0, 0, 600, 900),
      t.setFillStyle("#000000"),
      t.setFontSize(26), 
      t.setTextAlign("left"),
      t.fillText( warminfo, 10, 50),
        t.drawImage("../../images/" + picpath.splice(pathindex, 1) +".jpg" , 50, 100, 500, 500), 
      t.setTextAlign("right"),
      t.fillText(this.data.now.tmp + "度的"  + nowHour , 180, 650),    
      t.fillText(questions.splice(index, 1), 400, 700),
        t.setFontSize(15),
        t.fillText(today, 550, 600),
    t.draw(!0, setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 646,
        height: 966,
        destWidth: 646,
        destHeight: 966,
        canvasId: "myCanvas",
        success: function (t) {
          // o.data.savedImgUrl = t.tempFilePath, o.saveImageToPhoto(), o.setData({
          //   saveImgUrl: t.tempFilePath
          // }),
          wx.previewImage({
            urls: [t.tempFilePath],
            success: function () {
              wx.hideLoading();
            },
            complete: function () {
              wx.hideLoading();
            }
          });
          wx.hideLoading();
        }
      });
    }, 2e3));
  },
  saveImageToPhoto: function () {
    "" != this.data.savedImgUrl && wx.saveImageToPhotosAlbum({
      filePath: this.data.savedImgUrl,
      success: function () {
        wx.showModal({
          title: "保存图片成功",
          content: "已经保存到相册，您可以进行手动分享了！",
          showCancel: !1
        });
      },
      fail: function (t) {
        console.log(t), "saveImageToPhotosAlbum:fail cancel" == t.errMsg ? wx.showModal({
          title: "保存图片失败",
          content: "您已取消保存图片到相册！",
          showCancel: !1
        }) : wx.showModal({
          title: "提示",
          content: "保存图片失败，您可以点击确定设置获取相册权限后再尝试保存！",
          complete: function (t) {
            console.log(t), t.confirm ? wx.openSetting({}) : wx.showModal({
              title: "保存图片失败",
              content: "您已取消保存图片到相册！",
              showCancel: !1
            });
          }
        });
      }
    });
  },
  goSwitchCity: function () {
    wx.reLaunch({
      url: "../switchcity/switchcity"
    });
  },
  bindGetUserInfo: function (t) {
    this.drawShareCanvas(t.detail.userInfo.nickName, t.detail.userInfo.avatarUrl);
  },
 
 

});