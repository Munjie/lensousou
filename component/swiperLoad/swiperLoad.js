function e(e) {
    wx.chooseImage({
        count: 1,
        sizeType: [ "compressed" ],
        sourceType: [ "album", "camera" ],
        success: e
    });
}

var t = require("../../utils/net");

Component({
    properties: {
        list: {
            type: Array,
            value: "",
            observer: "_listChangeHandler"
        },
        title: {
            type: String,
            value: ""
        },
        img: {
            type: String,
            value: ""
        },
        theme: {
            type: String,
            value: ""
        },
        msg: {
            type: String,
            value: ""
        },
        className: {
            type: String,
            value: ""
        },
        target: {
            type: String,
            value: ""
        },
        toView: {
            type: Number,
            value: ""
        },
        msg_status: {
            type: String,
            value: "dark",
            observer: "_statusChangeHandler"
        },
        left: {
            type: Number,
            value: "",
            observer: "_leftChangeHandler"
        },
        btnClass: {
            type: String,
            value: ""
        }
    },
    data: {
        imageList: [],
        msg_status: "dark",
        upload_icon_img: "/image/icon/upload_dark.png",
        imageSrc: ""
    },
    ready: function() {},
    methods: {
        _listChangeHandler: function(e) {
            this.setData({
                imageList: e
            });
        },
        _statusChangeHandler: function(e) {
            e ? this.setData({
                upload_icon_img: "/image/icon/upload_dark.png"
            }) : this.setData({
                upload_icon_img: "/image/icon/upload.png"
            });
        },
        _leftChangeHandler: function(e) {
            console.log(e);
        },
        scroll: function(e) {
            this.setData({
                left: e.detail.scrollLeft
            });
        },
        clickImage: function(e) {
            var t = this.data.imageList;
            for (var a in t) t[a].active = !1;
            t[e.currentTarget.dataset.id].active = !0, this.setData({
                imageList: t,
                msg: "",
                img: "",
                toView: e.currentTarget.dataset.id
            }), this.triggerEvent("changeSwiper", e.currentTarget.dataset.image);
        },
        choose: function(a) {
            var i = this, s = this.data.imageList;
            for (var r in s) s[r].active = !1;
            e(function(e) {
                i.setData({
                    imageList: s,
                    img: e.tempFilePaths[0]
                }), (0, t.UploadFile)({
                    url: "/official/file_to_url",
                    filePath: e.tempFilePaths[0],
                    name: "image_file",
                    success: function(e) {
                        i.triggerEvent("upload", e.url);
                    }
                });
            });
        }
    }
});