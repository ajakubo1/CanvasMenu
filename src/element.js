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

    this.default = "none";
    this.state = "none";

    this.init_canvas = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        return canvas;
    };

    this.canvas = {
        "none": this.init_canvas()
    };

    this.__down = undefined;

    this.__downListener = function() {
        this.__down = true;
    };

    this.__upListener = function(event) {
        if (this.__down) {
            this.trigger('click', event);
        }
        this.__down = false;
    };
    
    this.__leaveListener = function () {
        this.__down = false;
    };

    if (config.on) {
        for (var i = 0; i < config.on.length; i += 1) {
            this.on(config.on[i][0], config.on[i][1]);
        }
    }
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
        if (eventType === 'click') {
            if (handler instanceof CM.Menu) {
                var i;
                for (i = 0; i < this.events[eventType].length; i += 1) {
                    if(this.events[eventType][i] instanceof CM.Menu) {
                        throw new Error("Duplicated Menu! You can't assign second Menu object to the same Button!");
                    }
                }
            }
            if (this.__down === undefined) {
                this.__down = false;
                this.on('mouseleave', this.__leaveListener);
                this.on('mousedown', this.__downListener);
                this.on('mouseup', this.__upListener);
            }
        }
        this.events[eventType].push(handler);
    }
};

//TODO let's think about it... Maybe I should delete it??
CM.Element.prototype.redraw = function (step) {};

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

CM.Element.prototype.getState = function () {
    return this.state;
};

CM.Element.prototype.reinit = function () {};