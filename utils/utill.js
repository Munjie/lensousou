var t = function(t) {
    return (t = t.toString())[1] ? t : "0" + t;
};

module.exports = {
    formatTime: function(e) {
        var a = e.getFullYear(), i = e.getMonth() + 1, n = e.getDate(), o = e.getHours(), h = e.getMinutes(), r = e.getSeconds();
        return [ a, i, n ].map(t).join("/") + " " + [ o, h, r ].map(t).join(":");
    },
    calculateScaleVecror: function(t, e, a, i) {
        var n = 0, o = 0, h = 1, r = 1;
        return t / e > a / i ? o = (i - e * (h = r = a / t)) / 2 : n = (a - t * (h = r = i / e)) / 2, 
        {
            xOffset: n,
            yOffset: o,
            xScale: h,
            yScale: r
        };
    },
    setClipboardData: function(t) {
        wx.setClipboardData({
            data: t,
            success: function() {
                wx.showToast({
                    title: "复制到剪贴板"
                });
            }
        });
    },
    ImageFileResize: function(t, e) {
        var a = new Image(), i = document.createElement("canvas"), n = i.getContext("2d");
        a.src = t, a.onload = function() {
            if (console.log(a, "000"), a.width > 1280 || a.height > 1280) {
                var t = Math.max(a.width / 1280, a.height / 1280);
                i.width = a.width / t, i.height = a.height / t;
            } else i.width = a.width, i.height = a.height;
            n.drawImage(a, 0, 0, a.width, a.height, 0, 0, i.width, i.height), e(i.toDataURL());
        };
    }
};