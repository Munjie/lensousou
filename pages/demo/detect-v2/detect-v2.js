function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var e, a = require("../../../utils/net"), i = require("../const");

Page((e = {
    data: {
        imageSrc: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic14.png",
        age: "",
        gender: "",
        emotion: "",
        leftEye: "",
        rightEye: "",
        mouth: "",
        headpose: null,
        feedback: {
            category: "FaceRecognition",
            demo: "MultipleFaceDetection"
        },
        str: {
            invalid: null,
            invalid_text: "未检测到人脸，请重新上传"
        },
        rects: []
    },
    onShareAppMessage: function() {
        return {
            title: "Face++人脸分析",
            path: "/pages/demo/detect/detect"
        };
    },
    choose: function(t) {
        var e = t.detail.tempFilePaths[0];
        this.setData({
            "str.invalid": null,
            list: null,
            faces: null,
            imageSrc: e,
            age: "",
            gender: "",
            emotion: "",
            leftEye: "",
            rightEye: "",
            mouth: "",
            headpose: null
        });
    },
    _filterAttribute: function(t, e) {
        var a = void 0, i = 0;
        for (var s in t) t[s] > i && (a = s, i = t[s]);
        return (e || {})[a];
    },
    preDataProcess: function(t) {
        var e = t.attributes ? t.attributes : null;
        e && this.setData({
            age: e.age.value + "岁",
            gender: "female" == e.gender.value.toLowerCase() ? "女性" : "男性",
            emotion: this._filterAttribute(t.attributes.emotion, i.EMOTION_ENUM),
            mouth: this._filterAttribute(t.attributes.mouthstatus, i.MOUTH_ENUM),
            leftEye: this._filterAttribute(t.attributes.eyestatus.left_eye_status, i.EYE_ENUM),
            rightEye: this._filterAttribute(t.attributes.eyestatus.right_eye_status, i.EYE_ENUM),
            headpose: e.headpose
        });
    },
    perGetRectangle: function(t) {
        var e = [];
        for (var a in t) {
            var i = {};
            (i = t[a].face_rectangle).imageWidth = this.data.imageWidth, i.imageHeight = this.data.imageHeight, 
            i.active = 0 == a, e.push(i);
        }
        return e;
    },
    resultEvent: function(t) {
        if (t.faces && t.faces.length) {
            var e = this.perGetRectangle(t.faces);
            this.preDataProcess(t.faces[0]);
            var a = [];
            t.faces.forEach(function(t, e) {
                var i = t.face_rectangle;
                i.rotateZ = t.attributes && t.attributes.headpose ? t.attributes.headpose.roll_angle : 0, 
                i.active = 0 == e, a.push(i);
            }), this.setData({
                "str.invalid": !1,
                list: e,
                faces: t.faces,
                rects: a
            });
        } else this.setData({
            "str.invalid": !0,
            "str.invalid_text": "未检测到人脸，请重新上传",
            "str.invalid_more_text": ""
        });
        wx.hideToast();
    },
    imageBox: function(t) {
        this.setData({
            imageWidth: t.detail.width,
            imageHeight: t.detail.height
        }), this.data.flag || this.upload();
    },
    changeSwiper: function(t) {
        var e = this.data.rects;
        e.forEach(function(t) {
            t.active = !1;
        }), e[t.detail].active = !0, t.detail >= 5 ? this.setData({
            "str.invalid": !0,
            "str.invalid_text": "了解更多人脸检测信息,",
            "str.invalid_more_text": "请注册Face++开放平台正式API key",
            rects: e
        }) : (this.setData({
            "str.invalid": !1,
            rects: e
        }), this.preDataProcess(this.data.faces[t.detail]));
    }
}, t(e, "choose", function(t) {
    var e = t.detail.tempFilePaths[0];
    this.setData({
        imageSrc: e,
        "str.invalid": null,
        result: {},
        faces: [],
        rects: []
    }, this.upload);
}), t(e, "upload", function() {
    this.setData({
        faces: [],
        rects: [],
        list: [],
        flag: !0
    }), (0, a.UploadFileOrPost)("/official/demo/facepp/v3/detect", this.data.imageSrc, {
        return_attributes: "gender,age,mouthstatus,headpose,eyestatus,emotion,beauty"
    }, this.resultEvent);
}), e));