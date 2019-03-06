Component({
    properties: {
        src: {
            type: String,
            value: "",
            observer: "_imageChangeHandler"
        },
        rects: {
            type: Array,
            observer: "_rectsChangeHandler"
        },
        imageError: {
            type: Array,
            observer: "_errorChangeHandler"
        }
    },
    data: {
        ts: null,
        boxWidth: 0,
        boxHeight: 0,
        imageSrc: "",
        rectangles: [],
        vector: null
    },
    ready: function() {},
    methods: {
        _errorChangeHandler: function(e) {
            this.setData({
                imageError: e
            });
        },
        imageLoad: function(e) {
            var t = e.detail.width, a = t / e.detail.height, i = void 0, r = void 0;
            a > 750 / 560 ? (i = 750, r = 750 / a) : (r = 560, i = 560 * a), this.setData({
                imgwidth: i,
                imgheight: r,
                realWidth: e.detail.width,
                realHeight: e.detail.height,
                ratio: a,
                scale: i / t
            }), this.triggerEvent("imageBox", {
                width: e.detail.width,
                height: e.detail.height
            });
        },
        imageError: function(e) {
            e.target.dataset.url && wx.showToast({
                title: "网络不给力",
                image: "/image/icon/net_off.png"
            });
        },
        previewImage: function() {
            wx.previewImage({
                urls: [ this.data.imageSrc ]
            });
        },
        _drawRect: function(e) {
            var t = this.data, a = t.rectangles, i = t.scale;
            e && (a.push({
                left: e.left * i,
                top: e.top * i,
                width: e.width * i,
                height: e.height * i,
                active: e.active,
                rotateZ: e.rotateZ ? e.rotateZ : 0
            }), this.setData({
                rectangles: a
            }));
        },
        _imageChangeHandler: function(e) {
            this.setData({
                imageSrc: e
            });
        },
        _rectsChangeHandler: function(e) {
            var t = this;
            this.setData({
                rectangles: []
            }), e.forEach(function(e) {
                return t._drawRect(e);
            });
        }
    }
});