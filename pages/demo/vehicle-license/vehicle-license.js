var e = require("../../../utils/net"), t = require("../../../utils/util");

Page({
    data: {
        imageSrc: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic5.png",
        str: {
            invalid_text: "未检测到行驶证，请重新上传",
            invalid: null,
            copy: !1
        },
        feedback: {
            category: "CharacterRecognition",
            demo: "VechileLicenseRecognition"
        },
        card: null,
        items: [ [ "号牌号码", "plate_no" ], [ "车辆类型", "vehicle_type" ], [ "所有人", "owner" ], [ "住址", "address" ], [ "使用性质", "use_character" ], [ "品牌型号", "model" ], [ "车辆识别代号", "vin" ], [ "发动机号码", "engine_no" ], [ "注册日期", "register_date" ], [ "发证日期", "issue_date" ], [ "签发机关", "issued_by" ] ]
    },
    onShareAppMessage: function() {
        return {
            title: "Face++行驶证识别",
            path: "/pages/demo/vehicle-license/vehicle-license"
        };
    },
    onLoad: function() {
        this.upload();
    },
    filterReulst: function(e) {
        e.cards && e.cards.length ? this.setData({
            card: e.cards[0],
            "str.invalid": !1,
            "str.copy": !0
        }) : this.setData({
            "str.invalid": !0,
            "str.copy": !1
        });
    },
    upload: function() {
        this.setData({
            card: {}
        }), (0, e.UploadFileOrPost)("/official/demo/cardpp/v1/ocrvehiclelicense", this.data.imageSrc, {}, this.filterReulst.bind(this));
    },
    getClipboardContent: function(e, t) {
        var i = [];
        return e.forEach(function(e) {
            var a = e[0] + ": " + t[e[1]];
            i.push(a);
        }), i;
    },
    clipboard: function() {
        var e = this.getClipboardContent(this.data.items, this.data.card).toString().replace(/,/g, "\n");
        (0, t.setClipboardData)(e);
    },
    choose: function(e) {
        var t = e.detail.tempFilePaths[0];
        this.setData({
            imageSrc: t,
            "str.invalid": null,
            result: {}
        }, this.upload);
    }
});