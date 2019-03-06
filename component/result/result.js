Component({
    properties: {
        text: {
            type: String,
            value: ""
        }
    },
    methods: {
        choose: function() {
            var e = this;
            wx.chooseImage({
                count: 1,
                sizeType: [ "compressed" ],
                sourceType: [ "album", "camera" ],
                success: function(t) {
                    e.triggerEvent("upload", t);
                }
            });
        }
    }
});