var t = require("../../utils/utill.js"), e = require("../../utils/net.js"),a = {
    anger: "怒气冲冲",
    disgust: "一脸嫌弃",
    fear: "胆战心惊",
    happiness: "眉开眼笑",
    neutral: "平静如水",
    sadness: "蓝瘦香菇",
    surprise: "一脸懵逼"
}, i = {
    surgical_mask_or_respirator: "带口罩",
    other_occlusion: "被挡住",
    close: "紧闭",
    open: "张开"
}, s = {
    occlusion: "眼睛被遮挡",
    no_glass_eye_open: "不戴眼镜且睁眼",
    normal_glass_eye_close: "佩戴普通眼镜且闭眼",
    normal_glass_eye_open: "佩戴普通眼镜且睁眼",
    dark_glasses: "佩戴墨镜",
    no_glass_eye_close: "不戴眼镜且闭眼"
}, r = "gender,age,mouthstatus,headpose,eyestatus,emotion,beauty";

Component({
    properties: {
        showLandmarks: {
            type: Boolean,
            value: !1
        },
        showRects: {
            type: Boolean,
            value: !1
        },
        oneRects: {
            type: Boolean,
            value: !0
        },
        src: {
            type: String,
            value: "",
            observer: "_imageChangeHandler"
        }
    },
    data: {
        ts: null,
        boxWidth: 0,
        oneRects: !0,
        boxHeight: 0,
        realWidth: 0,
        realHeight: 0,
        imageSrc: "",
        landmarks: [],
        rects: [],
        vector: null
    },
    ready: function() {
        var t = this;
        wx.createSelectorQuery().in(this).select("#the-id").boundingClientRect(function(e) {
            t.setData({
                boxWidth: e.width,
                boxHeight: e.height
            }, function() {
                t._ready = 1, t._imageChangeHandler(t.data.imageSrc);
            });
        }).exec();
    },
    methods: {
        _getImageInfo: function(e, a) {
            var i = this;
            wx.getImageInfo({
                src: e,
                success: function(e) {
                    var s = (0, t.calculateScaleVecror)(e.width, e.height, i.data.boxWidth, i.data.boxHeight);
                    i.setData({
                        vector: s
                    }, a);
                },
                fail: function(s) {
                    wx.getImageInfo({
                        src: e,
                        success: function(e) {
                            var s = (0, t.calculateScaleVecror)(e.width, e.height, i.data.boxWidth, i.data.boxHeight);
                            i.setData({
                                vector: s
                            }, a);
                        },
                        fail: function(t) {
                            wx.showToast({
                                title: "网络不给力",
                                image: "/image/icon/net_off.png"
                            });
                        }
                    });
                }
            });
        },
        _filterLandmarks: function(t) {
            var e = [], a = this.data.vector;
            for (var i in t) e.push({
                x: t[i].x * a.xScale + a.xOffset,
                y: t[i].y * a.yScale + a.yOffset
            });
            this.setData({
                landmarks: e
            });
        },
        _drawFaceRect: function(t) {
            var e = this.data, a = e.vector, i = e.rects;
            t.face_rectangle && (i.push({
                x: t.face_rectangle.left * a.xScale + a.xOffset,
                y: t.face_rectangle.top * a.yScale + a.yOffset,
                width: t.face_rectangle.width * a.xScale,
                height: t.face_rectangle.height * a.yScale,
                rotateZ: t.attributes && t.attributes.headpose ? t.attributes.headpose.roll_angle : 0
            }), this.setData({
                rects: i
            }));
        },
        _filterAttribute: function(t, e) {
            var a = void 0, i = 0;
            for (var s in t) t[s] > i && (a = s, i = t[s]);
            return a && {
                value: a,
                describe: (e || {})[a],
                probability: i
            };
        },
        _filterResult: function(t, e) {
            var r = this;
            if (t == this.data.ts) {
                if (!e.faces || 0 == e.faces.length) return e.extra = {}, void this.triggerEvent("result", e);
                this.properties.showLandmarks && this._filterLandmarks(e.faces[0].landmark), this.properties.showRects && (this.data.oneRects ? this._drawFaceRect(e.faces[0]) : e.faces.forEach(function(t) {
                    return r._drawFaceRect(t);
                })), e.faces[0].attributes && (e.extra = {
                    emotion: this._filterAttribute(e.faces[0].attributes.emotion, a),
                    mouth: this._filterAttribute(e.faces[0].attributes.mouthstatus, i),
                    leftEye: this._filterAttribute(e.faces[0].attributes.eyestatus.left_eye_status, s),
                    rightEye: this._filterAttribute(e.faces[0].attributes.eyestatus.right_eye_status, s)
                }), e.width = this.data.realWidth, e.height = this.data.realHeight, this.triggerEvent("result", e);
            }
        },
        _upload: function(t) {
            var a = new Date().getTime();
            this.setData({
                ts: a
            }), t.split("//")[1].startsWith("tmp") ? (0, e.UploadFile)({
                url: "/official/demo/facepp/v3/detect",
                filePath: t,
                name: "image_file",
                formData: {
                    return_attributes: r,
                    return_landmark: 1
                },
                success: this._filterResult.bind(this, a)
            }) : (0, e.Post)({
                url: "/official/demo/facepp/v3/detect",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                    image_url: t,
                    return_attributes: r,
                    return_landmark: 1
                },
                success: this._filterResult.bind(this, a)
            });
        },
        imageError: function() {
            wx.showToast({
                title: "网络不给力",
                image: "/image/icon/net_off.png"
            });
        },
        imageLoad: function(t) {
            var e = t.detail.width / t.detail.height, a = void 0, i = void 0;
            e > 750 / 560 ? (a = 750, i = 750 / e) : (i = 560, a = 560 * e), this.setData({
                imgwidth: a,
                imgheight: i,
                realWidth: t.detail.width,
                realHeight: t.detail.height
            });
        },
        previewImage: function() {
            wx.previewImage({
                urls: [ this.data.imageSrc ]
            });
        },
        _imageChangeHandler: function(t) {
            var e = this;
            this.setData({
                imageSrc: t,
                landmarks: [],
                rects: []
            }), this._ready && this._getImageInfo(t, function() {
                return e._upload(t);
            });
        }
    }
});