CM = {};

CM.EVENTS = {
    "click": "click",
    "mousedown": "mousedown",
    "mouseup": "mouseup",
    "mousemove": "mousemove",
    "mouseenter": "mouseenter",
    "mouseleave": "mouseleave"
};

/**
 *
 * @param {object} config - configuration for the menu
 * @param {DOM object} config.canvas - Canvas DOM element
 * @param {number} [config.width=800] - width for menu
 * @param {number} [config.height=600] - height for button
 * @param {number} [config.tickMax=Number.MAX_VALUE] - change the amount of time for which tick will be rotated
 * @param {number} [config.fps=60] - how many redraw operations should be made per second
 * @param {function} [config.animation=undefined] - menu animation function
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
    this.focused = [];
    this.animated = config.animation ? true : false;
    this.running = false;
    this.updateTime = undefined;
    this.tickLength = 1000.0 / (config.fps || 60);
    this.tickCount = 0;
    this.tickMax = config.tickMax || Number.MAX_VALUE;
    this.autorescale = config.autorescale || false;

    /**
     * Listens to mousedown event on canvas, triggers mousedown event on focused element
     * @param event
     */
    this.listener_mousedown = function (event) {
        if (self.focused.length !== 0) {
            var x =  (event.pageX - this.offsetLeft) / self.scaleX, y = (event.pageY - this.offsetTop) / self.scaleY;
            self.triggerEvent(CM.EVENTS.mousedown, x, y);
        }
    };

    /**
     * Listens to mousemove event on canvas, sets-up focused element, removes focus from element, triggers
     * mouseleave, mouseenter and mousemove events on focused element
     * @param event
     */
    this.listener_mousemove = function (event) {
        var i, j, notFocused,
            x =  (event.pageX - this.offsetLeft) / self.scaleX, y = (event.pageY - this.offsetTop) / self.scaleY;
        //Check if still in range
        for (i = self.focused.length - 1; i >= 0; i -= 1) {
            if (!self.elements[self.focused[i]].inRange(x, y)) {
                self.elements[self.focused[i]].trigger(CM.EVENTS.mouseleave, x, y);
                self.focused.splice(i, 1);
            }
        }

        //Inform of mousemove event
        if (self.focused.length !== 0) {
            self.triggerEvent(CM.EVENTS.mousemove, x, y);
        }

        //Check if new one is in range
        for (i = 0; i < self.elements.length; i += 1) {
            notFocused = true;
            for (j = 0; j < self.focused.length; j += 1) {
                if(j === self.focused[i]) {
                    notFocused = false;
                    break;
                }
            }

            if (notFocused) {
                if (self.elements[i].inRange(x, y)) {
                    self.focused.push(i);
                    self.elements[i].trigger(CM.EVENTS.mouseenter, x, y);
                }
            }
        }
    };

    /**
     * Listens to mouseup event on canvas, triggers mouseup event on focused element
     * @param event
     */
    this.listener_mouseup = function (event) {
        if (self.focused.length !== 0) {
            var x =  (event.pageX - this.offsetLeft) / self.scaleX, y = (event.pageY - this.offsetTop) / self.scaleY;
            self.triggerEvent(CM.EVENTS.mouseup, x, y);
        }
    };

    this.triggerEvent = function (event, x, y) {
        var i;
        for (i = 0 ; i < self.focused.length ; i += 1) {
            self.elements[self.focused[i]].trigger(event, x, y);
        }
    };

    /**
     * found it at https://css-tricks.com/get-value-of-css-rotation-through-javascript/
     *
     * Takes transform style element and extracts scale information (x and y scale), it then adjusts scaleX and
     * scaleY parameters
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

    /**
     * Sets up animation function - if it is enabled, it will be called every {config.fps} times per second
     */
    this.animationStep = config.animation;

    /**
     * Renders the whole menu with every single element
     */
    this.render = function () {
        var i;

        if (this.animated) {
            this.animationStep(this.ctx);
        } else {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
        for (i = 0; i < this.elements.length; i += 1) {
            this.ctx.drawImage(this.elements[i].getCanvas(), this.elements[i].getX(), this.elements[i].getY());
        }
    };

    /**
     * Animation loop, running only when menu animations are enabled
     * @param frameTime
     */
    this.run = function (frameTime) {
        var tickCount = Math.floor((frameTime - self.updateTime) / self.tickLength), i;
        if (tickCount > 0) {

            self.updateTime += tickCount * self.tickLength;
            self.tickCount += tickCount;

            if(self.tickCount > self.tickMax) {
                self.tickCount = 0;
            }
            for (i = 0; i < self.elements.length; i += 1) {
                self.elements[i].update(self.tickCount);
            }
            self.render();
        }

        if (self.running) {
            window.requestAnimationFrame(self.run);
        }
    };
};

/**
 * Indicates if menu is currently visible/animating
 * @returns {boolean}
 */
