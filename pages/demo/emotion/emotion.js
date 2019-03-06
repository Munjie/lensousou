Page({
    data: {
        image_src: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic2.png",
        emotion: "",
        feedback: {
            category: "FaceRecognition",
            demo: "FacialExpressionAnalyze"
        },
        surely: "",
        invalid: "unknown"
    },
    onShareAppMessage: function() {
        return {
            title: "Face++情绪识别",
            path: "/pages/demo/emotion/emotion"
        };
    },
    uploadEvent: function(e) {
        var t = e.detail.tempFilePaths[0];
        this.setData({
            image_src: t,
            emotion: "",
            surely: "",
            invalid: "unknown"
        });
    },
    resultEvent: function(e) {
        var t = e.detail.extra ? e.detail.extra.emotion : null;
        t ? this.setData({
            invalid: "false",
            emotion: t.describe,
            surely: "概率为" + parseInt(t.probability) + "%"
        }) : this.setData({
            invalid: "true"
        }), wx.hideToast();
    }
});