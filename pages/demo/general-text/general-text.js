var t = require("../../../utils/net");

Page({
    data: {
        str: {
            imageSrc: "http://pics.sc.chinaz.com/files/pic/pic9/201609/apic22914.jpg",
            invalid_text: "未检测到通用文字，请重新上传",
            invalid: null
        },
        card: null,
        invalid: null
    },
    onLoad: function() {
        this.upload();
    },
    preDataProcess: function(t) {
        var i = [];
        for (var a in t) {
            var e = {};
            e.name = "文本" + (parseInt(a) + 1), e.value = t[a].value, i.push(e);
        }
        return i;
    },
    filterReulst: function(t) {
        if (t.result && t.result.length) {
            var i = this.preDataProcess(t.result);
            this.setData({
                card: i,
                "str.invalid": !1
            });
        } else this.setData({
            "str.invalid": !0
        });
    },
    upload: function() {
        this.setData({
            card: {}
        }), (0, t.UploadFileOrPost)("/official/demo/imagepp/v1/recognizetext", this.data.str.imageSrc, {}, this.filterReulst.bind(this));
    },
    choose: function(t) {
        var i = t.detail.tempFilePaths[0];
        this.setData({
            "str.imageSrc": i,
            "str.invalid": null,
            result: {}
        }, this.upload);
    }
});