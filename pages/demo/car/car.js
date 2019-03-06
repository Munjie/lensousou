var t = require("../../../utils/net"), e = require("../../../utils/util");

Page({
    data: {
        imageSrc: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic22.png",
        str: {
            invalid_text: "未检测到车牌，请重新上传",
            invalid: null,
            copy: !1
        },
        feedback: {
            category: "ObjectRecognition",
            demo: "LicensePlateRecognition"
        },
        card: null,
        items: [ [ "车牌号", "license_plate_number" ] ]
    },
    onLoad: function() {
        this.upload();
    },
    onShareAppMessage: function() {
        return {
            title: "Face++银行卡识别",
            path: "/pages/demo/bank-card/bank-card"
        };
    },
    filterReulst: function(t) {
        t.results && t.results.length ? this.setData({
            card: t.results[0],
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
        }), (0, t.UploadFileOrPost)("/official/demo/imagepp/v1/licenseplate", this.data.imageSrc, {}, this.filterReulst.bind(this));
    },
    getClipboardContent: function(t, e) {
        var a = [];
        return t.forEach(function(t) {
            var i = t[0] + ": " + e[t[1]];
            a.push(i);
        }), a;
    },
    clipboard: function() {
        var t = this.getClipboardContent(this.data.items, this.data.card);
        t = t.toString().replace(/,/g, "\n"), (0, e.setClipboardData)(t);
    },
    choose: function(t) {
        var e = t.detail.tempFilePaths[0];
        this.setData({
            imageSrc: e,
            "str.invalid": null,
            result: {}
        }, this.upload);
    }
});