Component({
    properties: {
        percent: {
            type: String
        },
        unit: {
            type: String,
            value: "分"
        }
    },
    data: {
        width: "130px",
        height: "130px",
        percent: "",
        count: 0,
        countTimer: null
    },
    methods: {
        drawProgressbg: function() {
            var t = wx.createCanvasContext("canvasProgressbg", this);
          t.setLineWidth(8), t.setStrokeStyle("#CD853F"), t.setLineCap("round"), t.beginPath(), 
            t.arc(65, 65, 61, 0, 2 * Math.PI, !1), t.stroke(), t.draw();
        },
        countInterval: function(t) {
            var e = this;
            this.countTimer = setInterval(function() {
                e.data.count <= t ? (e.drawCircle(e.data.count / 50), e.data.count = e.data.count + .5, 
                e.setData({
                    percent: parseInt(e.data.count)
                })) : (e.setData({
                    percent: parseInt(t)
                }), e.drawCircle(t / 50), clearInterval(e.countTimer));
            }, 4);
        },
        drawCircle: function(t) {
            var e = wx.createCanvasContext("canvasProgress", this);
          e.setLineWidth(8), e.setStrokeStyle("#228B22"), e.beginPath(), e.arc(65, 65, 61, -Math.PI / 2, t * Math.PI - Math.PI / 2, !1), 
            e.stroke(), e.draw();
        }
    }
});