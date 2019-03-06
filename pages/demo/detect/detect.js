Page({
    data: {
        image_src: "https://cdn.faceplusplus.com.cn/facepp/wechat/demo-pic1.png",
        age: "",
        feedback: {
            category: "FaceRecognition",
            demo: "FaceAnalyze"
        },
        gender: "",
        emotion: "",
        leftEye: "",
        rightEye: "",
        mouth: "",
        headpose: null,
        invalid: "unknown"
    },
    onShareAppMessage: function() {
        return {
            title: "Face++人脸分析",
            path: "/pages/demo/detect/detect"
        };
    },
    choose: function(e) {
        var t = e.detail.tempFilePaths[0];
        this.setData({
            invalid: "unknown",
            image_src: t,
            age: "",
            gender: "",
            emotion: "",
            leftEye: "",
            rightEye: "",
            mouth: "",
            headpose: null
        });
    },
    resultEvent: function(e) {
        var t = e.detail.faces && e.detail.faces.length ? e.detail.faces[0].attributes : null, a = e.detail.extra;
        t ? this.setData({
            invalid: "false",
            age: t.age.value + "岁",
            gender: "female" == t.gender.value.toLowerCase() ? "女性" : "男性",
            emotion: a.emotion.describe,
            leftEye: a.leftEye.describe,
            rightEye: a.rightEye.describe,
            mouth: a.mouth.describe,
            headpose: t.headpose
        }) : this.setData({
            invalid: "true"
        }), wx.hideToast();
    }
});