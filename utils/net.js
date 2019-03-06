Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.UploadFileOrPost = exports.Post = exports.UploadFile = void 0;

var e = function(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }(require("../debug.js")).default ? "http://10.104.7.88:5050" : "https://www.faceplusplus.com.cn/api",
  t = function(e) {
    wx.hideToast(), wx.showToast({
      title: e || "网络不给力",
      image: "/image/icon/net_off.png"
    });
  },
  s = {
    "INVALID_IMAGE_URL: image_url1": "图片一未检测到人脸，请重新上传",
    "INVALID_IMAGE_URL: image_url2": "图片二未检测到人脸，请重新上传",
    "INVALID_IMAGE_SIZE: image_url1": "图片一过大或过小，请重新选择",
    "INVALID_IMAGE_SIZE: image_url2": "图片二过大或过小，请重新选择",
    "INVALID_IMAGE_SIZE: merge_url": "图片过大或过小，请重新选择",
    "INVALID_IMAGE_SIZE: template_url": "图片过大或过小，请重新选择",
    INVALID_IMAGE_SIZE: "图片过大或过小，请重新选择",
    BAD_FACE: "人脸不完整，请重新选择",
    INVALID_RECTANGLE: "人脸不完整，请重新选择"
  },
  a = function(a) {
    a.url.startsWith("http") || (a.url = e + a.url), a.method = "POST";
    var o = a.success,
      r = a.fail;
    return delete a.success, a.complete = function(e) {
      if (200 == e.statusCode) wx.hideToast(), o && o(e.data);
      else if (400 == e.statusCode) {
        wx.hideToast();
        var a = e.data.error_message;
        s[a] && wx.showToast({
          title: s[a],
          icon: "none"
        }), r && r(e.data);
      } else 403 == e.statusCode ? t("操作过于频繁") : t();
    }, wx.showToast({
      icon: "loading",
      title: "数据分析中",
      duration: 1e5
    }), wx.request(a);
  },
  o = function(s) {
    s.url.startsWith("http") || (s.url = e + s.url);
    var a = s.success,
      o = s.fail;
    return delete s.success, s.complete = function(e) {
      200 == e.statusCode ? (wx.hideToast(), a && a(JSON.parse(e.data))) : 400 == e.statusCode ? (wx.hideToast(),
        JSON.parse(e.data).error_message.indexOf("INVALID_IMAGE_URL") > -1 ? o && o(JSON.parse(e.data)) : wx.showToast({
          title: e.data.error_message || "图片过大或过小，请重新选择",
          icon: "none"
        })) : 403 == e.statusCode ? t("操作过于频繁") : t();
    }, wx.showToast({
      icon: "loading",
      title: "数据分析中",
      duration: 1e5
    }), wx.uploadFile(s);
  };

exports.UploadFile = o, exports.Post = a, exports.UploadFileOrPost = function(e, t, s, r) {
  var i = new Date().getTime();
  ! function(u) {
    t.split("//")[1].startsWith("tmp") ? o({
      url: e,
      filePath: t,
      name: "image_file",
      formData: s,
      success: function(e) {
        return u === i && r(e);
      }
    }) : a({
      url: e,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: Object.assign({}, s, {
        image_url: t
      }),
      success: function(e) {
        return u === i && r(e);
      }
    });
  }(i);
};