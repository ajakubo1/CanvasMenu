CM = {};

/**
 *
 * @param {object} config - configuration for the button
 * Mandatory:
 * @param {DOM object} config.canvas - Canvas DOM element
 *
 * @param {number} [config.width=800] - width for menu
 * @param {number} [config.height=600] - height for button
 * @param {number} [config.tickMax=Number.MAX_VALUE] - change the amount of time for which tick will be rotated
 * @param {functon} [config.animation=undefined] - menu animation function
 * @param {boolean} [config.autorescale=false] - let the menu scale automatically (from css transform)
 *
 * @constructor
 *
 */
CM.Menu = function(config) {
    var self = this;
    this.elements = [];
    this.canvas = config.canvas;
    this.width = config.width || 800;
    this.height = config.height || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
    this.scaleX = 1;
    this.scaleY = 1;
    this.focused = undefined;
    this.animated = config.animation ? true : false;
    this.running = false;
    this.updateTime = undefined;
    this.tickLength = 1000.0 / 60;
    this.tickCount = 0;
    this.tickMax = config.tickMax || Number.MAX_VALUE;
    this.autorescale = config.autorescale || false;

    this.listener_mousedown = function (event) {
        var x =  (event.pageX - this.offsetLeft) / self.scaleX, y = (event.pageY - this.offsetTop) / self.scaleY;

        if (self.focused !== undefined && self.focused.inRange(x, y)) {
            self.focused.trigger('mousedown', event);
        }
    };

    this.listener_mousemove = function (event) {
        var i, x =  (event.pageX - this.offsetLeft) / self.scaleX, y = (event.pageY - this.offsetTop) / self.scaleY;

        if (self.focused !== undefined) {
            if (!self.focused.inRange(x, y)) {
                self.focused.trigger('mouseleave', event);
                self.focused = undefined;
            } else {
                self.focused.trigger('mousemove', event);
            }
        } else {
            for (i = 0; i < self.elements.length; i += 1) {
                if (self.elements[i].inRange(x, y)) {
                    self.focused = self.elements[i];
                    self.focused.trigger('mouseenter', event);
                    break;
                }
            }
        }
    };

    this.listener_mouseup = function (event) {
        var x =  (event.pageX - this.offsetLeft) / self.scaleX, y = (event.pageY - this.offsetTop) / self.scaleY;
        if (self.focused !== undefined && self.focused.inRange(x, y)) {
            self.focused.trigger('mouseup', event);
        }
    };

    /**
     * found it at https://css-tricks.com/get-value-of-css-rotation-through-javascript/
     */
    this.rescale = function () {
        var	style = window.getComputedStyle(self.canvas, null),
            transform = style.getPropertyValue("-webkit-transform") ||
                style.getPropertyValue("-moz-transform") ||
                style.getPropertyValue("-ms-transform") ||
                style.getPropertyValue("-o-transform") ||
                style.getPropertyValue("transform") ||
                undefined,
            values;
        if(transform === 'none') { //only way for phantomjs tests to work...
            transform = self.canvas.style.transform;
            transform = transform.split(')')[0];
            transform = transform.split(',');
            transform = transform[0] + ", 1, 1, " + transform[1] + ")";
        }

        if (!transform) {
            return;
        }

        values = transform.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');
        self.scaleX = values[0];
        self.scaleY = values[3];
    };

    this.redrawMenu = config.animation;

    this.run = function (frameTime) {
        if (self.running) {
            var tickCount = Math.floor((frameTime - self.updateTime) / self.tickLength), i;
            if (tickCount > 0) {

                self.updateTime += tickCount * self.tickLength;

                self.tickCount += tickCount;

                if(self.tickCount > self.tickMax) {
                    self.tickCount = 0;
                }

                for (i = 0; i < self.elements.length; i += 1) {
                    self.elements[i].redraw(self.tickCount);
                }

                self.redraw();
            }
            window.requestAnimationFrame(self.run);
        }
    };
};

CM.Menu.prototype.isVisible = function () {
    return this.running;
};

