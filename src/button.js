/**
 *
 * @param {object} config - configuration for the button
 * Mandatory:
 * @param {number} config.x - x coordinate for button
 * @param {number} config.y - y coordinate for button
 * @param {number} config.width - width for button
 * @param {number} config.height - height for button
 * @param {string} [config.text=undefined] - text displayed in button field
 *
 * Optional:
 * @param {string} [config.font=(this.height * 3 / 5 ) + 'pt Arial'] - font style for button (inputted directly into context.font during draw phase)
 * @param {string} [config.redrawInactiveColor='green'] - html color for inactive button background (defaults to 'green')
 * @param {string} [config.redrawFocusedColor='blue'] - html color for focused button background (defaults to 'blue')
 * @param {string} [config.redrawDownColor='red'] - html color for down button background (defaults to 'red')
 * @param {string} [config.redrawUpColor='orange'] - html color for up button background (defaults to 'orange')
 * @param {string} [config.redrawInactiveFont='white'] - html color for inactive button foreground (defaults to 'white')
 * @param {string} [config.redrawFocusedFont='white'] - html color for focused button foreground (defaults to 'white')
 * @param {string} [config.redrawDownFont='white'] - html color for down button foreground (defaults to 'white')
 * @param {string} [config.redrawUpFont='white'] - html color for up button foreground (defaults to 'white')
 * @param {function} [config.redrawInactive=undefined] - function called to redraw background during inactive state
 * @param {function} [config.redrawFocused=undefined] - function called to redraw background during inactive state
 * @param {function} [config.redrawDown=undefined] - function called to redraw background during inactive state
 * @param {function} [config.redrawUp=undefined] - function called to redraw background during inactive state
 *
 * @constructor
 *
 */
CM.Button = function(config) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.x_limit = this.x + this.width;
    this.y_limit = this.y + this.height;
    this.state = CM.ELEMENT_STATES.idle;
    this.tick = 0;
    this.text = config.text;
    this.font = config.font || (this.height * 3 / 5 ) + 'pt Arial';
    this.events = {
        "click": [],
        "mousedown": [],
        "mouseup": [],
        "mousemove": [],
        "mouseenter": [],
        "mouseleave": []
    };

    this.init_canvas = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        return canvas;
    };

    this.canvas = {
        "idle": this.init_canvas(),
        "over": this.init_canvas(),
        "down": this.init_canvas(),
        "up": this.init_canvas()
    };

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

    this.redraw = function (state) {
        state = state || this.state;
        var context = this.canvas[state].getContext('2d');
        context.clearRect(0, 0, this.width, this.height);

        if (config[state] && config[state].fn) {
            config[state].fn.call(this, context);
        } else {
            context.fillStyle = config[state] ? config[state].color || this.default[state].color :
                this.default[state].color;
            context.fillRect(0, 0, this.width, this.height);
        }

        context.font = this.font;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = config[state] ? config[state].font || this.default[state].font :
            this.default[state].font;
        context.fillText(this.text, this.width / 2, this.height / 2);
    };

    this.redraw();
    this.redraw(CM.ELEMENT_STATES.over);
    this.redraw(CM.ELEMENT_STATES.down);
    this.redraw(CM.ELEMENT_STATES.up);

    if (config.on) {
        for (var i = 0; i < config.on.length; i += 1) {
            this.on(config.on[i][0], config.on[i][1]);
        }
    }
};

CM.Button.prototype.inRange = function (x, y) {
    if (x >= this.x && x <= this.x_limit && y >= this.y && y <= this.y_limit) {
        return true;
    }
    return false;
};

CM.Button.prototype.setState = function (newState) {
    var menuCanvas = this.menu.canvas;

    // If the button state is changed to 'over', when means
    // the button is in the 'over' state...
    if (newState === CM.ELEMENT_STATES.over) {
        // ...change the mouse cursor to 'pointer' so it behaves as
        // a regular link.
        menuCanvas.style.cursor = 'pointer';
    } else {
        // If it's not, switch the cursor to the regular state.
        menuCanvas.style.cursor = '';
    }

    this.state = newState;
    this.tick = 0;
};

CM.Button.prototype.getState = function () {
    return this.state;
};

CM.Button.prototype.redrawBackground = function (step) {
    this.tick = step;
    this.redraw();
};

CM.Button.prototype.getCanvas = function () {
    return this.canvas[this.state];
};

CM.Button.prototype.getX = function () {
    return this.x;
};

CM.Button.prototype.getY = function () {
    return this.y;
};

CM.Button.prototype.setMenu = function (menu) {
    this.menu = menu;
};

CM.Button.prototype.trigger = function (eventType, event) {
    var i, handlers = this.events[eventType];
    for (i = 0; i < handlers.length; i += 1) {
        if (eventType === 'click' && handlers[i] instanceof CM.Menu) {
            this.menu.destroy();
            handlers[i].init();
        } else {
            handlers[i].call(this, event);
        }
    }
};

CM.Button.prototype.on = function (eventType, handler) {
    if (!(eventType in this.events)) {
        throw new Error("Wrong Event! This library only allows for triggering the following events: " +
            Object.keys(this.events));
    } else {
        if (eventType === 'click' && handler instanceof CM.Menu) {
            var i;
            for (i = 0; i < this.events[eventType].length; i += 1) {
                if(this.events[eventType][i] instanceof CM.Menu) {
                    throw new Error("Duplicated Menu! You can't assign second Menu object to the same Button!");
                }
            }
        }

        this.events[eventType].push(handler);
    }
};
