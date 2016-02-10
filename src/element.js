/**
 *
 * @param {object} config - configuration for the element
 * @param {number} config.x - x coordinate for button
 * @param {number} config.y - y coordinate for button
 * @param {number} config.width - width for button
 * @param {number} config.height - height for button
 * @param {string} [config.name=undefined] - name of an element (used when element stores some value)
 * @param {array} [config.on=undefined] - all of the listeners for current element each array element is an array with two
 * elements. The [0] element is event name, [1] element is function to be called
 * @constructor
 */
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

    /**
     * Initializes canvas with button width and height
     * Initializes canvas with button width and height
     * @returns {Element}
     */
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

    /**
     * listens for down event (click event)
     * @private
     */
    this.__downListener = function() {
        this.__down = true;
    };

    /**
     * listens for up event (click event)
     * @private
     */
    this.__upListener = function(x, y) {
        if (this.__down) {
            this.trigger(CM.EVENTS.click, x, y);
        }
        this.__down = false;
    };

    /**
     * listens for leave event (click event)
     * @private
     */
    this.__leaveListener = function () {
        this.__down = false;
    };

    if (config.on) {
        for (var i = 0; i < config.on.length; i += 1) {
            this.on(config.on[i][0], config.on[i][1]);
        }
    }
};

/**
 * Indicate if given element is in range of given x, y coordinates
 * @param {int} x - x coordinate
 * @param {int} y - y coordinate
 * @returns {boolean}
 */
CM.Element.prototype.inRange = function (x, y) {
    if (x >= this.x && x <= this.x_limit && y >= this.y && y <= this.y_limit) {
        return true;
    }
    return false;
};

/**
 * Trigger event on an element
 * @param {string} eventType - what event gets triggered
 * @param {int} x - x coordinate of where the mouse is during event trigger
 * @param {int} y - y coordinate of where the mouse is during event trigger
 */
CM.Element.prototype.trigger = function (eventType, x, y) {
    var i, handlers = this.events[eventType];
    for (i = 0; i < handlers.length; i += 1) {
        if (eventType === CM.EVENTS.click && handlers[i] instanceof CM.Menu) {
            this.menu.destroy();
            handlers[i].init();
        } else {
            handlers[i].call(this, x, y);
        }
    }
};

/**
 * Set event handler for given event
 * @param {string} eventType - event type for which to listen
 * @param {function} handler - handler function
 */
CM.Element.prototype.on = function (eventType, handler) {
    if (!(eventType in CM.EVENTS)) {
        throw new Error("Wrong Event! This library only allows for triggering the following events: " +
            Object.keys(CM.EVENTS));
    } else {
        if (eventType === CM.EVENTS.click) {
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
                this.on(CM.EVENTS.mouseleave, this.__leaveListener);
                this.on(CM.EVENTS.mousedown, this.__downListener);
                this.on(CM.EVENTS.mouseup, this.__upListener);
            }
        }
        this.events[eventType].push(handler);
    }
};

/**
 * Function called when menu animation is enabled
 * @param {int} newTick - tick number from menu
 */
CM.Element.prototype.update = function (newTick) {};

/**
 * Returns element value (if any is set)
 * @returns {undefined|*}
 */
CM.Element.prototype.getValue = function () {
    return this.value;
};

/**
 * Returns element value wrapped in object (keyed by element name). If no name is set, returns undefined
 * @returns {*}
 */
CM.Element.prototype.getFormattedValue = function () {
    var toReturn = {};
    if (this.name) {
        toReturn[this.name] = this.value;
    } else {
        return undefined;
    }
    return toReturn;
};

/**
 * Get X coordinate of element
 * @returns {number|*}
 */
CM.Element.prototype.getX = function () {
    return this.x;
};

/**
 * Get Y coordinate of element
 * @returns {number|*}
 */
CM.Element.prototype.getY = function () {
    return this.y;
};

/**
 * Sets menu for which element is added
 * @param menu
 */
CM.Element.prototype.setMenu = function (menu) {
    this.menu = menu;
};

/**
 * Get current canvas
 * @returns {*}
 */
CM.Element.prototype.getCanvas = function () {
    return this.canvas[this.state];
};

/**
 * function called when menu disappears
 */
CM.Element.prototype.destroy = function () {};