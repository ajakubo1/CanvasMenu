
/**
 *
 * @param {object} config - configuration for the button
 * Mandatory:
 * @param {DOM object} config.canvas - x coordinate for button
 * @param {number} config.width - y coordinate for button
 * @param {number} config.height - width for button
 *
 * @param {number} [config.tickMax=Number.MAX_VALUE] - change the amount of time for which tick will be rotated
 * @param {functon} [config.animation=undefined] - menu animation function
 * @param {boolean} [config.autorescale=false] - let the menu scale automatically (from css transform)
 *
 * @constructor
 *
 */
function Menu(config) {
	var self = this;
	this.buttons = [];
	this.canvas = config.canvas;
	this.width = config.width;
	this.height = config.height;
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
			self.swapButtonState(BUTTON_ENUM.down);
			self.focused.redrawBackground(self.tickCount);
		}
	};

	this.listener_mousemove = function (event) {
		var i, x =  (event.pageX - this.offsetLeft) / self.scaleX, y = (event.pageY - this.offsetTop) / self.scaleY;

		if (self.focused !== undefined) {
			if (!self.focused.inRange(x, y)) {
				self.swapButtonState(BUTTON_ENUM.inactive);
				self.focused = undefined;
			}
		}

		for (i = 0; i < self.buttons.length; i += 1) {
			if (self.buttons[i].inRange(x, y)) {
				self.focused = self.buttons[i];
				self.swapButtonState(BUTTON_ENUM.focused);
				break;
			}
		}
	};

	this.listener_mouseup = function (event) {
		var x =  (event.pageX - this.offsetLeft) / self.scaleX, y = (event.pageY - this.offsetTop) / self.scaleY;
		if (self.focused !== undefined && self.focused.inRange(x, y)) {
			self.swapButtonState(BUTTON_ENUM.up);
			self.focused.redrawBackground(self.tickCount);
			self.focused.click();
		}
	};

	this.swapButtonState = function (newState) {
		self.focused.setState(newState);
		if(!self.animated) {
			self.redrawButtons();
		}
	};

	this.redrawButtons = function () {
		var i;

		if (this.animated) {
			this.redrawBackground();
		} else {
			this.ctx.clearRect(0, 0, this.width, this.height);
		}
		for (i = 0; i < this.buttons.length; i += 1) {
			this.ctx.drawImage(this.buttons[i].getCanvas(), this.buttons[i].getX(), this.buttons[i].getY());
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

		if (!transform) {
			return;
		}

		values = transform.split('(')[1];
		values = values.split(')')[0];
		values = values.split(',');
		self.scaleX = values[0];
		self.scaleY = values[3];
	};

	this.redrawBackground = config.animation;

	this.run = function (frameTime) {
		if (self.running) {
			var tickCount = Math.floor((frameTime - self.updateTime) / self.tickLength), i;
	        if (tickCount > 0) {

				self.updateTime += tickCount * self.tickLength;

				self.tickCount += tickCount;

				if(self.tickCount > self.tickMax) {
					self.tickCount = 0;
				}

				for (i = 0; i < self.buttons.length; i += 1) {
					self.buttons[i].redrawBackground(self.tickCount);
				}

				self.redrawButtons();
	        }
			window.requestAnimationFrame(self.run);
		}
	};
}

Menu.prototype.isVisible = function () {
	return this.running;
};

