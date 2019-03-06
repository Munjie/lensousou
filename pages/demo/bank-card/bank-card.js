var t = require("../../../utils/net"), a = require("../../../utils/util");

Page({
    data: {
        imageSrc: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic4.png",
        str: {
            invalid_text: "未检测到银行卡，请重新上传",
            invalid: null,
            copy: !1
        },
        feedback: {
            category: "ObjectRecognition",
            demo: "BankcardRecognition"
        },
        card: null,
        items: [ [ "银行卡号", "number" ], [ "银行", "bank" ], [ "金融组织", "organization" ] ]
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
        t.bank_cards && t.bank_cards.length ? this.setData({
            card: t.bank_cards[0],
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
        }), (0, t.UploadFileOrPost)("/official/demo/cardpp/v1/ocrbankcard", this.data.imageSrc, {}, this.filterReulst.bind(this));
    },
    getClipboardContent: function(t, a) {
        var i = [];
        return t.forEach(function(t) {
            var e = t[0] + ": " + a[t[1]];
            i.push(e);
        }), i;
    },
    clipboard: function() {
        var t = this.getClipboardContent(this.data.items, this.data.card);
        t = t.toString().replace(/,/g, "\n"), (0, a.setClipboardData)(t);
    },
    choose: function(t) {
        var a = t.detail.tempFilePaths[0];
        this.setData({
            imageSrc: a,
            "str.invalid": null,
            result: {}
        }, this.upload);
    }
});