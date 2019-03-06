Component({
    properties: {
        angle: {
            type: Object,
            value: null,
            observer: "_changeHandler"
        }
    },
    data: {
        pitch: -15,
        rolle: -30,
        yaw: 0,
        top: 36
    },
    methods: {
        _changeHandler: function(l) {
            this.setData({
                pitch: -l.pitch_angle,
                rolle: -l.yaw_angle,
                yaw: l.roll_angle
            }), (l.roll_angle < -80 || l.roll_angle > 150) && this.setData({
                top: 100
            }), -45 < l.roll_angle < -80 && this.setData({
                top: 80
            }), -45 < l.roll_angle < -10 && this.setData({
                top: 60
            }), l.roll_angle > 100 && l.roll_angle < 150 && this.setData({
                top: 72
            });
        }
    }
});