Menu.prototype.init = function () {
	this.canvas.addEventListener('mouseup', this.listener_mouseup);
	this.canvas.addEventListener('mousedown', this.listener_mousedown);
	this.canvas.addEventListener('mousemove', this.listener_mousemove);
	this.redrawButtons();
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

Menu.prototype.destroy = function () {
	var i;

	this.canvas.removeEventListener('mouseup', this.listener_mouseup);
	this.canvas.removeEventListener('mousedown', this.listener_mousedown);
	this.canvas.removeEventListener('mousemove', this.listener_mousemove);

	if (this.autorescale) {
		window.removeEventListener('resize', this.rescale);
	}

	for (i = 0; i < this.buttons.length; i += 1) {
		this.buttons[i].setState(BUTTON_ENUM.inactive);
		this.redrawButtons();
	}

	this.running = false;
};

Menu.prototype.appendButton = function (button) {
	this.buttons.push(button);
	button.setParentMenu(this);
};

Menu.prototype.updateScale = function (scale) {
	this.scaleX = scale;
	this.scaleY = scale;
};

Menu.prototype.updateScaleX = function (scale) {
	this.scaleX = scale;
};

Menu.prototype.updateScaleY = function (scale) {
	this.scaleY = scale;
};

var BUTTON_ENUM = {
	"inactive": 0,
	"focused": 1,
	"down": 2,
	"up": 3
};

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
function Button(config) {
	this.x = config.x;
	this.y = config.y;
	this.width = config.width;
	this.height = config.height;
	this.x_limit = this.x + this.width;
	this.y_limit = this.y + this.height;
	this.state = BUTTON_ENUM.inactive;
	this.tick = 0;
	this.text = config.text;
	this.font = config.font || (this.height * 3 / 5 ) + 'pt Arial';

	this.init_canvas = function () {
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		return canvas;
	};

	this.canvas_inactive = this.init_canvas();
	this.canvas_focused = this.init_canvas();
	this.canvas_down = this.init_canvas();
	this.canvas_up = this.init_canvas();

	this.redraw = function () {
		if (this.state === BUTTON_ENUM.inactive) {
			this.redrawInactive();
		} else if (this.state === BUTTON_ENUM.focused) {
			this.redrawFocused();
		} else if (this.state === BUTTON_ENUM.down) {
			this.redrawDown();
		} else if (this.state === BUTTON_ENUM.up) {
			this.redrawUp();
		}
	};

	this.redraw_button = function (ctx, redrawFunction, fill, fontFill) {
		ctx.clearRect(0, 0, this.width, this.height);

		if (redrawFunction) {
			redrawFunction.call(this, ctx);
		} else {
			ctx.fillStyle = fill;
			ctx.fillRect(0, 0, this.width, this.height);
		}

		ctx.font = this.font;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = fontFill;
		ctx.fillText(this.text, this.width / 2, this.height / 2);
	};

	this.redrawInactive = function () {
		this.redraw_button(this.canvas_inactive.getContext('2d'), config.redrawInactive,
				config.redrawInactiveColor || "green", config.redrawInactiveFont || "white");
	};

	this.redrawInactive();

	this.redrawFocused = function () {
		this.redraw_button(this.canvas_focused.getContext('2d'), config.redrawFocused,
				config.redrawFocusedColor || "blue", config.redrawFocusedFont || "white");
	};

	this.redrawFocused();

	this.redrawDown = function () {
		this.redraw_button(this.canvas_down.getContext('2d'), config.redrawDown,
				config.redrawDownColor || "red", config.redrawDownFont || "white");
	};

	this.redrawDown();

	this.redrawUp = function () {
		this.redraw_button(this.canvas_up.getContext('2d'), config.redrawUp,
				config.redrawUpColor || "orange", config.redrawUpFont || "white");
	};

	this.redrawUp();
}

Button.prototype.inRange = function (x, y) {
	if (x >= this.x && x <= this.x_limit && y >= this.y && y <= this.y_limit) {
		return true;
	}
	return false;
};

Button.prototype.setState = function (newState) {
	var menuCanvas = this.menu.canvas;

	// If the button state is changed to 'focused', when means
	// the button is in the 'hover' state...
	if (newState === BUTTON_ENUM.focused) {
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

Button.prototype.redrawBackground = function (step) {
	this.tick = step;
	this.redraw();
};

Button.prototype.getCanvas = function () {
	if (this.state === BUTTON_ENUM.inactive) {
		return this.canvas_inactive;
	} else if (this.state === BUTTON_ENUM.focused) {
		return this.canvas_focused;
	} else if (this.state === BUTTON_ENUM.down) {
		return this.canvas_down;
	} else if (this.state === BUTTON_ENUM.up) {
		return this.canvas_up;
	}
};

Button.prototype.getX = function () {
	return this.x;
};

Button.prototype.getY = function () {
	return this.y;
};

Button.prototype.setParentMenu = function (menu) {
	this.menu = menu;
};

Button.prototype.clickHandler = function (handler) {
	this.onclick = handler;
};

Button.prototype.click = function () {
	if (this.onclick instanceof Menu) {
		this.menu.destroy();
		this.onclick.init();
	} else {
		if(this.onclick !== undefined) {
			this.onclick.call();
		}
	}
};
