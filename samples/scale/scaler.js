/**
 * Created by claim on 20.12.15.
 */


var SCALER = function (config) {

    var self = this;
    this.canvas = document.getElementById(config.canvas);
    this.width = config.width;
    this.height = config.height;
    this.scale,
    this.menu = config.callback;

    this.listener_resize = function () {
        var windowWidth = window.innerWidth,
            windowHeight = window.innerHeight,
            scaleX = windowWidth / self.width,
            scaleY = windowHeight / self.height,
            left,
            top;

        self.scale = Math.min(scaleX, scaleY);
        if (self.scale === scaleX) {
            left = "0px";
            top = ((windowHeight - self.height * self.scale) / 2) + "px";
        } else {
            left = ((windowWidth - self.width * self.scale) / 2) + "px";
            top = "0px";
        }

        self.canvas.style.transformOrigin = "0 0"; //scale from top left
        self.canvas.style.transform = "scale(" + self.scale + ")";

        //self.canvas.style.transform = "scale(" + scaleX + ", " + scaleY + ")"; // uncomment this and comment out
        // previous two lines to scale x and y to fill the whole screen


        self.canvas.style.top = top;
        self.canvas.style.left = left;

        /*if (self.menu) { // uncomment this to update scale manually
            self.menu.updateScale(self.scale);
        }*/
    };

    window.addEventListener('resize', this.listener_resize);

    this.listener_resize();
};

SCALER.getScale = function () {
    return this.scale;
};