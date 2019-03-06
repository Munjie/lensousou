var t = require("../../../utils/net"), e = require("../const");

Page({
    data: {
        imageSrc: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic13.png",
        str: {
            invalid_text: "未检测到人体照片，请重新上传",
            invalid: null
        },
        feedback: {
            category: "HumanBodyRecognition",
            demo: "HumanBodyAnalyze"
        },
        humanbodies: null,
        items: [ [ "性别", "gender" ], [ "上身衣服颜色", "upper_body_cloth_color" ], [ "下身衣服颜色", "lower_body_cloth_color" ] ],
        rects: [],
        flag: !1
    },
    onLoad: function() {},
    preDataProcess: function(t) {
        if (!t || 0 == t.length) return null;
        var a = {};
        for (var o in t) switch (o) {
          case "attributes":
            a.gender = e.GENDER_SET[t.attributes.gender.male > 50 ? "Male" : "Female"], a.lower_body_cloth_color = e.COLOR_SET[t.attributes.lower_body_cloth.lower_body_cloth_color], 
            a.upper_body_cloth_color = e.COLOR_SET[t.attributes.upper_body_cloth.upper_body_cloth_color];
        }
        return a;
    },
    filterReulst: function(t) {
        if (t.humanbodies && t.humanbodies.length) {
            var e = this.preDataProcess(t.humanbodies[0]), a = [ t.humanbodies[0].humanbody_rectangle ];
            this.setData({
                humanbodies: e,
                rects: a,
                "str.invalid": !1
            });
        } else 400 == t.statusCode ? this.setData({
            "str.invalid": !0,
            "str.invalid_text": ""
        }) : this.setData({
            "str.invalid": !0,
            "str.invalid_text": "未检测到人体照片，请重新上传"
        });
    },
    upload: function() {
        this.setData({
            rects: [],
            flag: !0
        }), (0, t.UploadFileOrPost)("/official/demo/humanbodypp/v1/detect", this.data.imageSrc, {
            return_attributes: "gender,upper_body_cloth,lower_body_cloth",
            resize: 1
        }, this.filterReulst.bind(this));
    },
    choose: function(t) {
        var e = t.detail.tempFilePaths[0];
        this.setData({
            imageSrc: e,
            "str.invalid": null,
            rects: []
        }, this.upload);
    },
    imageBox: function(t) {
        this.data.flag || this.upload();
    }
});