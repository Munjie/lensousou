var t = require("../../../utils/net"), e = {
    beg: "作揖",
    big_v: "大V",
    double_finger_up: "双指朝上",
    fist: "握拳",
    hand_open: "手张开",
    heart_a: "比心",
    heart_b: "比心",
    heart_c: "比心",
    heart_d: "比心",
    index_finger_up: "食指朝上",
    namaste: "合十\t",
    ok: "OK",
    palm_up: "手心向上",
    phonecall: "打电话",
    rock: "ROCK",
    thanks: "感谢",
    thumb_down: "差评",
    thumb_up: "点赞",
    victory: "胜利"
};

Page({
    data: {
        imageSrc: "https://cdn.faceplusplus.com.cn/facepp/wechat/beg_b.png",
        str: {
            invalid_text: "未定义手势",
            invalid: null
        },
        feedback: {
            category: "HumanBodyRecognition",
            demo: "GestureRecognition"
        },
        status: "show",
        card: null,
        invalid: null,
        rects: [],
        list: [],
        swiperList: [ {
            image: "/image/gesture/gesture_1.png"
        }, {
            image: "/image/gesture/gesture_2.png"
        }, {
            image: "/image/gesture/gesture_3.png"
        } ],
        page_class: "",
        flag: !1
    },
    onLoad: function() {
        this.getSwiperList();
    },
    getSwiperList: function() {
        var t = [], a = Object.keys(e);
        for (var s in a) {
            var i = {};
            i.active = 0 == s, i.name = a[s], i.image = "/image/gesture/" + a[s] + "_p.png", 
            t.push(i);
        }
        this.setData({
            list: t
        });
    },
    perDataProgress: function(t) {
        var a = {
            per: 0
        }, s = Object.keys(t), i = !0, n = !1, r = void 0;
        try {
            for (var l, u = s[Symbol.iterator](); !(i = (l = u.next()).done); i = !0) {
                var c = l.value;
                t[c] > a.per && (a.name = e[c], a.per = parseInt(t[c]), a.img = "/image/gesture/" + c + ".png");
            }
        } catch (t) {
            n = !0, r = t;
        } finally {
            try {
                !i && u.return && u.return();
            } finally {
                if (n) throw r;
            }
        }
        return a;
    },
    filterResult: function(t) {
        var e = this.data.list;
        if (t.hands && t.hands.length) {
            var a = this.perDataProgress(t.hands[0].gesture), s = [ t.hands[0].hand_rectangle ];
            a.name ? this.setData({
                result: a,
                rects: s,
                "str.invalid": !1,
                request_id: t.request_id
            }) : this.setData({
                "str.invalid": !0,
                list: e
            });
        } else e.forEach(function(t) {
            t.active = !1;
        }), t.statusCode, this.setData({
            "str.invalid": !0,
            list: e
        });
    },
    upload: function() {
        this.setData({
            rects: [],
            flag: !0
        }), (0, t.UploadFileOrPost)("/official/demo/humanbodypp/beta/gesture", this.data.imageSrc, {}, this.filterResult.bind(this));
    },
    choose: function(t) {
        var e = t.detail.tempFilePaths[0], a = this.data.list;
        a.forEach(function(t) {
            t.active = !1;
        }), this.setData({
            imageSrc: e,
            list: a,
            "str.invalid": null,
            result: {}
        }, this.upload);
    },
    imageBox: function() {
        this.data.flag || this.upload();
    },
    changeSwiper: function(t) {
        this.setData({
            imageSrc: "https://cdn.faceplusplus.com.cn/facepp/wechat/" + t.detail + "_c.png"
        }), this.upload();
    },
    showGes: function() {
        this.setData({
            page_class: "opacity"
        });
    },
    closeGes: function() {
        this.setData({
            page_class: "",
            status: "show",
            invalid: !1,
            message: ""
        });
    },
    inputChange: function(t) {
        t.detail.value ? this.setData({
            invalid: !1
        }) : this.setData({
            invalid: !0
        }), this.setData({
            message: t.detail.value
        });
    },
    postGes: function() {
        var e = this;
        if (this.data.message) {
            var a = {
                feedback_type: 1,
                category: 1,
                demo: 2,
                message: this.data.message,
                request_id: this.data.request_id
            };
            (0, t.Post)({
                url: "/official/demo/feedback",
                header: {
                    "Content-Type": "application/json"
                },
                data: Object.assign({}, a),
                success: function(t) {
                    e.setData({
                        status: "hide"
                    });
                }
            });
        } else this.setData({
            invalid: !0
        });
    }
});