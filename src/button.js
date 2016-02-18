/**
 *
 * @param {object} config - configuration for the button
 * @param {string} [config.align="center"] - text alignment of button
 *
 * @param {object} [config.down=undefined] - description of down state button
 * @param {string} [config.down.color="red"] - button background color for down state
 * @param {string} [config.down.font="white"] - font color for down state
 * @param {function} [config.down.fn=undefined] - animation function for down state
 *
 * @param {object} [config.over=undefined] - description of over state button
 * @param {string} [config.over.color="blue"] - button background color for over state
 * @param {string} [config.over.font="white"] - font color for over state
 * @param {function} [config.over.fn=undefined] - animation function for over state
 *
 * @param {object} [config.up=undefined] - description of up state button
 * @param {string} [config.up.color="orange"] - button background color for up state
 * @param {string} [config.up.font="white"] - font color for up state
 * @param {function} [config.up.fn=undefined] - animation function for up state
 *
 * @param {object} [config.idle=undefined] - description of idle state button
 * @param {string} [config.idle.color="green"] - button background color for idle state
 * @param {string} [config.idle.font="white"] - font color for idle state
 * @param {function} [config.idle.fn=undefined] - animation function for idle state
 *
 * @constructor
 */
CM.Button = function(config) {
    CM.Element.call(this, config);

    this.state = CM.BUTTON_STATES.idle;
    this.align = config.align || "center";

    this.default = {
        "idle": {
            "color": "green",
            "font": "white"
        },
        "over": {
            "color": "blue",
            "font": "white"
        },
        "down": {
            "color": "red",
            "font": "white"
        },
        "up": {
            "color": "orange",
            "font": "white"
        }
    };

    this.canvas = {
        "idle": this.init_canvas(),
        "over": this.init_canvas(),
        "down": this.init_canvas(),
        "up": this.init_canvas()
    };

    this.redrawStateField = function (context, state) {
        context.fillStyle = config[state] ? config[state].color || this.default[state].color :
            this.default[state].color;
        context.fillRect(0, 0, this.width, this.height);
    };

    this.redrawState();
    this.redrawState(CM.BUTTON_STATES.over);
    this.redrawState(CM.BUTTON_STATES.down);
    this.redrawState(CM.BUTTON_STATES.up);
    
    this.enterListener = function (x, y) {
        this.menu.canvas.style.cursor = 'pointer';
        this.state = CM.BUTTON_STATES.over;
        this.menu.forceRedraw();
    };

    this.leaveListener = function (x, y) {
        this.menu.canvas.style.cursor = '';
        this.state = CM.BUTTON_STATES.idle;
        this.menu.forceRedraw();
    };

    this.upListener = function (x, y) {
        this.state = CM.BUTTON_STATES.up;
        this.menu.forceRedraw();
    };

    this.downListener = function (x, y) {
        this.state = CM.BUTTON_STATES.down;
        this.menu.forceRedraw();
    };

    this.moveListener = function (x, y) {
        if (this.state === CM.BUTTON_STATES.up) {
            this.state = CM.BUTTON_STATES.over;
            this.menu.forceRedraw();
        }
    };

    this.on(CM.EVENTS.mouseenter, this.enterListener);
    this.on(CM.EVENTS.mouseleave, this.leaveListener);
    this.on(CM.EVENTS.mousedown, this.downListener);
    this.on(CM.EVENTS.mouseup, this.upListener);
    this.on(CM.EVENTS.mousemove, this.moveListener);
};

CM.Button.prototype = Object.create(CM.Element.prototype);
CM.Button.prototype.constructor = CM.Button;

CM.Element.prototype.destroy = function () {
    this.state = CM.BUTTON_STATES.idle;
};

CM.Element.prototype.update = function (newTick) {
    this.tick = newTick;
    this.redrawState();
};
