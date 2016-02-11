/**
 * Created by claim on 10.02.16.
 */


CM.SWITCH_STATE = {
    "on": "on",
    "off": "off"
};

CM.Switch = function(config) {
    CM.Element.call(this, config);

    this.align = config.align || "left";

    this.default = {
        "on": {
            "inner": "white",
            "outer": "white",
            "font": "white"
        },
        "off": {
            "inner": "none",
            "outer": "white",
            "font": "white"
        }
    };

    this.canvas = {
        "on": this.init_canvas(),
        "off": this.init_canvas()
    };
    this.value = config.value || false;
    this.state = this.value ? CM.SWITCH_STATE.on : CM.SWITCH_STATE.off;

    this.redrawState = function (state) {
        state = state || this.state;
        var context = this.canvas[state].getContext('2d'), x;
        context.clearRect(0, 0, this.width, this.height);

        context.font = this.font;
        context.textAlign = this.align;
        context.textBaseline = "middle";
        context.fillStyle = config[state] ? config[state].font || this.default[state].font : this.default[state].font;
        context.fillText(this.text, this.align === "left" ? 5 : this.width - 5, this.height / 2);

        if (config[state] && config[state].fn) {
            config[state].fn.call(this, context);
        } else {
            context.strokeStyle = config[state] ? config[state].outer || this.default[state].outer : this.default[state].outer;
            context.strokeWidth = 2;

            if (this.align === "left") {
                x = this.width - this.height * 4 / 5;
            } else {
                x = this.height / 5;
            }

            context.strokeRect(x, this.height / 5, this.height * 3 / 5, this.height * 3 / 5);

            if((config[state] ? config[state].inner || this.default[state].inner : this.default[state].inner) !== "none") {
                context.fillStyle = config[state] ? config[state].inner || this.default[state].inner : this.default[state].inner;
                context.fillRect(x + 3, this.height / 5 + 3, this.height * 3 / 5 - 6, this.height * 3 / 5 - 6);
            }
        }
    };

    this.redrawState(CM.SWITCH_STATE.off);
    this.redrawState(CM.SWITCH_STATE.on);

    this.clickListener = function (x, y) {
        this.value = !this.value;
        if (this.value) {
            this.state = CM.SWITCH_STATE.on;
        } else {
            this.state = CM.SWITCH_STATE.off;
        }
        this.menu.forceRedraw();
    };

    this.on(CM.EVENTS.click, this.clickListener);
};

CM.Switch.prototype = Object.create(CM.Element.prototype);
CM.Switch.prototype.constructor = CM.Example;

CM.Switch.prototype.update = function (newTick) {
    this.tick = newTick;
    this.redrawState();
};