CM.Menu.prototype.init = function () {
    this.canvas.addEventListener('mouseup', this.listener_mouseup);
    this.canvas.addEventListener('mousedown', this.listener_mousedown);
    this.canvas.addEventListener('mousemove', this.listener_mousemove);
    this.redraw();
    this.running = true;
    if (this.autorescale) {
        window.addEventListener('resize', this.rescale);
        this.rescale();
    }

    if (this.animated) {
        this.updateTime = window.performance.now();
        window.requestAnimationFrame(this.run);
    }
};

CM.Menu.prototype.destroy = function () {
    var i;

    this.canvas.removeEventListener('mouseup', this.listener_mouseup);
    this.canvas.removeEventListener('mousedown', this.listener_mousedown);
    this.canvas.removeEventListener('mousemove', this.listener_mousemove);

    if (this.autorescale) {
        window.removeEventListener('resize', this.rescale);
    }

    for (i = 0; i < this.elements.length; i += 1) {
        this.elements[i].reinit();
    }

    this.redraw();

    this.running = false;
};

CM.Menu.prototype.add = function (element) {
    this.elements.push(element);
    element.setMenu(this);
};

CM.Menu.prototype.updateScale = function (scale) {
    this.scaleX = scale;
    this.scaleY = scale;
};

CM.Menu.prototype.updateScaleX = function (scale) {
    this.scaleX = scale;
};

CM.Menu.prototype.updateScaleY = function (scale) {
    this.scaleY = scale;
};

CM.Menu.prototype.create = function (componentType, config) {
    // capitalize the type of the component, so 'button' will became 'Button'
    componentType = componentType.charAt(0).toUpperCase() + componentType.slice(1);
    if (CM[componentType]){
        var component = new CM[componentType](config);
        this.add(component);
        return component;
    } else {
        throw new Error("Component of " + componentType + " type not found");
    }
};

CM.Menu.prototype.redraw = function () {
    var i;

    if (this.animated) {
        this.redrawMenu(this.ctx);
    } else {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    for (i = 0; i < this.elements.length; i += 1) {
        this.ctx.drawImage(this.elements[i].getCanvas(), this.elements[i].getX(), this.elements[i].getY());
    }
};

CM.ELEMENT_STATES = {
    "idle": "idle",
    "over": "over",
    "down": "down",
    "up": "up"
};CM.Element = function (config) {
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

CM.Element.prototype.reinit = function () {};/**
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
    CM.Element.call(this, config);

    this.state = CM.ELEMENT_STATES.idle;
    this.text = config.text;
    this.font = config.font || (this.height * 3 / 5 ) + 'pt Arial';

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

    this.internalRedraw = function (state) {
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

    this.internalRedraw();
    this.internalRedraw(CM.ELEMENT_STATES.over);
    this.internalRedraw(CM.ELEMENT_STATES.down);
    this.internalRedraw(CM.ELEMENT_STATES.up);
    
    this.enterListener = function (event) {
        this.menu.canvas.style.cursor = 'pointer';
        this.state = CM.ELEMENT_STATES.over;
        this.menu.redraw();
    };

    this.leaveListener = function (event) {
        this.menu.canvas.style.cursor = '';
        this.state = CM.ELEMENT_STATES.idle;
        this.menu.redraw();
    };

    this.upListener = function (event) {
        this.state = CM.ELEMENT_STATES.up;
        this.menu.redraw();
    };

    this.downListener = function (event) {
        this.state = CM.ELEMENT_STATES.down;
        this.menu.redraw();
    };

    this.moveListener = function (event) {
        if (this.state === CM.ELEMENT_STATES.up) {
            this.state = CM.ELEMENT_STATES.over;
            this.menu.redraw();
        }
    };

    this.on('mouseenter', this.enterListener);
    this.on('mouseleave', this.leaveListener);
    this.on('mousedown', this.downListener);
    this.on('mouseup', this.upListener);
    this.on('mousemove', this.moveListener);
};

CM.Button.prototype = Object.create(CM.Element.prototype);
CM.Button.prototype.constructor = CM.Button;

CM.Element.prototype.reinit = function () {
    this.state = CM.ELEMENT_STATES.idle;
};

CM.Element.prototype.redraw = function (step) {
    this.tick = step;
    this.internalRedraw();
};


CM.Example = function(config) {
    CM.Element.call(this, config);
};

CM.Example.prototype = Object.create(CM.Element.prototype);
CM.Example.prototype.constructor = CM.Example;