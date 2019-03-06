Component({
    properties: {
        list: {
            type: Array,
            value: "",
            observer: "_listChangeHandler"
        }
    },
    data: {
        imageList: [],
        imageSrc: ""
    },
    ready: function() {},
    methods: {
        _listChangeHandler: function(t) {
            this.setData({
                imageList: t
            });
        },
        clickImage: function(t) {
            var e = this.data.imageList;
            for (var a in e) e[a].active = !1;
            e[t.currentTarget.dataset.id].active = !0, this.setData({
                imageList: e
            }), this.triggerEvent("changeSwiper", t.currentTarget.dataset.name);
        }
    }
});