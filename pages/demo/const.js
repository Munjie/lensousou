var e = {
    black: "深色系",
    white: "浅色系",
    red: "红色系",
    green: "绿色系",
    blue: "蓝色系",
    yellow: "黄色系",
    magenta: "洋红色系",
    cyan: "青色系",
    gray: "灰色系",
    purple: "紫色系",
    orange: "橙色系"
}, s = {
    Female: "女性",
    Male: "男性"
}, a = {
    anger: "怒气冲冲",
    disgust: "一脸嫌弃",
    fear: "胆战心惊",
    happiness: "眉开眼笑",
    neutral: "平静如水",
    sadness: "蓝瘦香菇",
    surprise: "一脸懵逼"
}, l = {
    surgical_mask_or_respirator: "带口罩",
    other_occlusion: "被挡住",
    close: "紧闭",
    open: "张开"
}, r = {
    occlusion: "眼睛被遮挡",
    no_glass_eye_open: "不戴眼镜且睁眼",
    normal_glass_eye_close: "佩戴普通眼镜且闭眼",
    normal_glass_eye_open: "佩戴普通眼镜且睁眼",
    dark_glasses: "佩戴墨镜",
    no_glass_eye_close: "不戴眼镜且闭眼"
};

module.exports = {
    COLOR_SET: e,
    GENDER_SET: s,
    EMOTION_ENUM: a,
    MOUTH_ENUM: l,
    EYE_ENUM: r
};