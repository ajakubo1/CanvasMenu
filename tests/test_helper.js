/**
 * Created by claim on 18.01.16.
 */


var TestHelper = {};

// based on: http://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover
TestHelper.rgbToHex = function(point) {
    var red = point[0], green = point[1], blue = point[2];
    return ((red << 16) | (green << 8) | blue).toString(16);
};

TestHelper.triggerMouseEvent = function(type, x, y, element) {
    var event = document.createEvent("MouseEvent");
    event.initMouseEvent(
        type,
        true /* bubble */, true /* cancelable */,
        window, null,
        0, 0, x, y, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    element.dispatchEvent(event);
};