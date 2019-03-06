/**
 * WeChat API 模块
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
const wechat = require('./utils/wechat.js')

/**
 * Douban API 模块
 * @type {Object}
 */
const douban = require('./utils/douban.js')
/**
 * Baidu API 模块
 * @type {Object}
 */
const baidu = require('./utils/baidu.js')
var fundebug = require('./libs/fundebug.0.6.1.min.js')
fundebug.init(
  {
    apikey: "de3430c77dbb6f0a4944a2493e7dd6025149a85d716d17ecd8cdc5e710513c34",
    appVersion: "1.1.0",
    monitorMethodCall: true,
    monitorMethodArguments: true,
    setSystemInfo: true,
    setUserInfo: true,
    setLocation: true
  }),
  
App({

  data: {
    name: 'Douban Movie',
    version: '0.1.0',
    currentCity: '上海'
  },
  onError: function (err) {
    fundebug.notifyError(err);
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch() {
    wechat
      .getLocation()
      .then(res => {
        const { latitude, longitude } = res
        return baidu.getCityName(latitude, longitude)
      })
      .then(name => {
        this.data.currentCity = name.replace('市', '')
        console.log(`currentCity : ${this.data.currentCity}`)
      })
      .catch(err => {
        this.data.currentCity = '上海'
        console.error(err)
      })
  },

  /**
  * Douban API
  */
  douban: douban,
  /**
   * Baidu API
   */
  baidu: baidu,

  /**
  * WeChat API
  */
  wechat: wechat,


  globalData: {
    defaultCity: '',
    defaultCounty: '',
    defaultStreet: '',
    weatherData: '',
    air: '',
    day: '',
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    doubanBase: "https://api.douban.com",
    heWeatherBase: "https://free-api.heweather.com",
    juhetoutiaoBase:"https://v.juhe.cn/weixin/query",
    tencentMapKey: "TQYBZ-FHUKF-J5DJI-N7Z5E-JNW7Z-6CBIT",
    heWeatherKey: "4a817b4338e04cc59bdb92da7771411e",
    juhetoutiaoKey:"b1fd4781373bff5a94fb62392c770a65",
    heWeatherKey2: "894fc2a749104d679fa022c3e71afe83",
    heWeatherKeyMe: "e7afb6d23ef741d39cfb5736ab90c0e4",
    curBook: ""
  }

})
