var t = require("../../../utils/net");

Page({
    data: {
        imageSrc: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic17.png",
        str: {
            invalid_text: "未检测到人脸，请重新上传",
            invalid: null
        },
        feedback: {
            category: "FaceRecognition",
            demo: "SkinAssessment"
        },
        set: [ {
            image: "/image/skinstatus/stain.png",
            name: "色斑",
            percent: ""
        }, {
            image: "/image/skinstatus/acne.png",
            name: "青春痘",
            percent: ""
        }, {
            image: "/image/skinstatus/dark_circle.png",
            name: "黑眼圈",
            percent: ""
        } ],
        faces: [],
        rects: [],
        percent: null
    },
    onLoad: function() {},
    filterReulst: function(t) {
        if (t.faces && t.faces.length) {
            var e = this.data.set;
            e[0].percent = t.faces[0].attributes.skinstatus.stain, e[1].percent = t.faces[0].attributes.skinstatus.acne, 
            e[2].percent = t.faces[0].attributes.skinstatus.dark_circle;
            var a = t.faces[0].face_rectangle;
            a.rotateZ = t.faces[0].attributes.headpose ? t.faces[0].attributes.headpose.roll_angle : 0, 
            this.setData({
                percent: Math.ceil(t.faces[0].attributes.skinstatus.health),
                faces: t.faces[0],
                rects: [ a ],
                "str.invalid": !1,
                set: e
            }), this.circle = this.selectComponent("#circle"), this.circle.drawProgressbg(), 
            this.circle.countInterval(this.data.percent);
        } else this.setData({
            "str.invalid": !0
        });
    },
    upload: function() {
        this.setData({
            faces: [],
            rects: [],
            flag: !0
        }), (0, t.UploadFileOrPost)("/official/demo/facepp/v3/detect", this.data.imageSrc, {
            return_attributes: "skinstatus,headpose"
        }, this.filterReulst.bind(this));
    },
    imageBox: function() {
        this.data.flag || this.upload();
    },
    choose: function(t) {
        var e = t.detail.tempFilePaths[0];
        this.setData({
            imageSrc: e,
            "str.invalid": null,
            result: {},
            faces: [],
            rects: []
        }, this.upload);
    }
});