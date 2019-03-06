function e(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}

function t(e) {
    return "object" == (void 0 === e ? "undefined" : u(e)) && (e = JSON.stringify(e)), 
    c.Base64.encode(e);
}

function o() {
    var e;
    "object" === ("undefined" == typeof console ? "undefined" : u(console)) && console.log && (e = console).log.apply(e, arguments);
}

function n() {
    return "wx.anonym." + (new Date().getTime() / 1e3 + Math.random());
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var r = function() {
    function e(e, t) {
        for (var o = 0; o < t.length; o++) {
            var n = t[o];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), 
            Object.defineProperty(e, n.key, n);
        }
    }
    return function(t, o, n) {
        return o && e(t.prototype, o), n && e(t, n), t;
    };
}(), u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, c = require("./base64.js"), i = "__HORUS_USER_ID", a = function() {
    function c(t) {
        var o = this;
        e(this, c), this.opt = Object.assign({
            url: "",
            project: "Empty",
            accountId: "",
            debug: !1
        }, t), this.opt.accountId || wx.getStorage({
            key: i,
            success: function(e) {
                o.opt.accountId = e.data;
            },
            fail: function() {
                var e = n();
                wx.setStorage({
                    key: i,
                    data: e,
                    success: function(t) {
                        o.opt.accountId = e;
                    }
                });
            }
        });
    }
    return r(c, [ {
        key: "decorator",
        value: function(e, t) {
            var n = t || {};
            "object" != (void 0 === n ? "undefined" : u(n)) && (n = {
                msg: String(t)
            });
            var r = {
                time: new Date().getTime(),
                project: this.opt.project,
                event_id: new Date().getTime() + "-" + Math.random().toString().substr(2),
                event: e,
                properties: Object.assign({
                    cookie: "",
                    account_id: this.opt.accountId,
                    user_id: ""
                }, {
                    user_brand: "",
                    user_explorer: "Wechat Applet",
                    user_model: "",
                    user_os: ""
                }),
                custom: n
            };
            if (r.custom.mark) {
                var c = r.custom.mark.split(":");
                c[0] && (r.event_type = c[0]);
            }
            return this.opt.debug && (o("Horus reporting: ", r), o(r.custom && r.custom.xpath)), 
            r;
        }
    }, {
        key: "occur",
        value: function(e, t) {
            this._report(e, t);
        }
    }, {
        key: "_report",
        value: function(e, o) {
            var n = this.opt.url;
            n.indexOf("?") < 0 && (n += "?"), n += "&data=" + t(this.decorator(e, o)), n += "&_=" + new Date().getTime(), 
            wx.request({
                url: n
            });
        }
    } ]), c;
}();

exports.default = a;