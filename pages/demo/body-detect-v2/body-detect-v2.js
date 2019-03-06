var t = require("../../../utils/net"), e = require("../const");

Page({
    data: {
        list: [],
        imageSrc: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic21.png",
        str: {
            invalid_text: "未检测到人体照片，请重新上传",
            invalid: null
        },
        feedback: {
            category: "HumanBodyRecognition",
            demo: "MultipleHumanBodyDetection"
        },
        humanbodies: null,
        humanbody: null,
        items: [ [ "性别", "gender" ], [ "上身衣服颜色", "upper_body_cloth_color" ], [ "下身衣服颜色", "lower_body_cloth_color" ] ],
        rects: [],
        flag: !1
    },
    preDataProcess: function(t) {
        if (!t || 0 == t.length) return null;
        var a = {};
        for (var i in t) switch (i) {
          case "attributes":
            a.gender = e.GENDER_SET[t.attributes.gender.male > 50 ? "Male" : "Female"], a.lower_body_cloth_color = e.COLOR_SET[t.attributes.lower_body_cloth.lower_body_cloth_color], 
            a.upper_body_cloth_color = e.COLOR_SET[t.attributes.upper_body_cloth.upper_body_cloth_color];
        }
        return a;
    },
    perGetRectangle: function(t) {
        var e = [];
        for (var a in t) {
            var i = {};
            (i = t[a].humanbody_rectangle).imageWidth = this.data.imageWidth, i.imageHeight = this.data.imageHeight, 
            i.active = 0 == a, e.push(i);
        }
        return e;
    },
    filterResult: function(t) {
        if (t.humanbodies && t.humanbodies.length) {
            var e = this.preDataProcess(t.humanbodies[0]), a = this.perGetRectangle(t.humanbodies), i = [];
            t.humanbodies.forEach(function(t) {
                var e = t.humanbody_rectangle;
                e.rotateZ = t.attributes && t.attributes.headpose ? t.attributes.headpose.roll_angle : 0, 
                i.push(e);
            }), this.setData({
                humanbodies: t.humanbodies,
                humanbody: e,
                list: a,
                rects: i,
                "str.invalid": !1
            });
        } else 400 == t.statusCode ? this.setData({
            "str.invalid": !0,
            "str.invalid_text": "",
            "str.invalid_more_text": ""
        }) : this.setData({
            "str.invalid": !0,
            "str.invalid_text": "未检测到人体照片，请重新上传",
            "str.invalid_more_text": ""
        });
    },
    upload: function() {
        this.setData({
            list: [],
            flag: !0
        }), (0, t.UploadFileOrPost)("/official/demo/humanbodypp/v1/detect", this.data.imageSrc, {
            return_attributes: "gender,upper_body_cloth,lower_body_cloth",
            resize: 1
        }, this.filterResult.bind(this));
    },
    choose: function(t) {
        var e = t.detail.tempFilePaths[0];
        this.setData({
            imageSrc: e,
            "str.invalid": null,
            list: [],
            rects: []
        }, this.upload);
    },
    imageBox: function(t) {
        this.setData({
            imageWidth: t.detail.width,
            imageHeight: t.detail.height
        }), this.data.flag || this.upload();
    },
    changeSwiper: function(t) {
        var e = this.preDataProcess(this.data.humanbodies[t.detail]), a = this.data.rects;
        a.forEach(function(t) {
            t.active = !1;
        }), a[t.detail].active = !0, t.detail >= 5 ? this.setData({
            "str.invalid": !0,
            "str.invalid_text": "了解更多人体检测信息,",
            "str.invalid_more_text": "请注册Face++开放平台正式API key",
            rects: a
        }) : (this.setData({
            "str.invalid": !1,
            rects: a,
            humanbody: e
        }), this.preDataProcess(this.data.humanbodies[t.detail]));
    }
});