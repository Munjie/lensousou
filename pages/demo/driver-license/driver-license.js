var e = require("../../../utils/net"), t = require("../../../utils/util");

Page({
    data: {
        imageSrc: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic6.png",
        str: {
            invalid_text: "未检测到驾驶证，请重新上传",
            invalid: null,
            copy: !1
        },
        feedback: {
            category: "CharacterRecognition",
            demo: "DrivingLicenseRecognition"
        },
        card: null,
        main: null,
        second: null,
        items: [],
        main_items: [ [ "置信度", "confidence" ], [ "驾驶证号", "license_number" ], [ "姓名", "name" ], [ "性别", "gender" ], [ "国籍", "nationality" ], [ "住址", "address" ], [ "出生日期", "birthday" ], [ "初次领证日期", "issue_date" ], [ "签发机关", "issued_by" ], [ "准驾车型", "class" ], [ "有效期限", "valid_date" ], [ "驾驶证版本", "version" ] ],
        second_items: [ [ "置信度", "confidence" ], [ "姓名", "name" ], [ "驾驶证号", "license_number" ], [ "档案编号", "file_number" ] ]
    },
    onLoad: function() {
        this.upload();
    },
    onShareAppMessage: function() {
        return {
            title: "Face++驾驶证识别",
            path: "/pages/demo/driver-license/driver-license"
        };
    },
    preDataProcess: function(e) {
        if (!e || 0 == e.length) return null;
        var t = {};
        for (var i in e) switch (t[i] = e[i].content, i) {
          case "confidence":
            t.confidence = parseInt(e.confidence) + "%";
            break;

          case "version":
            t.version = 1 == e.version.content ? "2008年版或更早版本" : "2013年版";
        }
        return t;
    },
    filterReulst: function(e) {
        if (e.main && e.main.length || e.second && e.second.length) {
            var t = this.preDataProcess(e.main[0]), i = this.preDataProcess(e.second[0]);
            this.setData({
                main: t,
                second: i,
                "str.invalid": !1,
                "str.copy": !0
            });
        } else this.setData({
            "str.invalid": !0,
            "str.copy": !1
        });
    },
    upload: function() {
        this.setData({
            card: {}
        }), (0, e.UploadFileOrPost)("/official/demo/cardpp/v2/ocrdriverlicense", this.data.imageSrc, {
            return_score: 1
        }, this.filterReulst.bind(this));
    },
    getClipboardContent: function(e, t) {
        var i = [];
        return e.forEach(function(e) {
            var n = e[0] + ": " + t[e[1]];
            i.push(n);
        }), i;
    },
    clipboard: function() {
        var e = [];
        if (this.data.main && this.data.main.confidence) {
            e.push("正本: ");
            var i = this.getClipboardContent(this.data.main_items, this.data.main);
            e.push(i);
        }
        if (this.data.second && this.data.second.confidence) {
            e.push("副本: ");
            var n = this.getClipboardContent(this.data.second_items, this.data.second);
            e.push(n);
        }
        console.log(e, "000000000000", this.data.main), e = e.toString().replace(/,/g, "\n"), 
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