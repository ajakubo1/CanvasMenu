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
};