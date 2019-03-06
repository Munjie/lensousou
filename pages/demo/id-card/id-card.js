var t = require("../../../utils/net"), a = require("../../../utils/util"), e = {
    front: "人像面",
    back: "国徽面"
}, i = {
    id_photo: "正式身份证照片",
    temporary_id_photo: "临时身份证照片",
    photocopy: "正式身份证的复印件",
    screen: "手机或电脑屏幕翻拍的照片",
    edited: "用工具合成或者编辑过的身份证图片"
};

Page({
    data: {
        frontSrc: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic7.png",
        backSrc: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic8.png",
        btn_txt: "上传身份证人像面",
        front_card: null,
        back_card: null,
        second: null,
        items: [],
        feedback: {
            category: "CharacterRecognition",
            demo: "IdcardRecognition"
        },
        front_items: [ [ "姓名", "name" ], [ "性别", "gender" ], [ "名族", "race" ], [ "出生", "birthday" ], [ "住址", "address" ], [ "身份证号码", "id_card_number" ], [ "证件正反面", "side" ], [ "真实性", "legality" ] ],
        back_items: [ [ "签发机关", "issued_by" ], [ "有效日期", "valid_date" ], [ "证件正反面", "side" ], [ "真实性", "legality" ] ],
        frontInvalid: null,
        backInvalid: null,
        tab: 0
    },
    onShareAppMessage: function() {
        return {
            title: "Face++身份证识别",
            path: "/pages/demo/id-card/id-card"
        };
    },
    onLoad: function() {
        this.upload("frontSrc"), this.upload("backSrc");
    },
    tab_slide: function(t) {
        this.setData({
            tab: t.detail.current
        });
    },
    tab_click: function(t) {
        var a = this;
        if (0 == t.target.dataset.current ? a.setData({
            btn_txt: "上传身份证人像面"
        }) : a.setData({
            btn_txt: "上传身份证国徽面"
        }), (a = this).data.tab === t.target.dataset.current) return !1;
        a.setData({
            tab: t.target.dataset.current
        });
    },
    findMaxValue: function(t) {
        var a = 0, e = "";
        for (var i in t) t[i] > a && (a = t[i], e = i);
        return [ e, a ];
    },
    preDataProcess: function(t) {
        var a = this.findMaxValue(t.legality)[0];
        return a = a.toLowerCase().split(" ").join("_"), t.legality = i[a], t.side = e[t.side], 
        t;
    },
    filterReulst: function(t, a) {
        if ("frontSrc" == t) if (a.cards && a.cards.length && "front" == a.cards[0].side) {
            var e = this.preDataProcess(a.cards[0]);
            this.setData({
                front_card: e,
                frontInvalid: !1
            });
        } else this.setData({
            frontInvalid: !0
        }); else if (a.cards && a.cards.length && "back" == a.cards[0].side) {
            var i = this.preDataProcess(a.cards[0]);
            this.setData({
                back_card: i,
                backInvalid: !1
            });
        } else this.setData({
            backInvalid: !0
        });
    },
    upload: function(a) {
        this.setData({
            card: {}
        }), (0, t.UploadFileOrPost)("/official/demo/cardpp/v1/ocridcard", this.data[a], {
            legality: 1
        }, this.filterReulst.bind(this, a));
    },
    getClipboardContent: function(t, a) {
        var e = [];
        return t.forEach(function(t) {
            var i = t[0] + ": " + a[t[1]];
            e.push(i);
        }), e;
    },
    clipboard: function() {
        var t = void 0;
        t = (t = 0 == this.data.tab ? this.getClipboardContent(this.data.front_items, this.data.front_card) : this.getClipboardContent(this.data.back_items, this.data.back_card)).toString().replace(/,/g, "\n"), 
        (0, a.setClipboardData)(t);
    },
    choose: function(t) {
        var a = t.detail.tempFilePaths[0];
        0 == this.data.tab ? this.setData({
            frontSrc: a,
            result: {}
        }, this.upload.bind(this, "frontSrc")) : this.setData({
            backSrc: a,
            result: {}
        }, this.upload.bind(this, "backSrc"));
    }
});