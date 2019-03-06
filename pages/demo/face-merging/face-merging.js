var e = require("../../../utils/net"), t = getApp(), a = [ {
    name: "蒙娜丽莎",
    value: "n1"
}, {
    name: "男伯爵",
    value: "n2"
}, {
    name: "皇帝",
    value: "n3"
}, {
    name: "画画少女",
    value: "n4"
}, {
    name: "阿拉伯",
    value: "n5"
}, {
    name: "宝宝",
    value: "n6"
}, {
    name: "胡子男",
    value: "n7"
}, {
    name: "新娘",
    value: "n8"
}, {
    name: "健身美女",
    value: "n9"
}, {
    name: "西装男",
    value: "n10"
} ];

Page({
    data: {
        result_url: "",
        min: t.globalData.min ? "min" : "",
        str: {
            invalid_text: "未检测到人脸，请重新上传",
            invalid: null
        },
        template_url: "https://cdn.faceplusplus.com.cn/facepp/wechat/face-merge/1.jpg",
        merge_url: "https://cdn.faceplusplus.com.cn/facepp/wechat/face-merge/demo-pic4.jpg",
        list1: [ {
            image: "https://cdn.faceplusplus.com.cn/facepp/wechat/face-merge/demo-pic4.jpg",
            text: "融合图一",
            active: !0
        }, {
            image: "https://cdn.faceplusplus.com.cn/facepp/wechat/face-merge/demo-pic20.jpg",
            text: "融合图二"
        }, {
            image: "https://cdn.faceplusplus.com.cn/facepp/wechat/face-merge/demo-pic23.jpg",
            text: "融合图三"
        } ],
        template_msg_status: "dark",
        merge_msg_status: "dark",
        template_class: "",
        merge_class: "",
        merge_target: "0",
        template_target: "0",
        template_msg: "上传图片",
        merge_msg: "上传图片",
        list2: [],
        feedback: {
            category: "FaceRecognition",
            demo: "FaceMerge",
            status: "hidden"
        },
        flag: !1
    },
    getRightList2: function() {
        var e = [];
        a.forEach(function(t, a) {
            var s = {
                text: t.name,
                image: "https://cdn.faceplusplus.com.cn/facepp/wechat/face-merge/" + t.value + ".jpg",
                active: 0 == a
            };
            e.push(s);
        }), this.setData({
            list2: e
        });
    },
    onLoad: function() {
        this.getRightList2(), this.upload();
    },
    filterResult: function(e, t) {
        console.log("request_id", t.request_id);
        var a = {
            result_url: t.result,
            imageError: "",
            btn_status: "enable"
        };
        "template" == e && (a.template_msg = "重新上传", a.template_msg_status = "", a.template_class = "active"), 
        "merge" == e && (a.merge_msg = "重新上传", a.merge_msg_status = "", a.merge_class = "active"), 
        this.setData(a);
    },
    failResult: function(e, t) {
        console.log("request_id", t.request_id, t.error_message);
        var a = {
            NO_FACE_FOUND: "未检测到人脸",
            INVALID_IMAGE_SIZE: "图片过大/过小",
            BAD_FACE: "人脸不完整"
        };
        for (var s in a) t.error_message && t.error_message.indexOf(s) > -1 && ("merge" == e && this.setData({
            merge_class: "error",
            merge_msg: a[s],
            merge_msg_status: ""
        }), "template" == e && this.setData({
            template_class: "error",
            template_msg: a[s],
            template_msg_status: ""
        }));
        this.setData({
            btn_status: "disable",
            result_url: "",
            imageError: [ "未完成融合", "请上传清晰正面照" ]
        });
    },
    upload: function(t) {
        this.setData({
            flag: !0,
            result_url: ""
        }), (0, e.Post)({
            url: "/official/demo/imagepp/v1/mergeface",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: Object.assign({}, {
                merge_url: this.data.merge_url,
                template_url: this.data.template_url
            }),
            success: this.filterResult.bind(this, t),
            fail: this.failResult.bind(this, t)
        });
    },
    changeTopSwiper: function(e) {
        this.setData({
            merge_url: e.detail,
            merge_msg: "上传图片",
            merge_msg_status: "dark",
            img1: "",
            merge_class: ""
        }), this.upload();
    },
    changeBottomSwiper: function(e) {
        this.setData({
            template_url: e.detail,
            template_msg: "上传图片",
            template_msg_status: "dark",
            img2: "",
            template_class: ""
        }), this.upload();
    },
    uploadTopImage: function(e) {
        var t = this.data, a = t.template_class, s = t.list2;
        "error" == a && (s.forEach(function(e, t) {
            e.active = 0 == t;
        }), this.setData({
            list2: s,
            template_target: 0,
            template_left: 0,
            template_url: s[0].image,
            template_class: "",
            template_msg: "上传图片",
            template_msg_status: "dark",
            template_img: ""
        })), this.setData({
            merge_msg: "上传图片",
            merge_msg_status: "dark",
            merge_url: e.detail
        }), this.upload("merge");
    },
    uploadBottomImage: function(e) {
        var t = this.data, a = t.merge_class, s = t.list1;
        "error" == a && (s.forEach(function(e, t) {
            e.active = 0 == t;
        }), this.setData({
            list1: s,
            merge_target: 0,
            merge_url: s[0].image,
            merge_left: 0,
            merge_class: "",
            merge_msg: "上传图片",
            merge_msg_status: "dark",
            merge_img: ""
        })), this.setData({
            template_msg: "上传图片",
            template_msg_status: "dark",
            template_url: e.detail
        }), this.upload("template");
    },
    show: function() {
        "disable" != this.data.btn_status && this.setData({
            status: "show"
        });
    },
    hidden: function() {
        this.setData({
            status: "hidden"
        });
    },
    saveImage: function(e) {
        var t = this;
        wx.getImageInfo({
            src: e,
            success: function(e) {
                t.setData({
                    test: e.path
                }), wx.saveImageToPhotosAlbum({
                    filePath: e.path,
                    success: function() {
                        wx.showToast({
                            title: "保存成功",
                            icon: "none"
                        });
                    },
                    fail: function(e) {
                        wx.showToast({
                            title: "保存失败",
                            icon: "none"
                        });
                    }
                });
            }
        });
    },
    saveResult: function(e) {
        var t = this;
        wx.getSetting({
            success: function(a) {
                a.authSetting["scope.writePhotosAlbum"] ? t.saveImage(e.share_image_url) : wx.authorize({
                    scope: "scope.writePhotosAlbum",
                    success: function() {
                        t.saveImage(e.share_image_url);
                    }
                });
            }
        });
    },
    save: function() {
        (0, e.Post)({
            url: "/official/demo/merge_share_image",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: Object.assign({}, {
                merge_url: this.data.merge_url,
                template_url: this.data.template_url,
                result_url: this.data.result_url
            }),
            success: this.saveResult.bind(this)
        });
    }
});