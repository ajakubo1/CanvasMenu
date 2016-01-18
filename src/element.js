CM.Element = function (config) {
    this.name = config.name;
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.x_limit = this.x + this.width;
    this.y_limit = this.y + this.height;

    this.value = undefined;

    this.tick = 0;
    this.events = {
        "click": [],
        "mousedown": [],
        "mouseup": [],
        "mousemove": [],
        "mouseenter": [],
        "mouseleave": []
    };

    this.default = "yellow";

    this.state = CM.ELEMENT_STATES.idle;

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

    if (config.on) {
        for (var i = 0; i < config.on.length; i += 1) {
            this.on(config.on[i][0], config.on[i][1]);
        }
    }

    this.internalRedraw = function (state) {
        state = state || this.state;
        var context = this.canvas[state].getContext('2d');
        context.clearRect(0, 0, this.width, this.height);

        if (config[state] && config[state].fn) {
            config[state].fn.call(this, context);
        } else {
            context.fillStyle = config.color || this.default;
            context.fillRect(0, 0, this.width, this.height);
        }
    };
    this.internalRedraw();
    this.internalRedraw(CM.ELEMENT_STATES.over);
    this.internalRedraw(CM.ELEMENT_STATES.down);
    this.internalRedraw(CM.ELEMENT_STATES.up);
};

CM.Element.prototype.inRange = function (x, y) {
    if (x >= this.x && x <= this.x_limit && y >= this.y && y <= this.y_limit) {
        return true;
    }
    return false;
};

CM.Element.prototype.trigger = function (eventType, event) {
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

CM.Element.prototype.on = function (eventType, handler) {
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

CM.Element.prototype.redraw = function (step) {
    this.tick = step;
    this.internalRedraw();
};

CM.Element.prototype.getValue = function () {
    return this.value;
};

CM.Element.prototype.getFormattedValue = function () {
    var toReturn = {};
    toReturn[this.name] = this.value;
    return toReturn;
};

CM.Element.prototype.getX = function () {
    return this.x;
};

CM.Element.prototype.getY = function () {
    return this.y;
};


CM.Element.prototype.setMenu = function (menu) {
    this.menu = menu;
};


CM.Element.prototype.getCanvas = function () {
    return this.canvas[this.state];
};


CM.Element.prototype.setState = function (newState) {
    this.state = newState;
};

CM.Element.prototype.getState = function () {
    return this.state;
};