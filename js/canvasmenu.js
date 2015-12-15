
function Menu(canvas, width, height, animated, animation) {
	var self = this;
	this.buttons = [];
	this.canvas = canvas;
	this.width = width;
	this.height = height;
	this.canvas.width = width;
	this.canvas.height = height;
	this.ctx = canvas.getContext('2d');
	this.scaleX = 1;
	this.scaleY = 1;
	this.focused = undefined;
	this.animated = animated || false;
	this.running = false;
	this.updateTime = undefined;
	this.tickLength = 16.66666666;
	this.tickCount = 0;
	this.tickMax = 60;

	this.listener_mousedown = function (event) {
		var i, x = event.pageX * self.scaleX - this.offsetLeft, y = event.pageY * self.scaleY - this.offsetTop;

		if (self.focused.inRange(x, y)) {
			self.focused.setState(BUTTON_ENUM.down);
			self.focused.redrawBackground(self.tickCount);
			if(!animated) {
				self.redrawButtons();
			}
		}
	};

	this.listener_mousemove = function (event) {
		var i, x = event.pageX * self.scaleX - this.offsetLeft, y = event.pageY * self.scaleY - this.offsetTop;

		if (self.focused !== undefined) {
			if (!self.focused.inRange(x, y)) {
				self.focused.setState(BUTTON_ENUM.inactive);
				self.focused = undefined;
				if(!animated) {
					self.redrawButtons();
				}
				//
			}
		}

		for (i = 0; i < self.buttons.length; i += 1) {
			if (self.buttons[i].inRange(x, y)) {
				self.focused = self.buttons[i];
				self.buttons[i].setState(BUTTON_ENUM.focused);
				if(!animated) {
					self.redrawButtons();
				}
				break;
			}
		}
	};

	this.listener_mouseup = function (event) {
		var i, x = event.pageX * self.scaleX - this.offsetLeft, y = event.pageY * self.scaleY - this.offsetTop;
		if (self.focused.inRange(x, y)) {
			self.focused.setState(BUTTON_ENUM.up);
			if(!animated) {
				self.redrawButtons();
			}
			self.focused.click();
			self.focused.redrawBackground(self.tickCount);
		}
	};

	this.redrawButtons = function () {
		var i;

		if (this.animated) {
			this.redrawBackground();
		} else {
			this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		for (i = 0; i < this.buttons.length; i += 1) {
			this.ctx.drawImage(this.buttons[i].getCanvas(), this.buttons[i].getX(), this.buttons[i].getY());
		}
	};

	this.redrawBackground = animation;

	this.run = function (frameTime) {
		if (self.running) {
			var tickCount = Math.floor((frameTime - self.updateTime) / self.tickLength), i;
	        if (tickCount > 0) {
	            /*logic(tickCount);
	            render();*/

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

Menu.prototype.init = function () {
	this.canvas.addEventListener('mouseup', this.listener_mouseup);
	this.canvas.addEventListener('mousedown', this.listener_mousedown);
	this.canvas.addEventListener('mousemove', this.listener_mousemove);
	this.redrawButtons();
	this.running = true;

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

var BUTTON_ENUM = {
	"inactive": 0,
	"focused": 1,
	"down": 2,
	"up": 3
};

function Button(x, y, width, height, text, redrawInactive, redrawFocused, redrawDown, redrawUp) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.x_limit = this.x + this.width;
	this.y_limit = this.y + this.height;
	this.state = BUTTON_ENUM.inactive;
	this.canvas_inactive = document.createElement('canvas');
	this.canvas_inactive.width = width;
	this.canvas_inactive.height = height;
	this.tick = 0;
	this.text = text;

	this.canvas_focused = document.createElement('canvas');
	this.canvas_focused.width = width;
	this.canvas_focused.height = height;

	this.canvas_down = document.createElement('canvas');
	this.canvas_down.width = width;
	this.canvas_down.height = height;

	this.canvas_up = document.createElement('canvas');
	this.canvas_up.width = width;
	this.canvas_up.height = height;

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

	this.redrawInactive = redrawInactive || function () {
		var ctx = this.canvas_inactive.getContext('2d');
		ctx.clearRect(0, 0, this.width, this.height);
		ctx.fillStyle = 'rgb(' + (100 - this.tick) + ', 0, 0)';
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.font = '30pt Arial';
		ctx.textAlign="center";
		ctx.fillStyle = "white";
		ctx.fillText(text, this.width / 2, (this.height - 30) / 2 + 30);
	};

	this.redrawInactive();

	this.redrawFocused = redrawFocused || function () {
		var ctx = this.canvas_focused.getContext('2d');
		ctx.clearRect(0, 0, this.width, this.height);
		ctx.fillStyle = "blue";
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.font = '30pt Arial';
		ctx.textAlign="center";
		ctx.fillStyle = "white";
		ctx.fillText(text, this.width / 2, (this.height - 30) / 2 + 30);
	};

	this.redrawFocused();

	this.redrawDown = redrawDown || function () {
		var ctx = this.canvas_down.getContext('2d');
		ctx.clearRect(0, 0, this.width, this.height);
		ctx.fillStyle = "red";
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.font = '30pt Arial';
		ctx.textAlign="center";
		ctx.fillStyle = "white";
		ctx.fillText(text, this.width / 2, (this.height - 30) / 2 + 30);
	};

	this.redrawDown();

	this.redrawUp = redrawUp || function () {
		var ctx = this.canvas_up.getContext('2d');
		ctx.clearRect(0, 0, this.width, this.height);
		ctx.fillStyle = "orange";
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.font = '30pt Arial';
		ctx.textAlign="center";
		ctx.fillStyle = "black";
		ctx.fillText(text, this.width / 2, (this.height - 30) / 2 + 30);
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
