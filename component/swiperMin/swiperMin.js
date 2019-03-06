Component({
    properties: {
        list: {
            type: Array,
            value: "",
            observer: "_listChangeHandler"
        },
        imageSrc: {
            type: String,
            value: "",
            observer: "_imageChangeHandler"
        }
    },
    data: {
        imageList: [],
        imageSrc: ""
    },
    ready: function() {},
    methods: {
        _imageChangeHandler: function(e) {
            this.setData({
                imageSrc: e
            });
        },
        _listChangeHandler: function(e) {
            var t = [];
            for (var a in e) {
                var i = {}, r = 70 / e[a].width;
                i = {
                    width: e[a].imageWidth * r * 2,
                    height: e[a].imageHeight * r * 2,
                    left: 0 - e[a].left * r * 2,
                    top: 0 - e[a].top * r * 2,
                    index: a - 0,
                    active: e[a].active
                }, t.push(i);
            }
            this.setData({
                imageList: t
            });
        },
        clickImage: function(e) {
            var t = this.data.imageList;
            for (var a in t) t[a].active = !1;
            t[e.currentTarget.dataset.id].active = !0, this.setData({
                imageList: t
            }), this.triggerEvent("changeSwiper", e.currentTarget.dataset.id);
        }
    }
});