const defaultDesignWidth = 375;

function px2rem(px, designWidth) {
    //预判你将会在JS中用到尺寸，特提供一个方法助你在JS中将px转为rem。就是这么贴心。
    if (!designWidth) {
        //如果你在JS中大量用到此方法，建议直接定义 hotcss.designWidth 来定义设计图尺寸;
        //否则可以在第二个参数告诉我你的设计图是多大。
        designWidth = defaultDesignWidth;
    }

    return parseInt(px, 10) * 320 / designWidth / 20;
}

function deepCopy(source) {
    var result = {};
    for (var key in source) {
        result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
    }
    return result;
}

export {px2rem, deepCopy};