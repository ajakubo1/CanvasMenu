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
    this.focused = undefined;
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
        if (self.focused !== undefined) {
            var x =  (event.pageX - this.offsetLeft) / self.scaleX, y = (event.pageY - this.offsetTop) / self.scaleY;
            self.focused.trigger(CM.EVENTS.mousedown, x, y);
        }
    };

    /**
     * Listens to mousemove event on canvas, sets-up focused element, removes focus from element, triggers
     * mouseleave, mouseenter and mousemove events on focused element
     * @param event
     */
    this.listener_mousemove = function (event) {
        var i, x =  (event.pageX - this.offsetLeft) / self.scaleX, y = (event.pageY - this.offsetTop) / self.scaleY;

        if (self.focused !== undefined) {
            if (!self.focused.inRange(x, y)) {
                self.focused.trigger(CM.EVENTS.mouseleave, x, y);
                self.focused = undefined;
            } else {
                self.focused.trigger(CM.EVENTS.mousemove, x, y);
            }
        } else {
            for (i = 0; i < self.elements.length; i += 1) {
                if (self.elements[i].inRange(x, y)) {
                    self.focused = self.elements[i];
                    self.focused.trigger(CM.EVENTS.mouseenter, x, y);
                    break;
                }
            }
        }
    };

    /**
     * Listens to mouseup event on canvas, triggers mouseup event on focused element
     * @param event
     */
    this.listener_mouseup = function (event) {
        if (self.focused !== undefined) {
            var x =  (event.pageX - this.offsetLeft) / self.scaleX, y = (event.pageY - this.offsetTop) / self.scaleY;
            self.focused.trigger(CM.EVENTS.mouseup, x, y);
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
};