CM.Menu.prototype.isVisible = function () {
    return this.running;
};

/**
 * Initiates menu
 */
CM.Menu.prototype.init = function () {
    this.canvas.addEventListener('mouseup', this.listener_mouseup);
    this.canvas.addEventListener('mousedown', this.listener_mousedown);
    this.canvas.addEventListener('mousemove', this.listener_mousemove);
    this.render();
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

/**
 * Destroys menu
 */
CM.Menu.prototype.destroy = function () {
    var i;

    this.canvas.removeEventListener('mouseup', this.listener_mouseup);
    this.canvas.removeEventListener('mousedown', this.listener_mousedown);
    this.canvas.removeEventListener('mousemove', this.listener_mousemove);

    if (this.autorescale) {
        window.removeEventListener('resize', this.rescale);
    }

    for (i = 0; i < this.elements.length; i += 1) {
        this.elements[i].destroy();
    }

    this.render();

    this.running = false;
};

/**
 * Adds element to menu
 * @param {CM.Element} element
 */
CM.Menu.prototype.add = function (element) {
    this.elements.push(element);
    element.setMenu(this);
};

/**
 * Function for manual scale update (updates x and y scales with the same value)
 * @param {float} scale
 */
CM.Menu.prototype.updateScale = function (scale) {
    this.scaleX = scale;
    this.scaleY = scale;
};

/**
 * Function for manual scale update (updates x scale)
 * @param {float} scale
 */
CM.Menu.prototype.updateScaleX = function (scale) {
    this.scaleX = scale;
};

/**
 * Function for manual scale update (updates y scale)
 * @param {float} scale
 */
CM.Menu.prototype.updateScaleY = function (scale) {
    this.scaleY = scale;
};

/**
 * Element generation + assigning it to the menu
 * @param {String} componentType - name of element you want to create
 * @param config - configuration passed to element creation
 */
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

/**
 * Redraw the whole menu manually (called by elements when their state changes)
 */
CM.Menu.prototype.forceRedraw = function () {
    if (!this.animated) {
        this.render();
    }
};

CM.BUTTON_STATES = {
    "idle": "idle",
    "over": "over",
    "down": "down",
    "up": "up"
};/**
 *
 * @param {object} config - configuration for the element
 * @param {number} config.x - x coordinate for button
 * @param {number} config.y - y coordinate for button
 * @param {number} config.width - width for button
 * @param {number} config.height - height for button
 * @param {string} [config.align="left"] - text alignment of element
 * @param {string} [config.vertical="middle"] - text alignment of element
 * @param {string} [config.text=undefined] - text displayed in element field
 * @param {string} [config.font=(config.height * 3 / 5 ) + 'pt Arial'] - font property inputted directly into canvas.context.font property
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

    this.text = config.text;
    this.font = config.font || (this.height * 3 / 5 ) + 'pt Arial';
    this.align = config.align || "left";
    this.vertical = config.vertical || "middle";

    this.events = {
        "click": [],
        "mousedown": [],
        "mouseup": [],
        "mousemove": [],
        "mouseenter": [],
        "mouseleave": []
    };

    this.default = "main";
    this.state = "main";

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
        "main": this.init_canvas()
    };

    this.default = {
        "main": {
            "font": "white"
        }
    };

    this.redrawStateField = function (context, state) {

    };

    this.redrawStateText = function (context, state) {
        var xPlacement = 5, yPlacement = 5;
        if (this.align === "center") {
            xPlacement = this.width / 2;
        } else if (this.align === "right") {
            xPlacement = this.width - 5;
        }
        context.textBaseline = "top";
        if(this.vertical === "middle") {
            context.textBaseline = "middle";
            yPlacement = this.height / 2;
        } else if(this.vertical === "bottom") {
            context.textBaseline = "bottom";
            yPlacement = this.height;
        }

        context.font = this.font;
        context.textAlign = this.align;

        context.fillStyle = config[state] ? config[state].font || this.default[state].font : this.default[state].font;
        context.fillText(this.text, xPlacement, yPlacement);
    };

    /**
     * Function called whenever canvas for specific state should be redrawn
     * @param {string} [state=undefined] - state which should be redrawn
     */
    this.redrawState = function (state) {
        state = state || this.state;
        var context = this.canvas[state].getContext('2d'), x;
        context.clearRect(0, 0, this.width, this.height);

        if (config[state] && config[state].fn) {
            config[state].fn.call(this, context);
        } else {
            this.redrawStateField(context, state);
        }

        this.redrawStateText(context, state);
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
CM.Element.prototype.destroy = function () {};/**
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


CM.Example = function(config) {
    CM.Element.call(this, config);
};

CM.Example.prototype = Object.create(CM.Element.prototype);
CM.Example.prototype.constructor = CM.Example;/**
 * Created by claim on 19.02.16.
 */


CM.LAYOUTS = {
    "left": "left",
    "right": "right",
    "double_inner": "double_inner",
    "double_outer": "double_outer",
    "double_left": "double_left",
    "double_right": "double_right"
};

/**
 *
 * @param config
 * @param {string} config.name - name of the multiple selector
 * @param {string} [config.vertical="top"] - text alignment of element
 * @param {string} [config.font='30pt Arial'] - font property inputted directly into canvas.context.font property
 * @param {number} [config.offsetY=100] - y axis offset for which Multiple starts drawing Switch boxes
 * @param {string} [config.layout="left"] - layout for the buttons (from CM.LAYOUTS options)
 * @param {array} config.elements - Switch properties for individual created elements
 * @param {object} config.template - Switch properties copied to every single Switch constructor
 * @constructor
 */
CM.Multiple = function (config) {
    CM.Element.call(this, config);
    this.font = config.font || "30pt Arial";
    this.vertical = config.vertical || "top";
    this.elements = [];
    this.offsetY = config.offsetY || 100;
    this.layout = config.layout || CM.LAYOUTS.left;

    //Gets template for used switches + layout coordinates
    //  width, height, font, on - this is passed
    //  for individual checkboxes: names, values,

    //Just when menu is set, it adds all of the checkboxes to the menu (it's not responsible for the checkbox listeners)
    //Can redraw the inside of itself (so it should extend element also, but it doesn't have any states, just one
    //Add new listener - on statechange
    //Set listeners to enter and leave

    this.loadElements = function (array, offset, align) {
        var i;

        for (i = 0; i < array.length; i += 1) {
            this.elements.push(new CM.Switch({
                "x": offset + this.x,
                "y": this.offsetY + this.y - 5 + (5 + config.template.height) * i,
                "width": config.template.width,
                "height": config.template.height,
                "text": array[i].text,
                "name": array[i].name,
                "value": array[i].value,
                "on": config.template.on,
                "align": align,
                "off": config.template.off
            }));
        }
    };

    this.init = function () {
        if (config.elements) {
            if (this.layout === CM.LAYOUTS.left || this.layout === CM.LAYOUTS.right) {
                this.loadElements(config.elements, this.width / 2 - config.template.width / 2, this.layout);
            } else {
                var offsetX, leftSide;
                offsetX = this.width / 4 - config.template.width / 2;
                leftSide = config.elements.splice(0, Math.round(config.elements.length / 2));
                if (this.layout === CM.LAYOUTS.double_inner || this.layout === CM.LAYOUTS.double_left) {
                    this.loadElements(leftSide, offsetX, "left");
                } else {
                    this.loadElements(leftSide, offsetX, "right");
                }

                if (this.layout === CM.LAYOUTS.double_outer || this.layout === CM.LAYOUTS.double_left) {
                    this.loadElements(config.elements, offsetX + this.width / 2, "left");
                } else {
                    this.loadElements(config.elements, offsetX + this.width / 2, "right");
                }
            }
        }
    };

    this.init();

    this.redrawStateField = function (context, state) {
        context.strokeWidth = 2;
        context.strokeStyle = "white";
        context.strokeRect(0, 0, this.width, this.height);
    };

    this.redrawState();
};

CM.Multiple.prototype = Object.create(CM.Element.prototype);
CM.Multiple.prototype.constructor = CM.Multiple;

CM.Multiple.prototype.setMenu = function (menu) {
    var i;
    this.menu = menu;
    for (i = 0; i < this.elements.length; i += 1) {
        this.menu.add(this.elements[i]);
    }
};

/**
 * Returns element value (if any is set)
 * @returns {undefined|*}
 */
CM.Multiple.prototype.getValue = function () {
    var i, toReturn = {};
    for (i = 0 ; i < this.elements.length; i += 1) {
        toReturn[this.elements[i].name] = this.elements[i].getFormattedValue()[this.elements[i].name];
    }
    return toReturn;
};

/**
 * Returns element value wrapped in object (keyed by element name). If no name is set, returns undefined
 * @returns {*}
 */
CM.Multiple.prototype.getFormattedValue = function () {
    var toReturn = {};
    if (this.name) {
        toReturn[this.name] = this.getValue();
    } else {
        return undefined;
    }
    return toReturn;
};/**
 * Created by claim on 18.02.16.
 */


CM.Radio = function (config) {
    CM.Multiple.call(this, config);
};

CM.Radio.prototype = Object.create(CM.Multiple.prototype);
CM.Radio.prototype.constructor = CM.Radio;/**
 * Created by claim on 10.02.16.
 */


CM.SWITCH_STATE = {
    "on": "on",
    "off": "off"
};

/**
 *
 * @param {object} config - configuration for the element
 * @param {boolean} config.value - value of the switch
 * @param {string} config.name - name of the switch
 * @constructor
 */
CM.Switch = function(config) {
    CM.Element.call(this, config);

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


    this.redrawStateField = function (context, state) {
        var x;
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