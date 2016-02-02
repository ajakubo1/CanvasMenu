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

    this.redrawState = function (state) {
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

    this.redrawState();
    this.redrawState(CM.ELEMENT_STATES.over);
    this.redrawState(CM.ELEMENT_STATES.down);
    this.redrawState(CM.ELEMENT_STATES.up);
    
    this.enterListener = function (event) {
        this.menu.canvas.style.cursor = 'pointer';
        this.state = CM.ELEMENT_STATES.over;
        this.menu.forceRedraw();
    };

    this.leaveListener = function (event) {
        this.menu.canvas.style.cursor = '';
        this.state = CM.ELEMENT_STATES.idle;
        this.menu.forceRedraw();
    };

    this.upListener = function (event) {
        this.state = CM.ELEMENT_STATES.up;
        this.menu.forceRedraw();
    };

    this.downListener = function (event) {
        this.state = CM.ELEMENT_STATES.down;
        this.menu.forceRedraw();
    };

    this.moveListener = function (event) {
        if (this.state === CM.ELEMENT_STATES.up) {
            this.state = CM.ELEMENT_STATES.over;
            this.menu.forceRedraw();
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

CM.Element.prototype.destroy = function () {
    this.state = CM.ELEMENT_STATES.idle;
};

CM.Element.prototype.update = function (newTick) {
    this.tick = newTick;
    this.redrawState();
};
