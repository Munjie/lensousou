function e(e) {
    wx.chooseImage({
        count: 1,
        sizeType: [ "compressed" ],
        sourceType: [ "album", "camera" ],
        success: e
    });
}

var t = require("../../../utils/net"), i = {
    0: "很可能不是同一个人",
    1: "可能不是同一个人",
    2: "可能是同一个人",
    3: "很可能是同一个人"
};

Page({
    components: [ "circle" ],
    data: {
        image_url2: "https://cdn.faceplusplus.com.cn/facepp/wechat/compare-left.png",
        image_url1: "https://cdn.faceplusplus.com.cn/facepp/wechat/compare-right.png",
        str: {
            invalid: null
        },
        feedback: {
            category: "FaceRecognition",
            demo: "FaceComparison",
            status: "hidden"
        }
    },
    onShareAppMessage: function() {
        return {
            title: "Face++人脸比对",
            path: "/pages/demo/compare/compare"
        };
    },
    previewImage: function(e) {
        wx.previewImage({
            urls: [ e.target.dataset.image ]
        });
    },
    onLoad: function() {
        (0, t.UploadFileOrPost)("/official/demo/facepp/v3/compare", this.data.image_url1 ? this.data.image_url1 : " ", {
            image_url1: this.data.image_url1,
            image_url2: this.data.image_url2
        }, this.filterResult.bind(this), this.failResult.bind(this), "compare");
    },
    imageLoad: function(e) {
        var t, i, a = e.detail.width / e.detail.height;
        a > 340 / 360 ? (t = 340, i = 340 / a) : (i = 360, t = 360 * a), 1 == e.target.dataset.id ? this.setData({
            img1width: t,
            img1height: i
        }) : this.setData({
            img2width: t,
            img2height: i
        });
    },
    getThresholdsLevel: function(e) {
        var t = 0;
        return e.confidence > e.thresholds["1e-3"] && (t = 1), e.confidence > e.thresholds["1e-4"] && (t = 2), 
        e.confidence > e.thresholds["1e-5"] && (t = 3), t;
    },
    filterResult: function(e) {
        if (console.log("request_id", e.request_id), e.confidence) {
            var t = this.getThresholdsLevel(e);
            this.setData({
                percent: parseInt(e.confidence),
                "str.invalid": !1,
                text: i[t]
            }), this.circle = this.selectComponent("#circle"), this.circle.drawProgressbg(), 
            this.circle.countInterval(parseInt(e.confidence));
        } else 400 == e.statusCode ? this.setData({
            "str.invalid": !0,
            "str.invalid_text": ""
        }) : e.faces1 && 0 == e.faces1.length ? this.setData({
            "str.invalid": !0,
            "str.invalid_text": "图片一未检测到人脸，请重新上传"
        }) : e.faces2 && 0 == e.faces2.length ? this.setData({
            "str.invalid": !0,
            "str.invalid_text": "图片二未检测到人脸，请重新上传"
        }) : this.setData({
            "str.invalid": !0,
            "str.invalid_text": "未检测到人脸，请重新上传"
        });
    },
    failResult: function(e) {
        var t = {
            "INVALID_IMAGE_URL: image_url1": "图片一未检测到人脸，请重新上传",
            "INVALID_IMAGE_URL: image_url2": "图片二未检测到人脸，请重新上传",
            "INVALID_IMAGE_SIZE: image_url1": "图片一过大或过小，请重新选择",
            "INVALID_IMAGE_SIZE: image_url2": "图片二过大或过小，请重新选择"
        };
        for (var i in t) console.log(i, "--", e), e.error_message == i && this.setData({
            "str.invalid": !0,
            "str.invalid_text": t[i]
        });
    },
    upload: function() {
        (0, t.Post)({
            url: "/official/demo/facepp/v3/compare",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: Object.assign({}, {
                image_url1: this.data.image_url1,
                image_url2: this.data.image_url2
            }),
            success: this.filterResult.bind(this),
            fail: this.failResult.bind(this)
        });
    },
    choose: function(i) {
        var a = this, s = i.target.dataset.id;
        e(function(e) {
            a.setData({
                "str.invalid": null
            }), (0, t.UploadFile)({
                url: "/official/file_to_url",
                filePath: e.tempFilePaths[0],
                name: "image_file",
                success: function(e) {
                    1 == s ? a.setData({
                        image_url1: e.url
                    }) : 2 == s && a.setData({
                        image_url2: e.url
                    }), a.upload();
                }
            });
        });
    }
});