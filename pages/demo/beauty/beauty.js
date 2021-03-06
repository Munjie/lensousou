Page({
    components: [ "circle" ],
    data: {
        image_src: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic20.png",
        str: {
            invalid_text: "糟糕，未识别到人脸",
            invalid: null
        },
        feedback: {
            category: "FaceRecognition",
            demo: "FaceScore"
        },
        female_score: 0,
        male_score: 0,
        percent: 0,
        showType: "one",
        invalid: "unknown"
    },
    onShareAppMessage: function() {
        return {
            title: "颜值评分",
            path: "/pages/demo/beauty/beauty"
        };
    },
    resultEvent: function(e) {
        var t = e.detail;
        if (t.faces && t.faces.length) {
            this.setData({
                "str.invalid": !1
            });
            var a = t.faces[0].attributes.beauty;
            this.setData({
                female_score: Math.ceil(a.female_score),
                male_score: Math.ceil(a.male_score),
                percent: Math.ceil((a.female_score + a.male_score) / 2)
            }), this.circle = this.selectComponent("#circle"), this.circle.drawProgressbg(), 
            this.circle.countInterval(this.data.percent);
        } else this.setData({
            "str.invalid": !0
        });
        wx.hideToast();
    },
    choose: function(e) {
        var t = e.detail.tempFilePaths[0];
        this.setData({
            image_src: t,
            "str.invalid": null
        });
    }
});